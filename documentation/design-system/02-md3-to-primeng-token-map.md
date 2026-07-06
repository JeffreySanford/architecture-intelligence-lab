# MD3-Style Tokens to PrimeNG Nora Tokens

The conversion path is not a full rewrite. Existing `--color-*` aliases remain temporarily so app-owned SCSS keeps working, but those aliases now resolve to PrimeNG CSS variables wherever possible.

## Conversion Principle

```text
MD3-style color role -> PrimeNG semantic token -> PrimeNG CSS variable -> Angular UI
```

PrimeNG styled mode has three useful token layers:

| Layer | Purpose | Lab Usage |
| --- | --- | --- |
| Primitive tokens | Raw palette values | Architecture blue, slate, red palettes |
| Semantic tokens | Shared meaning | Primary, surface, text, focus ring, highlight, form field |
| Component tokens | Component-specific tuning | Button radius, card shadow, table hover and selected states |

## Token Map

| Existing alias | PrimeNG target | Usage |
| --- | --- | --- |
| `--color-bg` | `--p-surface-50` | Application background |
| `--color-surface` | `--p-surface-0` | Header, sidebar, cards |
| `--color-surface-2` | `--p-surface-100` | Secondary panels |
| `--color-surface-muted` | `--p-surface-200` | Muted regions |
| `--color-surface-alt` | `--p-surface-300` | Active navigation and hover states |
| `--color-text` | `--p-text-color` | Primary readable text |
| `--color-text-muted` | `--p-text-muted-color` | Secondary labels and descriptions |
| `--color-primary` | `--p-primary-color` | Main brand action color |
| `--color-primary-strong` | `--p-primary-600` | Stronger action and emphasis color |
| `--color-primary-text` | `--p-primary-700` | Text on light primary containers |
| `--color-primary-soft` | `--p-highlight-background` | Selected row, badge, and highlight backgrounds |
| `--color-border` | `--p-content-border-color` | Shell, table, card, and form borders |
| `--color-danger` | `--p-red-600` | Error and destructive state |

## Implementation Files

- PrimeNG preset: `apps/architecture-dashboard/src/app/core/theme/architecture-prime-preset.ts`
- App alias bridge: `apps/architecture-dashboard/src/styles/_colors.scss`
- PrimeNG provider wiring: `apps/architecture-dashboard/src/app/app.config.ts`
- Live preview route: `/lab/theme`

## Rules

- Prefer semantic tokens over component tokens when the value applies across the UI.
- Use component tokens for real component behavior, such as table hover rows or card elevation.
- Avoid direct `.p-*` overrides unless a token does not exist for the needed behavior.
- Keep the alias bridge until page-level SCSS can be migrated incrementally.
