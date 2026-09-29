# Migration — ANESVET V16.18.2 → V16.18.3

## Data migration
None required.

- IndexedDB `DB_VERSION` remains **2**.
- current-case key and archive stores are unchanged.
- OR vital records, corrections, events, complications, medication records, Recovery records and final archive format are unchanged.
- Existing V16.18.2 cases open directly in V16.18.3.

## Runtime change
OR LIVE controller/render/event ownership moved from `app.js` to `or-live-controller.js`.

The new file must be deployed together with `index.html` and is included in the V16.18.3 Service Worker precache list. When updating an installed PWA, allow the new Service Worker version to install before validating the release.

## Recommended post-update check
1. Open an existing test case.
2. Start induction.
3. Save airway/intubation.
4. Start surgery.
5. Save at least two OR vital sets.
6. Open Medication from OR LIVE and save one administration.
7. Record an OR event/problem and review alert presentation.
8. End surgery → extubation / begin Recovery.
9. Complete Recovery.
10. Final Lock → archive VERIFIED → New case.
