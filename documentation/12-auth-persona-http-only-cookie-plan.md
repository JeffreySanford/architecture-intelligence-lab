# 12 Auth Persona And HttpOnly Cookie Plan

## Purpose

The lab uses persona selection instead of a login form. This keeps the focus on architecture while still teaching browser auth patterns, permissions, route guards, and secure token handling.

## Persona Style

Use both realistic names and role labels:

| Persona | Role label |
| --- | --- |
| Alice Viewer | Viewer |
| Ben Reviewer | Reviewer |
| Cara Approver | Approver |
| Diana Admin | Admin |
| Ethan Diagnostics Admin | Diagnostics Admin |
| Fiona Contract Admin | Contract Admin |
| Grace Realtime Operator | Realtime Operator |
| Henry MCP Explorer | MCP Explorer |
| Irene Document Reviewer | Reviewer |
| Jason Auditor | Auditor |
| Morgan Platform Admin | Admin |
| Nora Security Admin | Admin |
| Owen API Admin | Contract Admin |

## Core Roles

- Viewer
- Reviewer
- Approver
- Admin
- Diagnostics Admin
- Contract Admin
- Realtime Operator
- MCP Explorer
- Auditor

## Core Permissions

| Permission | Meaning |
| --- | --- |
| `dashboard:view` | Open dashboard views. |
| `loans:view` | View loan records. |
| `loans:update` | Update loan status. |
| `documents:view` | View document metadata. |
| `documents:update` | Update document metadata. |
| `admin:view` | View admin lab. |
| `diagnostics:view` | View diagnostics panels. |
| `contracts:view` | View OpenAPI contract lab. |
| `mcp:view` | View MCP dashboard. |
| `realtime:view` | View realtime lab. |
| `realtime:emit` | Trigger demo realtime events. |
| `backend-comparison:view` | View backend comparison lab. |

## Cookie Flow

Current implementation checkpoint: the landing page loads persona cards from Spring, posts the selected persona to `/api/dev-auth/personas/{personaId}/select`, receives an httpOnly cookie, then calls `/api/me`. `/lab` is guarded by `/api/me`, but the backend currently falls back to Alice Viewer when no cookie exists so the lab remains demo-accessible during setup.

```mermaid
sequenceDiagram
  participant Browser
  participant Angular
  participant Spring

  Browser->>Angular: Select persona card
  Angular->>Spring: POST /api/dev-auth/personas/{personaId}/select
  Spring-->>Browser: Set-Cookie access_token HttpOnly SameSite=Lax
  Angular->>Spring: GET /api/me
  Spring-->>Angular: CurrentUserDto with roles and permissions
  Angular->>Angular: Build permissionSet and visible navigation
```

## Security Notes

Angular cannot read the cookie. The browser sends it automatically. This demonstrates why httpOnly cookies reduce token exposure to browser JavaScript.

Current implementation shortcut: `access_token` contains the selected persona id, not a signed JWT. Replace this with a signed JWT or opaque server session before treating the flow as production-like auth.

CSRF must be discussed because cookies are automatically attached by the browser. For v1, use `SameSite=Lax` and keep state-changing endpoints explicit. A later hardening phase can add CSRF tokens for production-like behavior.

Persona selection is demo-only and must be disabled outside the Docker demo profile.

## What This Teaches

- Authentication and authorization are separate concepts.
- Frontend permission checks improve UX but do not replace backend enforcement.
- httpOnly cookies protect tokens from direct JavaScript reads.
- Demo shortcuts must be profile-gated.
