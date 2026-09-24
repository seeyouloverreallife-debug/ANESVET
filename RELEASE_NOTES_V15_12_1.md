# ANESVET V15.12.1 — Mobile Quick Access

## Why this release
V15.11 ลดความรกด้วยการทำ workflow tabs ให้ไม่ sticky แต่บนมือถือ/iPad ผู้ใช้ต้องเลื่อนกลับด้านบนเป็นระยะเพื่อเปลี่ยน phase/page และปุ่ม Report ถูกซ่อนจาก compact header ในจอเล็ก

## Changes
- เพิ่ม compact fixed **Mobile Quick Bar** สำหรับ mobile/iPad workflow ปกติ
- `☰ ขั้นตอน` เปิด bottom sheet ที่รวม 6 workflow steps
- ปุ่มกลางแสดง active page และทำหน้าที่ **scroll to top**
- เพิ่ม `🐞 Report` เป็น persistent mobile action
- เพิ่ม secondary shortcuts: Case Summary / Cases & Archive / Settings
- Quick Navigation สะท้อน active step และ lock state จาก workflow tabs หลัก
- ซ่อน Mobile Quick Bar อัตโนมัติเมื่อเข้า OR LIVE หรือ Recovery เพื่อไม่ชนกับ phase-specific mobile dock
- ไม่คืน bulky sticky workflow bar แบบรุ่นเก่า

## Clinical behavior
ไม่มีการเปลี่ยน dose, alert thresholds, ASA, Pre-OR Briefing references, fluid/ventilation references, Case Drug Plan, OR workflow, Recovery criteria หรือ final-record behavior

## Compatibility
- ใช้ storage/schema เดิม
- เคสจาก V15.12.0 และรุ่นก่อนหน้าควรเปิดต่อได้ตาม backward-compatibility path เดิม

## Validation
- JS syntax: PASS
- Static contracts: PASS
- Browser device matrix: PASS
  - 390×844 touch
  - 1024×768 touch
  - 1440×900 desktop
- Mobile Quick Bar remains visible after long scroll: PASS
- Mobile Report opens support dialog: PASS
- Quick Navigation switches Patient → Pre-check: PASS
- Golden Patient → Pre-op → Briefing → OR LIVE → Start Induction: PASS
- Browser page errors in automated tests: 0
