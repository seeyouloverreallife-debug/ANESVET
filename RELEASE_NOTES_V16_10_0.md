# ANESVET V16.10.0 — Recovery Workflow Refinement

## เป้าหมายของรุ่นนี้
ลดความรกของหน้า Recovery หลังจาก V16.9.0 โดยไม่เปลี่ยน clinical readiness criteria, dose calculation, alert protocol หรือ data schema

## 1. Context-aware mobile Recovery dock
ปุ่มหลักด้านล่างเปลี่ยนตามสถานะจริงของ Recovery โดยยังคง 3 ปุ่มเท่านั้น:
- ยังไม่เริ่ม Recovery → **Begin recovery**
- เริ่มแล้วแต่ยังไม่มี / ถึงเวลาบันทึก vitals → **Record vitals**
- มี record ล่าสุดและยังมีงานค้าง → **Next task**
- readiness ครบ → **Complete recovery**

ปุ่มอีก 2 ตำแหน่งคงที่:
- **MEDS**
- **MORE**

ระหว่าง active Recovery บนมือถือ จะซ่อนปุ่ม duplicate ที่ทำหน้าที่ซ้ำกับ bottom dock เพื่อลด visual clutter

## 2. Extubation → Recovery transition strip
เพิ่มแถบสถานะใน Recovery cockpit เพื่อให้เห็นทันทีว่า:
- Extubation ถูกบันทึกเวลาใด
- Recovery เริ่มอัตโนมัติหลัง extubation หรือเริ่มแบบ manual
- Handoff snapshot ถูกสร้างแล้ว
- ถ้าเป็น non-intubated pathway สามารถใช้ extubation N/A ตาม workflow เดิม
- ถ้า Emergency return to OR ทำงานอยู่ จะเปลี่ยนเป็นสถานะเตือนชัดเจน

## 3. Compact Recovery Handoff
Recovery Handoff ถูกย่อเป็น quick summary 3 ส่วน:
- Airway / extubation
- Latest recovery state
- Transfer / unresolved problems + medication record count

รายละเอียดเต็ม เช่น medications, timeline, fluid/loss, optional handoff note และ snapshots ถูกย้ายเข้า **Full transfer details** ซึ่งปิดไว้เป็นค่าเริ่มต้น

ระบบยังสร้าง handoff อัตโนมัติจากข้อมูลในเคสเดิม จึงไม่เพิ่มการพิมพ์ซ้ำ

## 4. Mobile dock geometry hardening
เพิ่ม final CSS guard สำหรับ Recovery dock:
- left/right อยู่ใน viewport
- `transform: none`
- ไม่ใช้ `left:50% + translateX(-50%)` ใน computed mobile layout

เพื่อป้องกัน regression ของอาการ dock เลื่อนไปทางซ้าย

## Compatibility / safety boundary
- IndexedDB schema/version: unchanged
- localStorage keys: unchanged
- Recovery readiness criteria: unchanged
- Recovery score logic: unchanged
- Alert thresholds: unchanged
- Drug calculation / administration logic: unchanged
- Procedure Templates V16.9.0: retained
- Medication Queue V16.8.4: retained
- OR mobile dock hotfix: retained
