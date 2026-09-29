# ANESVET V16.18.3 — Architecture Hardening Phase 7

## Goal
Continue incremental controller extraction without changing OR clinical rules, medication semantics, Recovery rules, or persisted data. This phase moves the OR LIVE UI/controller layer out of `app.js` into `or-live-controller.js` while leaving the existing OR Domain and OR Record Orchestration modules byte-identical.

## New ownership boundary

### `or-live-controller.js`
Owns OR LIVE UI/controller behavior for:
- OR ↔ main vital-field mirroring
- OR mini-trends and recent activity presentation
- OR timer presentation
- workflow profile/context presentation
- hospital Procedure Template quick-documentation actions
- planned medication queue presentation and current/later/documented grouping
- induction documentation status presentation
- primary workflow card and mobile dock
- workflow-step confirmation and short-window undo UI
- airway/intubation UI and ventilation-field synchronization
- OR LIVE patient/risk/vital/alert rendering
- start/resume/pause/record buttons and OR navigation bindings
- OR More menu, fullscreen action, workflow/event/complication buttons

The controller receives app services through dependency injection. It does **not** define new dose calculations, alarm thresholds, Recovery completion rules, archive rules, or storage schema.

## Preserved domain boundaries

### `or-domain.js`
Remains the source for OR vital snapshot semantics, duplicate detection support, vital summary formatting, and record alert classification.

### `or-record-orchestration.js`
Remains the source for vital commit/delete/correction orchestration.

Both files are byte-identical to V16.18.2.

## Layer model after V16.18.3

```text
Browser / shell
├── app-shell.js
├── pwa-controller.js
├── session-controller.js
└── architecture-registry.js

Core
├── case-runtime.js
├── case-lifecycle.js
├── core-storage.js
└── session-coordination.js

Domain
├── patient-domain.js
├── or-domain.js
└── recovery-domain.js

Orchestration
├── patient-master-orchestration.js
├── or-record-orchestration.js
└── recovery-orchestration.js

Controller
├── patient-master-controller.js
├── preop-controller.js
├── or-live-controller.js        ← new extraction
├── recovery-controller.js
└── dose-reference-controller.js

App composition
└── app.js
    ├── age/breed + case/procedure composition
    ├── medication workspace integration
    ├── shared report/handoff builders
    ├── fluid/problem/alert services injected into OR controller
    ├── finalization/archive UI
    └── backup/restore UI
```

## `app.js` impact
V16.18.2: **4,810 lines**  
V16.18.3: **4,350 lines**  
Reduction: **460 lines**.

The extraction preserves **58/58 OR LIVE functions** from the moved source block and **53/53 event-listener bindings**. Three adapter substitutions are intentional and non-clinical:
1. temperature display unit is accessed through an injected getter;
2. workflow undo confirmation uses an injected confirm function;
3. timer-loop clearing uses an injected callback instead of direct access to the app-owned timer handle.

## Compatibility wrappers retained in `app.js`
A small set of wrapper functions remains so existing app code can call the same names while implementation ownership is delegated to the controller. Examples include:
- `renderOrLive()`
- `renderAirwayPanel()`
- `handleOrWorkflowAction()`
- `renderOrUndoControls()`
- `inductionMedicationRecords()`
- `plannedRoutineMedicationRows()`
- `workflowProfileInfo()`

This allows the extraction to remain incremental instead of forcing a broad rewrite.

## Compatibility contract
Unchanged:
- `DB_VERSION = 2`
- dose calculations and medication confirmation
- Case Drug Plan semantics
- OR alert thresholds and alert episode semantics
- OR vital record schema / correction behavior
- Recovery readiness/completion
- Documentation Guardian
- Problem → Intervention → Response review
- Final Lock prerequisites
- Final Archive Assurance checksum semantics
- Production Pilot storage keys

## Next extraction sequence
After real-device OR LIVE regression:
1. Medication workspace controller
2. Finalization + archive UI controller
3. Backup/restore UI boundary
4. Further app composition cleanup only after those boundaries are stable

Do not combine controller extraction with major new clinical behavior in the same release.
