export enum ReleaseStatus {
  Ready = 'ready',
  Blocked = 'blocked',
  NeedsReview = 'needs_review',
}

export enum CheckStatus {
  Pass = 'pass',
  Fail = 'fail',
  Pending = 'pending',
  NotApplicable = 'not_applicable',
}

export interface ReleaseCheck {
  name: string;
  status: CheckStatus;
  details?: string;
}

export interface ReleaseReadinessResponse {
  repo: string;
  branch: string;
  status: ReleaseStatus;
  checks: ReleaseCheck[];
  generatedAt: string;
}
