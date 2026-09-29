# Migration — ANESVET V16.18.1 → V16.18.2

## Data migration
None required.

- IndexedDB `DB_VERSION` remains **2**.
- Current-case key and archive stores are unchanged.
- Recovery record / score / transfer payloads are unchanged.
- Existing V16.18.1 cases open directly in V16.18.2.

## Runtime change
Recovery controller/render/event ownership moved from `app.js` to `recovery-controller.js`.

The new file must be deployed with `index.html` and is included in the V16.18.2 Service Worker precache list. If using the PWA, allow the new Service Worker version to install before verifying the release.

## Recommended post-update check
1. Open an existing test case.
2. Begin Recovery.
3. Record at least two Recovery vital sets.
4. Add a Recovery score.
5. Review post-anesthetic medication reconciliation.
6. Capture transfer handoff.
7. Complete Recovery.
8. Final Lock → archive VERIFIED.
