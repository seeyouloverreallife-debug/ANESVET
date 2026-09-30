# ANESVET V17.2.20 — Checkpoint R16 (Working Copy Commit Guard)

## ใช้ต่อจาก
V17.2.19 / R15 โดยตรง — ไฟล์ใน ZIP นี้รวม source เดิมไว้ครบ ไม่ต้องนำแพตช์ไปทับด้วยตัวเอง

## ขอบเขตแก้ไข
- เมื่อกด **Load working copy** จาก Cases / Archive ระบบจะ persist Current Case และตรวจผล **ก่อน** แทนที่ state ในหน่วยความจำหรือสั่งเปิดหน้าแอปใหม่
- หากเป็น VIEW ONLY, ขาดสิทธิ์ Session, ข้อมูล Current Case ไม่ตรงกับรุ่นล่าสุด, Storage เต็ม หรือไม่สามารถยืนยันการเขียนได้: ไม่เปลี่ยนเคส ไม่สั่ง Reload และแจ้งข้อผิดพลาด
- ลบการเรียก queueCurrentMirror ซ้ำในทาง Load working copy; persistence bridge จะ queue ข้อมูลเฉพาะหลัง Save สำเร็จ
- ไม่เปลี่ยนตรรกะยา Vital signs หรือ Final Locked Record

## วิธีทดสอบ
1. สำรองข้อมูลจากเครื่องที่ใช้จริงก่อนทุกครั้ง อย่าล้าง app data หรือ Browser Storage
2. ทดสอบด้วยเคสจำลองบนอุปกรณ์สำรอง: Save current case > ไป Cases / Archive > เลือก Working Copy ที่ไม่ล็อก > Load > ยืนยัน > Reload > ตรวจชื่อเคส/บันทึกยา/สัญญาณชีพ
3. เปิดสองแท็บและให้แท็บหนึ่งเป็น VIEW ONLY; ตรวจว่าปุ่ม Load ในแท็บ VIEW ONLY แจ้งเตือนและ **ไม่เปลี่ยนเคส**
4. ทดลองเรียก Load สำหรับ Locked Final Record; ต้องปฏิเสธ
5. หากทดสอบ Storage failure ให้ใช้เครื่องทดสอบที่ไม่มีข้อมูลทางคลินิกจริงเท่านั้น

## ผล QA
ดู QA_R16_RESULTS.json; เรียก `node RUN_R16_QA.js` ในโฟลเดอร์นี้

## ยังไม่ผ่านการตรวจยืนยัน
- Browser E2E บน Chrome/Safari จริง และ Android/iPad จริง
- ขั้นตอน Backup Restore ทั้งชุด, Integrity ของ fallback archive และ transaction ข้าม LocalStorage/IndexedDB: ยังไม่แก้ใน R16

R17 ควรแยกตรวจ Backup Restore preflight, snapshot/rollback และ post-restore verification แบบ isolated tests
