# ANESVET V17.2.24 — R20 CRITICAL BOOT HOTFIX

**ต้นทาง:** V17.2.23 R19 Checkpoint — ไม่เริ่มโปรแกรมใหม่

## เหตุผลที่เร่งทำรอบนี้ก่อน R20 Data Reconciliation

Diagnostic บน Android ของ V17.2.14 ระบุ `renderDefaultReportPreference is not defined` ระหว่าง Startup, หลัง `current-case-loaded` และก่อน `ready`. ตรวจซ้ำใน R19 พบการเรียกชื่อดังกล่าว 2 จุดใน `app.js` แต่ตัวฟังก์ชันประกาศอยู่ภายใน `finalization-archive-controller.js` และไม่ถูก export ออกมาหรือผูกกลับเข้า app. ส่งผลให้ `loadSettings()` throw, Startup หยุดก่อน `BOOT.ready`, UI และปุ่มต่าง ๆ อาจไม่ตอบสนอง.

## ขอบเขต Hotfix

- Export `renderDefaultReportPreference` ผ่าน API ของ Finalization & Archive Controller.
- ผูก wrapper ของ `app.js` กับ controller API เพื่อให้ Startup และ Save Settings เรียกฟังก์ชันได้ใน scope ที่ถูกต้อง.
- เพิ่ม QA เฉพาะ Startup/Preference พร้อมทดสอบการสลับ Summary/Full PDF.
- เปลี่ยน version+cache ไป V17.2.24 เพื่อแยกไฟล์จาก Service Worker เก่า.
- **ไม่แก้ข้อมูลผู้ป่วย, Clinical Logic, สูตรคำนวณยา, Save/Restore/Transaction Journal และฐานข้อมูล.**

## ทดสอบบนอุปกรณ์จริงก่อนใช้งาน

1. เก็บข้อมูลสำรองของเคสจำลองและข้อมูลที่สำคัญก่อนทดลอง และใช้ที่อยู่เดียวกันกับเว็บที่ติดตั้งเดิม (อย่าลบข้อมูลไซต์/ถอนแอป).
2. เปิดเว็บรุ่นที่ deploy เป็น V17.2.24 แล้วตรวจชื่อเวอร์ชัน; ถ้ายังขึ้น 17.2.14/17.2.23 ให้ตรวจการ deploy/Service Worker ก่อน. 
3. เปิด Device Diagnostic แล้วตรวจ `ready: true`, มี stage `startup-complete`, และไม่มี `renderDefaultReportPreference is not defined`.
4. เลือก ASA, ลองเปลี่ยน Patient/Pre-op/Drug Calculator/OR LIVE/Recovery ด้วยเคสจำลอง.
5. ใน Settings เปลี่ยน Default Report ระหว่าง Summary/Full และตรวจว่าตัวเลือกใน End Case เปลี่ยนการเน้นตามค่าที่เลือก.
6. ปิดแอป เปิดใหม่ และตรวจว่าข้อมูลของเคสจำลองไม่หาย; ห้ามล้าง Storage เพื่อแก้อาการ Boot เพราะมีข้อมูลเคสอยู่ในนั้น.

**ยังไม่มีการยืนยัน Browser E2E / Android/iPad จริงจากผู้ใช้**: ผ่าน regression ไม่เท่ากับพร้อมใช้กับเคสจริง. หากยังมี startup error ใหม่ ให้ส่ง Diagnostic ล่าสุดพร้อมหมายเลขเวอร์ชัน.
