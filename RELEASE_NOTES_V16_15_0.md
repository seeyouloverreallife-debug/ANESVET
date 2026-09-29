# ANESVET V16.15.0 — Recovery 2.0

## เป้าหมาย
ทำให้ Recovery เป็น structured clinical documentation มากขึ้น โดยเพิ่มการติดตามแนวโน้มและ handoff ที่ใช้งานจริง แต่ไม่เพิ่ม discharge criterion หรือให้ระบบตัดสินผลการรักษาแทนสัตวแพทย์

## สิ่งที่เพิ่ม
- **Recovery trend & support** สรุปจาก serial Recovery records ที่บันทึกจริง
  - temperature: first → latest + delta
  - O₂ support: latest mode + จำนวน record ที่ใช้ support
  - mentation: first → latest
  - comfort: pain scale / score + dysphoria/agitation
  - GI / mobility: nausea/vomiting + ambulation
- **Structured recovery assessment** (optional)
  - Pain scale: CMPS-SF / Feline Grimace Scale / Colorado State / Other
  - Pain score/result เป็นค่าที่ผู้ใช้บันทึกเอง ไม่มี automatic interpretation
  - Dysphoria / agitation
  - Nausea / vomiting
  - Mobility / ambulation
- Structured assessment ถูกเก็บในทุก Recovery vital record และแสดงใน serial table / PDF
- **Post-anesthetic medication review** บนหน้า Recovery
  - ใช้ frozen Case Drug Plan + medication reconciliation เดิม
  - แสดง GIVEN / NOT GIVEN / NEEDS REVIEW
  - Missing actual record แปลเป็น NEEDS REVIEW เท่านั้น ไม่สรุปว่าไม่ได้ให้ยา
  - เปิด Recovery Medication workspace หรือ Full reconciliation ได้โดยตรง
- **Transfer / ward handoff snapshot**
  - destination
  - receiving person / role
  - transfer note
  - latest Recovery record
  - medication reconciliation summary
  - unresolved problem count
  - เก็บเป็น audit trail + timeline event + Recovery handoff snapshot
- Recovery handoff / Full PDF / Compact PDF เพิ่ม structured recovery และ transfer context

## Safety boundary
V16.15.0 ไม่เปลี่ยน:
- Recovery readiness criteria
- Recovery Readiness Score logic
- dose calculation
- alert thresholds
- medication confirmation logic
- Documentation Guardian logic
- Final Lock criteria
- IndexedDB schema / DB_VERSION

Trend cards เป็น descriptive summary เท่านั้น ไม่แปลว่าอาการ “ดีขึ้น/แย่ลง” และไม่สรุป treatment success/failure

## Compatibility
- V16.14.0 current case / archive / backup ใช้ต่อได้
- Recovery records รุ่นเก่าที่ไม่มี structured fields จะแสดงเป็น Not assessed / —
- เพิ่ม `recoveryTransfers` เป็น optional state array โดยไม่เปลี่ยน IndexedDB schema
