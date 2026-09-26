# ANESVET V15.24.0 — OR Vitals Fast Entry

## Goal
ลดจำนวนการแตะ/การพิมพ์ซ้ำในช่วง intraoperative vital recording โดยไม่ทำ silent carry-forward และไม่เปลี่ยน clinical thresholds, medication safety, reconciliation หรือ finalization logic

## Changes

### 1. Current vs Last saved on every core vital
OR LIVE แสดงสถานะเทียบ record ล่าสุดสำหรับ:
- HR
- MAP
- SpO₂
- ETCO₂
- RR
- Temperature

ตัวอย่าง: `Last 90 • Δ -5`, `Last 12 • same`, `Last 12 • blank`

Vital card ที่เปลี่ยนจาก record ล่าสุดจะมี visual emphasis และช่องที่ว่างทั้งที่ record ก่อนหน้ามีค่าจะถูกแสดงแยกต่างหาก

### 2. Vital change summary
ใต้ปุ่มบันทึกจะแสดงภาพรวม เช่น:
- `UNCHANGED FROM LAST`
- `2 changed • 4 unchanged`
- `2 changed • 1 blank`

ปุ่ม Save จะแสดง changed/blank state เมื่อ record ยังไม่ถึงกำหนด และยังคง DUE state เป็นลำดับสำคัญกว่าเมื่อถึงเวลาบันทึก

### 3. FILL BLANKS — no silent overwrite
เปลี่ยน action เดิมจาก `COPY LAST` เป็น `FILL BLANKS`

กติกา:
- เติมเฉพาะ core vital field ที่ว่าง
- ไม่ทับค่าที่ผู้ใช้พิมพ์/แก้ไว้แล้ว
- ไม่บันทึกอัตโนมัติ
- ผู้ใช้ยังต้องกด Save Vitals เอง

### 4. Keyboard fast-entry order
เมื่อใช้ keyboard และกด Enter ใน OR vital field ระบบจะเลื่อนไปตามลำดับ:
`HR → MAP → SpO₂ → ETCO₂ → RR → Temp → Save`

### 5. Mobile visual refinement
- เพิ่ม focus state ให้ input ที่กำลังกรอก
- delta/status text ถูกจัดให้คงอยู่ใน vital card โดยไม่เพิ่ม horizontal overflow
- maintenance panel ถูกลด visual weight เล็กน้อยระหว่าง intra-op

## Safety / unchanged behavior
- ไม่มีการ auto-save vital set
- ไม่มีการ auto-copy ค่าโดยไม่แสดงให้ผู้ใช้ทราบ
- Alert protocol และ threshold เดิมไม่เปลี่ยน
- Clinical validation module เดิมไม่เปลี่ยน
- Medication safety / reconciliation / finalization modules เดิมไม่เปลี่ยน
- Patient search + mobile focus fix จาก V15.23.1 คงอยู่

## Version/cache
- App version: `15.24.0`
- Service-worker cache: `anesvet-v15-24-0-or-vitals-fast-entry`
