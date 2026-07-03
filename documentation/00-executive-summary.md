# 00 Executive Summary

## Vision

`architecture-intelligence-lab` is an interactive full-stack architecture lab. It uses loan, pool, security, commitment, disclosure, permission, and realtime event data as the teaching domain, but it is not a production mortgage or trading platform. The domain gives us realistic records, statuses, documents, users, permissions, dashboards, and realtime events so the application can teach architectural patterns with concrete examples.

The final app should let a developer open one browser entrypoint, select a persona, choose a dataset size, inspect Capital Markets-style security and disclosure workflows, compare backend paths, inspect Map and Set indexes, watch SignalStore recomputation, trigger realtime Socket.IO events, inspect Redis pub/sub behavior, and understand how OpenAPI-generated clients prevent frontend/backend contract drift.

Phase 5 adds the first visualization-first control surface for this learning model. `/lab/backend-comparison` uses D3 to show the Spring direct, Nest direct, Nest proxy, comparison, Socket.IO, Redis, and Swagger topology, and it uses PrimeNG tables to show deliverables, acceptance criteria, and role access. The page is intentionally useful before every backend endpoint exists, then live metrics and events should bind into the same visual model.

## What This Teaches

| Topic | What the lab demonstrates |
| --- | --- |
| Docker Compose | One command starts the educational system and its infrastructure. |
| Nx | Frontend, backends, infrastructure assets, generated clients, and tests live in one coordinated workspace. |
| Spring Boot | Source-of-truth business API, Flyway schema ownership, DTO contracts, persona auth. |
| NestJS | Gateway behavior, comparison API, direct read paths, Socket.IO realtime events. |
| PostgreSQL | Durable source of truth for users, roles, loans, documents, metrics, and contract snapshots. |
| Redis | Transient pub/sub, short TTL cache, realtime scaling pattern, educational inspection. |
| Angular standalone | Enterprise feature boundaries without NgModules. |
| NgRx SignalStore | Signals-native state, computed ViewModels, event-driven updates. |
| Map and Set | Efficient lookup, grouping, permission checks, and dashboard projection. |
| OpenAPI | Generated Angular models and services reduce API/frontend drift. |
| Testing | Unit, integration, contract, and Playwright tests validate the full learning path. |
| Visualization methodology | D3 explains topology and active paths; PrimeNG explains status, metrics, event history, and access. |

## Final Stack

- Angular 22 standalone frontend
- Angular CLI MCP server for AI-assisted development workflows
- NgRx SignalStore
- PrimeNG 22 RC aligned to Angular 22, with local validation required before relying broadly on new APIs
- Angular 22 native enter/leave animations
- D3
- Chart.js
- Spring Boot Maven API with Java 17 in the current build
- NestJS API and Socket.IO gateway
- PostgreSQL
- Redis
- Redis Insight
- pgAdmin
- Nginx serving Angular and proxying APIs
- Swagger/OpenAPI
- OpenAPI-generated Angular clients
- Playwright and service-level tests

## Compatibility Strategy

This repo keeps the modern study stack in the current branch. That is useful for learning current Angular, Nx, TypeScript, and Spring direction. The enterprise baseline to be able to discuss is Angular 18/19/20, PrimeNG 18/19/20/21, Java 17/21, Spring Boot 3.x, PostgreSQL, Docker, and OpenAPI. PrimeNG alignment is now resolved for the modern branch with `primeng@22.0.0-rc.1`; the remaining work is local validation and, if needed later, a separate stable enterprise branch for conservative dependency practice.

## What This Is Not

This is not a production mortgage origination, trading, or disclosure platform. It should not model every real compliance, underwriting, servicing, audit, trading, or financial detail. It is a training system that uses a realistic-enough Capital Markets vocabulary to make architecture concepts visible.

This is also not a Kubernetes lab in v1. Docker Compose is the correct target because each container maps clearly to a concept the learner can inspect.

## Learning Outcomes

By the end of the project, a developer should be able to explain:

- Why Spring Boot owns durable writes and the source-of-truth API.
- Why NestJS is valuable as a comparison, gateway, and realtime service.
- Why Redis is not the durable source of truth.
- How Flyway protects database schema evolution.
- How OpenAPI generation protects API/frontend contracts.
- How Angular standalone apps can still have clean enterprise boundaries.
- How SignalStore turns DTOs into computed ViewModels.
- Why `Map` and `Set` matter for dashboard performance and clarity.
- How Socket.IO events update keyed state without refetching everything.
- How role-aware visualizations make diagnostics, realtime, and contract permissions visible.
- How the test suite proves the full architecture works.

## Grill-Me Questions

- What problem does this app solve as a learning tool?
- Why are loan, pool, security, commitment, and disclosure concepts useful even though the app is not a production financial platform?
- What is the difference between durable persistence and transient coordination?
- Which part of the system owns the official business contract?
