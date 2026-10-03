# ANESVET V17.14.6 — UX ownership map

## OR Ventilation
- Canonical state mutation owner: `runtime/controllers/or-live-controller.js` → `setVentilationMode()`.
- Authoritative fields: `airwayVentMode`, `orVentilation`, master `ventilation`.
- Presentation / task workspace: `or-workspace-restructure.js`.
- Vent interaction styling: `assets/css/or-workspace-restructure.css`.
- Contract: presentation buttons call the controller owner; they do not independently own clinical state.

## Recovery vital entry
- Recovery state/record semantics: `runtime/controllers/recovery-controller.js` + Recovery domain/orchestration.
- Primary editable panel: `recoveryObservationPanel`.
- First-screen fields: HR, RR, SpO₂, Temp, Mentation, Extubation.
- Secondary observations: MAP, O₂ support, interval, note, optional structured assessment.
- Record history stays under Recovery secondary details.

## Recovery assessment
- Authoritative values remain `recScoreAirway`, `recScoreOxygen`, `recScoreTemp`, `recScoreMentation`, `recScoreComfort`.
- Mobile presentation uses the native descriptive selects; numeric-only helper controls are retired from active binding.
- Score calculation, N/A rules and readiness gating remain in existing Recovery controller/domain semantics.

## Preserved V17.14.5 ownership
- Medication workspace: `runtime/controllers/medication-workspace-controller.js`.
- Tramadol SC site default and standby/emergency auto-advance exclusion remain unchanged.
- Mobile bottom bar/keyboard presentation: `src/styles/canonical/mobile-design.css`.
- Workflow Undo remains audit-safe; vital/drug corrections remain correction/void workflows.
