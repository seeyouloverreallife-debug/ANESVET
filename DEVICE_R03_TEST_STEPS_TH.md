# ทดสอบ R03 บน Android/iPad (ใช้เคสจำลองเท่านั้น)

1. อัปโหลดไฟล์ครบชุดใน root ของ GitHub Pages และตรวจแสดง **V17.2.7**.
2. สร้างเคสทดสอบบนอุปกรณ์สำรองที่ไม่มี active case จริง แล้วเลือก ASA II สังเกตว่าการ์ดมีขอบ selected และค่า ASA เปลี่ยน.
3. แตะ ASA II อีกครั้ง (ที่เลือกอยู่แล้ว): ไม่ควรมี error ถ้า click ส่งถึง handler.
4. ลอง ASA I → III และสลับกลับ; หากไม่มี click / UI ไม่เปลี่ยน ควรแสดง diagnostic. ให้กด **🔎** บนแถบบนหากแผงไม่ขึ้น.
5. กด **Tap test** 2 ครั้งเพื่อเช็คว่าพื้นที่ diagnostic รับ click แล้วคัดลอกข้อความ หรือถ่ายภาพแผง.
6. ส่งส่วน `interaction hint`, `ASA probe`, `ready`, `stages`, `error`, `session`, `dialogs`, `pointer`, `click` และแจ้งอุปกรณ์, browser/PWA, ว่ากด ASA ใหม่หรือเดิม. ตรวจข้อความก่อนส่งว่าปราศจากข้อมูลส่วนบุคคล.
7. ทดสอบปุ่ม Patient / Pre-check / Medications แยกจาก ASA; ถ้าผิดปกติส่งภาพ/ข้อความ diagnostic โดยไม่กด reset.

รหัส `CLICK_NOT_OBSERVED` = touch/pointer ถูกตรวจ แต่ click ไม่มาถึง capture; `CLICK_WITHOUT_ASA_UPDATE` = click มาถึงแต่ค่า/การเลือกไม่เปลี่ยน; `VALUE_UPDATED_UI_STALE` = ค่าเปลี่ยนแต่ card ไม่เลือก; `ASA_ALREADY_SELECTED` = กด card ที่เลือกแล้วและ click มาถึง.

**ห้ามถอน PWA, Clear Site Data, Reset, หรืออัปเดตแอปบนเครื่องที่มี active case ก่อน backup/export อย่างปลอดภัย.**
