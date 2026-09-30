# ANESVET V17.2.6 — R02 Mobile Boot Diagnostic

Targeted incremental update from the exact V17.2.5 R01 checkpoint. No new clinical feature or workflow redesign.

**Resolved diagnostic defect**: partial startup stalls now open a visible diagnostic panel instead of writing an internal watchdog marker only. A manual diagnostics button is also available before application controller binding; ASA taps now capture blocker evidence and a session-status hint. These are diagnostic changes; Android/iPad interaction failure remains unconfirmed until real-device testing.

**Preservation**: only index.html, app.js (APP_VERSION only), service-worker.js (version/cache), and manifest.webmanifest changed from R01. 505/509 source files remain byte-identical. Clinical storage schema and semantics unchanged.

**Validation**: 8 automated suites + 65 JS syntax checks; 143/143 passing, resource/path checks passing. Full real-device E2E pending.

See BUGFIX_CHECKPOINT_R02_TH.md and DEVICE_R02_TEST_STEPS_TH.md.
