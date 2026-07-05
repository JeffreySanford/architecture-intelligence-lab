# Architecture Intelligence Lab

`architecture-intelligence-lab` is a Docker-first Nx training lab for exploring Angular standalone architecture, NgRx SignalStore, Spring Boot, NestJS, PostgreSQL, Redis, OpenAPI contracts, and full-stack testing. It is currently oriented toward PrimeNG enterprise UI patterns and a capital markets-style study lab for securities, commitments, disclosures, and pricing workflows.

## Stack Strategy

This repo intentionally keeps the current modern study stack: Angular 22, Nx 23 beta, TypeScript 6, Spring Boot 4.x, Java 17, NestJS 11, PostgreSQL, Redis, Docker, OpenAPI, D3, and PrimeNG 22 RC. The conservative enterprise baseline to understand alongside it is Angular 18/19/20, PrimeNG 18/19/20/21, Java 17/21, Spring Boot 3.x, PostgreSQL, Docker, and OpenAPI.

- [X] Phase 9A Security Search implementation is complete and unit-tested.
- [X] Phase 9 visual smoke coverage is green for route, nav, table, overlay, chart, SVG, mobile, and reduced-motion paths.
- [X] Phase 9 realtime dashboard animation follow-through is covered by the Phase 10 Realtime Lab dashboard.
- [X] Phase 10 Realtime Lab now has a dedicated `/lab/realtime` dashboard for emits, burst mode, event history, chart state, and derived Redis cache telemetry.
- [X] Docker image configuration now serves the Angular production build through Nginx at `/` and proxies Spring/Nest Swagger routes under `/swagger`.
- [X] Nest gateway and realtime HTTP endpoints now require signed dev persona cookies, and Socket.IO origins are restricted to configured local/dev origins.
- [X] Metrics History at `/lab/metrics-history` shows authenticated rolling comparison history using the Nest gateway, Chart.js, and PrimeNG tables.
- [X] Docker smoke passes for `/`, `/api/health`, stress dataset data, Spring/Nest Swagger proxies, OpenAPI JSON, live comparison metrics, and historical comparison metrics.
- [X] Deferred hardening and optional follow-up are now closed for local lab scope: signed dev auth cookie integrity, historical metrics dashboard traceability, and public-hardening issue tracking are in place.

PrimeNG has been moved to the Angular 22-aligned release-candidate line (`22.0.0-rc.1`) with `@angular/cdk` installed as its peer dependency. Treat PrimeNG 22 APIs as allowed only after local build/test validation, because this is still an RC dependency.

The domain emphasis is Capital Markets architecture practice, not a generic mortgage demo. Existing loan data remains useful as source material, but future screens should prefer vocabulary such as securities, pools, commitments, disclosure files, trade events, backend metrics, and contract snapshots.

Read the architecture documentation and planning checkpoint first:

- [Documentation overview](documentation/README.md)
- [Capital Markets vocabulary](documentation/21-capital-markets-vocabulary.md)
- [Planning overview](planning/README.md)
- [PI and sprint plan](planning/22-pi-and-sprint-plan.md)
- [Codex task breakdown](planning/21-codex-task-breakdown.md)

## Package Manager

Use pnpm for this workspace.

```sh
pnpm install
pnpm nx show projects
```

## Core Scripts

```sh
pnpm run start:all
pnpm run mcp:angular
pnpm run test:all
pnpm run lint:all
```

## Angular MCP

This workspace uses Angular 22 and includes VS Code MCP configuration at `.vscode/mcp.json`.

The Angular CLI MCP server can also be started manually:

```sh
pnpm run mcp:angular
```

The MCP server is a development-tooling bridge for AI assistants. The future in-app MCP dashboard should explain setup and commands; it should not execute arbitrary workspace commands from the browser.

Service-level scripts are also available:

```sh
pnpm run start:architecture-dashboard
pnpm run start:spring-api
pnpm run start:nest-api

pnpm run test:architecture-dashboard
pnpm run test:spring-api
pnpm run test:nest-api

pnpm run lint:architecture-dashboard
pnpm run lint:spring-api
pnpm run lint:nest-api
```

## Locked App Names

- `architecture-dashboard`
- `spring-api`
- `nest-api`
- `postgres`
- `redis`

Keep source files under `apps/`. Docker containers should run the apps from this workspace layout rather than moving source out of the monorepo.
