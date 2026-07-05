# Phase 6.5 Security Risk Map

## Purpose

Document the remaining Phase 6.5 security risks introduced by the OpenAPI contract surface, the generated clients, and the backend visibility endpoints.

This risk map is the current source of truth for:
- auth and authorization risk boundaries
- frontend-to-backend exposure points
- raw contract metadata access controls
- dev-only token and session assumptions

## Scope

The following risk areas are included:
- auth
- authorization
- CORS
- CSRF
- contract drift and generated DTO assumptions
- metadata exposure from OpenAPI endpoints

## Risk Categories

### Auth

- `access_token` cookie is a dev-only persona identifier with no signature or integrity checks.
- Spring and Nest both validate a signed demo persona cookie, but that cookie still represents local training identity rather than production-grade authentication.
- Reloading a protected `/lab/*` route must clear stale auth state and reset persona selection, or stale UI/session state may expose broader access than intended.
- No CSRF protection exists for state-changing APIs, so cookie-based auth can be abused by third-party pages.
- The current bearer-like cookie pattern is acceptable only in a local lab environment; it must not be reused for public/demo deployment.

### Authorization

- OpenAPI docs endpoints are protected by role/permission checks, but the baseline gateway and realtime API routes are still exposed.
- `contracts:view` is used for contract lab access, while `admin:view` is also allowed for docs access; permission boundaries should be audited for least privilege.
- Angular route guards are effective for UI navigation, but backend enforcement is the true security boundary.
- Persona authorization is currently based on repository lookup by cookie value, so missing or malformed cookies may bypass intended persona restrictions if not normalized consistently.

### CORS

- The dashboard and APIs are currently wired for local runtime flows, but the Nest gateway and Spring APIs should restrict CORS to known origins before broader exposure.
- The Socket.IO gateway is configured with permissive origin handling for dev convenience; this should be tightened before any non-local use.
- Socket.IO origin restrictions are already environment-configurable via `SOCKET_IO_ORIGINS`; the current defaults stay local dev hosts only.
- Generated client calls already use `withCredentials: true` in the Angular runtime config, which is the correct design for the current proxied cookie-based auth model.

### CSRF

- Cookie-based auth with no anti-CSRF token or same-site enforcement is vulnerable in a cross-origin browser context.
- Any state-changing endpoint exposed by the lab should either use same-site cookies or an explicit CSRF token header.
- The OpenAPI docs filter should also consider the risk of stateful GET requests being repurposed in a CSRF attack if backend auth changes over time.

### Contract drift and generated DTO assumptions

- The OpenAPI Contract Lab surface must clearly separate raw contract metadata from generated DTO shape expectations.
- Drift between Spring `/v3/api-docs` and Nest `/swagger-json` can lead to frontend assumptions that break if one backend evolves before the other.
- Generated clients should remain behind facade boundaries so the app can validate or normalize unexpected contract changes.
- Metadata exposure through docs endpoints should not reveal internal-only endpoints, authentication helpers, or implementation details that are not intended for learner-facing usage.

### Metadata exposure

- Raw docs endpoints are valuable for contract generation but dangerous if exposed to unauthorized or untrusted personas.
- Swagger UI and JSON endpoints should only be visible to personas with explicit contract inspection rights.
- The admin page should log or monitor access to contract docs as part of the security monitoring narrative.

## Next steps

- [X] Create a GitHub issue to track the remaining Phase 6.5 security hardening tasks.
- [X] Tighten Nest and Spring API auth guards around gateway/realtime and open docs access.
- [X] Add CORS origin restrictions for local runtime and Docker compose environments.
- [X] Define a follow-up mitigation plan for CSRF and cookie integrity.
- [X] Validate refresh hardening for protected lab routes, including direct `/lab/mcp` reloads, stale auth state reset, and landing redirect behavior.
- [X] Validate local Spring persona load through `/api/personas` and confirm the landing page auth flow functions after the Flyway repair.
- [ ] Review generated client drift coverage and add contract change alerts to the OpenAPI Contract Lab.
- [X] Add unit and Playwright regression coverage for protected docs, gateway, and realtime auth guard behavior.
- [X] Consolidate deferred hardening work into `planning/phase-6-5-follow-up.md`.

## GitHub issue placeholder

Title: Phase 6.5 OpenAPI security hardening and risk remediation

Body:

- [ ] Review and harden Spring `access_token` persona auth model
- [ ] Tighten Nest gateway and realtime route auth guards
- [ ] Restrict Socket.IO origin handling for non-local use
- [ ] Validate CORS policy across Angular, Spring, and Nest clients
- [ ] Add CSRF protection or same-site cookie enforcement for state-changing APIs
- [ ] Monitor contract docs access from the admin security page
- [ ] Track generated client drift and raw contract metadata exposure as follow-up work

Labels: `security`, `phase-6.5`, `openapi`, `risk` 

Assignee: TBD
