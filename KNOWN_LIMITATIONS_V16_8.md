# Known Limitations — V16.8

- V16.8 เป็น Architecture Refactor Phase 1; `app.js` ยังมี OR, Recovery, Patient UI, medication workflow และ reporting อยู่ร่วมกัน
- Browser environment ของการทดสอบนี้ไม่อนุญาต navigation ไป local origin/installed PWA จริง จึงใช้ production inline harness + IndexedDB-compatible test harness สำหรับ runtime regression
- Service Worker install/update lifecycle จริงยังต้องตรวจบน Android Chrome, iPad Safari/Add to Home Screen และ Windows Chrome/Edge
- Persistent Storage / quota / OS eviction policy ยังคงขึ้นกับ browser และ OS
- Architecture refactor ไม่ได้ทำให้ external backup ไม่จำเป็น
