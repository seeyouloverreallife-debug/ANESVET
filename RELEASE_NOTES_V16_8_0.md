# ANESVET V16.8.0 — Architecture Refactor Phase 1

## Changed
- แยก initial case schema + checksum runtime ออกจาก `app.js` → `case-runtime.js`
- แยก IndexedDB CRUD/transaction → `core-storage.js`
- แยก multi-tab ownership/heartbeat/BroadcastChannel → `session-coordination.js`
- Restore archive/patient/current dataset ใช้ storage transaction API กลาง
- เพิ่ม fail-fast guards หาก core module โหลดไม่ครบ
- Service Worker cache core module ใหม่ทั้งหมด

## Compatibility
- Current case state keys/types ตรงกับ V16.7
- storage keys และ DB schema ไม่เปลี่ยน
- backup schema ไม่เปลี่ยน
- clinical/safety modules หลัก byte-identical กับ V16.7

## Regression fix ระหว่าง refactor
- แก้ `View only` conflict dialog ไม่ให้เปิดซ้ำหลังผู้ใช้เลือก view-only mode

## Not changed
- dose / dose reference
- alert threshold
- medication safety/reconciliation
- Recovery criteria
- Final Lock criteria/checksum semantics
- clinical validation dataset
