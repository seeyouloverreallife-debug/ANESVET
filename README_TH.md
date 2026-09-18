# ANESVET V14.5 — Clinical UX Polish

## V14.5
- Hospital Settings เลือกการแสดงอุณหภูมิ **°C / °F** ได้ โดย default เป็น °C สำหรับ workflow ในไทย
- เพื่อรักษาความต่อเนื่องกับ V14.x และ checksum ของ locked historical records ระบบเก็บ temperature ภายในเป็น **°F canonical** แล้ว convert เฉพาะตอนแสดงผล/กรอก/พิมพ์ PDF
- Anesthesia record, OR LIVE, Trends, Recovery, Previous anesthesia concern, Response tracking และ PDF แสดง temperature ตามหน่วยที่เลือก
- CSV export เพิ่มทั้ง `Temp_F_canonical` และ `Temp_C` เพื่อไม่ให้ข้อมูลกำกวมเมื่อนำออกไปวิเคราะห์
- Recovery รองรับ **N/A แบบ explicit** สำหรับ SpO₂, Temperature, Extubation และแต่ละ checklist item
- ถ้ามี Recovery N/A อย่างน้อยหนึ่งรายการ ต้องบันทึก **N/A reason**; ระบบไม่ใช้ 0 หรือค่าคาดเดาแทน measurement
- Recovery serial record เก็บ N/A state + reason และแสดงใน report/audit
- PDF/print CSS hardening: repeat table header, prevent row splitting, long-text wrapping และ chart page-break protection
- เพิ่ม automated static regression suite และ PDF stress fixture ในโฟลเดอร์ `tests/`

## Safety behavior carried forward
- Fresh case ไม่มี default BW หรือ vital signs
- Current BW ต้องกรอกและ Save ก่อน Start case / weight-based drug administration
- Reset current case ล้าง current-case fields ทุกหน้า แต่ไม่ลบ Patient Master / Archive / Settings
- HN / Patient ID แยกจาก Visit / Case ID
- Patient Master duplicate protection + Retire / Restore / Merge alias
- Multi-tab active-session protection
- Locked final record checksum / audit trail / backup migration

## Regression tests
รันจากโฟลเดอร์ ANESVET:

```bash
node --check app.js
node tests/regression.mjs
```

`tests/pdf_stress_fixture.html` เป็น printable fixture สำหรับตรวจ layout ตารางยาว, event ยาว และ page breaks โดยไม่แตะ clinical data จริง

Storage keys remain `anesvet_v14_3_*` intentionally so existing V14.3+ data upgrades in place.
