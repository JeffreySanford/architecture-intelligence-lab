# Zeroheight → PrimeNG Theme Governance

This is the design-system workflow for the lab, not an Angular runtime dependency.
Zeroheight is the documentation/governance layer. PrimeNG is the implementation layer.

## Clean mental model

```text
Figma / design tokens / design-system docs
        ↓ Zeroheight documents and governs the design system
        ↓ PrimeNG theme preset maps those tokens into Angular components
        ↓ Angular app consumes PrimeNG components and CSS variables
```

Zeroheight describes itself as a source of truth for design systems with:
- documentation
- delivery
- measurement
- management
- integrations such as Figma, Storybook, GitHub, and GitLab

PrimeNG’s styled-mode architecture is based on a **base + preset** model:
- base uses CSS variables
- preset supplies design tokens

So when someone says **“Zeroheight plugs into PrimeNG Themes”**, they usually mean:

```text
Zeroheight contains the official design-system documentation:
- colors
- typography
- spacing
- accessibility rules
- component usage guidelines
- design tokens
- Figma references
- Storybook/component examples

PrimeNG implements those standards in code:
- preset
- semantic tokens
- component tokens
- CSS variables
- dark mode
- density
```

That is a current enterprise pattern.

## What you need to know

PrimeNG tokens have three important layers:

```text
primitive tokens  = raw colors / palette values
semantic tokens   = meaning: primary, surface, focus ring, text, danger
component tokens  = specific component styling: button, input, table, card
```

PrimeNG recommends:
- primitive tokens for core palettes
- semantic tokens for common design concepts
- component tokens only for specific component customization
- overriding component classes directly as a last resort

That is probably the key idea they care about.

## What this looks like in Angular

Something like this conceptually:

```ts
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeuix/themes';
import Nora from '@primeuix/themes/nora';

const EnterprisePreset = definePreset(Nora, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      500: '{blue.500}',
      700: '{blue.700}'
    },
    focusRing: {
      width: '2px',
      style: 'solid',
      color: '{primary.500}'
    }
  }
});

export const appConfig = {
  providers: [
    providePrimeNG({
      theme: {
        preset: EnterprisePreset,
        options: {
          darkModeSelector: '.app-dark'
        }
      }
    })
  ]
};
```

The exact token names depend on the team’s preset, but the architecture is the important part.

## What to say if asked

This is a strong answer:

```text
My understanding is that Zeroheight is probably the documentation and governance layer for the design system, while PrimeNG themes are the implementation layer in Angular. I’d look for the approved tokens, component usage guidance, accessibility rules, and Figma/Storybook references in Zeroheight, then map those into PrimeNG semantic and component tokens rather than overriding PrimeNG CSS classes directly.
```

That sounds very senior and safe.

## Theme Governance Lab concept

You could build a **Theme Governance Lab** under `/lab/theme` with:

- Zeroheight-style docs panel:
  - token name
  - token value
  - usage guidance
  - do/don’t examples
- PrimeNG live preview:
  - button
  - input
  - table
  - card
  - dialog
  - dark mode toggle
  - compact density preview

This shows the chain:

```text
design-system documentation → design tokens → PrimeNG preset → Angular UI
```

That is exactly the kind of thing a PrimeNG-heavy enterprise team would appreciate.

## Zeroheight Free plan

Yes — Zeroheight has a Free plan, and it is enough for a developer/design-system lab.

The pricing page says:

```text
Free — $0
Best for single contributors or testing out zeroheight.
```

The Free plan includes:
- 1 editor
- 1 styleguide
- 1 token set
- design-tool connections
- developer-tool connections
- AI assistant for editors
- AI documentation creation/maintenance
- logo upload
- custom brand colors
- 100 AI credits

For this repo and lab, that is enough to build a small “PrimeNG Theme Governance” lab.

One limitation: **multi-theme support is Enterprise-level** on their pricing table, while Free appears limited to a single visual theme. The pricing page shows Free has **1 token set** and Enterprise has **10 token sets**, plus multi-theme support and unlimited custom visual themes.

For learning:

```text
Free Zeroheight = yes, good for one design system / one token set
Enterprise Zeroheight = needed for serious multi-theme, releases, permissions, SSO, analytics, API/MCP access
```

Start with the Free plan and model one theme, probably:

```text
Architecture Intelligence Lab / PrimeNG Nora Enterprise Theme
```

Then document:

- Primary color
- Surface colors
- Typography
- Spacing
- Focus ring
- Button variants
- Data table states
- Form validation states
- Dark mode rules
- PrimeNG do/don’t examples

That is enough to understand how Zeroheight fits the real enterprise pattern without needing a paid setup.

## Ramp-up help suggestion

From July 6 to July 15, the best ask is low-risk ramp-up work that helps the team without needing full production/client access yet.

Good options:

- documentation review
- local environment setup notes
- PrimeNG/theme/design-system exploration
- test review
- small UI cleanup
- code walkthroughs
- studying Capital Markets workflows

A strong ask:

```text
Hi Neil, since the plan is to have me fully onboarded by the 15th, I wanted to ask if there’s anything useful I can help with between now and then.

I’m happy to take on lower-risk ramp-up work such as documentation review, local environment setup notes, PrimeNG/theme/design-system exploration, test review, small UI cleanup, code walkthroughs, or studying specific Capital Markets workflows. I don’t want to get ahead of access or process, but I’d like to use the time well and start building context wherever it would be helpful.

If there are particular repos, docs, tickets, domain concepts, or UI patterns you think I should focus on first, I’d really appreciate the direction.
```

That hits the right tone: eager, useful, respectful of access boundaries.

## Realistic pre-onboarding help

1. Environment readiness
   - setup docs, local dev requirements, Node/Java versions, package manager, VPN/access expectations, PrimeNG version, test commands
2. Design system / PrimeNG ramp-up
   - Zeroheight, PrimeNG themes, token structure, dark mode, density, form/table standards, accessibility rules
3. Capital Markets domain vocabulary
   - securities, pools, commitments, trades, pricing, disclosures, settlement, audit/history, operational metrics
4. Safe code review or shadowing
   - review PRs, read patterns, take notes, ask architecture questions
5. Testing and documentation
   - test gaps, setup notes, README cleanup, glossary notes, UI behavior documentation, accessibility observations

## Can I add Zeroheight to my lab?

Yes — you can absolutely add Zeroheight to your lab, but think of it as a design-system documentation/governance layer, not as a normal npm package installed into Angular.

Lab structure:

```text
Zeroheight = documentation / styleguide / token governance
GitHub/GitLab = source control and CI validation
Angular + PrimeNG = implementation of the theme
```

## Repo fit and conversion path

The repo already has PrimeNG and `@primeuix/themes` installed. It is using PrimeNG through `providePrimeNG()` with an Aura preset.

The conversion path is not “start over.” It is:

```text
Convert your existing MD3-ish custom CSS tokens into a PrimeNG preset.
```

### The big conversion idea

Your app currently has tokens like:

```text
--color-bg
--color-surface
--color-text
--color-primary
--color-primary-strong
--color-danger
--color-border
```

Keep them. Do not throw them away.

PrimeNG styled mode uses a theme architecture where the base contains CSS-variable-powered style rules and the preset supplies design tokens. PrimeNG’s token hierarchy is:
- primitive tokens
- semantic tokens
- component tokens

The translation is:

```text
MD3 custom token       PrimeNG concept
--------------------------------------------------
--color-primary       semantic.primary.color
--color-bg            semantic.surface / app background
--color-surface       semantic.surface.0 / card surfaces
--color-border        semantic.border / form/table border
--color-danger        semantic.error / danger state
--color-primary-soft  highlight / selected row / badge background
```

PrimeNG specifically recommends using token APIs rather than overriding component CSS classes. That is the senior pattern.

## Suggested repository additions

Add to `documentation/design-system`:
- `06-zeroheight-primeng-theme-governance.md`
- `07-md3-to-primeng-token-map.md`
- `08-prime-ng-theme-lab-plan.md`

Add to `design-system/tokens`:
- `architecture-tokens.json`
- `md3-to-primeng-map.json`

Add to the app:
- `apps/architecture-dashboard/src/app/core/theme/architecture-prime-preset.ts`
- `apps/architecture-dashboard/src/app/core/theme/architecture-theme-bridge.scss`

## Example app wiring

Replace Aura with your custom preset in `appConfig`:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { getRuntimeConfig } from './core/config/runtime-config';
import { ArchitecturePrimePreset } from './core/theme/architecture-prime-preset';

const runtimeConfig = getRuntimeConfig();

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(appRoutes),
    provideAnimations(),
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
  ]
};
```

## Bridge old MD3 variables to PrimeNG variables

Keep the current `--color-*` aliases while moving the root values to PrimeNG variables:

```scss
:root {
  --color-bg: var(--p-surface-50);
  --color-surface: var(--p-surface-0);
  --color-surface-2: var(--p-surface-100);
  --color-surface-muted: var(--p-surface-200);
  --color-text: var(--p-surface-700);
  --color-text-muted: var(--p-surface-500);
  --color-primary: var(--p-primary-color);
  --color-primary-strong: var(--p-primary-600);
  --color-primary-container: rgba(53, 95, 159, 0.12);
  --color-primary-text: var(--p-primary-700);
  --color-danger: #a32222;
  --color-border: var(--p-surface-300);
  --color-shadow: rgba(23, 32, 51, 0.08);
  --color-primary-soft: rgba(53, 95, 159, 0.12);
}
```

That lets existing styles keep using `--color-*`, while the root values now flow from PrimeNG.

## Theme Governance route

Add a route like `/lab/theme` that shows:
- Zeroheight-style documentation panel
- PrimeNG live component preview

Content:
- token name
- token value
- PrimeNG mapping
- component examples
- accessibility notes
- do/don’t examples

Example cards:
- Primary button
- Secondary button
- Danger button
- Text input normal/focus/error/disabled
- Data table selected row/hover row/error row
- Capital Markets card: Commitment / Pool / Trade / Disclosure

## Zeroheight page structure

Suggested pages:
1. Overview
   - GitHub repo link
   - GitLab MR/CI lab link
   - Angular + PrimeNG implementation notes
2. Foundations
   - Color roles
   - Typography
   - Spacing
   - Radius
   - Elevation
   - Focus ring
3. PrimeNG Theme
   - Preset: Nora-based ArchitecturePrimePreset
   - Primitive tokens
   - Semantic tokens
   - Component tokens
4. Components
   - Button
   - InputText
   - Dropdown/Select
   - DataTable
   - Card
   - Dialog
   - Toast/messages
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
   - Disclosures
   - Pricing
   - Metrics/history dashboard

## MD3 → PrimeNG concept

Angular Material’s theming uses Sass APIs and CSS variables. PrimeNG styled mode uses presets and token mapping.

The conversion is:

```text
MD3 color role → PrimeNG semantic token
MD3 density idea → PrimeNG component sizing / layout conventions
MD3 surface / on-surface → PrimeNG surface/text tokens
MD3 focus indicator → PrimeNG focusRing token
MD3 custom component CSS → PrimeNG / app token aliases
```

## Branch plan

```bash
git checkout -b feature/zeroheight-primeng-theme-lab
mkdir -p documentation/design-system
design-system/tokens
mkdir -p apps/architecture-dashboard/src/app/core/theme
```

Then add:
- `apps/architecture-dashboard/src/app/core/theme/architecture-prime-preset.ts`
- `documentation/design-system/06-zeroheight-primeng-theme-governance.md`
- `documentation/design-system/07-md3-to-primeng-token-map.md`
- `design-system/tokens/md3-to-primeng-map.json`

Commit:

```bash
git add .
git commit -m "feat: add PrimeNG theme governance foundation"
git push origin feature/zeroheight-primeng-theme-lab
```

## Short answer

Yes, add Zeroheight — but as the documented source of truth, not as an Angular runtime dependency.

Convert MD3 to PrimeNG by:
1. keeping `--color-*` aliases as temporary app aliases
2. creating `ArchitecturePrimePreset` with `definePreset(Nora, ...)`
3. mapping MD3 color roles to PrimeNG primitive/semantic/component tokens
4. wiring that preset into `providePrimeNG()`
5. creating `/lab/theme` to preview and validate the design system
6. documenting the token map and component rules in Zeroheight

That aligns PrimeNG, Angular, design systems, Zeroheight, and enterprise UI governance.