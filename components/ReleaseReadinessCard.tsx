"use client";

import React, { useState, useEffect } from 'react';
import { ReleaseReadinessResponse, OverallStatus, CheckStatus } from '@/lib/release/types';

interface ReleaseReadinessCardProps {
  repo: string;
  branch: string;
}

const statusColors: Record<OverallStatus, string> = {
  [OverallStatus.READY]: 'bg-green-100 text-green-800',
  [OverallStatus.BLOCKED]: 'bg-red-100 text-red-800',
  [OverallStatus.NEEDS_REVIEW]: 'bg-yellow-100 text-yellow-800',
};

const checkStatusColors: Record<CheckStatus, string> = {
  [CheckStatus.PASSED]: 'text-green-600',
  [CheckStatus.FAILED]: 'text-red-600',
  [CheckStatus.PENDING]: 'text-yellow-600',
  [CheckStatus.NOT_APPLICABLE]: 'text-gray-500',
};

const ReleaseReadinessCard: React.FC<ReleaseReadinessCardProps> = ({ repo, branch }) => {
  const [readiness, setReadiness] = useState<ReleaseReadinessResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReadiness = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/release-readiness?repo=${repo}&branch=${branch}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch readiness data');
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
    return (
      <div className="p-4 border rounded-lg shadow-sm bg-white animate-pulse">
        <p className="font-semibold text-lg">Loading Release Readiness...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border rounded-lg shadow-sm bg-red-50 text-red-700">
        <p className="font-semibold text-lg">Error: {error}</p>
      </div>
    );
  }

  if (!readiness) {
    return (
      <div className="p-4 border rounded-lg shadow-sm bg-gray-50 text-gray-700">
        <p className="font-semibold text-lg">No readiness data available.</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white max-w-sm">
      <h3 className="font-bold text-xl mb-2">Release Readiness</h3>
      <p className="text-sm text-gray-600 mb-1">Branch: <span className="font-medium text-gray-800">{readiness.branch}</span></p>
      <p className="text-sm text-gray-600 mb-3">Repo: <span className="font-medium text-gray-800">{readiness.repo}</span></p>
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${statusColors[readiness.status]} mb-4`}>
        Status: {readiness.status.replace(/_/g, ' ').toUpperCase()}
      </div>
      <ul className="space-y-2">
        {readiness.checks.map((check, index) => (
          <li key={index} className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">{check.name}:</span>
            <span className={`font-semibold ${checkStatusColors[check.status]}`}>
              {check.status.replace(/_/g, ' ').toUpperCase()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReleaseReadinessCard;
