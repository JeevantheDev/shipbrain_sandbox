import { ReleaseStatus, CheckStatus, ReleaseCheck, ReleaseReadinessResponse } from './types';

// Simulate external integration data based on branch name
const simulateCiStatus = (branch: string): CheckStatus => {
  if (branch.includes('blocked-ci')) return CheckStatus.Fail;
  if (branch.includes('pending-ci')) return CheckStatus.Pending;
  return CheckStatus.Pass;
};

const simulateIncidents = (branch: string): CheckStatus => {
  if (branch.includes('incident')) return CheckStatus.Fail;
  return CheckStatus.Pass;
};

const simulateApprovals = (branch: string): CheckStatus => {
  if (branch.includes('pending-review')) return CheckStatus.Pending;
  return CheckStatus.Pass;
};

export async function getReleaseReadiness(repo: string, branch: string): Promise<ReleaseReadinessResponse> {
  const ciStatus = simulateCiStatus(branch);
  const incidentStatus = simulateIncidents(branch);
  const approvalStatus = simulateApprovals(branch);

  const checks: ReleaseCheck[] = [
    { name: 'CI Pipeline', status: ciStatus, details: `CI for ${branch} is ${ciStatus}` },
    { name: 'Open Incidents', status: incidentStatus, details: `No open incidents affecting ${branch}` },
    { name: 'Approval Gates', status: approvalStatus, details: `Approvals for ${branch} are ${approvalStatus}` },
  ];

  let overallStatus: ReleaseStatus = ReleaseStatus.Ready;

  if (checks.some(check => check.status === CheckStatus.Fail)) {
    overallStatus = ReleaseStatus.Blocked;
  } else if (checks.some(check => check.status === CheckStatus.Pending)) {
    overallStatus = ReleaseStatus.NeedsReview;
  }

  return {
    repo,
    branch,
    status: overallStatus,
    checks,
    generatedAt: new Date().toISOString(),
  };
}
