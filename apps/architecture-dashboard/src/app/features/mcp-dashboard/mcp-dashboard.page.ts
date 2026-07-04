import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  selector: 'app-mcp-dashboard-page',
  imports: [CommonModule, FormsModule, CardModule, ChipModule, InputTextModule, TableModule, TagModule, ButtonModule],
  templateUrl: './mcp-dashboard.page.html',
  styleUrl: './mcp-dashboard.page.scss',
})
export class McpDashboardPage {
  protected readonly guideItems = [
    {
      label: 'Use `.vscode/mcp.json` for Angular CLI MCP configuration',
      note: 'This config points VS Code MCP clients to the local Angular CLI MCP server.',
    },
    {
      label: 'Keep the dashboard read-only',
      note: 'The page should explain MCP workflows without executing workspace commands directly.',
    },
    {
      label: 'Prefer explicit command guidance',
      note: 'List commands for build, test, lint, generate, and OpenAPI drift checks.',
    },
    {
      label: 'Link to OpenAPI generation and drift-check workflows',
      note: 'Explain how generated clients are rebuilt after Spring or Nest API changes.',
    },
  ] as const;

  protected readonly commands = [
    {
      command: 'pnpm exec nx run architecture-dashboard:serve-static --port=4200',
      description: 'Start the Angular app locally for browser-based lab development.',
    },
    {
      command: 'pnpm exec nx run architecture-dashboard:test',
      description: 'Run Angular unit tests for the dashboard app.',
    },
    {
      command: 'pnpm exec nx run nest-api:test',
      description: 'Run NestJS backend unit and integration tests.',
    },
    {
      command: 'pnpm exec nx run architecture-dashboard-e2e:e2e',
      description: 'Run Playwright end-to-end tests for the architecture dashboard.',
    },
  ] as const;

  protected readonly openApiCommands = [
    {
      command: 'pnpm exec nx run spring-api:generate-openapi',
      description: 'Export Spring OpenAPI JSON for generated client regeneration.',
    },
    {
      command: 'pnpm exec nx run nest-api:export-openapi',
      description: 'Export Nest OpenAPI JSON for the Nest generated client.',
    },
    {
      command: 'pnpm exec nx run spring-api-client:generate',
      description: 'Regenerate the Spring Angular generated client from the latest OpenAPI JSON.',
    },
    {
      command: 'pnpm exec nx run nest-api-client:generate',
      description: 'Regenerate the Nest Angular generated client from the latest OpenAPI JSON.',
    },
  ] as const;

  protected readonly qualityChecklist = [
    {
      label: 'Validate OpenAPI contract docs links',
      note: 'Spring and Nest raw contract URLs should be reachable from the browser under local dev or Docker proxy routing.',
    },
    {
      label: 'Verify `withCredentials: true` on generated client HTTP calls',
      note: 'Ensure auth cookies are forwarded for persona-based API calls.',
    },
    {
      label: 'Keep MCP guidance isolated from command execution',
      note: 'The dashboard should teach commands but not run them in-browser.',
    },
    {
      label: 'Review Playwright coverage for the contract lab route',
      note: 'Ensure the OpenAPI page is accessible to `contracts:view` personas only.',
    },
  ] as const;

  protected readonly mcpConfig = computed(() => ({
    servers: {
      'angular-cli': {
        command: 'pnpm',
        args: ['exec', 'ng', 'mcp'],
      },
    },
  }));

  protected readonly jsonStringify = JSON.stringify;
}
