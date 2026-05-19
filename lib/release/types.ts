export enum OverallStatus {
  READY = 'ready',
  BLOCKED = 'blocked',
  NEEDS_REVIEW = 'needs_review',
}

export enum CheckStatus {
  PASSED = 'passed',
  FAILED = 'failed',
  PENDING = 'pending',
  NOT_APPLICABLE = 'not_applicable',
}

export interface Check {
  name: string;
  status: CheckStatus;
  message?: string;
  details?: string;
}

export interface ReleaseReadinessResponse {
  branch: string;
  repo: string;
  status: OverallStatus;
  checks: Check[];
}
