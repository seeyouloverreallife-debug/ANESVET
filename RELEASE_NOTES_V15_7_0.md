# ANESVET V15.7.0 — Pre-OR Readiness & Workflow Guard Release

V15.7.0 ต่อจาก V15.6.0 โดยแก้ปัญหาที่ผู้ใช้สามารถเปิด OR LIVE หรือ Recovery ได้ทั้งที่ยังไม่ได้เตรียมข้อมูลเคส และเมื่อเข้า focus mode แล้วหาทางกลับยาก โดยไม่เปลี่ยน dose defaults, alert thresholds, ASA interpretation, BOAS logic, fluid references หรือ medication calculations เดิม

## Pre-OR Readiness Gate

ก่อนเข้า OR LIVE ในเคสที่ยังไม่ Start ระบบตรวจความพร้อมสองระดับ:

### Hard blockers — ข้ามไม่ได้
- Patient name
- Species
- Current body weight
- Patient & Case Setup ต้องถูก Save

### Required clinical readiness
- Procedure
- ASA Physical Status
- Structured pre-anesthetic physical examination ที่กดบันทึกแล้ว
- Structured anesthetic risk review ที่กดบันทึกแล้ว
- Pre-op checklist ถูก review ครบเป็น Done หรือ N/A

หาก required clinical readiness ยังไม่ครบ ระบบจะแสดงรายการที่ขาดและมีปุ่มพาไปยังจุดแรกที่ต้องแก้แทนการเปิด OR LIVE ทันที

## Documented clinical override

กรณีจำเป็นเร่งด่วนและ hard blockers ครบแล้ว สามารถใช้ `Emergency / clinical override` ได้ โดยต้องระบุ:
- เหตุผลที่ต้องดำเนินการก่อน readiness ครบ
- Responsible clinician

ระบบบันทึก `PRE_OR_READINESS_OVERRIDE` ลง audit trail พร้อมรายการ requirement ที่ยังขาด ณ เวลาที่ override

Override จะใช้ได้เฉพาะกับชุด blocker เดิม หากข้อมูล readiness เปลี่ยนก่อนเริ่มเคส override เดิมจะถูก invalidate และต้องทบทวนใหม่

## Recommended items

รายการต่อไปนี้ยังไม่บล็อกการเปิด OR แต่จะแสดงเป็น warning ให้ทบทวน:
- Case Drug Plan ยังไม่ได้ Save / Review
- Anesthetist ยังไม่ได้ระบุ
- Surgeon ยังไม่ได้ระบุ

Case Drug Plan ยังใช้ confirmation/freeze behavior ของ V15.5–V15.6 ก่อน Start Case ตามเดิม

## Recovery workflow guard

Recovery tab จะเปิดได้เฉพาะเมื่อ:
- เคสเริ่มแล้ว และ
- workflow อยู่ใน `recovery` หรือ `complete`, และ
- ไม่ได้อยู่ใน Emergency Return to OR

การเข้า Recovery จาก Extubation / Begin Recovery ภายใน workflow ยังคงใช้ internal transition เดิมและเปิดหน้า Recovery อัตโนมัติ

## Navigation / mobile focus

- OR LIVE เพิ่มปุ่ม `← CASE` ใน sticky workspace
- Recovery เพิ่มปุ่ม `← Case summary`
- Pre-check และ Drug Calculator ใช้ข้อความ `ตรวจความพร้อม → OR LIVE`
- OR LIVE และ Recovery tabs แสดงสถานะ lock เมื่อยังเข้า phase นั้นไม่ได้

## Compatibility / safety

- storage keys และ IndexedDB schema ไม่เปลี่ยน
- เคสเก่าเปิดได้ โดย field `preOrReadinessOverride` จะ default เป็น `null`
- Active case ที่เริ่มไปแล้วสามารถกลับเข้า OR LIVE ได้ตาม workflow เดิม ไม่ถูก readiness gate ใหม่ขวางกลางเคส
- Recovery Emergency Return, Confirm/Undo, Case Drug Plan, medication safety, local autosave/checkpoint, Compact/Full PDF และ Final Lock logic เดิมยังคงอยู่

## Test status

ผ่านใน runtime นี้:
- JavaScript / JSON syntax
- static regression + backward-compatibility contracts
- V15.7 readiness/navigation contracts
- Clinical workflow helpers: 73 assertions
- Workflow model scenarios: 4 scenarios

DOM/browser automation ยังไม่อ้างว่าผ่าน เนื่องจาก runtime ไม่มี `jsdom/fake-indexeddb/Playwright`; test ที่ต้องใช้ DOM dependency จึงหยุดด้วย `MODULE_NOT_FOUND: jsdom` ตามข้อจำกัดเดิม
