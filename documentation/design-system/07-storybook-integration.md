# Storybook Integration

Storybook is part of the design-system workflow. It is the isolated component example and state-review layer between Zeroheight governance and the Angular runtime.

## Purpose

```text
Zeroheight or repo docs
        -> Storybook component stories
        -> PrimeNG components using ArchitecturePrimePreset
        -> Angular app pages and /lab/theme validation
```

Zeroheight explains the standard. Storybook proves the standard in isolated component examples. PrimeNG provides the real runtime implementation.

## Responsibilities

| Layer | Responsibility |
| --- | --- |
| Zeroheight | Govern design intent, component rules, accessibility notes, links, and decision history. |
| Storybook | Demonstrate reusable component states, variants, controls, and accessibility review points. |
| PrimeNG | Provide component implementations and styled-mode token behavior. |
| Angular app | Compose components into real workflows and route-level behavior. |
| `/lab/theme` | Validate the same theme states inside the integrated app shell. |

## Story Ownership

- Stories should be maintained with the component, pattern, or feature they document.
- A story is required when a component pattern becomes reusable across pages.
- A story should link back to the governing Zeroheight page or this documentation folder.
- Storybook must use the same PrimeNG preset and global styles as the Angular app.
- Storybook must not introduce separate token values or Storybook-only component styling.

## Recommended First Story

```text
ThemeGovernance/PrimeNGStates
```

Purpose:

- Prove that the PrimeNG Nora preset and `ArchitecturePrimePreset` are applied correctly.
- Show the component states documented in Zeroheight.
- Provide a stable visual review surface for token changes.
- Give developers a fast place to inspect isolated component behavior.

Current controls:

- `compactDensity`: toggles compact spacing for the governed examples.
- `darkPreview`: applies the dark preview class around the PrimeNG examples.
- `dialogVisible`: opens the governed dialog state.
- `selectedPattern`: switches the active capital markets pattern.

## Suggested Story Metadata

```ts
const meta = {
  title: 'ThemeGovernance/PrimeNGStates',
  parameters: {
    docs: {
      description: {
        component:
          'PrimeNG component states governed by Zeroheight and implemented through ArchitecturePrimePreset.',
      },
    },
    designSystem: {
      zeroheight: 'Architecture Intelligence Lab Design System / Components',
      primeNgPreset: 'ArchitecturePrimePreset',
      tokenMap: 'documentation/design-system/02-md3-to-primeng-token-map.md',
      componentGuidelines: 'documentation/design-system/03-component-guidelines.md',
      accessibility: 'documentation/design-system/04-accessibility.md',
    },
  },
};
```

## Required Example Coverage

| Story | Required states |
| --- | --- |
| `Buttons` | Primary, text, danger, disabled, loading. |
| `Forms` | InputText, Select, ToggleSwitch, focused, invalid, disabled. |
| `DataTable` | Default, hover-ready, selected, empty, dense. |
| `CardsAndTags` | Operational summary card, success, warning, danger, info tags. |
| `Overlays` | Dialog open state, close action, focus-visible controls. |

## Story To Zeroheight Links

Every governed component page should include:

- Zeroheight component guidance.
- Storybook story URL.
- PrimeNG component documentation URL.
- Repo implementation links.
- Accessibility checklist link.
- Known gaps or decisions.

Example Zeroheight component page links:

```text
Component: DataTable
Storybook: ThemeGovernance/PrimeNGStates/DataTable
PrimeNG: DataTable documentation
Repo: documentation/design-system/03-component-guidelines.md
Tokens: documentation/design-system/02-md3-to-primeng-token-map.md
Accessibility: documentation/design-system/04-accessibility.md
```

## PrimeNG Requirements

- Import the PrimeNG modules used by the story.
- Use `ArchitecturePrimePreset` through the same provider pattern as the app.
- Load the PrimeUI license from `PRIMEUI_LICENSE_KEY` in `.env` and expose it through `window.__ARCHITECTURE_LAB_CONFIG__`, matching the Angular app runtime config shape.
- Load the same app global styles needed for tokens, typography, surfaces, and accessibility.
- Use PrimeIcons where the component guideline expects icons.
- Prefer real PrimeNG inputs, buttons, tables, tags, cards, and overlays over mock HTML.

## Accessibility Requirements

- Story examples must show visible focus behavior.
- Invalid form stories must include text explanation.
- Status examples must include text labels, not only color.
- Data table stories must include readable headers and row states.
- Overlay stories must keep focus-visible controls and predictable close behavior.

## Validation Workflow

For design-system changes:

1. Update Zeroheight or repo docs.
2. Update token JSON and PrimeNG preset if token behavior changed.
3. Update affected Storybook stories.
4. Review the story in isolation.
5. Review `/lab/theme` in the integrated app.
6. Run Nx test, lint, and build for affected projects.

## Current Workspace Setup

Storybook is configured for `architecture-dashboard` with Nx Angular targets.

| Command | Purpose |
| --- | --- |
| `pnpm run start:storybook` | Start Storybook for local component review on port `4400`. |
| `pnpm run storybook:start` | Alias for `start:storybook`. |
| `pnpm run storybook:build` | Build static Storybook output. |
| `pnpm nx run architecture-dashboard:storybook` | Direct Nx Storybook target. |
| `pnpm nx run architecture-dashboard:build-storybook` | Direct Nx static build target. |
| `pnpm nx run architecture-dashboard:static-storybook` | Serve the built static Storybook output. |

Current configuration files:

- `apps/architecture-dashboard/.storybook/main.ts`
- `apps/architecture-dashboard/.storybook/preview.ts`
- `apps/architecture-dashboard/.storybook/tsconfig.json`
- `apps/architecture-dashboard/src/app/features/theme-governance/theme-governance.stories.ts`

Planning and test environment tracking:

- `documentation/design-system/storybook/story-tracking-and-testing-environment.md`

License handling:

- Local key source: `.env` value `PRIMEUI_LICENSE_KEY`
- Storybook injection point: `.storybook/main.ts`
- Storybook PrimeNG provider: `.storybook/preview.ts`
- Angular app equivalent: `apps/architecture-dashboard/public/env.js`

The Storybook setup should be treated as part of the design-system toolchain, not as a replacement for `/lab/theme` or the production Angular app.
