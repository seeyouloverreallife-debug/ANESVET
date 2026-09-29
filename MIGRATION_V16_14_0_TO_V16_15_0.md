# Migration — V16.14.0 → V16.15.0

## Database
- `DB_VERSION` คงเดิมที่ 2
- ไม่มี IndexedDB schema migration
- storage keys เดิมทั้งหมด

## State compatibility
โหลดเคสเก่าโดยเพิ่มค่า default เฉพาะเมื่อไม่มีข้อมูล:
- `recoveryTransfers = []`
- structured Recovery fields เป็นค่าว่าง

Recovery record เก่าที่ไม่มี `painScale`, `painScore`, `dysphoria`, `nausea`, `ambulation` ยังคง render ได้ตามเดิม

## New current-case fields
- `recPainScale`
- `recPainScore`
- `recDysphoria`
- `recNausea`
- `recAmbulation`
- `recDestination`
- `recHandoffTo`
- `recTransferNote`

## Backup
ข้อมูลใหม่อยู่ใน current/archive case object เดิม จึงถูก Full Backup/Restore โดยอัตโนมัติ ไม่ต้องเปลี่ยน backup schema
