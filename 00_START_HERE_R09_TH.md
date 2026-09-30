# ANESVET V17.2.13 — Checkpoint R09 (Patient Setup Integrity)

**Development base:** `ANESVET_V17_2_12_CHECKPOINT_R08_MODAL_NAVIGATION.zip` — source carried forward, not recreated. R01–R08 historical material remains included.

## Open / Test
- Web entrypoint: `index.html`; deploy the **entire web folder**, preserving all relative assets.
- Run `node RUN_R09_QA.js` from this folder (Node.js required).
- QA results: `QA_R09_RESULTS.json`; source comparison: `CHECKPOINT_R09_SOURCE_PARITY.json`.
- Device test plan: `DEVICE_R09_TEST_STEPS_TH.md`.

## Fixed — one narrow category only
1. **Procedure alias sync:** Changing the secondary `procedure` field already changed `patientProcedure`, but did not invalidate `state.patientSaved` / pre-OR override. Now it requires a fresh Patient & Case Setup Save (and refreshes the save indicator) before first OR LIVE entry.
2. **Patient Master unlink:** Unlinking before a case starts now invalidates `state.patientSaved` and any pre-OR readiness override; app refreshes the screen without introducing clinical writes.
3. **Active-case identity guard:** Cannot unlink Patient Master when a case has started or recorded anesthesia data. This avoids silent changes to active case identity linkage.
4. **Version/cache:** bump to V17.2.13 and new Service Worker cache; no data-clearing migrations.

## Evidence and limits
- Baseline R08: the new R09 regression exposed 4 failing behaviors (Procedure dirty, pre-case unlink dirty, started-case unlink, recorded-case unlink).
- Fixed R09: 9/9 new targeted checks; total 14/14 suites; 89/89 JavaScript syntax checks; no duplicate HTML IDs or missing cached assets.
- `QA_R09_PATIENT_SETUP_DIRTY.js` exercises actual source event handlers and the shipped pre-OR readiness validator in a simulated DOM. Other suites cover ASA, dialog and navigation, active-case recovery and sync safety.
- Headless Chromium command was attempted but timed out without DOM; **no browser E2E pass** and **no Android/iPad real-device pass** are claimed. This is a staged QA checkpoint, not a clinical production sign-off.
- No medication-dose math, patient-data schema, storage keys, OR LIVE or Recovery code was modified.

## Important deployment protection
Test on a separate origin / device with synthetic patient data first. On the clinical device, export a verified off-device backup **before any update**. Do **not** clear browser site data, uninstall the PWA or delete current cases as a troubleshooting step. Validate Device R09 checklist before a production rollout.

## Next: R10
With device Diagnostic export, determine whether any remaining unresponsive buttons are caused by `click` not reaching the target, VIEW ONLY/session guard, or incomplete boot. Keep fixes scoped, with another checkpoint.
