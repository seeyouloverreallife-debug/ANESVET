# ANESVET V13.4 — Archive PDF & Due Alerts

## Archived case → Export PDF directly
Archived case ทุกเคสมีปุ่ม `Export PDF`
- ไม่ต้อง Load archived case มาแทน current case
- ไม่เปลี่ยน current case ใน localStorage
- สร้าง report จาก archived snapshot แล้วเปิด Print / Save as PDF
- เพิ่ม badge `LOCKED FINAL`
- แสดงจำนวน anesthesia records + recovery records + events

## Sound / vibration reminder
เพิ่มปุ่มด้านบน:
- 🔔 Enable alerts / Alerts ON
- 🔕 Alerts OFF

การทำงาน:
- anesthesia record due → toast + sound + vibration (ถ้า browser/device รองรับ)
- recovery vital due → toast + sound + vibration
- Recovery ใช้เสียง pattern ต่างจาก intraoperative เล็กน้อย
- ไม่ยิงซ้ำทุกวินาที ใช้ due-token ต่อรอบ
- เมื่อบันทึก record ใหม่ token จะ reset

หมายเหตุ:
- Web Audio ต้องผ่าน user gesture ตามข้อจำกัดของ browser
- ระบบ prime audio หลังผู้ใช้แตะหน้าจอครั้งแรก และมีปุ่ม Enable alerts ให้กดโดยตรง
- Vibration API รองรับบาง browser/device โดยเฉพาะ Android; ถ้าไม่รองรับจะยังมี visual + sound/toast

## Additional UX
- Archived cards แสดง LOCKED FINAL
- Archived cards แสดง recovery record count
- Case management แจ้งชัดว่า archived case export PDF ได้โดยตรง
- เก็บ feature เดิมทั้งหมด: OR status tracker, recovery guard, serial recovery monitoring, fluid cockpit, configurable drug presets, backup

## URL
https://seeyouloverreallife-debug.github.io/ANESVET/?v=13.4
