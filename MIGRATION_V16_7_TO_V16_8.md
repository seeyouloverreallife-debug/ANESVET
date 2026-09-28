# Migration V16.7 → V16.8

ไม่ต้องทำ data migration

## คงเดิม
- localStorage keys
- IndexedDB `ANESVET_DB`
- DB version 2
- Patient Master records
- archived cases
- current case
- backup schema 2
- Final Lock checksum semantics

## สิ่งที่เปลี่ยน
เพิ่ม core JavaScript modules ก่อนโหลด `app.js`:
- `case-runtime.js`
- `core-storage.js`
- `session-coordination.js`

Service Worker cache version เปลี่ยนเป็น V16.8 และ cache module ใหม่ทั้ง 3 ไฟล์

## หลังอัปเดต
1. เปิด ANESVET และตรวจ Current Case/Archive
2. เข้า Data Health ตรวจ database backend
3. Run Clinical Validation
4. หากมี active case จาก V16.7 ให้ตรวจ patient name / phase / last record ก่อนใช้งานต่อ
