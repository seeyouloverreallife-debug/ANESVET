# Migration — V17.2.1 → V17.2.2

No clinical database migration is required.

## Important
- Keep the installed app/site data.
- Do not uninstall the PWA.
- Do not use Clear storage / Clear site data.
- Deploy/replace the web files with V17.2.2.
- The rescue service worker is designed to escape an older waiting-update state.

## Expected active-case behavior
When an update is activated from V17.2.2, ANESVET first verifies the current local case and safety checkpoint. On reload, a case that has already entered anesthesia resumes directly to OR LIVE; an active Recovery case resumes to Recovery.

For the one-time upgrade from an already-stuck older shell, completely closing ANESVET and reopening it may be required so the browser performs the service-worker update check. Existing current-case storage must be left intact.
