# Component Usage Guidelines

This document defines how PrimeNG components should be used in the enterprise-inspired design system for `architecture-intelligence-lab`.

The goal is not to demonstrate every PrimeNG component. The goal is to create a stable, reusable set of patterns that fit Capital Markets-style workflows.

## Component Selection Rule

Use PrimeNG components as the default implementation for enterprise UI surfaces. Use custom components to compose domain-specific workflows around PrimeNG, not to reimplement basic UI controls.

```text
PrimeNG component = control behavior and accessibility baseline
Custom Angular component = domain composition and typed ViewModel binding
Design tokens = visual consistency
```

## Global Rules

- Prefer PrimeNG components over custom controls for tables, forms, dialogs, buttons, messages, and status tags.
- Prefer tokens over direct class overrides.
- Keep domain-specific CSS local to the component when it controls layout, spacing, or visualization composition.
- Do not style internal PrimeNG DOM structure unless there is no token or public API alternative.
- Every component pattern must define loading, empty, error, and permission-limited states where relevant.
- Every status treatment must include text or icon support; do not rely on color alone.

## Button

### Use For

- primary workflow actions
- secondary navigation actions
- destructive actions
- toolbar actions
- row-level actions when accessible and not visually overwhelming

### Variants

| Variant | Use |
| --- | --- |
| Primary | Main action on a form or workflow step. |
| Secondary | Support action that does not complete the workflow. |
| Text | Low-emphasis action in dense panels. |
| Danger | Destructive or irreversible action. |
| Icon-only | Toolbar or row action only when accessible label exists. |

### Rules

- One primary action per local workflow section.
- Danger actions require explicit labeling and confirmation when destructive.
- Icon-only buttons must have accessible labels.
- Do not use primary buttons for decorative emphasis.

## Card

### Use For

- dashboard summary panels
- metric groups
- workflow summaries
- read-only record summaries
- Capital Markets status snapshots

### Rules

- Cards should have clear headings.
- Cards should not become nested layout soup.
- Use restrained elevation.
- Use borders and surfaces for hierarchy before heavy shadows.

### Capital Markets Examples

- Pool Summary Card
- Commitment Exposure Card
- Disclosure Readiness Card
- Realtime Event Health Card
- Contract Drift Card

## DataTable

### Use For

- pageable operational datasets
- Capital Markets records
- user/role/access matrices
- audit history
- disclosure queues
- event history

### Required States

| State | Requirement |
| --- | --- |
| Loading | Show progress without layout jump. |
| Empty | Explain whether there is no data or filters removed all results. |
| Error | State what failed and offer a retry path when possible. |
| Hover | Improve scanability without changing meaning. |
| Selected | Must be clear in light and dark modes. |
| Permission-limited | Disabled or hidden actions must be intentional and documented. |

### Rules

- Keep table density readable.
- Use sortable/filterable columns only when the data supports it.
- Do not overload row color with too many meanings.
- Status columns should use Tag/Badge plus text.
- Row actions should not dominate the table.

## InputText And Forms

### Use For

- filters
- search fields
- workflow forms
- admin configuration inputs

### Required States

- default
- hover
- focus
- invalid
- disabled
- readonly
- helper text
- validation message

### Rules

- Labels must remain visible or programmatically available.
- Required fields must be explicit.
- Invalid state should include text, not only red border.
- Focus rings must not be removed.
- Avoid placeholder-only labels.

## Select / Dropdown

### Use For

- finite option lists
- persona selector
- status filter
- workflow stage selector
- environment selector

### Rules

- Do not use Select/Dropdown for large unknown datasets without filtering or autocomplete.
- Provide clear empty state.
- Preserve keyboard access.
- Avoid ambiguous labels such as `Type` without domain context.

## Dialog

### Use For

- confirmation
- focused edit flows
- workflow inspection
- non-routing detail surfaces

### Rules

- Dialog title must explain the task.
- Primary and secondary actions must be clear.
- Destructive confirmations must use danger language.
- Avoid using dialogs for complex multi-step workflows that deserve a route.

## Message And Toast

### Use For

- API success/failure feedback
- validation summaries
- async operation confirmation
- system warnings

### Rules

- Toast is for transient feedback.
- Message/InlineMessage is for persistent local context.
- Critical errors should not disappear only as toast.
- Success messages should be concise.

## Tag / Badge

### Use For

- status
- severity
- role/permission labels
- workflow phase
- data freshness

### Severity Examples

| Severity | Example |
| --- | --- |
| Success | Synced, Active, Passed, Approved. |
| Info | Draft, In Review, Queued. |
| Warning | Needs Review, Stale, Partial. |
| Danger | Failed, Blocked, Rejected. |

### Rules

- Pair severity with text.
- Avoid inventing new colors for every status.
- Use consistent status vocabulary across screens.

## Sidebar / Navigation

### Use For

- lab sections
- permission-controlled routes
- architecture learning areas

### Rules

- Navigation should reflect permission state.
- Hidden routes must still be guarded at route level.
- Active route should be visually obvious.
- Do not rely on icons alone.

## Chart And D3 Integration

PrimeNG handles application chrome and operational UI. D3 and Chart.js handle visualization surfaces.

### Rules

- Charts should use design-system colors.
- Axes, labels, legends, and tooltips must remain readable.
- Color palettes must support accessibility.
- Visual encoding should use shape, labels, and position in addition to color.
- Motion should respect reduced-motion preferences.

## Future `/lab/theme` Preview

A future route should validate the design system with live examples.

Suggested route:

```text
/lab/theme
```

Suggested sections:

1. Foundations preview
2. PrimeNG controls preview
3. Form state preview
4. DataTable state preview
5. Capital Markets card preview
6. Status/severity preview
7. Light/dark mode preview
8. Accessibility checklist

## Pull Request Checklist

Before merging a UI/design-system change:

- Does the change use PrimeNG tokens or app aliases instead of hard-coded CSS?
- Does the component have loading, empty, and error states where needed?
- Is focus visible?
- Is text contrast acceptable?
- Are status colors paired with text or icon meaning?
- Does the change work in light and dark mode if affected?
- Is the Zeroheight-style documentation updated if token/component guidance changed?
- Is the implementation validated with Angular build/test/lint?

## Decision Boundary

A component pattern becomes part of the design system only when it is reusable across more than one workflow or represents a core product behavior.

One-off visual choices should remain local until they prove reusable.
