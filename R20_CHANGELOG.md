# ANESVET R20 Critical Boot Hotfix — Changes and QA

- Base: V17.2.23 R19 (source kept intact except targeted code + version changes).
- User device failure (V17.2.14): `renderDefaultReportPreference is not defined` shortly after `current-case-loaded`; `ready: false`, ASA selected status stale.
- Reproduced in R19 source: `app.js` invokes `renderDefaultReportPreference()` during `loadSettings()` but controller function was not exported into app's scope.
- Fix: expose method from finalization controller and add explicit `app.js` bridge. Preserve existing function body and semantics.
- Set V17.2.24 and new Service Worker cache name for fresh asset URLs.
- No patient data/clinical logic/dose calculation/DB schema changes.

## Validation

- Targeted boot/preference checks: **12/12 passed**.
- Cumulative regression: **25/25 passed**.
- JS syntax: **156/156 passed**.
- HTML ID duplicates: 0; missing cached assets: 0; version consistency: True.
- Chromium headless E2E: **NOT VERIFIED** (browser command timed out, no DOM produced).
- Real Android/iPad: **NOT VERIFIED**; verify with Device Diagnostic after deployment.

## Source comparison against R19

Unchanged R19 files: **687 / 692**.
Modified R19 files: **app.js, finalization-archive-controller.js, index.html, manifest.webmanifest, service-worker.js**.
Removed files: none.
Extra items include QA compatibility copies, new regression test, results and documentation.

**Note:** Regression passes do not guarantee an E2E-ready or clinically validated anesthesia system. This is a focused Boot hotfix, not a production clearance.
