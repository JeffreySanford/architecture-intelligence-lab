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
      status: 'issue',
      summary:
        'Raw contract endpoints are publicly reachable and linked from the contract lab without a permission guard.',
      recommendation:
        'Restrict `/v3/api-docs`, `/swagger-json`, and Swagger UI behind role-based access or hidden dev-only routes.',
      owner: 'Spring / Nest API teams',
    },
    {
      id: 'nest-realtime-auth-guard',
      area: 'Nest realtime and gateway auth guards',
      status: 'watch',
      summary:
        'Realtime and gateway APIs are currently exposed without explicit authentication or authorization enforcement.',
      recommendation:
        'Add route guards on gateway endpoints and require persona roles for emit/history control paths.',
      owner: 'Nest gateway',
    },
    {
      id: 'websocket-origin-policy',
      area: 'WebSocket origin allowlist',
      status: 'issue',
      summary:
        'The Socket.IO gateway allows `origin: *`, which is acceptable only in a tightly contained dev environment.',
      recommendation:
        'Limit origin access to local dev hosts and document the tradeoff as dev-only security behavior.',
      owner: 'Nest realtime gateway',
    },
    {
      id: 'cookie-integrity',
      area: 'Dev auth cookie integrity',
      status: 'watch',
      summary:
        'Persona auth relies on a plain `access_token` cookie without signature or token verification.',
      recommendation:
        'Document this as dev-only auth and replace it with signed tokens or JWTs before expanding exposure.',
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
