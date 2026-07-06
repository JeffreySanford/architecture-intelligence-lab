# Theme Accessibility Checklist

This checklist applies to the PrimeNG Nora preset, the app token aliases, the `/lab/theme` preview, and any Zeroheight documentation created from them.

## Required Standard

- UI text and controls must remain readable on all tokenized surfaces used by the app.
- Keyboard users must be able to reach, identify, operate, and leave interactive controls.
- Status and validation must not rely on color alone.
- Reduced-motion preferences must be respected for custom chart or route motion where practical.

## Contrast

- Primary text must remain readable on `--p-surface-0`, `--p-surface-50`, muted panels, active navigation backgrounds, and highlighted backgrounds.
- Muted text should be used for secondary context only.
- Danger, warning, success, and info states need enough contrast in tags, alerts, chart legends, and table rows.
- Primary action text must be readable against `--p-primary-color`, hover, and active states.
- Disabled controls must remain distinguishable from enabled and read-only states.

## Focus

- Keyboard focus must be visible on buttons, links, inputs, selects, toggles, table controls, router links, and overlay controls.
- Focus ring width, style, color, offset, and shadow should come from PrimeNG `focusRing` and `formField.focusRing` tokens.
- Do not remove outlines without replacing them with an equally visible tokenized focus state.
- Focus must stay inside modal dialogs while open and return to a sensible trigger after close.

## Forms

- Invalid states must include a visible border and a text explanation.
- Placeholder text must not be the only label.
- Required fields must be identified in text or accessible name.
- Error messages should identify the field and the correction needed.
- Disabled, read-only, invalid, focused, and hover states must be visually distinct.

## Data Tables

- Dense tables are acceptable for operational screens, but headers, sort controls, filters, row hover, and selected states must be scannable.
- Important values should not rely on color alone.
- Status tags should include text labels.
- Sorting and filtering controls should be keyboard reachable.
- Horizontal overflow must not hide critical workflow actions on smaller screens.

## Charts And Diagrams

- Chart colors must have sufficient contrast against the chart surface.
- Legends or labels must identify each series.
- Empty states must use text, not only blank charts.
- Reduced-motion users should not require animation to understand the data.
- D3 or canvas visuals should have an accessible label or adjacent text summary when they carry meaning.

## Motion

- Keep route, row, and chart animations short.
- Avoid motion that changes layout unexpectedly during data refresh.
- Respect reduced-motion expectations when future theme work adds motion controls.

## Validation Checklist For Changes

- Tab through landing, dashboard, sidebar navigation, one data table, one form, and one overlay.
- Check `/lab/theme` for button, input, table, card, and tag contrast.
- Confirm visible focus on `pButton`, router links, `p-select`, and table controls.
- Confirm invalid form states show border plus text.
- Run `pnpm nx run architecture-dashboard:test`, `lint`, and `build` before merging accessibility-impacting theme changes.
