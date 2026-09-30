# ANESVET — Bugfix Checkpoint R03 (30 กันยายน 2026)

## ฐานที่ใช้

ต่อโดยตรงจาก `ANESVET_V17_2_6_CHECKPOINT_R02_MOBILE_DIAGNOSTIC.zip` ไม่ได้สร้างโปรแกรมใหม่จากศูนย์; runtime ใหม่ชื่อ **V17.2.7 / R03 ASA Tap Trace**.

## ขอบเขตการแก้ (diagnostic correctness, NOT clinical mutation)

1. แก้ false-positive: ผู้ใช้แตะ ASA ที่เลือกอยู่ก่อนแล้ว แต่ไม่มี click มาถึง เดิม probe จะนับ `handled` จากค่าเดิมอย่างเดียว; R03 แยก `CLICK_NOT_OBSERVED` จาก `ASA_ALREADY_SELECTED` เมื่อ click มาถึงจริง.
2. บน Android/iPad tap เดียวอาจยิง `pointerdown` + `touchstart`: เดิมตั้ง delayed probe ซ้ำ R03 รวมคู่เหตุการณ์ที่ตรงกันและห่างกันไม่เกิน 250 ms โดยยังเก็บ double tap แบบเดียวกันเป็นคนละ probe.
3. เพิ่มสถานะ `CLICK_WITHOUT_ASA_UPDATE` เมื่อ click มาถึงแล้วแต่ไม่มีการเปลี่ยนค่า ASA.
4. เพิ่มสถานะ `VALUE_UPDATED_UI_STALE` เมื่อค่าซ่อน `#asa` เปลี่ยน แต่การเลือกที่แสดงใน ASA card ไม่ตรง และ `BADGE_UPDATED_VALUE_STALE` ในกรณีกลับกัน. มีประโยชน์เมื่อ handler อัปเดตค่าไปบางส่วนแล้วเกิด exception ก่อน sync UI.
5. กัน timer จาก tap เก่ามาเขียนทับผล tap ใหม่โดยใช้ `seq` token และบันทึก whether click was observed.
6. เพิ่ม QA ชุด R03 และอัปเดตเวอร์ชันใน page, runtime label, manifest, cache เพื่อให้โหลดไฟล์ชุดเดียวกัน.

## ไฟล์ที่แตะจาก R02

- `index.html` — ปรับเฉพาะ boot sentinel tap probe และหมายเลข resource references/version.
- `app.js` — เปลี่ยน APP_VERSION เท่านั้น.
- `service-worker.js` — เปลี่ยน cache namespace และ asset query versions เท่านั้น.
- `manifest.webmanifest` — อัปเดตชื่อและ start_url เท่านั้น.
- QA ใหม่ `QA_R03_ASA_TAP_TRACE.js` และ `QA_BOOT_RUNTIME_V17_2_7.js`; QA เก่ายังคงไว้.

จาก baseline ใน R02 ทั้งหมด **518 ไฟล์ มี 514 ไฟล์เดิม byte-for-byte; runtime ไฟล์ที่เปลี่ยน 4 ไฟล์**. ไม่เปลี่ยน patient-master-controller.js, session-controller.js, calculation, OR LIVE, Recovery, Archive, Sync, คีย์การจัดเก็บเคส หรือฐานข้อมูล.

## ผลการทดสอบในสภาพแวดล้อมนี้

- 8 suites / **86 จาก 86 ผ่าน**.
- ตรวจไวยากรณ์ JavaScript **67 จาก 67 ไฟล์ผ่าน**.
- HTML ID จำนวน **1,334 ค่าไม่ซ้ำ** (รวม id ใน markup/script strings จาก static scan).
- HTML local resource references **87 จาก 87 มีไฟล์ครบ**.
- Service Worker cached asset references **89 จาก 89 มีไฟล์ครบ**.
- รวม suite checks + syntax checks **153 ผ่าน**.
- มีไฟล์ผลทดสอบ `QA_R03_RESULTS.json`.

## ข้อจำกัดและความปลอดภัย

- ไม่มี runtime trace จากอุปกรณ์มีปัญหาจริง. **ยังไม่ทราบ root cause** ของ ASA / navigation บน Android/iPad.
- Headless Chromium ถูกบล็อกใน container จึงไม่มี browser E2E; unit tests ไม่ยืนยันว่า PWA ใช้จริงได้.
- ผลทดสอบทั้งหมดเป็นการตรวจทาง static/VM ไม่ใช่ความปลอดภัยทางคลินิก. ต้องทดสอบบน test device แยกจากเคสวางยาสลบจริง.
- หากแสดง VIEW_ONLY ต้องตรวจ session lock จริง ห้ามบังคับแย่ง control ระหว่างอีกแท็บบันทึกเคส.
- ห้าม Clear Site Data, Reset, Uninstall PWA หรือบังคับอัปเดตบนอุปกรณ์มี active case ก่อน export/backup.

## R04 แผนทำต่อ

รับ Diagnostic จาก R03 หรืออุปกรณ์จริง โดยแยก branch ตาม `interaction hint`:
- `CLICK_NOT_OBSERVED` → ไล่ overlay / CSS / pointer cancellation / session capture guard.
- `CLICK_WITHOUT_ASA_UPDATE` → ไล่ exception ใน handler + DOM binding + event propagation.
- `VALUE_UPDATED_UI_STALE` → ตรวจ exception หลัง `#asa.value` ตั้งค่า โดยเฉพาะ `loadSettings` ก่อน syncAsaCards (ยังไม่สรุปว่าเป็นสาเหตุ).
- `PATIENT_BIND_INCOMPLETE` → ตรวจ script load, bootstrap promise และ error trace.
- ASA ทำงาน แต่ navigation ไม่ทำงาน → แยกตรวจ navigation binding ในอีก checkpoint; ห้ามแก้พร้อมกันโดยไม่มี trace.

ทุกครั้งให้ยึด R03 ZIP นี้เป็นฐาน ทำชุดทดสอบเฉพาะจุด + regression แล้ว pack checkpoint ใหม่.
