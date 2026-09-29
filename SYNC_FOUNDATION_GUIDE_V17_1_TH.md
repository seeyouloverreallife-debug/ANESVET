# คู่มือ Sync Foundation — ANESVET V17.1.0

## รุ่นนี้ทำอะไร
V17.1 เริ่มวางโครงสร้างสำหรับอนาคตที่ ANESVET จะใช้หลายเครื่องได้ โดยยังไม่เชื่อม server จริงและยังไม่อนุญาตให้ถือว่าหลายเครื่องแก้เคสเดียวกันพร้อมกันได้อย่างปลอดภัย

## หลักสำคัญที่สุด
**ข้อมูลเคสต้องบันทึกในเครื่องก่อนเสมอ**

ANESVET จะไม่รออินเทอร์เน็ตเพื่อบันทึก vital, medication, Recovery หรือเหตุการณ์ใน OR. หลัง local save และ safety checkpoint ผ่านแล้วเท่านั้น ระบบทดลอง sync จึงสร้าง mutation เข้า queue.

## หน้า Settings > Multi-device Foundation
สถานะที่อาจเห็น:
- `LOCAL ONLY` — ค่าเริ่มต้น; sync foundation ยังไม่เปิด
- `PENDING` — มี mutation รอประมวลผล
- `MOCK SYNCED` — local/mock adapter รับ mutation แล้ว
- `OFFLINE` — ยังบันทึก local ได้ตามปกติ; queue รออยู่
- `CONFLICT` — พบ revision mismatch ที่ห้าม overwrite อัตโนมัติ
- `ERROR` — adapter/queue processing มีปัญหา แต่ clinical local save ไม่ควรถูก block

## ทำไมปิดไว้เป็นค่าเริ่มต้น
เพราะ V17.1 ยังไม่มี canonical server จริง การเปิด checkbox เป็นเพียงการจำลอง queue/revision/conflict ในเครื่องสำหรับตรวจระบบและ regression เท่านั้น

## Conflict ที่ตั้งใจไม่แก้อัตโนมัติ
- medication administration เดิมที่ถูกแก้พร้อมกัน
- Final Sign-off
- Final Lock
- Archive
- VOID/amendment ที่มีความหมายต่อหลักฐานทางคลินิก
- patient/settings/case snapshot ที่เกิด concurrent change

Vital/event ที่เป็น record ใหม่คนละ `recordId` สามารถ merge แบบ append ได้ใน mock engine เพื่อไม่ทิ้งข้อมูลเงียบ ๆ

## สิ่งที่ยังต้องทำก่อน multi-device production
1. เลือก backend: hospital LAN, cloud หรือ hybrid
2. central authentication / staff directory / revocation
3. server canonical revision และ server timestamp
4. TLS, access control, backup และ disaster recovery ของ backend
5. conflict review UI สำหรับ clinician
6. record-level mutation capture ที่ละเอียดขึ้น
7. real two-device tests: offline, reconnect, duplicate, out-of-order, stale edit, Final Lock conflict
8. long OR simulation บนอุปกรณ์จริง

จนกว่าจะครบขั้นตอนเหล่านี้ ให้ใช้ workflow เดิมแบบ local-first เป็นหลัก
