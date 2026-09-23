# ANESVET V15.5.0 — Case Drug Plan & Compact Report Release

V15.5.0 ต่อจาก V15.4.0 โดยแก้ feedback จากการใช้ workflow บนมือถือ/iPad 3 จุดหลัก: ลดการเลือกยา induction ซ้ำ, เพิ่มรายงานสรุปสั้น และให้ feedback หลังบันทึก vital signs มองเห็นได้ทันที

## 1) Case Drug Plan → OR LIVE

- เพิ่ม **Case Drug Plan** ใน Drug Calculator
- ครั้งแรกจะสร้างรายการเริ่มต้นจาก Hospital Quick Presets / Hospital Protocol
- ผู้ใช้เพิ่มหรือตัดยาเฉพาะเคสได้จาก Hospital Drug Library
- Hospital Drug Library รองรับ phase `Emergency / standby`
- Emergency reference drugs ที่มีใน protocol สามารถอยู่ในแผนในสถานะ **STANDBY** โดยไม่ถือว่าให้ยาแล้ว
- ปุ่ม `Save / Review plan` เก็บ reviewer + timestamp + audit trail
- หากแก้ Current BW ก่อนเริ่มเคสหลัง review แล้ว ระบบยกสถานะ review เพื่อให้ทบทวน calculated volume ใหม่
- เมื่อ Start Case ระบบ freeze Case Drug Plan เข้า `protocolSnapshot.caseDrugPlan` พร้อม calculation basis ของ BW ขณะเริ่มเคส
- ถ้าแผนยังไม่ review ระบบเตือนก่อน Start Case แต่ไม่บังคับให้ใช้ protocol สำเร็จรูป

### Induction documentation

- ถ้ามี planned induction drugs, OR LIVE จะเปิด **ยาตัวถัดไปจาก Case Drug Plan โดยตรง** ไม่เริ่มจาก dropdown
- ผู้ใช้กรอก `Actual administered`, route, concentration และผู้ให้ยา
- หลัง Save ระบบเลื่อนไป planned induction drug ตัวถัดไป
- ยังมี `Other medication` สำหรับยาที่ไม่ได้อยู่ในแผน
- Quick meds ใน Intraoperative จะให้ priority กับ planned **Emergency / Standby** ก่อน Favorite drugs ทั่วไป
- Calculated amount ยังคงเป็น reference; ไม่มีการ mark ว่า administered จนกดยืนยัน actual administration

## 2) Compact Summary PDF

เพิ่ม **1-page Summary PDF** แยกจาก Full PDF เดิม

สรุปประกอบด้วย:
- patient / HN / Visit / BW / ASA / procedure
- protocol และ Case Drug Plan แบบย่อ
- key milestones: induction, surgery start/end, extubation, recovery complete
- vitals overview: range + latest HR, MAP, SpO₂, ETCO₂, temperature
- confirmed medication administrations (สูงสุด 10 แถว; รายการเกินให้ดู Full PDF)
- fluid / blood loss / urine / net balance
- structured risk flags + complication / alert count
- recovery latest values + readiness score
- clinical sign-off / record status

**Full PDF Report ยังอยู่ครบ** สำหรับ serial records, trends, corrections, amendments, audit trail และ recovery documentation รายละเอียดเต็ม

Summary PDF ใช้ได้ทั้ง current case, End Case และ Archived case

## 3) Explicit vital-save feedback

หลังบันทึก anesthesia vital signs:
- แสดง inline feedback ใน Intraoperative workspace เช่น `✓ SAVED 11:32:10`
- แสดง vital summary สั้น ๆ ใต้ปุ่ม
- ปุ่ม SAVE VITALS เปลี่ยนสถานะเป็นสีเขียวชั่วคราว
- toast เปลี่ยนเป็น `✓ Vitals saved`
- feedback ไม่เปลี่ยน clinical data และไม่ข้าม plausibility / alert checks เดิม

## Clinical safety / compatibility

V15.5.0 ไม่เปลี่ยน:
- hospital dose / concentration โดยอัตโนมัติ
- ASA classification logic
- BOAS / risk assessment logic
- configurable alert thresholds
- fluid reference logic
- V15.0 data-integrity guards
- V15.2 phase confirmation / Undo safety
- V15.3 vitals-first workflow
- V15.4 Recovery workflow

## Tests

ผ่านใน environment นี้:
- JavaScript / JSON syntax
- storage / regression contracts
- V14.7.2–V15.4 compatibility contracts
- V15.5 Case Drug Plan / Compact PDF / vital-save feedback contracts
- Clinical helper: 73 assertions
- Workflow model: 4 scenarios

DOM/browser automation ไม่ได้อ้างว่าผ่าน เนื่องจาก runtime ไม่มี `jsdom`, `fake-indexeddb` และ Playwright dependencies; direct headless Chromium smoke attempt ไม่จบภายใน runtime limit.
