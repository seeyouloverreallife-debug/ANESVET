# ANESVET V15.20.0 — Drug Quick Preset Priority

## เป้าหมาย
ทำให้หน้า Drug Calculator เปิดมาแล้วเห็นยาที่โรงพยาบาลใช้ประจำและปริมาณที่ต้องเตรียมก่อนส่วนอื่น ลดการเลื่อนหา calculator card รายตัว โดยไม่เปลี่ยนสูตรคำนวณหรือ clinical workflow เดิม

## Hospital Quick Presets เป็น Primary View
- ย้าย `Hospital Quick Presets` ขึ้นมาอยู่ทันทีใต้หัว `Drug Calculator`
- เรียงตามลำดับใช้งานจริง: `Pre-anesthetic → Induction → Post-anesthetic`
- แสดง `Current BW` ในกล่องเดียวกับ Quick Presets
- Quick Preset แต่ละรายการแสดง:
  - ชื่อยา
  - ปริมาณฉีดที่คำนวณได้ (`mL`)
  - concentration ที่ระบบตั้งไว้
- Hospital Drug Library preset ใช้ concentration/unit ที่บันทึกไว้ใน Drug Library
- Built-in NSAID เลือก concentration ตาม species เดิมของระบบ (Carprofen ใน dog / Meloxicam ใน cat)
- Built-in Cefazolin และ Convenia ใน source เดิมเป็น hospital formula โดยไม่มี concentration field จึงแสดง `Conc not configured` แทนการเดาค่า

## Workflow polish
- `Case Drug Plan` ย้ายลงมาเป็นขั้นถัดจาก Quick Presets
- เพิ่ม `ต่อไป: Case Drug Plan ↓` เพื่อไปยังแผนยาได้ทันที
- ปุ่ม `⚙ Presets` เปิด Settings และเปิดหมวด Quick Presets ที่ถูกพับไว้อัตโนมัติ
- Calculator/reference รายละเอียดยังคง progressive disclosure แบบ V15.19 เพื่อลดการเลื่อน
- ถ้า preset ยังไม่ได้กำหนด จะแสดงสถานะจางลงแทนการทำให้ดูเหมือนมี calculation ที่พร้อมใช้

## Safety / clinical behavior
- ไม่เปลี่ยน dose, divisor, concentration defaults, drug formulas หรือ rounding ของระบบเดิม
- ไม่เปลี่ยน Case Drug Plan freeze, Actual administered, OR LIVE medication confirmation, readiness gate หรือ recovery workflow
- concentration ที่แสดงคือค่าที่ถูกตั้งอยู่จริงใน ANESVET ไม่ใช่ค่าที่ระบบสร้างขึ้นใหม่
- Planned/calculated volume ยังไม่ถือว่าเป็น Actual administered

## Compatibility
- ใช้ storage keys และข้อมูลเดิมทั้งหมด
- Quick Presets / Hospital Drug Library ของผู้ใช้เดิมยังใช้ต่อได้
- เพิ่มเฉพาะ presentation metadata และ CSS สำหรับ primary drug view
