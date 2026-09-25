# ANESVET V15.15.0 — UX/UI Refinement

## เป้าหมาย
ปรับ ANESVET ให้ดูเป็น clinical app ที่หยิบใช้ทุกวันได้ง่ายขึ้น โดยเน้น **เห็นเร็วขึ้น • แตะน้อยลง • ใช้พื้นที่หน้าจอคุ้มขึ้น** และไม่เปลี่ยน clinical logic เดิม

## สิ่งที่ปรับ
### 1) Visual hierarchy / Design system
- ปรับสี, border, shadow, radius, typography และ spacing ให้เป็นภาษาภาพเดียวกันทั้งระบบ
- ลดความรู้สึก “card ซ้อน card” และลดเส้นกรอบที่ไม่จำเป็น
- ทำ primary / secondary / danger action ให้แยกชัดขึ้น
- ปรับ input / select / textarea / focus state ให้สม่ำเสมอและอ่านง่ายบน touch device

### 2) Workflow navigation
- เปลี่ยน workflow bar ด้านบนเป็น segmented navigation แบบ compact
- บนมือถือ/iPad ใช้ **single-row horizontal workflow** แทน grid หลายแถว
- Active step เด่นขึ้น แต่ไม่กินพื้นที่แนวตั้ง
- เพิ่ม `ui-refinement.js` ให้ active workflow step เลื่อนเข้ากลาง viewport อัตโนมัติบน mobile/coarse pointer
- OR LIVE / Recovery focus mode ยังคงซ่อน workflow bar ตามเดิม

### 3) Patient / Pre-check / Drug Calculator
- ยุบ page heading ให้กระชับขึ้น
- Patient master / form panels เบาลงและอ่านลำดับง่ายขึ้น
- Checklist state (Done / N/A / pending) scan ได้เร็วขึ้น
- Physical exam / Risk sections ใช้พื้นหลังและขอบตาม semantic state ที่ชัดขึ้น
- Drug cards ลด visual noise และเน้น calculated result มากขึ้น

### 4) OR LIVE / Recovery
- OR command bar, next-step card, vital cards และ bottom dock ใช้ hierarchy ที่ชัดขึ้น
- ลดความหนักของกรอบ vital card แต่คงสี warning/danger/good
- OR MORE / confirmation sheets ใช้ component style เดียวกับส่วนอื่น
- Recovery ใช้ visual tone ที่สงบกว่า OR LIVE แต่ยังคง clinical status เด่น

### 5) Mobile quick access / dialogs
- Mobile Quick Bar ได้ surface/spacing ใหม่ให้กลืนกับระบบมากขึ้น
- Help / onboarding / readiness / Pre-OR briefing / bottom sheets ปรับ border/shadow/radius ให้สม่ำเสมอ
- เพิ่ม `prefers-reduced-motion` support

## Architecture
- เพิ่ม `ui-refinement.css` เป็น UI override layer แยกจาก legacy `style.css`
- เพิ่ม `ui-refinement.js` สำหรับ UX behavior เล็กน้อยเท่านั้น
- ทำให้สามารถ rollback/refine หน้าตาได้โดยไม่แตะ clinical core

## Clinical safety / compatibility
รุ่นนี้ **ไม่มีการเปลี่ยน**:
- Drug calculations / doses / concentrations
- Alert thresholds
- Pre-OR readiness / briefing clinical recommendations
- OR LIVE phase logic
- Recovery logic
- Medication administration safety
- Final lock / audit trail
- Storage keys / case schema

`app.js` เปลี่ยนเฉพาะ `APP_VERSION` จาก 15.14.0 → 15.15.0

## Version / cache
- App version: `15.15.0`
- Service-worker cache: `anesvet-v15-15-0-ux-ui-refinement`
- เพิ่ม offline assets:
  - `ui-refinement.css`
  - `ui-refinement.js`
