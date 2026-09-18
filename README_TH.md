# ANESVET V10 — Clinical Polish & Safety

V10 ยังคงเป็น single-user / local-first และเน้นความปลอดภัยกับ workflow ในห้องผ่าตัด มากกว่าการเพิ่มเมนูใหม่

## ใหม่ใน V10
- แก้ timer runtime issue จาก V9
- Autosave indicator: Saved locally + เวลา
- OR LIVE จัด hierarchy ใหม่: HR / MAP / SpO2 / ETCO2 เด่นกว่า RR / Temp
- Record countdown และปุ่ม RECORD DUE
- Prioritized alerts: Immediate ก่อน Trend
- Protection ก่อน reset/new case และ warning เมื่อปิดหน้าขณะ timer RUNNING
- Record correction history: ค่าเดิม → ค่าใหม่ + reason
- Drug administration confirmation ก่อนบันทึกยาที่ให้จริง
- Recovery mode + recovery timer + recovery complete
- Full backup / restore: current case + archives + settings
- PDF เพิ่ม correction history และข้อมูล recovery phase

## Update
Upload ไฟล์ทั้งหมดทับเวอร์ชันเดิม แล้ว Commit
เปิด:
https://seeyouloverreallife-debug.github.io/ANESVET/?v=10
