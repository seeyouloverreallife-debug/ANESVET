# ANESVET V17.2.17 — Checkpoint R13: Current-case Freshness Guard

**ฐาน:** ใช้ source จาก V17.2.16 (R12) โดยตรง — ไม่สร้างใหม่จากศูนย์

## ขอบเขตรอบนี้

ปัญหาที่ตรวจพบใน source: Session Lock ตรวจว่าแท็บใดมีสิทธิ์บันทึก แต่ไม่ได้ตรวจว่า `state` ในหน่วยความจำเป็นเวอร์ชันล่าสุดของข้อมูลใน `localStorage` หลังแท็บอื่นบันทึกหรือหลัง Take control จึงอาจบันทึกเคสเก่าทับข้อมูลใหม่ได้

สิ่งที่แก้:
- เพิ่ม `active-case-freshness.js` เก็บ baseline ของข้อมูล Current Case ที่โหลดครั้งแรก และอัปเดตเฉพาะเมื่อการบันทึกจากแท็บนี้ตรวจยืนยันแล้ว
- ก่อน `save()`, clinical write, reset, บันทึก mirror ที่รอในคิว, และ runtime repair ต้องตรวจเทียบกับข้อมูลใน Storage
- เมื่อพบความแตกต่าง จะ **ไม่บันทึกทับ** และแสดงแถบ `CURRENT CASE OUT OF DATE` พร้อมปุ่ม `Reload latest saved case`
- กรณีเบราว์เซอร์อ่าน Storage ไม่ได้ จะปิดการกด Reload และเตือนไม่ให้ทำงานต่อบนแท็บนั้น
- ตรวจซ้ำเมื่อ Take control, Storage เปลี่ยน และก่อนทุกการบันทึกที่ครอบคลุม
- ไม่รวมบันทึกยา/สัญญาณชีพจากสองแท็บเข้าด้วยกันอัตโนมัติ เพื่อลดความเสี่ยงซ้ำหรือข้อมูลขัดกัน

## วิธีทดสอบด้วยเคสจำลอง (อุปกรณ์สำรอง)

1. สำรองข้อมูลในเครื่องเดิม อย่าลบ Site Data / ถอน PWA บนเครื่องที่มี Active Case
2. เปิด ANESVET V17.2.17 สองแท็บของ origin เดียวกัน (A/B) เริ่มเคสจำลองใน A และบันทึก Vital + Drug
3. เปิด B ให้ขึ้น VIEW ONLY แล้วกด Take control ตรวจว่าข้อมูลครบ จากนั้นบันทึก Vital อีก 1 รายการ
4. กลับไป A แล้วกด Take control: ควรแสดง `CURRENT CASE OUT OF DATE` **ห้ามอนุญาตให้ Save ทับ**
5. กด `Reload latest saved case`, ตรวจว่า Patient/Case ID, drug administrations, records, OR LIVE หรือ Recovery สอดคล้องกับข้อมูลที่ B บันทึกไว้
6. ทดลอง Sleep/Wake และ Reload บน Android/iPad ด้วยเคสจำลอง และตรวจไม่มีรายการซ้ำ

## QA

รัน `node RUN_R13_QA.js` (รวม R13 + backward regressions; หลักฐาน `QA_R13_RESULTS.json`)

## ข้อจำกัดและความปลอดภัย

- ยังไม่ผ่าน Browser E2E จริง (Chromium ในสภาพแวดล้อมทดสอบหมดเวลา) และยังไม่ได้ทดสอบ Android/iPad
- ตัวตรวจนี้ป้องกันข้อมูล `current` ภายใน origin/Storage เดียวกัน ไม่ใช่การซิงค์หลายเครื่องคนละ origin
- หากข้อมูลปัจจุบันเสียรูปแบบหรือ Storage ถูกปฏิเสธ ให้สำรองและตรวจสอบก่อน ไม่ควรอัปเดตในเครื่องที่มีเคสจริง
- ไม่ได้เปลี่ยนสูตร Drug Calculator, clinical protocols, anesthesia/Recovery controllers, หรือฐานข้อมูล
