import { ReleaseReadinessResponse, OverallStatus, Check, CheckStatus } from './types';

export function getReleaseReadiness(repo: string, branch: string): ReleaseReadinessResponse {
  const checks: Check[] = [];
  let overallStatus: OverallStatus = OverallStatus.READY;

  // Simulate CI status
  const ciStatus = branch.includes('fix/ci-fail') ? CheckStatus.FAILED : CheckStatus.PASSED;
  checks.push({
    name: 'CI Pipeline Status',
    status: ciStatus,
    message: ciStatus === CheckStatus.FAILED ? 'CI pipeline failed' : 'CI pipeline passed',
  });

  // Simulate Open Incidents
  const incidentStatus = branch.includes('blocked-by-incident') ? CheckStatus.FAILED : CheckStatus.PASSED;
  checks.push({
    name: 'Open Incidents',
    status: incidentStatus,
    message: incidentStatus === CheckStatus.FAILED ? 'Active incidents detected' : 'No active incidents',
  });

  // Simulate Pending Approval Gates
  const approvalStatus = branch.includes('needs-review-pr') ? CheckStatus.PENDING : CheckStatus.PASSED;
  checks.push({
    name: 'Approval Gates',
    status: approvalStatus,
    message: approvalStatus === CheckStatus.PENDING ? 'Pending PR approvals' : 'All approvals granted',
  });

  // Determine overall status
  if (checks.some(check => check.status === CheckStatus.FAILED)) {
    overallStatus = OverallStatus.BLOCKED;
  } else if (checks.some(check => check.status === CheckStatus.PENDING)) {
    overallStatus = OverallStatus.NEEDS_REVIEW;
  } else {
    overallStatus = OverallStatus.READY;
  }

  return {
    repo,
    branch,
    status: overallStatus,
    checks,
  };
}
