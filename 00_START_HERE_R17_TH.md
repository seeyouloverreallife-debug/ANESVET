# ANESVET V17.2.21 — Checkpoint R17

ต่อจาก `ANESVET_V17_2_20_CHECKPOINT_R16_WORKING_COPY_COMMIT.zip` โดยตรง ไม่ใช่การเขียนโปรแกรมใหม่

**R17:** Backup Restore / Rollback Safety

แก้จุดตรวจความครบถ้วนของ Restore ใน backup รุ่นเก่า ตรวจการเขียนข้อมูล Clinical Records กลับจาก IndexedDB จริง และป้องกัน Restore เมื่อสร้าง rollback snapshot ที่ตรวจสอบแล้วไม่ได้

- ดู `R17_CHANGELOG.md` เพื่อดูขอบเขตการแก้
- ดู `R17_DEVICE_TEST_STEPS_TH.md` เพื่อทดสอบบนเคสจำลอง
- รัน `node RUN_R17_QA.js` จากโฟลเดอร์นี้เพื่อตรวจ QA ทั้งหมด
- ดู `QA_R17_RESULTS.json` สำหรับผลทดสอบอัตโนมัติ
- ดู `R17_SOURCE_DIFF.json` สำหรับรายชื่อไฟล์ที่แก้เทียบกับ R16

**คำเตือน:** ไม่รับรองการใช้งานทางคลินิกจนกว่าจะทดสอบบน Android/iPad จริง และตรวจ rollback ผ่านด้วยเคสจำลอง ห้ามล้างข้อมูลหรือ overwrite deployment ที่มี Active Case ระหว่างทดลอง
