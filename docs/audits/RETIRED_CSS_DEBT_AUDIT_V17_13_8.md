# Retired CSS Source / Remaining Presentation Debt Audit — ANESVET V17.13.8

## Scope
ต่อจาก V17.13.7 แบบ incremental โดยใช้ V17.13.7 เป็น source of truth ตรวจ CSS counterparts ของ JavaScript presentation owners ที่ retire จาก runtime แล้ว 13 modules เพื่อแยกให้ชัดว่าอะไรเป็น dead payload จริง และอะไรยังเป็น active visual dependency ของ canonical owners ปัจจุบัน

รอบนี้ไม่ rewrite UI, ไม่เปลี่ยน clinical semantics และไม่ลบ CSS section ทั้งก้อนเพียงเพราะ JavaScript ชื่อเดียวกันถูก retire

## Audit method
1. Parse startup JavaScript จาก `index.html` (69 scripts)
2. รวม lazy/offline JavaScript ที่ Service Worker precache เป็น runtime union (76 scripts)
3. ตรวจ class selector จาก retired CSS counterparts ทั้ง 13 files เทียบกับ active runtime + HTML
4. ตรวจ exact duplicate rule ระหว่าง retired CSS กับ non-retired standalone CSS
5. ตรวจ custom properties / state classes ที่ไม่มี consumer
6. prune เฉพาะ selector branch / declaration / exact duplicate ที่พิสูจน์ได้ว่าไม่เปลี่ยน active behavior
7. sync เฉพาะ source section ที่แตะกลับเข้า `anesvet-ui-bundle.css` โดยไม่ rebuild historical bundle sections อื่น

## Retired JavaScript → CSS counterparts audited
| Retired CSS source | Class tokens after prune | Inactive class tokens after prune | Decision |
|---|---:|---:|---|
| `ui-refinement.css` | 97 | 0 | retain — active global visual dependency |
| `adaptive-workspace.css` | 59 | 0 | retain — active workspace/layout dependency |
| `clinical-simplicity.css` | 28 | 0 | retain after duplicate-rule prune |
| `recovery-endcase-ux.css` | 10 | 0 | retain — active recovery visual dependency |
| `repeat-use-ux.css` | 17 | 0 | retain after unused custom-property prune |
| `repeat-use-r26.css` | 1 | 0 | retain — live repeat-use state |
| `focused-workspace.css` | 43 | 0 | retain after dead branch/property prune |
| `progressive-disclosure.css` | 16 | 0 | retain — active disclosure styles still referenced |
| `progressive-clinical-flow.css` | 33 | 0 | retain — surviving selectors still active |
| `pilot-efficiency.css` | 39 | 0 | retain — surviving selectors still active |
| `usability-hardening.css` | 9 | 0 | retain — migrated canonical owners still emit these UI classes |
| `mobile-first-r27.css` | 54 | 0 | retain after dead selector-member prune |
| `or-speed-hardening.css` | 18 | 0 | retain — OR LIVE / medication / mobile owners still use classes |

Total remaining class tokens across these 13 retired CSS sources: **424**; static runtime/HTML reference scan reports **0 inactive** after safe prune.

## Safe pruning performed
### `focused-workspace.css`
- removed dead `.no-problems` selector branch from Recovery problems panel rule
- removed unused `--ux-sticky-top` declarations (desktop + mobile)
- retained `.ux-recovery-collapsible`, `.ux-complete`, `.ux-attention` and related rules because `recovery-end-refinement.js` still emits these states

### `repeat-use-ux.css`
- removed unused `--r25-ink`
- retained `--r25-border`, `--r25-focus` and `.r25-resume-action` because repeat/resume UI remains active

### `mobile-first-r27.css`
Removed selector alternatives with no active runtime/HTML reference:
- `.case-form`
- `.record-table-wrap`
- `.archive-table-wrap`

Retained R27-derived styles still owned by canonical runtime, including:
- `r27-keyboard-open` → `mobile-or-owner.js`
- `r27-identity-icon` / `r27-identity-info` / `mobileIdentityBtn` → `workspace-owner.js`

### `clinical-simplicity.css`
Removed two exact duplicate ordering rules already supplied by base `style.css` under the same responsive context:
- Recovery command `order:0`
- Recovery dashboard `order:2`

After cleanup, exact duplicate scan against non-retired standalone CSS reports **0 exact duplicates** for all 13 retired CSS counterparts.

## Protected migrated visual contracts
The following styles remain intentionally even though their original JavaScript owner was retired:
- Fast Vital rail / `or-fast-entry-active` → `or-live-controller.js`
- Quick Drug mobile presentation → `medication-workspace-controller.js`
- `r27-keyboard-open` → `mobile-or-owner.js`
- mobile Identity bridge → `workspace-owner.js`
- `.ux-save-assist` → `app-shell.js`
- `.ux-return-case` → `repeat-presentation-owner.js`
- `.ux-recovery-collapsible` → `recovery-end-refinement.js`
- `--anesvet-visual-height` is retained because `mobile-or-owner.js` still writes this runtime CSS contract even though current bundled rules do not consume it directly

## Bundle result
- V17.13.7: **395,727 bytes**
- V17.13.8: **395,402 bytes**
- delta: **-325 bytes** (~0.08%)
- source markers: **38/38 retained**
- standalone source CSS: **38 files retained**
- runtime stylesheets: **2**

The small byte reduction is intentional. The goal of this milestone is to establish a trustworthy ownership boundary, not to maximize deletion.

## Interpretation
The remaining CSS inside the 13 retired-source sections should now be treated as **active visual debt**, not dead code. A future cleanup should migrate rules to their canonical owner source before deleting the legacy-named source section. Whole-section deletion is not justified by this audit.

## Clinical scope
No intentional changes to:
- dose / concentration calculations
- clinical thresholds / alerts
- persistence schema
- Induction given/details-pending semantics
- editable induction administration time
- Intubation timestamp-only semantics
- End Surgery
- Emergency Return OR ↔ Recovery
- Recovery readiness / handoff
- Final Lock / archive verification
- Fast Vital behavior
- Quick Drug behavior
- PWA freeze / BFCache restoration

## Validation limitation
This is static/source-contract + deterministic Node regression + syntax/parser validation. It is not a physical Android/iPad/PWA/IME visual interaction test.
