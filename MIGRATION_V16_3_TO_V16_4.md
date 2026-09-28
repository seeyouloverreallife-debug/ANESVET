# Migration — ANESVET V16.3 → V16.4

## Data migration
No data migration is required.

V16.4 keeps the same:
- current-case storage keys;
- archive format;
- IndexedDB database/version;
- frozen protocol records;
- medication administration records;
- alert/problem records;
- Final Lock / checksum behavior.

## Upgrade procedure
1. Replace/deploy the V16.4 package over V16.3 using the normal ANESVET update path.
2. Reload/reopen the PWA after the update-ready prompt.
3. Existing current case and archive data should remain available.
4. Verify one representative case on the actual Android/iPad/browser environment before clinical rollout.

## What changes visually
- Desktop and large tablet layouts use more horizontal space and may present supporting information in a right-side rail.
- Phone layout keeps the V16.3 Progressive Clinical Flow.
- Clinical fields/actions retain the same IDs and existing event handlers.
