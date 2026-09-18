# ANESVET V13.1 — Validation & Safety

## Hospital Quick Presets
กล่องยาด้านบนของ Drug Calculator ไม่ hard-code แล้ว
โรงพยาบาลเลือกยาได้เอง 2 รายการต่อ phase:
- Induction
- Pre-anesthetic
- Post-anesthetic

เลือกได้จาก:
- Built-in calculators ที่มีอยู่
- Hospital Drug Library

ถ้าต้องการยาอื่น ให้เพิ่มยา + formula + concentration ใน Hospital Drug Library ก่อน แล้วเลือกเป็น Quick Preset

## Actual Drug Administration
ปุ่มยาใน Drug Calculator จะเปิดหน้าต่างยืนยัน:
- calculated dose/volume
- actual administered volume
- route
- note

Event log จะบันทึก actual volume แยกจาก calculated value

## Case Phase
แสดงสถานะ:
SETUP → INDUCTION → INTRAOPERATIVE → RECOVERY → COMPLETE → LOCKED

Milestones:
- Induction → INDUCTION
- Surgery start → INTRAOPERATIVE
- Surgery end / Begin recovery → RECOVERY
- Recovery complete → COMPLETE

## Recovery Readiness
Recovery page แสดง readiness จาก:
- recovery checklist
- RR
- SpO2
- temperature
- mentation
- extubation time

## End Case Lock
End Case:
- หยุด timer
- phase = COMPLETE
- mark caseLocked = true
- timestamp lockedAt
- archive เป็น final record
- reset ไปเคสใหม่

## Backup
ปุ่ม Backup แสดงใน End Case และ backup รวม:
- current case
- archived cases
- hospital settings
- drug library
- quick presets

## Update
https://seeyouloverreallife-debug.github.io/ANESVET/?v=13.1
