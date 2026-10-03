# App Foundation Dependency Audit — V17.13.15

## Scope
Audit the 10 `app-foundation` startup modules before moving them from package root into `runtime/core/`.

## Result: three migration subgroups

### A. Core utility shell — moved in V17.13.15
Startup positions 9–12:
1. `app-shell.js`
2. `case-lifecycle.js`
3. `support.js`
4. `reliability.js`

Evidence:
- no relative `fetch()` / dynamic `import()` / `new URL()` / `currentScript` path dependency
- `case-lifecycle.js` remains pure query logic
- `support.js` remains a local report composer with no network backend
- `reliability.js` remains an environment helper
- `app-shell.js` depends on the already-loaded lifecycle coordinator but does not require the deferred session/storage subgroup

Moved to `runtime/core/` without code changes.

### B. State/storage foundation — deferred
Startup positions 13–16:
- `branding.js`
- `clinical-validation.js`
- `case-runtime.js`
- `core-storage.js`

Reason for deferral: this group contains settings/localStorage, case state/checksum, validation and IndexedDB ownership. It should move as a separately guarded migration.

### C. Session ownership pair — deferred
Startup positions 17–18:
- `session-coordination.js`
- `session-controller.js`

`session-controller.js` explicitly depends on both `ANESVET_APP_SHELL` and `ANESVET_SESSION_COORDINATION`; the pair must remain ordered and should migrate together.

## Safety conclusion
V17.13.15 moves only subgroup A. No clinical thresholds, medication calculations, persistence schema, session semantics or finalization semantics were changed.
