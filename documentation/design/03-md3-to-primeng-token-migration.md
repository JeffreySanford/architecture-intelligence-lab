# MD3 To PrimeNG Token Migration

The existing dashboard has useful MD3-style application variables. The goal is not to delete that work. The goal is to migrate ownership from ad-hoc app variables to a PrimeNG Nora-based token system while keeping compatibility during the transition.

## Migration Principle

```text
Do not break existing screens while changing the source of truth.
```

The current app variables should become compatibility aliases backed by PrimeNG-generated CSS variables.

## Current App Tokens

The current color file contains app-level variables such as:

```scss
--color-bg
--color-surface
--color-surface-2
--color-surface-muted
--color-text
--color-text-muted
--color-primary
--color-primary-strong
--color-primary-container
--color-danger
--color-border
--color-shadow
```

These variables should remain available until all custom components move to either PrimeNG tokens or stable app-level semantic aliases.

## Migration Layers

| Layer | Status | Purpose |
| --- | --- | --- |
| PrimeNG primitive tokens | Target | Raw palette values. |
| PrimeNG semantic tokens | Target | Product-level meaning such as primary, surface, focus, danger. |
| PrimeNG component tokens | Target for specific components | Global component behavior such as Card radius or DataTable hover background. |
| App aliases `--color-*` | Compatibility | Preserve current custom styles during migration. |
| Feature hard-coded values | Reduce | Replace with tokens over time. |

## Token Mapping Table

| Existing App Token | PrimeNG / Nora Direction | Notes |
| --- | --- | --- |
| `--color-bg` | `--p-surface-50` | Page background. |
| `--color-surface` | `--p-surface-0` | Card and panel background. |
| `--color-surface-2` | `--p-surface-100` | Secondary panel background. |
| `--color-surface-muted` | `--p-surface-200` | Muted container or inactive zone. |
| `--color-surface-alt` | `--p-surface-300` | Alternate surface or table header support. |
| `--color-text` | `--p-text-color` or surface dark token | Primary readable text. |
| `--color-text-muted` | `--p-text-muted-color` | Secondary text and metadata. |
| `--color-primary` | `--p-primary-color` | Primary actions and selected affordances. |
| `--color-primary-strong` | `--p-primary-600` | Hover/active emphasis. |
| `--color-primary-container` | highlight background token | Selected row, active panel, low-emphasis primary surface. |
| `--color-primary-text` | primary contrast or primary 700 | Text on primary-tinted surface. |
| `--color-success` | future success semantic token | Positive state; do not use for decoration. |
| `--color-warning` | future warning semantic token | Caution state; pair with text/icon. |
| `--color-danger` | future danger/error semantic token | Error/destructive state. |
| `--color-danger-container` | danger surface token | Error container background. |
| `--color-border` | formField/border/surface token | Borders, dividers, table grid. |
| `--color-shadow` | elevation token | Keep restrained for enterprise UI. |

## Compatibility Alias Strategy

During migration, keep `_colors.scss` but convert values to PrimeNG-backed aliases.

```scss
:root {
  --color-bg: var(--p-surface-50);
  --color-surface: var(--p-surface-0);
  --color-surface-2: var(--p-surface-100);
  --color-surface-muted: var(--p-surface-200);
  --color-surface-alt: var(--p-surface-300);

  --color-text: var(--p-text-color);
  --color-text-muted: var(--p-text-muted-color);

  --color-primary: var(--p-primary-color);
  --color-primary-strong: var(--p-primary-600);
  --color-primary-container: rgba(53, 95, 159, 0.12);
  --color-primary-text: var(--p-primary-700);

  --color-border: var(--p-surface-300);
  --color-shadow: rgba(23, 32, 51, 0.08);
}
```

If any PrimeNG variable name changes during RC validation, update this file rather than chasing changes through every component.

## Migration Stages

### Stage 1: Document

- Add design documentation.
- Identify existing MD3-style variables.
- Map variables to PrimeNG token intent.
- Decide Nora as baseline.

### Stage 2: Introduce Preset

- Create `ArchitecturePrimePreset` based on Nora.
- Wire the preset through `providePrimeNG`.
- Preserve old app variables as aliases.
- Validate build and unit tests.

### Stage 3: Add Theme Preview

- Add `/lab/theme` route.
- Show PrimeNG Button, Card, DataTable, InputText, Dialog, Message, Tag, and Toast examples.
- Include light/dark mode toggle.
- Include status and validation states.

### Stage 4: Reduce Legacy Styling

- Replace feature-level hard-coded colors with tokens.
- Replace broad custom component styles with PrimeNG tokens where practical.
- Keep custom styles for domain layout, not for fighting the component library.

### Stage 5: Governance

- Update Zeroheight-style documentation when tokens change.
- Add design-review checklist to PRs.
- Treat token changes as architectural decisions.

## Dark Mode Migration

Use a class selector such as `.app-dark` at the document root. This makes the theme toggle deterministic and testable.

```ts
providePrimeNG({
  theme: {
    preset: ArchitecturePrimePreset,
    options: {
      darkModeSelector: '.app-dark'
    }
  }
});
```

Then the application can toggle:

```ts
document.documentElement.classList.toggle('app-dark');
```

The future theme store should preserve the user's preference in local storage with options such as:

```text
system
light
dark
```

## Density Migration

Capital Markets screens benefit from density, but density must not destroy usability.

Use density rules carefully:

- tables may be compact
- forms should remain readable
- click targets should remain usable
- keyboard focus should remain visible
- disabled states should remain distinguishable
- validation errors should not collapse into visual noise

## Component Token Migration

Use component tokens for global, repeated component behavior.

Good component-token candidates:

| Component | Candidate Token Concern |
| --- | --- |
| Button | border radius, primary/secondary state, focus ring. |
| Card | radius, shadow, header spacing. |
| DataTable | header background, row hover, selected row, border color. |
| InputText | border, focus border, invalid border. |
| Dialog | radius, header background, content spacing. |
| Tag/Badge | severity colors and contrast. |

Avoid component tokens for one-off layout fixes. Use local component SCSS for layout composition.

## Acceptance Checklist

Before considering the migration complete:

- existing dashboard pages still render correctly
- body background and text are PrimeNG-backed
- PrimeNG components and custom components feel visually aligned
- light and dark modes both work
- focus rings are visible
- DataTable states are readable
- error/warning/success states include non-color communication
- no broad `!important` patching is required
- documentation explains token ownership
