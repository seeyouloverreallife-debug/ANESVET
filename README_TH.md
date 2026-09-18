# ANESVET V11.1

แก้ตาม feedback จาก V11

## 1. Pre-check
หลัง checklist มี 2 ทางเลือก:
- ไป Drug Calculator → (ปุ่มหลัก)
- ข้ามไปช่วงวางยา / OR LIVE

ไม่พาไป Dashboard แล้ว

## 2. Drug Calculator
เพิ่ม Cefazolin (ABO) และ Convenia ให้เห็นเด่นใน Calculated Injection Volume ด้านบน
พร้อม Diazepam, Propofol, Tramadol และ NSAID

สูตร hospital preset เดิม:
- Cefazolin = BW ÷ 10 mL
- Convenia = BW ÷ 10 mL

## 3. “เพิ่มเติม” hotfix
V11 มี bug เพราะปุ่ม “เพิ่มเติม” ใช้ class เดียวกับ tab แต่ไม่มี data-tab
เมื่อกดจึงเรียก setTab(undefined) แล้วซ่อนหน้าปัจจุบัน ทำให้เหมือนเมนูว่าง

V11.1 แก้แล้ว:
- tab handler ทำงานเฉพาะปุ่มที่มี data-tab
- setTab ป้องกัน invalid page
- More menu เปิดได้โดยไม่ซ่อนหน้าปัจจุบัน

## Update
อัปโหลดไฟล์ทั้งหมดทับ V11 แล้วเปิด:
https://seeyouloverreallife-debug.github.io/ANESVET/?v=11.1
