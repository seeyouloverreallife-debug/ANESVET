# ANESVET V17.11.4 — OR LIVE Mobile Compact Strip / Simple Gas Controls

## สิ่งที่ปรับตาม feedback รอบล่าสุด

### 1) แถบข้อมูลผู้ป่วยด้านบนย่อให้สั้นลง
จากเดิมเป็นการ์ดใหญ่หลายบรรทัด เปลี่ยนเป็นแถบสรุปสั้น ๆ สำหรับใช้งานมือถือ:
- BW
- ASA
- Procedure
- Allergy (ถ้ามี)
- Risk (ถ้ามี)

ยังคงใช้ข้อมูลเดิมของเคสเป็นแหล่งจริง (authoritative source) ไม่สร้าง state ซ้ำ.

### 2) ย้ายแถบบันทึก Vital signs ขึ้นด้านบน
`Record vital signs` ถูกวางไว้ใต้แถบสรุปผู้ป่วยทันที เพื่อให้เข้าถึงเร็วขึ้นใน OR LIVE บนมือถือ.

### 3) ปรับแถบยาสลบ (Vaporizer) เป็นแบบแตะเลือกง่าย
ยกเลิกสไลด์/knob แบบเดิมใน workspace monitor แล้วเปลี่ยนเป็น quick chips แบบเลื่อนด้านข้าง:
- 5
- 4.5
- 4
- 3.5
- 3
- 2.5
- 2
- 1.5
- 1
- 0.5
- 0 (OFF)

ทุกการแตะยังเขียนกลับไปยัง field เดิมของเคสทันที.

### 4) Oxygen flow ทำเป็นแบบ simple
ลดความซับซ้อนจาก slider เดิมเป็น quick chips แบบง่าย:
- 3
- 2.5
- 2
- 1.5
- 1
- 0.5
- 0

เหมาะกับการแตะบนมือถือมากกว่า slider เดิม.

## สิ่งที่ยังคงเดิม
- OR LIVE workspace structure
- Induction quick workflow
- Intubation / Surgery / Recovery flow
- Clinical state / saved case data / medication state
- Recovery handoff / Bug Center fixes จาก V17.11.3

## หมายเหตุ
รีลีสนี้เน้น “mobile OR usability” เป็นหลัก โดยยังไม่เปลี่ยน clinical logic หลักของเคส.
