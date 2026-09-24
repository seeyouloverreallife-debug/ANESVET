# ANESVET V15.10.0 — Pre-OR Anesthesia Briefing

## Why this release
หลังจาก Pre-OR Readiness ผ่านแล้ว ผู้ใช้ไม่ควรถูกส่งเข้า OR LIVE ทันทีโดยไม่มีภาพรวมของเคส รุ่นนี้เพิ่ม briefing สั้น ๆ ก่อนเข้า OR เพื่อรวมข้อมูลที่กรอกไว้แล้วให้กลายเป็น actionable preparation โดยไม่สร้าง actual clinical record อัตโนมัติ

## New: Pre-OR Anesthesia Briefing
เมื่อ Patient/Case Setup, physical exam, risk review และ pre-op checklist ผ่าน readiness gate แล้ว การกด OR LIVE ครั้งแรกจะเปิด briefing ก่อน โดยสรุป:

- Patient / Species / BW / ASA / Procedure
- Key risks / watch-outs จาก structured risk flags
- Allergy / comorbidity / precaution และ physical-exam findings ที่ควร carry เข้า OR
- สิ่งที่ควรเตรียมก่อน induction
- Case Drug Plan snapshot + emergency/standby medications
- Initial support reference สำหรับการเตรียมอุปกรณ์และตั้งต้น

ผู้ทบทวนต้องใส่ชื่อก่อน `Reviewed → Open OR LIVE` และระบบจะลง audit trail `PRE_OR_BRIEFING_REVIEWED`.

ถ้าข้อมูลสำคัญของเคสเปลี่ยนก่อน Start Case เช่น BW, ASA, procedure, risk flags, exam หรือ Case Drug Plan ลายเซ็นของ briefing จะไม่ตรงและระบบจะให้ review briefing ใหม่

## Initial support reference shown in briefing
ค่าด้านล่างเป็น reference สำหรับเตรียมเท่านั้น ไม่ถูกคัดลอกเข้า actual OR record อัตโนมัติ:

- **ETT:** rough internal-diameter working range ตาม species + BW พร้อมเตือนให้เตรียม 1 size smaller/larger; BOAS/brachycephalic/obesity ขึ้น caution เพิ่ม
- **Circuit:** NRC / pediatric RC / circle reference ตาม patient size โดยยังให้ clinician เป็นผู้เลือกจริง
- **O₂ / fresh gas flow:** reference ตาม circuit
- **Preoxygenation:** 100% O₂ ~3 min reference; airway/respiratory risk จะถูกยกระดับเป็น priority
- **VT if PPV:** 8–10 mL/kg starting reference พร้อม numeric mL จาก current BW; obesity/respiratory disease มี caution เพิ่ม
- **PIP if PPV:** ~10–15 cmH₂O starting reference; lowest pressure that achieves adequate ventilation
- **RR if PPV:** ~10–15/min starting reference; titrate to capnogram/ETCO₂
- **PEEP:** intentionally not auto-prescribed; individualized
- **Fluids:** healthy elective baseline reference (dog 5 mL/kg/h; cat 3–5 mL/kg/h); cardiac/renal/hypovolemia/emergency/bleeding risk เปลี่ยนเป็น `Individualize`
- **Reservoir bag:** rough prep ≈ ≥5× expected VT and nearest practical bag size

## Risk-aware preparation examples
- BOAS / difficult airway → alternative ETT sizes, suction, difficult-airway/re-intubation plan, recovery airway observation
- Aspiration risk → suction + airway protection emphasis
- Respiratory disease → preoxygenation + capnography/SpO₂ + conservative ventilation
- Cardiac / arrhythmia → ECG/BP emphasis and cautious PPV/fluid interpretation
- Hypovolemia → stabilization / preload concern before PPV
- Anemia / hemorrhage → blood availability / access / blood-loss preparation
- Renal → perfusion without indiscriminate fluid loading
- Pediatric / hypoglycemia → glucose + active warming + low-dead-space equipment
- Pregnancy / C-section → aspiration/ventilation + neonatal team preparation

## Clinical basis and boundaries
This feature is a clinical preparation aid, not an automatic prescription engine.

- AAHA 2020 anesthesia guidance supports individualized preanesthetic planning, preoxygenation, breathing-circuit selection, O₂ flow based on circuit, and capnography-guided ventilatory support.
- AAHA 2024 fluid guidance uses initial crystalloid rates of 5 mL/kg/h in healthy dogs and 3–5 mL/kg/h in healthy cats, with individualization for disease/volume status.
- Veterinary ventilation literature does not establish one ideal ventilator setting for every anesthetized dog/cat; the displayed VT/PIP/RR values are conservative starting references and must be titrated to ETCO₂, lung mechanics, hemodynamics and patient response.
- ETT selection by body weight is only an estimate. Veterinary airway references specifically note that no single method is routinely reliable and recommend having adjacent sizes available; brachycephalic and abnormal body-condition patients require extra caution.

## Safety behavior preserved
- Pre-OR Readiness Gate
- Case Drug Plan freeze / medication safety
- Confirm + Undo workflow transitions
- Autosave / verified checkpoint
- Recovery guard
- Final Lock / checksum
- Existing pilot feedback code is preserved but no additional bug-report work was added in this release

## Validation performed in build environment
- `node --check app.js`: PASS
- `manifest.webmanifest` JSON parse: PASS
- Version/cache references: PASS
- Required Pre-OR Briefing DOM IDs: PASS
- Duplicate HTML ID scan: PASS
- Static contract checks for briefing gate/signature/audit/support reference: PASS
- Headless Chromium smoke test: NOT CLAIMED (Chromium process times out in this runtime, same environment limitation as prior releases)
