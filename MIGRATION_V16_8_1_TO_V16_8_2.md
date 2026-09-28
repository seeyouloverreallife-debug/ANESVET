# Migration — V16.8.1 → V16.8.2

## Data migration
**ไม่ต้องทำ data migration**

V16.8.2 ใช้เหมือนเดิม:
- localStorage keys
- IndexedDB `ANESVET_DB`
- DB version 2
- case state schema
- Patient Master schema
- archive schema
- backup schema
- checksum payload rules

## วิธีอัปเดต
1. สำรองข้อมูลจาก Data Health Center ก่อน update ตาม workflow ปกติ
2. Deploy/replace V16.8.2 files
3. เปิด ANESVET และตรวจ header เป็น V16.8.2
4. Run Clinical Validation — ควร PASS 15/15
5. Run Reliability Self-check
6. เปิดเคสทดสอบสั้น ๆ: Patient → Pre-check → OR record → Recovery

## Rollback
หากต้อง rollback ไป V16.8.1 ข้อมูลไม่ต้องแปลงกลับ เพราะ storage/database contract ไม่เปลี่ยน

## จุดที่ควรสังเกตหลัง update
- Patient Master search / merge / retire / restore
- Vital duplicate guard / correction
- Recovery record / score / begin-complete transition

สามส่วนนี้ถูกย้ายผ่าน orchestration boundary ใหม่ แต่ user-visible workflow ตั้งใจให้เหมือน V16.8.1
