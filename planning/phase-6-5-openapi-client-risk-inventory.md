# Phase 6.5 OpenAPI Client Surface Risk Inventory

## Purpose

Document the remaining risk inventory for the OpenAPI client surface and the generated DTO boundary.

This inventory is intended to support Phase 6.5 security hardening and to drive OpenAPI Contract Lab mitigations.

## Risk areas

### Missing auth headers

- Generated Spring and Nest clients must apply `withCredentials: true` for cookie-based persona auth.
- Any direct use of generated client service methods without the facade layer may accidentally omit credentials.
- The Angular facade should enforce auth header/cookie presence and fail fast when the current persona is not loaded.

### Unsafe response assumptions

- Generated DTO shape mismatches can occur when the backend contract evolves and the frontend code continues to deserialize stale fields.
- The client inventory should mark each generated model as `required`, `optional`, or `deprecated` based on contract semantics.
- Guard against `null` or missing nested properties in the generated contract data by using safe mapping and runtime fallback helpers.

### Generated DTO validation gaps

- The generated clients do not automatically validate business invariants such as `loanAmount > 0` or `status` membership.
- Add a thin validation layer in the facade for critical DTO fields used by the dashboard and contract lab.
- Keep generated DTOs as raw contract data and validate at the facade boundary before projecting into view models.

### Raw contract metadata exposure

- Links to `/v3/api-docs`, `/swagger-json`, and Swagger UI should be accessible only to authorized personas.
- The risk inventory should track whether these endpoints are referenced directly in the UI or only exposed behind guards.
- Avoid showing raw schema URLs in user-facing cards unless the persona has `contracts:view` or `admin:view`.

### Drift monitoring and change alerts

- The OpenAPI Contract Lab should flag the following drift conditions:
  - endpoint removed from the backend contract
  - new required parameter added to an existing operation
  - response schema type changes for critical DTO fields
- For each drift condition, the inventory should note whether the API client generator, facade, or UI needs updates.

## Next steps

- [ ] Cross-reference this inventory with `planning/phase-6-5-security-risk-map.md`
- [ ] Add a `generated client drift watch` item to the admin security monitoring page
- [ ] Create a follow-up task for facade validation on critical DTO fields
- [ ] Document any generated client contract gaps in `documentation/08-openapi-contract-generation.md`
