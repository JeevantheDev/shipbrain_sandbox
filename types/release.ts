export enum ReleaseReadinessStatus {
  READY = 'ready',
  BLOCKED = 'blocked',
  NEEDS_REVIEW = 'needs_review',
}

export enum CheckStatus {
  PASS = 'pass',
  FAIL = 'fail',
  PENDING = 'pending',
  UNKNOWN = 'unknown',
}

export interface CheckResult {
  name: string;
  status: CheckStatus;
  message?: string;
  detailsUrl?: string;
}

export interface ReleaseReadinessResponse {
  repo: string;
  branch: string;
  overallStatus: ReleaseReadinessStatus;
  checks: CheckResult[];
  timestamp: string;
}