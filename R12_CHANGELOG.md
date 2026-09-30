# V17.2.16 R12 — Wake Session Ownership Guard

## Clinical scope
No dose calculation changes, no safety threshold changes, no clinical schema migrations, no automatic record rewrite.

## Source changes
- `session-coordination.js` — heartbeat checks owner, explicit takeover exception, old owner demotion
- `session-controller.js` — recheck on pageshow/visibility resume
- `app.js` — verify owner before save/mirror/clinical write
- `index.html`, `service-worker.js`, `manifest.webmanifest` — version/cache revision

## QA additions
- `QA_R12_WAKE_OWNERSHIP.js` — two-tab race, wake, save reject and queued mirror safety
- `QA_R12_NAVIGATION_REGRESSION.js`, `QA_R12_ASA_TRACE_REGRESSION.js`, `QA_BOOT_RUNTIME_V17_2_16.js` — version-targeted copies, originals kept
- `RUN_R12_QA.js` and `QA_R12_RESULTS.json`

## Limitations
No device/browser E2E verification; stale-owner auto-recovery behavior from prior versions is maintained intentionally; simultaneous last-writer wins across independent browser storage or devices is not solved by this local-tab guard.
