# ANESVET V14.4 — Patient History & Data Integrity

## V14.4
- แยก **HN / Patient ID** (คงที่ใน Patient Master) ออกจาก **Visit / Case ID** (ข้อมูลเฉพาะ visit)
- Patient Master แสดง **Previous anesthesia history** จาก Archive พร้อมวันที่, procedure, ASA, Visit ID และ recorded concerns ที่ตรวจพบจาก record เดิม
- เพิ่ม Patient lifecycle tools: **Retire / Restore / Merge duplicate** โดย Merge จะไม่ rewrite locked anesthesia records; ใช้ alias ของ patient ID เพื่อเชื่อม history แทน
- เพิ่ม **multi-tab active-session protection**: tab ที่สองเปิดเป็น View only และสามารถ Take control ได้อย่างชัดเจน
- BroadcastChannel + localStorage heartbeat ช่วยลดความเสี่ยง current case ถูกเขียนทับจากหลาย tab
- Backup format เป็น 14.4 และยังรวม Patient Master / aliases / retired status ตามเดิม

## Safety behavior carried forward
- Fresh case ไม่มี default BW หรือ vital signs
- Current BW ต้องกรอกและ Save ก่อน Start case / weight-based drug administration
- Reset current case ล้าง current-case fields ทุกหน้า แต่ไม่ลบ Patient Master / Archive / Settings
- Patient Master ไม่ auto-merge HN/microchip conflict
- IndexedDB blocked-upgrade handling, backup migration, missing-vital protection และ final-record checksum ยังคงอยู่

## Planned next: V14.5 — Clinical UX Polish
- Temperature °C/°F setting with canonical storage
- Recovery N/A handling
- PDF stress testing
- Automated regression tests for case phase, dose, Patient Master matching, age, fluids, archive checksum, backup/restore and recovery transition

Storage keys remain `anesvet_v14_3_*` intentionally so existing V14.3.x data upgrades in place.
