# ANESVET V17.13.8 — Retired CSS Source / Remaining Presentation Debt Audit

## เป้าหมาย
พัฒนาต่อจาก V17.13.7 แบบ incremental โดยใช้ V17.13.7 เป็น source of truth ตรวจ presentation CSS ที่ยังหลงเหลือจาก JavaScript owners ซึ่ง retire ไปแล้ว เพื่อแยก dead payload ออกจาก visual rules ที่ canonical runtime ปัจจุบันยังใช้จริง

## สิ่งที่เปลี่ยน
### 1) Retired CSS ownership audit
ตรวจ CSS counterparts ของ retired JavaScript owners ครบ 13 modules กับ startup + lazy runtime + HTML

ผลหลัง safe prune:
- remaining retired-source class tokens: **424**
- inactive class tokens: **0**
- exact duplicate rules กับ non-retired standalone CSS: **0**

ข้อสรุป: CSS ที่เหลือใน legacy-named sections ยังเป็น active visual dependency ไม่ควรถูกลบทั้ง section

### 2) Safe dead-code prune
`focused-workspace.css`
- ลบ `.no-problems` branch ที่ไม่มี emitter/DOM active
- ลบ `--ux-sticky-top` ที่ไม่มี consumer

`repeat-use-ux.css`
- ลบ `--r25-ink` ที่ไม่มี consumer

`mobile-first-r27.css`
- ลบ `.case-form`
- ลบ `.record-table-wrap`
- ลบ `.archive-table-wrap`
จาก selector groups ที่ไม่มี active runtime/HTML reference

`clinical-simplicity.css`
- ลบ Recovery ordering 2 rules ที่ duplicate กับ base `style.css` แบบ exact declaration/context

### 3) Preserve migrated visual contracts
ไม่ลบ CSS ที่ canonical owners ยังใช้งาน เช่น:
- R27 keyboard state → `mobile-or-owner.js`
- mobile Identity bridge → `workspace-owner.js`
- Fast Vital → `or-live-controller.js`
- save assist → `app-shell.js`
- return shortcut → `repeat-presentation-owner.js`
- Recovery collapsible state → `recovery-end-refinement.js`

## Runtime / delivery
- Runtime JavaScript: **69 scripts**
- Startup + lazy runtime JS union: **76 scripts**
- Runtime stylesheets: **2**
- Service Worker assets: **119**
- JavaScript retirement count: **13 modules**
- Standalone source CSS: **38 files**
- Bundle source markers: **38/38**
- `anesvet-ui-bundle.css`: **395,727 → 395,402 bytes** (-325 bytes / ~0.08%)

## Clinical behavior preserved
ไม่มี intentional change ต่อ:
- Induction = prepared induction medications considered given / details pending
- individual induction administration time แก้ไขย้อนหลังได้
- Intubation = timestamp-only
- End Surgery
- Emergency Return OR ↔ Recovery
- Recovery criteria / handoff
- Final Lock / archive verification
- dose / concentration calculations
- alert thresholds
- persistence schema
- Fast Vital keyboard/save behavior
- Quick Drug keyboard progression
- PWA freeze / BFCache restoration

## QA
- `QA_V17_13_8_RETIRED_CSS_DEBT.js`: 44/44 PASS
- `QA_V17_13_8_STATIC_INTEGRITY.js`: 15/15 PASS
- `QA_V17_13_8_CURRENT_WORKFLOW.js`: 31/31 PASS
- `QA_V17_13_8_END_TO_END.js`: 17/17 PASS
- `QA_V17_13_8_OR_INTERACTION.js`: 33/33 PASS
- Total contract QA: **140/140 PASS**

รายละเอียด audit: `RETIRED_CSS_DEBT_AUDIT_V17_13_8.md`

## Scope limitation
QA เป็น static/source-contract + deterministic Node regression + CSS parser/syntax validation ไม่ใช่ physical Android/iPad/PWA/IME interaction test

## Additional validation
- CSS parser (canonical + touched stylesheets): **6/6 PASS, 0 errors**
- Active startup JavaScript syntax: **69/69 PASS**
- Startup + lazy runtime JavaScript syntax: **76/76 PASS**
- Service Worker syntax: **PASS**
- Service Worker assets: **119**
- Service Worker JavaScript assets: **75**
- Service Worker CSS assets: **2**

## CSS hashes
- `anesvet-ui-bundle.css`: `d3532aba949ee6a04e5b79ad800251a3fdafd464ef359515992d1b4bd446a8a8`
- `or-workspace-restructure.css`: `8a062bfab28874a1537de804bfefd7c26e9f1941a99d7169e8972f4ce1e38c73`
