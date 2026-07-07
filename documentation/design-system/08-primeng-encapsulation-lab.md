# PrimeNG Encapsulation Lab

**Design-system migration**

This story documents a PrimeNG-focused Angular lab that recreates a common enterprise styling migration challenge. It compares the same PrimeNG components across three modes: the normal baseline, the global selector impact from `ViewEncapsulation.None`, and a contained design-system fix.

This is not a PrimeNG bug. The issue being demonstrated is CSS cascade behavior caused by disabled Angular view encapsulation combined with broad PrimeNG selectors.

Current implementation status:

- Normal, Impact, and Fixed views are implemented as separate components.
- The shared PrimeNG suite lives in `PrimengEncapsulationSharedComponent`.
- Impact mode uses `ViewEncapsulation.None` and broad diagnostic overrides under `.encapsulation-lab--impact`.
- Fixed mode restores the same PrimeNG suite inside a `.design-system-scope` boundary.
- The included PrimeNG controls now also cover `p-badge`, `p-accordion`, `p-steps`, `p-toolbar`, `p-toast`, `p-fieldset`, `p-avatar-group`, removable `p-chip`, and `p-skeleton`.

> Progress notation: `[ ]` = not done, `[x]` = completed.

---

## Story

Create one route in the app shell:

```ts
{
  path: 'lab/primeng-encapsulation',
  loadComponent: () =>
    import('./features/style-conflict/primeng-encapsulation-lab.component').then(
      (m) => m.PrimengEncapsulationLabComponent,
    ),
  data: {
    title: 'PrimeNG Encapsulation Lab',
    eyebrow: 'Design-system migration',
    description:
      'Compares normal PrimeNG styling, ViewEncapsulation.None impact, and a scoped design-system fix.',
    permission: 'design:view',
  },
}
```

---

## Design Intent

Keep the demo focused and repeatable:

- [x] one route
- [x] one lab shell component
- [x] separate Normal, Impact, and Fixed view components
- [x] one shared PrimeNG component suite
- [x] the same sample data in every view
- [x] native HTML buttons for tab switching
- [x] tab selection changes only the rendered demo mode; Angular encapsulation metadata remains static

The demo should not try to switch Angular encapsulation at runtime. Angular encapsulation metadata is static. The impact view intentionally uses `ViewEncapsulation.None` to recreate the scenario, while the normal and fixed views remain isolated. The UI toggles between CSS demonstration modes.

The impact mode is a controlled simulation of global selector leakage. In a real application, a `ViewEncapsulation.None` component could emit broad selectors such as `.p-button`, `.p-card`, or `.p-datatable` without a safe wrapper, causing those styles to affect unrelated PrimeNG components after the component loads. This lab keeps the diagnostic selectors gated under `.encapsulation-lab--impact` so the issue can be demonstrated safely without corrupting the entire application shell.

### Component architecture

Because this lab is expected to grow, it is better to isolate each mode into its own component, template, and stylesheet. That keeps the fixed, impact, and normal implementations visually separate while still allowing a shared PrimeNG suite to be reused.

Current implementation:

- `PrimengEncapsulationLabComponent` owns tab selection and page-level framing
- `PrimengEncapsulationNormalComponent` renders the normal baseline view and reuses the shared inner suite
- `PrimengEncapsulationImpactComponent` renders the diagnostic impact view and reuses the shared inner suite
- `PrimengEncapsulationFixedComponent` renders the contained design-system view and reuses the shared inner suite
- `PrimengEncapsulationSharedComponent` contains the shared repeated PrimeNG controls and serves as the central template for all three modes

This avoids one oversized template and makes visual comparison easier without duplicating the shared inner component logic.

Each tab also owns its own page preview section, so the outside page content is shown as part of the selected mode rather than rendered outside the tab group.

In the fixed tab, that page preview is wrapped by the `.design-system-scope` container in the component template. The fixed view’s SCSS writes targeted rules such as `.design-system-scope .p-button`, `.design-system-scope .p-card`, and `.design-system-scope .p-inputtext` so the same PrimeNG controls and preview content are restyled inside that boundary. This is how the fixed tab restores the impacted items while still using the same shared component suite.

Only `PrimengEncapsulationImpactComponent` should use `ViewEncapsulation.None`. The normal and fixed components use Angular’s default encapsulation behavior. This keeps the reproduction focused on the feature area that emits broad `.p-*` styles and makes the fixed view a true scoped containment demo.

---

## Progress checklist

- [x] Route at `/lab/primeng-encapsulation` exists
- [x] Separate components for Normal/Impact/Fixed views
- [x] Shared PrimeNG suite component or reusable template fragment
- [x] Shared inner template is implemented as `PrimengEncapsulationSharedComponent`
- [x] The central shared template currently includes the full planned PrimeNG control set
- [ ] Docker watch mode needs explicit dev service if required
- [ ] Live browser verification currently blocked by persona/auth setup and backend persona loading issues

---

## View Model

The lab should expose three user-facing tabs:

| Tab | Purpose |
| --- | --- |
| `Normal PrimeNG` | Baseline PrimeNG rendering |
| `Encapsulation.None Impact` | Diagnostic view showing broad `.p-*` selector impact |
| `Fixed / Contained` | Scoped design-system boundary restoring predictable UI |

### Tab behavior

- Normal: the page preview and shared PrimeNG suite render the baseline design with no diagnostic overrides.
- Impact: the page preview is included in the impact tab so the same outside page content can show how broad `ViewEncapsulation.None` PrimeNG selectors corrupt unrelated UI.
- Fixed: the page preview is rendered inside the fixed/contained tab and should remain protected by the scoped `.design-system-scope` boundary, showing how the same impacted items can be restored.
- What we are doing:
  - `PrimengEncapsulationImpactComponent` simulates the problem by using `ViewEncapsulation.None` and broad `.encapsulation-lab--impact .p-*` overrides.
  - `PrimengEncapsulationFixedComponent` demonstrates the fix by keeping the same shared PrimeNG suite, but wrapping it in `.design-system-scope`.
  - The actual protection comes from CSS rules like `.design-system-scope .p-button`, `.design-system-scope .p-card`, `.design-system-scope .p-inputtext`, etc., not from setting encapsulation alone.
- This means the fixed/contained view is explicitly addressing the items impacted by an `Encapsulation.None` setup, not just a separate demo panel.

Recommended CSS mode classes:

```css
.encapsulation-lab--normal
.encapsulation-lab--impact
.encapsulation-lab--fixed
.design-system-scope
```

Rename any older `.ail-theme-v2` usage to:

```css
.design-system-scope
```

This is clearer, more professional, and easier to explain.

---

## Shared PrimeNG Component Suite

Each tab should render the same planned component suite so the styling differences are easy to compare. The goal is to include the full set of planned PrimeNG controls in every view, not to trim this suite down prematurely.

Include the following PrimeNG components in every view:

- [x] `p-button`
- [x] `p-inputText`
- [x] `p-inputTextarea` / `pTextarea`
- [x] `p-select`
- [x] `p-checkbox`
- [x] `p-radioButton`
- [x] `p-toggleSwitch`
- [x] `p-card`
- [x] `p-panel` or `p-fieldset`
- [x] `p-tabs`
- [x] `p-table`
- [x] `p-tag`
- [x] `p-chip`
- [x] `p-progressbar`
- [x] `p-message`

Current implementation status: the shared inner template (`PrimengEncapsulationSharedComponent`) includes the baseline PrimeNG suite plus the additional optional widgets that are already implemented in the current code.

The shared suite now covers `p-badge`, `p-accordion`, `p-steps`, `p-toolbar`, `p-toast`, `p-fieldset`, `p-avatar` / `p-avatar-group`, removable `p-chip` variants, and `p-skeleton`. The current implementation uses `p-select` instead of `p-dropdown` by default.

Optional PrimeNG exposures for future comparison:

- [ ] `p-dropdown` only if legacy PrimeNG dropdown behavior needs to be compared against current `p-select`
- [x] `p-badge`
- [x] `p-accordion`
- [x] `p-steps`
- [x] `p-toolbar`
- [x] `p-toast`
- [x] `p-fieldset` (dedicated wrapper section)
- [x] `p-avatar` / `p-avatarGroup`
- [x] `p-chip` variants such as removable chips
- [x] `p-skeleton` for a loading state demonstration

Suggested dashboard sections:

- trade action buttons
- search/filter form
- status controls
- trade summary card
- risk/progress indicator
- data table
- page preview section
- message/alert area
- tag/chip status labels

### Example trade dataset

The lab should use one consistent data shape across all three views. Example dataset values:

```ts
interface TradeRow {
  tradeId: string;
  ticker: string;
  side: 'Buy' | 'Sell';
  quantity: number;
  price: number;
  status: 'New' | 'Pending' | 'Filled' | 'Blocked' | 'Review';
  portfolio: string;
  counterparty: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  progress: number; // 0-100
  strategy: string;
  notes: string;
}
```

Sample rows:

- `T-1001`, `ACME`, `Buy`, 4,500, 125.50, `Pending`, `Alpha`, `BlueCap`, `Medium`, 42, `Block Trade`, `Awaiting compliance review`
- `T-1002`, `ZEN`, `Sell`, 2,250, 90.10, `New`, `Delta`, `GreenBridge`, `High`, 18, `Risk Hedge`, `High-impact swap`
- `T-1003`, `BETA`, `Buy`, 1,200, 212.75, `Filled`, `Sigma`, `RedRock`, `Low`, 100, `Market Sweep`, `Completed`

### Example lab surface mapping

- Trade action buttons: `p-button` controls for `Execute`, `Cancel`, `Review`, and `Clone` based on the selected trade row.
- Search/filter form: `p-inputText` for ticker, `p-select` for status (or `p-dropdown` for legacy comparison), `p-calendar` or `p-select` for date range, and a `p-button` search action.
- Status controls: `p-checkbox` or `p-toggleSwitch` for `Only active trades`, `p-radioButton` for `Buy/Sell`, and a `p-checkbox` group for `High risk / Medium risk / Low risk` filters.
- Trade summary card: a `p-card` showing totals and KPIs such as total trades, pending count, high-risk count, and average executed price.
- Risk/progress indicator: a `p-progressbar` for order workflow progress plus `p-tag` or `p-chip` labels for `High`, `Medium`, and `Low` risk.
- Data table: a `p-table` with columns for `Trade ID`, `Ticker`, `Side`, `Qty`, `Price`, `Status`, `Risk`, `Progress`, and action buttons.
- Message/alert area: `p-message` or `p-messages` for an info banner, execution warning, or success note.
- Tag/chip status labels: `p-tag` for trade status and `p-chip` for strategy or portfolio labels.

This is the planned component suite for the lab. We are not trimming the list here; the intent is to keep every planned control in the template so the impact and the fix are clearly comparable across the three views.

Suggested data theme:

```text
Capital markets-style trade review dashboard
```

No client-specific language should appear in the public lab.

---

## Tab 1 — Normal PrimeNG

### Purpose

Show the expected baseline before any encapsulation-related styling issue is introduced.

### Tasks

- [x] Set tab label to `Normal PrimeNG`
- [x] Render the shared PrimeNG component suite
- [x] Apply no diagnostic `.p-*` overrides
- [x] Use normal app spacing, cards, table layout, and PrimeNG styling
- [x] Add explanation text: `This is the baseline PrimeNG rendering.`
- [x] Confirm buttons, inputs, table, tags, chips, progress bar, messages, and controls look normal

### What This Proves

PrimeNG itself is not the problem. The baseline view establishes that the component library renders correctly before broad global styles are introduced.

---

## Tab 2 — Encapsulation.None Impact

### Purpose

Show what can happen when a component using `ViewEncapsulation.None` emits broad PrimeNG selectors.

### Tasks

- [x] Set tab label to `Encapsulation.None Impact`
- [x] Render the exact same PrimeNG component suite used in the normal tab
- [x] Apply diagnostic styles only under `.encapsulation-lab--impact`
- [x] Make the diagnostic styles highly visible and traceable
- [x] Keep native tab-switching buttons usable
- [x] Add explanation text: `This simulates broad .p-* selectors leaking from a component stylesheet.`

### Diagnostic Styling Targets

The component names above describe Angular/PrimeNG usage, while the selectors below describe the rendered PrimeNG CSS classes affected by broad overrides.

Style these broad PrimeNG selectors in impact mode:

- `.p-button`
- `.p-inputtext`
- `.p-select`
- `.p-checkbox`
- `.p-radiobutton`
- `.p-toggleswitch`
- `.p-card`
- `.p-panel`
- `.p-tabs`
- `.p-datatable`
- `.p-tag`
- `.p-chip`
- `.p-progressbar`
- `.p-message`

### Suggested Diagnostic Colors

Use intentionally obvious colors so the source of styling impact is easy to identify:

- lime buttons
- magenta borders
- cyan inputs
- yellow cards
- purple table headers

These colors are diagnostic only. They are not design-system colors.

### What This Proves

With `ViewEncapsulation.None`, broad PrimeNG selectors can behave like global CSS and affect many shared components.

### Documentation Wording

Use:

- diagnostic styling
- existing styling impact
- global selector impact
- encapsulation impact

Avoid:

- broken styling
- failed design system
- bad styles

---

## Tab 3 — Fixed / Contained

### Purpose

Show how a scoped design-system boundary restores predictable PrimeNG styling.

### Tasks

- [x] Set tab label to `Fixed / Contained`
- [x] Render the exact same PrimeNG component suite used in the other tabs
- [x] Rename `.ail-theme-v2` to `.design-system-scope`
- [x] Apply fixed styles only under `.design-system-scope`
- [x] Remove the large existing-style comparison zone from the fixed tab by default
- [x] Add explanation text: `This view restores styling through a scoped design-system boundary.`
- [x] Add small note: `Global styles may still exist, but this boundary protects the new design-system surface.`
- [x] Confirm the fixed view looks professional and stable

### Fixed Styling Targets

Re-style affected PrimeNG components under the scoped boundary:

- `.design-system-scope .p-button`
- `.design-system-scope .p-inputtext`
- `.design-system-scope .p-select`
- `.design-system-scope .p-checkbox`
- `.design-system-scope .p-radiobutton`
- `.design-system-scope .p-toggleswitch`
- `.design-system-scope .p-card`
- `.design-system-scope .p-panel`
- `.design-system-scope .p-tabs`
- `.design-system-scope .p-datatable`
- `.design-system-scope .p-tag`
- `.design-system-scope .p-chip`
- `.design-system-scope .p-progressbar`
- `.design-system-scope .p-message`

### Suggested Fixed Palette

Use calm enterprise styling:

- blue primary actions
- slate text
- white/surface cards
- subtle borders
- normal border radius
- predictable spacing
- accessible focus states

### What This Proves

The workaround is controlled containment, not page-by-page CSS patches.

---

## Fixed Tab Guidance

The fixed tab should not show a large existing-style comparison by default.

The first polished version should focus on:

- the fixed/contained view
- a short explanation
- the same PrimeNG component suite
- clean scoped design-system rendering

A comparison view can be added later as an optional toggle:

```text
Show existing-style comparison
```

or as a separate Storybook story.

---

## Implementation Checklist

### Shared

- [x] Create reusable PrimeNG component suite template
- [x] Use the same data and layout in all three tabs
- [x] Keep tab selector as native HTML buttons
- [x] Keep route at `/lab/primeng-encapsulation`
- [x] Avoid client-specific terminology
- [x] Document the lab as a styling migration and containment strategy

### Normal PrimeNG

- [x] Render shared component suite
- [x] Apply no diagnostic overrides
- [x] Add baseline explanation
- [x] Confirm PrimeNG appears normal

### Encapsulation.None Impact

- [x] Render shared component suite
- [x] Apply diagnostic `.p-*` overrides under `.encapsulation-lab--impact`
- [x] Make impact styles loud and traceable
- [x] Explain that disabled encapsulation can make component styles global
- [x] Confirm many PrimeNG components visibly change

### Fixed / Contained

- [x] Render shared component suite
- [x] Rename `.ail-theme-v2` to `.design-system-scope`
- [x] Apply restored styling under `.design-system-scope`
- [x] Remove large comparison zone from the default fixed view
- [x] Explain that scoped containment restores predictable styling
- [x] Confirm the fixed view looks professional

---

## Acceptance Criteria

- [ ] `/lab/primeng-encapsulation` renders successfully
- [ ] The page includes three tabs: `Normal PrimeNG`, `Encapsulation.None Impact`, and `Fixed / Contained`
- [ ] All three tabs render the same PrimeNG component suite
- [ ] Normal tab looks like normal PrimeNG
- [ ] Impact tab is visibly affected by diagnostic global `.p-*` selectors
- [ ] Fixed tab looks clean, professional, and contained
- [ ] Native tab-switching buttons remain usable in every mode
- [ ] The demo clearly shows that the issue is CSS cascade behavior, not PrimeNG itself
- [ ] The workaround is explained as scoped design-system containment
- [ ] No client-specific language appears in the public lab

> Note: code review confirms the current component structure and CSS boundary implementation; browser rendering should still be verified during QA.
>
> Live browser verification for this route was attempted, but the lab shell is currently blocked by persona/auth setup and backend persona loading errors.

---

## Developer Notes

The current Docker `architecture-dashboard` service is a production static build and does not provide a live Angular watch server. For fast frontend development, use the local Angular dev server instead:

- `pnpm nx serve architecture-dashboard --host 0.0.0.0`

If you need a rebuild-only Docker command, use:

- `pnpm run start:architecture-dashboard`

For the full stack rebuild, `pnpm run start:all:rebuild` now includes `architecture-dashboard` in the first `docker compose --build` pass, so the frontend dist bundle is rebuilt into the container image as part of the workflow.

That command rebuilds the `architecture-dashboard` container and serves the production bundle. For true watch mode inside Docker, a separate dev compose override or service is required that runs `pnpm nx serve architecture-dashboard` with mounted source files.

---

## Professional Summary

This lab recreates a PrimeNG-focused Angular styling scenario where `ViewEncapsulation.None` allows broad `.p-*` selectors to behave like global CSS. It demonstrates the baseline PrimeNG rendering, the impact of global selector leakage, and a scoped design-system containment approach that restores predictable styling without requiring every page to be rewritten.
