# R15 — ขั้นตอนทดสอบบน Android/iPad (เคสจำลองเท่านั้น)

**อุปกรณ์ทดสอบแยกจาก Production** พร้อม Backup ที่นำกลับมาเปิดได้ ห้ามทำลายข้อมูลผู้ป่วยจริง

1. เปิดแอป V17.2.19 บน Chrome Android หรือ Safari iPad ในโปรไฟล์ทดสอบ; ตรวจว่า Version ตรงและไม่ได้โหลด Cache เก่า
2. สร้างเคสจำลอง A → กรอก Drug 1 รายการ + Vital 1 รายการ → Save → Reload นับรายการว่ามีเท่าเดิมไม่ซ้ำ
3. เปิดแท็บ B ใน VIEW ONLY ระหว่างแท็บ A เป็น ACTIVE → แก้เคส A แล้ว Save; B ต้องไม่เขียน Mirror หรือ Current Case เก่ากลับ
4. กลับจาก Sleep Mode ของแท็บ B แล้วทดลอง Take control เฉพาะกรณีจำลอง; ถ้าข้อมูล stale ต้องขึ้นเตือนและปฏิเสธการ Save
5. ทดสอบการพิมพ์ลงฟอร์มแต่ยังไม่ถึงรอบ Save: IndexedDB Mirror ต้องไม่รับข้อมูล Uncommitted จาก state
6. ทดสอบ Current Case JSON ผิดรูปแบบเฉพาะโปรไฟล์ทดสอบ (แนะนำสร้าง LocalStorage จำลองใน DevTools): ต้องแสดงคำเตือน ห้าม Save ทับและไม่ Auto-Restore โดยไม่มีการยืนยันข้อมูลสำรอง
7. ทดสอบนำเข้าจาก Archived Case เป็น working copy → ถ้า Storage เขียนไม่ได้ ต้องไม่ขึ้นผลว่า Save สำเร็จ
8. Reload เคส OR LIVE และ Recovery แยกกันหลัง Sleep; Drug, Vital และ Phase ต้องตรงกับ Saved source
9. ทดสอบ Safari/Chrome ทั้งแนวตั้งและแนวนอน และเก็บ Diagnostic หากพบข้อผิดพลาด

**สถานะ:** ยังไม่ได้ทดสอบเหล่านี้บนอุปกรณ์จริงในรอบ R15
