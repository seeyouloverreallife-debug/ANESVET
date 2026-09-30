# ANESVET V17.2.26 R22 — วิธีติดตั้งและทดสอบ UX

## อัปเดต GitHub Pages (ไม่ลบข้อมูล)
1. เก็บ ZIP checkpoint ต้นฉบับ V17.2.25 ไว้เพื่อ rollback
2. สำรองเคสจากหน้า Cases / Archive ของโปรแกรมเก่าก่อนอัปเดต ถ้าสามารถใช้งานได้
3. เปิด repo ที่ deploy ANESVET อยู่ ไปที่ root (ที่มี index.html เดิม)
4. แตก `ANESVET_V17_2_26_R22_UX_DEPLOY_6_FILES.zip` และอัปโหลดทั้ง **6 ไฟล์** ไปแทนที่/เพิ่มใน root ของ repo (ห้ามอัปโหลดโฟลเดอร์แม่)
5. รอ deployment เสร็จแล้วเปิด URL เดิม ตรวจว่าแสดง V17.2.26
6. ห้าม Clear site data / ถอนการติดตั้ง PWA ก่อน export สำรองเคส โดยเฉพาะเคสที่บันทึกไว้ในเครื่องเดียว
7. ลอง mock case: Patient → Pre-check → Medications → OR LIVE → Record vitals → Recovery → Handoff → End Case

ไฟล์ใน patch (6): index.html, app.js, manifest.webmanifest, service-worker.js, clinical-simplicity.css, clinical-simplicity.js
Full ZIP: มี source ต้นฉบับทั้งหมดและไฟล์ทดสอบใหม่ เหมาะกับ backup/restore งานพัฒนา

หมายเหตุ: บน iPhone/iPad/Android PWA ให้ทดสอบ backup, current case, phase transition, การบันทึกค่าและ meds อย่างละเอียดก่อนใช้กับผู้ป่วยจริง
