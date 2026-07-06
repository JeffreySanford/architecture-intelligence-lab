# Zeroheight Governance Workflow

Zeroheight is treated as the design-system documentation and governance surface for this lab. It is not a runtime dependency of the Angular application.

In an enterprise workflow, Zeroheight-style documentation explains what the design system means, why patterns exist, and when teams should use them. Angular and PrimeNG implement those patterns in code.

## Governance Model

```text
Design decision
        ↓
Zeroheight documentation page
        ↓
Token map / component guideline
        ↓
PrimeNG Nora-based implementation
        ↓
Angular route or shared component
        ↓
CI/test/design review evidence
```

## What Belongs In Zeroheight

| Area | Documentation Purpose |
| --- | --- |
| Foundations | Color, typography, spacing, radius, elevation, density, focus. |
| Tokens | Primitive, semantic, component, and app-compatibility aliases. |
| Components | Approved PrimeNG usage, examples, accessibility notes, and do/don't guidance. |
| Patterns | Capital Markets cards, tables, status panels, disclosure workflows, dashboards. |
| Accessibility | Keyboard, focus, contrast, reduced motion, validation, status communication. |
| Engineering links | GitHub/GitLab repo links, Storybook or `/lab/theme`, implementation files. |

## What Does Not Belong In Zeroheight

- production secrets
- client-specific private workflow details
- environment credentials
- internal ticket contents
- undocumented screenshots from restricted systems
- implementation details that belong only in source comments or ADRs

For this public lab, Zeroheight documentation should remain generic and training-oriented.

## Suggested Zeroheight Structure

```text
Architecture Intelligence Lab Design System
├── 01 Overview
│   ├── Purpose
│   ├── Repo links
│   └── Runtime boundaries
├── 02 Foundations
│   ├── Color
│   ├── Typography
│   ├── Spacing
│   ├── Surfaces
│   ├── Radius
│   ├── Elevation
│   └── Focus
├── 03 PrimeNG Nora Theme
│   ├── Preset strategy
│   ├── Primitive tokens
│   ├── Semantic tokens
│   ├── Component tokens
│   └── Light/dark behavior
├── 04 Components
│   ├── Button
│   ├── InputText
│   ├── Select/Dropdown
│   ├── DataTable
│   ├── Card
│   ├── Dialog
│   ├── Message/Toast
│   └── Tag/Badge
├── 05 Capital Markets Patterns
│   ├── Pool summary
│   ├── Commitment status
│   ├── Trade card
│   ├── Disclosure review
│   ├── Audit/history panel
│   └── Realtime event monitor
└── 06 Accessibility
    ├── Keyboard flow
    ├── Focus rings
    ├── Error states
    ├── Contrast
    └── Reduced motion
```

## Token Documentation Template

Each token page should include:

| Field | Example |
| --- | --- |
| Token name | `primary.color` |
| App alias | `--color-primary` |
| Current value | `#355f9f` |
| Purpose | Primary action and active UI affordance. |
| Use for | Primary buttons, active nav, selected state accents. |
| Avoid for | Error state, decorative-only emphasis, dense body text. |
| Accessibility notes | Must maintain contrast against primary contrast text. |
| PrimeNG mapping | `semantic.primary.500` or `primary.color` depending context. |

## Component Documentation Template

Each component page should answer:

1. What is the component for?
2. Which PrimeNG component is approved?
3. Which variants are allowed?
4. Which tokens control it?
5. What accessibility rules apply?
6. What Capital Markets workflow example proves it?
7. What should developers avoid?

Example:

```markdown
# DataTable

## Use For

Use PrimeNG DataTable for pageable, sortable, filterable operational datasets such as pools, loans, securities, disclosures, and event history.

## Required States

- loading
- empty
- populated
- selected row
- hover row
- invalid/error row
- permission-limited row actions

## Accessibility

- preserve visible focus
- provide text labels for status icons
- do not rely on row color alone
- preserve keyboard navigation
```

## Engineering Evidence

Zeroheight-style governance should link to code proof.

| Documentation Claim | Engineering Evidence |
| --- | --- |
| Nora-based PrimeNG preset exists | `architecture-prime-preset.ts` |
| Theme wired into Angular | `app.config.ts` |
| Existing aliases bridged | `_colors.scss` |
| Component examples previewed | future `/lab/theme` route |
| Contract validated | GitLab CI OpenAPI drift check |
| Accessibility considered | tests, checklist, component docs |

## Review Workflow

Use a lightweight review workflow for every design-system change.

1. Update the token/component documentation.
2. Update the token map or PrimeNG preset.
3. Add or update a live example.
4. Run Angular build/test/lint.
5. Confirm light/dark behavior if affected.
6. Confirm keyboard focus and contrast if affected.
7. Link the code change from Zeroheight-style docs.

## Design Governance Rules

- Documentation and implementation must stay aligned.
- PrimeNG token changes require a reason, not just preference.
- New colors must map to a semantic purpose.
- New component variants must solve a repeated workflow need.
- One-off CSS overrides should be documented as exceptions.
- Accessibility regressions block theme acceptance.

## Public Lab Boundary

This documentation should show enterprise design-system maturity without implying knowledge of any private client environment.

Use generic examples:

- Pool Summary
- Commitment Status
- Trade Review
- Disclosure Queue
- Realtime Event Monitor
- Contract Drift Panel

Avoid private system names, private screenshots, and client-specific business rules.
