# ANESVET V6.1 HOTFIX

แก้ปัญหา Reset / New case แล้ว GitHub Pages ขึ้น 404

## สาเหตุ
เวอร์ชันก่อนใช้ `location.reload()` หลัง Reset/Load case
ในบางสถานการณ์ โดยเฉพาะ PWA / GitHub Pages subdirectory / cache เก่า
browser อาจ reload path ที่ไม่ใช่ `/ANESVET/` และ GitHub Pages ตอบ 404

## สิ่งที่แก้
- Reset current case จะกลับไปยัง app root อย่างปลอดภัย
- New case ใช้ app root เดียวกัน
- Load archived case ใช้ app root เดียวกัน
- เพิ่ม cache-busting `?v=6.1` ให้ app.js และ style.css
- service worker cache version ใหม่
- PWA start_url เป็น `./?v=6.1`

## อัปเดต GitHub
อัปโหลดไฟล์ทั้งหมดทับ V6 แล้ว Commit
หลัง deploy เปิด:
`https://seeyouloverreallife-debug.github.io/ANESVET/?v=6.1`

หากเคยติดตั้ง PWA เวอร์ชันเก่า แนะนำเปิด URL นี้ใน Chrome หนึ่งครั้งก่อน
แล้วจึง Install/เปิดแอปใหม่
