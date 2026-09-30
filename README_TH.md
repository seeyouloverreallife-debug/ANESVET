# ANESVET V17.2.5 — Boot / Runtime Diagnostic Rescue

รุ่นวินิจฉัยและกู้ interaction สำหรับกรณีที่ native text fields พิมพ์ได้ แต่ปุ่ม/ASA/navigation ไม่ตอบสนองบน Android/iPad.

## เป้าหมาย
- ไม่เดาสาเหตุจาก overlay/session อีกต่อไป
- ตรวจว่าการ boot ของ `app.js` ไปถึงขั้น bind Patient/ASA หรือไม่
- แสดง startup/runtime error บนอุปกรณ์จริงโดยไม่ต้องเปิด DevTools
- ตรวจ raw pointer/touch/click ที่ตำแหน่ง ASA เพื่อแยก event interception ออกจาก handler ที่ไม่ถูก bind
- ไม่แก้ clinical data semantics และไม่สร้าง fallback ที่เขียนข้อมูลเมื่อ core app boot ไม่สมบูรณ์

หากแอป boot ไม่ถึง `patient-master-bound` ภายใน 3.5 วินาที จะมี Diagnostic panel ขึ้นอัตโนมัติ. หากแตะ ASA แล้วค่าไม่เปลี่ยน panel จะขึ้น `ASA tap not handled` พร้อม target/stage/error.
