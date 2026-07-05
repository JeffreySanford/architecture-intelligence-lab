import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SecurityThreatModelPage } from './security-threat-model.page';

describe('SecurityThreatModelPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityThreatModelPage, RouterTestingModule],
    }).compileComponents();
  });

  it('should create the security threat model page', () => {
    const fixture = TestBed.createComponent(SecurityThreatModelPage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the Phase 6.5 heading and link to the risk map', () => {
    const fixture = TestBed.createComponent(SecurityThreatModelPage);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Phase 6.5 Threat Model');
    expect(compiled.querySelector('a')?.getAttribute('href')).toBe('/lab/security-risk-map');
  });
});
