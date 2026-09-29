# ANESVET V17.2.2 — Mobile Active-case Rescue Hotfix

รุ่นนี้เป็น hotfix บนฐาน V17.2 สำหรับปัญหา **มือถือ/PWA ค้างอยู่กับ active case, update ถูกเลื่อนเพราะมีเคสอยู่ และกลับ OR LIVE ไม่ได้**

จุดสำคัญของ V17.2.2:
- ไม่ต้อง Reset current case เพื่ออัปเดต
- ไม่ต้อง Clear App Data / ลบ site data / ถอนการติดตั้ง
- update ที่เริ่มจากรุ่นนี้จะ verify local save + safety checkpoint ก่อน reload
- เคสที่เริ่มวางยาแล้วจะ resume กลับ OR LIVE โดยตรงหลังเปิดใหม่
- stale multi-tab lock สามารถคืน control อัตโนมัติเมื่อ owner เดิมหาย
- service worker รุ่น rescue ใช้เพื่อออกจาก waiting-update deadlock ของรุ่นเก่า

อ่านก่อนทดสอบบนมือถือ:
- `RELEASE_NOTES_V17_2_2.md`
- `MIGRATION_V17_2_1_TO_V17_2_2.md`
- `QA_V17_2_2.md`

---

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
