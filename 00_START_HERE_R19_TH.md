# ANESVET V17.2.23 — R19 Restore Transaction Journal

**ต้นทาง:** V17.2.22 Checkpoint R18 (ไม่เริ่มโปรแกรมใหม่)

## เป้าหมาย R19
เพิ่มหลักฐาน Restore แบบคงอยู่หลัง Reload และหยุดการบันทึกเมื่อข้อมูลอาจกู้มาไม่ครบ ไม่ใช้วิธีเขียนทับหรือ Rollback อัตโนมัติหลัง Session เปลี่ยนเจ้าของ

## ส่วนที่เพิ่ม
1. **Transaction Journal:** key `anesvet_restore_journal_r19` ใน localStorage และ `restore_transaction_journal_r19` ใน IndexedDB metadata; เก็บเฉพาะ stage, เวลาทำรายการ, backup ID, digest ของ Rollback Snapshot ไม่เก็บรายละเอียดผู้ป่วยหรือยาใน Journal
2. **Stages:** `snapshot-verified` → `database-initialized` → `indexeddb-committed` → `localstorage-committed` → `content-verified` → `receipt-verified` → `completed`; ตรวจอ่านกลับของ Journal ทุกขั้นที่บันทึก
3. **Interrupted Restore:** ถ้าพบ Journal ค้าง จะบล็อก Save / Clinical Write / Startup Current Write และ Restore ซ้ำ พร้อมแสดงแถบเตือนการตรวจข้อมูล
4. **Session Ownership:** ตรวจสิทธิ์ก่อนและหลังการเขียน localStorage แต่ละกลุ่ม หยุดเมื่อเสียสิทธิ์ และไม่ Rollback จากแท็บเก่า
5. **Supervised Review:** การปลดล็อกต้องเป็น Session ACTIVE, ผ่าน authorization, Snapshot digest ถูกต้อง, Journal สองแหล่งตรงกัน, Current Case ใน Storage ตรงกัน และผู้ดูแลพิมพ์ `REVIEW` เอง การกด Review **ไม่กู้คืนหรือรวมบันทึกการวางยาให้อัตโนมัติ**
6. **Fail-closed completion:** ถ้าแอปปิดขณะปิด Journal สถานะใน localStorage จะยังเป็น `running` จนกว่าการยืนยัน IndexedDB และลบ marker จะสำเร็จ

## วิธีเริ่ม
ใช้ `index.html` จากโฟลเดอร์นี้ หรือ deploy ไฟล์เว็บไซต์ไปพร้อมกันทั้งชุด (ห้ามผสมแคชเก่า) ทดสอบกับเคสจำลองบนโดเมนทดสอบก่อน อย่า Clear Site Data หรือถอน PWA ที่ยังมีข้อมูลเคสจริง

## QA
`node QA_R19_RUN_ALL.js` และ `node QA_R19_TRANSACTION_JOURNAL.js`; รายละเอียดใน `QA_R19_RESULTS.json` และ `R19_DEVICE_TEST_STEPS_TH.md`

## ยังไม่ยืนยัน
ยังไม่ผ่านการทดสอบ Browser E2E / Android / iPad บนอุปกรณ์จริง และ localStorage กับ IndexedDB ยังไม่ใช่ Atomic Transaction เดียวกัน ฟังก์ชัน Journal ไม่ได้ทำให้ Partial Restore กลับมาสมบูรณ์ได้เอง ต้องตรวจสอบข้อมูลและทำ Recovery ภายใต้การกำกับเมื่อสองแหล่งไม่ตรงกัน
