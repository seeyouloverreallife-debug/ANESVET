# ANESVET V16.8 — Architecture Refactor Phase 1

## เป้าหมาย
V16.8 ไม่ใช่ feature release หลัก แต่เป็นการลด coupling ของ `app.js` โดยรักษา clinical behavior, storage keys และ current case schema เดิม

## Boundary ใหม่

### `case-runtime.js`
รับผิดชอบเฉพาะ domain-neutral case runtime:
- สร้าง initial case state (`createState`)
- human record ID
- canonical clinical payload สำหรับ checksum
- SHA-256/checksum helper
- case activity timestamp

ไฟล์นี้ **ไม่มี DOM และไม่มี persistence**

### `core-storage.js`
รับผิดชอบ IndexedDB access:
- open/upgrade database
- archived case CRUD
- Patient Master CRUD
- metadata CRUD
- transactional dataset replacement สำหรับ restore

UI และ fallback policy ยังอยู่ใน `app.js` เพื่อให้ Phase 1 มี blast radius ต่ำ

### `session-coordination.js`
รับผิดชอบ multi-tab ownership mechanism:
- session/tab identity
- heartbeat lock
- freshness/TTL
- BroadcastChannel takeover/release
- mode state (`active` / `view`)

DOM banner/dialog และ clinical write guard ยังอยู่ใน `app.js`

## สิ่งที่ยังไม่ย้ายใน Phase 1
- OR workflow / vitals / alert UI
- Recovery workflow
- Patient Master UI/domain operations
- Medication workflow
- Timeline/PDF/archive rendering

การแยกส่วนเหล่านี้ควรทำทีละ domain หลัง core boundary ผ่าน production regression แล้ว

## Compatibility contract
V16.8 รักษา:
- localStorage keys เดิม
- IndexedDB name/version เดิม (`ANESVET_DB`, DB version 2)
- case state keys + value types เดิม
- backup format/schema เดิม
- clinical checksum payload rules เดิม
- Final Lock / medication safety / alert thresholds เดิม

ดังนั้นการอัปเดต V16.7 → V16.8 **ไม่ต้องล้างข้อมูลหรือ migrate database**

## Architectural rule ต่อจากนี้
1. Core modules ห้ามอ้าง DOM โดยไม่จำเป็น
2. Clinical modules ห้ามเขียน IndexedDB/localStorage โดยตรง ถ้าสามารถผ่าน core storage boundary ได้
3. State schema ต้องสร้างจาก `case-runtime.js` เพียงจุดเดียว
4. Restore dataset ใช้ transaction ผ่าน `core-storage.js`
5. การเปลี่ยน boundary ต้องมี V(previous) ↔ V(new) schema compatibility regression
