# Migration — V16.10.0 → V16.11.0

## Data migration
ไม่ต้องทำ data migration

- IndexedDB DB version: unchanged (`2`)
- Existing localStorage keys: unchanged
- Current case / archived case data shape: no required schema migration
- Procedure Templates, Medication Queue และ Recovery records เดิมยังใช้ต่อได้

## Update behavior
1. แทนที่ไฟล์แอปด้วย package V16.11.0
2. เปิดแอปออนไลน์หนึ่งครั้งเพื่อให้ service worker/cache ใหม่ติดตั้ง
3. ถ้า PWA ยังแสดง V16.10.0 ให้ปิดแอปทุกหน้าต่างแล้วเปิดใหม่หลัง update ready
4. ตรวจ About/หัวแอปว่าเป็น `V16.11.0`

## Recommended validation หลังอัปเดต
- เปิดเคสจำลองและเข้า OR LIVE
- แตะ HR แล้วตรวจว่า fast-entry rail อยู่ใน viewport และไม่ชน bottom dock
- ทดสอบ Enter: HR → MAP → SpO₂ → ETCO₂ → RR → Temp
- ทดสอบ Shift+Enter ย้อนกลับ
- บันทึก vitals และตรวจว่า record ถูกเพิ่มเพียงหนึ่งครั้ง
- เปิด Quick Drug และทดสอบ Actual → Route → Concentration → Save
- หมุน portrait/landscape และตรวจ dock
- สลับแอปแล้วกลับมา ตรวจว่า active case ยังอยู่
- ทดสอบ Recovery dock อีกครั้งเพื่อกัน layout regression
