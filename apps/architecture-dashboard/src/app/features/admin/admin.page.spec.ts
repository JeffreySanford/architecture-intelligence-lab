import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminPage } from './admin.page';

describe('AdminPage', () => {
  let fixture: ComponentFixture<AdminPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, AdminPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPage);
    fixture.detectChanges();
  });

  it('should render the admin security monitoring page', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Admin Security Monitoring');
    expect(compiled.querySelectorAll('[data-testid="security-item-row"]').length).toBeGreaterThan(0);
  });

  it('should summarize security item counts', () => {
    const summaryText = fixture.nativeElement.textContent ?? '';
    expect(summaryText).toContain('Monitored items');
    expect(summaryText).toContain('Issues');
    expect(summaryText).toContain('Watch items');
  });

  it('should show the Phase 6.5 artifacts card', () => {
    expect(
      fixture.nativeElement.querySelector('.admin-page__artifact-card-title')?.textContent,
    ).toContain('Phase 6.5 artifacts');
  });
});
