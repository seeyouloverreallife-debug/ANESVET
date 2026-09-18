# ANESVET V13.2 — Recovery Workflow

## แก้ Navigation
- เปลี่ยน page/step แล้ว scroll กลับด้านบนอัตโนมัติ

## OR → Recovery
- Surgery end → EMERGENCE
- Extubation → auto-fill extubation time + เข้า Recovery อัตโนมัติ
- หลังเข้า Recovery แล้ว OR LIVE ถูกล็อก ไม่ย้อนกลับไป INTRAOPERATIVE ตามปกติ
- Fresh case เริ่มที่ SETUP

## Emergency return
หน้า Recovery มีปุ่ม:
⚠ Emergency return to OR LIVE

ใช้กรณี post-extubation apnea / airway problem / re-intubation / resuscitation
ระบบใช้ phase EMERGENCY RETURN ไม่เปลี่ยนกลับเป็น INTRAOPERATIVE
ใน OR LIVE ปุ่ม Recovery จะใช้กลับเข้าสู่ Recovery อีกครั้ง

## Recovery serial monitoring
บันทึกเป็นช่วงเวลา:
- HR
- RR
- MAP (optional)
- SpO2
- Temperature
- Oxygen support
- Mentation
- Pain/recovery note

Interval 5 / 10 / 15 min พร้อม due badge

## Recovery completeness
Readiness ดู:
- checklist
- RR / SpO2 / Temp
- mentation
- extubation time
- มี serial recovery record อย่างน้อย 1 ชุด
- ไม่มี active Emergency Return

## Timeline / PDF
Recovery vital records รวมใน Timeline และ PDF report

## Additional UX
- Auto-seed recovery vitals จากค่าปัจจุบันใน OR ตอนเริ่ม recovery
- ป้องกัน milestone ย้อนกลับจาก EMERGENCE / RECOVERY ไป Surgery start

## URL
https://seeyouloverreallife-debug.github.io/ANESVET/?v=13.2
