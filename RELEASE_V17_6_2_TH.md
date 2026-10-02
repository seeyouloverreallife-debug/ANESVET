# ANESVET V17.6.2 — Architecture Consolidation Phase 3

- รวม production CSS 38 ไฟล์เป็น `anesvet-ui-bundle.css` 1 ไฟล์ โดยคง source order เดิมทุกไฟล์ เพื่อรักษา cascade/visual behavior
- ลด production stylesheet requests 38 -> 1
- ปรับ cache/version namespace เป็น 17.6.2
- ไม่เปลี่ยน clinical logic, dose, alert threshold, case schema, storage semantics หรือ final/archive behavior
- เก็บ source CSS เดิมทั้งหมดไว้ใน package เพื่อ audit/rollback และงาน refactor รอบถัดไป
- Phase นี้ตั้งใจแยก CSS consolidation ออกจาก app.js decomposition เพื่อให้ regression attribution ชัดเจน
