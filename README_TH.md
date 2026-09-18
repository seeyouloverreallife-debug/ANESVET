# ANESVET V13 — OR Workflow & Fluid Management

## Step 1 — Patient & Case Setup
หน้าแรกมี:
- Patient / HN / species / breed / age / BW / BCS / ASA
- Procedure
- Surgeon
- Anesthetist
- Surgical assistant
- Allergy
- Underlying disease
- Anesthetic cautions

ข้อมูลทีมใช้ต่อใน OR LIVE และ PDF โดยไม่ต้องเข้า Dashboard ไปกรอกซ้ำ

## Case Summary
Dashboard ถูกถอดออกจากเมนูหลัก
ใน “เพิ่มเติม” เปลี่ยนเป็น Case Summary แบบ read-only
Legacy Dashboard เดิมยังคงอยู่ใน DOM เพื่อ compatibility ของระบบเดิม

## OR LIVE — Fluid / Blood Loss Cockpit
- Current crystalloid rate (mL/hr)
- mL/kg/hr
- Auto calculated crystalloid จาก rate × anesthesia elapsed time
- Actual/corrected crystalloid (optional)
- Bolus +5 / +10 / +20 / Custom
- Estimated blood loss +5 / +10 / +20 / Custom
- Urine +5 / +10 / +20 / Custom
- Blood product given
- Total fluid in + mL/kg
- Net estimate
- Rate history
- rate change / bolus / blood loss / urine ถูกบันทึกใน Event/Timeline

## End Case / PDF
เพิ่ม fluid summary:
- calculated crystalloid
- effective/actual crystalloid
- bolus
- blood product
- total fluid
- estimated blood loss
- urine
- net estimate

## Icon
รวมไอคอน ANESVET dog + cat + anesthesia monitor ที่ผู้ใช้เลือกไว้แล้ว

## URL
https://seeyouloverreallife-debug.github.io/ANESVET/?v=13
