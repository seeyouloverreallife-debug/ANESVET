# ANESVET V17.2.14 — Checkpoint R10 (Session Modal Guard)

**Base:** V17.2.13 R09 Patient Setup Integrity. ต่อยอดจาก source เดิม; ไม่เริ่มใหม่, ไม่เปลี่ยนฐานข้อมูลหรือคำนวณยา

## จุดแก้ไข R10 (หนึ่งระบบ)
ตรวจพบว่า Session Controller ในโหมด **VIEW ONLY** ใช้ capture event guard กับปุ่ม/input ใน `.tabpage` เท่านั้น แต่ Native dialog เช่น `orQuickDrugDialog`, `alertProtocolDialog`, `problemActionDialog` วางอยู่นอก `.tabpage` จึงไม่ถูก guard ชั้น UI

แก้ `session-controller.js`:
- ดัก `click`, `beforeinput`, `change` และ `keydown` จาก interactive controls ใน `dialog[open]` เช่นเดียวกับ `.tabpage` **เฉพาะเมื่อ mode=view**
- อนุญาตการใช้ปุ่ม session-safe / Take control, การเปลี่ยนหน้าใน mobile workflow และการปิด dialog โดยไม่จำเป็นต้อง TAKE CONTROL
- เมื่อ block จะส่ง Stage `session-view-only-blocked` พร้อมเฉพาะ `dialog` หรือ `page` ให้ Diagnostic; ไม่ส่งชื่อสัตว์หรือค่าฟอร์ม
- โหมด ACTIVE และ INITIALIZING ใช้งานตามเดิม
- อัปเดตเวอร์ชัน/Service Worker Cache เป็น V17.2.14 โดยไม่ล้าง storage clinical

## หลักฐานและข้อจำกัด
- ก่อนแก้: R10 targeted test **8/13 ผ่าน, 5/13 ไม่ผ่าน** โดยเฉพาะ dialog event + diagnostic
- หลังแก้: targeted **13/13 ผ่าน**
- Full regression: **15/15 suites, 94/94 JS syntax**; HTML ไม่มี duplicate ID, cache asset ไม่หาย
- Chromium headless ไม่ส่ง DOM และหมดเวลาหลัง 16 วินาที; **ไม่ถือว่าผ่าน Browser E2E หรือ Android/iPad**
- ยังต้องทดสอบด้วยเคสจำลองบนเครื่องจริงก่อนนำไปใช้กับผู้ป่วย

## เปิดใช้งานและ QA
- Web entry: `index.html`; ต้อง deploy ทั้งโฟลเดอร์ ไม่ใช่แค่ index.html
- QA: ใช้ `node RUN_R10_QA.js`
- ดู `QA_R10_RESULTS.json`, `CHECKPOINT_R10_SOURCE_PARITY.json`, `DEVICE_R10_TEST_STEPS_TH.md`
- **ห้ามลบ Site Data, ถอน PWA หรือเคลียร์ข้อมูลบนเครื่องที่มี Active Case**; สำรองข้อมูลไปอีกอุปกรณ์แล้วตรวจสอบไฟล์ก่อนอัปเดต

## รอบต่อไป R11
ตรวจการกู้คืนเมื่อ Storage read/write ถูกปฏิเสธ และการเปิดแอปหลัง sleep/reload (ต้องเก็บเคสไว้และป้องกันการสูญหาย) หรือแก้ตาม Diagnostic ของอุปกรณ์จริง โดยไม่เพิ่ม scope ร่วมในรอบเดียว
