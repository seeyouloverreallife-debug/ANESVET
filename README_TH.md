# ANESVET V17.2.0 — Backend-ready Sync & Conflict Review

รุ่นนี้ต่อจาก V17.1.0 โดยเน้นทำให้ sync architecture พร้อมต่อ backend จริงมากขึ้น แต่ยัง **ไม่เปิด concurrent multi-device editing เป็น production feature**

## จุดสำคัญ
- local clinical save ยังเป็นหลัก และ network fail ห้ามทำให้บันทึก clinical ไม่ได้
- เพิ่ม provider-neutral HTTP/LAN sync transport contract
- เพิ่ม capability probe สำหรับตรวจ endpoint โดยไม่ส่งข้อมูลเคส
- unresolved conflict จะ hold การ sync ของเคสนั้นทุก sync pass
- Conflict Review Center ใช้ดู/mark reviewed/export evidence แต่ไม่ overwrite หรือ resolve clinical conflict
- remote pull เป็น preview-only และไม่ apply เข้าเคส
- offline case snapshot ที่ยังไม่เคยส่งสามารถ coalesce เพื่อลด queue บวม
- medication และ Final Lock ไม่ถูก coalesce

## Compatibility
- `DB_VERSION = 2`
- `backupSchema = 3`
- Identity/Roles และ permission model เดิมคงอยู่
- queue/conflict จาก V17.1 ถูกเก็บต่อ ไม่เริ่มใหม่

## Production status
ยังไม่มี canonical server จริงใน package นี้ และยังต้องทำ real-device + real two-device network/fault testing ก่อนใช้หลายเครื่องพร้อมกันในงานจริง

อ่านเพิ่ม:
- `RELEASE_NOTES_V17_2_0.md`
- `ARCHITECTURE_V17_2_0.md`
- `SERVER_CONTRACT_V17_2_0.md`
- `SYNC_BACKEND_GUIDE_V17_2_TH.md`
- `KNOWN_LIMITATIONS_V17_2_0.md`
- `QA_V17_2_0.md`
