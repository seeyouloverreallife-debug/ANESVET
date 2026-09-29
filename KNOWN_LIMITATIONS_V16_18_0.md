# Known Limitations — ANESVET V16.18.0

## 1. Architecture hardening is incremental
`app.js` remains the main composition layer and still contains several large DOM-heavy controllers. V16.18 isolates shell/session/PWA/dose-reference/lifecycle concerns but does not claim to complete the controller split.

## 2. Browser/PWA headless smoke remains blocked in this build environment
Chromium launches but does not complete the smoke command before timeout. Real-device Production Pilot acceptance remains required before production use.

## 3. Session coordination is same-browser/device only
The session controller improves ownership separation but does not add cross-device synchronization, user authentication or a server-side lock.

## 4. External backup is still manual/local-first
Final Archive Assurance verifies local record integrity. It does not protect against device loss, browser storage clearing or hardware failure unless a Full Backup has been exported externally.

## 5. Runtime architecture registry checks presence, not full behavior
A passing architecture registry means required modules are loaded. It does not replace workflow regression, real-device testing or clinical validation.

## 6. Dose-reference controller is presentation only
Moving reference UI to a controller does not validate the clinical correctness of reference content. Hospital protocol/source verification remains required.
