import { ComponentFixture, TestBed } from '@angular/core/testing';
import { McpDashboardPage } from './mcp-dashboard.page';

describe('McpDashboardPage', () => {
  let fixture: ComponentFixture<McpDashboardPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [McpDashboardPage],
    }).compileComponents();

    fixture = TestBed.createComponent(McpDashboardPage);
    fixture.detectChanges();
  });

  it('should render the MCP dashboard with setup checklist and command guidance', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Angular CLI MCP Guidance');
    expect(compiled.textContent).toContain('Use `.vscode/mcp.json` for Angular CLI MCP configuration');
    expect(compiled.textContent).toContain('List commands for build, test, lint, generate, and OpenAPI drift checks.');
    expect(compiled.textContent).toContain('This page explains how the training lab uses Angular CLI MCP');
  });

  it('should include the MCP config example with angular-cli server settings', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const pre = compiled.querySelector('pre')?.textContent ?? '';

    expect(pre).toContain('"angular-cli"');
    expect(pre).toContain('"exec"');
    expect(pre).toContain('"ng"');
    expect(pre).toContain('"mcp"');
  });

  it('should keep the dashboard page read-only in text guidance', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('It is intentionally read-only');
    expect(compiled.textContent).toContain('read-only');
  });
});
