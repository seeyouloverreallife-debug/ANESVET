# R16 — ทดสอบ Android/iPad ด้วยเคสจำลอง

> อย่าทดสอบกับ Active Case จริง และอย่าถอนแอป/ล้างแคชหรือข้อมูลก่อนสำรองข้อมูล

1. เปิด V17.2.20 ตรวจหมายเลขเวอร์ชัน หลัง Update ให้รีโหลดหน้าเมื่อไม่มีเคสกำลังบันทึก
2. สร้างและ Save **เคสจำลอง A** จด Patient, BW, Drug administrations และ Vital signs
3. สร้าง/เลือก **Working Copy จำลอง B** ใน Cases / Archive และกด Load working copy > Confirm
4. ต้องขึ้นเคส B หลังกลับไปหน้าหลัก และหลัง Reload ยังคงเป็น B (ไม่กลับ A)
5. เปิดอีกแท็บด้วยข้อมูลชุดเดียวกัน ให้แท็บที่ทดสอบเป็น **VIEW ONLY** > ลอง Load working copy B; ต้องแจ้ง Save blocked และไม่เปลี่ยนเคสในแท็บนั้น
6. ให้แท็บที่ทดสอบเป็น ACTIVE แต่แท็บอื่นบันทึก Current Case รุ่นใหม่ > ลอง Load; ต้องถูก freshness guard ปฏิเสธ
7. เคส LOCKED FINAL ต้องไม่มีการโหลดเป็น Working Copy แบบแก้ไขได้
8. ตรวจ Backup/Restore แยกต่างหาก: R16 ยังไม่ได้ยืนยันขั้นตอน restore ชุดข้อมูลทั้งหมด

บันทึก Device, OS, Browser, version, ชื่อเคสจำลอง, ผล Pass/Fail และภาพ Diagnostic หากเกิดข้อผิดพลาด
