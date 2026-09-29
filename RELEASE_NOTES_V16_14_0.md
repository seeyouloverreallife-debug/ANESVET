# ANESVET V16.14.0 — Problem → Intervention → Response Review

## เป้าหมาย
เพิ่มชั้น review แบบ read-only เพื่อให้ย้อนดูว่าแต่ละ alert/complication เกิดอะไรขึ้น มี intervention อะไร และมี follow-up/outcome อะไรถูกบันทึกไว้ โดยไม่เพิ่มคำแนะนำการรักษาอัตโนมัติ

## สิ่งที่เพิ่ม
- Timeline page เพิ่ม **Problem → Intervention → Response** review panel
- สรุปจำนวน episode, episode ที่มี intervention, follow-up evidence และ unresolved item
- Filter: All / Active / Resolved
- Alert episode เชื่อม:
  - trigger / acknowledgement
  - documented intervention
  - first later recorded value ของ metric เดียวกัน
  - classification เทียบกับ threshold ที่เก็บใน episode
  - documented resolution / duration
- Structured complication เชื่อม:
  - assessment + onset snapshot
  - initial intervention
  - response/action snapshots
  - documented outcome / resolution
- Active item มี shortcut กลับไป Active Problem panel เดิม
- Full PDF เพิ่มส่วน Problem → Intervention → Response Review

## Safety boundary
V16.14 เป็น review layer เท่านั้น
- ไม่สร้างยา / intervention
- ไม่ mark treatment ว่าสำเร็จหรือล้มเหลว
- ไม่เปลี่ยน alert thresholds
- ไม่เปลี่ยน dose calculation
- ไม่เปลี่ยน Recovery readiness
- ไม่เปลี่ยน Final Lock
- ไม่เพิ่ม hard block
- ไม่เปลี่ยน IndexedDB schema

การจับคู่ follow-up ใช้ความสัมพันธ์ตามเวลา (first later documented measurement) ไม่ใช่ causal inference

## Compatibility
V16.13 data ใช้ต่อได้โดยไม่ migration database
