# Migration — ANESVET V16.11.0 → V16.12.0

## Data migration
**ไม่ต้องทำ data migration**

V16.12.0 ไม่เปลี่ยน:
- IndexedDB schema/version
- current case storage key
- archive/settings keys
- safety checkpoint semantics
- medication administration records
- Recovery data model

ข้อมูลและเคสเดิมจาก V16.11.0 สามารถเปิดต่อได้

## Update procedure
1. สำรองข้อมูล ANESVET ตาม workflow ปกติก่อนอัปเดต
2. แทนที่ application files ด้วย package V16.12.0
3. เปิด ANESVET ขณะ online หนึ่งครั้งเพื่อให้ service worker/cache ใหม่ติดตั้ง
4. หาก installed PWA ยังแสดง V16.11.0 ให้ปิดและเปิดแอปใหม่หลัง service worker activate
5. ตรวจ About/version ให้เป็น `V16.12.0`
6. เปิดเคสทดสอบและตรวจ OR Guardian, Recovery Guardian และ End Case completeness

## Compatibility note
Documentation Guardian เป็น state-derived layer และไม่แก้ case data เพียงเพราะมี reminder แสดงอยู่
