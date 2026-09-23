# ANESVET V15.9.1 — Private Pilot Feedback Endpoint

## Goal
ลด friction และลดการเปิดเผยรายละเอียด backend สำหรับ Hospital Pilot build ที่แจกผู้ทดลอง โดยผู้ใช้รู้เพียงว่า report ถูกส่งถึงผู้พัฒนา ANESVET

## Changes
- ฝัง feedback destination ภายในแอป ไม่ต้องตั้งค่า Web App URL ใน Settings
- เอาช่อง `Feedback webhook URL` ออกจาก UI
- ล้าง legacy `pilotFeedbackEndpoint` ที่อาจค้างอยู่ใน local settings จาก V15.9.0
- ผู้ใช้เห็นข้อความว่า report ส่งถึงผู้พัฒนา ANESVET โดยตรง
- offline queue + automatic retry ยังคงทำงานเหมือนเดิม
- เอาปุ่ม `Save locally only`, `Export CSV`, `Export JSON` ออกจาก Pilot user UI เพื่อให้ workflow เหลือ Submit อย่างเดียว
- build สำหรับแจกผู้ทดลองไม่รวม Apps Script backend/setup files
- ไม่มีการส่ง patient name, HN, microchip หรือ owner data อัตโนมัติ เหมือน V15.9.0

## Safety / compatibility
- ไม่เปลี่ยน clinical dose, alert threshold, OR workflow, Recovery workflow หรือ storage schema
- existing feedback queue จาก V15.9.0 ยังอ่านและ retry ได้
- existing Hospital Settings ถูก migrate โดยตัด legacy endpoint field ออกจาก settings object

## Test status
- Syntax + JSON: PASS
- Static regression / compatibility: PASS
- V15.9.1 private feedback contracts: PASS
- Clinical helpers: PASS (73 assertions)
- Workflow model scenarios: PASS (4 scenarios)
- Browser E2E: not claimed in this environment

## Security note
ปลายทางไม่แสดงใน UI และไม่ได้เก็บเป็น plain URL ใน Settings/backup แต่ ANESVET เป็น client-side web app ดังนั้นผู้ใช้ที่มีทักษะทางเทคนิคและตรวจ network/source อย่างตั้งใจยังสามารถค้นหาปลายทางได้ การปกปิดใน client ไม่ควรถูกใช้เป็น security boundary
