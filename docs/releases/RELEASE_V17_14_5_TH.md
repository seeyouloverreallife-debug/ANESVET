# ANESVET V17.14.5 — Physical Pilot UX Fix I

พัฒนาต่อจาก V17.14.4 โดยใช้ feedback จากการใช้งานบนมือถือจริงเป็น acceptance criteria. รอบนี้แก้ interaction/UX ที่ตรวจพบจริง โดยไม่เปลี่ยน dose calculation, alert thresholds, persistence schema หรือ phase semantics.

## แก้ไข
- Vent mode buttons: direct click ownership, sync `airwayVentMode` + `orVentilation`, active/aria state, touch hardening.
- Tramadol: default route `SC` ตาม hospital workflow ที่ผู้ใช้ระบุ; frozen/legacy planned drug ที่ route ว่างจะใช้ SC เป็น editor default โดยยังต้อง confirm actual administration.
- Emergency/standby medications: ไม่ถูก auto-surface/auto-advance เป็นยาถัดไป; ยังเปิดจาก All medications ได้.
- Mobile keyboard: bottom navigation ไม่ถูกซ่อนเมื่อกรอกข้อมูล; ใช้ compact editing presentation แทน.
- Undo: workflow undo strip แสดงชัดเหนือ mobile dock; clinical records ยังคงใช้ correction/void audit-safe workflow แทน destructive undo.
- Mobile overflow: เพิ่ม containment สำหรับข้อความ/status/table.
- Recovery: จัด primary order เป็น Observations → Vital records → Readiness score → Checklist.
- Recovery score: tap-first 0/1/2/N/A controls, active state, Save disabled จน score ครบ.

## Scope
ไม่เปลี่ยน calculation semantics, medication confirmation, Induction details-pending, Intubation timestamp-only, End Surgery, Emergency Return, Recovery completion criteria หรือ Final Lock.

## Verification
- Current contract suites: 485/485 PASS
- Runtime JS syntax: 76/76 PASS
- Service Worker syntax: PASS
- CSS parser: 40/40 PASS
- Service Worker inventory: 120 assets / 76 JS / 2 CSS

## Physical-device scope
Acceptance criteria มาจาก feedback/screenshots ของ V17.14.4 บนอุปกรณ์จริง แต่ artifact V17.14.5 ที่แก้แล้วนี้ยังไม่ได้ re-test บนอุปกรณ์เครื่องเดิม จึงต้องทดสอบซ้ำก่อนถือว่า physical acceptance ผ่าน.
