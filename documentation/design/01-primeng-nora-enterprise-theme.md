# PrimeNG Nora Enterprise Theme Direction

PrimeNG is the primary UI library for the Angular dashboard. Nora is the preferred design inspiration for this lab because it is aligned with enterprise application patterns: dense data, operational clarity, restrained surfaces, clear status language, and business workflow screens.

This document explains how Nora should shape the visual and architectural direction of `architecture-intelligence-lab`.

## Theme Principle

The theme is an architecture layer, not a decoration layer.

```text
Design tokens → PrimeNG preset → app aliases → components → workflow screens
```

The application should not depend on scattered one-off colors, component-specific hacks, or `!important` overrides. Styling decisions should be traceable back to documented tokens and usage rules.

## Why Nora

| Nora Trait | Lab Interpretation |
| --- | --- |
| Enterprise inspired | Suitable for operational dashboards, admin screens, tables, and workflow-heavy applications. |
| Design-token based | Can be customized through primitive, semantic, and component tokens. |
| PrimeNG native | Works with PrimeNG styled mode and `providePrimeNG`. |
| Better than ad-hoc MD3 copy | Avoids pretending PrimeNG is Angular Material while still preserving useful MD3 design lessons. |

## Current State

The app currently wires PrimeNG through `providePrimeNG()` and uses the Aura preset. The repo also contains custom MD3-style variables such as `--color-bg`, `--color-surface`, `--color-primary`, `--color-danger`, and `--color-border`.

The target direction is to replace Aura with an `ArchitecturePrimePreset` based on Nora while keeping app-level aliases during migration.

## Target Theme Stack

```text
@primeuix/themes/nora
        ↓ definePreset(...)
ArchitecturePrimePreset
        ↓ providePrimeNG({ theme: { preset } })
PrimeNG CSS variables
        ↓ compatibility aliases
--color-* app variables
        ↓
existing dashboard styles and custom components
```

## Token Layers

PrimeNG styled mode uses three important token layers.

| Layer | Purpose | Lab Example |
| --- | --- | --- |
| Primitive tokens | Raw palette values with no UI meaning | `architectureBlue.500`, `architectureSlate.100`, `architectureRed.600` |
| Semantic tokens | Product meaning and common design concepts | `primary.color`, `surface`, `text.color`, `focusRing`, `highlight` |
| Component tokens | Component-specific choices | `button.borderRadius`, `card.shadow`, `datatable.rowHoverBackground` |

Use primitive tokens to define the palette, semantic tokens to express product meaning, and component tokens only when a component needs a specific adjustment.

## Enterprise Visual Language

The lab should feel like a disciplined Capital Markets system, not a consumer landing page.

### Preferred Characteristics

- calm blue primary palette
- strong neutral surface scale
- high readability for dense tables
- clear border and divider treatment
- obvious focus rings
- restrained shadows
- status colors used consistently
- no excessive gradients or decorative motion
- compact but not cramped layouts

### Avoid

- styling PrimeNG internals directly as a first option
- mixing several unrelated visual systems in one screen
- hard-coded hex values inside feature components
- using color alone to communicate status
- hiding focus rings for aesthetic reasons
- making table density so tight that scanning and keyboard use suffer

## Suggested Initial Preset File

Create the implementation under:

```text
apps/architecture-dashboard/src/app/core/theme/architecture-prime-preset.ts
```

Conceptual shape:

```ts
import { definePreset } from '@primeuix/themes';
import Nora from '@primeuix/themes/nora';

export const ArchitecturePrimePreset = definePreset(Nora, {
  primitive: {
    architectureBlue: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#355f9f',
      600: '#2563eb',
      700: '#17325f',
      800: '#13294f',
      900: '#0f203f',
      950: '#081426'
    },
    architectureSlate: {
      0: '#ffffff',
      50: '#f7f8fb',
      100: '#f6f8fd',
      200: '#f2f4f8',
      300: '#edf1f7',
      400: '#d8dce6',
      500: '#4f5868',
      600: '#374151',
      700: '#172033',
      800: '#111827',
      900: '#0f172a',
      950: '#020617'
    }
  },
  semantic: {
    primary: {
      50: '{architectureBlue.50}',
      100: '{architectureBlue.100}',
      200: '{architectureBlue.200}',
      300: '{architectureBlue.300}',
      400: '{architectureBlue.400}',
      500: '{architectureBlue.500}',
      600: '{architectureBlue.600}',
      700: '{architectureBlue.700}',
      800: '{architectureBlue.800}',
      900: '{architectureBlue.900}',
      950: '{architectureBlue.950}'
    },
    focusRing: {
      width: '2px',
      style: 'solid',
      color: '{primary.500}',
      offset: '2px'
    }
  },
  components: {
    card: {
      borderRadius: '0.875rem'
    },
    button: {
      borderRadius: '0.625rem'
    }
  }
});
```

The exact token names should be validated against the installed PrimeNG and `@primeuix/themes` version before implementation is locked.

## Provider Target

Current provider configuration should move from direct Aura usage to the custom preset.

```ts
providePrimeNG({
  license: runtimeConfig.primeuiLicense,
  theme: {
    preset: ArchitecturePrimePreset,
    options: {
      darkModeSelector: '.app-dark',
      cssLayer: false
    }
  }
})
```

Use `.app-dark` so the lab can implement a first-class theme toggle instead of relying only on system preference.

## Capital Markets Screen Priorities

The theme should be validated against screens that look like real enterprise work.

| Screen Type | Required Theme Behavior |
| --- | --- |
| Dashboard cards | Clear hierarchy, stable spacing, restrained elevation. |
| Data tables | Readable density, hover state, selected state, row status indicators. |
| Forms | Clear labels, visible required/invalid state, keyboard-friendly focus. |
| Disclosure workflows | Strong document/status affordances without visual clutter. |
| Realtime metrics | Motion should aid comprehension and respect reduced motion. |
| Admin panels | Permissions, environment, and diagnostics should be visually explicit. |

## Acceptance Criteria

- PrimeNG Nora is the documented enterprise-inspired baseline.
- A custom preset is used instead of direct hard-coded global component overrides.
- Existing MD3-style app variables are bridged to PrimeNG tokens during migration.
- Focus rings are visible in light and dark modes.
- Status colors have text/icon/pattern support and do not rely on color alone.
- DataTable, Button, Card, InputText, Dialog, and Message examples are documented and previewed.
- Theme behavior is testable through a future `/lab/theme` route.
