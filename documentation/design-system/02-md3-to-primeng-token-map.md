# MD3-Style Tokens To PrimeNG Nora Tokens

The conversion path is incremental. Existing `--color-*` aliases remain temporarily so app-owned SCSS keeps working, but those aliases now resolve to PrimeNG CSS variables wherever possible.

## Conversion Principle

```text
MD3-style app alias -> PrimeNG semantic token -> PrimeNG CSS variable -> Angular UI
```

PrimeNG styled mode has three useful token layers:

| Layer | Purpose | Lab Usage |
| --- | --- | --- |
| Primitive tokens | Raw palette values | Architecture blue, slate, and red palettes. |
| Semantic tokens | Shared UI meaning | Primary, surface, text, focus ring, highlight, form field, and content. |
| Component tokens | Component-specific tuning | Button radius, card shadow, data table hover rows, selected rows, and cell borders. |

## Runtime Implementation

| Artifact | Path |
| --- | --- |
| PrimeNG preset | `apps/architecture-dashboard/src/app/core/theme/architecture-prime-preset.ts` |
| App alias bridge | `apps/architecture-dashboard/src/styles/_colors.scss` |
| PrimeNG provider wiring | `apps/architecture-dashboard/src/app/app.config.ts` |
| Token inventory | `design-system/tokens/architecture-tokens.json` |
| Alias map | `design-system/tokens/md3-to-primeng-map.json` |
| Live preview route | `/lab/theme` |

## Token Map

| Existing alias | PrimeNG target | CSS variable | Usage |
| --- | --- | --- | --- |
| `--color-bg` | `semantic.colorScheme.light.surface.50` | `--p-surface-50` | Application background. |
| `--color-surface` | `semantic.colorScheme.light.surface.0` | `--p-surface-0` | Header, sidebar, cards, and page surfaces. |
| `--color-surface-2` | `semantic.colorScheme.light.surface.100` | `--p-surface-100` | Secondary panels. |
| `--color-surface-muted` | `semantic.colorScheme.light.surface.200` | `--p-surface-200` | Muted regions and quiet blocks. |
| `--color-surface-alt` | `semantic.colorScheme.light.surface.300` | `--p-surface-300` | Active navigation and hover states. |
| `--color-text` | `semantic.colorScheme.light.text.color` | `--p-text-color` | Primary readable text. |
| `--color-text-muted` | `semantic.colorScheme.light.text.mutedColor` | `--p-text-muted-color` | Secondary labels and descriptions. |
| `--color-primary` | `semantic.colorScheme.light.primary.color` | `--p-primary-color` | Main brand and action color. |
| `--color-primary-strong` | `semantic.primary.600` | `--p-primary-600` | Stronger action and emphasis color. |
| `--color-primary-container` | `semantic.colorScheme.light.highlight.background` | `--p-highlight-background` | Primary container and selected backgrounds. |
| `--color-primary-text` | `semantic.primary.700` | `--p-primary-700` | Text on light primary containers. |
| `--color-primary-soft` | `semantic.colorScheme.light.highlight.background` | `--p-highlight-background` | Selected row, badge, and highlight backgrounds. |
| `--color-border` | `semantic.content.borderColor` | `--p-content-border-color` | Shell, table, card, and form borders. |
| `--color-danger` | `primitive.red.600` | `--p-red-600` | Error and destructive state. |

## Palette Ownership

| Palette | Purpose |
| --- | --- |
| `blue` | Brand, primary actions, focus rings, selected state, and architecture graph emphasis. |
| `slate` | Surfaces, text, borders, backgrounds, and neutral UI structure. |
| `red` | Invalid fields, destructive actions, failed status, and risk indicators. |

## App-Owned Alias Backlog

These aliases still exist in `_colors.scss` but are not fully represented as PrimeNG semantic tokens yet. Keep them documented until they are either promoted into `ArchitecturePrimePreset` or removed during page-level cleanup.

| Alias | Current ownership | Intended use |
| --- | --- | --- |
| `--color-success` | App alias | Success status and positive workflow state. |
| `--color-warning` | App alias | Warning status and cautionary workflow state. |
| `--color-danger-container` | App alias | Soft danger background. |
| `--color-on-danger-container` | App alias | Text on soft danger background. |
| `--color-info` | App alias | Informational status and links where primary would overstate emphasis. |
| `--color-shadow` | App alias | Shared soft elevation. |
| `--color-primary-shadow` | App alias | Primary focus or interaction glow. |
| `--color-event-highlight` | App alias | Realtime event highlight background. |
| `--color-event-highlight-strong` | App alias | Strong realtime event highlight background. |
| `--color-warning-surface` | App alias | Soft warning background. |
| `--color-chart-axis` | App alias | Chart axis text and marks. |
| `--color-chart-muted` | App alias | Muted chart labels. |
| `--color-chart-grid` | App alias | Chart grid lines. |
| `--color-chart-node-stroke` | App alias | Diagram node strokes. |
| `--color-chart-flow-link` | App alias | Diagram and flow links. |
| `--color-flow-client` | App alias | Client node color in flow diagrams. |
| `--color-flow-spring` | App alias | Spring node color in flow diagrams. |
| `--color-flow-nest` | App alias | Nest node color in flow diagrams. |
| `--color-flow-redis` | App alias | Redis node color in flow diagrams. |
| `--color-flow-docs` | App alias | Documentation/tooling node color in flow diagrams. |

## Migration Rules

- Prefer PrimeNG semantic tokens for shared meaning.
- Use component tokens only when the behavior belongs to a specific component family.
- Keep the alias bridge until page SCSS is migrated in small, testable changes.
- Do not introduce new global `--color-*` aliases without adding them to this file and `md3-to-primeng-map.json`.
- Avoid direct `.p-*` overrides unless the relevant PrimeNG token does not exist or the override is app layout rather than component theming.
- Promote repeated app-owned aliases into PrimeNG semantic or component tokens when they become reusable design-system concepts.

## Validation Checklist

- `/lab/theme` shows the expected primary, surface, border, focus, and data table states.
- Buttons, form controls, tables, cards, and overlays still use readable contrast.
- `architecture-tokens.json`, `md3-to-primeng-map.json`, `_colors.scss`, and `architecture-prime-preset.ts` agree.
- `pnpm nx run architecture-dashboard:test`, `lint`, and `build` pass.
