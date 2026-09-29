# Known limitations — V16.14.0

1. Follow-up measurement ของ alert ถูกจับคู่ตามเวลา: ค่าครั้งแรกที่บันทึกหลัง intervention ไม่ได้หมายความว่า intervention นั้นเป็นสาเหตุของการเปลี่ยนแปลง
2. Structured complication ที่ไม่มี metric เฉพาะจะไม่ถูกระบบตัดสินว่า improved/worsened; แสดงเฉพาะ snapshot และข้อความที่ผู้ใช้บันทึก
3. Episode เก่าที่ไม่มี timestamps/structured responses ครบ อาจแสดงข้อมูล chain ได้ไม่ครบ
4. Review layer ไม่ใช่ validated outcome score และไม่ควรใช้แทน clinical assessment
5. Browser interaction smoke test ไม่สามารถรันใน execution sandbox รอบนี้ได้ เพราะ Chromium navigation ถูก environment policy block; static/unit QA ผ่าน และควรทดสอบบน Android/PWA จริงก่อน deploy production
