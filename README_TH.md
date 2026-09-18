# ANESVET V14 — Hardening

V14 เน้นความทนทานของระบบมากกว่าการเพิ่ม clinical feature

- IndexedDB archive เป็น primary storage และยกเลิก hard cap 50 cases
- current case ยัง autosave localStorage และ mirror เข้า IndexedDB
- First anesthesia record reminder เริ่มนับตั้งแต่ Start case
- Auto screen Wake Lock ระหว่าง anesthesia/recovery
- Plausibility validation ก่อนบันทึก vital signs
- Hospital Protocol name/version/verified date + Lock/Unlock
- Freeze protocol snapshot ตอนเริ่มเคส
- Case audit trail
- Locked final record ไม่ Load กลับมาแก้ original โดยตรง
- Add amendment/addendum ให้ locked record
- PDF แสดง protocol, amendments และ audit trail
- Backup/Restore รวม IndexedDB archive + protocol audit

URL:
https://seeyouloverreallife-debug.github.io/ANESVET/?v=14
