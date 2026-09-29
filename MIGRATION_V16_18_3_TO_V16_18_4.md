# Migration — V16.18.3 → V16.18.4

No clinical-data migration is required.

- IndexedDB `DB_VERSION` remains `2`.
- Existing current case, archive, protocol snapshot, Case Drug Plan, medication administrations, reconciliation decisions, and Final Lock data remain compatible.
- The change is a JavaScript ownership refactor: active medication workspace behavior moves from `app.js` to `medication-workspace-controller.js`.
- Service Worker cache key is bumped so installed PWAs receive the new controller asset.

After updating an installed PWA, run the Production Pilot checks and test one medication workflow before clinical use.
