# ANESVET V17.14.3 — Clinical Pilot Simulation II: Stress & Edge Cases

## เป้าหมาย
ต่อจาก V17.14.2 โดยไม่รีบปรับ clinical workflow เพิ่ม แต่พยายามทำให้ระบบพังด้วย deterministic stress / edge-case simulation ก่อนนำไป pilot บนอุปกรณ์จริง

## สิ่งที่จำลอง
- OR vital ต่อเนื่อง 720 records เป็น long-case/high-volume proxy
- exact duplicate vital ภายใน 12 วินาทีต้องถูก reject
- vital ที่เปลี่ยนจริงภายในช่วง guard ต้องบันทึกได้
- vital correction ต้องคงจำนวน record และมี correction audit
- duplicate medication ต้องขอ explicit confirmation
- repeat medication + retrospective medication ต้องเรียงเวลาได้
- void medication ต้องเก็บ original administration และ audit/event evidence
- Emergency Return ไป-กลับ 10 รอบต้องไม่ทำ recovery start หาย
- Recovery completion ต้องถูก block ขณะ Emergency Return active
- stale writer ต้องถูก block เมื่อ active-case payload เปลี่ยนจากภายนอก
- session tab ที่สองเริ่มเป็น VIEW ONLY, Take Control โอน ownership ได้, stale owner recover ตาม TTL ได้
- freeze flush + BFCache restore callback ต้องทำงาน
- backup ขนาดใหญ่ 1200 vital / 200 events / 80 meds ต้องผ่าน integrity และตรวจพบ single-field tamper
- Final Lock ต้อง seal ครั้งเดียว และ unresolved alert ต้อง block finalization

## ผล
Stress suite ผ่านทั้งหมดโดยไม่พบ clinical production-flow regression ใหม่ จึงไม่เปลี่ยน dose, route/concentration, protocol threshold, persistence schema, Induction/Intubation semantics, Recovery criteria หรือ Final Lock logic ใน release นี้

## ปัญหาที่พบและแก้
Production Pilot ยังตรวจ Offline app cache ด้วยชื่อ cache รุ่นเก่า `anesvet-v16-21-0` ทำให้ build ปัจจุบันอาจได้รับ warning ผิดแม้ Service Worker cache ถูกต้อง

V17.14.3 เปลี่ยนให้ Production Pilot สร้าง expected cache name จาก `AnesvetApp.version` และตรวจ exact current-generation cache เช่น `anesvet-v17-14-3-startup`

เป็นการแก้ pilot/readiness evidence เท่านั้น ไม่ได้เปลี่ยน clinical case state

## QA
- Current QA 16 suites
- Contract checks 425/425 PASS
- Stress & Edge Cases 23/23 PASS
- Runtime JS syntax 76/76 PASS
- CSS parser 40/40 PASS

## ข้อจำกัด
เป็น software-level deterministic simulation เท่านั้น การทดสอบ 720 records เป็น long-case dataset proxy ไม่ใช่การเปิดแอปบนอุปกรณ์จริงหลายชั่วโมง และยังไม่ถือเป็น physical Android/iPad/PWA/IME/touch/performance qualification
