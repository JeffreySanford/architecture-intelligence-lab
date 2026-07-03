import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfrastructurePage } from './infrastructure.page';

describe('InfrastructurePage', () => {
  let fixture: ComponentFixture<InfrastructurePage>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfrastructurePage, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(InfrastructurePage);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should request /api/health and display healthy status', () => {
    const req = httpMock.expectOne('/api/health');
    expect(req.request.method).toBe('GET');
    req.flush({ status: 'ok', service: 'spring-api' });

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Status:');
    expect(compiled.textContent).toContain('ok');
    expect(compiled.textContent).toContain('Service:');
    expect(compiled.textContent).toContain('spring-api');
  });
});
