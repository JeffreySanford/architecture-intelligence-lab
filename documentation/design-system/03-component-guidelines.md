# PrimeNG Component Guidelines

The lab should demonstrate that PrimeNG components are themed through the Nora preset and token aliases, not through ad hoc class overrides. Component choices should support dense operational work, clear status scanning, and repeatable Capital Markets workflows.

## General Rules

- Prefer PrimeNG components over hand-built equivalents when a component exists.
- Use token-driven styling for color, border, radius, focus, shadow, and interaction states.
- Use app layout classes for page composition, spacing, responsive grid behavior, and domain-specific arrangement.
- Avoid nested cards and decorative wrappers that make dense workflow screens harder to scan.
- Keep component copy concise and domain-specific.
- Add or update a Storybook story when a component guideline becomes reusable across pages.

## Storybook Story Contract

Storybook should demonstrate the component states that Zeroheight documents and PrimeNG implements. The story is not the source of truth for design decisions; it is the executable example layer.

| Storybook concern | Zeroheight link | PrimeNG link |
| --- | --- | --- |
| Component purpose | Zeroheight component page or this file | PrimeNG component selection and imports |
| Token behavior | Foundations and token documentation | `ArchitecturePrimePreset` and PrimeNG CSS variables |
| Interaction states | Component do and do-not examples | PrimeNG state classes and component tokens |
| Accessibility notes | Accessibility checklist | Focus ring, invalid state, disabled state, overlays |

Recommended first story:

```text
ThemeGovernance/PrimeNGStates
```

Recommended examples in that story:

- Primary, text, and danger buttons.
- InputText default, focused, invalid, and disabled states.
- Select with finite workflow choices.
- DataTable with hover, selected, empty, and dense rows.
- Card with operational summary content.
- Tag severities for success, warning, danger, and info.

## Buttons

- Use PrimeNG `pButton` for commands.
- Use icons for recognizable actions such as save, refresh, search, open, inspect, approve, reject, download, and reset.
- Use text buttons for navigation or low-emphasis commands.
- Use severity variants for semantic meaning, especially danger and warning actions.
- Keep focus styling from the theme focus ring.
- Disable buttons only when the action is not available; show loading state when the action is available but in progress.

## Forms

- Use PrimeNG form controls such as `p-select`, `p-inputtext`, `p-toggleSwitch`, checkboxes, radio buttons, and text areas.
- Form borders, hover borders, focus borders, invalid borders, and focus rings should come from `formField` tokens.
- Validation states must use semantic danger tokens and a text explanation.
- Placeholder text must not be the only label.
- Required and optional state should be visible in text, not color alone.
- Prefer predictable controls: select for finite choices, toggle for binary settings, input for free text, and table filters for data search.

## Data Tables

- Use `p-table` for dense operational data.
- Header cells, body borders, row hover, selected row, and filter overlays should come from data table and semantic tokens.
- Keep row height compact enough for repeated operational work.
- Preserve readable column labels and avoid truncating critical identifiers such as loan number, security, pool, commitment, trade, or disclosure id.
- Use tags or badges for status, but do not rely on color alone. Include status text.
- Use pagination or virtual scrolling when row count makes the table difficult to scan.

## Cards And Panels

- Use cards for repeated items, contained summaries, and framed tools.
- Do not put cards inside cards.
- Avoid page sections styled as floating cards when a full-width section or simple layout is enough.
- Radius and elevation should come from PrimeNG component tokens or shared app radius variables.
- Keep headings inside cards smaller than page headings.

## Dialogs And Overlays

- Use PrimeNG overlays for modal and selection workflows.
- Overlay background, border, radius, and shadow should use semantic overlay or content tokens.
- Keyboard focus must remain visible inside overlays.
- Closing behavior must be predictable: Escape closes dismissible dialogs, explicit actions confirm changes, and destructive actions require clear labels.
- Overlay content should not duplicate entire pages; keep it scoped to the current workflow.

## Navigation

- Sidebar links are permission-driven. Roles and personas do not directly control the sidebar.
- Seeded persona permissions determine which navigation links appear.
- Navigation labels should be short and stable. Descriptions should explain the workflow, not implementation trivia.
- Active route state should be visible through tokenized color and shape, not only icon changes.

## Capital Markets Patterns

- Securities, pools, commitments, trades, disclosures, pricing, and metrics should use consistent tag severities and table states.
- Workflow actions such as review, approve, reject, inspect, reconcile, and export should use consistent button severity and icon patterns.
- Audit history should use tables or timelines with timestamp, actor, action, status, and notes.
- Metrics should pair visual summaries with exact values so users can inspect the data without relying only on chart color.
- The same token vocabulary should apply across dashboard, security search, backend comparison, realtime, OpenAPI, MCP, glossary, and theme lab pages.

## Do And Do Not

| Do | Do not |
| --- | --- |
| Use PrimeNG tokens for component states. | Override `.p-button`, `.p-table`, or `.p-card` globally without a documented reason. |
| Keep pages dense but organized. | Add decorative cards around every section. |
| Use text plus color for status. | Communicate status with color alone. |
| Document reusable component decisions here. | Leave one-off component behavior unexplained when it becomes a pattern. |
| Link Storybook examples to Zeroheight guidance. | Let Storybook become an undocumented alternate design system. |
