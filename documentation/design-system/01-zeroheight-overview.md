# Zeroheight and PrimeNG Theme Governance

Zeroheight belongs in this lab as the design-system documentation and governance layer. It should not be treated as an Angular runtime dependency. The Angular app implements the design system through PrimeNG styled-mode tokens and a Nora-based preset.

## Working Model

```text
Figma / design tokens / design-system docs
        -> Zeroheight styleguide and governance
        -> PrimeNG Nora preset token mapping
        -> Angular components and CSS variables
```

## Zeroheight Responsibilities

- Document approved colors, typography, spacing, radius, elevation, and focus rules.
- Explain component usage for PrimeNG buttons, inputs, selects, tables, cards, dialogs, tags, and messages.
- Hold accessibility guidance for contrast, keyboard focus, validation, density, and table readability.
- Link to Figma, Storybook, GitHub, GitLab, and implementation references where available.
- Capture do and do-not examples for Capital Markets workflows.

## PrimeNG Responsibilities

- Implement the approved tokens in `ArchitecturePrimePreset`.
- Map primitive palette values into semantic tokens such as primary, surface, text, highlight, form field, and focus ring.
- Use component tokens for specific PrimeNG component tuning.
- Keep direct PrimeNG CSS class overrides as the last resort.

## Free Plan Fit

Zeroheight Free is enough for this lab scope because the goal is one styleguide, one token set, and a focused developer/design-system workflow. Enterprise features such as multiple token sets, multi-theme governance, SSO, analytics, and deeper API/MCP access can be modeled later but are not required for the lab foundation.

## Lab Name

Recommended styleguide name:

```text
Architecture Intelligence Lab Design System
```

Recommended implementation theme:

```text
PrimeNG Nora Enterprise Theme
```
