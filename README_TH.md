# ANESVET V17.2.4 — Global Interaction Gate Repair

Hotfix สำหรับอาการบน iPad/Android/PWA ที่ **ช่องข้อความยังพิมพ์ได้ แต่ปุ่ม/ASA/navigation/action ส่วนใหญ่กดไม่ได้** แม้ไม่มี active case

สาเหตุใน source ที่แก้ในรุ่นนี้:
- Session Controller ถูก `bind()` ขณะยังเป็น `initializing`
- global interaction guard เดิม block ทุกสถานะที่ไม่ใช่ `active` จึง block `initializing` ด้วย
- session initialization เดิมเกิดช้ามากตอนท้าย startup หลัง async sync/IndexedDB work
- ถ้า startup ช้าหรือหยุดก่อนจุดนั้น UI จะอยู่ใน silent click-block state ได้

V17.2.4 เปลี่ยน invariant เป็น:
- establish session ownership ก่อนติด global interaction guard
- **มีเพียง explicit `VIEW ONLY` เท่านั้นที่ block clinical controls**
- `initializing` ไม่สามารถเป็น global click shield
- session init ทำซ้ำได้อย่างปลอดภัย (idempotent)
- หาก session initialization error และไม่มี fresh competing writer lock จะคืน local control แทนการ freeze UI
- view-only text editing ใช้ `beforeinput` guard เพิ่ม ไม่พึ่ง non-cancelable `input` event

Compatibility:
- `DB_VERSION = 2`
- `backupSchema = 3`
- ไม่แก้ dose/medication/Recovery/Final Lock/Archive clinical semantics
- critical clinical/runtime parity 18/18 เทียบ V17.2.3

อ่านเพิ่ม:
- `RELEASE_NOTES_V17_2_4.md`
- `MIGRATION_V17_2_3_TO_V17_2_4.md`
- `QA_V17_2_4.md`

---

# ANESVET V17.2.3 — Active Case State Repair

Hotfix สำหรับเคสบน Android/PWA ที่ **เคสเริ่มแล้ว แต่ state กลับค้างเป็น SETUP / NOT SAVED และกลับ OR LIVE ไม่ได้**

จุดสำคัญ:
- active case ที่มีหลักฐานว่าเริ่มแล้วจะ resume clinical workspace ก่อนสถานะ Patient Setup
- `caseStartedAt + casePhase=setup` ถูกซ่อมเป็น generic `intraop` โดยไม่สร้าง clinical event ใหม่
- ไม่ตั้ง `patientSaved=true` อัตโนมัติ
- ถ้า Current BW/identity บางช่องหาย จะเติมได้เฉพาะจาก frozen case-start snapshot ที่มีอยู่แล้ว และเฉพาะช่องที่ว่าง
- ปุ่มลอยกลับ OR LIVE ใช้ direct rescue path + Android pointer fallback
- stale `inert` / restored dialog จะถูกกู้ก่อน resume เมื่อ Identity ไม่ได้ล็อกจริง

อ่านก่อนทดสอบบนเครื่องที่มีปัญหา:
- `ANDROID_ACTIVE_CASE_RESCUE_V17_2_3_TH.md`
- `RELEASE_NOTES_V17_2_3.md`
- `MIGRATION_V17_2_2_TO_V17_2_3.md`
- `QA_V17_2_3.md`

---

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
