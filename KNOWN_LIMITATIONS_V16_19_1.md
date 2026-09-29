# Known Limitations — ANESVET V16.19.1

1. Validation PASS is user-observed evidence on one device/build. It is not regulatory certification and does not prove clinical correctness.
2. The 20-consecutive-PASS target is an evidence target, not an automatic production authorization rule.
3. Force-close, long-background, orientation/keyboard, and long-case behavior still require actual-device execution; they cannot be truthfully completed by static QA.
4. Browser/PWA interactive smoke remains blocked in the build sandbox because system Chromium times out with D-Bus/service-process errors.
5. Validation history is local metadata. Clearing the browser profile removes it unless the report was exported.
6. Device signature is intentionally simple and privacy-preserving; it is not a cryptographic device identity.
7. Local-first clinical data can still be lost if the device/profile is lost before an external backup is made.
8. Off-device backup status remains user-confirmed; V16.19.1 does not remotely inspect Drive/NAS/USB contents.
9. No authenticated staff identity/role system exists yet; validation actions are not cryptographically tied to a staff member.
10. No multi-device case synchronization is introduced in this release.
