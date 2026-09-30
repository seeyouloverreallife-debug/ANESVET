# วิธีทดสอบ V17.2.3 บนมือถือเครื่องที่เคสค้าง

1. อัปโหลดไฟล์ V17.2.3 ขึ้นตำแหน่ง GitHub Pages เดิม โดย **ไม่ Clear App Data และไม่ถอน PWA**
2. ปิด ANESVET ออกจาก Recent Apps แล้วเปิดใหม่
3. ตรวจเลขเวอร์ชันด้านบน ต้องเป็น `V17.2.3`
4. ถ้าเคสเดิมเริ่มไปแล้ว แอปควรเปิดกลับเข้า OR LIVE อัตโนมัติ แม้ Patient Setup จะขึ้น `NOT SAVED`
5. ถ้ายังอยู่หน้า Patient ให้กดปุ่มลอย `กลับ OR LIVE` หนึ่งครั้ง
6. ถ้า Identity ถูกล็อกจริง ให้ Unlock PIN ก่อน แล้วกด `กลับ OR LIVE` อีกครั้ง
7. เมื่อเข้า OR LIVE ได้แล้ว ให้ตรวจ Patient/BW/ยา/เวลา/record เดิมก่อนบันทึกข้อมูลใหม่

## ห้ามทำระหว่างกู้เคส
- ห้าม Reset current case
- ห้าม Clear storage / Clear site data
- ห้ามถอนการติดตั้ง PWA ก่อนยืนยันว่าเคสกู้กลับมาแล้ว

## สิ่งที่ควรสังเกต
ถ้าก่อนอัปเดตหัวเคสขึ้น `SETUP` ทั้งที่มี case clock อยู่ V17.2.3 ควรเปลี่ยน runtime phase เป็น `INTRAOP` และพากลับ clinical workspace โดยไม่ตั้ง `patientSaved=true` ให้เอง
