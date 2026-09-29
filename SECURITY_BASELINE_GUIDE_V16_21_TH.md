# คู่มือ ANESVET V16.21 — Staff Identity & Local Security

## เปิดใช้งานครั้งแรก
1. ไปที่ **Settings → Staff Identity & Local Security**
2. ใส่ชื่อ Administrator คนแรก
3. ตั้ง PIN ตัวเลข 6–12 หลัก
4. กด **Enable local security**
5. เพิ่มรายชื่อสัตวแพทย์ / พยาบาล / ผู้ช่วยตามที่ใช้งานจริง

หลังเปิด Security แล้ว ANESVET จะขอ PIN เมื่อเปิด/รีโหลดแอปใหม่

## Role ที่มีใน V16.21
- **Administrator** — จัดการผู้ใช้, ทำ clinical documentation, Final Sign-off, Protocol Governance
- **Veterinarian** — clinical documentation, Final Sign-off, Protocol Governance
- **Nurse/Technician** — clinical documentation
- **Assistant** — clinical documentation

Role รุ่นนี้เป็นโครงพื้นฐาน ยังไม่ใช่ permission system รายปุ่มแบบเต็มรูปแบบ

## Final Sign-off
ถ้าเปิด Security:
- กด Sign anesthetist / Sign surgeon
- เลือก staff identity
- ใส่ PIN อีกครั้ง
- ชื่อที่ยืนยันต้องตรงกับชื่อผู้รับผิดชอบที่ระบุในเคส
- ANESVET จะเก็บ staff ID + role + local PIN authentication metadata ไว้ใน sign-off

## Protocol Governance
Draft / Review / Publish / Retire จะขอ PIN ยืนยันผู้ทำรายการเมื่อเปิด Security แล้ว โดย Nurse/Assistant จะไม่สามารถยืนยัน action เหล่านี้ด้วย role ของตนเองได้

## Lock
- กดชื่อผู้ใช้ด้านบนเพื่อ Lock ทันที
- ตั้ง auto-lock เมื่อแอปอยู่ background ได้ 5 / 15 / 30 / 60 นาที
- ค่าเริ่มต้น 15 นาที
- ถ้าใส่ PIN ผิด 5 ครั้ง ระบบจะหน่วงการลองใหม่ 30 วินาทีบน session นั้น เพื่อลดการเดาสุ่มแบบต่อเนื่อง

## Backup
Clinical Full Backup **ไม่รวม PIN hash / staff security credential registry** เพื่อไม่ให้ไฟล์ clinical backup กลายเป็นไฟล์ credential แบบพกพา

ถ้าย้ายไปเครื่องใหม่ ให้ Restore clinical backup แล้วตั้ง Staff Identity/PIN ของเครื่องนั้นใหม่

## ข้อควรรู้
ระบบนี้ช่วยควบคุมการเข้าถึงบนเครื่องเดียว แต่ยังไม่ใช่ cloud login, enterprise RBAC, encryption-at-rest หรือ qualified electronic signature
