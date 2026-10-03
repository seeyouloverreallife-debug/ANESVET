# ANESVET V17.13.0 — Architecture Consolidation / OR LIVE Contract / Workflow Regression

## เป้าหมาย
หยุดการเพิ่ม presentation patch ซ้อนกัน และทำให้ workflow ปัจจุบันมี owner ชัดเจนก่อนเดินหน้าฟีเจอร์ใหญ่ใหม่

## 1. Presentation Ownership Registry
เพิ่ม `presentation-ownership.js` เป็น registry กลางของ presentation ownership

Canonical owners ในรุ่นนี้:
- Patient / Pre-op → `patient-preop-v17130`
- Drug Plan → `drug-start-v17130`
- OR LIVE → `or-workspace-v17130`
- Recovery → `recovery-end-v17130`

ถ้ามี legacy module พยายาม claim/mutate zone ที่มี owner แล้ว registry จะปฏิเสธ

### Legacy consolidation
- `clinical-simplicity.js` ไม่สามารถ reorder OR LIVE ได้อีกเมื่อ `or-workspace-v17130` เป็น owner
- `progressive-clinical-flow.js` ไม่สร้าง patient-detail layout owner ซ้ำเมื่อ Patient owner ปัจจุบันทำงานอยู่
- Device Diagnostic และ Architecture Registry แสดง presentation owner map ได้

ไม่มีการเปลี่ยน clinical state, alert threshold, medication calculation, persistence หรือ safety gate จาก ownership registry

## 2. OR LIVE stable layout contract
ล็อก contract ของหน้า OR LIVE สำหรับ mobile workflow:
1. Compact patient / phase context
2. Vital Save / Next Due strip
3. Six vital inputs
4. Depth + Vaporizer + O₂
5. Current milestone / Induction workflow
6. Active Safety
7. Fluid / Vent / Airway / Meds

Secondary charting จะไม่ถูก legacy module ย้ายขึ้นเหนือ monitoring block อีก

## 3. End-to-end deterministic regression
เพิ่ม QA ใหม่ที่ตรวจ flow สำคัญตั้งแต่:
Patient → Pre-op/Drug Plan → Start Case → Induction → Intubation → Surgery End → Extubation → Recovery → End Case / Final Seal

รวมถึง synthetic completed-case handoff ที่ตรวจ:
- patient identity
- airway
- drug administration
- fluid total
- vital extrema

## Preserved
- Induction = prepared induction medications given / details pending
- individual induction administration time editable
- Intubation timestamp-only
- Calculated-as-Given
- End Surgery workflow
- Emergency Return
- Recovery / End Case
- Final Lock / archive integrity

## Scope limitation
QA นี้เป็น Node pure-model + source-contract regression ไม่ใช่ browser/device E2E. Android/iPad/PWA physical-device validation ยังจำเป็นก่อน production release.
