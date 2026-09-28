# ANESVET V16.8.2 — Architecture Refactor Phase 3

รุ่นนี้ต่อจาก V16.8.1 โดยย้าย **state mutation / lifecycle orchestration** ออกจาก `app.js` เพิ่มขึ้น โดยไม่เปลี่ยน clinical behavior หรือ data schema

## Module ใหม่
- `patient-master-orchestration.js` — merge / retire / restore / resolve Patient Master
- `or-record-orchestration.js` — append / delete / correction ของ anesthesia vital records
- `recovery-orchestration.js` — Recovery records/scores และ phase patches

Domain/Core modules จาก V16.8.0–V16.8.1 ยังอยู่ครบและไม่เปลี่ยน schema

## Update จาก V16.8.1
ไม่ต้องล้างข้อมูลหรือ migrate database

หลัง update แนะนำ:
1. ตรวจ header = V16.8.2
2. Run Clinical Validation → 15/15
3. Run Reliability Self-check
4. ทดลอง Patient → Pre-check → OR → Recovery หนึ่งเคสก่อน production-wide rollout

ดูรายละเอียด:
- `ARCHITECTURE_V16_8_2.md`
- `MIGRATION_V16_8_1_TO_V16_8_2.md`
- `QA_V16_8_2.md`
- `RELEASE_NOTES_V16_8_2.md`
- `KNOWN_LIMITATIONS_V16_8_2.md`
