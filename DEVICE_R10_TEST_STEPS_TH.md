# Device R10 — ทดสอบบน Android/iPad ด้วยข้อมูลจำลองเท่านั้น

**ก่อนทดสอบ:** คัดลอกข้อมูลสำรองของข้อมูลจริงไปเก็บอีกอุปกรณ์และตรวจว่าสามารถเปิดดูได้; ใช้ Test Origin / Profile แยกจากเครื่องใช้งานจริง ห้ามล้าง cache/site data ของการใช้งานจริง

1. เปิดแอปในสองแท็บ/หน้าต่างที่ใช้ origin เดียวกัน จาก test data สังเคราะห์ ให้แท็บ A ครอง session ACTIVE และแท็บ B อยู่ VIEW ONLY (เห็น Banner)
2. แท็บ B เปิดหน้า OR LIVE แล้วลองปุ่มใน Patient/Pre-op (ควรถูกบล็อกและมีคำอธิบาย VIEW ONLY)
3. บนแท็บ B เปิด Medication Dialog ที่เคยเปิดค้าง หรือเปิดก่อนเปลี่ยน ownership แล้วลอง `Save actual administered` และแก้ Route/Actual: **ต้องไม่บันทึก medication / save ข้ามไปจาก VIEW ONLY**
4. ลอง Alert Protocol/Dialog และ Problem Action: การกดบันทึกต้องไม่ทำงานใน VIEW ONLY
5. ทดสอบปุ่มปิด Dialog (X และ Close) รวมถึงเปลี่ยนหน้าจอผ่าน mobile workflow: ต้องทำงานได้
6. กด Take control บนแท็บ B อย่างตั้งใจ; ตรวจแท็บ A เป็น VIEW ONLY, B กลับแก้ไขได้ แล้วลองข้อมูลสังเคราะห์เท่านั้น
7. เปิด Diagnostic แล้วตรวจ event `session-view-only-blocked` และข้อความ VIEW ONLY; ต้องไม่มี patient name/medication values ใน stage detail
8. Reload, PWA reopen, หมุนหน้าจอ; ตรวจ data สังเคราะห์และ Safety Gate, ไม่มีเคสสูญหาย; หากไม่ผ่าน ให้คงรุ่นใช้งานจริงไว้และเก็บผล Diagnostic

**เกณฑ์ยังไม่ผ่าน:** หากบันทึกยา/ข้อมูลขณะ VIEW ONLY ได้, app ค้าง, session สลับเจ้าของโดยไม่ตั้งใจ หรือข้อมูลหาย ต้องหยุดการปล่อยใช้งานจริงและส่ง Diagnostic เพื่อแก้ในรอบถัดไป
