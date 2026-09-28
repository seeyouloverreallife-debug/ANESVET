# Known Limitations — V16.8.1

- Architecture refactor Phase 2 ยังไม่ได้แยก Patient/OR/Recovery event handlers ออกจาก `app.js`; ย้ายเฉพาะ pure/domain helpers ก่อน
- `app.js` ยังเป็น orchestration monolith ประมาณ 5,051 lines
- installed-PWA/service-worker lifecycle บนอุปกรณ์จริงยังต้องทดสอบบน Android/iPad/Windows ตาม RC matrix
- inline browser harness ใช้ memory storage shim จึงไม่ได้แทน OS/browser persistence pressure testing
- ไม่มีการเปลี่ยน clinical rules เพื่อแก้ architecture; clinical behavior ต้องอาศัย regression + real-device validation ต่อเนื่อง
