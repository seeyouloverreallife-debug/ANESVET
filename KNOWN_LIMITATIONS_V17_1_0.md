# Known Limitations — ANESVET V17.1.0

1. V17.1.0 has no real hospital canonical server. The included adapter is local/mock only.
2. Concurrent multi-device clinical editing is not production-safe and must not be represented as such.
3. Identity remains device-local; there is no central hospital directory or remote account revocation.
4. Sync queue data is application-local and not cryptographically signed or server-attested.
5. Sync mutation timestamps are device timestamps and are not trusted server time.
6. Conflict evidence is detected and preserved, but a complete clinician conflict-resolution workflow is not yet implemented.
7. The current app integration captures case snapshots after verified saves; finer record-level mutation capture will be expanded before a real backend rollout.
8. Experimental queue payloads can consume local browser storage during prolonged offline simulation; the feature is disabled by default.
9. LocalStorage/IndexedDB clinical data is not application-level encrypted at rest.
10. Deactivating a staff identity on one device does not revoke separately enrolled identities on another device.
11. Auto-lock remains background-duration based; a separate foreground inactivity timeout is not added here.
12. Browser/PWA real-device validation remains required.
13. A real two-device network interruption/conflict test cannot be considered complete until a canonical backend exists.
14. Local-first data can still be lost if the device/browser profile is lost before a verified off-device backup is created.
