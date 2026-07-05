# Phase 6.5 OpenAPI Security Threat Model

## Purpose

Capture the threat model for Phase 6.5 OpenAPI security hardening, including contract drift and frontend-backend boundary risks.

## Threat actors

- **Developer persona**: a local or lab user with a valid `access_token` cookie.
- **Unauthorized persona**: someone who lacks `contracts:view`, `admin:view`, or `diagnostics:view` permissions.
- **Cross-origin attacker**: a third-party web origin attempting CSRF or CORS abuse against the lab APIs.
- **Internal contract drift**: mismatches between Spring `v3/api-docs` and Nest `swagger-json` resulting in unsafe generated DTO usage.

## Attack scenarios

### 1. Unauthorized docs exposure

- The attacker finds raw contract endpoints from the UI or an unguarded route.
- They use a stolen or forged `access_token` cookie to access `/v3/api-docs`, `/swagger-json`, or Swagger UI.
- Impact: contract metadata disclosure and potential extraction of internal API details.

### 2. Cookie-based auth abuse

- A cross-origin page causes the browser to send `access_token` cookie to the lab API.
- Without CSRF mitigation, state-changing endpoints could be triggered by the attacker.
- Impact: impersonation of a persona in a dev-only auth model.

### 3. Generated client drift exploitation

- Backend contracts change without the generated client or facade being updated.
- Frontend code continues to trust generated DTOs and exposes inconsistent or invalid data.
- Impact: UI faults, data integrity issues, and possible misclassification of loans or permissions.

### 4. CORS or Socket.IO origin misconfiguration

- The Socket.IO gateway or API CORS policy accepts overly broad origins.
- An attacker page from a different domain may be able to establish a connection and read or emit events.
- Impact: unauthorized realtime event injection and event history leakage.

## Mitigations

- Protect docs endpoints with backend permission checks and avoid direct runtime links for unauthorized personas.
- Keep cookie auth dev-only by documenting the lack of signature/integrity and limiting exposure to local environments.
- Add CSRF or same-site enforcement around stateful endpoints if the auth cookie remains the primary credential.
- Use facade validation for generated DTOs and flag contract drift in the Contract Lab.
- Restrict Socket.IO origins to local development hosts and require persona authorization for event emit/history operations.

## Linked artifacts

- `planning/phase-6-5-security-risk-map.md`
- `planning/phase-6-5-openapi-client-risk-inventory.md`
- `planning/phase-6-5-security-issue.md`

## Status

- [X] Threat model created
- [ ] Review with the security hardening owner
- [X] Add mitigation plan to the Phase 6.5 backlog
