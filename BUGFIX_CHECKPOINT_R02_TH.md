# ANESVET — Checkpoint R02 (30 กันยายน 2026)

**ต่อจาก R01 โดยตรง; ไม่ได้สร้างแอปใหม่จากศูนย์**

- Package runtime: **V17.2.6 (R02 Mobile Boot Diagnostic)**
- ขอบเขตเดียว: **Mobile Boot / Runtime interaction diagnosis**
- เหตุการณ์หลัก: Android/iPad พิมพ์ข้อมูลได้ แต่ปุ่ม ASA หรือ Navigation ไม่ทำงาน **ยังไม่ยืนยันว่าแก้สาเหตุหลักสำเร็จ**

## สาเหตุย่อยที่ตรวจพบและแก้ไขแล้ว

`index.html` เดิมตั้ง watchdog ไว้ 8 วินาที และบันทึก `startup-incomplete-watchdog` เมื่อ Patient Controller bind สำเร็จแล้วแต่ส่วนเริ่มระบบยังไม่เสร็จ **แต่ไม่เปิด Diagnostic panel** ผู้ใช้จึงเห็นอาการค้างโดยไม่ทราบจุดที่เริ่มระบบหยุดทำงาน

## สิ่งที่แก้ R02

1. เมื่อ Startup ยังไม่เสร็จหลัง 8 วินาที **เปิด Diagnostic panel อัตโนมัติ** (เดิมแค่บันทึก log)
2. เมื่อ Startup สำเร็จภายหลังจะปิด warning ชั่วคราวเอง แต่จะไม่ปิดแผง error / ASA tap failure ที่ต้องติดตาม
3. เพิ่มปุ่ม **🔎** บนแถบบนเพื่อเรียก Diagnostic ได้เอง แม้ `app.js` จะยังเริ่มไม่เสร็จ
4. เพิ่มสถานะ Session read-only, สถานะ session lock โดยไม่ส่ง `tabId`, `patientName` หรือเนื้อหาเวชระเบียนไปในข้อมูลวินิจฉัย
5. เพิ่ม hit testing (`elementFromPoint`) + `pointerEvents` เพื่อแยกกรณี tap อยู่บน ASA แต่ element อื่นบังอยู่ หรือ CSS ทำให้คลิกไม่ได้
6. ข้อความ `interaction hint` ให้เบาะแส: `VIEW_ONLY`, `PATIENT_BIND_INCOMPLETE`, `OPEN_DIALOG`, `CARD_POINTER_EVENTS_NONE`, `HIT_TEST_MISMATCH`, `STARTUP_INCOMPLETE`, หรือ `UNDETERMINED`
7. เปลี่ยน version/caching เป็น **V17.2.6** ทั้งชื่อหน้าแอป, `app.js`, `manifest.webmanifest`, Service Worker cache และ query asset เพื่อไม่ใช้แคชเก่าโดยไม่ตั้งใจ

## จำกัดขอบเขตแก้ไข

จาก 509 ไฟล์ใน R01: **505 ไฟล์ byte-for-byte เหมือนเดิม**; เปลี่ยนเฉพาะ
- `index.html` (Diagnostic + shell version)
- `app.js` (`APP_VERSION` 17.2.5 → 17.2.6 เท่านั้น)
- `service-worker.js` (versioned asset refs/cache เท่านั้น)
- `manifest.webmanifest` (version/label เท่านั้น)

**ไม่ได้แก้** Patient Controller, dose calculator, drug route/concentration, OR LIVE, Vital signs, Recovery, database schema, synchronization, medication records, Final Sign-off หรือ Archive. ไม่ล้างข้อมูลหรือเปลี่ยนคีย์ localStorage คลินิก

## Regression

- Automated 8 suites: **78/78 PASS**
- JS syntax: **65/65 PASS**
- รวม **143/143 automated checks PASS**
- HTML IDs: **1,327 unique**
- HTML resource refs: **88/88 present**
- SW pre-cache refs: **90/90 present**
- Baseline source parity: **505/509 unchanged**; ทุกไฟล์ clinical unchanged และ `app.js` เปลี่ยนแค่ version

## ข้อจำกัดสำคัญ

- ยังไม่ใช่การรับรองว่าแอปใช้งานปกติบน Android/iPad จริง
- ยังไม่ได้ทำ full-browser E2E หรือทดสอบกับอุปกรณ์มีปัญหาจริง
- `interaction hint` เป็นเบาะแสเบื้องต้น **ไม่ใช่ข้อสรุปต้นเหตุ**
- ต้องทดสอบ R02 บนเครื่องสำรองหรือหน้าทดสอบก่อนนำไปใช้กับเคสที่กำลังวางยาสลบ
- หากมี active case ให้ทำ backup ตาม workflow ก่อนอัปเดต และ **ห้าม Reset Data / Clear Site Data / ถอน PWA**

## R03 — หลังได้รับ Diagnostic จากอุปกรณ์

1. หาก `PATIENT_BIND_INCOMPLETE` หรือ `startup incomplete`: อ่าน `lastError` + `stages` เพื่อระบุ script หรือ promise ที่ล้ม/ค้าง แล้วแก้ไฟล์เดียวที่พิสูจน์สาเหตุ
2. หาก `VIEW_ONLY`: ทดสอบ session conflict จริงและปรับเฉพาะ UI ทำให้ผู้ใช้รู้สถานะชัดเจน โดย **ไม่ auto-take control**
3. หาก `OPEN_DIALOG` / `HIT_TEST_MISMATCH`: หา element ที่ intercept แล้วแก้ overlay/modal เฉพาะกรณี
4. หาก `ready:true`, ASA ถูก handled แต่ navigation ไม่ทำงาน: แยกไป QA navigation bindings โดยไม่แตะ clinical flow
5. ทุกครั้งต้องทำ regression และออก ZIP Checkpoint ใหม่ก่อนเพิ่มขอบเขตอื่น

คำสั่งทำต่อ: `ใช้ ZIP R02 เป็นฐาน ตรวจหลักฐาน Diagnostic จากอุปกรณ์ที่มีปัญหา แก้เพียงกลุ่มที่มีหลักฐาน ทดสอบ และสร้าง Checkpoint R03 โดยห้ามเริ่มใหม่จากศูนย์`
