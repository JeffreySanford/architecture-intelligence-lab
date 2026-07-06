# PrimeNG Component Guidelines

The lab should demonstrate that PrimeNG components are themed through the Nora preset and token aliases, not through ad hoc class overrides.

## Button

- Use PrimeNG `pButton` for commands.
- Use icons for recognizable actions.
- Keep focus styling from the theme focus ring.
- Use severity variants for clear semantic meaning, such as danger actions.

## Forms

- Use PrimeNG form controls such as `p-select`, `p-inputtext`, and `p-toggleSwitch`.
- Form borders, hover borders, focus borders, invalid borders, and focus ring should come from `formField` tokens.
- Validation states should use semantic danger tokens.

## Data Tables

- Use `p-table` for dense operational data.
- Header cells, body borders, row hover, selected row, and filter overlays should come from data table and semantic tokens.
- Keep table rows compact enough for repeated operational work.

## Cards and Panels

- Use cards for repeated items, contained summaries, and framed tools.
- Avoid nesting cards inside cards.
- Radius and elevation should come from PrimeNG component tokens or shared app radius variables.

## Dialogs and Overlays

- Use PrimeNG overlays for modal and selection workflows.
- Overlay background, border, radius, and shadow should use semantic overlay tokens.
- Keyboard focus must remain visible inside overlays.

## Capital Markets Patterns

- Securities, pools, commitments, disclosures, pricing, and metrics should use consistent tag severities and table states.
- The same token vocabulary should apply across dashboard, security search, backend comparison, realtime, and OpenAPI lab pages.
