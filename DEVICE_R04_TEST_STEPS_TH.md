# ANESVET V17.2.8 — ทดสอบบนมือถือ / iPad

1. **สำรอง/Export Active Case บนเครื่องหลักก่อนอัปเดตใด ๆ**; ใช้เครื่องสำรองหรือเคสทดสอบที่ไม่มีข้อมูลคนไข้จริง.
2. อัปโหลด content ภายใน folder ZIP ไปยัง GitHub Pages root (`index.html` ต้องอยู่ root). เปิดใหม่และตรวจแสดง `ANESVET V17.2.8`.
3. ทดสอบเลือก ASA I → III → II: ค่า ASA, เส้นขอบ selected และป้าย `NOT SAVED` ต้องอัปเดตทันที. ทดสอบกด ASA II ซ้ำ: ไม่ควรแสดง false alarm.
4. ทดสอบกรอกชื่อ/น้ำหนักบนเคสทดสอบ แล้วกด Patient / Pre-check / Medication / OR LIVE; ดูว่าการนำทางเปลี่ยนหน้าจริง และปุ่มตอบสนอง.
5. ถ้าปุ่มไม่ตอบสนอง กด 🔎 เพื่อเปิด Diagnostic → แตะ Tap test → คัดลอกข้อมูลหรือถ่ายภาพ. เก็บ `interaction hint`, `ASA probe`, `stages`, `ready`, `lastError`, `session`, `dialogs`, `pointer/click`.
6. แจ้ง device, Android/iPad version, browser หรือ PWA และว่ามี VIEW ONLY banner หรือไม่; ลบข้อมูลผู้ป่วยออกก่อนแชร์.

**อย่าล้างข้อมูลเว็บไซต์, ถอน PWA, รีเซ็ต หรือบังคับ takeover session เพื่อแก้ปัญหาการแตะโดยไม่มีการสำรองข้อมูล**.
