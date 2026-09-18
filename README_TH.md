# ANESVET V14.6.2 — Critical Alerts & Quick Guides

## V14.6.2
- เพิ่ม **Critical Alert Popup** ระหว่าง active anesthesia case
  - MAP <60 mmHg → Hypotension quick guide
  - SpO₂ <90% → Hypoxemia quick guide
  - แสดงเพียงครั้งเดียวต่อ alert episode และจะ re-arm เมื่อค่ากลับพ้น critical threshold แล้วเกิดซ้ำ
  - ไม่เด้งขณะกำลังพิมพ์ค่า MAP / SpO₂ และไม่ซ้อนทับ dialog อื่น
  - เปิด/ปิดได้จาก Hospital Settings
- เพิ่ม **Clinical Quick Guides** บน OR LIVE
  - Hypotension, Bradycardia, Hypoxemia, Ventilation/ETCO₂, Hypothermia
  - เน้น verify monitor → reassess physiology/anesthetic depth → basic troubleshooting → escalate per hospital protocol
  - ไม่ใส่ fixed drug doses เพื่อไม่แทน clinical judgment หรือ local protocol
  - จาก guide สามารถกด **Record complication** ต่อเข้าสู่ structured complication workflow ได้ทันที
- เพิ่ม **Show SAP / DAP helper fields** ใน Hospital Settings
  - ปิดได้ทั้ง OR LIVE, Monitoring cards, record preview, record table columns และ BP trend series
  - MAP ยังเป็น BP alert หลัก
  - การซ่อนเป็น UI preference เท่านั้น ข้อมูล SAP/DAP เดิมใน record/export ไม่ถูกลบ
- คงโลโก้ ANESVET ใหม่จาก V14.6.1
- อัปเดต PWA cache/version เป็น V14.6.2

## V14.6
- เพิ่ม **Structured Complication Workflow** สำหรับ onset → assessment/intervention → response → resolution
- เพิ่ม **Medication Administration Audit** แยก calculated dose ออกจาก actual administration
- เพิ่ม **Recovery Readiness Score** แบบ internal documentation aid
- PDF/Archive แสดง complication, medication administration audit และ recovery score history

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
