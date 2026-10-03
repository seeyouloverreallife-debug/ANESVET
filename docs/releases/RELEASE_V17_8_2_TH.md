# ANESVET V17.8.2 — Calculated-as-Given Medication Flow

## OR LIVE behavior
For medications with a complete frozen calculation:
- The calculated mL is displayed as `AMOUNT TO RECORD`.
- That calculated amount is the actual amount ANESVET will record when `Confirm given` is pressed.
- The Actual editor is hidden by default.
- To document a different amount, tick `ปริมาณที่ให้จริงต่างจากค่าคำนวณ`.
- ANESVET then opens Actual administered, prefilled with the calculated amount for quick editing.
- If changed, the administration note records the calculated amount that was overridden.

## Safety
- Opening a drug still does not create an administration record.
- Final `Confirm given` remains required.
- Route, concentration/preparation and administered-by remain required.
- Patient/BW/frozen-protocol mismatch remains a SAFETY STOP.
- Drugs without a complete calculated default remain in manual-entry mode.
