# ANESVET V15.19.0 — Progressive Disclosure & Compact Workflow

ต่อยอดจาก V15.18.0 โดยลดการเลื่อนในหน้าที่มีข้อมูลยาว โดยเฉพาะ Settings และส่วนอ้างอิง/ประวัติที่ไม่ได้ต้องใช้ตลอดเวลา

## จุดใหม่
- Settings เปลี่ยนเป็น **collapsed sections** ทุกหมวด: เห็นหัวข้อก่อน แล้วค่อยแตะ `เปิด` เพื่อแก้รายละเอียด
- เพิ่มช่อง **ค้นหา Settings** เช่น `logo`, `alert`, `Drug Library`
- มี `พับทั้งหมด / เปิดทั้งหมด`
- จำสถานะการเปิด/พับของแต่ละหมวดไว้ในเครื่อง
- Patient / Pre-check สามารถพับส่วนรองได้ แต่ clinical core ยังเปิดไว้ก่อน
- Drug Calculator ซ่อนส่วน reference ยาว ๆ ไว้ก่อน ได้แก่ peri-anesthetic calculator, phase plan และ emergency reference
- Recovery ซ่อน Handoff และ vital history ไว้ก่อน ส่วน unresolved alerts / readiness score ยังไม่ถูกซ่อน
- ถ้า input ที่อยู่ใน section พับไว้ได้รับ focus/validation ระบบจะเปิด section นั้นให้อัตโนมัติ
- ไม่เปลี่ยน clinical calculation, dose, alert threshold, workflow gate, storage schema หรือ report content

## การอัปเดตบน GitHub Pages / PWA
หลังแทนไฟล์รุ่นเดิม แนะนำเปิดครั้งแรกด้วย `?v=15.19.0` หรือ Hard Refresh หนึ่งครั้ง เพื่อเปลี่ยน service-worker cache

## หมายเหตุ
ANESVET เป็น workflow/documentation aid สำหรับทีมสัตวแพทย์ ไม่แทน clinical judgment, monitor source data หรือ hospital protocol
