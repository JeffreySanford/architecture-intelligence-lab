# 07 NestJS API Gateway Plan

## Purpose

NestJS provides comparison, gateway, realtime, diagnostics, and its own OpenAPI contract. It is not the source of truth for business writes in v1.

## Target Responsibilities

| Responsibility | Description |
| --- | --- |
| Direct PostgreSQL read | Read loan data directly for comparison. |
| Proxy-to-Spring | Forward requests to Spring and measure proxy path behavior. |
| Comparison endpoint | Return Spring direct, Nest direct, and Nest proxy metrics. |
| Socket.IO gateway | Emit realtime loan status events to Angular. |
| Redis adapter | Demonstrate pub/sub scaling pattern. |
| Swagger/OpenAPI | Expose Nest contract for diagnostics and generated clients. |
| Diagnostics | Report gateway health, Redis health, cache state, and timing data. |

## Core Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/gateway/health` | Nest health check. |
| `GET` | `/gateway/loans/direct` | Read loan data directly from PostgreSQL. |
| `GET` | `/gateway/loans/proxy` | Proxy loan request to Spring Boot. |
| `GET` | `/gateway/comparison/loans` | Compare all backend modes. |
| `POST` | `/gateway/realtime/loan-status` | Emit one demo loan status realtime event. |
| planned | `/gateway/realtime/emit-burst` | Future backend endpoint for server-side burst emission; the current Angular lab simulates burst mode with repeated `loan-status` calls. |

## Comparison Response Contract

The comparison endpoint should return frontend-ready metric rows that can drive the Phase 5 PrimeNG table and D3 path highlighting without shape guessing.

Minimum row fields:

| Field | Purpose |
| --- | --- |
| `pathId` | Stable id such as `spring-direct`, `nest-direct`, or `nest-proxy`. |
| `label` | Human label for table display. |
| `latencyMs` | End-to-end backend measurement when available. |
| `payloadBytes` | Serialized response size. |
| `recordCount` | Number of returned records. |
| `status` | `ok`, `warning`, or `error`. |
| `errorMessage` | Error details when a path fails. |
| `observedAt` | Timestamp for trend and event correlation. |

`pathId` should match the Angular Phase 5 graph link model so a selected metric row can highlight its request path.

## Socket Events

| Event | Purpose |
| --- | --- |
| `realtime.connected` | Confirm Socket.IO connection. |
| `loan.status.updated` | Notify Angular about a loan status update. |
| `realtime.metrics` | Send event throughput and cache metrics. |

Realtime emit endpoints should return an event id. Socket.IO events should include the same id so Angular can correlate the POST response, event history row, D3 path highlight, and eventual state patch.

Minimum realtime event fields:

| Field | Purpose |
| --- | --- |
| `eventId` | Correlation id for POST response and Socket.IO event. |
| `loanId` | Updated loan. |
| `oldStatus` | Previous status code when available. |
| `newStatus` | New status code. |
| `emittedAt` | Server timestamp. |
| `deliveryState` | `emitted`, `received`, `applied`, or `failed`. |
| `errorMessage` | Error details when delivery or patching fails. |

## Module Boundaries

```text
apps/nest-api/src/
  main.ts
  app.module.ts
  features/
    loans/
    auth/
    diagnostics/
    realtime/
    comparison/
    redis/
    spring-proxy/
```

## What This Teaches

- A gateway can add value through routing, metrics, and realtime behavior.
- Direct reads and proxy reads reveal different tradeoffs.
- Socket.IO events should patch client state, not blindly refetch everything.
- Nest OpenAPI is useful even when Spring owns the official business contract.
- Gateway response shapes should be designed for visualization and diagnostics, not just raw data transport.
