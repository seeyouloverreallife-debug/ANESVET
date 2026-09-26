# ANESVET V15.21.0 — Medication Safety & Clinical Validation

## เป้าหมาย
ลดความเสี่ยงจากการแสดง volume (mL) ที่ดูพร้อมฉีด ทั้งที่ preparation/concentration ยังไม่ถูกกำหนด และเพิ่ม automated validation matrix สำหรับ calculation core ที่ใช้อยู่ในโปรแกรม

## Medication safety changes
- Quick Presets จะแสดง mL เป็น actionable เฉพาะเมื่อมี preparation/concentration ที่กำหนดไว้ชัดเจน
- Cefazolin / Convenia built-in แบบ legacy `BW ÷ factor` จะไม่แสดง mL เป็น primary value อีกต่อไป และขึ้น `SET PREP` / `Preparation required` แทน
- Legacy formula ยังไม่ถูกลบ เพื่อรักษา compatibility แต่จะไม่ถูก auto-fill เข้า Actual administered
- Case Drug Plan แสดง `Preparation required` สำหรับรายการที่ยังไม่พร้อม และ review plan จะเตือนก่อนยืนยัน
- OR Quick Drug / induction batch จะปิด `Use calculated` และไม่ prefill Actual mL เมื่อ preparation/concentration ไม่ครบ
- การบันทึกยาจริงยังทำได้ โดยกรอก Actual mL + Route + Preparation/Concentration + Administered by เอง
- Hospital Drug Library จะ highlight formula ที่ dose/preparation ยังไม่ครบ

## UX
- ชื่อ workflow tab เปลี่ยนจาก `Drug Calculator` เป็น `Medications` เพื่อสะท้อนว่าหน้านี้รวม Quick Doses, Case Drug Plan และ Calculator/Reference
- เพิ่มคำอธิบาย safety ใต้ Hospital Quick Presets

## Clinical validation
เพิ่ม `clinical-validation.js` และปุ่ม `Run clinical validation matrix` ใน Settings > Clinical Safety & Reliability

Matrix ตรวจอย่างน้อย:
- mg/kg ÷ mg/mL
- mg/kg ÷ μg/mL unit conversion
- μg/kg ÷ μg/mL
- μg/kg ÷ mg/mL unit conversion
- mL/kg arithmetic
- BW ÷ factor arithmetic
- missing preparation blocks actionable mL
- manual medications never auto-fill
- ETT preparation table validity / monotonicity / known spot checks

## Compatibility
- ไม่เปลี่ยน storage keys
- ไม่ลบ legacy hospital formulas
- ไม่เปลี่ยน dose/threshold เดิม
- ไม่เปลี่ยน readiness gate, OR phase logic, Recovery guard หรือ Final Lock
