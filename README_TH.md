# ANESVET V15.20.0 — Drug Quick Preset Priority

รุ่นนี้ต่อจาก V15.19.0 โดยปรับหน้า Drug Calculator ให้สิ่งที่ต้องใช้เร็วที่สุดอยู่บนสุด

## จุดเด่น
1. เปิด Drug Calculator แล้วเห็น `Hospital Quick Presets` ก่อน
2. เห็น Current BW, ชื่อยา, ปริมาณฉีด (mL) และ concentration ในจุดเดียว
3. เรียงตาม workflow: Pre-anesthetic → Induction → Post-anesthetic
4. Case Drug Plan อยู่ต่อจาก Quick Presets และมีปุ่มไปต่อโดยตรง
5. Detailed calculator / references ยังพับไว้เพื่อลดการเลื่อน
6. ปุ่ม Presets เปิด Settings ไปยังหมวดที่ต้องแก้อัตโนมัติ

## หมายเหตุเรื่อง concentration
ระบบแสดงเฉพาะ concentration ที่ถูกตั้งค่าไว้จริง หาก built-in formula เดิมไม่มี concentration field เช่น Cefazolin / Convenia จะขึ้น `Conc not configured` แทนการคาดเดาค่า

## หลังอัปเดต
หากใช้ผ่าน GitHub Pages/PWA แนะนำเปิดครั้งแรกด้วย `?v=15.20.0` หรือ Hard Refresh หนึ่งครั้ง เพื่อให้ service worker เปลี่ยน cache รุ่นใหม่
