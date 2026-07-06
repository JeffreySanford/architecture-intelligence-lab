# Theme Accessibility Checklist

This checklist applies to the PrimeNG Nora preset, the app token aliases, and any Zeroheight documentation created from them.

## Contrast

- Primary text must remain readable on `--p-surface-0`, `--p-surface-50`, and highlighted backgrounds.
- Muted text should be used for secondary context only.
- Danger, warning, success, and info states need enough contrast in tags, alerts, and table rows.

## Focus

- Keyboard focus must be visible on buttons, links, inputs, selects, table rows, and overlay controls.
- Focus ring width, style, color, offset, and shadow should come from PrimeNG `focusRing` and `formField.focusRing` tokens.
- Do not remove outlines without replacing them with an equally visible tokenized focus state.

## Forms

- Invalid states should have a visible border and a text explanation.
- Placeholder text should not be the only label.
- Disabled state must remain distinguishable from read-only state.

## Data Density

- Dense tables are acceptable for operational screens, but headers, sort controls, row hover, and selected states must be scannable.
- Important values should not rely on color alone.

## Motion

- Keep route and row animations short.
- Respect reduced-motion expectations when future theme work adds motion controls.
