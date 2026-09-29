# Known Limitations — ANESVET V16.21.0

1. **Local PIN is not server authentication.** The identity directory and PBKDF2 credential hashes live in the browser profile on one device.
2. **Numeric PINs have limited entropy.** PBKDF2 slows guessing, but a compromised browser/device profile can still be subject to offline brute-force attempts. Device OS passcode/encryption remains important.
3. **No encryption-at-rest for clinical IndexedDB.** The lock screen is an application access-control layer; it does not encrypt ANESVET clinical data stored by the browser.
4. **Migration starts unmanaged.** Existing installs remain unlocked until the first Administrator explicitly enables local security; this avoids upgrade lockout but means security is not automatic.
5. **Role model is intentionally coarse.** All active staff roles can document clinical data. Fine-grained RBAC is not implemented yet.
6. **Fresh PIN re-authentication is enforced only for selected high-accountability actions in this release.** Final Sign-off and Hospital Protocol Governance are covered. Some existing free-text attribution fields remain for clinical workflow compatibility.
7. **Credentials are intentionally excluded from Full Backup.** A restored clinical dataset does not recreate staff PIN credentials or the local security directory.
8. **No central revocation or multi-device identity sync.** Deactivating a user affects only the current browser/device registry.
9. **Background lock is not an inactivity timer while the app remains visible.** This avoids unexpected lockouts during long OR periods but is less strict than enterprise session management.
10. **Not a qualified electronic signature.** Authenticated Final Sign-off records a local PIN-verified identity, but does not provide server-issued identity, PKI signing, non-repudiation, or regulatory e-signature assurance.
11. **Browser/PWA interactive smoke remains pending.** Build-environment Chromium still times out with D-Bus/service-process errors; real-device acceptance remains required.
