# Known Limitations — ANESVET V16.19.0

1. **Local-first remains local-first.** IndexedDB/localStorage data can still be lost if the device is lost, storage is cleared, the browser profile is removed, or the device fails before an external backup is made.
2. **Off-device status is user-confirmed.** ANESVET does not upload, browse, or verify Google Drive, OneDrive, USB, NAS, or hospital server contents in V16.19.0.
3. **Whole-file SHA-256 detects corruption, not authorship.** The integrity manifest is not a cryptographic signature or user-authenticated attestation.
4. **Legacy schema-2 backups have partial verification only.** They do not contain a whole-file integrity manifest.
5. **Backup history is local metadata.** Clearing the browser profile can remove backup receipts/history even when the external backup file still exists.
6. **Restore verification is strongest for schema 3.** Legacy backups use structural verification because there is no stored clinical dataset digest.
7. **Real-device browser/PWA smoke remains pending.** System Chromium in the build environment times out with D-Bus/service-process errors and cannot be treated as a successful interactive smoke test.
8. **No cloud sync or multi-device merge.** Data Safety 2.0 prepares the local data layer for future off-device workflows but does not implement synchronization between concurrent ANESVET devices.
9. **No user authentication/roles.** Backup/off-device receipts are not tied to an authenticated staff identity in V16.19.0.
