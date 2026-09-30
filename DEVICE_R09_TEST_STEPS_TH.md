# R09 — Manual test procedure (Android/iPad / test device only)

1. On a **test origin** with dummy data, launch V17.2.13. Confirm version is visible and Diagnostics report no failed boot.
2. Create a dummy dog or cat. Fill Patient identity, Current BW, procedure and ASA; Save Patient & Case Setup. Check `SAVED`; you should land on Pre-op.
3. Complete the required Pre-op physical examination, risk assessment and required checklist (use dummy values only). Navigate to Medications; confirm the drug plan responds to the **saved** BW without reload (do not administer or record real drugs).
4. Navigate back to the second `procedure` input if present. Edit that field **without saving**. Verify `patientProcedure` mirrors the edit, Patient status displays `NOT SAVED`, and OR LIVE access for an unstarted case is blocked by the readiness dialog. The missing item should include `Save Patient & Case Setup`.
5. Save Patient & Case Setup again, verify status turns `SAVED`, then return Pre-op → Medications and check that navigation remains responsive and no drug administration was added.
6. On a different dummy *unstarted* case, link a Patient Master, save, then choose Unlink. Confirm Patient status becomes `NOT SAVED` and OR access requires a new Save. Existing real Patient Master records must not be used for this test.
7. On a separate dummy case with the case timer started OR one anesthesia record present, try Unlink. The action must be refused and the existing Patient Master ID must remain attached. Do not start a real patient's case for this test.
8. Verify OR LIVE and Recovery Safety Gates still enforce their original readiness/phase restrictions. Switching Patient → Pre-op → Medications should not leave an invisible modal blocking taps.
9. On error, tap 🔎 Diagnostics and preserve screenshot / text together with Android/iPad model, browser, timestamp and sequence of taps. Do NOT clear Site Data.

**Pass criteria:** Unsaved changes cannot pass an unstarted-case OR readiness gate, identity link cannot be silently removed after case activity, documented data persists, and normal navigation remains responsive. Automated success is not a substitute for hands-on QA before clinical use.
