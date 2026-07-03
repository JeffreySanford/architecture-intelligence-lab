import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { ComparisonController } from './comparison.controller';
import { ComparisonService } from './comparison.service';

jest.mock('axios');

const mockedAxios = jest.mocked(axios);

describe('ComparisonController', () => {
  let controller: ComparisonController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComparisonController],
      providers: [ComparisonService],
    }).compile();

    controller = module.get(ComparisonController);
  });

  it('returns Nest gateway health', () => {
    expect(controller.getHealth()).toEqual(
      expect.objectContaining({
        status: 'ok',
        service: 'nest-api',
        mode: 'live',
      }),
    );
  });

  it('returns mock direct and proxy reads', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { loans: [], borrowers: [], statusCodes: [] },
    });

    await expect(controller.getDirectLoans()).resolves.toEqual(
      expect.objectContaining({ pathId: 'nest-direct' }),
    );
    await expect(controller.getProxyLoans()).resolves.toEqual(
      expect.objectContaining({ pathId: 'nest-proxy' }),
    );
  });

  it('returns comparison metrics for Spring direct, Nest direct, and Nest proxy', async () => {
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
    const comparison = await controller.compareLoans();

    expect(comparison.paths.map((path) => path.pathId)).toEqual([
      'spring-direct',
      'nest-direct',
      'nest-proxy',
    ]);
  });
});
