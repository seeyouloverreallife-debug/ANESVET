# Known Limitations — V16.18.6

1. Real-device Production Pilot testing is still required. Static/controller tests do not prove Android/iPad/Windows browser lifecycle behavior during Backup → Restore → restart → Rollback.
2. Full Backup remains a user-triggered downloaded JSON file. V16.18.6 does not provide automatic external/off-device backup or cloud replication.
3. `data-resilience.js` remains a separate UX layer and consumes `window.AnesvetDataBridge`; later refactors must preserve this contract or migrate both sides together.
4. Backup integrity verification validates locked SHA-256 records. Legacy FNV1A final records remain classified as unverifiable by the SHA-256 backup-wide audit, matching prior behavior.
5. Restore is dataset replacement, not merge. The UI warns before Restore and attempts an automatic pre-restore rollback snapshot, but destructive-path testing must still be performed on a test device before production use.
6. Browser smoke is BLOCKED/PENDING in the current sandbox because system Chromium times out with environment D-Bus/service-process errors. It is not counted as PASS.
7. ANESVET remains local-first and is not yet a multi-device synchronized hospital system.
8. ANESVET is not a continuous physiologic monitor and does not replace source-monitor data or clinical judgment.
