# Known Limitations — V16.8.2

1. Installed PWA/service-worker update lifecycle ยังไม่ได้พิสูจน์บน Android Chrome, iPad Safari และ Windows installed app ใน environment นี้
2. Browser integration QA ใช้ inline production-order harness; IndexedDB-specific transaction behavior อ้างอิงจาก core-storage regression ที่ยัง byte-identical กับ V16.8.1
3. Phase 3 ยังไม่ได้ย้าย DOM rendering/controllers ทั้งหมดออกจาก `app.js`; เป็น deliberate staged refactor เพื่อลด blast radius
4. Medication decision logic, alert rules และ finalization ยังคงอยู่ใน modules เดิมและไม่ได้ถูก refactor ในรุ่นนี้
