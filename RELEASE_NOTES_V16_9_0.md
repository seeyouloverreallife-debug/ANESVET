# ANESVET V16.9.0 — Procedure Templates

## Procedure Template picker
เพิ่ม Procedure Template ในหน้า **Patient & Case Setup** เพื่อให้เริ่มเคสได้เร็วขึ้นโดยไม่ต้องพิมพ์ชื่อ procedure และเลือก workflow profile ซ้ำทุกครั้ง

Template ที่มีในรุ่นนี้:
- OVH / OHE
- Castration
- Dental
- Mass removal
- Exploratory laparotomy
- Orthopedic
- C-section
- Emergency / critical
- Custom / other

เมื่อเลือก template ระบบจะ:
1. เติมชื่อ Procedure เริ่มต้นให้ (ยังแก้ข้อความเองได้)
2. ตั้ง OR workflow profile ที่สัมพันธ์กับ template
3. แสดง documentation path / จุดเน้นใน OR LIVE
4. freeze template + workflow profile เมื่อเริ่ม induction เพื่อไม่ให้ layout/flow เปลี่ยนระหว่างเคส

## Template behavior
- **Routine templates** ใช้แกน workflow เดิม: Induction → Airway → Surgery → Emergence → Recovery
- **C-section** เชื่อมกับ workflow เดิมที่มี First neonate / Last neonate timestamps
- **Emergency / critical** เชื่อมกับ Stabilization / Support documentation controls เดิม
- **Custom** เปิดให้ใช้ชื่อ procedure และ workflow profile ตามที่ผู้ใช้กำหนด

## Safety boundary
Procedure Templates เป็น **documentation/workflow preset only**
- ไม่เปลี่ยน dose calculation
- ไม่เลือกยาให้อัตโนมัติ
- ไม่เปลี่ยน alert thresholds
- ไม่เปลี่ยน fluid reference / treatment logic
- ไม่เปลี่ยน Pre-OR readiness gate
- ไม่เปลี่ยน Recovery criteria หรือ Final Lock
- Emergency template ไม่ติ๊ก ASA-E / Emergency flag ให้อัตโนมัติ

## Active-case freeze
เมื่อเริ่ม case:
- เก็บ `procedureTemplateSnapshot` พร้อม procedure, recommended workflow และ workflow ที่ใช้จริง
- UI template + workflow profile ถูก freeze ระหว่าง active case
- audit trail เพิ่ม `PROCEDURE_TEMPLATE_FROZEN`
- Undo ของ Start induction คืน snapshot เดิมด้วย

## Compatibility
- ไม่เปลี่ยน IndexedDB schema/version
- ไม่เปลี่ยน storage keys
- current/archived case เดิมยังเปิดได้
- เคสเก่าที่ไม่มี `procedureTemplateId` จะ infer จาก procedure/workflow เท่าที่ทำได้ และ fallback เป็น Custom
- Locked final record เดิมไม่ถูกเขียนทับจาก migration นี้

## UI
- เพิ่ม quick template buttons ที่ออกแบบสำหรับ phone/tablet
- Workflow profile เดิมยังอยู่เป็น **advanced override** ก่อนเริ่ม induction
- OR LIVE workflow badge/context แสดง procedure template ที่ใช้อยู่
- Case Summary แสดง Template แยกจาก Procedure
- คง V16.8.3 mobile dock geometry hotfix และ V16.8.4 medication queue semantics
