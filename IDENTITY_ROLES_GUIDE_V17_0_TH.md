# คู่มือ Identity & Roles — ANESVET V17.0

## เป้าหมาย
V17.0 เพิ่มการระบุตัวผู้ใช้งานบน **อุปกรณ์เดียวกัน** ให้ชัดขึ้น เพื่อให้ ANESVET รู้ว่าใครเป็นผู้บันทึก ใครยืนยัน action สำคัญ และ action นั้นเกิดจาก session/device ใด

ระบบนี้ยังไม่ใช่บัญชีกลางของโรงพยาบาลและยังไม่ sync ผู้ใช้ข้ามอุปกรณ์

## Role ที่มี
- **Administrator** — จัดการ staff/security, Restore, Final Sign-off, Protocol Governance และงานทั่วไป
- **Veterinarian** — งาน clinical, medication documentation, Case Review, Backup export, Final Sign-off และ Protocol Governance
- **Nurse / Technician** — งาน clinical, medication documentation, Recovery, Case Review และ Backup export
- **Assistant** — general clinical/Recovery documentation แต่ไม่มีสิทธิ์ medication administration documentation, Case Review, Backup export, Restore, Final Sign-off หรือ Protocol Governance

Role เป็น access control ของโปรแกรมเท่านั้น ไม่ได้เป็นการรับรองใบอนุญาตหรือขอบเขตวิชาชีพ

## PIN และการเข้าสู่ระบบ
- PIN เป็นตัวเลข 6–12 หลัก
- โปรแกรมไม่เก็บ PIN ดิบ
- เก็บ salted PBKDF2-SHA256 hash
- ใส่ผิด 5 ครั้งมี delay ก่อนลองใหม่
- เมื่อเปิด Security แล้ว การเปิด/reload แอปจะเริ่มในสถานะ Locked
- สามารถ Switch User หรือ Lock ได้จาก identity/session control

## Staff Code
แต่ละ staff มี `staffCode` คงที่ เช่น `STF-xxxxxx` เพื่อช่วยแยกคนที่อาจมีชื่อคล้ายกัน

ไม่ควรเปลี่ยนชื่อคนเพื่อ reuse account ให้พนักงานคนอื่น ให้สร้าง staff profile ใหม่แทน เพื่อรักษาความหมายของ audit history

## Session / Device attribution
หลัง unlock จะมี local session ID และ device ID เช่น:

```text
Actor: Dr A
Staff Code: STF-000123
Session: session-…
Device: device-…
Auth: local-pin
```

ข้อมูลนี้ช่วย attribution แต่ไม่ใช่ digital signature หรือ PKI

## การบันทึกยา
ANESVET แยก 2 ความหมาย:

- `administeredBy` = บุคคลที่ระบุว่าเป็นผู้ให้ยาจริง
- `documentedBy` = ผู้ใช้ที่ login และเป็นคนกรอกข้อมูลลง ANESVET

ระบบจะไม่ถือว่าคนกรอกคือคนให้ยาโดยอัตโนมัติ

## Action ที่ต้องยืนยันสิทธิ์สูงขึ้น
- Final Sign-off → Admin/Vet + PIN re-auth
- Restore / Restore rollback → Admin + PIN re-auth
- Staff/Security management → Admin + PIN re-auth
- Protocol Governance → Admin/Vet authenticated actor

## Backup และบัญชีผู้ใช้
Full Backup ของ ANESVET เน้น clinical/data-resilience และ **ไม่รวม PIN hash หรือ local security registry**

ดังนั้นเมื่อย้ายไปเครื่องใหม่:
1. Restore clinical backup
2. ตั้ง Staff Identity/PIN บนอุปกรณ์ใหม่
3. ตรวจ role ก่อนเริ่มเคสจริง

## ก่อนใช้จริง
ควรทดสอบอย่างน้อย:
- user ทุกคน unlock ได้
- Switch User/Lock
- Assistant ถูก block จาก medication documentation
- Nurse/Vet บันทึกยาได้
- Admin-only Restore
- Final Sign-off re-auth
- background auto-lock
- force-close/reopen
- offline/online workflow
- Backup → Verify → Restore ใน test profile
