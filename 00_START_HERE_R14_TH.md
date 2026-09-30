# ANESVET V17.2.18 — Checkpoint R14 (Startup Recovery Guard)

**ฐาน:** V17.2.17 R13 (ต่อยอดจาก source เดิม ไม่ใช่สร้างใหม่)  
**สถานะ:** Automated QA ผ่าน; Browser E2E / Android / iPad จริงยังไม่ผ่านการยืนยัน

## ปัญหาที่ตรวจพบจาก source
ก่อน R14 เส้นทางกู้ `Current Case` ขณะ Startup (`recoverFromSafetyCheckpoint`, legacy current migration, runtime metadata repair) อาจ `localStorage.setItem` โดยไม่ได้ตรวจว่าแท็บยังมีสิทธิ์ ACTIVE หรือว่า Current Case เปลี่ยนระหว่างการอ่านกับการเขียน ซึ่งขัดกับความตั้งใจของ R12/R13 ในการป้องกันข้อมูลเก่าทับใหม่

## สิ่งที่แก้
- เพิ่ม `guardedStartupCurrentWrite` ตรวจ ACTIVE + session ownership + revision ที่อ่านก่อนหน้า และ read-back verification ก่อนยืนยันการกู้คืน
- ไม่เขียนทับ `Current Case` ที่อ่านไม่ได้/เสียรูปแบบโดยอัตโนมัติ แม้มี Safety Checkpoint หรือ legacy snapshot
- เมื่อกู้ได้แค่ใน memory หรือซ่อม metadata แล้ว persist ไม่สำเร็จ ใช้ `CASE_FRESHNESS.block('startup-recovery-unpersisted')` หยุด clinical writes พร้อมแจ้งเตือนและปิดปุ่ม reload ที่อาจทำให้สับสน
- หากเปิดเคสที่ดำเนินอยู่แล้ว หลัง Reload `setTab` ไม่ทำให้ clinical page active ให้ใช้ UI fallback สำหรับ `orlive`/`recovery`/`endcase` เท่านั้น
- ปรับ cache/version เป็น V17.2.18

## วิธีเริ่มทดสอบ
1. สำรองข้อมูลออกก่อน อย่า Clear Site Data หรือถอน PWA ที่เก็บเคสอยู่
2. ทดสอบบนเครื่องสำรองและเคสจำลองเท่านั้น ใช้คู่มือ `DEVICE_R14_TEST_STEPS_TH.md`
3. รัน `node RUN_R14_QA.js` เพื่อทดสอบโค้ดและ regression และอ่าน `QA_R14_RESULTS.json`
4. หากขึ้นเตือน "Recovered case is in memory only" ห้าม Save/Reset โดยพยายามข้าม guard; ส่งออกและตรวจสอบ backup ก่อน ค่อยทดสอบกู้ข้อมูลบนเครื่องสำรอง

## ข้อจำกัด
- การตรวจ revision นี้ไม่ใช่ atomic transaction ข้ามแท็บ; ไม่ทดแทนการทดสอบความทนทานจริง
- การป้องกันเน้น current-case startup writes; ยังไม่ได้ตรวจทุกเส้นทางใน IndexedDB/archive migration และการ sync ข้ามเครื่อง
- ไม่แก้สูตรคำนวณยา, clinical thresholds, OR LIVE clinical controller, Recovery controller หรือ schema ฐานข้อมูล
- ไม่ใช่ clinical production release จนกว่าจะผ่าน device E2E และ recovery drill

## จุดเริ่มรอบถัดไป R15
Audit ย้อนหลังทุกทางที่เขียน `Current Case`/IndexedDB ในขั้นตอน boot และ after-wake ด้วยเคสจำลอง; แล้วทดสอบ Browser/Android ตามผลจริง โดยจำกัดขอบเขตการแก้ต่อรอบ
