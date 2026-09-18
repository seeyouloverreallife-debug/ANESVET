# ANESVET V12 — Phase-based Drug Workflow

## Patient history
หน้า “ประวัติผู้ป่วย” เพิ่ม:
- Procedure
- ประวัติแพ้ยา / สิ่งที่ต้องหลีกเลี่ยง
- โรคประจำตัว / ปัญหาสำคัญ
- ข้อควรระวังเฉพาะราย / Anesthetic concerns

Procedure sync กับ Dashboard/OR LIVE และข้อมูลความเสี่ยงแสดงใน OR LIVE + PDF report

## Drug Calculator แยกตามช่วง
### 1) Induction / Co-induction
- Diazepam
- Propofol
- Additional induction drug จาก Hospital Drug Library

### 2) Pre-anesthetic / Perioperative
- Cefazolin (ABO)
- Tramadol
- Additional antibiotic / analgesic / drug จาก Hospital Drug Library

### 3) Post-anesthetic / Postoperative
- Convenia
- Dog: Carprofen
- Cat: Meloxicam
- Additional postoperative drug จาก Hospital Drug Library

Emergency drugs ยังแยกต่างหากเหมือนเดิม

## Hospital Drug Library
อยู่ใน Settings:
- Drug name
- Phase
- Drug class
- Calculation mode
- Dose / factor
- Concentration
- Route

Calculation modes:
- mg/kg
- μg/kg
- mL/kg
- BW ÷ factor
- Manual

มี template ชื่อยาที่ใช้บ่อย เช่น Midazolam, Alfaxalone, Ketamine, Etomidate,
Ampicillin-sulbactam, Clindamycin, Methadone, Buprenorphine, Fentanyl,
Butorphanol, Robenacoxib, Amoxicillin-clavulanate

สำคัญ: template ยาเพิ่มเติม “ไม่ใส่ dose/concentration เริ่มต้น” ผู้ใช้ต้องกำหนด protocol ของโรงพยาบาลเองก่อนระบบจะคำนวณ volume

## Existing hospital presets retained
- Diazepam 0.25 mg/kg
- Propofol 4 mg/kg planned
- Cefazolin = BW ÷ 10 mL
- Convenia = BW ÷ 10 mL
- Tramadol 4 mg/kg
- Dog Carprofen 4.4 mg/kg
- Cat Meloxicam 0.3 mg/kg

## Update URL
https://seeyouloverreallife-debug.github.io/ANESVET/?v=12
