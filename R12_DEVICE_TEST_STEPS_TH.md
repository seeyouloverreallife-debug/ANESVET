# R12 — ทดสอบบน Android/iPad แบบเคสจำลองเท่านั้น

1. สำรองข้อมูลและใช้เคสทดลอง; บันทึกจำนวน Vital Records และ Medication administrations เป็นค่าตั้งต้น
2. เปิด ANESVET บน 2 แท็บใน Browser/อุปกรณ์ที่แชร์ origin และ localStorage เดียวกัน; ให้ Tab A เป็น ACTIVE, Tab B เป็น VIEW ONLY
3. จำลองการพัก Tab A โดยสลับแอป/ปิดจอ (ไม่ต้องปิดแท็บ); ใน Tab B กด **Take control** และตรวจว่าทำงาน ACTIVE
4. กลับเข้า Tab A: ต้องขึ้น VIEW ONLY และไม่สามารถ Save Medication/Vital หรือเปลี่ยนข้อมูลผ่าน Dialog ได้; Tab B ต้องยังเป็น ACTIVE
5. เพิ่ม Vital/Medication ใน Tab B, Save, แล้วรอตรวจว่าจำนวน Records, IDs, Dose, Time และ Medication จริงอยู่ครบ
6. Reload Tab A แล้วตรวจ Active Case, Patient, Vital counts, Medication counts และ Recovery phase จากข้อมูลที่บันทึกจริง; อย่าให้ข้อมูลจาก Tab A เขียนทับ Tab B
7. ทดสอบแท็บเดียว: เริ่ม Case, สร้าง Vital และ Medication จำลอง, ซ่อนแอป/กลับมา; จับเวลา elapsed ว่ายังคงเดินต่อ และ records ไม่เพิ่มซ้ำ
8. Test Pause/Resume, Recovery และกลับ OR LIVE ด้วยเคสทดลอง ตรวจค่าเชิงตัวเลขและเวลาอย่างละเอียด
9. ทดสอบโหมด offline เพื่อดูว่า local save ไม่หาย แล้วเปิดใหม่ตรวจเลขรายการ/เวลาเทียบก่อนปิด

**เกณฑ์หยุดทดสอบ:** พบ Record/Medication หายหรือเพิ่มซ้ำ, VIEW ONLY ยังบันทึกได้, Session Lock เปลี่ยนกลับเอง, ข้อมูลเกิด mixed-case, หรือ Storage บันทึกไม่สำเร็จ: หยุดและส่ง Diagnostic ให้ผู้พัฒนา อย่ารีเซ็ตข้อมูล.

**หมายเหตุ:** ปุ่ม Take control เป็นการแย่งสิทธิ์โดยเจตนา; ถ้าแท็บอื่นกำลังใช้งานอยู่จริงต้องตกลงผู้รับผิดชอบก่อน และ Refresh ข้อมูลเคสให้ทันสมัยก่อนลงบันทึกต่อ
