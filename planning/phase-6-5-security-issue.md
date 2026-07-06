# Phase 6.5 OpenAPI Security Hardening Issue

## Purpose

Track the remaining Phase 6.5 OpenAPI security hardening work in a GitHub issue-style placeholder.

This issue is referenced by the admin security monitoring page and the Phase 6.5 security risk map.

## Summary

The lab secures raw OpenAPI docs access, protects the Nest Swagger UI, and tracks the closed local-lab hardening work:

- strengthen dev persona auth integrity
- tighten Nest gateway and realtime auth guards
- enforce origin/CORS restrictions for Socket.IO and API flows
- add CSRF mitigation for cookie-based auth
- document and monitor generated client drift risk

## Tasks

- [X] Review and harden Spring `access_token` persona auth model
- [X] Add backend-enforced Nest gateway and realtime auth guards
- [X] Restrict Socket.IO origin handling for non-local development
- [X] Validate CORS policy across Angular, Spring, and Nest clients
- [X] Add CSRF protection or same-site cookie enforcement for state-changing endpoints
- [X] Validate refresh hardening and landing redirect behavior for protected MCP and contract routes
- [X] Monitor contract docs access from the admin security monitoring page
- [X] Track generated client drift and raw contract metadata exposure as follow-up work
- [X] Consolidate active Sprint 15 hardening work and deferred Sprint 17 follow-up into `planning/phase-6-5-follow-up.md`

## Links

- Risk map: `planning/phase-6-5-security-risk-map.md`
- Security monitoring page: `apps/architecture-dashboard/src/app/features/admin/admin.page.ts`
- Phase 6.5 plan: `planning/20-build-phases-and-acceptance-criteria.md`

## Labels

- `security`
- `phase-6.5`
- `openapi`
- `risk`

## Assignee

- TBD
