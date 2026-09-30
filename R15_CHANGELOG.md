# R15 Changelog — V17.2.19
- Correct Current Case mirror source: verified localStorage payload, not mutable state object.
- Prevent queued mirror from persisting a revision no longer matching the primary saved value.
- Fail closed on unreadable primary at boot even without checkpoint/legacy recovery.
- Disallow automatic IndexedDB mirror restore over corrupt/unreadable primary.
- Read-back verify mirror restores and explicitly update freshness baseline.
- Read-back verify current-case persistence through the Archive working-copy bridge.
- Upgrade PWA version/asset cache; retain pre-existing clinical controllers.
- Automated QA: focused 16 cases and 20 regression suites. Browser/device E2E unverified.
