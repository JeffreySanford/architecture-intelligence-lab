# Zeroheight To PrimeNG Theme Governance

This is the full design-system workflow for the lab. Zeroheight is the documentation and governance layer. PrimeNG is the implementation layer. The Angular runtime uses `ArchitecturePrimePreset`, PrimeNG styled mode, and the `_colors.scss` alias bridge.

## Clean Mental Model

```text
Design intent
        -> Zeroheight or repo design-system documentation
        -> Token JSON
        -> PrimeNG Nora preset
        -> PrimeNG CSS variables
        -> Angular pages and components
        -> Tests, lint, build, and visual smoke checks
```

## Current Repo State

| Concern | Current implementation |
| --- | --- |
| PrimeNG base theme | Nora via `@primeuix/themes/nora` |
| Custom preset | `ArchitecturePrimePreset` |
| Runtime provider | `providePrimeNG()` in `apps/architecture-dashboard/src/app/app.config.ts` |
| Dark mode selector | `.app-dark` |
| Legacy alias bridge | `apps/architecture-dashboard/src/styles/_colors.scss` |
| Token docs | `design-system/tokens/architecture-tokens.json` |
| Alias map | `design-system/tokens/md3-to-primeng-map.json` |
| Preview route | `/lab/theme` |
| Route permission | `developer:view` |

## Responsibilities

| Layer | Owns | Does not own |
| --- | --- | --- |
| Zeroheight or repo docs | Intent, usage rules, examples, accessibility guidance, change history. | Runtime component styling. |
| Token JSON | Portable token inventory and mappings. | Angular execution. |
| PrimeNG preset | Runtime primitive, semantic, and component tokens. | Product copy and workflow decisions. |
| Alias bridge | Temporary compatibility for existing app SCSS. | New design-system semantics. |
| Angular pages | Layout, workflow, and component composition. | Global theme definitions. |

## Token Architecture

PrimeNG tokens have three important layers:

```text
primitive tokens  = raw palette values
semantic tokens   = meaning: primary, surface, focus ring, text, danger, content, form field
component tokens  = specific component styling: button, input, table, card
```

Use the layers this way:

- Primitive tokens define the approved palette.
- Semantic tokens define shared meaning across components.
- Component tokens tune one PrimeNG component family.
- App CSS classes handle layout and domain-specific composition.
- Direct `.p-*` overrides are last-resort exceptions and must be documented.

## Angular Implementation Pattern

The app already follows this pattern:

```ts
import { providePrimeNG } from 'primeng/config';
import { ArchitecturePrimePreset } from './core/theme/architecture-prime-preset';

export const appConfig = {
  providers: [
    providePrimeNG({
      theme: {
        preset: ArchitecturePrimePreset,
        options: {
          darkModeSelector: '.app-dark',
        },
      },
    }),
  ],
};
```

`ArchitecturePrimePreset` extends Nora through `definePreset(Nora, ...)` and supplies:

- `primitive.blue`, `primitive.slate`, and `primitive.red`
- `semantic.primary`
- `semantic.focusRing`
- `semantic.content`
- `semantic.formField`
- light and dark `colorScheme`
- component tokens for button, card, and data table

## Alias Bridge Policy

The bridge in `_colors.scss` exists to avoid a risky all-at-once page SCSS rewrite.

Allowed:

- Existing page styles may keep using documented `--color-*` aliases.
- New aliases may be added only when they are documented in `02-md3-to-primeng-token-map.md` and `md3-to-primeng-map.json`.
- Page migrations may replace aliases with PrimeNG variables when the meaning is clear.

Not allowed:

- New undocumented global aliases.
- New color literals in shared component styling when a token exists.
- Broad `.p-*` overrides for themeable PrimeNG component states.

## Change Process

Use this flow for token or component-standard changes:

1. Identify the design intent and affected workflows.
2. Update the governance docs if the change creates or changes a reusable rule.
3. Update `architecture-tokens.json` when a token value or token role changes.
4. Update `md3-to-primeng-map.json` when an alias mapping changes.
5. Update `ArchitecturePrimePreset` for runtime token behavior.
6. Update `_colors.scss` only when existing app aliases need to bridge to the new token.
7. Check `/lab/theme` visually.
8. Run test, lint, and build.

## Validation Gates

Required for theme and design-system changes:

```bash
pnpm nx run architecture-dashboard:test
pnpm nx run architecture-dashboard:lint
pnpm nx run architecture-dashboard:build
```

Recommended browser smoke checks:

- Select Henry MCP Explorer and confirm `/lab/theme` is visible.
- Open `/lab/theme` and inspect button, input, table, card, and tag states.
- Confirm focus is visible with keyboard tabbing.
- Confirm no Angular console errors appear.
- Confirm a hard reload keeps permission-driven navigation stable.

## Zeroheight Page Structure

When this repo content is moved or mirrored into Zeroheight, use this structure:

1. Overview
   - Design-system purpose
   - Repo links
   - Angular and PrimeNG implementation references
   - Ownership and change process
2. Foundations
   - Color roles
   - Typography
   - Spacing
   - Radius
   - Elevation
   - Focus ring
   - Density
3. PrimeNG Theme
   - Nora base preset
   - `ArchitecturePrimePreset`
   - Primitive tokens
   - Semantic tokens
   - Component tokens
   - Alias bridge policy
4. Components
   - Button
   - InputText
   - Select
   - ToggleSwitch
   - DataTable
   - Card
   - Dialog and overlays
   - Tags and messages
5. Accessibility
   - Contrast
   - Keyboard focus
   - Validation
   - Reduced motion
   - Table readability
6. Capital Markets Patterns
   - Securities
   - Pools
   - Commitments
   - Trades
   - Disclosures
   - Pricing
   - Metrics and history
   - Audit workflow

## Theme Governance Lab

The `/lab/theme` route should demonstrate the governance chain:

```text
documented token -> PrimeNG mapping -> live component state -> accessibility note
```

Expected content:

- Token name
- Token value or CSS variable
- PrimeNG mapping
- Component examples
- Accessibility notes
- Do and do-not examples

Expected examples:

- Primary button
- Secondary or text button
- Danger action
- Text input normal, focus, invalid, and disabled states
- Select or toggle control
- Data table hover and selected row states
- Capital Markets card or operational summary

## Decision Records

Record these decisions in pull requests or follow-up docs when they change:

- Base preset choice, currently Nora.
- Brand palette changes.
- Surface and text contrast changes.
- Focus ring behavior.
- Data table density and interaction behavior.
- Dark mode support.
- Permission required for `/lab/theme`.

## Enterprise Readiness Notes

The lab models an enterprise pattern without requiring Enterprise Zeroheight features.

Free-style scope:

- One styleguide
- One token set
- Design-tool and developer-tool references
- Documentation and governance examples
- Local live preview in Angular

Enterprise-style concerns to model later:

- Multiple token sets
- Release approvals
- SSO and permissions
- Analytics
- API or MCP automation
- Multi-theme governance

## Short Answer

Use Zeroheight as the documented source of truth, not as an Angular package. Use PrimeNG Nora and `ArchitecturePrimePreset` as the runtime implementation. Keep the MD3-style aliases only as a bridge while migrating page styles. Validate every reusable theme change through docs, token JSON, preset code, `/lab/theme`, and Nx test/lint/build checks.
