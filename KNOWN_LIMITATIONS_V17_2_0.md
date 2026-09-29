# Known Limitations — ANESVET V17.2.0

1. There is still no production hospital canonical server in this package.
2. Concurrent multi-device clinical editing is not production-safe and must not be represented as such.
3. Identity remains device-local; there is no central hospital directory, device enrollment authority or remote revocation.
4. HTTP adapter authentication/authorization is a boundary only; production credentials are not defined by V17.2.0.
5. Conflict Review Center is review-only. It deliberately does not provide clinical merge/rebase/overwrite resolution.
6. An unresolved conflict holds later synchronization for the entire case until a future explicit resolution workflow is designed.
7. Remote pull is preview-only and is not applied to active clinical state.
8. The current app integration still captures verified case snapshots rather than full record-level mutation streams for every clinical collection.
9. Snapshot coalescing reduces offline queue growth but only for never-attempted case snapshots; other queued operations remain durable.
10. Sync metadata and queue evidence are not cryptographically signed or server-attested.
11. Device timestamps are not trusted server time.
12. Clinical localStorage/IndexedDB is not application-level encrypted at rest.
13. Real-device PWA/browser validation remains required.
14. Real two-device network interruption and concurrency tests remain pending until a canonical server implementation exists.
15. Local-first clinical data can still be lost if the browser/device profile is lost before verified off-device backup.
