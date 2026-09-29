# ANESVET V16.18.0 — Architecture Hardening Phase 4

## Goal
V16.18.0 starts the post-pilot architecture hardening work without rewriting the application and without changing clinical behavior. The release isolates cross-cutting browser/UI responsibilities that had accumulated inside `app.js`, adds a dependency registry, and moves release/update safety queries into a pure module.

The rule for this phase is **boundary first, behavior unchanged**.

## New ownership boundaries

### `app-shell.js`
Owns shared non-clinical UI utilities:
- DOM lookup helpers (`$`, `$$`)
- HTML escaping
- numeric clamping
- date/time formatting
- toast factory

It has no access to case state, dose logic, alert thresholds, Recovery rules or storage schema.

### `dose-reference-controller.js`
Owns the UI presentation of the already-loaded medication reference data:
- dose-reference chips
- inline reference button
- reference dialog rendering
- click delegation

It does **not** calculate a dose, select a drug, create a medication order, or record an administration.

### `session-controller.js`
Wraps the existing `session-coordination.js` engine and owns:
- active/view-only UI mode
- conflict dialog
- session banner
- takeover/refresh controls
- edit guards for view-only tabs

The underlying lock keys, heartbeat behavior and same-device session semantics remain unchanged.

### `case-lifecycle.js`
Pure queries only:
- `hasActiveCaseData(case)`
- `finalCaseIsSealed(case)`
- `versionReloadUnsafe(case)`

These queries are now reusable by PWA/update code and release diagnostics without duplicating the logic.

### `pwa-controller.js`
Owns browser install/update plumbing:
- `beforeinstallprompt`
- install button state
- service-worker registration/update detection
- deferred update banner
- controller-change reload

Whether a reload is safe remains an injected query from `case-lifecycle.js`; the controller does not inspect or mutate clinical state directly.

### `architecture-registry.js`
Provides a small runtime dependency inventory used by Reliability Self-check. It confirms that required runtime/domain/orchestration/controller modules are present before the application is considered structurally healthy.

## Layer model after V16.18

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

Feature / controller modules
├── dose-reference-controller.js
├── procedure-templates.js
├── documentation-guardian.js
├── problem-response-review.js
├── production-pilot.js
└── other existing feature modules

App composition
└── app.js
    ├── clinical workflow composition
    ├── DOM-heavy legacy controllers still pending extraction
    └── feature integration / rendering
```

## What deliberately remains in `app.js`
V16.18 does **not** attempt a high-risk one-release rewrite. The following remain in the app composition layer for now:
- Patient Master controller/rendering
- Pre-op controller/rendering
- OR LIVE controller/rendering
- medication workspace integration
- Recovery controller/rendering
- Finalization/archive UI integration
- backup/restore UI

These are the next candidates for incremental extraction after V16.18 real-device regression.

## Compatibility contract
Unchanged in this release:
- IndexedDB `DB_VERSION = 2`
- current-case localStorage key
- archive storage model
- Patient Master storage
- dose calculations
- medication confirmation/reconciliation semantics
- alert thresholds and alert decision logic
- Recovery readiness/completion criteria
- Documentation Guardian rules
- Problem → Intervention → Response semantics
- Final Lock prerequisites
- Final Archive Assurance checksum semantics
- Production Pilot acceptance data keys

## Why app.js is still large
The previous architecture refactors intentionally created pure domain and mutation boundaries before moving UI controllers. V16.18 removes cross-cutting shell/session/PWA/reference responsibilities first because they are comparatively low-risk and easy to regression-check.

Line count is therefore not treated as a success metric by itself. The important change is that these responsibilities now have explicit ownership and can be tested/replaced without touching the clinical composition layer.

## Next extraction sequence
After V16.18 has passed the Production Pilot matrix on the target OR devices:
1. Patient Master controller
2. Pre-op controller
3. Recovery controller
4. OR record/controller adapters
5. Medication workspace controller
6. Finalization + archive UI controller

Do not combine a major clinical feature release with a large controller extraction in the same version.
