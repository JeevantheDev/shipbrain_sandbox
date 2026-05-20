import { getReleaseReadiness } from './readiness';
import { ReleaseReadinessStatus, CheckStatus } from '../types/release';

// Mock the internal placeholder functions to control their output for tests
jest.mock('./readiness', () => ({
  ...jest.requireActual('./readiness'),
  getCIStatus: jest.fn(),
  getOpenIncidents: jest.fn(),
  getApprovalGates: jest.fn(),
}));

const mockGetCIStatus = require('./readiness').getCIStatus as jest.Mock;
const mockGetOpenIncidents = require('./readiness').getOpenIncidents as jest.Mock;
const mockGetApprovalGates = require('./readiness').getApprovalGates as jest.Mock;

describe('getReleaseReadiness', () => {
  const testRepo = 'test-repo';
  const testBranch = 'main';

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Default successful mocks
    mockGetCIStatus.mockResolvedValue({ name: 'CI Pipeline Status', status: CheckStatus.PASS, message: 'All tests passed' });
    mockGetOpenIncidents.mockResolvedValue({ name: 'Open Incidents', status: CheckStatus.PASS, message: 'No critical incidents open' });
    mockGetApprovalGates.mockResolvedValue({ name: 'Approval Gates', status: CheckStatus.PASS, message: 'All required approvals granted' });
  });

  it('should return READY status when all checks pass', async () => {
    const result = await getReleaseReadiness(testRepo, testBranch);

    expect(result.overallStatus).toBe(ReleaseReadinessStatus.READY);
    expect(result.repo).toBe(testRepo);
    expect(result.branch).toBe(testBranch);
    expect(result.checks).toHaveLength(3);
    expect(result.checks.every(check => check.status === CheckStatus.PASS)).toBe(true);
    expect(typeof result.timestamp).toBe('string');
  });

  it('should return BLOCKED status if any check fails', async () => {
    mockGetCIStatus.mockResolvedValueOnce({ name: 'CI Pipeline Status', status: CheckStatus.FAIL, message: 'Tests failed' });

    const result = await getReleaseReadiness(testRepo, testBranch);

    expect(result.overallStatus).toBe(ReleaseReadinessStatus.BLOCKED);
    expect(result.checks[0].status).toBe(CheckStatus.FAIL);
  });

  it('should return NEEDS_REVIEW status if any check is PENDING', async () => {
    mockGetApprovalGates.mockResolvedValueOnce({ name: 'Approval Gates', status: CheckStatus.PENDING, message: 'Waiting for approvals' });

    const result = await getReleaseReadiness(testRepo, testBranch);

    expect(result.overallStatus).toBe(ReleaseReadinessStatus.NEEDS_REVIEW);
    expect(result.checks[2].status).toBe(CheckStatus.PENDING);
  });

  it('should return NEEDS_REVIEW status if any check is UNKNOWN', async () => {
    mockGetOpenIncidents.mockResolvedValueOnce({ name: 'Open Incidents', status: CheckStatus.UNKNOWN, message: 'Could not fetch incident status' });

    const result = await getReleaseReadiness(testRepo, testBranch);

    expect(result.overallStatus).toBe(ReleaseReadinessStatus.NEEDS_REVIEW);
    expect(result.checks[1].status).toBe(CheckStatus.UNKNOWN);
  });

  it('should prioritize BLOCKED over NEEDS_REVIEW', async () => {
    mockGetCIStatus.mockResolvedValueOnce({ name: 'CI Pipeline Status', status: CheckStatus.FAIL, message: 'Tests failed' });
    mockGetApprovalGates.mockResolvedValueOnce({ name: 'Approval Gates', status: CheckStatus.PENDING, message: 'Waiting for approvals' });

    const result = await getReleaseReadiness(testRepo, testBranch);

    expect(result.overallStatus).toBe(ReleaseReadinessStatus.BLOCKED);
  });

  it('should call all underlying check functions with correct parameters', async () => {
    await getReleaseReadiness(testRepo, testBranch);

    expect(mockGetCIStatus).toHaveBeenCalledWith(testRepo, testBranch);
    expect(mockGetOpenIncidents).toHaveBeenCalledWith(testRepo);
    expect(mockGetApprovalGates).toHaveBeenCalledWith(testRepo, testBranch);
  });
});