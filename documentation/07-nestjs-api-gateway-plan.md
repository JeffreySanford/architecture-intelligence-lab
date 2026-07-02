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
| `POST` | `/gateway/realtime/emit-one` | Emit one demo realtime event. |
| `POST` | `/gateway/realtime/emit-burst` | Emit a burst of demo realtime events. |

## Socket Events

| Event | Purpose |
| --- | --- |
| `realtime.connected` | Confirm Socket.IO connection. |
| `loan.status.updated` | Notify Angular about a loan status update. |
| `realtime.metrics` | Send event throughput and cache metrics. |

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

