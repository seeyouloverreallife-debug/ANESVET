# ANESVET V15.12.0 — Clinical Safety & Reliability

Base: V15.11.0 Mobile UI Simplification

## Goal
V15.12 is a hardening release. It deliberately avoids adding new anesthesia features and focuses on reliability, clinical-calculation sanity checks, runtime diagnostics, browser/device QA, and a simpler support-report workflow.

## 1) Reliability self-check
Settings now includes **Clinical Safety & Reliability** with a one-tap self-check for:
- critical UI elements
- local clinical storage write/read
- IndexedDB availability
- PWA/service-worker support
- clinical workflow helper integrity
- current-case serialization
- Pre-OR briefing engine execution
- ETT preparation-reference sanity samples
- medication unit/concentration calculation sanity samples

The self-check does **not** replace clinical verification or real-device testing.

## 2) Runtime diagnostic log
- Captures recent uncaught JavaScript errors and unhandled promise rejections locally on the device.
- Does not automatically attach patient identifiers.
- Settings can export a diagnostic JSON for troubleshooting.
- The local runtime-error log can be cleared by the user.

## 3) Browser/device QA
Automated Chromium smoke checks were run against viewport/touch profiles approximating:
- phone: 390×844, touch
- iPad: 1024×768, touch
- desktop: 1440×900

The browser harness verified app startup, Settings, reliability self-check rendering, support/report UI, and no page-level JavaScript errors.

A golden clinical workflow browser smoke test passed:
**Patient setup → Pre-anesthetic physical exam → Risk review → 15/15 Pre-op checklist → Pre-OR briefing → OR LIVE → confirmed Start Induction**.

Native iOS/iPadOS Safari and Android Chrome hardware testing is still required during Hospital Pilot.

## 4) Support / Report redesigned
The old Google Apps Script feedback/webhook workflow is removed from the active user-facing path.

Report options are now:
- **Email:** `anesvetth@gmail.com`
- **Facebook:** Page name `Anesvet` (the app opens a Facebook page search for “Anesvet” because no exact page URL/handle is embedded)

The in-app form creates a structured report containing app version, device/browser, workflow phase and anonymized record counts. It does not automatically include patient name, HN, microchip or owner information.

### Email behavior
- Opens the device's default mail app using `mailto:`.
- Pre-fills recipient, subject and structured report text.
- The user reviews and presses Send.
- Screenshots can be attached manually in the mail app.

### Facebook behavior
- Copies the structured report text when possible.
- Opens Facebook search for Page `Anesvet`.
- The user pastes the report into Messenger/Page contact and may attach screenshots there.

No automatic background bug-report upload is performed in V15.12.

## 5) Conservative modularization
Two pure helper modules were separated from the main application:
- `support.js` — report composition / email / Facebook support target
- `reliability.js` — environment reliability checks

Clinical workflow behavior remains in the existing app and was not rewritten.

## 6) Clinical safety behavior unchanged
This release does **not** change:
- drug doses or concentrations
- alert thresholds
- ASA logic
- BOAS/risk-flag logic
- Pre-OR briefing clinical reference values
- fluid references
- OR phase transitions / Confirm / Undo
- recovery safety gates
- Final Lock / archive behavior

## Known limitations
- Automated test environment cannot reproduce native Safari/iPadOS behavior exactly.
- Service-worker status in the inline QA harness is intentionally not treated as a browser failure; production deployment should be HTTPS/PWA and verified on actual devices.
- Email delivery depends on a configured mail app/account on the device.
- Facebook page link currently uses a Page search for “Anesvet”; an exact Page URL can be embedded later when supplied.
