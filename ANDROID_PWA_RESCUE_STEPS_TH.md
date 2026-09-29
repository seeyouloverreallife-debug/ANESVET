# ขั้นตอนกู้ PWA บนมือถือ — V17.2.2

ใช้กรณีเครื่องยังค้างอยู่ที่ V17.1/V17.2.1 และมี current case ที่ยังทำไม่เสร็จ

1. **ห้ามกด Reset current case**
2. **ห้าม Clear storage / Clear site data / ถอนการติดตั้ง ANESVET**
3. อัปโหลด/Deploy ไฟล์ V17.2.2 ขึ้นตำแหน่งเดิมของ GitHub Pages
4. ปิด ANESVET จาก Recent apps ให้หมด แล้วเปิดใหม่
5. ถ้ายังเห็นเวอร์ชันเก่า ให้ปิดอีกครั้ง แล้วเปิด URL ของ ANESVET ใน Chrome หนึ่งครั้งเพื่อกระตุ้น service-worker update จากนั้นกลับมาเปิด PWA
6. ตรวจว่าหัวแอปแสดง `V17.2.2`
7. current case ที่เริ่ม anesthesia แล้วควรกลับเข้า **OR LIVE** โดยตรง
8. ตรวจชื่อผู้ป่วย เวลาเคส, vitals/events และรายการยาที่บันทึกไว้ก่อนทำต่อ

V17.2.2 ไม่ต้องล้างข้อมูลเดิมเพื่ออัปเดต และ rescue service worker ถูกออกแบบให้หลุดจาก waiting-update state ของรุ่นเก่า
