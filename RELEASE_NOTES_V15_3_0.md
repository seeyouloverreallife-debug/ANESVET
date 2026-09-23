# ANESVET V15.3.0 — Intraoperative Vitals & Timeline Release

ต่อจาก V15.2.0 โดยโฟกัส feedback จากการใช้งานบนมือถือ/iPad ว่า ช่วง intraoperative การบันทึก vital signs ต้องเป็นงานหลักที่เห็นและกดได้ทันที มากกว่าการเดิน phase ซึ่งเกิดเพียงครั้งเดียวต่อช่วง

## 1) Intraoperative Vitals-first cockpit

เมื่อเคสอยู่ใน `INTRAOPERATIVE` OR LIVE จะแสดง workspace แยกสำหรับ vital signs เหนือปุ่ม workflow:

- `SAVE VITALS` เป็น action ใหญ่และเด่นที่สุดบนหน้า
- แสดง `NEXT DUE` แบบสด พร้อม due state
- แสดง `LAST SAVED` พร้อม vital summary ล่าสุด
- ปุ่ม phase progression / Surgery end ยังคงอยู่ แต่ลด visual weight ลง
- mobile/iPad bottom dock ของ V15.2 ยังคง `RECORD VITALS → NEXT STEP → MORE`

ไม่มีการเปลี่ยน clinical threshold หรือความถี่ monitoring อัตโนมัติ; due timer ยังใช้ record interval ที่ตั้งไว้เดิม

## 2) Copy Last — กรอกเร็วโดยยังต้องยืนยันค่าก่อน Save

เพิ่ม `COPY LAST` สำหรับนำค่าจาก vital record ล่าสุดมาเติมในช่องปัจจุบัน แล้วผู้ใช้แก้เฉพาะค่าที่เปลี่ยนก่อนกด Save

Copy Last:

- ไม่สร้าง record ใหม่เอง
- ไม่ bypass plausibility warning / alert logic
- ไม่เปลี่ยน timestamp เดิม
- คัดลอก HR, RR, SAP/MAP/DAP, SpO₂, ETCO₂, Temperature, Vaporizer, O₂, fluid rate, depth และ ventilation เมื่อมีข้อมูล
- ผู้ใช้ยังต้องตรวจค่าบนหน้าจอและกด `SAVE VITALS` เอง

## 3) Unified Procedure Timeline

`Procedure timeline` ตอนนี้รวม **ทุก anesthesia vital record** ไม่ใช่เฉพาะ record ที่มี note

ตัวอย่างรายการใน timeline:

- Induction / Intubation / Surgery start / Surgery end / Extubation
- Vitals: HR, RR, MAP, SpO₂, ETCO₂, Temp และ vaporizer เมื่อมีค่า
- Medication events
- Fluid / support / custom events
- Alerts + interventions + resolution
- Corrections
- Recovery vitals

เป้าหมายคือให้ timeline เป็น chronological clinical record เดียวของทั้งเคส โดยไม่เปลี่ยนข้อมูลต้นฉบับหรือ audit history

## 4) Quick meds in intraoperative workspace

เพิ่ม Quick meds strip ใน Vitals-first cockpit:

- แสดงเฉพาะยาที่โรงพยาบาล mark เป็น `Favorite` ใน Hospital Drug Library
- สูงสุด 4 ปุ่ม เพื่อไม่ทำให้ OR LIVE กลับมารก
- แตะ Quick med = เปิด medication dialog และ preselect ยานั้นเท่านั้น
- **ไม่มีการบันทึก/ให้ยาอัตโนมัติ**
- Actual administered, route, concentration, administered by และ confirmation เดิมยังต้องครบ
- `All medications` เปิด medication dialog แบบเต็มเมื่อยาที่ต้องการไม่อยู่ใน Favorites

## 5) Existing safety retained

ยังคง V15.0–V15.2 safety behavior เดิมทั้งหมด:

- patient/BW identity freeze + correction audit
- stale medication-calculation safety stop
- double-tap medication save protection
- verified local safety checkpoint
- OR workflow confirmation
- audited Undo last workflow step
- Recovery override audit
- Final Lock gate
- local-first autosave / offline behavior

## Clinical logic intentionally unchanged

- Drug doses / concentrations
- Alert thresholds
- Fluid references
- ASA / BOAS logic
- Recovery score algorithm
- Record interval defaults
- LocalStorage keys / IndexedDB schema

## Validation performed

PASS:

- JavaScript syntax + JSON
- source regression / storage contracts
- V14.7.2 UX compatibility
- V14.8 adaptive workflow static contracts
- V14.8.2 Risk Flags contracts
- V14.9 mobile/iPad reliability compatibility
- V15.0 Hospital Pilot safety contracts
- V15.1 OR navigation contracts
- V15.2 confirmation / undo / vitals-priority contracts
- V15.3 vitals-first / unified timeline contracts
- production clinical helper tests: 73 assertions
- workflow model scenarios: 4 scenarios

NOT CLAIMED:

- jsdom/fake-indexeddb DOM suites: runtime dependency `jsdom` is unavailable in this environment
- full Playwright/browser E2E

An offline `npm ci` attempt was also unable to restore the missing DOM test dependencies because not all npm packages were present in cache.

## Pilot focus

ทดสอบบนโทรศัพท์/iPad ระหว่าง simulated/real pilot แล้วดูว่า:

1. เมื่อเข้า Intraoperative ผู้ใช้มองเห็น `SAVE VITALS` ก่อน `END SURGERY` หรือไม่
2. การใช้ `COPY LAST → แก้ค่าที่เปลี่ยน → SAVE VITALS` ลดเวลาและจำนวน tap จริงหรือไม่
3. ผู้ใช้ยังตรวจค่าจริงก่อน Save แทนการกด Copy/Save แบบอัตโนมัติหรือไม่
4. Timeline ช่วยตอบคำถามย้อนหลังว่า “ตอนค่าผิดปกติ เกิดยา/intervention อะไรต่อ” ได้ง่ายขึ้นหรือไม่
5. Quick meds 4 รายการเพียงพอหรือยังรกเกินไป
