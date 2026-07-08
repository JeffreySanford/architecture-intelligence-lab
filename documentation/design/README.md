# Design System Documentation

This directory documents the design-system direction for `architecture-intelligence-lab`. The focus is a PrimeNG-first enterprise UI model using the Nora preset as the base inspiration, with Zeroheight-style documentation and governance layered above the Angular implementation.

The design system is intentionally practical. It is not only a color palette or visual polish pass. It is a way to keep Capital Markets screens consistent across tables, cards, forms, status panels, disclosure workflows, realtime metrics, and admin surfaces.

## Reading Order

1. [PrimeNG Nora Enterprise Theme Direction](01-primeng-nora-enterprise-theme.md)
2. [Zeroheight Governance Workflow](02-zeroheight-governance-workflow.md)
3. [MD3 To PrimeNG Token Migration](03-md3-to-primeng-token-migration.md)
4. [Component Usage Guidelines](04-component-usage-guidelines.md)

## Design System Goals

| Goal | Meaning In This Lab |
| --- | --- |
| PrimeNG first | PrimeNG is the primary Angular component system for enterprise UI patterns. |
| Nora inspired | Nora is the enterprise-inspired starting point for the visual language. |
| Token governed | Primitive, semantic, and component tokens should drive styling decisions. |
| Zeroheight documented | Zeroheight-style pages should explain usage, rules, examples, and rationale. |
| MD3 migration aware | Existing MD3-style variables are treated as migration input, not discarded work. |
| Capital Markets ready | Tables, forms, cards, workflows, statuses, and metrics should support dense regulated workflows. |
| Accessibility explicit | Focus states, contrast, keyboard flow, reduced motion, and error states are design requirements. |

## Runtime Boundary

Zeroheight is not a runtime Angular dependency in this lab. It is the documentation and governance layer. Angular and PrimeNG implement the theme in code.

```text
Zeroheight-style docs / token governance
        ↓
PrimeNG Nora-based preset and token map
        ↓
Angular dashboard components
        ↓
Capital Markets workflow screens
```

## Source Locations

| Area | Repo Location |
| --- | --- |
| Global app styles | `apps/architecture-dashboard/src/styles.scss` |
| Current MD3-style color aliases | `apps/architecture-dashboard/src/styles/_colors.scss` |
| PrimeNG provider setup | `apps/architecture-dashboard/src/app/app.config.ts` |
| Future PrimeNG preset | `apps/architecture-dashboard/src/app/core/theme/architecture-prime-preset.ts` |
| Future token exports | `design-system/tokens/` |
| Design documentation | `documentation/design/` |

## Decision Summary

Use PrimeNG Nora as the enterprise-inspired visual baseline, keep existing `--color-*` variables as compatibility aliases during migration, and gradually move new component styling toward PrimeNG semantic and component tokens.

Avoid broad CSS overrides of PrimeNG internals. Prefer tokens first, app-level aliases second, scoped component styles third, and raw PrimeNG class overrides only as a narrow last resort.
