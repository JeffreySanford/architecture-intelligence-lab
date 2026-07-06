# Story Tracking And Testing Environment

This document tracks the first governed Storybook stories and the testing environment expected around them.

## Storyboard Coverage

| Story | Purpose | Required states |
| --- | --- | --- |
| `ThemeGovernance/PrimeNGStates` | Token, PrimeNG, Zeroheight validation with controls. | Compact density, dark preview, dialog open, selected pattern. |
| `Navigation/RolePermissionSidebar` | Validate explicit sidebar links by persona and role. | Viewer, Reviewer, Approver, Admin, Henry MCP Explorer. |
| `DataTables/CapitalMarketsWorkflow` | Validate governed table behavior for capital markets workflows. | Dense, empty, selected, warning, danger, filter. |
| `Forms/LoanReviewControls` | Validate governed form controls and role-aware actions. | InputText, Select, ToggleSwitch, validation, disabled, role-action states. |
| `Diagnostics/BackendComparisonStates` | Validate operational diagnostics states. | Healthy, degraded, unavailable, realtime disconnected, contract drift. |

## Story Testing Environment

The Storybook testing environment should cover functional behavior, accessibility, visual review, and CI automation.

| Capability | Criteria | Status |
| --- | --- | --- |
| Interaction tests | Test story functionality with user interactions for controls, selections, toggles, dialogs, and role-action states. | Planned |
| Accessibility addon | Install the Storybook accessibility addon and enable accessibility review in local Storybook. | Planned |
| Accessibility tests | Run accessibility checks for governed stories, including focus-visible behavior, labels, contrast-sensitive states, and status text. | Planned |
| Visual Tests addon | Install the Storybook Visual Tests addon for visual regression review. | Planned |
| Visual tests | Run visual tests for each governed story state before approving design-system changes. | Planned |
| CI automation | Automate Storybook build, interaction tests, accessibility checks, and visual tests in CI. | Planned |

## Story Acceptance Criteria

Each governed story should:

- Use real PrimeNG components where the production app uses PrimeNG.
- Use the same `ArchitecturePrimePreset` and runtime license configuration as the app.
- Include Storybook controls for important states.
- Link to governing Zeroheight, PrimeNG, and repo documentation where applicable.
- Cover at least one default state and one edge or failure state.
- Be stable enough for local review and automated CI checks.

## Initial Implementation Order

1. `ThemeGovernance/PrimeNGStates`
2. `Navigation/RolePermissionSidebar`
3. `DataTables/CapitalMarketsWorkflow`
4. `Forms/LoanReviewControls`
5. `Diagnostics/BackendComparisonStates`

