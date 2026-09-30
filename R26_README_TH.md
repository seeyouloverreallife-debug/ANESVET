# ANESVET V17.2.30 — R26 Repeat-use workflow UX

ฐาน: V17.2.29 R25 Full Source เดิม (ไม่สร้างใหม่, ไม่เปลี่ยน schema, data, calculations, safety gates)

## ปรับปรุง

1. **เริ่มเคสถัดไปจากหน้า End Case:** หลัง native Final Lock แล้วจะแสดงทางลัด “＋ เริ่มเคสใหม่”. คลิกแล้วส่งต่อไปที่ปุ่ม `newCaseBtn` ของแอปเดิมเท่านั้น: archive verification, confirm, reset safety ยังคงทำงานทั้งหมด ไม่เริ่มเอง และยังไม่แสดงก่อนล็อกเคส
2. **Recovery keyboard navigation:** Enter ในช่อง HR→RR→MAP→SpO₂→Temp→Mentation→ปุ่มบันทึก. ไม่มี auto-save, ไม่กรอกค่า N/A หรือรับรองความพร้อมอัตโนมัติ ผู้ใช้ยังต้องกดบันทึกเองและตรวจข้อมูล/การเตือนเหมือนเดิม
3. **แยก action** เพิ่ม title บนปุ่มบันทึก Recovery เพื่อระบุชัดว่าเป็นการบันทึกค่าที่กรอก ไม่ใช่เปิดแบบฟอร์ม

## QA และข้อจำกัด

ดู `R26_QA_RESULTS.json` สำหรับผลตรวจ syntax, IDs, PWA assets, core diff และ isolated browser test.
Full application E2E ที่เปิดไฟล์หรือ localhost บน Chromium ใน sandbox ถูกปิดกั้นโดย administrator. ยังไม่สามารถแทนการทดสอบจริงในโทรศัพท์/แท็บเล็ตและการทดสอบกับสัตวแพทย์ 3–5 คน

## วิธีใช้

อัปโหลดไฟล์ deploy จาก ZIP ไปที่ root ของ GitHub repository เดิม โดยทำ backup ข้อมูลเคสก่อน อย่าลบ browser/site data, PWA หรือ localStorage เพื่อแก้ปัญหา cache

## Smoke test บนอุปกรณ์จริง

1. เปิด active case → กลับเข้า OR LIVE → Record vitals/Medications → Recovery
2. ใน Recovery ใช้ Enter/Next ระหว่างกรอก และตรวจว่าไม่บันทึกโดยอัตโนมัติ
3. จบ Recovery ตาม criteria เดิม → End Case → เคลียร์ Medication/signoffs → Final Lock กับ **เคสจำลองเท่านั้น**
4. ตรวจ archive verification, ปุ่ม `＋ เริ่มเคสใหม่` และ confirm เดิม
5. ตรวจว่า Bug Center เงียบ แต่ Clinical Alerts ยังเตือนตามเงื่อนไขเดิม
