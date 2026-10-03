# ANESVET V17.14.4 — Physical Pilot Readiness / Device Resilience

## เป้าหมาย
ต่อจาก V17.14.3 ที่ผ่าน deterministic stress simulation แล้ว โดยไม่แก้ clinical workflow เพิ่ม แต่เตรียม Production Pilot ให้เก็บหลักฐานจาก Android/iPad/Windows เครื่องจริงได้ดีขึ้นเมื่อมีอาการ keyboard jump, viewport shift, resume/BFCache หรือ UI stall

## สิ่งที่เพิ่ม
- Physical-device telemetry แบบ local-only ใน `production-pilot.js`
- VisualViewport width/height/offset และ keyboard inset
- orientation / window + visual viewport changes
- focus in/out เฉพาะชนิด element และ input type โดยไม่เก็บ value
- PerformanceObserver long-task evidence เมื่อ browser รองรับ
- JS heap snapshot เฉพาะ browser ที่มี `performance.memory`
- BFCache restore / resume counters
- event-loop delay probe ระหว่าง Run device readiness
- manual device snapshot
- Production Pilot export format V2 รวม `deviceTelemetry`

## Safety / Privacy
- continuous telemetry เป็น opt-in และปิดเป็นค่าเริ่มต้น
- เมื่อปิดอยู่ focus/viewport/long-task hooks ไม่เขียน telemetry storage
- ไม่เก็บชื่อผู้ป่วย, HN, microchip, case payload, drug name, vital values หรือค่าที่พิมพ์ใน input
- telemetry เขียนเฉพาะ localStorage key แยกจาก clinical state
- telemetry ไม่เปลี่ยน dose, medication administration, phase, vital records หรือ persistence schema

## UX
Production Pilot เพิ่ม:
- Start / Stop device telemetry
- Capture device snapshot
- Reset telemetry
- telemetry summary: viewport/keyboard, long tasks, focus transitions, peak JS heap

## QA
- Current QA 17 suites
- Contract QA 450/450 PASS
- Dedicated Physical-device telemetry 25/25 PASS
- Runtime JS syntax 76/76 PASS
- Service Worker syntax PASS
- CSS parser 40/40 PASS
- Clinical workflow / stress / OR contracts เดิมคงอยู่

## ข้อจำกัด
Telemetry ทำให้รอบ physical pilot ต่อไปมีหลักฐานที่ดีขึ้น แต่ V17.14.4 เองยังไม่ใช่การทดสอบ Android/iPad/IME/touch/thermal/frame-rate จริง การสรุปว่าผ่าน physical pilot ต้องรันบนอุปกรณ์จริงและ export report จากอุปกรณ์นั้น
