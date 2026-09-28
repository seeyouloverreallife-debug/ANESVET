# Known limitations — V16.7.0

- ANESVET remains local-first. V16.7 does not add a hospital server or cloud synchronization.
- Persistent Storage API behavior is decided by the browser/OS. A granted persistent-storage status reduces routine eviction risk but cannot guarantee recovery from device loss, browser data clearing, filesystem failure, or OS reset.
- `navigator.storage.estimate()` is an estimate. Quota percentages should be treated as health indicators, not exact disk-space measurements.
- Pre-restore rollback requires a working IndexedDB backend. In localStorage fallback mode ANESVET reports rollback as unavailable.
- Only the latest pre-restore rollback snapshot is retained.
- Restore from a newer ANESVET version is warned, not automatically migrated beyond the compatibility logic already present in the application.
- Legacy locked records without SHA-256 checksums can be retained but may be reported as unverifiable.
- Installed-PWA/service-worker behavior still requires acceptance testing on the actual Android, iPad, and Windows devices used by the hospital.
