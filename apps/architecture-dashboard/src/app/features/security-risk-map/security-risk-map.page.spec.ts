import { TestBed } from '@angular/core/testing';
import { SecurityRiskMapPage } from './security-risk-map.page';

describe('SecurityRiskMapPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityRiskMapPage],
    }).compileComponents();
  });

  it('should create the security risk map page', () => {
    const fixture = TestBed.createComponent(SecurityRiskMapPage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the Phase 6.5 heading and risk map link', () => {
    const fixture = TestBed.createComponent(SecurityRiskMapPage);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Phase 6.5 Security Risk Map');
    expect(compiled.querySelector('a')?.getAttribute('href')).toBe('/planning/phase-6-5-security-risk-map.md');
  });
});
