# Migration — V16.8.0 → V16.8.1

## Data migration
**ไม่ต้อง migrate ข้อมูล**

V16.8.1 เป็น architecture-only refactor:
- storage keys เดิม
- IndexedDB schema/version เดิม
- current case schema เดิม
- Patient Master schema เดิม
- archive/backup schema เดิม

## Update steps
1. ถ้ามี active case ให้จบ/เก็บ current case ตาม workflow ปกติ หรือเปิดใหม่หลัง update ตาม version reload guard
2. สำรองข้อมูลภายนอกตามนโยบายโรงพยาบาล
3. deploy ไฟล์ V16.8.1 ทั้งชุด โดยเฉพาะ domain modules ใหม่ 3 ไฟล์
4. reload/update PWA
5. ตรวจ version = V16.8.1
6. Run Clinical Validation และ Reliability Self-check

## Important
ห้ามคัดลอกเฉพาะ `app.js` โดยไม่ deploy:
- `patient-domain.js`
- `or-domain.js`
- `recovery-domain.js`

V16.8.1 ใช้ fail-fast module dependency เพื่อป้องกัน partial deployment.
