# R21 — Critical Boot Bridge Hotfix

Changed (exactly 6 existing files):
- `app.js`: direct bridge methods for OR More, Recovery More, and Recovery transfer/latest data. App version 17.2.25.
- `or-live-controller.js`: export pre-existing `closeOrMoreDialog` method.
- `recovery-controller.js`: export pre-existing `closeMore` as `closeMoreDialog`, plus `transferLatest`.
- `index.html`: cache-busted assets and inline diagnostic VERSION updated to 17.2.25.
- `service-worker.js`: assets revision and cache key.
- `manifest.webmanifest`: app name/URL metadata version.

No existing file was deleted; no clinical payload or schema migration introduced.

Additional: focused and compatible regression tests; R21 QA summary and device instructions.
