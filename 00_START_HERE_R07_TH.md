# ANESVET V17.2.11 — R07 Tap Origin Guard

**ฐาน:** Checkpoint R06 / V17.2.10 (ไม่ได้สร้างโปรแกรมใหม่)

1. **ต้นฉบับแอป:** `index.html`, `app.js`, JS/CSS และ assets ทั้งหมดอยู่ในโฟลเดอร์นี้
2. **รายละเอียดการแก้ไข:** `BUGFIX_CHECKPOINT_R07_TH.md`
3. **ทดสอบ:** `node RUN_R07_QA.js` และอ่าน `QA_R07_RESULTS.json`
4. **วิธีทดสอบบน Android/iPad:** `DEVICE_R07_TEST_STEPS_TH.md`

**ข้อจำกัด:** Node tests ไม่เท่ากับ browser/device verification; Chromium ถูกบล็อกโดยสภาพแวดล้อมนี้ (`ERR_BLOCKED_BY_ADMINISTRATOR`) ทั้ง URL ภายในและ `file://` จึงยังไม่รับรองการกดบน Android/iPad จริง

**ความปลอดภัยข้อมูล:** ทดสอบบนเครื่องสำรอง/ไซต์ทดสอบ ไม่มี Active Case และต้องสำรองเคสก่อนทดลองอัปเดต อย่าล้าง Site Data หรือถอน PWA จากอุปกรณ์ที่มีเคสจริง
