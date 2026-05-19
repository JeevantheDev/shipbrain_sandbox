import { getReleaseReadiness } from './readiness';
import { ReleaseStatus, CheckStatus } from './types';

describe('getReleaseReadiness', () => {
  const repo = 'JeevantheDev/shipbrain_sandbox';

  it('should return READY when all checks pass', async () => {
    const branch = 'main';
    const readiness = await getReleaseReadiness(repo, branch);

    expect(readiness.repo).toBe(repo);
    expect(readiness.branch).toBe(branch);
    expect(readiness.status).toBe(ReleaseStatus.Ready);
    expect(readiness.checks).toHaveLength(3);
    expect(readiness.checks.every(check => check.status === CheckStatus.Pass)).toBe(true);
    expect(readiness.generatedAt).toBeDefined();
  });

  it('should return BLOCKED when CI fails', async () => {
    const branch = 'feature/blocked-ci';
    const readiness = await getReleaseReadiness(repo, branch);

    expect(readiness.status).toBe(ReleaseStatus.Blocked);
    expect(readiness.checks.find(c => c.name === 'CI Pipeline')?.status).toBe(CheckStatus.Fail);
  });

  it('should return BLOCKED when an incident is open', async () => {
    const branch = 'feature/incident';
    const readiness = await getReleaseReadiness(repo, branch);

    expect(readiness.status).toBe(ReleaseStatus.Blocked);
    expect(readiness.checks.find(c => c.name === 'Open Incidents')?.status).toBe(CheckStatus.Fail);
  });

  it('should return NEEDS_REVIEW when approvals are pending', async () => {
    const branch = 'feature/pending-review';
    const readiness = await getReleaseReadiness(repo, branch);

    expect(readiness.status).toBe(ReleaseStatus.NeedsReview);
    expect(readiness.checks.find(c => c.name === 'Approval Gates')?.status).toBe(CheckStatus.Pending);
  });

  it('should return NEEDS_REVIEW when CI is pending', async () => {
    const branch = 'feature/pending-ci';
    const readiness = await getReleaseReadiness(repo, branch);

    expect(readiness.status).toBe(ReleaseStatus.NeedsReview);
    expect(readiness.checks.find(c => c.name === 'CI Pipeline')?.status).toBe(CheckStatus.Pending);
  });

  it('should prioritize BLOCKED over NEEDS_REVIEW', async () => {
    const branch = 'feature/blocked-ci-and-pending-review'; // Simulates both fail and pending
    const readiness = await getReleaseReadiness(repo, branch);

    expect(readiness.status).toBe(ReleaseStatus.Blocked);
    expect(readiness.checks.find(c => c.name === 'CI Pipeline')?.status).toBe(CheckStatus.Fail);
    expect(readiness.checks.find(c => c.name === 'Approval Gates')?.status).toBe(CheckStatus.Pending);
  });

  it('should have correct structure for all checks', async () => {
    const branch = 'main';
    const readiness = await getReleaseReadiness(repo, branch);

    expect(readiness.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: 'CI Pipeline', status: CheckStatus.Pass }),
      expect.objectContaining({ name: 'Open Incidents', status: CheckStatus.Pass }),
      expect.objectContaining({ name: 'Approval Gates', status: CheckStatus.Pass }),
    ]));
  });
});
