# 02 Nx Monorepo Structure

## Target Workspace Shape

The target workspace should use Nx as the coordination layer for apps, generated clients, shared contracts, and tests.

```text
architecture-intelligence-lab/
  apps/
    architecture-dashboard/
    spring-api/
    nest-api/
    postgres/
    redis/

  libs/
    generated/
      spring-api-client/
      nest-api-client/
    frontend/
      auth-data-access/
      dashboard-data-access/
      backend-comparison-data-access/
      realtime-data-access/
      openapi-data-access/
      mcp-data-access/
      visualizations/
      ui/
    shared/
      contracts/
      testing/
      visualization-models/

  documentation/
  docker-compose.yml
  nx.json
  package.json
  tsconfig.base.json
```

## Current Workspace Note

The repository should use the final architecture names directly:

- `architecture-dashboard`
- `architecture-dashboard-e2e`
- `nest-api`
- `nest-api-e2e`
- `spring-api`

Do not reintroduce generic scaffold names. New source code should stay under `apps/` unless it belongs in a shared or generated library.

## Infrastructure Apps

`apps/postgres` and `apps/redis` are infrastructure apps inside the Nx workspace. They are not traditional runtime applications with controllers or UI. They hold configuration, initialization, seed data, fixtures, and learning material.

```text
apps/postgres/
  src/
    init/
      001-create-databases.sql
    migrations/
      V1__create_auth_schema.sql
      V2__create_loan_schema.sql
      V3__create_diagnostics_schema.sql
      V4__seed_users_roles_permissions.sql
      V5__seed_loan_domain.sql
    seed/
      users.json
      borrowers.json
      loans.json
      documents.json
      status-codes.json

apps/redis/
  src/
    config/
    examples/
    docs/
```

## Nx Execution Rule

This workspace uses pnpm. Later implementation work should prefer Nx targets through package scripts or direct Nx commands:

```bash
pnpm nx show projects
pnpm nx show project <project>
pnpm nx run <project>:<target>
pnpm nx run-many --target=<target> --all
pnpm nx affected --target=<target>
```

The npm lockfile is intentionally not part of the workspace. Use `pnpm-lock.yaml` as the dependency lockfile.

## Current Phase 5 Structure Note

The first Phase 5 visualization is implemented directly in the Angular app while the surrounding feature libraries are still planned:

```text
apps/architecture-dashboard/src/app/
  core/auth/permission.guard.ts
  features/phase-five/
    phase-five.page.ts
    phase-five.page.html
    phase-five.page.scss
```

Future extraction into `libs/frontend/visualizations` or `libs/shared/visualization-models` is appropriate only when more D3 graphs share node/link models or rendering helpers. Until then, keeping the Phase 5 graph local avoids premature abstraction.

## What This Teaches

- Nx is not just for frontend code. It can organize a whole training system.
- Infrastructure fixtures belong close to the workspace, not hidden in one backend.
- Generated clients should live in libraries and should not be hand-edited.
- Feature libraries make Angular code easier to test and explain.
