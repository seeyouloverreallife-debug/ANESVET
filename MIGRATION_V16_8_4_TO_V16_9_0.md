# Migration — V16.8.4 → V16.9.0

## Database
ไม่ต้อง migrate IndexedDB และไม่ต้องล้าง local data

- DB name: `ANESVET_DB` (unchanged)
- DB version: `2` (unchanged)
- localStorage keys: unchanged

## New current-case fields
V16.9.0 เพิ่ม field แบบ additive ใน JSON case state:
- `procedureTemplateId`
- `procedureTemplateSnapshot`

เคสใหม่เริ่มที่ `procedureTemplateId = "custom"` และ snapshot = `null`

## Existing working cases
ถ้าไม่มี `procedureTemplateId` ระบบจะ resolve จาก:
1. Procedure text ที่มีอยู่
2. Existing workflow profile (`csection` / `critical`)
3. fallback `custom`

จะไม่มีการเปลี่ยนยา, dose, thresholds หรือ clinical records จากการ resolve นี้

## Active case behavior
เคสใหม่ใน V16.9.0 จะสร้าง `procedureTemplateSnapshot` เมื่อเริ่ม induction และใช้ workflow profile ใน snapshot เป็น source สำหรับ active-case workflow เพื่อป้องกันการเปลี่ยน flow กลางเคส

## Locked records
Locked final record เดิมยังคง final checksum/payload เดิม การเติมค่า fallback ใน runtime ไม่ถูก persist ลง locked record โดยการ autosave ปกติ
