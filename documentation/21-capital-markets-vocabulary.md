# 21 Capital Markets Vocabulary

## Purpose

This document locks the shared Capital Markets vocabulary for frontend ViewModels, backend DTOs, generated OpenAPI contracts, database seed data, PrimeNG screens, D3 topology labels, tests, and planning documents.

The goal is not to model a production trading, disclosure, or mortgage platform. The goal is to give the lab a consistent enterprise domain language that is realistic enough to make architecture choices visible.

## Core Concepts

| Concept | Meaning In This Lab | Primary UI Use | API Boundary |
| --- | --- | --- | --- |
| `Security` | A mortgage-backed security or study security row that groups pool, coupon, balance, status, and disclosure metadata. | Security search, disclosure inspection, comparison rows. | Spring source-of-truth DTO, Nest comparison DTO, generated Angular client model. |
| `Pool` | A grouped set of loans backing a security. | Pool dashboard, security detail dialog, disclosure metadata. | Spring source-of-truth DTO and security detail response. |
| `Loan` | A simplified loan record used as source material for pool and dashboard examples. | Dashboard cards, Map inspector, pool composition. | Existing Spring dashboard DTOs and future pool detail DTOs. |
| `Borrower` | A simplified borrower/person entity linked to loans. | Dashboard joins, fallback row tests, pool detail. | Spring dashboard DTO and generated Angular client model. |
| `DisclosureFile` | A file or package of disclosure metadata associated with a security or pool. | Disclosure file inspector, row actions, status tags. | Spring source-of-truth DTO and Nest proxy/comparison DTO. |
| `Commitment` | A commitment workflow record for delivery, settlement, pricing, or status tracking. | Commitment queue, status filters, role-sensitive actions. | Spring source-of-truth DTO and Nest gateway DTO. |
| `TradeEvent` | A realtime business event, such as status, settlement, price, or disclosure updates. | Socket.IO history table, D3 active path, realtime panels. | Nest Socket.IO event DTO and HTTP event history DTO. |
| `BackendComparisonMetric` | A measured or mock comparison result for Spring direct, Nest direct, and Nest proxy paths. | Phase 5 metrics table and D3 selected path state. | Nest comparison endpoint DTO. |
| `ContractSnapshot` | A generated-contract health record summarizing OpenAPI endpoints, generated clients, drift, and status. | OpenAPI Contract Lab, generated client status, drift warnings. | Spring/Nest OpenAPI metadata DTO and Angular contract facade model. |

## Relationship Model

```mermaid
classDiagram
  class Security {
    +string securityId
    +string cusip
    +string poolId
    +number coupon
    +number currentBalance
    +string status
    +date issueDate
    +date settlementDate
  }

  class Pool {
    +string poolId
    +string poolNumber
    +number loanCount
    +number unpaidPrincipalBalance
    +string status
  }

  class Loan {
    +string loanId
    +string borrowerId
    +string poolId
    +number principalBalance
    +string statusCode
  }

  class Borrower {
    +string borrowerId
    +string displayName
    +string state
    +number creditBand
  }

  class DisclosureFile {
    +string disclosureFileId
    +string securityId
    +string fileType
    +string deliveryState
    +date publishedAt
  }

  class Commitment {
    +string commitmentId
    +string securityId
    +string counterparty
    +string workflowStatus
    +date settlementDate
  }

  class TradeEvent {
    +string eventId
    +string eventType
    +string securityId
    +string pathId
    +date occurredAt
  }

  class BackendComparisonMetric {
    +string pathId
    +string pathLabel
    +number latencyMs
    +string status
    +date measuredAt
  }

  class ContractSnapshot {
    +string snapshotId
    +string apiName
    +string generatedClient
    +string driftStatus
    +date capturedAt
  }

  Security "1" --> "1" Pool
  Pool "1" --> "*" Loan
  Loan "*" --> "1" Borrower
  Security "1" --> "*" DisclosureFile
  Security "1" --> "*" Commitment
  Security "1" --> "*" TradeEvent
  TradeEvent "*" --> "*" BackendComparisonMetric
  ContractSnapshot "*" --> "*" BackendComparisonMetric
```

## Runtime Flow

```mermaid
flowchart LR
  Spring[Spring source-of-truth API] --> OpenAPI[Spring OpenAPI]
  OpenAPI --> Generated[Generated Angular client]
  Generated --> Facade[Angular data facade]
  Facade --> Store[Signal store and computed ViewModels]
  Store --> PrimeNG[PrimeNG tables, filters, dialogs]

  Nest[Nest comparison and realtime API] --> Metrics[BackendComparisonMetric]
  Nest --> Events[TradeEvent history]
  Metrics --> Phase5[Phase 5 D3 and PrimeNG view]
  Events --> Phase5
```

## DTO Boundary Rules

- Backend DTOs should use the domain nouns in this document instead of generic table names.
- Angular generated clients should stay behind facades.
- PrimeNG components should receive ViewModels such as `SecuritySearchRowVm`, not raw generated DTOs.
- D3 components should receive typed graph nodes and links derived from these concepts.
- Tests should use these names in fixtures so failures teach the domain model.

## Initial Screen Mapping

| Screen | Primary Concepts | Notes |
| --- | --- | --- |
| `/lab/dashboard` | `Loan`, `Borrower`, `Pool` | Existing dashboard remains the DTO-to-ViewModel mapping lab. |
| `/lab/security-search` | `Security`, `Pool`, `DisclosureFile`, `Commitment` | Implemented PrimeNG-heavy table screen with lazy query state, filters, row actions, detail dialog, and export placeholder. |
| `/lab/backend-comparison` | `BackendComparisonMetric`, `TradeEvent`, `ContractSnapshot` | Phase 5 comparison, realtime, and contract topology. |
| Future disclosure inspector | `DisclosureFile`, `Security`, `ContractSnapshot` | Should show generated contract and file metadata boundaries. |
| Future commitment queue | `Commitment`, `Security`, `TradeEvent` | Should focus on workflow status, filters, row actions, and audit state. |
