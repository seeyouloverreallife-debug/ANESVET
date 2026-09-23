# ANESVET V15.1.0 — OR LIVE Navigation & Focus Release

ต่อจาก **V15.0.0 Hospital Pilot Release** โดยแก้ pain point จากการลองใช้งานบนมือถือ/iPad: ผู้ใช้เห็นปุ่มหลายชุดพร้อมกันและไม่ชัดว่าต้องกดอะไรเพื่อเดินเคสต่อ แม้ระบบจะมี Next Clinical Step อยู่แล้วก็ตาม

## เป้าหมาย

ทำให้ OR LIVE ตอบคำถาม 3 ข้อได้ทันทีบนอุปกรณ์ touch:

1. ตอนนี้อยู่ขั้นไหน
2. ขั้นถัดไปคืออะไร
3. ถ้าจะบันทึก vital หรือทำอย่างอื่นต้องกดตรงไหน

โดย **ไม่ตัด capability เดิม และไม่เปลี่ยน clinical dose / alert / ASA / BOAS / medication safety / hospital-pilot data integrity logic**

## OR LIVE navigation ใหม่

### 1) Bottom action dock เหลือ 3 กลุ่ม

บนมือถือและ iPad/touch tablet:

- **NEXT STEP** — ปุ่มใหญ่สุดและเด่นที่สุด
- **VITALS** — บันทึก monitoring record
- **MORE** — รวมงานรอง

จากเดิมที่มี NEXT / RECORD / MEDS / FLUID / EVENT พร้อมกัน 5 ปุ่ม

### 2) NEXT STEP เปลี่ยนชื่อจริงตาม phase

ปุ่มล่างไม่ใช้คำว่า `NEXT` อย่างเดียวอีกต่อไป แต่แสดง action ที่จะเกิดขึ้นจริง เช่น:

- START INDUCTION
- INTUBATE / AIRWAY
- START SURGERY
- FIRST NEONATE / LAST NEONATE (C-section)
- END SURGERY
- EXTUBATE → RECOVERY
- BEGIN / OPEN RECOVERY
- END CASE

จึงไม่ต้องจำ workflow หรือเดาว่า NEXT จะทำอะไร

### 3) Step counter บนการ์ดหลัก

เพิ่มสถานะ เช่น:

- STEP 1 OF 5 • SETUP
- STEP 2 OF 5 • INDUCTION
- STEP 3 OF 5 • SURGERY
- STEP 4 OF 5 • EMERGENCE
- STEP 5 OF 5 • RECOVERY

เพื่อให้เห็นตำแหน่งของเคสใน workflow โดยไม่ต้องเปิด tracker ทั้งหมด

### 4) MORE เป็น bottom sheet

งานที่ไม่ใช่ “เดินเคสต่อ” ถูกย้ายออกจาก action dock ไปที่ MORE:

- Medications
- Fluid / Blood
- Event / Problem
- Airway
- Trends
- Timeline
- Case Summary / leave OR focus

ทำให้ปุ่มรองไม่แย่ง visual priority จาก clinical progression

### 5) OR Focus mode

เมื่ออยู่ OR LIVE บนมือถือ/iPad:

- ซ่อน workflow tab bar และ case strip ที่ซ้ำกับข้อมูลใน OR LIVE
- ย่อ top bar ให้เหลือสถานะ save/connectivity ที่สำคัญ
- Routine/Custom workflow context panel ที่ซ้ำกับ primary flow ถูกซ่อน
- Critical/C-section context ยังสามารถคงข้อมูลเฉพาะเคสที่จำเป็นได้
- ออกจาก focus mode ผ่าน MORE → Case Summary

รองรับทั้ง width-based tablet layout และ coarse-pointer touch devices ถึง ~1400 CSS px เพื่อครอบคลุม iPad landscape ขนาดใหญ่

## สิ่งที่คงเดิม

- V15.0 verified safety checkpoint
- active-case identity/BW correction audit
- stale medication calculation safety stop
- medication double-tap guard
- Recovery override + Final Lock gate
- V14.9 local-first autosave/offline behavior
- V14.8 risk flags / BOAS structure
- drug dose / concentration defaults
- alert thresholds
- fluid references
- ASA logic
- LocalStorage keys / IndexedDB schema

## Validation

ผ่านใน runtime นี้:

- Syntax + JSON
- Source/storage regression
- V14.7.2 UX compatibility
- V14.8 adaptive workflow static contracts
- V14.8.2 risk flag contracts
- V14.9 mobile/iPad contracts
- V15.0 Hospital Pilot safety contracts
- **V15.1 OR LIVE navigation contracts**
- Production clinical helper tests: **73 assertions**
- Workflow model scenarios: **4 scenarios**

ไม่อ้างว่า browser DOM integration / Playwright E2E ผ่าน เนื่องจาก `jsdom`, `fake-indexeddb`, `playwright` runtime dependencies ไม่มีใน environment นี้ และ direct Chromium smoke run ไม่จบภายใน runtime limit

## Pilot focus หลัง release นี้

ให้ทดสอบบนมือถือและ iPad จริง โดยดูเฉพาะ OR LIVE ก่อน:

- ผู้ใช้ใหม่หา “ขั้นถัดไป” ได้ภายใน 1–2 วินาทีหรือไม่
- กดผิดระหว่าง NEXT / VITALS / MORE หรือไม่
- More sheet มี action ที่ต้องใช้จริงครบหรือไม่
- C-section / Critical workflow ยังเข้าถึง action เฉพาะเคสได้ง่ายหรือไม่
- landscape iPad มี bottom dock และ focus mode ตามที่ตั้งใจหรือไม่
