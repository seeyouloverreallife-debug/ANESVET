# ANESVET V17.2.12 — Checkpoint R08 (Modal & Navigation)

**ฐานต่อเนื่อง:** `ANESVET_V17_2_11_CHECKPOINT_R07_TAP_ORIGIN_GUARD.zip` ไม่ได้สร้างใหม่จากศูนย์

## เริ่มใช้งานไฟล์นี้
- หน้าแอป: `index.html` (ต้องเผยแพร่ทั้งโฟลเดอร์เว็บ ไม่ใช่เฉพาะ index.html)
- รัน Automated QA: `node RUN_R08_QA.js` (ต้องมี Node.js)
- ผลล่าสุด: `QA_R08_RESULTS.json`
- เปรียบเทียบ source กับ R07: `CHECKPOINT_R08_SOURCE_PARITY.json`
- ทดสอบบน Android/iPad: `DEVICE_R08_TEST_STEPS_TH.md`

## สิ่งที่แก้จริง
1. `app.js`: ปุ่ม `Close / back to OR` ของ Medication dialog เรียก close path ของ Medication Workspace Controller แทนการปิด `<dialog>` เปล่า ๆ; ปุ่มปิด dialog อื่นใช้ `closeDialogSafe`.
2. `medication-workspace-controller.js`: เมื่อปิด Medication dialog ด้วย Close, ESC/Back หรือปิดโดยระบบ ให้ล้าง editor basis/context/batch view ผ่านเส้นทางเดียวกัน; ไม่เพิ่ม clinical writes. การกดเปิดซ้ำระหว่าง dialog เปิดอยู่ไม่เขียนทับ actual mL ที่กำลังพิมพ์.
3. `app.js`: เปิด Mobile Workflow Menu ซ้ำได้อย่างปลอดภัย โดยไม่เรียก `showModal()` บน dialog ที่ยังเปิดอยู่.
4. `index.html`, `service-worker.js`, `manifest.webmanifest`: bump เป็น V17.2.12 พร้อมแคชใหม่.

## ขอบเขตและสถานะ
- **Automated / simulated:** R08 12/12 cases, 13/13 regression suites; JS syntax 86/86; ไม่พบ HTML ID ซ้ำหรือ asset cache ขาด.
- **ยังไม่ได้ยืนยัน:** Browser E2E บนอุปกรณ์จริง Android/iPad. การแก้ไขนี้ไม่ใช่หลักฐานว่าปัญหา Touch/Overlay ทุกกรณีหายแล้ว.
- **ข้อมูลทางคลินิก:** ไม่เปลี่ยน storage keys, schema, การคำนวณยา, clinical safety thresholds, OR LIVE/Recovery controllers.
- **ผลเมื่อปิด Medication Dialog:** ข้อมูล actual ที่ยังไม่ได้กด Save จะไม่ถูกบันทึก (พฤติกรรมเดิม) จึงควรบันทึกหรือจดก่อนปิด.

## ข้อควรระวัง
อย่า Clear Site Data / ถอนติดตั้ง PWA บนอุปกรณ์ที่มี Active Case. ก่อนอัปเดต ให้ทำ verified off-device backup แล้วทดสอบบนอุปกรณ์หรือ origin สำรองโดยใช้ข้อมูลสมมติ. หลีกเลี่ยงปล่อยเป็น production จนกว่าจะตรวจคลิก/Modal/Back จริงบน Android/iPad ผ่าน.

## R09
ใช้ข้อมูล Diagnostic จากอุปกรณ์ที่ยังมีปุ่มกดไม่ติด; แยกว่ามาจาก DOM hit testing, Security/Session Gate หรือปัญหา async boot. อย่าแก้หลาย clinical modules พร้อมกัน.
