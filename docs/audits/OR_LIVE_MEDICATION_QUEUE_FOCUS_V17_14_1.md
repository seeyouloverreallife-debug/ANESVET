# ANESVET V17.14.1 — OR LIVE Focused Medication Queue Audit

ฐานงาน: V17.14.0

## ปัญหาที่พบจาก source ปัจจุบัน
`orMedicationQueue` ถูกแสดงเต็มเมื่อเคสเริ่มและมี planned medication แม้ current phase จะไม่มีรายการที่ต้อง review แล้ว ทำให้ OR LIVE ใช้พื้นที่แนวตั้งกับรายการ `LATER` / `DOCUMENTED` และ action row ที่ไม่จำเป็นในขณะ monitor ผู้ป่วย

นี่เป็น presentation friction ไม่ใช่ clinical logic defect

## Behavior ใหม่
- ถ้ามี planned medication ที่ `NEEDS REVIEW` สำหรับ current/earlier phase → queue เปิดเต็มอัตโนมัติ
- ขณะ `NEEDS REVIEW` → ไม่ให้ยุบ queue เพื่อคง documentation visibility
- ถ้า current phase clear → queue auto-compact เป็น summary
- summary ยังคง badge + hint + `View plan`
- ผู้ใช้เปิด full plan ได้เอง; `Hide plan` กลับสู่ compact state
- `Record next planned` แสดงเฉพาะเมื่อมี current-phase review item
- Medication workspace เต็มยังเข้าถึงได้จาก full plan และ entry points เดิม

## Clinical safety boundary
การยุบ/ขยายเป็น local presentation state เท่านั้น และไม่เขียน:
- `state.casePhase`
- medication administration records
- dose / calculated volume
- route / concentration
- protocol snapshot
- recovery / finalization state

Induction details-pending, Intubation timestamp-only, End Surgery, Emergency Return, Recovery และ Final Lock ไม่เปลี่ยน

## Deterministic QA
เพิ่ม `QA_V17_14_1_OR_MEDICATION_FOCUS.js` ซึ่งจำลอง:
1. intra-op ที่มีเฉพาะ post medication → auto-compact
2. ผู้ใช้กด View plan → full plan เปิด
3. เพิ่ม current-phase pre medication pending → full queue ถูกบังคับเปิดและปิด toggle ยุบ

## ข้อจำกัด
ยังไม่ได้ทำ physical Android/iPad/PWA visual test ใน environment นี้
