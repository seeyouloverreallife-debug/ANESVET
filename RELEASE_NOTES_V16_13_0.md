# ANESVET V16.13.0 — Procedure Templates 2.0

## เป้าหมายของรุ่นนี้
ต่อยอด Procedure Templates จาก V16.9 ให้เป็น **hospital-defined documentation/workflow presets** ที่โรงพยาบาลสร้างและแก้ไขเองได้ โดยยังคงหลักสำคัญว่า template เป็นตัวช่วยจัด workflow และ documentation เท่านั้น ไม่ใช่ระบบสั่งยา/รักษาอัตโนมัติ

## 1. Hospital Procedure Template Library
หน้า Patient & Case Setup เพิ่ม **Hospital templates** และ **New template**

Template ของโรงพยาบาลกำหนดได้:
- ชื่อ / badge / default procedure
- workflow profile: routine / critical / c-section / custom
- documentation/charting reminder interval
- procedure focus
- extra procedure milestones
- quick events
- medication shortcuts
- fluid/setup note
- procedure note
- template note

Built-in templates 9 แบบเดิมยังคงเป็น read-only และไม่ถูกเขียนทับโดย hospital template

## 2. Freeze template ตอนเริ่มเคส
เมื่อเริ่มเคส ระบบ freeze template snapshot ลงใน case state (snapshot schema 2) รวมถึง:
- workflow profile
- milestones / extra milestones
- quick events
- medication shortcuts
- charting reminder interval
- fluid/setup note
- procedure note

ดังนั้นการแก้หรือลบ template ใน library ภายหลังจะไม่เปลี่ยน snapshot ของ active/archived case ที่ถูก freeze แล้ว

## 3. OR LIVE — Template Quick Documentation
Hospital template สามารถเพิ่ม shortcut ใน OR LIVE:
- **Milestone** → ผู้ใช้กดเพื่อ timestamp เหตุการณ์
- **Quick event** → ผู้ใช้กดเพื่อสร้าง event ที่กำหนดไว้
- **Medication shortcut** → เปิด Medication workspace เดิมเพื่อให้ผู้ใช้ review และยืนยัน actual administration

Medication shortcut **ไม่ mark GIVEN**, ไม่เติม actual amount และไม่บันทึก administration เอง

## 4. Documentation reminder interval
Hospital template สามารถตั้ง interval เพื่อเติมค่า `recordInterval` ก่อนเริ่มเคสได้

ค่าดังกล่าวเป็น **documentation/charting reminder** เท่านั้น ไม่ใช่คำแนะนำว่าผู้ป่วยทุกตัวควรถูก monitor ตามความถี่นั้น และผู้ใช้ยังแก้ได้ก่อนเริ่มเคส

## 5. Context notes ใน OR LIVE
ระหว่าง active case ระบบแสดง context ที่ freeze มาจาก template เช่น:
- documentation reminder
- fluid/setup note
- procedure note

Fluid/setup note เป็นข้อความเตือนเท่านั้น ไม่มี automatic fluid rate หรือ calculation ใหม่

## 6. Export / Import / Full Backup
เพิ่ม:
- Export hospital template library เป็น JSON
- Import library แบบ merge
- Full Backup ของ ANESVET รวม hospital procedure template library
- Restore จาก backup V16.13 สามารถคืน template library ได้

Backup รุ่นเก่าที่ไม่มี `procedureTemplates` จะไม่สั่งลบ template library ปัจจุบันโดยอัตโนมัติ

## 7. Safety boundary
V16.13.0 ไม่เปลี่ยน:
- dose calculation
- medication confirmation flow
- alert thresholds
- Recovery criteria
- Documentation Guardian semantics
- Final Lock semantics
- IndexedDB schema/version

เพิ่ม localStorage key ใหม่เฉพาะ template library:
`anesvet_v16_procedure_template_library`

## 8. Compatibility
V16.12.0 data ใช้ต่อได้โดยไม่ต้อง IndexedDB migration

Hospital template library เป็น optional; หากไม่มีข้อมูล ระบบใช้ built-in templates เดิมได้ตามปกติ
