# ANESVET V16.8.1 — Architecture Refactor Phase 2

## เป้าหมาย
Phase 2 ต่อจาก core boundaries ของ V16.8.0 โดยค่อย ๆ แยก pure/domain logic ออกจาก `app.js` โดย **ไม่เปลี่ยน state schema, storage keys, clinical rules หรือ user workflow**

## Domain modules ใหม่

### `patient-domain.js`
Pure Patient Master/domain helpers:
- normalize patient identifiers
- create Patient Master seed จาก archived/current case
- patient identity key
- merged patient / HN alias / microchip alias matching
- anesthesia history filtering + ordering
- patient search matching

DOM rendering, IndexedDB/fallback policy และ event handlers ยังอยู่ใน `app.js`.

### `or-domain.js`
Pure OR record helpers:
- canonical vital snapshot signature
- exact-vital duplicate detection window
- vital record summary formatting
- critical record classification adapter

การ Record vital, alert episode synchronization, audit, save และ rendering ยังอยู่ใน `app.js`.

### `recovery-domain.js`
Pure Recovery helpers:
- recovery score calculation
- recovery score display text
- readiness calculation + missing-items list
- recovery elapsed time

Recovery record creation, override confirmation, audit, handoff และ UI rendering ยังอยู่ใน `app.js`.

## Strangler pattern
V16.8.x ใช้แนวทางค่อย ๆ แยก domain:
1. สร้าง pure module ที่ test แยกได้
2. ให้ `app.js` ใช้ wrapper ไปยัง module ใหม่
3. เทียบ behavior กับ release ก่อนหน้า
4. ค่อยย้าย orchestration/event handlers เมื่อ boundary นิ่ง

วิธีนี้ลด blast radius และทำ rollback/compare ได้ง่ายกว่าการ rewrite.

## Compatibility contract
V16.8.1 รักษาจาก V16.8.0:
- `case-runtime.js` byte-identical
- initial case state schema เดิม
- localStorage keys เดิม
- IndexedDB `ANESVET_DB`, DB version 2 เดิม
- backup/restore schema เดิม
- checksum payload rules เดิม
- clinical validation / workflow เดิม
- dose reference / protocol review เดิม
- medication reconciliation / finalization เดิม

จึงไม่ต้องล้างข้อมูลหรือ migrate database.

## Next architecture boundary
หลัง Phase 2 ผ่านการใช้งานจริง ควรย้ายเป็นลำดับ:
1. Patient Master orchestration/API
2. OR record orchestration (record + correction + rendering adapters)
3. Recovery record/handoff orchestration
4. Timeline/report composition

Medication decision logic และ alert clinical rules ควรย้ายทีหลังพร้อม dedicated regression matrix.
