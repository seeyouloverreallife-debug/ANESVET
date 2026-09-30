# ANESVET V17.2.28 — R24 Recovery → End Case usability correction

Source: exact V17.2.27 R23 Silent Bug Center FULL SOURCE. Not a rebuild.

## Root cause found in source
- On `recoveryCompletedAt`, `recoveryMobileRecordBtn` was disabled instead of navigating forward.
- `recoveryNextTaskBtn` was disabled when complete.
- Main Recovery → End Case route was not in the focused workspace or mobile dock when needed.
- End Case had a long scroll before the original Final Lock call-to-action; the existing finalization guide required interpreting many controls.

## Changes
1. Prominent single Recovery → End Case button at top. Available for review even before Recovery complete; no automatic sign-off, completion or finalization.
2. After successful Recovery completion, mobile primary dock shows `→ End Case` (enabled), and desktop next-task / readiness button also opens End Case.
3. End Case top CTA shows the next outstanding requirement, or the native Final Lock action when ready. It delegates to the original safety-gated `endCaseNextTaskBtn`; no validation bypass.
4. Collapse the 12-value End Case record summary by default, and hide inactive archive verification until Final Lock; all underlying fields and archive verification actions remain present and available when relevant.
5. Responsive flow remains above the long Recovery form on phone/tablet, with clearer hierarchy and no additional floating toast/dialog.
6. PWA asset revision and cache updated. Original localStorage keys and archived record formats preserved.

## Safety and limitations
- Clinical alerts, medication reconciliation, sign-offs, completion override / audit trail, immutable Final Lock, and final archive verification are intentionally unchanged.
- End Case screen may be reviewed before Recovery complete, but locking still requires completed Recovery and every other original safety check.
- Browser smoke and static tests are in R24_QA_RESULTS.json. Verify with real tablet/phone and simulated patient before clinical deployment.

## GitHub Pages update
1. Export Backup all data before updating. Do not clear site data, caches via browser settings, or uninstall the PWA.
2. Extract ANESVET_V17_2_28_R24_RECOVERY_ENDCASE_DEPLOY_9_FILES.zip to the repository root, replacing files with the same name.
3. Allow service worker to update, then reload/reopen ANESVET. Confirm version 17.2.28.
4. Test the complete Recovery → End Case → Final Lock flow on a non-clinical test case first.
