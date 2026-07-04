# 17 OpenAPI Contract Lab

## Purpose

The OpenAPI contract lab teaches anti-drift workflows. It shows Spring Swagger UI, Nest Swagger UI, generated client status, DTO lists, endpoint lists, contract snapshots, and drift checks.

Current checkpoint: the Angular route `/lab/openapi` renders a PrimeNG Contract Lab for Contract Admin users. It shows Swagger/OpenAPI links, generated client status, endpoint-to-DTO coverage, facade ownership, and drift boundaries. The deeper D3 contract tree remains a later visualization enhancement.

## Panels

| Panel | Purpose |
| --- | --- |
| Spring Swagger UI | Inspect source-of-truth API contract. |
| Nest Swagger UI | Inspect gateway/comparison contract. |
| Generated client status | Show generation timestamp and source spec. |
| Contract tree | Later D3 view of endpoints, DTOs, and generated models. |
| DTO list | Compare major DTOs across services. |
| Endpoint list | Show browser-facing paths. |
| Drift explanation | Explain database, API, frontend mapping, and runtime drift. |

## Phase 5 Relationship

The Phase 5 view includes Nest Swagger UI as a topology node and shows Contract Admin access in the role matrix. The OpenAPI Contract Lab remains the deeper contract surface, but Phase 5 should expose enough Swagger/contract status to explain why gateway DTOs matter for comparison metrics and realtime events.

Nest contract DTOs include:

- comparison metric rows keyed by `pathId`
- realtime emit responses keyed by `eventId`
- Socket.IO event payload shape
- diagnostics and Redis adapter status summaries remain planned extensions

## Drift Map

```mermaid
flowchart TB
  DB[Database schema] -->|protected by| Flyway[Flyway migrations]
  API[Backend DTO endpoints] -->|protected by| OpenAPI[OpenAPI generation]
  FE[Frontend generated models] -->|protected by| Clients[Generated clients]
  VM[UI mapping] -->|protected by| Tests[ViewModel unit tests]
  Runtime[Full user flow] -->|protected by| E2E[Playwright]
```

## Key Rule

Generated files are build artifacts. They should be regenerated, not hand-edited.

## What This Teaches

- Contract drift is a workflow problem, not just a code problem.
- Swagger UI is useful for humans; generated clients are useful for code.
- Nest can expose a useful contract even when Spring owns source-of-truth writes.
- Tests complete the contract story by verifying UI behavior.
- Phase 5 consumes contract-backed Nest shapes through `NestApiFacade`.
