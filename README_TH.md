# ANESVET V17.1.0 — Multi-device Sync Foundation

รุ่นนี้ต่อจาก V17.0.0 โดยวาง **synchronization architecture** ก่อนเชื่อม backend จริง และยังไม่เปิด concurrent multi-device editing เป็น production feature

จุดสำคัญ:
- คง `DB_VERSION = 2` และ `backupSchema = 3`
- Sync metadata envelope: `caseId`, `recordId`, `revision`, `operationId`, `deviceId`, `sessionId`, `actorId`, timestamps และ `baseRevision`
- durable local operation queue พร้อม `pending / acknowledged / failed / conflict`
- local/mock canonical adapter interface: `pushOperations()`, `pullChanges()`, `getCaseRevision()`, `acknowledgeOperations()`
- idempotent operation IDs และ retry-safe ACK handling
- stale-revision conflict detection โดยไม่ใช้ silent last-write-wins
- append-only vital/event สามารถ merge ตาม stable `recordId`
- medication conflict, Final Sign-off/Final Lock/Archive และ clinical void ไม่ถูก auto-collapse
- patient/settings concurrent change ต้อง review
- queue corruption เก็บ evidence ไว้และไม่แตะ clinical data
- Sync Foundation อยู่ใน Settings และ **ปิดเป็น experimental โดยค่าเริ่มต้น**
- clinical local save + safety checkpoint ต้องสำเร็จก่อน sync queue เสมอ; network/sync failure ไม่ block การบันทึกใน OR

ข้อจำกัดสำคัญ: V17.1.0 ยังใช้ local/mock canonical adapter สำหรับ foundation/regression เท่านั้น ยังไม่มี hospital server, cloud canonical record หรือ production-safe concurrent editing หลายอุปกรณ์

เอกสารรุ่นนี้:
- `RELEASE_NOTES_V17_1_0.md`
- `ARCHITECTURE_V17_1_0.md`
- `MIGRATION_V17_0_0_TO_V17_1_0.md`
- `KNOWN_LIMITATIONS_V17_1_0.md`
- `SYNC_FOUNDATION_GUIDE_V17_1_TH.md`
- `QA_V17_1_0.md`

---

# ANESVET V16.22.0 — Case Review & Quality Dashboard

รุ่นนี้ต่อจาก V16.21.0 Security Baseline โดยเพิ่ม dashboard แบบ read-only สำหรับทบทวน archived anesthesia cases หลายเคสพร้อมกัน

ฟีเจอร์หลัก:
- filter Final/Voided/Working archive, ช่วงเวลา, species, protocol version และข้อความค้นหา
- median recorded case elapsed และ Recovery duration
- documented physiologic alert episodes
- structured complication และ Problem → Intervention → Response counts
- Documentation Guardian domain completeness
- frozen protocol version distribution
- Recovery completion override count
- Export review CSV

Dashboard เป็น descriptive review เท่านั้น ไม่ให้คะแนน clinician, ไม่ infer causality และไม่เปลี่ยน clinical record

ดูรายละเอียดที่ `CASE_REVIEW_GUIDE_V16_22_TH.md`, `RELEASE_NOTES_V16_22_0.md` และ `QA_V16_22_0.md`

---

# ANESVET V16.21.0 — Security Baseline

รุ่นนี้เพิ่ม **Staff Identity + Local PIN + Session Lock + Role groundwork + authenticated Final Sign-off / Protocol Governance attribution** บนฐาน V16.20.0 โดยไม่เปลี่ยน IndexedDB clinical schema

## จุดสำคัญ
- local staff directory: Admin / Vet / Nurse-Tech / Assistant
- PIN 6–12 หลัก เก็บเป็น PBKDF2-SHA-256 salted hash ไม่เก็บ PIN ดิบ
- Lock ตอนเปิด/รีโหลดแอปหลังเปิด Security
- background auto-lock 5 / 15 / 30 / 60 นาที
- Final Sign-off ต้อง re-authenticate ด้วย PIN เมื่อ Security เปิดอยู่
- Protocol Governance ใช้ authenticated actor เมื่อ Security เปิดอยู่
- central audit เพิ่ม actorId / actorRole / authMethod metadata
- local security credentials **ไม่รวมใน Full Backup**
- `DB_VERSION = 2` และ `backupSchema = 3` ไม่เปลี่ยน

เอกสารรุ่นนี้:
- `RELEASE_NOTES_V16_21_0.md`
- `ARCHITECTURE_V16_21_0.md`
- `MIGRATION_V16_20_0_TO_V16_21_0.md`
- `KNOWN_LIMITATIONS_V16_21_0.md`
- `SECURITY_BASELINE_GUIDE_V16_21_TH.md`
- `QA_V16_21_0.md`

---

# ANESVET V16.20.0 — Hospital Protocol Governance

รุ่นนี้เพิ่มวงจร **Draft → Reviewed → Published → Retired** สำหรับ Hospital Protocol โดยรักษา clinical calculation/runtime เดิมจาก V16.19.1

## จุดสำคัญ
- versioned protocol registry
- new-case gate ป้องกันการใช้ Draft/Reviewed configuration
- fingerprint drift detection ก่อน Start Case
- freeze governance metadata เข้า case protocol snapshot
- auto-retire version เก่าเมื่อ publish version ใหม่
- protocol registry รวมอยู่ใน Full Backup Schema 3 / Restore / Rollback
- `DB_VERSION = 2` และ `backupSchema = 3` ไม่เปลี่ยน

เอกสารรุ่นนี้:
- `RELEASE_NOTES_V16_20_0.md`
- `ARCHITECTURE_V16_20_0.md`
- `MIGRATION_V16_19_1_TO_V16_20_0.md`
- `KNOWN_LIMITATIONS_V16_20_0.md`
- `HOSPITAL_PROTOCOL_GOVERNANCE_GUIDE_V16_20_TH.md`
- `QA_V16_20_0.md`

---

# ANESVET V16.19.1 — Production Validation & Reliability

Current release adds a persistent Production Validation Center on top of V16.19.0 Data Safety 2.0. Clinical logic and database schema are unchanged.

## V16.19.1 documents
- `RELEASE_NOTES_V16_19_1.md`
- `ARCHITECTURE_V16_19_1.md`
- `MIGRATION_V16_19_0_TO_V16_19_1.md`
- `KNOWN_LIMITATIONS_V16_19_1.md`
- `PRODUCTION_VALIDATION_PROTOCOL_V16_19_1_TH.md`
- `QA_V16_19_1.md`

---

# ANESVET V16.19.0 — Data Safety 2.0

รุ่นนี้พัฒนาต่อจาก V16.18.6 โดยเน้นความปลอดภัยของข้อมูล ไม่ได้เพิ่ม clinical treatment logic ใหม่

## จุดสำคัญ
- Full Backup ใหม่ใช้ `backupSchema = 3`
- เพิ่ม SHA-256 whole-file integrity manifest
- เพิ่ม SHA-256 clinical dataset digest สำหรับ `current + archive + patients`
- เพิ่ม Backup History
- เพิ่ม **Verify backup file** เพื่อตรวจไฟล์ที่ดาวน์โหลดออกมาแล้ว
- เพิ่ม **Mark latest copy off-device** สำหรับบันทึกว่าผู้ใช้ได้เก็บไฟล์ไว้นอก browser/device แล้ว
- เพิ่ม post-restore verification ก่อนถือว่า Restore สำเร็จ
- Schema-2 backup รุ่นเก่ายัง Restore ได้ แต่ตรวจได้แบบ legacy/partial เพราะไม่มี whole-file manifest
- `DB_VERSION = 2` และ clinical record format เดิมไม่เปลี่ยน

> Off-device receipt เป็นการยืนยันโดยผู้ใช้เท่านั้น รุ่นนี้ยังไม่ได้เชื่อม Google Drive/NAS/USB แบบอัตโนมัติ และไม่สามารถยืนยันจากระยะไกลว่าไฟล์ยังอยู่จริง

รายละเอียดเพิ่มเติม:
- `RELEASE_NOTES_V16_19_0.md`
- `ARCHITECTURE_V16_19_0.md`
- `MIGRATION_V16_18_6_TO_V16_19_0.md`
- `KNOWN_LIMITATIONS_V16_19_0.md`
- `QA_V16_19_0.md`
