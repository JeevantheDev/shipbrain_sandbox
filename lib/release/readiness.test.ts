import { getReleaseReadiness } from './readiness';
import { OverallStatus, CheckStatus } from './types';

describe('getReleaseReadiness', () => {
  const repo = 'test/repo';

  it('should return READY status for a clean branch (e.g., main)', () => {
    const branch = 'main';
    const result = getReleaseReadiness(repo, branch);

    expect(result.repo).toBe(repo);
    expect(result.branch).toBe(branch);
    expect(result.status).toBe(OverallStatus.READY);
    expect(result.checks).toHaveLength(3);
    expect(result.checks.every(check => check.status === CheckStatus.PASSED)).toBe(true);
  });

  it('should return BLOCKED status if CI pipeline fails', () => {
    const branch = 'feature/fix/ci-fail';
    const result = getReleaseReadiness(repo, branch);

    expect(result.status).toBe(OverallStatus.BLOCKED);
    expect(result.checks).toContainEqual(
      expect.objectContaining({ name: 'CI Pipeline Status', status: CheckStatus.FAILED })
    );
  });

  it('should return BLOCKED status if there are open incidents', () => {
    const branch = 'feature/blocked-by-incident';
    const result = getReleaseReadiness(repo, branch);

    expect(result.status).toBe(OverallStatus.BLOCKED);
    expect(result.checks).toContainEqual(
      expect.objectContaining({ name: 'Open Incidents', status: CheckStatus.FAILED })
    );
  });

  it('should return NEEDS_REVIEW status if there are pending approvals', () => {
    const branch = 'feature/needs-review-pr';
    const result = getReleaseReadiness(repo, branch);

    expect(result.status).toBe(OverallStatus.NEEDS_REVIEW);
    expect(result.checks).toContainEqual(
      expect.objectContaining({ name: 'Approval Gates', status: CheckStatus.PENDING })
    );
  });

  it('should prioritize BLOCKED over NEEDS_REVIEW if both conditions exist', () => {
    const branch = 'feature/blocked-by-incident-and-needs-review-pr';
    const result = getReleaseReadiness(repo, branch);

    expect(result.status).toBe(OverallStatus.BLOCKED);
    expect(result.checks).toContainEqual(
      expect.objectContaining({ name: 'Open Incidents', status: CheckStatus.FAILED })
    );
    expect(result.checks).toContainEqual(
      expect.objectContaining({ name: 'Approval Gates', status: CheckStatus.PENDING })
    );
  });

  it('should return READY for an unknown branch pattern if no blocking/pending conditions met', () => {
    const branch = 'feature/new-feature-branch';
    const result = getReleaseReadiness(repo, branch);

    expect(result.status).toBe(OverallStatus.READY);
    expect(result.checks.every(check => check.status === CheckStatus.PASSED)).toBe(true);
  });
});
