# ANESVET V17.7.1 — OR → Recovery Transition Hardening

## Changes
- Fullscreen exit during navigation now returns a settle promise with a 450 ms maximum wait, preventing Android/PWA fullscreen exit from racing Recovery layout.
- Recovery/End Case navigation performs a two-frame viewport settle after fullscreen exit, resets scroll once, and emits the shared `anesvet:viewportchange` event.
- Extubation and manual Begin Recovery release stale OR LIVE editor focus before the Recovery screen is activated.
- Existing Recovery state mutation, handoff capture, audit, event creation, save, wake-lock, and forced Recovery navigation remain unchanged.
- V17.7.0 keyboard/End Surgery/toast hardening remains in place.

## Safety boundary
No intended change to Extubation timestamping, Recovery start timestamp, readiness criteria, emergency-return behavior, dose/medication logic, alerts, storage schema, audit semantics, or Final/Archive locking.

## Validation
Static/syntax regression checks included in the release build. Physical Android/PWA fullscreen and IME testing is still required.
