# ANESVET V16.11.0 — OR LIVE Speed & Android/PWA Hardening

## เป้าหมายของรุ่นนี้
ทำให้การบันทึกระหว่าง OR LIVE บนมือถือเร็วขึ้นและลดปัญหาจาก soft keyboard, safe area, orientation และการสลับแอป โดยไม่เปลี่ยน clinical calculations หรือ record semantics เดิม

## 1. Fast Vital Entry บนมือถือ
เมื่อ focus ช่อง OR vital ระบบจะแสดง fast-entry rail ด้านล่างเหนือ keyboard โดยเรียงลำดับ:

`HR → MAP → SpO₂ → ETCO₂ → RR → Temp`

การใช้งานด้วย keyboard:
- `Enter` → ไป vital ถัดไป
- `Shift + Enter` → ย้อนกลับหนึ่ง vital
- `Ctrl/Meta + Enter` → บันทึก vitals
- `Enter` ที่ช่อง Temp → บันทึก vitals
- `Escape` → ปิด fast-entry / dismiss focus

ปุ่มบน rail มี PREV / NEXT / SAVE และแสดงว่ากำลังกรอก vital ลำดับใด

การกด SAVE ยังเรียก workflow บันทึกเดิมของ ANESVET จึงคง plausibility validation, duplicate-record guard, alerts, audit trail และ persistence เดิมทั้งหมด

หลังบันทึกสำเร็จ ระบบจะ dismiss keyboard และพยายามรักษาตำแหน่ง scroll เดิมเพื่อไม่ให้ผู้ใช้ถูกเด้งออกจาก OR workspace

## 2. Android soft-keyboard / safe-area hardening
เพิ่ม `visualViewport` handling เพื่อประเมินพื้นที่ที่ soft keyboard ใช้และวาง fast-entry rail เหนือพื้นที่นั้นเมื่อ browser รองรับ

ปรับ mobile controls เพิ่มเติม:
- OR/Recovery bottom dock ใช้ left/right safe-area guard และ `transform:none`
- ซ่อน dock เดิมขณะ fast-entry ทำงาน เพื่อลดการซ้อนกัน
- ซ่อน interaction ของ dock เมื่อ soft keyboard ถูกตรวจพบ
- input/select/textarea สำคัญใช้ font-size 16 px บน mobile เพื่อลด unwanted browser zoom
- เพิ่ม small-screen และ landscape guard
- toast ถูกยกเหนือ fast-entry/keyboard ขณะกรอก vitals

## 3. Quick Drug ลดจำนวน tap
Quick Drug workspace ยังไม่ auto-save และยังใช้ confirmation/safety guard เดิม แต่เพิ่ม keyboard flow:

`Actual amount → Route → Concentration → Save`

กด Enter เพื่อเลื่อนไปช่องถัดไปได้ โดย Enter ที่ Concentration เพียง focus ปุ่ม Save — **ไม่กดให้ยาอัตโนมัติ**

เมื่อเป็น induction ที่ยังมียาหลายตัวรอ documentation ปุ่มจะแสดง `Save actual → next` เพื่อสื่อว่า workspace สามารถทำรายการต่อเนื่องได้

## 4. PWA / task-switch lifecycle hardening
เพิ่มการป้องกันข้อมูลเพิ่มเติมสำหรับ installed PWA / Android task switching:
- `freeze` event พยายาม flush pending save ผ่าน persistence path เดิม
- `pageshow` จาก BFCache refresh OR/Recovery view, session lock และ wake-lock state ตามที่รองรับ
- ไม่แทนที่ `visibilitychange`, `pagehide`, autosave, safety checkpoint หรือ current mirror ที่มีอยู่แล้ว

## Compatibility / safety boundary
รุ่นนี้ **ไม่เปลี่ยน**:
- IndexedDB schema/version
- storage keys
- dose calculation
- drug administration semantics / confirmation
- alert thresholds
- Recovery readiness criteria / score logic
- Procedure Templates V16.9
- Medication Queue V16.8.4
- Recovery workflow V16.10

ดังนั้นข้อมูล V16.10.0 สามารถใช้ต่อได้โดยไม่ต้อง migration schema
