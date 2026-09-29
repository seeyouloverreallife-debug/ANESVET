# คู่มือ Sync Backend — ANESVET V17.2.0

## รุ่นนี้ทำอะไรแล้ว
V17.2 เตรียมฝั่งแอปให้พร้อมคุยกับ canonical backend แบบไม่ผูกผู้ให้บริการ และเพิ่มระบบตรวจ conflict ที่ปลอดภัยขึ้น

สิ่งที่พร้อมแล้ว:
- local save มาก่อน network เสมอ
- durable operation queue
- idempotent `operationId`
- HTTP/LAN adapter contract
- capability handshake
- conflict hold ระดับทั้งเคส
- Conflict Review Center
- export conflict evidence เป็น JSON
- remote pull แบบ preview-only
- fault injection สำหรับทดสอบ network fail / ACK loss

## สิ่งที่ยังไม่เปิด
- ยังไม่มี production server
- ยังไม่เปิดให้สองเครื่องแก้เคสเดียวกันพร้อมกันในงานจริง
- ยังไม่มีปุ่ม merge/rebase clinical conflict
- remote data ยังไม่ถูก apply กลับเข้าเคสอัตโนมัติ

## แนวทาง backend ที่เหมาะกับโรงพยาบาลในขั้นถัดไป
โครงสร้างที่ V17.2 รองรับคือ HTTP(S) canonical server กลาง ทำให้สามารถเลือกได้ภายหลังระหว่าง:
1. Hospital LAN server — เหมาะกับการใช้งานในโรงพยาบาลแม้อินเทอร์เน็ตภายนอกล่ม
2. Cloud backend — เข้าถึงข้ามสถานที่ง่ายกว่า แต่พึ่งพา internet มากขึ้น
3. Hybrid — LAN canonical service + cloud backup/replication

สำหรับ ANESVET ซึ่งใช้ใน OR และต้องบันทึกต่อได้แม้ network มีปัญหา โครงสร้าง local-first + canonical server กลางยังคงเหมาะสมที่สุด แต่ production deployment ต้องมี authentication, authorization, device enrollment/revocation, TLS, backup และ real two-device fault testing เพิ่มเติม

## ก่อนเปิดหลายเครื่องจริง
ต้องทดสอบอย่างน้อย:
- device A offline ระหว่างเคส → reconnect
- duplicate delivery
- ACK หายหลัง server commit
- out-of-order operation
- medication conflict
- Final Sign-off conflict
- Final Lock conflict
- force-close/reload ขณะ queue ค้าง
- user switching / permission boundary
- Recovery → Final Lock → Archive VERIFIED
- Backup schema 3 → Verify → Restore
