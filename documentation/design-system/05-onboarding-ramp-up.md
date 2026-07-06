# PrimeNG Theme Ramp-Up Before Onboarding

Between July 6, 2026 and July 15, 2026, useful low-risk work should build context without requiring production access. The best work products are documentation notes, environment validation, small UI observations, and questions that help future implementation move faster.

## Suggested Message

```text
Hi Neil, since the plan is to have me fully onboarded by the 15th, I wanted to ask if there is anything useful I can help with between now and then.

I am happy to take on lower-risk ramp-up work such as documentation review, local environment setup notes, PrimeNG/theme/design-system exploration, test review, small UI cleanup, code walkthroughs, or studying specific Capital Markets workflows. I do not want to get ahead of access or process, but I would like to use the time well and start building context wherever it would be helpful.

If there are particular repos, docs, tickets, domain concepts, or UI patterns you think I should focus on first, I would appreciate the direction.
```

## Useful Ramp-Up Areas

- Environment readiness: setup docs, local dev requirements, Node and Java versions, package manager, Docker expectations, VPN or access expectations, PrimeNG version, and test commands.
- Design system and PrimeNG: Zeroheight, Storybook, Nora preset, token structure, dark mode, density, form standards, table standards, overlay standards, and accessibility rules.
- Capital Markets vocabulary: securities, pools, commitments, trades, pricing, disclosures, settlement, audit history, operational metrics, and approval workflows.
- Safe code review or shadowing: read PRs, note patterns, identify repeated UI decisions, and ask architecture questions.
- Testing and documentation: setup notes, README cleanup, glossary additions, UI behavior documentation, accessibility observations, and design-system gaps.

## Repo-Specific Reading Order

1. `documentation/design-system/01-zeroheight-overview.md`
2. `documentation/design-system/02-md3-to-primeng-token-map.md`
3. `documentation/design-system/03-component-guidelines.md`
4. `documentation/design-system/04-accessibility.md`
5. `documentation/design-system/06-zeroheight-primeng-theme-governance.md`
6. `documentation/design-system/07-storybook-integration.md`
7. `apps/architecture-dashboard/src/app/core/theme/architecture-prime-preset.ts`
8. `apps/architecture-dashboard/src/styles/_colors.scss`
9. `/lab/theme` in the running dashboard
10. Any Storybook stories once Storybook is configured for the Angular app

## Good Questions To Ask

- Which design-system source is authoritative today: Zeroheight, Figma, Storybook, repo docs, or a mix?
- Should Storybook stories be linked from Zeroheight pages, generated from docs, or maintained manually?
- Are there approved PrimeNG component patterns for dense tables, filters, dialogs, and workflow actions?
- What are the required Capital Markets status terms and severity mappings?
- Are dark mode, compact density, and multi-theme support active requirements or future concerns?
- What accessibility checks are expected before a UI pull request is accepted?

## Low-Risk Deliverables

- A short environment setup note with commands that worked and any blockers.
- A glossary update for domain terms and UI terms.
- A component inventory of PrimeNG usage across key pages.
- A proposed Storybook story inventory for reusable PrimeNG component states.
- A token gap list comparing docs, token JSON, preset, and live UI.
- A focused accessibility observation list with screenshots or route names.

## Boundaries

- Do not request production data or credentials for ramp-up work.
- Do not change approved token values without design-system owner review.
- Do not introduce a new component library when PrimeNG already covers the need.
- Do not use Storybook-only styles that differ from the app's PrimeNG preset.
- Do not treat Zeroheight as a package to install in Angular; it is the documentation and governance layer.
