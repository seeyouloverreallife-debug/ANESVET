# ANESVET V15.12.1 — Mobile Quick Access

รุ่นนี้เป็น hotfix/UX refinement ต่อจาก V15.12.0 โดยแก้ปัญหาบนมือถือและ iPad ที่ workflow tabs ไม่ sticky แล้วทำให้ต้องเลื่อนกลับขึ้นด้านบนเพื่อเปลี่ยนหน้า รวมทั้งปุ่ม Report ที่ถูกซ่อนจาก header บนจอเล็ก

## สิ่งที่เพิ่ม
- Mobile Quick Bar แบบ fixed ขนาดเล็กด้านล่าง (นอก OR LIVE / Recovery)
- ปุ่ม `☰ ขั้นตอน` เปิด bottom sheet ไปยัง Patient / Pre-check / Drug Calculator / OR LIVE / Recovery / End Case ได้ทันที
- ปุ่มกลางแสดงหน้าปัจจุบัน และแตะเพื่อกลับด้านบนของหน้านั้น
- ปุ่ม `🐞 Report` แสดงบนมือถือ/iPad ตลอดใน workflow ปกติ
- ใน Quick Navigation มี Case Summary / Cases / Settings เป็น secondary shortcuts
- OR LIVE และ Recovery ยังคงใช้ dock เฉพาะ phase และไม่แสดง Mobile Quick Bar ซ้อน

## Safety
- ไม่เปลี่ยน Pre-OR readiness gate, briefing, dose calculation, medication safety, Confirm/Undo, Recovery guard หรือ Final Lock
- การแตะ OR LIVE / Recovery จาก Quick Navigation ยังผ่าน safety gate เดิมทุกครั้ง

## ก่อนอัปขึ้น GitHub Pages
อัปไฟล์ทั้งหมดแล้วเปิดครั้งแรกด้วย `?v=15.12.1` หรือ Hard Refresh หนึ่งครั้ง เพื่อให้ service worker/cache เปลี่ยนเป็นรุ่นนี้

ดู `RELEASE_NOTES_V15_12_1.md` และ `QA_V15_12_1.md` สำหรับรายละเอียด
