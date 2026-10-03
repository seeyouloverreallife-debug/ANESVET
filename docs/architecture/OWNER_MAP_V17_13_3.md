# ANESVET Presentation Owner Map — V17.13.3

- Global workspace / Settings / mobile workflow navigation / legacy mobile Identity bridge → `workspace-owner.js`
- Patient + Pre-op → `patient-preop-simplification.js` (`patient-preop-v17130`)
- Drug Plan → `drug-start-simplification.js` (`drug-start-v17130`)
- OR LIVE layout → `or-workspace-restructure.js` (`or-workspace-v17130`)
- OR LIVE fast-entry / keyboard / Android-PWA interaction hardening → `or-speed-hardening.js` (retained; distinct behavior)
- Recovery → `recovery-end-refinement.js` (`recovery-end-v17130`)
- Repeat / final-review presentation + floating return-to-active-case shortcut → `repeat-presentation-owner.js`
- Storage/save/offline presentation feedback → `app-shell.js`
- End Case blocker rendering/action routing → `finalization.js`
- Pre-OR readiness structured “ไปแก้” routing → core readiness renderer in `app.js` using its existing `tab` / `target` descriptors

Legacy presentation modules must not reclaim these zones.
