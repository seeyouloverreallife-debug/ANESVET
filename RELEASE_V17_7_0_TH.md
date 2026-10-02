# ANESVET V17.7.0 — Workflow Hardening

## Fixed from observed clinical-use feedback
- Removed document-wide mobile-shell re-render on every `input` keystroke. Shell refresh now waits for committed change/focus exit or explicit state/navigation events.
- OR LIVE vital fast-entry remains live and targeted; it is not disabled by this change.
- Mobile OR workflow now keeps the native `Surgery end` action reachable when it is the valid secondary C-section action, even if presentation CSS temporarily hides the native secondary control.
- Native Surgery end confirmation and state mutation remain owned by `or-live-controller.js`; the mobile shell only delegates the click.
- Explicit tab navigation releases active editable focus before resetting scroll position, reducing Android IME/visualViewport tab/header jumps.
- Toast/feedback is forced above the mobile footer and moves to the safe top area while editing/soft keyboard is open.
- Updated production version/cache namespace to 17.7.0.

## Safety boundary
No intended changes to dose calculations, medication administration records, phase transition mutation, Surgery end confirmation, Recovery criteria, alert thresholds, storage schema, audit semantics, Final/Archive locking, or clinical knowledge.

## Required device validation
Physical Android/PWA testing remains required for IME behavior, fullscreen navigation, installed-PWA splash behavior, and touch reachability.
