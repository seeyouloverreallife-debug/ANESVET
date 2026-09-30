# ANESVET V17.2.31 — R27 Mobile-first UX

Base: ANESVET V17.2.30 R26 Full Source. ไม่ได้สร้างโปรแกรมใหม่

## จุดเปลี่ยนของมือถือ (viewport ≤ 720 px)

1. Header แนวนอนแบบ compact: ANESVET, เวลาเคส, สัญลักษณ์สถานะบันทึก, ไอคอน Bug Center และ Identity อยู่คนละส่วนโดยไม่กินพื้นที่ชื่อหัวข้อ
2. Identity ย่อเป็นไอคอน 42×42 px (👤 เมื่อมี session, 🔓 เมื่อไม่ได้เปิด local Identity, 🔒 เมื่อถูกล็อก) พร้อมชื่อ/สถานะที่ screen reader อ่านได้
3. เพิ่มปุ่ม **ผู้ใช้งาน / Identity** ในเมนู **ขั้นตอน** ของมือถือ กดแล้วเปิด Session / Switch User / Lock ของระบบเดิม ไม่ข้าม PIN/role checks
4. ขยายพื้นที่สัมผัสของ contextual help และ action ปกติเป็นอย่างน้อย 44 px; เพิ่ม focus outline
5. Patient setup จัดข้อมูลสำคัญเป็น 2 คอลัมน์บนมือถือขนาดปกติ (ชื่อสัตว์/พันธุ์/อายุเต็มแถว), และใช้คอลัมน์เดียวบนจอแคบ ≤ 360 px
6. ตั้ง input/select/textarea เป็นอย่างน้อย 16 px เพื่อเลี่ยง Safari zoom ตอนพิมพ์
7. ใช้ dynamic viewport และ safe-area กับ bottom sheet และ dialogs ลดอาการล้นจอ
8. เมื่อ visualViewport หดจากคีย์บอร์ดขณะกำลังพิมพ์ จะซ่อน floating action docks ชั่วคราว และแสดงกลับเมื่อคีย์บอร์ดปิด
9. เก็บ clinical alert, case freshness, safety banners, patient risk, Recovery readiness, Final Lock และ Silent Bug Center เดิมไว้

## Identity อธิบายสั้น ๆ

Identity ใน ANESVET เป็น **local staff login/roles** ไม่ใช่ patient identity; จำแนกผู้กรอกข้อมูล บทบาทและสิทธิ์ พร้อม PIN สำหรับงานสำคัญ เป็น single-device registry (ไม่ได้ sync รายชื่อ staff ข้ามเครื่อง). ถ้าโรงพยาบาลยังไม่เปิด local security จะแสดง `Identity ยังไม่เปิดใช้งาน`; ไม่ได้บังคับเปิด.

## ไฟล์ deploy (6 ไฟล์)
- index.html
- app.js (เปลี่ยนเฉพาะ APP_VERSION)
- mobile-first-r27.css (ใหม่)
- mobile-first-r27.js (ใหม่)
- manifest.webmanifest
- service-worker.js

## QA
- QA_R27_MOBILE_FIRST.js — 25/25 PASS (structure, JS syntax, isolated Identity + keyboard behavior, PWA assets)
- **ไม่ได้** ทดสอบ browser E2E / visual QA บนอุปกรณ์จริง: sandbox Chromium timeout จากปัญหาระบบ service / D-Bus
- ต้องตรวจจริงบน iPhone Safari/PWA, Android Chrome/PWA และแท็บเล็ต ก่อนนำไปใช้ในเคสจริง

## สิ่งที่ไม่ได้เปลี่ยน
- dose calculations, drug library, OR LIVE pharmacology, thresholds, recovery safety gates, Final Lock / archive checks
- state schema, storage keys, session coordination / backup data
- security PIN, role permissions, login/lock/audit behavior

## ติดตั้งและปลอดภัยต่อข้อมูล
สำรอง Full Backup และยืนยันว่าไฟล์ Backup ใช้งานได้ ก่อนอัปเดต; อย่าอัปเดตระหว่างเคส active; แตก zip deploy แล้ววาง 6 ไฟล์ใน root repository เดิม (ไม่ล้าง browser site data, ไม่ถอนการติดตั้ง PWA). จากนั้น reload ในช่วงไม่มีเคส active และตรวจเลข V17.2.31.
