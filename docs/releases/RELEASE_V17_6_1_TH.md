# ANESVET V17.6.2 — Architecture Consolidation Phase 2

ฐาน: V17.6.0 Stabilization

## เป้าหมาย
ลดภาระ startup และแก้ version/cache inconsistency โดยไม่เปลี่ยน clinical logic, dose calculation, alert thresholds, case schema หรือ final/archive semantics

## การเปลี่ยนแปลง
- เพิ่ม `knowledge-loader.js` เป็น lazy loader ของ Clinical Knowledge / ECG
- ย้าย 7 knowledge scripts ออกจาก critical startup parse path
- Knowledge ยังถูก precache ใน service worker เพื่อรองรับ offline use หลังติดตั้ง/อัปเดต cache สำเร็จ
- OR Knowledge, mobile Knowledge และ Drug Knowledge entry points เรียก loader กลาง
- แก้ version ที่แสดงใน UI จาก V17.5.4 ที่ตกค้างให้ตรงกับ V17.6.2
- แก้ manifest เป็น V17.6.2
- แก้ service-worker cache namespace จาก `anesvet-v17-5-4-startup` เป็น `anesvet-v17-6-2-startup`
- refresh SOURCE_SHA256.json

## Static regression ที่รันใน environment นี้
- JavaScript syntax: PASS
- HTML IDs: 1,392 / duplicate 0
- Local src/href references: 116 / missing 0
- eager script references: 66 (ลดจาก 73 ก่อน lazy knowledge)

## ไม่ได้เปลี่ยน
- สูตรยา / dose ranges
- clinical thresholds
- medication record semantics
- patient/case storage schema
- End Surgery / final lock / archive semantics
- recovery criteria

## ข้อจำกัดการตรวจ
ยังไม่ได้รัน Playwright/browser E2E ใน environment นี้ เนื่องจาก dependency ไม่ได้อยู่ใน source package ดังนั้นต้องทดสอบ physical-device workflow ต่อ โดยเฉพาะ cold start, first-open Knowledge offline/online, OR keyboard, End Surgery และ Recovery.
