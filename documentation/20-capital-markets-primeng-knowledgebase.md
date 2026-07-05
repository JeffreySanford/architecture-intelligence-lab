# 20 Capital Markets And PrimeNG Knowledgebase

## Purpose

This note captures the Capital Markets and PrimeNG study context for the lab. The goal is not to model Fannie Mae production systems. The goal is to give the training app realistic Fannie Mae-style vocabulary, workflow state, DTO shapes, and UI patterns that map to data-heavy enterprise Angular work.

## Capital Markets Study Scope

Capital markets work should be represented as workflow-driven, data-heavy UI rather than generic finance screens.

Core domain terms to reinforce:

- MBS and UMBS
- security
- pool
- loan-level data
- disclosure
- commitment
- mandatory commitment
- best efforts commitment
- whole loan execution
- MBS execution
- pricing grid
- guaranty fee
- TBA
- dollar roll
- settlement
- correction
- audit history

The practical developer model is:

```text
home loans -> pools -> securities -> disclosures -> investor/search/export workflows
```

The lab should keep the domain to developer depth. It should teach enough vocabulary for tickets, DTOs, routes, filters, state transitions, and table rows to make sense without trying to become a quant, trading, compliance, or mortgage-accounting product.

## Workflow Shapes

Capital markets screens should emphasize explicit state machines and audit-friendly transitions.

Example commitment lifecycle:

```text
Draft -> Priced -> Committed -> Delivered -> Settled
```

Example validation lifecycle:

```text
Pending -> Validated -> Failed Validation -> Resubmitted -> Accepted
```

Example disclosure lifecycle:

```text
Generated -> Issued -> Corrected -> Superseded
```

Buttons, row actions, and form submissions should be driven from business state. A button should represent a domain action such as create commitment, validate loan eligibility, submit trade, download disclosure, export pricing grid, or correct disclosure metadata.

## PrimeNG Fit

PrimeNG is the preferred UI component layer for this lab because the target screens are enterprise workflow screens:

- securities and pools tables
- commitment status queues
- pricing grids
- disclosure file lists
- validation result tables
- row action menus
- filters for dates, status, product, coupon, and disclosure state
- export/download workflows

Angular Material remains useful for strict Material Design apps, but PrimeNG gives stronger out-of-the-box coverage for data-heavy business screens. The lab should spend engineering effort on DTO mapping, state, contracts, permissions, and workflow correctness instead of rebuilding table plumbing.

Recommended PrimeNG components to study first:

- `p-table`
- `p-columnFilter`
- `p-tag`
- `p-button`
- `p-splitButton`
- `p-menu`
- `p-dialog`
- `p-confirmDialog`
- `p-toast`
- `p-toolbar`
- `p-tabs`
- `p-select`
- `p-multiSelect`
- `p-autoComplete`
- `p-datepicker`
- `p-inputNumber`
- `p-skeleton`

## Current Version Note

The repository now declares `primeng` as `22.0.0-rc.1` while Angular packages are pinned to `22.0.5`. `@angular/cdk` is installed as the required PrimeNG peer dependency. Public PrimeNG documentation for the v21 line lists PassThrough attributes, unstyled mode, CSS-based animations, and initial zoneless support, while the v22 release-candidate line is the current Angular 22-aligned path for this branch.

This means the lab has two separate concerns:

- Current implementation: existing PrimeNG module imports and component usage have been migrated and validated against `primeng@22.0.0-rc.1`.
- Current branch strategy: keep Angular 22/Nx 23 beta as the modern lab stack and use the Angular 22-aligned PrimeNG RC line.
- Enterprise baseline strategy: be able to discuss Angular 18/19/20 with PrimeNG 18/19/20/21, Java 17/21, Spring Boot 3.x, PostgreSQL, Docker, and OpenAPI.
- Future upgrade work: move from PrimeNG 22 RC to a stable PrimeNG 22 release when published and validate API/style differences.

Current build/test validation passes for the app's existing PrimeNG usage. Continue validating each new PrimeNG 22 API or component as it is introduced because the dependency is still an RC.

PrimeNG 22 RC also includes PrimeUI license verification code. The lab now uses a local ignored `.env` value named `PRIMEUI_LICENSE_KEY`, syncs it into ignored runtime config at `apps/architecture-dashboard/public/env.js`, and passes that value through `providePrimeNG({ license })`. Keep `.env` and generated `env.js` out of source control; update `.env.example` only with placeholder names.

## PrimeIcons Note

PrimeIcons is available in this repo through the `primeicons` package and the global `primeicons/primeicons.css` import in `apps/architecture-dashboard/src/styles.scss`. Use PrimeIcons as the default Phase 13 icon set for PrimeNG-heavy workflow screens because it aligns with PrimeNG components and keeps dense enterprise UI scannable without introducing another visual language.

For the current app, use the class-based form such as `pi pi-search`, `pi pi-filter`, `pi pi-eye`, `pi pi-download`, `pi pi-check-circle`, `pi pi-exclamation-triangle`, `pi pi-database`, `pi pi-server`, `pi pi-wifi`, and `pi pi-code`. PrimeNG components may still use custom icon templates when a PrimeIcon does not represent the domain concept clearly.

Use icons in Capital Markets and architecture-lab screens where they reduce scanning cost: route navigation, table filters, row actions, status tags, commitment/disclosure state, realtime/cache state, API contract panels, security controls, and architecture graph legends. Pair status icons with text, give icon-only controls accessible labels, and hide decorative icons from assistive technology.

Migration notes from the Angular 22 alignment:

- `primeng/dropdown` is replaced by `primeng/select` and `<p-select>`.
- `primeng/inputswitch` is replaced by `primeng/toggleswitch` and `<p-toggleSwitch>`.
- Old `primeng/resources/...` CSS imports are replaced by `providePrimeNG` plus an `@primeuix/themes` preset.
- Tag severity uses `warn`, not `warning`.
- Obsolete table/card inputs such as `responsiveLayout` and card `styleClass` should not be used unless confirmed against v22 typings.

## Current View Review

Prime UI coverage by Angular route:

- Landing: `p-select`, `p-toggleSwitch`, `p-card`, `p-chip`, and Prime buttons drive persona, dataset, backend mode, and explain-mode setup.
- Lab shell: Prime buttons are used for navigation actions while route guards own access behavior.
- Dashboard: loan cards and the loan table use Prime cards, chips, and table rendering over `DashboardStore` ViewModels.
- Map Inspector: Prime cards and table expose computed Map/Set state.
- Infrastructure: Prime cards, progress spinner, status tag, and tables now render health, links, route map, and compose port mapping.
- Capital Markets: Prime select, input, tags, card, and table render commitment and disclosure workflow examples.
- Security Search: the strongest Prime UI study screen, with lazy table state, filters, tags, row actions, detail dialog, loading, and empty states.
- Phase 5 Backend Comparison: Prime cards, tags, chips, and status tables pair with D3 topology for comparison/realtime methodology.
- Placeholder routes: Prime card and chips keep unimplemented surfaces visually consistent without adding fake workflows.

Recommended next Prime UI upgrades:

- Add `p-toolbar` and row action menus to Security Search once real generated API data replaces deterministic facade data.
- Add `p-columnFilter`, `p-multiSelect`, `p-datepicker`, and `p-inputNumber` to Capital Markets and Security Search where the typed query state is ready.
- Add `p-toast` and `p-confirmDialog` around export, disclosure correction, and event emit actions once those actions are no longer placeholders.
- Keep Phase 5 native status tables only where the current PrimeNG RC table projection is unstable; continue using Prime cards/tags/chips for the surrounding operational UI.

## Highest-Value Next Screen

The first PrimeNG-heavy feature is `/lab/security-search`.

Implemented capabilities:

- Lazy `p-table` loading
- Server-side-style paging state through a typed facade
- Server-side-style sorting state through a typed facade
- Status filters for commitment/disclosure state
- Date filters for issue and settlement dates
- Numeric filters for coupon, balance, or amount
- Row action buttons
- Detail dialog
- Export action
- Loading, empty, and error states

This screen was built before additional broad D3 work because it maps more directly to enterprise Capital Markets Angular work. The next improvement is to replace the deterministic local facade data with generated-client-backed API data.

## DTO And ViewModel Vocabulary

Use these names when shaping future contracts and UI examples:

- `SecurityDto`
- `PoolDto`
- `LoanDto`
- `CommitmentDto`
- `DisclosureFileDto`
- `PricingGridDto`
- `TradeDto`
- `ValidationResultDto`
- `SecuritySearchRowVm`
- `CommitmentDetailVm`
- `DisclosureDownloadVm`
- `PricingGridVm`
- `TradeReviewVm`

Preferred state flow:

```text
API DTOs -> typed facade state -> derived view models -> PrimeNG components
```

PrimeNG should render state. It should not own business logic.

## PrimeNG Table State Pattern

The `SecuritySearch` practice screen should use lazy table state rather than local template filtering for production-like behavior.

Pattern:

```text
p-table lazy event -> typed query state -> API/facade request -> row view models -> p-table render
```

Query state should include:

- `first`
- `rows`
- `sortField`
- `sortOrder`
- filters for status, coupon, issue date, settlement date, and disclosure status

Rows should show:

- security id
- pool number
- coupon
- commitment status
- disclosure status
- settlement date
- unpaid principal balance or amount
- audit-friendly metadata such as effective date, file version, correction status, and source system

## Guardrails

- Keep the lab scoped to architecture learning, not full mortgage compliance.
- Use precise number, date, percent, currency, and basis-point formatting.
- Avoid floating-point shortcuts for financial calculations when calculations become part of the UI.
- Keep permissions and action enablement derived from state and roles.
- Prefer server-side pagination, sorting, and filtering for large table examples.
- Avoid embedding complex filter and mapping logic directly in Angular templates.
