# ANESVET V17.13.6 — CSS Bundle Pruning I / Presentation Debt Audit

## เป้าหมาย
พัฒนาต่อจาก V17.13.5 แบบ incremental โดยใช้ V17.13.5 เป็น source of truth และเริ่มลด dead presentation rules ออกจาก production CSS bundle แบบ conservative selector-by-selector โดยไม่ rewrite UI และไม่เปลี่ยน clinical semantics, dose/safety rules, persistence schema หรือ finalization contract

## สิ่งที่เปลี่ยน
### 1) Safe CSS bundle pruning
ตัดเฉพาะ selector ที่มี positive dependency กับ presentation owner ที่ retire ไปแล้ว หรือ renderer เก่าที่ไม่ถูก startup/lazy runtime สร้างใช้อีก

ไฟล์ source ที่ถูก prune พร้อมกับส่วนเดียวกันใน `anesvet-ui-bundle.css`:
- `style.css`
- `ui-refinement.css`
- `progressive-disclosure.css`
- `progressive-clinical-flow.css`
- `clinical-simplicity.css`
- `or-knowledge.css`

ผลลัพธ์ production bundle:
- V17.13.5: **403,018 bytes**
- V17.13.6: **396,844 bytes**
- ลด **6,174 bytes (~1.53%)**
- source markers ยังคง **38/38**
- standalone CSS source ยังคงอยู่ครบสำหรับ audit / rollback

ตัวอย่าง dead presentation rules ที่ถอด:
- `.pd-section-tag`
- `.ux-patient-form-toolbar`
- `.ux-patient-details-toggle`
- `.ux-r22-case-return`
- obsolete internal OR Knowledge renderer (`.or-knowledge-item`, `.or-knowledge-body`, `.or-knowledge-section`)
- `.or-more-profile-note`
- `.pilot-feedback-status-grid`
- `.dose-spotlight-grid`

### 2) Dynamic/lazy protection
การ audit ไม่ได้อิงเฉพาะ `index.html` เพราะ ANESVET มี lazy runtime assets
- `clinical-knowledge-ui.js` และ Knowledge modules ยังถูกโหลดผ่าน `knowledge-loader.js`
- `.ck-*` CSS จึงถูกคงไว้
- dynamic class `review-${severity}` จาก `app.js` ถูกคง styles `.review-warn`, `.review-note`, `.review-good`

### 3) Fix lazy Knowledge offline version mismatch
พบว่า V17.13.5 `knowledge-loader.js` ยัง request lazy Knowledge assets ด้วย `?v=17.6.1` ขณะที่ Service Worker precache เป็น `?v=17.13.5`

V17.13.6 แก้ให้ lazy loader และ Service Worker ใช้ `?v=17.13.6` ตรงกัน เพื่อให้ exact-cache fallback ของ versioned assets ทำงานได้ถูกต้องเมื่อ offline

ไม่มีการเปลี่ยน clinical knowledge content ใน milestone นี้

## Deferred presentation debt
ยังไม่ prune selector ที่ static scan อาจตีความผิดจาก negative state เช่น:
- `body.or-mobile-active:not(.ux-or-context-compact) #orStickyMini`
- `#patient:not(.ux-patient-details-open) .patient-form-grid`

สองจุดนี้คงไว้จนกว่าจะมี physical visual/device validation เพราะการที่ class ด้านใน `:not(...)` ไม่ถูกสร้างแล้วอาจทำให้ rule กลายเป็น always-active แทนที่จะ dead

## Runtime / delivery
- Runtime JavaScript: **69 scripts** (คงเดิม)
- Runtime stylesheets: **2** (`anesvet-ui-bundle.css` + `or-workspace-restructure.css`)
- Service Worker CSS precache: **2**
- JavaScript retirement count: **13 modules** (คงเดิม ไม่มี retire เพิ่มในรุ่นนี้)

## CSS hashes
- `anesvet-ui-bundle.css`: `5bf301b5f73aa389497bfd3a0cf80de102696067f620e2bb059043f167ee4729`
- `or-workspace-restructure.css`: `fee4fcd43dce265c6a52d61ef0eec96dbeb31266d3b54310799aec8462052cda`

## Clinical behavior preserved
ไม่ตั้งใจเปลี่ยน:
- Induction = prepared induction medications considered given / details pending
- individual induction administration time แก้ไขย้อนหลังได้
- Intubation = timestamp-only
- End Surgery
- Emergency Return OR ↔ Recovery
- Recovery criteria / handoff
- Final Lock / archive verification
- dose calculation / concentration handling / safety thresholds
- persistence schema / current-case storage contracts
- Fast Vital keyboard/save semantics
- Quick Drug keyboard progression
- PWA freeze / BFCache restoration callbacks

## QA
Current-release contract suites:
- `QA_V17_13_6_CSS_PRUNING.js`: 36/36 PASS
- `QA_V17_13_6_STATIC_INTEGRITY.js`: 15/15 PASS
- `QA_V17_13_6_CURRENT_WORKFLOW.js`: 31/31 PASS
- `QA_V17_13_6_END_TO_END.js`: 17/17 PASS
- `QA_V17_13_6_OR_INTERACTION.js`: 33/33 PASS
- Total: **132/132 PASS**

Additional validation:
- CSS parser: **8/8 PASS**, 0 parse errors
- Active runtime JS syntax: **69/69 PASS**
- Service Worker precache JS syntax: **75/75 PASS**
- Startup + lazy runtime union JS syntax: **76/76 PASS**
- Service Worker assets: **119**
- Service Worker CSS refs: **2**

รายละเอียดเต็มอยู่ใน `QA_V17_13_6_RESULTS.txt`

## Scope limitation
QA ยังเป็น static/source-contract + deterministic Node regression + CSS parser validation ไม่ใช่ physical Android/iPad/PWA/IME visual interaction test. Selector ที่ขึ้นกับ negative presentation state จึงยังถูก defer ไว้แทนการ prune แบบเสี่ยง
