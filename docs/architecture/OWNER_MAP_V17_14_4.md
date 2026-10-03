# ANESVET Owner Map — V17.14.4

Runtime grouping remains unchanged from V17.14.3.

- Platform: `runtime/platform/` positions 1–5
- Clinical foundation: `runtime/clinical/` positions 6–8
- Core/app foundation: `runtime/core/` positions 9–18
- Domains: `runtime/domains/` positions 19–23
- Orchestration: `runtime/orchestration/` positions 24–26
- Controllers: `runtime/controllers/` positions 27–33
- Remaining startup modules: root positions 34–69
- Lazy knowledge: `runtime/knowledge/` (7 modules)

## V17.14.4 Physical Pilot ownership
- Technical device telemetry owner: `production-pilot.js`
- Device telemetry DOM: Production Pilot panel in `index.html`
- Authoritative build version: `AnesvetApp.version`
- Clinical state ownership remains in existing domains/controllers; Production Pilot is not a clinical writer
- Lifecycle evidence remains separate from bounded telemetry evidence

Continuous device telemetry is opt-in and must never mutate case state, medication records, vital records, workflow phase or finalization state.
