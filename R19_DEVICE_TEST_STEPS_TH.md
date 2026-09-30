# ขั้นตอนทดสอบ R19 บน Android / iPad (ใช้เคสจำลองเท่านั้น)

1. สำรองข้อมูลเดิมออกนอกอุปกรณ์ก่อน และใช้ PWA/Browser บนโดเมนทดลอง ไม่ทดสอบกับเคสผู้ป่วยจริง
2. กรอก Patient, Pre-op, Drug Calculator, OR LIVE ด้วยข้อมูลจำลอง แล้ว Save, Reload ตรวจว่ารายการยาและ Vital Signs เท่าเดิม
3. เปิดแอปสองแท็บ: ให้แท็บ B Take control ระหว่าง Restore (ทดสอบบนสภาพแวดล้อมที่สามารถแทรกขั้นตอน/ใช้ QA harness ได้) ตรวจว่าแท็บ A หยุดและไม่มี Automatic Rollback
4. จำลองปิดแอป/Reload หลัง IndexedDB commit ก่อน localStorage commit แล้วตรวจแถบ Restore Interruption และ Journal stage; อย่าปิดด้วยการล้าง Site Data
5. ตรวจว่ากด Save, แก้บันทึก Clinical, หรือ Restore ซ้ำไม่ได้ขณะ Journal ค้าง แต่ยังสามารถตรวจข้อมูล/สำรองหลักฐานได้
6. ถ้า Snapshot หรือ Current Case สองแหล่งไม่ตรง ห้ามกด REVIEW ผ่าน ให้ผู้ดูแลวิเคราะห์และกู้คืนข้อมูลก่อน
7. หากทั้งสองแหล่งตรวจตรงและมี Snapshot ที่ยืนยันได้ ผู้ดูแล ACTIVE ตรวจการสำรอง/ข้อมูลก่อนพิมพ์ `REVIEW` แล้ว Reload ใหม่; ตรวจอีกครั้งว่าเคสตรงตามต้นฉบับ
8. ทดสอบการ Restore ปกติสำเร็จว่าลบ sentinel แต่ยังเก็บ Journal สถานะ `completed` ใน IndexedDB สำหรับตรวจสอบย้อนหลัง
9. บันทึกผล Pass/Fail ของ Chrome Android / Safari iPad, เวอร์ชัน OS, PWA หรือ Browser tab, Startup status, จำนวนรายการ Vital Signs และ Drug Administrations

**หมายเหตุ:** ไม่มีการทดสอบอุปกรณ์จริงใน Checkpoint นี้ R19 ไม่ใช่การรับรอง clinical production readiness และ Transaction Journal ไม่ได้ทำให้ localStorage/IndexedDB เป็น Atomic Transaction เดียวกัน
