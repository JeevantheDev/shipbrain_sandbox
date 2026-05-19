'use client';

import React, { useState, useEffect } from 'react';
import { ReleaseReadinessResponse, ReleaseStatus, CheckStatus } from '@/lib/release/types';

interface ReleaseReadinessCardProps {
  repo: string;
  branch: string;
}

const statusColors: Record<ReleaseStatus, string> = {
  [ReleaseStatus.Ready]: 'bg-green-100 text-green-800',
  [ReleaseStatus.Blocked]: 'bg-red-100 text-red-800',
  [ReleaseStatus.NeedsReview]: 'bg-yellow-100 text-yellow-800',
};

const checkStatusIcons: Record<CheckStatus, string> = {
  [CheckStatus.Pass]: '✅',
  [CheckStatus.Fail]: '❌',
  [CheckStatus.Pending]: '⏳',
  [CheckStatus.NotApplicable]: '➖',
};

export const ReleaseReadinessCard: React.FC<ReleaseReadinessCardProps> = ({ repo, branch }) => {
  const [readiness, setReadiness] = useState<ReleaseReadinessResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReadiness = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/release-readiness?repo=${repo}&branch=${branch}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch release readiness');
        }
        const data: ReleaseReadinessResponse = await response.json();
        setReadiness(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReadiness();
  }, [repo, branch]);

  if (loading) {
    return <div className="p-4 border rounded-lg shadow-sm">Loading release readiness...</div>;
  }

  if (error) {
    return <div className="p-4 border rounded-lg shadow-sm bg-red-50 text-red-700">Error: {error}</div>;
  }

  if (!readiness) {
    return <div className="p-4 border rounded-lg shadow-sm">No readiness data available.</div>;
  }

  const statusClass = statusColors[readiness.status] || 'bg-gray-100 text-gray-800';

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white max-w-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Release Readiness</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
          {readiness.status.replace(/_/g, ' ')}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-3">
        <span className="font-medium">Branch:</span> {readiness.branch}
      </p>
      <ul className="space-y-1 text-sm">
        {readiness.checks.map((check, index) => (
          <li key={index} className="flex items-center">
            <span className="mr-2">{checkStatusIcons[check.status]}</span>
            <span>{check.name}: {check.status.replace(/_/g, ' ')}</span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-gray-500 mt-3">
        Last updated: {new Date(readiness.generatedAt).toLocaleTimeString()}
      </p>
    </div>
  );
};
