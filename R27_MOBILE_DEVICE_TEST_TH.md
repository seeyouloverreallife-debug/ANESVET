# R27 — เช็กลิสต์ UX บนมือถือจริง (ใช้เคสจำลอง)

## อุปกรณ์
- iPhone Safari และ Home Screen PWA: 320–390 px รวม notch/safe-area
- Android Chrome และ Installed PWA: 360–430 px
- iPad/แท็บเล็ต: portrait/landscape, ใช้การแตะไม่ใช่เมาส์

## เช็กตามลำดับ
1. เปิดหน้า Patient: header ไม่ล้นขอบหรือบังแถบเคส; ปุ่มรายงานบั๊กไม่กดผิดเป็น Identity
2. Identity off: แตะ 🔓 แล้วเปิด Session ได้; ถ้าต้องการใช้งานจริงให้ตั้งค่า Admin ตามคู่มือ; ไม่มีการบังคับ PIN ถ้าระบบยัง off
3. Identity enabled: ผู้ใช้งานที่ปลดล็อกแล้วแตะ 👤 เปิด Session → Switch User / Lock ได้; เมื่อ locked ต้องกรอก PIN จริง
4. แตะ **ขั้นตอน** ที่ bottom bar → เห็นทางไปทุกช่วงและปุ่ม Identity → กดแล้วเปิดหน้าต่าง Session ได้โดย bottom sheet ปิดเอง
5. Patient: ช่องชื่อสัตว์ไม่แคบ; Species/Sex/Breed/Current BW กรอกด้วยมือเดียวโดยไม่ zoom; ข้อความไม่ถูกตัด
6. Pre-check: scroll checklist และแตะปุ่มได้แม่นยำ; clinical cautions ยังแสดงตามเดิม
7. Drugs: ทบทวน plan/Current BW, การคำนวณยาและข้อควรระวังเหมือน R26
8. OR LIVE: กด Induction, Record Vitals และ Quick Drug; ไอคอน Identity/บั๊กไม่ทับปุ่มสำคัญ; บันทึก Vital Signs หลายครั้ง
9. Recovery: กรอก HR/RR/MAP/SpO₂/Temp ต่อเนื่อง; ตอนคีย์บอร์ดเปิด fixed docks ไม่บังช่องกรอก แล้วกลับมาเมื่อปิดคีย์บอร์ด
10. End Case: เข้าหน้า Finalization จาก Recovery; review สิ่งที่ค้าง/Sign-off/Lock ผ่านขั้นตอน safety เดิมเท่านั้น
11. ลองหมุนจอ ลากลง/ขึ้นสุด และเปิด dialog ที่มีปุ่มท้ายหน้าจอ; ปุ่ม confirm อยู่ในพื้นที่แตะได้
12. Save → reload / close app → กลับเข้าเคสเดิม: ไม่มีข้อมูลสูญหาย, identity PIN ยังบังคับถ้าเปิด security

**คำเตือน:** การทดสอบ UI และชุดอัตโนมัติไม่ยืนยันความปลอดภัยทางคลินิก; ก่อนใช้จริงต้องทดสอบ workflow และการกู้ข้อมูลกับเคสจำลองอย่างครบถ้วน
