# ANESVET V16.18.4 — Architecture Hardening Phase 8

## Goal
Continue incremental controller extraction without changing medication clinical semantics or persisted data. This phase moves the active medication documentation workspace out of `app.js`.

## New ownership boundary

### `medication-workspace-controller.js`
Owns:
- actual medication administration dialog state
- administration confirmation + duplicate check orchestration
- administration audit/VOID UI
- frozen-protocol Quick Drug workspace state
- induction multi-drug batch documentation
- OR quick-med strip
- Recovery medication entry point
- medication workspace event bindings

It receives dose calculation, current-BW validation, Case Drug Plan matching, OR workflow state, persistence, and audit/event services through dependency injection.

## Preserved boundaries
`safeMedicationCalculation()`, Hospital Drug Library, Case Drug Plan configuration, protocol governance, medication reconciliation, and Final Lock prerequisites are not moved or behaviorally changed in this phase.

## Layer model
```text
Controller
├── patient-master-controller.js
├── preop-controller.js
├── or-live-controller.js
├── medication-workspace-controller.js   ← new extraction
├── recovery-controller.js
└── dose-reference-controller.js

App composition
└── app.js
    ├── case/procedure composition
    ├── protocol + Drug Library configuration
    ├── shared report/handoff builders
    ├── fluid/problem/alert services
    ├── finalization/archive UI
    └── backup/restore UI
```

## Compatibility contract
Unchanged:
- `DB_VERSION = 2`
- dose calculations / preparation-missing safety stop
- medication actual confirmation
- Case Drug Plan semantics
- medication reconciliation
- OR / Recovery clinical rules
- Documentation Guardian
- Final Lock + Final Archive Assurance

## Next extraction sequence
1. Finalization + archive UI controller
2. Backup/restore UI controller
3. Protocol / settings boundary if real-device regression remains stable

Do not combine these controller extractions with major clinical behavior changes.
