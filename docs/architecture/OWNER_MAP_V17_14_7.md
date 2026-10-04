# ANESVET V17.14.7 — UX ownership map

## OR Ventilation
- Canonical state owner: `runtime/controllers/or-live-controller.js` → `setVentilationMode()`.
- Visible mobile editor owner: `or-workspace-restructure.js`.
- Visible editor fields: `orVentRrEditor`, `orVentPipEditor`, `orVentPeepEditor`, `orVentVtEditor`.
- Authoritative stored fields remain `airwayVentRr`, `airwayPip`, `airwayPeep`, `airwayVt`.
- Presentation values mirror into authoritative fields; no separate clinical record schema is introduced.

## Case Drug Plan NSAID mapping
- Protocol/plan owner: `app.js` → `defaultCaseDrugPlanItems()`.
- `builtin_nsaid` resolves by species: cat → `meloxicamDose`, dog → `carprofenDose`.
- Frozen plan remains the source for OR medication review.
- Routine queue owner: `runtime/controllers/or-live-controller.js`; emergency/standby exclusions remain.

## Medication recording
- Canonical record owner remains `runtime/controllers/medication-workspace-controller.js`.
- No automatic route assumption was added for Meloxicam/Carprofen in V17.14.7.
