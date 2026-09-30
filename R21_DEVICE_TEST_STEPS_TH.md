# R21 — Android / iPad Acceptance Checklist (เคสจำลองเท่านั้น)

## ก่อนทดสอบ
- หลีกเลี่ยงการใช้กับผู้ป่วยจริงจนกว่า Startup/Navigation/Save checks จะผ่านบนอุปกรณ์จริง.
- หากมีเคสที่ต้องเก็บรักษา อย่าถอน PWA, ล้าง Chrome Site Data, หรือ Reset browser profile. สำรองก่อนทุกครั้ง.
- ตรวจว่า GitHub Pages deploy V17.2.25 ครบ 6 ไฟล์ และไม่ถูก cache เก่าขัดขวาง.

## Smoke Test
1. เปิดแอป คัดลอก Device Diagnostic; ส่วนหัวต้องขึ้น `ANESVET 17.2.25 DEVICE DIAGNOSTIC`.
2. ต้องมี `ready: true` และ stage `startup-complete` (ไม่ใช่ startup-incomplete-watchdog).
3. ไม่พบ `closeRecoveryMoreDialog is not defined`, `recoveryTransferLatest is not defined`, `closeOrMoreDialog is not defined` หรือข้อผิดพลาดอื่น.
4. ใช้เคสจำลอง: เลือก ASA I–V แล้วค่าและกรอบต้องตรงกัน.
5. ไป Patient → Pre-op → Medications → (เมื่อผ่าน readiness gate จึงไป) OR LIVE → Recovery. ระบบต้องทำงานตาม gate เดิม ไม่ bypass.
6. เปิดและปิด OR More / Recovery More; ปุ่ม Report Issue ไม่ค้างหลังปิด More Dialog.
7. บันทึก Recovery Transfer ในเคสจำลองแล้วเปิด Case Summary; แสดง transfer ล่าสุดถูกต้อง.
8. Reload แสดงเคสล่าสุดตรงกับที่บันทึก; ไม่เกิดข้อมูลยาหรือ Vital Signs ซ้ำ/หาย.

## ถ้าไม่ผ่าน
บันทึก Diagnostic ทั้งหมด (ลบชื่อผู้ป่วยจริงและ PHI ก่อนส่ง), สถานะ `ready`, `stage`, `navigation`, `error`, รุ่นที่แสดง, ขั้นตอนที่ทำให้เกิดปัญหา และอุปกรณ์/browser รุ่น.
อย่า Clear site data เพื่อแก้ปัญหา boot โดยไม่สำรองข้อมูล.
