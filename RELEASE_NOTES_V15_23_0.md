# ANESVET V15.23.0 — OR Medication Queue & Fast Documentation

ฐานพัฒนา: **V15.22.0 Finalization & Medication Reconciliation**

เป้าหมายของรุ่นนี้คือทำให้การลงยาใน OR LIVE เร็วขึ้นโดยยังคงหลักว่า **Calculated / Planned ≠ Administered** และไม่ลด safety gate ของ Actual administration

## 1) OR Medication Queue จาก Frozen Case Drug Plan
เพิ่ม Medication Queue ใน OR LIVE เพื่อให้เห็นทันทีว่ายา routine ในแผนใด:
- **GIVEN** — พบ Actual administration ที่ยังไม่ถูก void
- **PENDING** — ยังไม่มี Actual administration ที่จับคู่ได้

Queue ไม่บันทึกการให้ยาเอง และไม่เปลี่ยน PENDING เป็น GIVEN เพียงเพราะเปิด calculator/workspace

Emergency / standby ยังคงไม่ถูกบังคับเป็น routine pending ตามหลักเดียวกับ Medication Reconciliation ใน V15.22

## 2) Phase-aware “Record next”
ปุ่มหลักใน queue จะเลือก planned medication ตัวถัดไปตาม phase ปัจจุบัน

ลำดับโดยสรุป:
- setup: PRE → INDUCTION → POST
- induction: INDUCTION → PRE → POST
- intra-op: PRE → POST → INDUCTION
- emergence / recovery: POST → PRE → INDUCTION

ถ้ายา induction ยัง PENDING ระหว่าง induction/intra-op/emergence ระบบจะเลื่อน induction ขึ้นก่อน เพื่อไม่ให้การลงย้อนหลังหลุดจาก workflow

## 3) Stable matching และ one-to-one consumption
การจับคู่ planned ↔ actual ใน OR queue ใช้:
1. stable drug ID จาก `calculationBasis.drug.id`
2. exact normalized drug name เป็น fallback

Actual administration หนึ่งรายการใช้ satisfy planned entry ได้เพียงหนึ่งรายการ จึงไม่ทำให้ planned drug ที่ซ้ำกันหลาย dose ถูกนับ GIVEN จาก Actual ตัวเดียว

## 4) QUICK MEDS แสดงยาที่ PENDING ก่อน Favorites
ใน intra-op แถบ QUICK MEDS จะจัดลำดับ:
1. planned routine medication ที่ยัง PENDING
2. planned emergency / standby
3. favorite medications

ยา PENDING จาก Frozen Plan มี label `• PLAN` ทำให้ post-induction / post-anesthetic medication ที่ยังไม่ได้ลง Actual ไม่ต้องเปิด All medications แล้วค้นใหม่

## 5) Medication workspace เปิดตรง planned drug
กด `Record` ที่ queue หรือ `Record next` จะเปิด workspace ไปยังยาตัวนั้นโดยตรง พร้อม phase context เช่น:
- `PRE-ANES planned medications`
- `POST-ANES planned medications`

ระบบยังคงให้ผู้ใช้ยืนยัน:
- Actual administered amount
- Route
- Administered by
- Preparation / concentration

## 6) Continuous medication documentation
เมื่อเปิด **All medications** แล้วบันทึก planned medication สำเร็จ:
- dialog ยังเปิดอยู่
- ระบบเลือก planned medication ตัวถัดไปที่ยัง PENDING ให้อัตโนมัติ
- queue และ QUICK MEDS refresh ทันที

จึงสามารถลงหลายรายการต่อเนื่องได้โดยไม่เด้งกลับ OR LIVE ทุกครั้ง

## 7) Void-aware live refresh
เมื่อ Actual administration ถูก void:
- planned item ที่เคย GIVEN จะกลับเป็น PENDING ทันที
- queue count, Record next, sticky MEDS และ QUICK MEDS ถูกอัปเดต

ไม่มีการแก้ Frozen Plan หรือเขียน Not-given decision อัตโนมัติ

## 8) Mobile toast visibility
ปรับ toast ให้มี z-index สูงขึ้น และใน OR/Recovery mobile mode ขยับเหนือ fixed bottom dock เพื่อลดปัญหาข้อความ “บันทึกแล้ว” ถูกแถบด้านล่างบัง

## 9) Safety / finalization ที่คงเดิม
V15.23 ไม่ลด safety gate ของ V15.21/V15.22:
- Current BW ต้องพร้อมก่อนลงยา
- Actual > 0
- Route required
- Administered by required
- Preparation / concentration required
- confirmation ก่อนบันทึก Actual ยังคงอยู่
- medication calculation / ETT clinical validation เดิมยังคงอยู่
- End Case Medication Reconciliation และ Final Lock gate จาก V15.22 คงเดิม

`finalization.js` และ `medication-reconciliation.js` ใน build นี้คง logic จาก V15.22 โดยไม่แก้ clinical/final-lock behavior

## Compatibility / storage
- คง storage keys เดิมของ ANESVET V15.x
- ไม่เพิ่ม schema migration ที่ rewrite locked/checksummed cases
- ไม่เพิ่มสูตรยาใหม่หรือแก้ threshold
- service worker cache เปลี่ยนเป็น V15.23.0

## สิ่งที่ยังควรทดสอบบนอุปกรณ์จริง
ก่อน rollout ใน OR ควรทดสอบ golden path บน:
- Android Chrome / PWA
- iPad Safari / PWA

โดยเฉพาะ new case → induction → multiple medications → intra-op → void/re-record → recovery → reconciliation → Final Lock และการ refresh หลัง service-worker update
