# ANESVET V14.3.1 — Safety Hotfix

รุ่นนี้แก้ safety/data-integrity issues ก่อน pilot clinical use

## Hotfixes
- แก้ duplicate `phaseLabel()` โดยเปลี่ยน Drug Library helper เป็น `drugPhaseLabel()`
- Fresh case ไม่มี default body weight และไม่มี default anesthesia vital signs
- Patient Master แสดง Previous weight เป็น reference เท่านั้น และไม่ copy มาเป็น Current weight
- ต้อง Save Patient & Case Setup พร้อม Current BW ที่ valid ก่อน Start case / weight-based drug administration
- Drug calculator และ mL/kg fluid displays ไม่สร้างค่าจากน้ำหนัก fallback
- Start case ทั้ง main UI, OR LIVE และ implicit start จาก Record/Event ใช้ readiness validation เดียวกัน
- Patient Master ไม่ merge HN/microchip match แบบเงียบ: ต้องเลือก USE / NEW / Cancel
- IndexedDB upgrade มี `onblocked` พร้อมข้อความให้ปิด ANESVET tab อื่น
- Protocol audit และ Last Backup migration ไล่ fallback ผ่าน V14.2 / V14.1 / V14
- Missing vital signs แสดง `No measurement entered` และไม่ถูกตีความเป็น 0/danger
- Empty vital set ไม่สามารถบันทึกเป็น anesthesia record ได้

## Deferred to V14.4+
- HN vs Visit/Case ID data-model split
- Previous anesthesia history
- Multi-tab active-session lock / take-control workflow
- Patient duplicate merge/retire tools
- Sex/reproductive-status dynamic options
- °C/°F setting and canonical temperature storage

Storage keys remain `anesvet_v14_3_*` intentionally so V14.3 data upgrades in place.
