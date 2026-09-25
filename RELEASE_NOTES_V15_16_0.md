# ANESVET V15.16.0 — Pilot Efficiency & One-Hand Flow

## เป้าหมาย
ต่อยอด V15.15 โดยลดเวลาการเลื่อนและการหาว่า “ต้องทำอะไรต่อ” ระหว่าง pilot โดยไม่เปลี่ยน clinical logic หรือ safety gates

## สิ่งที่เพิ่ม
### 1. Contextual Continue บน Mobile Quick Bar
- หน้า Patient: `ต่อไป` → Pre-check
- หน้า Pre-check: `ต่อไป` → Drug Plan
- หน้า Drug Calculator: `ต่อไป` → OR LIVE
- การเข้า OR LIVE ยังผ่าน readiness gate + Pre-OR Briefing เดิมทุกครั้ง ไม่มีการ bypass
- หน้าที่ไม่ต้องมี Continue จะซ่อนปุ่มอัตโนมัติ

### 2. Pre-check Focus Mode
- เพิ่ม `รายการถัดไปที่ยังไม่เสร็จ`
- เพิ่ม `Focus เฉพาะที่ยังไม่เสร็จ`
- เมื่อ Focus เปิด รายการ Done / N/A จะถูกซ่อนชั่วคราวเฉพาะ UI
- Physical Exam และ Risk Review ที่บันทึกแล้วจะถูกซ่อนใน Focus mode เช่นกัน
- ไม่แก้ state ของ checklist และไม่ทำเครื่องหมาย Done ให้อัตโนมัติ

### 3. Quick Navigation Status
ในเมนู `ขั้นตอน` บนมือถือแสดงสถานะย่อของแต่ละ phase เช่น:
- Patient: SAVED / ต้องบันทึก
- Pre-check: x/15
- Drug Plan: reviewed / ยังไม่ review
- OR LIVE / Recovery: พร้อมเปิด / ยังล็อก

ช่วยให้เห็น progress ของเคสโดยไม่ต้องเปิดทุกหน้า

## Clinical safety / compatibility
ไม่มีการเปลี่ยน:
- dose / concentration / drug calculations
- alert thresholds
- readiness gate / clinical override
- Pre-OR briefing recommendations
- phase transition logic
- medication administration workflow
- recovery / final lock / audit trail
- storage keys / case schema

ไฟล์ใหม่ `pilot-efficiency.js` และ `pilot-efficiency.css` เป็น UI layer เท่านั้น

## Version / cache
- App version: `15.16.0`
- Service worker cache: `anesvet-v15-16-0-pilot-efficiency`
