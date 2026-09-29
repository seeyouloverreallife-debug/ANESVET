# Known Limitations — ANESVET V17.0.0

1. **Identity is local-device identity, not server authentication.** There is no central identity provider, SSO, hospital directory, or remote account revocation.
2. **V17.0 is multi-user foundation, not multi-device sync.** Two devices cannot safely edit the same case concurrently and there is no central canonical case record yet.
3. **PINs are numeric 6–12 digits.** PBKDF2 protects stored credentials, but device OS passcode, disk/device encryption, and physical access control remain important.
4. **Clinical IndexedDB/localStorage is not application-level encrypted at rest.** A party with sufficient access to the browser profile/device may be able to inspect local data.
5. **Credential material is intentionally excluded from Full Backup.** Restoring clinical data onto a new device does not restore staff PINs/security enrollment.
6. **Staff directory changes do not propagate to other devices.** Deactivating a staff profile on one device does not revoke a separately enrolled profile elsewhere.
7. **Staff/session/device IDs improve attribution but are not cryptographic non-repudiation.** V17.0 does not use digital certificates, PKI signatures, or server-attested timestamps.
8. **High-risk re-auth can authorize an action by a permitted staff member other than the currently active session identity.** The action receives that re-authenticated actor; the app session itself remains with the current user.
9. **Auto-lock is background-based.** V17.0 does not yet implement a separate visible-screen inactivity timeout while the app remains foregrounded.
10. **Legacy records are not rewritten.** Existing historical records without actor/session/device metadata do not gain retrospective attribution.
11. **Role permissions are application controls, not professional-credential verification.** ANESVET does not validate licensure, training, or local scope-of-practice rules.
12. **Real-device PWA validation is still required.** Build-environment Chromium remains blocked/pending and is not counted as PASS.
13. **Local-first data-loss risks remain.** If the device/browser profile is lost before a verified off-device backup is created, local records can still be lost.
