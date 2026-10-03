# ANESVET V17.6.6 — Architecture Consolidation Phase 4A

## เป้าหมาย
เริ่มลด coupling ของ `app.js` แบบ incremental โดยไม่เปลี่ยน clinical behavior, case schema, storage semantics หรือ workflow เดิม

## การเปลี่ยนแปลง
- เพิ่ม `app-pure-utils.js` เป็น boundary สำหรับ helper ที่ไม่มี side effect
- ย้าย helper 5 กลุ่มแรกออกจาก ownership ของ `app.js`: numeric display formatting, drug-library normalization, medication formula labels, drug phase labels และ recovery-handoff drug-name normalization
- `app.js` คงชื่อ binding เดิมไว้เพื่อ backward compatibility กับ controller/inline code เดิม
- เพิ่ม pure-utils เข้า service-worker precache เพื่อให้ startup offline ยังทำงานได้
- version/cache อัปเดตเป็น V17.6.6

## สิ่งที่ไม่ได้เปลี่ยน
- dose calculation / dose reference
- alert thresholds
- patient/case data schema
- save/restore/archive/final lock
- OR / Recovery clinical workflow
- medication administration semantics

## Validation ใน build environment
- JavaScript syntax check ทุกไฟล์: PASS
- pure utility equivalence checks: PASS
- duplicate HTML id: 0
- local script/style reference check: PASS

## หมายเหตุ
Phase 4A จงใจแยกเฉพาะ low-coupling pure helpers ก่อน เพื่อให้ regression surface เล็กและ rollback ง่าย การแยก stateful domain logic จะทำเป็น phase ถัดไปหลังทดสอบ build นี้บนอุปกรณ์จริง
