# Architecture Intelligence Lab

`architecture-intelligence-lab` is a Docker-first Nx training lab for exploring Angular standalone architecture, NgRx SignalStore, Spring Boot, NestJS, PostgreSQL, Redis, OpenAPI contracts, and full-stack testing.

Read the architecture documentation and planning checkpoint first:

- [Documentation overview](documentation/README.md)
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
