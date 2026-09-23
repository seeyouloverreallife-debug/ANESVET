# ANESVET V15.8.0 — OR Workspace Customization Release

V15.8.0 ต่อจาก V15.7.0 โดยลดความรกของ `MORE` ใน OR LIVE และย้ายความยืดหยุ่นที่ควรเป็นระดับโรงพยาบาลเข้า Settings โดยไม่ลด clinical safety guards เดิม

## OR LIVE — Contextual MORE

ค่าเริ่มต้นใหม่คือ **Minimal** และเมนูเปลี่ยนตาม phase:

- **Induction:** Medications / Airway / Event-Problem
- **Intraoperative:** Medications / Fluid-Blood / Event-Problem
- **Emergence:** Airway / Medications / Event-Problem
- **Emergency return:** Event-Problem / Medications / Airway / Fluid-Blood

Trends / Timeline / Case Summary ไม่แสดงใน Minimal เพื่อไม่แย่งสายตาจากงานหลัก

มี profile ให้เลือก:

- **Minimal:** เฉพาะ phase-relevant actions
- **Standard:** เพิ่ม Trends + Timeline
- **Full:** แสดงชุดเครื่องมือเดิมทั้งหมด

Case Summary ยังคงเข้าถึงได้จากปุ่ม `← CASE` ที่เห็นชัดใน OR LIVE และจึงไม่จำเป็นต้องอยู่ใน Minimal menu

## Settings — OR / Mobile Workflow

เพิ่ม Hospital Defaults ที่ปรับได้โดยไม่แก้ code:

- OR MORE menu: Minimal / Standard / Full
- Quick medication buttons: 2 / 4 / 6
- Default OR vitals interval: 3 / 5 / 10 / 15 นาที
- Default Recovery vitals interval: 3 / 5 / 10 / 15 นาที
- Auto OR Focus on phone / iPad
- Show / hide Mini trends in OR LIVE
- Show / hide Recent activity in OR LIVE
- Default report: 1-page Summary PDF / Full PDF

ค่าพวกนี้เป็น presentation/workflow defaults และไม่เปลี่ยน clinical record ที่ถูก freeze ไปแล้ว

## Safety boundaries

Settings **ไม่สามารถปิด** สิ่งต่อไปนี้:

- Pre-OR readiness gate
- workflow step confirmation
- Undo guard / audit trail
- current BW / stale medication calculation guards
- recovery workflow guard
- final lock requirements

ไม่มีการเปลี่ยน dose defaults, concentration formulas, alert thresholds, ASA/BOAS logic, fluid reference หรือ storage schema

## Tests

ผ่านชุดที่รันได้ใน runtime นี้:

- Syntax + JSON
- Static regression/backward compatibility
- V15.8 OR Workspace customization contracts
- Clinical helpers: 73 assertions
- Workflow model: 4 scenarios

DOM/browser automation ยังไม่อ้างว่าผ่าน เนื่องจาก runtime ไม่มี `jsdom/fake-indexeddb/Playwright` ที่ติดตั้งไว้
