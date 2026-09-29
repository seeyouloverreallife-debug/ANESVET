# ANESVET V16.12.0 — Documentation Guardian

## เป้าหมายของรุ่นนี้
เพิ่มชั้นช่วยตรวจ **ช่องว่างของการบันทึกเวชระเบียนที่น่าจะต้องทบทวน** ระหว่าง OR, Recovery และก่อน End Case โดยอาศัยข้อมูลที่มีอยู่ใน ANESVET เท่านั้น

Documentation Guardian เป็น **documentation aid** ไม่ใช่ระบบสรุปว่าการดูแลทางคลินิกเกิดขึ้นหรือไม่ และไม่สร้าง/แก้ clinical record แทนผู้ใช้

## 1. OR Documentation Guardian
ใน OR LIVE ระบบตรวจสถานะปัจจุบันและแสดงเฉพาะรายการที่ควรกลับไปทบทวน เช่น:
- ถึง/เลยเวลาบันทึก anesthesia vitals ตาม monitoring interval ที่ตั้งไว้
- มี timestamp `Intubation` แต่ยังไม่มี structured airway details
- planned medication ของช่วงปัจจุบันยังไม่มี matching actual administration record

ปุ่มของ Guardian จะพาไป workflow เดิม เช่น Enter vitals, Open airway record หรือ Review medication

### Medication wording
หาก planned medication ยังไม่มี matching actual record ระบบใช้คำว่า **needs review / record needs review** เท่านั้น

สิ่งนี้ **ไม่ได้หมายความว่ายาไม่ได้ถูกให้** และระบบจะไม่เปลี่ยนสถานะยาเป็น GIVEN หรือ Not given เอง

## 2. Recovery Documentation Guardian
ระหว่าง Recovery ระบบช่วยทบทวน:
- first recovery vital set / recovery vitals ที่เลยช่วงเวลาที่กำหนด
- extubation status ที่ยังไม่ได้บันทึก
- planned medication ที่ยังต้อง reconcile
- alert/problem ที่ยัง active

รายการเหล่านี้เป็น record reminders และไม่เปลี่ยน Recovery readiness criteria เดิม

## 3. End Case — Clinical Record Completeness
เพิ่ม summary 6 domains ก่อนปิดเคส:
1. Airway
2. Monitoring
3. Medications
4. Problems
5. Recovery
6. Sign-off

แต่ละ domain แสดงสถานะจากข้อมูลที่มีอยู่ เพื่อช่วยให้เห็นจุดที่ยังต้อง review ก่อน Final Lock

Guardian **ไม่เพิ่ม hard-block rule ใหม่** ให้ End Case; validation/final-lock rules เดิมของ ANESVET ยังเป็น source of truth

## 4. Review actions ใช้ workflow เดิม
Guardian ไม่สร้าง form คู่ขนานและไม่บันทึกข้อมูลแทนผู้ใช้:
- OR vitals → focus Fast Vital Entry เดิม
- Recovery vitals → focus Recovery observation/vital workspace เดิม
- Airway → เปิด Airway details เดิม
- Medication → เปิด Quick Drug / Medication Reconciliation เดิม
- Problems → ไป Active Alert/Problem workflow เดิม
- Recovery / Sign-off → ไป section เดิมของ ANESVET

## 5. Safety boundary
V16.12.0 **ไม่ทำสิ่งต่อไปนี้**:
- ไม่ auto-mark medication เป็น GIVEN
- ไม่ auto-mark Not given / N/A
- ไม่สร้าง vital record อัตโนมัติ
- ไม่สร้าง airway/event record อัตโนมัติ
- ไม่อนุมานว่าการรักษาไม่ได้เกิดขึ้นเพียงเพราะไม่มี documentation
- ไม่เปลี่ยน dose calculation
- ไม่เปลี่ยน alert thresholds
- ไม่เปลี่ยน Recovery readiness / scoring logic
- ไม่เปลี่ยน Final Lock semantics
- ไม่เปลี่ยน IndexedDB schema/version หรือ storage keys

## 6. Compatibility
ข้อมูลจาก V16.11.0 ใช้ต่อได้โดยไม่ต้อง data migration

เพิ่มเฉพาะ UI/module แบบ state-derived และ cache version ของ PWA เป็น V16.12.0
