# ANESVET V17.14.6 — Physical Pilot UX Fix II

พัฒนาต่อจาก V17.14.5 โดยใช้ feedback รอบสองจากมือถือจริงเป็น acceptance criteria. รอบนี้แก้สองจุดที่ V17.14.5 ยังไม่ตอบโจทย์: Vent mode ยังไม่เปลี่ยน owner/state จริงอย่างน่าเชื่อถือ และ Recovery primary flow ยังแสดง summary/history ก่อนช่องกรอกที่หมอต้องใช้จริง.

## Ventilation
- เพิ่ม canonical `setVentilationMode()` ใน `runtime/controllers/or-live-controller.js`.
- การเลือก Spontaneous / Manual PPV / Mechanical ventilation sync พร้อมกันที่ `airwayVentMode`, `orVentilation` และ master `ventilation`.
- Manual PPV / Mechanical เปิด RR/PIP/PEEP/VT fields; Spontaneous ปิด fields.
- OR workspace buttons เรียก owner ตัวนี้โดยตรง ไม่พึ่ง event chain จาก presentation select เพียงอย่างเดียว.
- เพิ่ม selected-mode feedback ให้เห็นทันทีว่า mode ไหนถูกบันทึกเป็น state ปัจจุบัน.

## Recovery — vitals first
- `recoveryObservationPanel` เป็น editable task แรกบนมือถือ.
- Primary fields: HR, RR, SpO₂, Temp, Mentation, Extubation.
- มีปุ่ม `Record recovery vitals` และ `Copy last` ใน panel เดียวกัน.
- MAP, O₂ support, record interval, note และ structured recovery assessment อยู่ใน `More observations`.
- Latest-vitals summary ยังอยู่ แต่ตามหลังช่องกรอกและไม่แสดง dashboard ซ้ำบนมือถือ.
- Recovery record history กลับไปเป็น secondary details; ไม่แทนที่ช่องกรอก.

## Recovery assessment
- ยกเลิก numeric-only 0/1/2 tap controls จาก primary mobile UI.
- กลับมาใช้ descriptive selects เดิม เช่น `0 • Concern / unstable`, `1 • Improving / support needed`, `2 • Acceptable`.
- เพิ่มคำอธิบายสั้น ๆ ใน heading และทำ layout ให้ compact.
- Score semantics, N/A allowance, save gating และ recovery readiness criteria ไม่เปลี่ยน.

## Scope ที่ไม่เปลี่ยน
- Dose calculation / concentration rules.
- Tramadol SC site-default และ standby/emergency medication filtering จาก V17.14.5.
- Induction details-pending.
- Intubation timestamp-only.
- End Surgery, Emergency Return, Recovery completion criteria และ Final Lock.

## Verification
- Current contract suites: 512/512 PASS หลัง release hardening.
- V17.14.6 Physical Pilot UX Fix II suite: 36/36 PASS รวม deterministic ventilation owner simulation.
- Artifact ต้อง re-test บนอุปกรณ์จริงเครื่องเดิมก่อนถือว่า Vent/Recovery physical acceptance ผ่าน.
