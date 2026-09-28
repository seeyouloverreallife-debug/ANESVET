# ANESVET V16.3 — Progressive Clinical Flow

## Goal
Continue the Clinical Calm / Focused Workspace direction by reducing form density and making the primary action on each mobile screen reflect the current clinical task rather than generic navigation.

## UX principles
1. **Task before navigation** — the mobile action button says what should be done now (`บันทึก & ต่อ`, `รายการถัดไป`, `สร้างแผน`, `Review plan`, `OR LIVE`) instead of only `ต่อไป`.
2. **Essentials before optional detail** — Patient setup keeps the clinical core visible and places secondary identity fields behind one explicit disclosure on phones.
3. **Context collapses after selection** — once a Patient Master is linked, search chrome becomes compact; history remains available and search can be reopened deliberately.
4. **Safety text must wrap, never disappear** — medication preparation warnings remain fully readable inside the viewport.
5. **Completed steps become quieter, not hidden** — completion changes visual emphasis only; users can still edit the underlying data.
6. **No clinical rule changes** — dose, thresholds, readiness rules, safety gates, medication reconciliation and finalization semantics are unchanged.

## Patient setup
Phone default view keeps primary case information visible. Secondary identity fields grouped behind `รายละเอียดเพิ่มเติม`:
- Visit / Case ID
- Reproductive status
- Microchip
- BCS

Name, HN, species, sex, breed/age, Current BW, emergency status, procedure, workflow profile, allergies/comorbidities/precautions and case team remain in the normal workflow.

When a Patient Master is linked, the search area becomes a compact linked-patient card. `ค้นหา / เปลี่ยน` expands the search UI again.

## Mobile task button
- Patient not saved → `✓ บันทึก & ต่อ`
- Patient saved → `→ Pre-check`
- Pre-check incomplete → `↓ รายการถัดไป`
- Pre-check complete → `→ Medications`
- Drug plan empty → `↻ สร้างแผน`
- Drug plan awaiting review → `✓ Review plan`
- Drug plan ready → `→ OR LIVE`
- End Case → `→ รายการถัดไป`, or `✓ Lock & Archive` only when the existing finalization guide says finalize is the next action

The button invokes existing actions and safety gates; it does not bypass them.

## Medication page
Hospital Quick Presets now has an explicit collapse control. Long preparation / migration warnings wrap inside the drug card instead of widening the page.

## Responsive intent
- Phone: essentials-first forms + task-aware fixed action.
- Tablet: full fields remain available; no horizontal overflow.
- Desktop: full data density retained, with Clinical Calm hierarchy.
