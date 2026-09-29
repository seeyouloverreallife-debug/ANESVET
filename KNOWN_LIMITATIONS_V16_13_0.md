# Known Limitations — ANESVET V16.13.0

## Procedure Templates 2.0
1. Hospital template library เป็น local-first และผูกกับ browser/profile/device นั้น จนกว่าจะ Export/Import หรือใช้ Full Backup/Restore
2. Built-in templates เป็น read-only; หากต้องการปรับให้ Duplicate/สร้าง hospital template ใหม่
3. Template ถูก freeze เมื่อ active case เริ่มแล้ว จึงไม่เปลี่ยนตาม library จนกว่าจะเป็นเคสใหม่
4. การลบ template จาก library ไม่ลบหรือแก้ snapshot ที่ถูก freeze ใน active/archived case
5. Import แบบ merge ใช้ template ID เป็นตัวระบุ; template ที่มี ID เดียวกันจากไฟล์ import จะเข้ามาแทนค่าของ ID นั้น ไม่มี conflict-resolution UI แยก
6. `chartingIntervalMin` เป็น documentation reminder ไม่ใช่คำแนะนำ clinical monitoring frequency สำหรับผู้ป่วยทุกตัว
7. Fluid/setup note เป็นข้อความเท่านั้น ไม่มี automatic fluid rate
8. Medication shortcut ไม่ได้เพิ่มยาให้ frozen protocol และไม่ถือว่าได้ให้ยา; หากหา matching medication ไม่พบ ระบบเปิด medication workspace เพื่อให้ผู้ใช้ review ต่อ
9. Quick event / milestone จะสร้าง record เมื่อผู้ใช้กดเท่านั้น ระบบไม่อนุมานว่าเหตุการณ์เกิดขึ้นจริง
10. Template configuration ไม่ได้เปลี่ยน dose, route, concentration, threshold หรือ treatment decision

## Device / QA boundary
- Browser smoke test ใช้ Chromium mobile viewport 390×844 ใน injected runtime เพราะ build environment จำกัด direct localhost/file navigation
- ยังควรทดสอบบน installed Android PWA จริง โดยเฉพาะ long case, soft keyboard, offline/reload, app switching และ PWA update ระหว่าง active case
