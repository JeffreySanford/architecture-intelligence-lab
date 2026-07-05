import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { NestApiFacade, type ComparisonHistory } from '../../core/api/nest-api.facade';
import { MetricsHistoryPage } from './metrics-history.page';

const history: ComparisonHistory = {
  subject: 'loans',
  sampleLimit: 20,
  sampleCount: 1,
  samples: [
    {
      mode: 'live',
      subject: 'loans',
      observedAt: '2026-07-05T00:00:00.000Z',
      paths: [
        {
          pathId: 'spring-direct',
          label: 'Spring direct',
          latencyMs: 32,
          payloadBytes: 1024,
          recordCount: 5,
          status: 'ok',
          observedAt: '2026-07-05T00:00:00.000Z',
        },
      ],
    },
  ],
  summary: [
    {
      pathId: 'spring-direct',
      label: 'Spring direct',
      samples: 1,
      averageLatencyMs: 32,
      averagePayloadBytes: 1024,
      latestRecordCount: 5,
      latestStatus: 'ok',
      latestObservedAt: '2026-07-05T00:00:00.000Z',
    },
  ],
};

class MockNestApiFacade {
  getLoanComparisonHistory = vi.fn(() => of(history));
  getLoanComparison = vi.fn(() => of(history.samples[0]));
}

describe('MetricsHistoryPage', () => {
  let fixture: ComponentFixture<MetricsHistoryPage>;
  let api: MockNestApiFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricsHistoryPage, NoopAnimationsModule],
      providers: [{ provide: NestApiFacade, useClass: MockNestApiFacade }],
    }).compileComponents();

    fixture = TestBed.createComponent(MetricsHistoryPage);
    api = TestBed.inject(NestApiFacade) as unknown as MockNestApiFacade;
    fixture.detectChanges();
  });

  it('loads and renders historical comparison metrics', () => {
    const text = fixture.nativeElement.textContent as string;

    expect(api.getLoanComparisonHistory).toHaveBeenCalled();
    expect(text).toContain('Backend Metrics History');
    expect(text).toContain('Spring direct');
    expect(text).toContain('32 ms');
  });

  it('filters recent samples by status text', () => {
    const component = fixture.componentInstance as unknown as {
      filterText: { set: (value: string) => void };
      filteredSamples: () => unknown[];
    };

    component.filterText.set('warning');

    expect(component.filteredSamples()).toHaveLength(0);
  });

  it('captures a fresh sample before refreshing history', () => {
    const component = fixture.componentInstance as unknown as { captureSample: () => void };

    component.captureSample();

    expect(api.getLoanComparison).toHaveBeenCalled();
    expect(api.getLoanComparisonHistory).toHaveBeenCalledTimes(2);
  });

  it('shows an error when history cannot be loaded', async () => {
    api.getLoanComparisonHistory.mockReturnValueOnce(throwError(() => new Error('offline')));
    fixture = TestBed.createComponent(MetricsHistoryPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Historical comparison metrics are unavailable');
  });
});
