# 16 Realtime Socket.IO And Redis Lab

## Purpose

The realtime lab shows how an event travels from NestJS through Socket.IO, optionally through Redis pub/sub, into Angular SignalStore state, and finally into cards, tables, and charts.

## Flow

```mermaid
sequenceDiagram
  participant User
  participant Angular
  participant Nest
  participant Redis
  participant Store as SignalStore
  participant UI

  User->>Angular: Click emit one event
  Angular->>Nest: POST /gateway/realtime/emit-one
  Nest->>Redis: Publish loan.status.updated
  Redis-->>Nest: Pub/sub delivery
  Nest-->>Angular: Socket.IO loan.status.updated
  Angular->>Store: Copy-on-write Map update
  Store-->>UI: Computed ViewModels update
```

## Controls

| Control | Purpose |
| --- | --- |
| Emit one event | Demonstrate one loan status update. |
| Emit burst | Demonstrate multiple events and throughput. |
| Pause | Stop applying events while still showing queue behavior. |
| Resume | Apply queued events. |
| Reset | Restore demo baseline. |

## State Update Rule

Use copy-on-write updates for Map state:

```ts
const nextLoansById = new Map(currentLoansById);
nextLoansById.set(event.loanId, updatedLoan);
```

This keeps signal dependency tracking predictable.

## What This Teaches

- Realtime events can patch client state without full reloads.
- Redis pub/sub coordinates event delivery but does not store durable history.
- SignalStore computed state can update cards, tables, and charts together.
- Burst controls make throughput and UI recomputation visible.

