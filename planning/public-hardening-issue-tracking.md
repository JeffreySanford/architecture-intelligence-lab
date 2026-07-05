# Public Hardening Issue Tracking

## Purpose

Track the work required before the local training lab can be treated as a public or shared deployment. These are issue-style records rather than active local-lab blockers.

## Current Status

- [X] Dev persona cookie integrity no longer relies on a plain persona id. Spring issues an HMAC-signed `access_token`, and Nest validates the same token format with `DEV_AUTH_SECRET`.
- [X] Local runtime CORS, Socket.IO origin, Swagger, gateway, and realtime routes require known signed persona tokens.
- [X] Historical backend comparison metrics have an authenticated Nest endpoint and Angular dashboard route.
- [X] Long-term public-hardening work is tracked separately from the completed local-lab release scope.

## Public Hardening Items

### PH-001 External Identity Provider

- Status: tracked
- Scope: Replace demo persona selection with a real IdP-backed flow before public exposure.
- Acceptance evidence: OAuth/OIDC configuration, role mapping tests, and disabled demo persona selector in public mode.

### PH-002 Secret Management

- Status: tracked
- Scope: Move `DEV_AUTH_SECRET` and service credentials into environment-specific secret management.
- Acceptance evidence: no checked-in production secrets, documented secret rotation path, and compose/k8s/runtime examples.

### PH-003 Persistent Metrics Store

- Status: tracked
- Scope: Promote in-memory comparison history to durable storage when historical analytics need to survive Nest restarts.
- Acceptance evidence: migration, repository/service tests, retention policy, and dashboard reads from the durable store.

### PH-004 CSRF And Browser Security Headers

- Status: tracked
- Scope: Add production-mode CSRF token enforcement and security headers for public browser traffic.
- Acceptance evidence: CSRF positive/negative tests, CSP/header assertions, and documented proxy behavior.

### PH-005 Rate Limits And Abuse Controls

- Status: tracked
- Scope: Add rate limits for auth selection, gateway comparison, realtime emit, and Swagger/OpenAPI endpoints.
- Acceptance evidence: throttling tests and documented defaults for local versus public runtime.

### PH-006 Deployment Baselines

- Status: tracked
- Scope: Keep modern study stack and conservative enterprise baseline variants traceable without mixing them into one branch.
- Acceptance evidence: branch or issue references for Angular/Spring baseline variants and compatibility checks.

## References

- `planning/20-build-phases-and-acceptance-criteria.md`
- `planning/21-codex-task-breakdown.md`
- `planning/22-pi-and-sprint-plan.md`
- `planning/phase-6-5-follow-up.md`
