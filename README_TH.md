# ANESVET V14.6 — Clinical Workflow Integrity

## V14.6
- เพิ่ม **Structured Complication Workflow** สำหรับ onset → assessment/intervention → response → resolution
  - Quick complication จาก OR LIVE / Events: Hypotension, Bradycardia, Hypoxemia, Hypercapnia/hypoventilation, Arrhythmia, Hypothermia
  - เก็บ monitor snapshot ตอนเริ่ม, response snapshots และ outcome note
  - Active complication แสดงบน OR LIVE และ **ต้อง resolve/document outcome ก่อน Lock final record**
  - Linked complication events ลบตรง ๆ ไม่ได้ เพื่อคง clinical audit trail
- เพิ่ม **Medication Administration Audit** แยก calculated dose ออกจาก actual administration
  - บันทึก actual amount/rate, unit, route, concentration/preparation, ผู้ให้ยา, source และ case phase
  - Drug Calculator, Anesthesia Plan และ manual Drug event จะผ่าน confirm-administration workflow เดียวกัน
  - เตือนเมื่อมีชื่อยาเดียวกันถูกบันทึกซ้ำภายในช่วงสั้น ๆ
  - Administration record ไม่ลบ; ใช้ **Void + reason + actor** และเก็บ original entry ไว้
  - Linked medication events ลบตรง ๆ ไม่ได้
- เพิ่ม **Recovery Readiness Score** แบบ internal documentation aid
  - 5 domains: airway/breathing, oxygenation, temperature, mentation, comfort/nausea
  - 0–2 ต่อ domain; oxygenation/temperature รองรับ N/A พร้อม N/A reason
  - เก็บ score history พร้อม recovery time และ physiologic snapshot
  - อย่างน้อย 1 score ถูกนำมาร่วมใน Recovery readiness review
  - Score นี้ **ไม่ใช่ validated discharge score** และไม่แทน clinical judgment
- PDF/Archive แสดง Complication workflow, Medication administration audit และ Recovery score history
- Events CSV เพิ่ม linkage IDs สำหรับ Drug Administration / Complication
- Archive card แสดงจำนวน structured drug administrations และ complications
- เพิ่ม regression + workflow-scenario tests สำหรับเส้นทาง Patient Setup → OR → complication/drug audit → Recovery → Lock/Archive

## Safety behavior carried forward
- Fresh case ไม่มี default BW หรือ vital signs
- Current BW ต้องกรอกและ Save ก่อน Start case / weight-based drug administration
- Reset current case ล้าง current-case fields ทุกหน้า แต่ไม่ลบ Patient Master / Archive / Settings
- HN / Patient ID แยกจาก Visit / Case ID
- Patient Master duplicate protection + Retire / Restore / Merge alias
- Multi-tab active-session protection
- Temperature display °C/°F โดย clinical storage ใช้ canonical °F เพื่อรักษา historical compatibility
- Recovery explicit N/A + reason
- Locked final record checksum / audit trail / backup migration

## Tests
รันจากโฟลเดอร์ ANESVET:

```bash
node --check app.js
node tests/regression.mjs
node tests/workflow_scenarios.mjs
```

`tests/pdf_stress_fixture.html` ใช้ตรวจ printable layout โดยไม่แตะข้อมูลผู้ป่วยจริง

Storage keys remain `anesvet_v14_3_*` intentionally so existing V14.3+ data upgrades in place.
