# 06 Spring Boot API Plan

## Purpose

Spring Boot is the source-of-truth backend. It owns durable business writes, Flyway migration execution, DTO contracts, persona cookie auth, and the official Spring OpenAPI document.

## Target Stack

- Java 17 in the current Maven build
- Maven
- Spring Web
- Spring Security
- Spring Data JPA
- PostgreSQL driver
- Flyway
- springdoc-openapi
- JWT signing for httpOnly cookies

Enterprise note: Java 17/21 with Spring Boot 3.x is the conservative baseline to be able to discuss. This repo currently keeps the modern Spring Boot 4.x study track while using Java 17 locally.

## Source-Of-Truth Rule

Controllers return DTOs, not JPA entities. The DTOs define the API contract. The OpenAPI document is generated from endpoints and DTO shapes. Angular clients are generated from OpenAPI and wrapped by data-access facades.

## Core Endpoints

Current checkpoint: the minimal training API is live with `/api/health`, `/api/personas`, `/api/me`, `/api/dev-auth/personas/{personaId}/select`, and `/api/dashboard/snapshot?dataset=small`.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Return basic Spring API health. |
| `POST` | `/api/dev-auth/personas/{personaId}/select` | Select demo persona and set httpOnly demo cookie. |
| `POST` | `/api/auth/logout` | Clear auth cookie. |
| `GET` | `/api/me` | Return current user, roles, permissions. |
| `GET` | `/api/personas` | List selectable demo personas. |
| `GET` | `/api/loans` | List loans for selected dataset size. |
| `GET` | `/api/borrowers` | List borrowers. |
| `GET` | `/api/documents` | List loan documents. |
| `GET` | `/api/status-codes` | List status lookup codes. |
| `GET` | `/api/dashboard/snapshot` | Return joined dashboard DTO payload. |
| `POST` | `/api/admin/loans/{loanId}/status` | Update loan status and append durable event. |

## Main DTOs

| DTO | Purpose |
| --- | --- |
| `CurrentUserDto` | Current persona, roles, permissions. |
| `PersonaDto` | Persona selector card data. |
| `BorrowerDto` | Borrower profile. |
| `LoanDto` | Loan detail data. |
| `LoanDocumentDto` | Document metadata. |
| `LoanStatusCodeDto` | Status lookup. |
| `LoanStatusEventDto` | Status history event. |
| `DashboardSnapshotDto` | Batched dashboard data. |
| `BackendComparisonResultDto` | Comparison metric response. |
| `ContractSummaryDto` | OpenAPI contract summary metadata. |

## Persona Auth

The persona endpoint is demo-only and should be enabled only in the Docker demo profile. In production-like profiles, demo persona selection must be disabled.

The endpoint sets:

```text
Set-Cookie: access_token=...; HttpOnly; SameSite=Lax
```

Angular calls `/api/me` to learn who the current user is. Angular never reads the JWT directly.

Current implementation: Spring issues an HMAC-signed demo `access_token` for the selected persona. This is still demo auth, not production identity; replace the selector with real IdP-backed auth before public exposure.

## Current Schema Checkpoint

Flyway migration `V1__create_lab_seed.sql` currently creates users, roles, permissions, personas, role joins, borrowers, loan status codes, loans, and loan documents. It also seeds the documented personas and a Small dashboard dataset.

## What This Teaches

- DTOs are the API contract boundary.
- JPA entities should not leak into the browser contract.
- Flyway belongs near the source-of-truth backend startup.
- httpOnly cookies demonstrate a safer browser auth model than localStorage tokens.
