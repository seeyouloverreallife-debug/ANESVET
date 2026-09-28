# Migration — V16.4 → V16.5

No database reset or case migration is required.

1. Replace V16.4 application files with V16.5 files.
2. Reload once so the new service-worker cache (`anesvet-v16-5-0-usability-hardening`) can become active.
3. Keep the existing browser storage / IndexedDB. Do not clear application data.
4. On the deployment device, verify:
   - active-case reopen
   - OR / Recovery return shortcut
   - offline local save indicator
   - Pre-OR direct-fix links
   - End Case blocker navigation

V16.5 does not change clinical thresholds, dose references, readiness requirements, Recovery completion requirements, medication reconciliation criteria, or Final Lock criteria.
