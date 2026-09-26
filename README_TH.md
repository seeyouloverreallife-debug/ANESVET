# ANESVET V15.27.0 — Protocol Review & Dose Conflict

รุ่นนี้ต่อยอดจาก V15.26.0 โดยเพิ่มระบบตรวจทบทวน **Hospital Protocol dose เทียบกับ dose reference ที่โหลดอยู่ในโปรแกรม** โดยไม่แก้ dose ให้อัตโนมัติ

## ใช้งานอย่างไร

ไปที่ **Settings → Protocol Dose Review** แล้วกด Run / Refresh review

ระบบอาจแสดงสถานะ เช่น:

- `WITHIN PRIMARY` — อยู่ใน primary reference context
- `SUPPORTED — CHECK CONTEXT` — มี reference รองรับ แต่เป็นอีกบริบทหนึ่ง ควรตรวจ context
- `OUTSIDE LOADED REFERENCE` — อยู่นอกช่วงอ้างอิงที่เปรียบเทียบได้ในฐานข้อมูลที่โหลดอยู่
- `ROUTE MISMATCH` — route ที่ตั้งไว้ไม่ตรงกับ route ใน reference ที่เปรียบเทียบได้
- `NOT COMPARABLE` — สูตร/หน่วยไม่ควรถูกแปลงมาเปรียบเทียบอัตโนมัติ
- `NO REFERENCE` — ไม่มี reference ที่ map ได้

สถานะเหล่านี้เป็น **review aid** ไม่ใช่คำสั่งให้เปลี่ยน protocol

## Mark reviewed

ก่อน Mark reviewed ให้ Save Hospital Settings / Drug Library ก่อน เพื่อให้ระบบ review ค่าที่ถูกบันทึกจริง

หากมี warning หรือ check-context ระบบจะให้ใส่ reviewer และ review note แล้วเก็บ audit trail ไว้

ถ้าแก้ dose / route / formula ภายหลัง สถานะจะเปลี่ยนเป็น `CHANGED SINCE REVIEW` และควร review ใหม่

## Protocol Lock

หาก Lock protocol ขณะที่ review ไม่ current ระบบจะเตือน แต่ไม่ตัดสินใจแทนสัตวแพทย์ หากยืนยัน Lock ต่อ ระบบจะบันทึก audit ว่าล็อกในขณะที่ dose review ยังไม่ current

## ขอบเขตความปลอดภัย

ระบบนี้ไม่:

- เปลี่ยน dose ให้เอง
- เลือก midpoint จาก dose range
- เปลี่ยน route/concentration
- เดาสูตร legacy ให้เป็น mg/kg
- เปลี่ยน dose reference ของ V15.26.0

## การอัปเดต

หลัง deploy ถ้า browser/PWA ยังแสดงรุ่นเก่า ให้เปิด URL ด้วย `?v=15.27.0` หนึ่งครั้งหรือ refresh PWA ตามขั้นตอนของอุปกรณ์ เพื่อให้ service-worker รับ asset รุ่นใหม่
