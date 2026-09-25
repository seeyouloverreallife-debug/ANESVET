# ANESVET V15.18.0 — End Case & Report Flow

## Goal
Complete the one-hand / next-task workflow through the final stage of a case without changing clinical calculations, safety thresholds, medication logic, or the archive format.

## End Case finalization guide
- Added a compact **Finalization Guide** at the top of End Case.
- Shows the remaining blockers at a glance: Recovery completion, unresolved alerts, active complications, missing anesthetist/surgeon sign-off, and final checklist items.
- Added **Next required item** guidance that jumps directly to the next unfinished task.
- Added **Focus pending** so completed sign-offs/checklist rows can be hidden temporarily on long mobile screens.
- When every required item is complete, the primary action becomes `End, Lock & Archive Case`.

## Report flow
- Added a dedicated **Report & final archive** section.
- The primary export button follows the report preference from Settings: 1-page Summary or Full PDF.
- Hospital branding/patient/report identity is shown before final archive.
- Exporting a report marks the report-review checkbox for the current unlocked case; it does not bypass any other finalization requirement.
- Summary PDF, Full PDF, and Backup remain available as separate actions.

## After Final Lock
- The app no longer immediately clears the current case after a successful Lock + Archive.
- A confirmation dialog now offers:
  - Export preferred report
  - Export Full PDF
  - Open Cases / Archive
  - Stay on the locked record for review
  - Start a new case
- The original clinical record remains locked; the change only prevents the previous automatic reset from removing the report/export opportunity immediately after finalization.

## Safety / compatibility
- Recovery completion remains required before Final Lock.
- Unresolved alert episodes and active complications still block Final Lock.
- Final anesthetist + surgeon sign-off remains required.
- Existing final checklist remains required.
- Existing SHA-256 final checksum and archive workflow remain unchanged.
- `clinical-workflow.js`, `support.js`, and `reliability.js` are unchanged from V15.17.0.
- `app.js` changes are limited to `APP_VERSION` and the post-archive handoff to the new finalization dialog; the existing Final Lock validation path is unchanged.
- No dose, concentration, ETT, ventilation, fluid, alert threshold, or storage-schema changes.
