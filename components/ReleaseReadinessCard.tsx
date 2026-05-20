import React from 'react';
import { ReleaseReadinessResponse, ReleaseReadinessStatus, CheckStatus } from '@/types/release';

interface ReleaseReadinessCardProps {
  readiness: ReleaseReadinessResponse;
}

const statusColors = {
  [ReleaseReadinessStatus.READY]: 'bg-green-100 text-green-800',
  [ReleaseReadinessStatus.BLOCKED]: 'bg-red-100 text-red-800',
  [ReleaseReadinessStatus.NEEDS_REVIEW]: 'bg-yellow-100 text-yellow-800',
};

const checkStatusColors = {
  [CheckStatus.PASS]: 'text-green-600',
  [CheckStatus.FAIL]: 'text-red-600',
  [CheckStatus.PENDING]: 'text-yellow-600',
  [CheckStatus.UNKNOWN]: 'text-gray-600',
};

const ReleaseReadinessCard: React.FC<ReleaseReadinessCardProps> = ({ readiness }) => {
  const { repo, branch, overallStatus, checks, timestamp } = readiness;

  return (
    <div className="border rounded-lg shadow-sm p-4 bg-white">
      <h3 className="text-lg font-semibold mb-2">Release Readiness</h3>
      <div className="text-sm text-gray-600 mb-3">
        <p><strong>Repo:</strong> {repo}</p>
        <p><strong>Branch:</strong> {branch}</p>
        <p>
          <strong>Status:</strong>{' '}
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[overallStatus]}`}>
            {overallStatus.replace('_', ' ').toUpperCase()}
          </span>
        </p>
      </div>

      <ul className="space-y-2">
        {checks.map((check, index) => (
          <li key={index} className="flex items-center justify-between text-sm">
            <span>{check.name}</span>
            <span className={`font-medium ${checkStatusColors[check.status]}`}>
              {check.status.toUpperCase()}
            </span>
          </li>
        ))}
      </ul>

      <p className="text-xs text-gray-400 mt-4">Last updated: {new Date(timestamp).toLocaleString()}</p>
    </div>
  );
};

export default ReleaseReadinessCard;