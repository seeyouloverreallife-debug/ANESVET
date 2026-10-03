# ANESVET V17.12.1 — OR LIVE Interaction Polish

## เป้าหมาย
เก็บงานต่อจาก V17.12.0 โดยลดสิ่งที่ซ้ำและทำ Fluid / Vent / Airway ให้ใช้บนมือถือเร็วขึ้น โดยไม่เปลี่ยน clinical safety logic หลัก

## OR LIVE
- ตัดปุ่ม **Monitor** ออกจาก secondary navigation เพราะ monitoring อยู่ด้านบนถาวรแล้ว
- Secondary navigation เหลือ **Fluid / Vent / Airway / Meds**
- ทุกหน้ารองมีปุ่ม **← Monitor** เพื่อกลับมาหน้า monitoring ทันที

## Active Safety
- เมื่อไม่มี active problem / alert การ์ด Safety จะย่อเป็นแถบสั้น
- ถ้ามีปัญหาจริง Safety จะกลับมาแสดงรายละเอียดตามเดิม
- ไม่มีการเปลี่ยน threshold, alert logic หรือ problem state

## Fluid
หน้า Fluid เหลือสิ่งที่ใช้บ่อยก่อน:
- Current crystalloid rate
- Calculated crystalloid
- Fluid bolus
- Total fluid in
- Current rate

ส่วนที่ใช้ไม่บ่อยถูกย้ายเข้า **More**:
- Actual/corrected crystalloid
- Blood loss
- Urine
- Blood product
- Effective crystalloid / net estimate
- Rate history

ทุก control ยังเป็น field เดิมของเคส ไม่สร้าง state ซ้ำ

## Vent
- เปลี่ยน mode selector ให้เป็นปุ่มใหญ่ 3 ตัว: **Spontaneous / Manual PPV / Mechanical**
- RR / PIP / PEEP / VT ยังใช้ field เดิม
- select เดิมยังอยู่ใน DOM เป็น authoritative field แต่ไม่รบกวน UI

## Airway
- แสดง Intubation timestamp จาก milestone เดิม
- เพิ่ม **Attempts** และ **Airway note**
- Attempts / Note ถูกบันทึกใน current case, autosave และ final report
- Intubation ยังคงเป็น timestamp-only quick action

## Preserved
Induction given/details-pending, editable individual medication administration time, Calculated-as-Given, End Surgery, Emergency Return, Recovery, audit trail, Final Lock และ archive verification ยังอยู่เดิม
