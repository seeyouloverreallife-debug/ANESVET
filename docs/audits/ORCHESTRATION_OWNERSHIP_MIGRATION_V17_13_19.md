# Orchestration Ownership Migration — V17.13.19

Canonical runtime ownership for startup positions 24–26 is now:

- Patient Master record orchestration → `runtime/orchestration/patient-master-orchestration.js`
- OR vital record orchestration → `runtime/orchestration/or-record-orchestration.js`
- Recovery state patch orchestration → `runtime/orchestration/recovery-orchestration.js`

The migration changes paths only. Startup order, exported global names, function semantics and clinical workflow contracts remain unchanged.

Updated in the same patch:
- `index.html`
- `service-worker.js`
- `config/runtime-map.json`
- End-to-end and path-aware QA
- architecture/owner documentation
