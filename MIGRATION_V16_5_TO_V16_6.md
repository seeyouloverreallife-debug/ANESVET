# MIGRATION V16.5 → V16.6

- Storage keys and IndexedDB schema are unchanged.
- No database wipe or re-import is required.
- Existing current cases, Patient Master records, archives, settings, Drug Library and protocol audit remain compatible.
- V16.6 changes only release-candidate diagnostics/version-reload safety behavior plus version metadata.
- A mutable active case still defers app update. A properly sealed Final Locked case (`caseLocked + finalChecksum + lockedAt`) no longer requires Reset solely to install a new version.
- Backup before upgrading is still recommended.
