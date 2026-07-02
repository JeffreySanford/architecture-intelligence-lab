# 04 Postgres, Flyway, And Seed Data

## Purpose

PostgreSQL is the durable source of truth. It stores user/persona data, role permissions, loan records, documents, status history, backend metrics, and contract snapshots.

Flyway protects database schema evolution. OpenAPI protects API/frontend contracts. These solve different drift problems and both are needed.

## Target Folder Layout

```text
apps/postgres/src/
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
```

## Dual Seed Format

SQL migrations are the execution source. They are what Flyway runs.

JSON seed files are educational fixtures. They make the domain easier to inspect, discuss, and reuse in docs or tests. The JSON fixtures can mirror the SQL seed content, but they should not become a second source of truth during runtime.

## Core Tables

| Table | Purpose |
| --- | --- |
| `users` | Demo users tied to personas. |
| `roles` | Role labels such as Reviewer or Admin. |
| `permissions` | Fine-grained permission strings. |
| `user_roles` | Many-to-many user/role assignment. |
| `role_permissions` | Many-to-many role/permission assignment. |
| `personas` | Demo persona selector records. |
| `borrowers` | Borrower profile data. |
| `loans` | Main loan records. |
| `loan_documents` | Document metadata linked to loans. |
| `loan_status_codes` | Status lookup table. |
| `loan_status_events` | Durable status history. |
| `backend_metrics` | Request comparison measurements. |
| `contract_snapshots` | OpenAPI contract snapshot metadata. |

## Dataset Sizes

| Size | Loan count | Purpose |
| --- | ---: | --- |
| Small | 25 | Quick demo and debugging. |
| Medium | 500 | Normal dashboard behavior. |
| Large | 5,000 | Map and computed ViewModel performance. |
| Stress | 50,000 | Explicit stress mode for performance teaching. |

## What This Teaches

- Database migrations are executable documentation.
- Seed data can be both runnable and readable.
- Schema drift and API drift are different risks.
- Large datasets make Map indexing benefits visible.

