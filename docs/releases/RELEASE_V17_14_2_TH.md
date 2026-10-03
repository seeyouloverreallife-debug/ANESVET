# ANESVET V17.14.2 — Clinical Pilot Simulation I

## เป้าหมาย
หลัง V17.14.1 หยุดการปรับ UX แบบคาดเดา แล้วเริ่มจำลอง clinical workflow ด้วย production controller/domain จริง เพื่อหาปัญหาที่มีหลักฐานก่อนแก้ต่อ

## สิ่งที่จำลอง
- Induction ด้วย prepared Diazepam + Propofol → Given / details pending
- Intubation แบบ timestamp-only
- Surgery start → OR LIVE
- บันทึก vital ครบ 6 ค่า
- MAP 45 mmHg → danger ตาม frozen protocol
- บันทึก Cefazolin จริงระหว่างผ่าตัด โดย induction details ยัง pending ได้
- MAP 72 mmHg → good
- End Surgery → emergence
- Extubation → Recovery
- Recovery READY
- Emergency Return ต้อง block การ complete
- complete recovery → casePhase complete

## ผล
ไม่พบ clinical flow regression ใหม่ใน deterministic routine/hypotension/recovery path รอบนี้ จึงไม่เปลี่ยน clinical workflow production โดยไม่มีหลักฐาน

## ปัญหาที่พบและแก้
เครื่องมือ Simulation / Production Pilot / Validation Center ยังแสดง build version เก่าแบบ hard-code ทำให้ evidence อาจถูกติดป้ายด้วย version ผิด V17.14.2 เปลี่ยนให้ทั้งสามอ่าน version จาก `AnesvetApp.version` และ scope readiness/active validation evidence ตาม build ปัจจุบัน โดยไม่เปลี่ยน storage keys หรือ clinical state

## ข้อจำกัด
เป็น deterministic software simulation ไม่ใช่การทดสอบ Android/iPad/PWA/IME/touch/performance บนอุปกรณ์จริง

## Release hardening finding
ระหว่าง full QA พบว่า `index.html` ยังอ้าง V17.14.1 อยู่ 78 จุด ขณะที่ app core / manifest / Service Worker ถูก bump เป็น V17.14.2 แล้ว จุดนี้ทำให้ visible build และ cache-busting generation ไม่ตรงกันได้ จึงแก้ `index.html` ทั้ง title/visible version/CSS+JS `?v=` refs ให้เป็น V17.14.2 และเพิ่มการยืนยันผ่าน deployment/version guards ก่อนแพ็ก release
