# ANESVET V17.2.8 — R04 ASA Interaction Fix

## ภายใน ZIP
ไฟล์เว็บพร้อมใช้งานอยู่ในโฟลเดอร์นี้: ให้ **อัปโหลดเฉพาะเนื้อหาภายในโฟลเดอร์** ไป root ของ GitHub Pages โดย `index.html` ต้องอยู่ root. โปรดสำรองข้อมูลก่อนอัปเดต และใช้เครื่องทดสอบที่ไม่มี active case ก่อนเสมอ.

## สิ่งที่เปลี่ยน
- ยกเลิกการเรียก `loadSettings()` เมื่อเลือก ASA เพราะไม่เกี่ยวกับการเลือก ASA และอาจหยุดการอัปเดต UI หากมีข้อผิดพลาดจากหน้าตั้งค่า
- อัปเดตค่า ASA, selected card และ NOT SAVED ทันที แล้วจึง refresh dashboard ตาม flow เดิม
- ปรับ Diagnostic ให้ยืนยันว่า Click มาถึง **การ์ด ASA จริง** ก่อนระบุว่า handled; แยกกรณี Click ไปตกที่ overlay แม้อยู่ตำแหน่งเดียวกัน
- Service Worker / manifest / resource URL version เดินพร้อมกันเป็น 17.2.8

**ข้อจำกัด:** ยังไม่มี runtime trace ของเครื่องที่มีปัญหา; QA ในเครื่องพัฒนานี้ไม่ได้ทดสอบด้วย Android/iPad หรือ Chrome browser E2E จริง. R04 แก้จุดที่ยืนยันจาก source และเพิ่มความเที่ยงตรงของ Diagnostic แต่ยังไม่รับรองว่าทุกปุ่มบนมือถือจะกลับมาทำงาน.

**ความปลอดภัยข้อมูล:** อย่า Clear Site Data, uninstall PWA, reset หรือบังคับสลับ version บนอุปกรณ์ที่มี active case ก่อน export/backup สำเร็จ. อย่าทดสอบในเคสวางยาสลบจริง.

อ่าน `BUGFIX_CHECKPOINT_R04_TH.md` และ `DEVICE_R04_TEST_STEPS_TH.md` ต่อ.
