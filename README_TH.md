# ANESVET V14.3 — Patient Master & Registration Upgrade

## Patient Master
ค้นผู้ป่วยเดิมด้วย HN / ชื่อ / Microchip / Breed แล้วกด Use patient
ระบบดึงข้อมูลประจำตัวและประวัติสำคัญ แต่ไม่ดึง procedure/team ของเคสเก่า

## Patient database
- IndexedDB DB version 2
- เพิ่ม store `patients`
- seed Patient Master จาก archived cases เดิมเมื่อเปิด V14.3 ครั้งแรก
- fallback เป็น localStorage หาก IndexedDB ใช้ไม่ได้
- Save Patient & Case Setup จะ create/update Patient Master อัตโนมัติ
- HN และ Microchip ช่วยจับคู่ผู้ป่วยเดิมเพื่อลด duplicate

## Registration fields
เพิ่ม Sex / Reproductive status / Microchip

## Estimated age
ยังคงใช้ calendar anchor เพื่อให้อายุเดินตามเวลา แต่ไม่แสดง anchor เป็น exact DOB
- อายุคร่าว ๆ เป็นปี → Estimated birth period ~YYYY
- มีเดือน/สัปดาห์ → Estimated birth period ~YYYY-MM
- UI ระบุว่า calendar date เป็น anchor
- PDF แสดง Estimated birth period + Age source

## Hospital Breed Aliases
Settings สามารถเพิ่ม alias เช่น:
- ปอมขาว → Pomeranian
- บริติชช็อตแฮร์ → British Shorthair
- แมวบ้าน → Domestic Shorthair

## Backup / Restore
Backup V14.3 รวม Patient Master และ Breed aliases ด้วย

## URL
https://seeyouloverreallife-debug.github.io/ANESVET/?v=14.3
