# วิธีทดสอบ V17.2.5 บน iPad / Android

1. อัปเดต GitHub Pages แล้วเปิดแอปจนหัวแอปขึ้น **V17.2.5**
2. ยังไม่ต้องสร้างเคสใหม่บน iPad ที่ไม่มี active case
3. ลองแตะ ASA I หรือ ASA II
4. ถ้าทำงาน: card ต้อง selected และค่า ASA เปลี่ยนตามปกติ
5. ถ้าไม่ทำงาน: รอประมาณครึ่งวินาที ระบบควรเปิดกล่อง **ANESVET V17.2.5 — ASA tap not handled**
6. กด **Tap test** ในกล่อง 2–3 ครั้ง แล้วกด **คัดลอก Diagnostic** หรือถ่าย screenshot ทั้งกล่องส่งกลับมา
7. ถ้า Diagnostic panel ขึ้นเองตั้งแต่เปิดแอป ให้ส่งข้อความ `stage`, `error`, `pointer/click`, `globals` ในกล่องมาเลย

อย่า Reset case / Clear App Data / ถอน PWA บนเครื่อง Android ที่มีเคสค้าง.
