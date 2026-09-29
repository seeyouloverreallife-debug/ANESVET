# ANESVET V17.2.2 — Mobile Active-case Rescue Hotfix

## Purpose
Fix the mobile/PWA update deadlock reported while an anesthesia case is already active: an older app version can detect a waiting update but deliberately disable **Update now** because the current case is mutable. If that older version also has a navigation/interaction failure, the user can become trapped on the old shell and cannot reach OR LIVE or install the hotfix.

## Source findings
1. `pwa-controller.js` in V17.2.1 disables the update button whenever `versionReloadUnsafe()` is true. This is safe against an uncontrolled reload but creates an update deadlock when the currently running version itself is unusable.
2. Startup routing selects OR LIVE for a progressed case, but then calls ordinary `setTab()`; that can re-enter pre-OR access gates that are intended for first entry rather than restore/resume.
3. The multi-tab session lock has a TTL, but a tab that entered VIEW ONLY did not automatically reclaim control when the prior owner disappeared and its lock later expired.

## Fixes
- Active cases can now use **Save case & update**.
- Before activating an update, ANESVET verifies the current local save, writes the safety checkpoint, mirrors the current case to IndexedDB when available, and records the intended clinical resume tab.
- A failed local/checkpoint verification blocks update activation.
- Controlled version update suppresses the normal timer-running unload warning only after the safety preparation succeeds.
- On startup, a progressed anesthesia case resumes directly into OR LIVE with restore-safe navigation; Recovery resumes directly into Recovery when already started.
- VIEW ONLY caused by an abandoned/stale tab lock now self-recovers after that lock expires; no case reset is required.
- Service-worker registration requests an uncached update check.
- This rescue release's service worker calls `skipWaiting()` after its application cache is successfully installed and claims clients on activation. This is intentionally used to break the waiting-state deadlock from V17.1/V17.2.1.
- Existing V17.2.1 modal/inert interaction recovery is retained.

## Data safety / compatibility
- No current case is intentionally reset by update.
- Do **not** clear app/site data and do **not** uninstall the PWA as part of this migration.
- `DB_VERSION = 2` retained.
- Full Backup `backupSchema = 3` retained.
- Identity schema 2 and PIN PBKDF2 parameters retained.
- Sync remains experimental/off by default.
- Selected critical clinical/runtime modules: 18/18 byte-identical to V17.2.1.

## Validation
- JavaScript syntax: 58/58 PASS
- Static rescue QA: 31/31 PASS
- Mobile rescue targeted regression: 3/3 PASS
- V17.1 Sync Foundation regression: 17/17 PASS
- V17.2 Sync Safety regression: 19/19 PASS
- Critical selected clinical/runtime parity: 18/18 byte-identical vs V17.2.1
- HTTP package smoke: 200 PASS
- Headless Chromium interactive smoke: BLOCKED / PENDING_REAL_DEVICE due build-environment D-Bus/zygote timeout; this is not recorded as PASS.

## Required real-device verification
Test on the same Android/PWA device that reproduced the issue: deploy V17.2.2, leave the existing current case intact, completely close/reopen ANESVET if needed, confirm the version label reads V17.2.2, and verify that the active case returns to OR LIVE with its existing timer/records/events/medication documentation intact.
