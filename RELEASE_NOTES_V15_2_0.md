# ANESVET V15.2.0 — OR LIVE Safety & Vitals Release

ต่อจาก V15.1.0 โดยแก้ feedback จากผู้ใช้ใหม่บนมือถือ/iPad โดยตรง: ปุ่มเดินเคสกดแล้วเปลี่ยน phase ทันที, ย้อนกลับเมื่อกดผิดไม่ได้ และช่วง intraoperative ปุ่มบันทึก vital signs ยังไม่เด่นพอเมื่อเทียบกับปุ่มเดิน phase

## 1) Confirm before important workflow transitions

ปุ่มที่มีผลต่อ phase/timestamp สำคัญจะไม่ทำงานจาก first tap อีกต่อไป แต่เปิด confirmation sheet ก่อน ได้แก่:

- Start induction
- Surgery start
- C-section: First neonate delivered
- C-section: Last neonate delivered
- Surgery end
- Extubation → Recovery
- Begin Recovery

Airway form, Vitals, Medication, Fluid และ Event ยังเปิด/บันทึกได้โดยไม่เพิ่ม confirmation ที่ไม่จำเป็น เพื่อไม่ทำให้ OR workflow ช้าลง

## 2) Undo last workflow step

หลังยืนยัน workflow step ระบบเก็บ reversible transition snapshot และแสดง `Undo`:

- quick Undo pill บน OR LIVE ช่วง 90 วินาทีแรก
- `MORE → Undo last workflow step`
- หน้า Recovery มี Undo โดยเฉพาะกรณีเผลอกด Extubation / Recovery

Undo ใช้ได้ไม่เกิน 5 นาที หรือจนกว่าจะมี workflow transition ถัดไป และต้องยืนยันอีกครั้งก่อนย้อน

ระบบไม่ลบ audit history: มีทั้ง `WORKFLOW_STEP_CONFIRMED` และ `WORKFLOW_STEP_UNDONE`

Safety guard:

- ถ้าเผลอ Start induction แล้วมี clinical data ใหม่ถูกบันทึกภายหลัง ระบบจะ block quick undo ของการเริ่มเคส
- ถ้าเข้า Recovery แล้วมี Recovery record/score ใหม่ ระบบจะ block quick undo ของ Extubation/Recovery
- การย้อน Extubation จะกลับไป OR LIVE / Emergence และคืนค่าที่เกี่ยวข้องกับ phase/timestamp โดยไม่ลบข้อมูลอื่นที่ไม่เกี่ยวกับ transition

## 3) Intraoperative = Vitals-first

บนมือถือ/iPad ระหว่าง `INTRAOPERATIVE` bottom dock เปลี่ยนลำดับความสำคัญเป็น:

**RECORD VITALS (ใหญ่สุด) → NEXT STEP → MORE**

- `RECORD VITALS` เป็น primary action ขนาดใหญ่
- เมื่อถึงเวลา record จะเปลี่ยนเป็น `RECORD VITALS • DUE` และเด่นขึ้น
- `END SURGERY` ยังอยู่ใน NEXT STEP แต่ถูกลด visual weight เพื่อป้องกันการกด phase progression โดยไม่ตั้งใจ
- นอก intraoperative ยังคง NEXT STEP เป็น primary action ตาม V15.1

## 4) OR LIVE start safety consistency

Start case จาก OR LIVE ตอนนี้ freeze `caseIdentitySnapshot` (patient/HN/Visit/species/microchip/BW) แบบเดียวกับ Hospital Pilot safety model เพื่อให้ patient/BW correction audit ทำงานสม่ำเสมอไม่ว่าจะเริ่มเคสจากหน้าใด

## Clinical logic intentionally unchanged

- Drug doses / concentrations
- Alert thresholds
- Fluid references
- ASA / BOAS logic
- Recovery score algorithm
- Medication stale-calculation safety stop
- Verified active-case checkpoint
- Final Lock gate
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
- production clinical helper tests: 73 assertions
- workflow model scenarios: 4 scenarios

NOT CLAIMED:

- jsdom/fake-indexeddb DOM suites: runtime dependency `jsdom` is unavailable in this environment
- full Playwright/browser E2E
- direct Chromium smoke test was attempted but did not complete within runtime timeout, therefore browser-level pass is not claimed

## Pilot focus

ให้ผู้ใช้ที่ไม่เคยใช้ ANESVET มาก่อนลองบนมือถือ/iPad โดยไม่บอกวิธีใช้ก่อน แล้วสังเกต 3 จุด:

1. ก่อนกด phase สำคัญ เขาเข้าใจ confirmation หรือไม่
2. ถ้ากดผิด เขาหา Undo เจอหรือไม่
3. ระหว่างผ่าตัด เขาเลือก `RECORD VITALS` เป็น action หลักโดยธรรมชาติหรือไม่
