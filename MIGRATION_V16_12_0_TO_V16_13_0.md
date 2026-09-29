# Migration — ANESVET V16.12.0 → V16.13.0

## Data migration
- **ไม่มี IndexedDB schema migration**
- `DB_VERSION` คงเดิมที่ 2
- current case / archive / patient master / drug library / quick presets เดิมไม่ถูกแปลงโครงสร้าง

## New local storage
เพิ่ม key:
- `anesvet_v16_procedure_template_library`

Key นี้เก็บเฉพาะ hospital-defined Procedure Templates 2.0

## Existing procedure templates
- Built-in templates เดิมยังมีครบ 9 แบบ
- เคสเก่าที่มี template snapshot แบบเดิมยังคงอ่านผ่าน compatibility logic
- เคสใหม่ที่ freeze hospital template ใช้ snapshot schema 2 เพื่อเก็บ quick documentation configuration ภายในเคส

## Full Backup / Restore
Full Backup V16.13 เพิ่ม `procedureTemplates`

Restore:
- backup V16.13 ที่มี procedure template library → restore library
- backup รุ่นเก่าที่ไม่มี field นี้ → ไม่ลบ library ปัจจุบันเพียงเพราะ field หาย

## PWA cache
cache/version assets ถูก bump เป็น V16.13.0 เพื่อหลีกเลี่ยง HTML/JS/CSS รุ่นเก่าปะปนกับ Procedure Templates 2.0
