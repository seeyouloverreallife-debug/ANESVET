# ANESVET V17.2.9 — Checkpoint R05: Mobile Navigation

ต่อจาก V17.2.8 R04 โดยไม่สร้างโปรแกรมใหม่

## วิธีใช้งาน
- ไฟล์แอปอยู่ในโฟลเดอร์ ZIP นี้ ให้เผยแพร่ **เนื้อหาภายในโฟลเดอร์** ที่ root ของ GitHub Pages (ให้ `index.html` อยู่ที่ root).
- สำรองข้อมูลก่อนอัปเดต หลีกเลี่ยงการอัปเดต/ถอนการติดตั้ง/ล้าง cache บนอุปกรณ์ที่มี Active Case จนกว่าจะ export และทดสอบ backup สำเร็จ.
- ใช้เครื่องทดสอบหรือโปรไฟล์แยก ไม่ใช้กับการวางยาสลบจริงจนกว่าจะผ่านการทดสอบบนอุปกรณ์เป้าหมาย.

## เปลี่ยนเฉพาะ
- `app.js`: การนำทางไม่ค้างเมื่อ localStorage ไม่อนุญาตให้บันทึก TAB_KEY; จำกัด target เป็น `.tabpage`; เพิ่มเหตุผลใน Diagnostic โดยไม่เปลี่ยน OR/Recovery safety gate.
- `index.html`: เพิ่ม Navigation click trace (clicked / rendered / blocked / render-error / CLICK_WITHOUT_ROUTE) และแสดงใน Diagnostic Panel.
- `service-worker.js`/`manifest.webmanifest`: อัปเดตหมายเลขเวอร์ชัน/แคชเป็น 17.2.9.
- เพิ่ม QA และคู่มือทดสอบ R05.

อ่าน `BUGFIX_CHECKPOINT_R05_TH.md` และ `DEVICE_R05_TEST_STEPS_TH.md` ก่อนทดสอบ
