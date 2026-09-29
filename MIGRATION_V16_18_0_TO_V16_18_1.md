# Migration — V16.18.0 → V16.18.1

## User data
No user-data migration is required.

- IndexedDB database name unchanged
- `DB_VERSION = 2` unchanged
- current case key unchanged
- archive model unchanged
- Patient Master records unchanged
- hospital settings/template keys unchanged
- Production Pilot progress keys unchanged

## Runtime change
The page now loads two additional runtime files before `app.js`:
- `patient-master-controller.js`
- `preop-controller.js`

The Service Worker cache version is bumped to `anesvet-v16-18-1-controller-extraction` so the extracted controllers are available offline after the new Service Worker has installed.

## Update caution
As in V16.18.0, do not force a PWA reload during a mutable active case. Use the existing deferred update behavior and verify the update after the case is safely finalized or reset.
