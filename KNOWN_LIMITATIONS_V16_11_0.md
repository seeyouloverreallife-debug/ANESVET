# Known Limitations — ANESVET V16.11.0

1. **Soft keyboard แตกต่างกันตาม Android OEM / browser**  
   V16.11 ใช้ `visualViewport` เมื่อ browser รองรับ แต่ขนาด keyboard, browser bars และ safe-area อาจต่างกัน จึงควรทดสอบกับโทรศัพท์ที่ใช้จริงอย่างน้อย 1 รอบ

2. **Fast Vital Entry ไม่อ่านค่าจาก monitor อัตโนมัติ**  
   ผู้ใช้ยังต้องกรอก/ยืนยันค่าเอง ระบบไม่ infer measurement และไม่เปลี่ยน `Fill blanks` เดิมให้เป็นการเติมค่าอัตโนมัติแบบเงียบ ๆ

3. **Quick Drug keyboard flow ไม่ auto-administer**  
   Enter ช่วยเลื่อนไปช่องถัดไปเท่านั้น การบันทึก actual administration ยังคงผ่านปุ่ม Save และ safety/confirmation logic เดิม

4. **Page Lifecycle event ขึ้นกับ browser**  
   `freeze` และ BFCache `pageshow` ไม่ได้เกิดในทุกสถานการณ์ ระบบจึงยังพึ่ง autosave, visibility/pagehide flush, active/safety checkpoint และ current mirror เดิมเป็นหลัก

5. **ยังไม่มี direct monitor integration**  
   V16.11 ยังไม่ดึง HR/MAP/SpO₂/ETCO₂/RR/Temperature จากเครื่อง monitor โดยตรง

6. **Browser smoke test ไม่ใช่การทดสอบ installed PWA บนเครื่องจริง**  
   Build environment ทดสอบ Chromium runtime หลาย viewport แล้ว แต่ก่อนใช้ production ควรทดสอบ Android PWA จริง โดยเฉพาะ soft keyboard, home/task switch, screen lock/wake และ orientation change
