# ANESVET V17.2.5 — Boot / Runtime Diagnostic Rescue

## Why this release exists
V17.2.4 was deployed completely and matched the release package, yet a separate iPad with no active case still allowed native text entry while ASA/buttons/navigation did not respond. This pattern is compatible with JavaScript startup stopping before controller event binding, or with a global event interception after DOM rendering.

## Changes
- Added an inline boot sentinel that runs before application scripts.
- Captures script-load errors, window runtime errors and unhandled promise rejections.
- Adds boot stage markers through `app.js`.
- Adds explicit top-level catch for the async app bootstrap.
- Adds raw pointer/touch/click observation without preventing events.
- ASA coordinate probe detects taps over an ASA card and verifies whether the hidden ASA value/selected card changed.
- On failure, a device-visible diagnostic panel shows stage, error, event target, body classes, open dialogs, inert nodes and key globals.
- Diagnostic controls do not write clinical records or bypass permissions.

## Safety
No dose calculation, medication, alert threshold, Recovery, Final Sign-off, Final Lock, Archive or synchronization semantics were intentionally changed.
