# ANESVET V15.9.3 — Feedback Endpoint Update

## Scope
- เปลี่ยน internal Hospital Pilot feedback endpoint ไปยัง Google Apps Script deployment ใหม่
- คงระบบ private endpoint, local queue, retry, normal POST / no-CORS / sendBeacon fallback จาก V15.9.2
- ไม่เปลี่ยน clinical workflow, dose logic, alert thresholds, recovery, PDF หรือ storage schema

## Privacy / UI
- ผู้ใช้ทั่วไปไม่เห็น endpoint ใน Settings หรือหน้าส่ง report
- UI ยังคงแสดงเพียงการส่ง report ถึงผู้พัฒนา ANESVET

## Validation
- ตรวจว่า source ใช้ APP_VERSION 15.9.3
- ตรวจว่า endpoint เก่าไม่เหลือใน source build
- ตรวจ manifest/service-worker versioning
- Live write to Google Sheet ยังต้องยืนยันจากอุปกรณ์จริงหลัง deploy
