# ANESVET V16.18.0 — Architecture Hardening

## Summary
V16.18.0 is a technical architecture release following the V16.17 Production Pilot harness. It reduces cross-cutting responsibilities inside `app.js` by introducing explicit shell/session/PWA/reference/lifecycle boundaries while keeping the clinical algorithms and persisted case schema unchanged.

## New modules
- `app-shell.js` — shared DOM/format/toast utilities
- `dose-reference-controller.js` — dose-reference presentation controller only
- `session-controller.js` — view-only/active session UI boundary around the existing session coordinator
- `case-lifecycle.js` — pure active/sealed/reload-safety queries
- `pwa-controller.js` — install and service-worker update lifecycle
- `architecture-registry.js` — runtime module dependency health check

## Reliability Self-check
A new **Architecture module registry** item is included in the existing Reliability Self-check. It verifies that all required core/domain/orchestration/controller modules are loaded.

## Production Pilot retained
The V16.17 Production Pilot checklist and lifecycle evidence remain available. Existing device-local pilot progress is retained because the V16.17 pilot storage keys are intentionally unchanged.

## Clinical safety boundary
This release does not intentionally change:
- dose calculations or drug-volume safety;
- medication administration confirmation/reconciliation;
- alert thresholds or alert episode decisions;
- Recovery readiness/completion criteria;
- Documentation Guardian semantics;
- Problem → Intervention → Response review;
- Final Lock requirements;
- archive checksum/verification behavior;
- clinical data schema.

## Storage / migration
- `DB_VERSION = 2` unchanged
- no clinical-data migration required
- no storage key renamed
- no archive format change

## Browser smoke status
System Chromium headless was attempted against a local HTTP server but timed out in the execution environment. Browser/PWA smoke is therefore recorded as **BLOCKED / PENDING**, not PASS. Use the existing Production Pilot panel for real-device acceptance.
