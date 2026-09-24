# ANESVET V15.13.0 — Help, Onboarding & Pilot UX

รุ่นนี้ต่อจาก V15.12.1 โดยไม่เพิ่ม clinical calculation หรือเปลี่ยน safety gate หลัก เป้าหมายคือทำให้ผู้ใช้ใหม่สามารถเปิดโปรแกรมแล้วเข้าใจ workflow ได้เอง และให้ผู้ใช้เดิมเปิดคำอธิบายเฉพาะจุดได้โดยไม่รบกวนงานระหว่างเคส

## Help Center
- เพิ่ม `? วิธีใช้ / Help` ในเมนู `เพิ่มเติม`
- เพิ่ม Help ใน Mobile Quick Navigation
- เพิ่ม Help ใน OR LIVE `MORE` และ Recovery `MORE`
- คู่มือแบ่งตาม workflow จริง: Patient → Pre-check → Drug Plan → Pre-OR Briefing → OR LIVE → Recovery → End Case
- มีหัวข้อ Save/Offline/Data Safety และช่องทาง Support
- มีปุ่มไปยังหน้าที่เกี่ยวข้องโดยตรง

## Contextual Help
เพิ่มปุ่ม `?` ขนาดเล็กในหน้าหลักโดยไม่เพิ่มแถบใหม่ ได้แก่:
- Patient & Case Setup
- Pre-check
- Drug Calculator
- OR LIVE
- Recovery
- End Case

เมื่อกดจะเปิด Help Center ตรงหัวข้อของหน้านั้นทันที

## First-use Onboarding
- Fresh browser/install จะแสดง walkthrough สั้น 4 ขั้นตอนหนึ่งครั้ง
- อธิบาย flow หลัก, Drug Plan/Briefing, OR LIVE และ Recovery/End Case
- `ข้ามและไม่แสดงอีก` หรือจบ walkthrough จะบันทึกเฉพาะ preference ในเครื่อง
- เปิด walkthrough ซ้ำได้จาก Help Center → `ดูแนะนำ 1 นาที`
- จะไม่ auto-popup ถ้าพบว่า browser มี active/meaningful case หรือ archived case อยู่แล้ว

## Support
Help Center เชื่อมต่อกับระบบ Report เดิมของ V15.12:
- Email: `anesvetth@gmail.com`
- Facebook Page: `Anesvet`
- Structured report ยังคงไม่แนบ patient name, HN, microchip หรือ owner information โดยอัตโนมัติ

## Safety / Compatibility
- ไม่เปลี่ยน dose, concentration, alert threshold หรือ Pre-OR briefing calculation
- ไม่เปลี่ยน Readiness Gate, Briefing review, Confirm/Undo, Recovery guard หรือ Final Lock
- ไม่เปลี่ยน storage keys ของ clinical records
- V15.12.1 current case / archive / hospital settings ยังคงใช้ต่อได้
