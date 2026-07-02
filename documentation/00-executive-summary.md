# 00 Executive Summary

## Vision

`architecture-intelligence-lab` is an interactive full-stack architecture lab. It uses mortgage-like loan data as the teaching domain, but it is not primarily a mortgage application. The loan domain gives us realistic records, statuses, documents, users, permissions, dashboards, and realtime events so the application can teach architectural patterns with concrete examples.

The final app should let a developer open one browser entrypoint, select a persona, choose a dataset size, compare backend paths, inspect Map and Set indexes, watch SignalStore recomputation, trigger realtime Socket.IO events, inspect Redis pub/sub behavior, and understand how OpenAPI-generated clients prevent frontend/backend contract drift.

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

## Final Stack

- Angular 22 standalone frontend
- Angular CLI MCP server for AI-assisted development workflows
- NgRx SignalStore
- Angular Material
- Angular 22 native enter/leave animations
- D3
- Chart.js
- Spring Boot Maven API with Java 21
- NestJS API and Socket.IO gateway
- PostgreSQL
- Redis
- Redis Insight
- pgAdmin
- Nginx serving Angular and proxying APIs
- Swagger/OpenAPI
- OpenAPI-generated Angular clients
- Playwright and service-level tests

## What This Is Not

This is not a production mortgage origination platform. It should not model every real compliance, underwriting, servicing, audit, or financial detail. It is a training system that uses a realistic-enough domain to make architecture concepts visible.

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
- How the test suite proves the full architecture works.

## Grill-Me Questions

- What problem does this app solve as a learning tool?
- Why is the loan domain useful even though the app is not a mortgage product?
- What is the difference between durable persistence and transient coordination?
- Which part of the system owns the official business contract?
