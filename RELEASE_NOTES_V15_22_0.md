# ANESVET V15.22.0 — Finalization & Medication Reconciliation

ฐานพัฒนา: **V15.21.0 Medication Safety & Clinical Validation**

รุ่นนี้ไม่ได้เพิ่มสูตรยาใหม่ แต่ปิดช่องว่างระหว่าง **Frozen Case Drug Plan** กับ **Actual administration** ตอนจบเคส และแก้ runtime integration ของ Finalization Guide ให้ทำงานกับ `app.js` อย่างถูกต้อง

## 1) Planned-vs-Actual Medication Reconciliation
เพิ่มส่วน **Medication reconciliation** ใน End Case

สำหรับยา routine ใน Frozen Case Drug Plan ระบบจะแยกเป็น:
- **GIVEN** — พบ Actual administration ที่ยังไม่ถูก void
- **NOT GIVEN** — ผู้ใช้ระบุเหตุผลที่ไม่ได้ให้ พร้อม Reviewed by
- **PENDING** — ยังไม่พบ Actual และยังไม่มี Not-given decision

Final Lock จะ **fail closed** ถ้ายังมี routine planned medication เป็น PENDING

### Emergency / standby
- รายการที่ระบุเป็น `standby`
- phase = `emergency`
- role ที่มีคำว่า emergency / standby

จะไม่ถูกบังคับให้ต้องมี Actual administration ก่อน Final Lock

### Other actual administrations
ยาที่ให้จริงแต่ไม่ได้อยู่ใน Frozen Case Drug Plan จะแสดงแยกเป็น **Other actual administrations** เพื่อให้ review ได้ แต่ไม่ถือว่าเป็น error

## 2) Matching ที่ปลอดภัยขึ้น
การจับคู่ plan ↔ actual ใช้ลำดับดังนี้:
1. stable drug ID จาก `calculationBasis.drug.id` เมื่อมี
2. exact normalized drug name เป็น fallback

ไม่มี fuzzy matching เพื่อหลีกเลี่ยงการจับยาผิดตัวโดยอัตโนมัติ

รายการซ้ำของยาเดียวกันใช้ actual records แบบ one-to-one ไม่เอา administration เดียวไป satisfy หลาย planned entries

## 3) Not-given decision + audit trail
เมื่อเลือก **Mark not given** ต้องระบุ:
- Reason
- Reviewed by
- Note เมื่อเลือก Reason = Other

Audit actions ใหม่:
- `PLANNED_MEDICATION_NOT_GIVEN`
- `PLANNED_MEDICATION_RECONCILIATION_CLEARED`

## 4) Legacy locked record preservation
เคสที่ถูก Final Lock และมี checksum อยู่ก่อน V15.22.0 จะ **ไม่ถูกเติม reconciliation state ย้อนหลังเพียงเพราะเปิดดูเคส**

UI จะแสดง `LEGACY LOCKED` และอธิบายว่า reconciliation ไม่ได้ถูกเก็บในรุ่นเดิม เพื่อรักษา immutable/checksummed record ไว้ตามเดิม

## 5) Finalization runtime fix
แก้ `finalization.js` เดิมที่อ้างตัวแปร/ฟังก์ชัน lexical ภายใน `app.js` โดยตรง เช่น state, setTab และ export functions ซึ่งอาจเกิด `ReferenceError` ใน browser จริง

V15.22 ใช้ narrow bridge:
- `window.AnesvetApp.getState()`
- save / audit
- tab navigation
- report export
- settings / toast
- End Case render

เพื่อลด coupling ระหว่าง modules โดยไม่ย้าย state architecture ทั้งระบบใน release นี้

## 6) Induction batch source fix
แก้ logic ให้รายการจาก `OR Induction Batch` ถูกนับเป็น induction medication จริง

ผลที่ได้:
- batch-confirmed induction medications ถูกพบโดย induction review
- `casePhase` ของรายการ batch ถูกบันทึกเป็น `induction`
- ลดกรณี UI เข้าใจผิดว่ายังไม่มี induction medication ทั้งที่บันทึกแล้ว

## 7) Medication safety เดิมยังคงอยู่
ไม่มีการผ่อน safety gate จาก V15.21:
- actionable mL ต้องมี preparation/concentration ที่ชัดเจน
- legacy BW ÷ factor ไม่ auto-fill Actual หาก preparation ไม่ครบ
- manual Actual administration ยังต้องมี route + preparation/concentration + administered by
- clinical validation matrix เดิมยังคงใช้ชุดเดียวกับ V15.21

## Compatibility / storage
- คง storage keys เดิม เพื่อรองรับข้อมูล V15.x เดิม
- เพิ่ม state field ใหม่เฉพาะเคสที่ยังไม่ถูก final checksum: `medicationReconciliation`
- ไม่ rewrite locked/checksummed legacy cases
- cache version เปลี่ยนเป็น `anesvet-v15-22-0-finalization-med-reconciliation`

## สิ่งที่ตั้งใจยังไม่ทำใน release นี้
- fuzzy drug-name matching
- monitor integration
- cloud sync / multi-user auth
- protocol version server
- retrospective reconciliation ของ final locked legacy cases

รายการเหล่านี้ควรแยกเป็น release ถัดไปเพื่อไม่เพิ่มความเสี่ยงให้ workflow หลักพร้อมกันหลายจุด
