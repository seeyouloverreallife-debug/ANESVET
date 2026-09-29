# Known Limitations — ANESVET V16.18.1

1. **Real-device browser/PWA regression is still required.** Chromium headless did not complete in the execution environment, so Patient Master and Pre-op UI interaction must be verified on actual target devices.
2. **`app.js` remains large (~5,064 lines).** OR LIVE, medication workspace, Recovery, finalization/archive UI and backup/restore composition are still pending extraction.
3. **Patient Master controller still depends on app-injected helpers.** This is intentional for incremental migration; age/breed UI and storage initialization remain in `app.js`.
4. **Pre-op controller still delegates workflow lock, audit, save and OR rendering to app composition.** It does not own those clinical decisions.
5. **Single-device/local-first limitations remain.** Final archive verification protects record integrity inside the current installation but is not an external backup or multi-device sync system.
6. **No authenticated multi-user identity/role system yet.** Existing actor/signoff fields remain record attribution rather than centrally authenticated identities.
7. **Patient monitor values are still entered manually.** No hardware monitor bridge is included.
