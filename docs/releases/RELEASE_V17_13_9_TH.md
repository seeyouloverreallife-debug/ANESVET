# ANESVET V17.13.9 — Canonical CSS Ownership Migration I

## เป้าหมาย
พัฒนาต่อจาก V17.13.8 แบบ incremental โดยใช้ V17.13.8 เป็น source of truth เริ่มย้าย active CSS ออกจาก legacy source names ไปยัง canonical ownership โดยไม่เปลี่ยน CSS cascade หรือ clinical behavior

## สิ่งที่เปลี่ยน
### 1) Retire CSS legacy source names 2 ตัว
- `or-speed-hardening.css` → `or-clinical-interaction.css`
- `repeat-use-r26.css` → `repeat-presentation-owner.css`

ไฟล์ canonical ใหม่ใช้ CSS source bytes เดิมแบบ exact copy และ bundle marker ถูกแทนที่ ณ ตำแหน่งเดิม

### 2) Zero-cascade-risk migration
- ไม่ย้าย declaration ข้ามตำแหน่งใน `anesvet-ui-bundle.css`
- ไม่แก้ selector
- ไม่แก้ declaration
- ไม่แก้ media query
- ไม่เปลี่ยน rule order

จึงเป็น ownership migration ก่อนเริ่ม structural CSS movement ใน milestone ถัดไป

### 3) Debt reduction
- retired presentation JS: **13** modules (คงเดิม)
- retired/legacy CSS source debt: **13 → 11**
- canonical migrated CSS sources: **2**
- standalone CSS bundle sources: **38**
- bundle markers: **38/38**
- runtime CSS delivery: **2 stylesheets**

### 4) Release alignment
- runtime/service worker/knowledge lazy loader → V17.13.9
- cache generation → `anesvet-v17-13-9-startup`

## Runtime behavior preserved
ไม่มี intentional change ต่อ:
- Induction = given / details pending
- editable induction administration time
- Intubation = timestamp-only
- Fast Vital
- Quick Drug
- End Surgery
- Emergency Return OR ↔ Recovery
- Recovery / handoff
- Final Lock / archive verification
- PWA freeze / BFCache restoration
- dose / concentration calculations
- alert thresholds
- persistence schema

## QA
- `QA_V17_13_9_CANONICAL_CSS_OWNERSHIP.js`: 38/38 PASS
- `QA_V17_13_9_STATIC_INTEGRITY.js`: 15/15 PASS
- `QA_V17_13_9_CURRENT_WORKFLOW.js`: 31/31 PASS
- `QA_V17_13_9_END_TO_END.js`: 17/17 PASS
- `QA_V17_13_9_OR_INTERACTION.js`: 33/33 PASS
- Total contract QA: **134/134 PASS**

รายละเอียด migration: `CANONICAL_CSS_OWNERSHIP_MIGRATION_V17_13_9.md`

## Scope limitation
QA เป็น static/source-contract + deterministic Node regression + CSS parser/syntax validation ไม่ใช่ physical Android/iPad/PWA/IME visual interaction test

## Additional validation
- CSS parser (canonical + migrated source CSS): **4/4 PASS, 0 errors**
- Active startup JavaScript syntax: **69/69 PASS**
- Startup + lazy runtime JavaScript syntax: **76/76 PASS**
- Service Worker syntax: **PASS**
- Service Worker assets: **119**
- Service Worker JavaScript assets: **75**
- Service Worker CSS assets: **2**
- normalized production bundle vs V17.13.8: **byte-equivalent after marker-name normalization**
- bundle size: **395,402 → 395,418 bytes (+16 bytes marker text only)**

## CSS hashes
- `anesvet-ui-bundle.css`: `729d0523ef2bf472b433740afcea5c9351c4016184743c551c4fb3c005026962`
- `or-workspace-restructure.css`: `8a062bfab28874a1537de804bfefd7c26e9f1941a99d7169e8972f4ce1e38c73`
- `or-clinical-interaction.css`: `0013e98aa2b0ef2f2541a9954ccd34801e4a2c336a93ce3b235ebd1abd8edd22`
- `repeat-presentation-owner.css`: `25740506bf405fac8c4a13ff641350a8d1f16d5c4b65ae2820821527c19a8a33`
