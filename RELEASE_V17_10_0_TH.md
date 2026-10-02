# ANESVET V17.10.0 — Clinical Workflow Simplification I

## Clinical Next Step
เพิ่ม action กลางใน Current Case hub เพื่อบอกว่า ตอนนี้ควรทำอะไรต่อ โดยอ่าน state ที่มีอยู่แล้วและเรียก native action เดิมเท่านั้น

ลำดับหลัก: Patient → Pre-check → Case Drug Plan → readiness gate → OR LIVE → Recovery → End Case.

Clinical Next Step ไม่ mark checklist, ไม่ freeze plan, ไม่ Start Case, ไม่ Complete Recovery และไม่ Final Lock เอง การกระทำเหล่านี้ยังผ่าน safety gate/controller เดิมทั้งหมด

## UX intent
ผู้ใช้ไม่ต้องจำว่าเคสค้างอยู่หน้าไหนหรือควรกดเมนูใดต่อ เมื่อเปิด Current Case จะเห็นงานถัดไปและปุ่มหลักเพียงหนึ่งปุ่ม
