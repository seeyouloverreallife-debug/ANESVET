# ANESVET V17.12.0 — OR LIVE Mobile-first Redesign

รีลีสนี้แก้จาก feedback บนมือถือจริง โดยเปลี่ยน OR LIVE จาก “หน้า summary / documentation” ให้เป็น “working monitor screen”.

## ลำดับหน้าใหม่
1. Compact patient strip — ชื่อ / BW / ASA / Procedure / Allergy / Risk / phase / case time
2. Next due + Last saved + Save vitals
3. Vital inputs 6 ค่า — HR / MAP / SpO₂ / ETCO₂ / RR / Temp
4. Anesthesia controls — Depth / Vaporizer / O₂
5. Current workflow milestone
6. Active Safety
7. Secondary workspaces — Monitor / Fluid / Vent / Airway / Meds

Vital inputs จึงไม่อยู่ใน Monitor tab อีกต่อไป และไม่ต้องผ่าน Next Clinical Step หรือ workspace tabs ก่อนจึงจะกรอกได้.

## Vaporizer
เปลี่ยนเป็นค่าที่แตะได้โดยตรงและเลื่อนด้านข้าง:
5 / 4.5 / 4 / 3.5 / 3 / 2.5 / 2 / 1.5 / 1 / 0.5 / 0 (OFF)

## O₂ flow
ยกเลิก flowmeter/slider ที่ลากยากบนมือถือ ใช้ simple quick values:
3 / 2.5 / 2 / 1.5 / 1 / 0.5 / 0 L/min

ค่าทั้งสองยังเขียนกลับ authoritative fields เดิมของเคสทันที.

## Fluid / Vent แยกจากกัน
### Fluid
- Current crystalloid rate
- Calculated / actual crystalloid
- Fluid bolus
- Running totals
- Blood loss / urine / blood product / history ถูกย้ายไว้ใน `More`

### Vent
- Ventilation mode
- RR
- PIP
- PEEP
- VT

ไม่กอง Fluid และ Vent อยู่ในหน้า Support เดียวอีกต่อไป.

## Airway
เน้นเฉพาะ ET tube / cuff / difficulty / circuit หลังผู้ป่วย stable. Ventilator settings ไม่อยู่ใน Airway อีกแล้ว.

## Preserved
- Induction = prepared induction medications considered given at Induction time, details reviewed later
- Editable individual induction drug time
- Timestamp-only Intubation
- End Surgery
- Emergency Return
- Recovery workflow
- Active safety / audit trail
- Final Lock / archive verification
- V17.11.3 Bug Center / OR ownership fixes
