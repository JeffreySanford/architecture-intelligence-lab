import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Component, computed, inject, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AuthStore } from '../../core/auth/auth.store';

export type SecurityStatus = 'ok' | 'watch' | 'issue';

type SecurityMonitoringItem = {
  id: string;
  area: string;
  status: SecurityStatus;
  summary: string;
  recommendation: string;
  owner: string;
};

@Component({
  standalone: true,
  selector: 'app-admin-page',
  imports: [CommonModule, RouterLink, CardModule, TableModule, TagModule],
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage {
  private readonly authStore = inject(AuthStore);

  protected readonly currentUser = this.authStore.currentUser;

  protected readonly securityItems = signal<SecurityMonitoringItem[]>([
    {
      id: 'openapi-credential-forwarding',
      area: 'OpenAPI client credential forwarding',
      status: 'watch',
      summary:
        'Ensure generated Spring and Nest clients send cookies/credentials for dev persona auth and API access.',
      recommendation:
        'Validate `withCredentials: true` in generated client providers and add regression coverage for `/api/me` cookie restore.',
      owner: 'Angular OpenAPI facade',
    },
    {
      id: 'openapi-docs-permission',
      area: 'OpenAPI docs permission protection',
      status: 'ok',
      summary:
        'Spring and Nest Swagger/OpenAPI endpoints are guarded by signed dev persona cookies and contract/admin permissions.',
      recommendation:
        'Keep raw docs links visible only to contract/admin personas and run the docs access probes during security scans.',
      owner: 'Spring / Nest API teams',
    },
    {
      id: 'contract-docs-access-monitor',
      area: 'Raw contract docs access monitor',
      status: 'watch',
      summary:
        'The admin dashboard tracks docs access as an explicit security monitoring item for `/swagger/spring-json/`, `/swagger/nest/`, and `/swagger/nest-json/`.',
      recommendation:
        'Review backend logs and Docker smoke output for unauthorized docs probes after changes to auth, proxy, or Swagger routing.',
      owner: 'Admin security monitoring',
    },
    {
      id: 'nest-realtime-auth-guard',
      area: 'Nest realtime and gateway auth guards',
      status: 'ok',
      summary:
        'Realtime and gateway APIs require signed dev persona cookies and role-aware backend guards.',
      recommendation:
        'Keep guard regression tests on gateway comparison, realtime history, and realtime emit paths.',
      owner: 'Nest gateway',
    },
    {
      id: 'websocket-origin-policy',
      area: 'WebSocket origin allowlist',
      status: 'watch',
      summary:
        'The Socket.IO gateway now uses an explicit local dev host allowlist, but the runtime origin policy remains environment-configurable.',
      recommendation:
        'Keep origin allowlists restricted to known local/dev origins and avoid wildcard origin patterns for broader exposure.',
      owner: 'Nest realtime gateway',
    },
    {
      id: 'cookie-integrity',
      area: 'Dev auth cookie integrity',
      status: 'watch',
      summary:
        'Persona auth now relies on an HMAC-signed demo `access_token` cookie shared by Spring and Nest.',
      recommendation:
        'Keep this documented as dev-only auth and replace it with IdP-backed JWTs or opaque sessions before expanding exposure.',
      owner: 'Spring dev auth',
    },
    {
      id: 'security-risk-map',
      area: 'Phase 6.5 security risk map',
      status: 'ok',
      summary:
        'The new Phase 6.5 risk map captures auth, authorization, CORS, CSRF, contract drift, and metadata exposure risks.',
      recommendation:
        'Review the risk map in planning/phase-6-5-security-risk-map.md and keep it updated as hardening progresses.',
      owner: 'Planning / Admin',
    },
    {
      id: 'generated-client-contract-gaps',
      area: 'Generated client facade validation',
      status: 'watch',
      summary:
        'SpringApiFacade and NestApiFacade now fail fast on missing critical DTO identifiers, counters, and realtime transition fields.',
      recommendation:
        'Add new facade validators when generated clients start carrying securities, commitments, disclosures, or pricing DTOs.',
      owner: 'Angular data-access facades',
    },
  ]);

  protected readonly securitySummary = computed(() => {
    const rows = this.securityItems();
    return {
      total: rows.length,
      issues: rows.filter((item) => item.status === 'issue').length,
      watches: rows.filter((item) => item.status === 'watch').length,
      ok: rows.filter((item) => item.status === 'ok').length,
    };
  });

  protected readonly statusSeverity = (status: SecurityStatus): 'success' | 'warn' | 'danger' => {
    switch (status) {
      case 'ok':
        return 'success';
      case 'watch':
        return 'warn';
      case 'issue':
        return 'danger';
    }
  };
}
