# ANESVET V17.14.7 — Physical Pilot UX Fix III

พัฒนาต่อจาก V17.14.6 โดยใช้ physical-device feedback รอบสามเป็น acceptance criteria. รอบนี้แก้ root cause สองจุด: Vent mode บนมือถือยังไม่พาไปกรอก ventilator settings และ built-in NSAID preset ไม่ถูกแปลงเข้า species-specific Case Drug Plan.

## Vent — dedicated editor
- Vent workspace ไม่ re-parent `ventilatorFields` จาก Airway อีกต่อไป.
- มี visible editor ของ Vent เอง: RR / PIP / PEEP / VT.
- Spontaneous ซ่อน editor; Manual PPV / Mechanical แสดง editor.
- กด Mechanical เรียก canonical `setVentilationMode(...,{focus:true})` แล้ว focus ไป RR ใน Vent card.
- ค่าที่กรอกใน visible editor sync กลับ authoritative airway fields เพื่อคง persistence/audit semantics เดิม.
- `airwayVentMode`, `orVentilation`, master `ventilation` ยังคง sync ผ่าน OR Live controller.

## Planned NSAID / Meloxicam
- แก้ Quick Preset mapping ที่ขาด `builtin_nsaid`.
- Cat: `builtin_nsaid` → `meloxicamDose`.
- Dog: `builtin_nsaid` → `carprofenDose`.
- จึงถูกบันทึกใน Case Drug Plan และ frozen protocol เหมือน planned therapeutic drugs อื่น.
- POST-ANES medication จะเป็น LATER ระหว่าง intra-op และเปลี่ยนเป็น NEEDS REVIEW ใน emergence/recovery.
- Emergency/standby drugs ยังถูก exclude จาก routine auto-next/queue ตามเดิม.
- Route ของ Meloxicam/Carprofen ไม่ถูกสมมุติเพิ่มใน release นี้; ใช้ค่าจาก hospital protocol/การยืนยันตอนบันทึก.

## Scope ที่ไม่เปลี่ยน
- Dose calculation / concentration validation / alert thresholds.
- Induction details-pending, Intubation timestamp-only, End Surgery, Emergency Return, Recovery criteria และ Final Lock.
- Tramadol SC site-default จาก V17.14.5.

## Physical acceptance
- ต้อง re-test บนมือถือเครื่องเดิม: Mechanical ต้องแสดง RR/PIP/PEEP/VT ใน Vent card และ new cat case ที่มี default NSAID preset ต้องมี Meloxicam ใน frozen plan/queue ที่ emergence.

## Verification
- Current contract suites: 529/529 PASS หลัง release hardening.
- V17.14.7 Physical Pilot UX Fix III: 17/17 PASS.
- Runtime JS syntax: 76/76.
- CSS parser: 40/40.
- Artifact ต้อง re-test บนมือถือเครื่องเดิมก่อนถือว่า Vent physical acceptance ผ่าน.
