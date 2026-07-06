# Zeroheight And PrimeNG Theme Governance

Zeroheight is the design-system documentation and governance layer for this lab. It is not an Angular runtime dependency. The Angular application implements the design system through PrimeNG styled-mode tokens, a Nora-based preset, and a temporary app alias bridge for existing `--color-*` variables.

## Working Model

```text
Design intent and product rules
        -> Zeroheight styleguide and governance
        -> Token JSON and PrimeNG Nora preset
        -> Angular PrimeNG components and app CSS variables
        -> Tested lab pages
```

## Documentation Set

| File | Purpose |
| --- | --- |
| `01-zeroheight-overview.md` | Defines governance ownership and the design-system operating model. |
| `02-md3-to-primeng-token-map.md` | Maps existing MD3-style app aliases to PrimeNG Nora semantic tokens. |
| `03-component-guidelines.md` | Defines PrimeNG component usage standards for lab pages. |
| `04-accessibility.md` | Defines the accessibility checklist for token and component changes. |
| `05-onboarding-ramp-up.md` | Defines safe pre-onboarding ramp-up work and learning areas. |
| `06-zeroheight-primeng-theme-governance.md` | Defines the full governance workflow, change process, and validation gates. |

## Source Of Truth

| Concern | Source | Notes |
| --- | --- | --- |
| Approved styleguide content | Zeroheight or this documentation folder | Zeroheight is modeled here until a live styleguide exists. |
| Token export | `design-system/tokens/architecture-tokens.json` | Human-readable token inventory for the lab. |
| MD3 alias map | `design-system/tokens/md3-to-primeng-map.json` | Maps old app aliases to current PrimeNG token paths. |
| Runtime preset | `apps/architecture-dashboard/src/app/core/theme/architecture-prime-preset.ts` | Actual PrimeNG Nora preset used by Angular. |
| Alias bridge | `apps/architecture-dashboard/src/styles/_colors.scss` | Keeps existing page SCSS stable while migration continues. |
| Live preview | `/lab/theme` | Demonstrates token and component behavior in the running app. |

## Zeroheight Responsibilities

- Document approved color, typography, spacing, radius, elevation, density, and focus rules.
- Explain component usage for PrimeNG buttons, inputs, selects, tables, cards, dialogs, tags, messages, and overlays.
- Hold accessibility guidance for contrast, keyboard focus, validation, reduced motion, and table readability.
- Link to Figma, Storybook, GitHub, GitLab, generated tokens, and implementation references where available.
- Capture do and do-not examples for Capital Markets and architecture lab workflows.
- Record change history and decision context when tokens or component standards change.

## PrimeNG Responsibilities

- Implement approved tokens in `ArchitecturePrimePreset`.
- Map primitive palette values into semantic tokens such as primary, surface, text, highlight, form field, content, and focus ring.
- Use component tokens for specific PrimeNG behavior such as button radius, card shadow, data table hover state, and selected rows.
- Keep direct `.p-*` overrides as the last resort when no token exists for the behavior.
- Keep app-owned CSS aliases compatible until page-level SCSS can migrate incrementally.

## Governance Rules

- Token changes must update the JSON token file, PrimeNG preset, and documentation together.
- Component behavior changes must include a note in `03-component-guidelines.md` when they set a reusable pattern.
- Accessibility-impacting changes must be checked against `04-accessibility.md`.
- Runtime changes must be validated with `pnpm nx run architecture-dashboard:test`, `pnpm nx run architecture-dashboard:lint`, and `pnpm nx run architecture-dashboard:build`.
- The `/lab/theme` route should be used as the visual smoke test for token and component changes.

## Free Plan Fit

Zeroheight Free is enough for this lab foundation because the scope is one styleguide, one token set, and a focused developer/design-system workflow. Enterprise features such as multiple token sets, multi-theme governance, SSO, analytics, release approvals, and deeper API or MCP access can be modeled later but are not required for this repo.

## Lab Naming

Recommended styleguide name:

```text
Architecture Intelligence Lab Design System
```

Recommended implementation theme:

```text
PrimeNG Nora Architecture Theme
```
