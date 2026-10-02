# ANESVET V17.11.0 — OR LIVE RESTRUCTURE

## Goal
Rebuild OR LIVE around the real anesthesia workflow: immediate actions first, running controls second, deferred charting later.

## New OR LIVE workspaces
1. **Monitor** — default workspace
   - Vital signs + Save Vitals
   - Anesthetic depth
   - Vaporizer tactile control
   - O₂ flow tactile control
   - Optional SAP / DAP details
2. **Support**
   - Fluid / blood loss
   - Ventilation mode
   - PIP / ventilator RR / PEEP / VT
3. **Airway**
   - ET tube size / depth
   - Cuff
   - Intubation difficulty
   - Circuit
4. **Meds**
   - Quick medications
   - Frozen-plan medication queue
   - Documentation Guardian

## Workflow correction
- **Intubation is now timestamp-only.**
- Pressing Intubation records the milestone and immediately returns control to OR LIVE.
- It does **not** open an ET-tube, fluid, PIP, RR, or medication form.
- ET-tube details are entered later from Airway.
- Ventilator and fluids are entered later from Support.
- Actual induction medication documentation remains in Meds.
- Intubation remains undoable through the existing audited workflow undo system.

## Preserved
End Surgery confirmation, Emergency Return, Recovery workflow, medication Calculated-as-Given, alerts/safety, audit trail, data safety, Final Lock and archive verification.
