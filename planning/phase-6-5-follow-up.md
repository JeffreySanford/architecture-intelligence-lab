# Phase 6.5 Follow-up Backlog

## Purpose

Capture the Phase 6.5 OpenAPI security hardening work that remains after the documentation-alignment checkpoint.

This backlog note separates active Sprint 15 runtime hardening from deferred Sprint 17 follow-up work.

## Summary

The lab currently has strong Phase 6/6.5 documentation and UI visibility for generated client drift and contract risk. Runtime hardening now includes signed dev persona cookies, auth guard enforcement, CORS/origin restrictions, CSRF/same-site cookie safeguards, operational monitoring, and issue-style public-hardening tracking. Optional historical metrics now have an authenticated local dashboard backed by Nest rolling comparison history.

## Active Sprint 15 tasks

- [X] Review and harden the Spring `access_token` persona auth model so it is not treated as a production credential.
- [X] Add backend-enforced Nest gateway and realtime auth guards for all protected routes.
- [X] Restrict Socket.IO origin handling to local/dev hosts and remove permissive wildcard origin behavior.
- [X] Validate and tighten CORS policy across Angular, Spring, and Nest clients for proxied and Docker runtime flows.
- [X] Add CSRF mitigation or same-site cookie enforcement for state-changing endpoints that use cookie auth.
- [X] Define a documented follow-up mitigation plan for cookie integrity and CSRF risk.
- [X] Verify refresh hardening for protected lab routes: clearing stale auth state, resetting persona selection, and redirecting to landing on `/lab/*` reloads.
- [X] Add unit and Playwright regression coverage for refresh hardening and developer-only MCP route guard behavior.
- [X] Review Phase 6.5 UI/UX artifacts to ensure data visualization, PrimeIcons, and Angular animation reinforce the security and developer guidance narrative.
- [X] Monitor raw contract docs access from the admin security monitoring page.
- [X] Add generated client drift watch items to the admin security monitoring narrative.
- [X] Review generated client facade validation and add contract gap alerts for critical DTO fields.
- [X] Cross-reference the deferred backlog with `planning/phase-6-5-security-risk-map.md`, `planning/phase-6-5-openapi-client-risk-inventory.md`, and `planning/phase-6-5-security-issue.md`.

## Deferred Sprint 17 tasks

- [X] Track long-term public-hardening work that goes beyond the local training-lab runtime.
- [X] Track optional historical security or comparison metrics dashboards after metrics persistence exists.
- [X] Track enterprise baseline variants or migration branches separately from the active modern study stack.

## Scope note

Sprint 15 hardening and Sprint 17 tracking are complete for the local lab. Public deployment remains intentionally out of runtime scope until the tracked public-hardening items are selected for a future implementation branch.

## References

- `planning/phase-6-5-security-risk-map.md`
- `planning/phase-6-5-openapi-client-risk-inventory.md`
- `planning/phase-6-5-security-issue.md`
- `planning/public-hardening-issue-tracking.md`
- `planning/20-build-phases-and-acceptance-criteria.md`
- `planning/22-pi-and-sprint-plan.md`
