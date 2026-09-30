# Migration — V17.2.2 to V17.2.3

No database migration is required.

- `DB_VERSION` remains 2.
- Full Backup schema remains 3.
- Existing current case, patient, archive, Identity/Roles, protocol, medication, Recovery, Final Lock and sync queue data are retained.
- Do **not** clear app/site data to install this hotfix.

On first load, V17.2.3 performs a narrowly-scoped runtime consistency check. If an already-started case is persisted with `casePhase = setup`, it repairs the navigation phase to `intraop`. It does not mark Patient Setup saved and does not fabricate clinical events.

If the frozen case-start identity snapshot contains a value that is now missing from the mutable current case (for example Current BW), the missing field may be restored from that frozen snapshot only. Existing non-empty current values are never overwritten by this repair.
