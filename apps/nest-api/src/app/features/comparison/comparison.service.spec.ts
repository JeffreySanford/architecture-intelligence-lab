import { ComparisonService } from './comparison.service';
import axios from 'axios';

jest.mock('axios');

const mockedAxios = jest.mocked(axios);

describe('ComparisonService', () => {
  let service: ComparisonService;

  beforeEach(() => {
    mockedAxios.get.mockReset();
    service = new ComparisonService();
  });

  it('returns gateway health in explicit mock mode', () => {
    expect(service.getHealth()).toEqual(
      expect.objectContaining({
        status: 'ok',
        service: 'nest-api',
        mode: 'live',
        springApiTarget: expect.any(String),
      }),
    );
  });

  it('returns direct loan reads', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('connection refused'));

    await expect(service.getDirectLoans()).resolves.toEqual(
      expect.objectContaining({
        pathId: 'nest-direct',
        mode: 'degraded',
        recordCount: 2,
      }),
    );
  });

  it('maps Spring proxy reads into gateway loan rows', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        loans: [
          {
            id: 'loan-101',
            borrowerId: 'borrower-101',
            loanNumber: 'TL-1101',
            amount: 501000,
            statusCode: 'submitted',
          },
        ],
        borrowers: [{ id: 'borrower-101', name: 'Priya Rao' }],
        statusCodes: [{ code: 'submitted', label: 'Submitted' }],
      },
    });

    await expect(service.getProxyLoans()).resolves.toEqual(
      expect.objectContaining({
        pathId: 'nest-proxy',
        mode: 'live',
        recordCount: 1,
        records: [
          {
            id: 'loan-101',
            loanNumber: 'TL-1101',
            borrowerName: 'Priya Rao',
            amount: 501000,
            status: 'Submitted',
          },
        ],
      }),
    );
  });

  it('falls back to degraded proxy reads when Spring is unavailable', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('connection refused'));

    await expect(service.getProxyLoans()).resolves.toEqual(
      expect.objectContaining({
        pathId: 'nest-proxy',
        mode: 'degraded',
        recordCount: 2,
        errorMessage: 'connection refused',
      }),
    );
  });

  it('returns comparison metrics for all Phase 5 paths', async () => {
    mockedAxios.get
      .mockResolvedValueOnce({
        data: { loans: [], borrowers: [], statusCodes: [] },
      })
      .mockResolvedValueOnce({
        data: { loans: [], borrowers: [], statusCodes: [] },
      })
      .mockResolvedValueOnce({
        data: { loans: [], borrowers: [], statusCodes: [] },
      });

    const comparison = await service.compareLoans();

    expect(comparison.mode).toBe('live');
    expect(comparison.subject).toBe('loans');
    expect(comparison.paths.map((path) => path.pathId)).toEqual([
      'spring-direct',
      'nest-direct',
      'nest-proxy',
    ]);
    expect(comparison.paths.every((path) => path.status === 'ok')).toBe(true);
  });
});
