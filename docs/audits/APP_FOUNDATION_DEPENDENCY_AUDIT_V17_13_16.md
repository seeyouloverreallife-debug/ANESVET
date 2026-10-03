# App Foundation Dependency Audit — V17.13.16

## Scope
Continue the V17.13.15 audit of the 10 `app-foundation` startup modules and migrate the guarded state/storage subgroup.

## A. Core utility shell — already canonical
Startup positions 9–12:
- `runtime/core/app-shell.js`
- `runtime/core/case-lifecycle.js`
- `runtime/core/support.js`
- `runtime/core/reliability.js`

No change in V17.13.16.

## B. State/storage foundation — moved in V17.13.16
Startup positions 13–16:
- `branding.js` → `runtime/core/branding.js`
- `clinical-validation.js` → `runtime/core/clinical-validation.js`
- `case-runtime.js` → `runtime/core/case-runtime.js`
- `core-storage.js` → `runtime/core/core-storage.js`

Evidence before move:
- no relative `fetch()` / dynamic `import()` / `new URL()` / `currentScript` path dependency;
- `branding.js` retains localStorage settings ownership;
- `clinical-validation.js` remains validation-only and storage-independent;
- `case-runtime.js` retains the `ANESVET_CASE_RUNTIME` checksum/runtime API;
- `core-storage.js` retains IndexedDB ownership;
- all four sources are byte-identical to V17.13.15 after the move.

## C. Session ownership pair — still deferred
Startup positions 17–18:
- `session-coordination.js`
- `session-controller.js`

`session-controller.js` depends on both canonical app-shell and session coordination. The pair remains at root and must migrate together in a later release.

## Safety conclusion
V17.13.16 changes paths only for subgroup B. No persistence schema, checksum behavior, validation semantics, session semantics, medication calculation, alert threshold or clinical workflow contract was changed.
