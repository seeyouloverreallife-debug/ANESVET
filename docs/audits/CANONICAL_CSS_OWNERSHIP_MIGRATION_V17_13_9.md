# Canonical CSS Ownership Migration I — ANESVET V17.13.9

## Scope
ต่อจาก V17.13.8 แบบ incremental โดยใช้ V17.13.8 เป็น source of truth เป้าหมายคือเริ่มย้าย CSS ที่ยัง active ออกจากชื่อ source แบบ legacy/hardening ไปสู่ชื่อ source ที่สะท้อน owner ปัจจุบัน โดย **ไม่เปลี่ยน declaration order หรือ cascade** ในรอบแรก

รอบนี้ไม่ rewrite UI, ไม่เปลี่ยน clinical semantics และไม่ย้าย declaration ข้ามตำแหน่งใน canonical bundle

## Migration strategy
ใช้ zero-cascade-risk source ownership migration:
1. รักษา CSS source bytes เดิม 100%
2. เปลี่ยนชื่อ standalone source ให้ตรง ownership ปัจจุบัน
3. เปลี่ยนเฉพาะ source marker ใน `anesvet-ui-bundle.css` ณ ตำแหน่งเดิม
4. ไม่เปลี่ยน declaration body, selector, media query หรือ rule order
5. retire legacy source filename ออกจาก package

## Migrated sources
### 1) OR clinical interaction
Legacy source:
- `or-speed-hardening.css`

Canonical source:
- `or-clinical-interaction.css`

Canonical runtime responsibilities represented by this stylesheet:
- Fast Vital rail presentation → `or-live-controller.js`
- keyboard/viewport CSS variables → `mobile-or-owner.js`
- Quick Drug mobile input/sticky-action hardening → `medication-workspace-controller.js` + mobile presentation contract
- OR / Recovery mobile dock safe-area presentation

Guarantees:
- source SHA-256 preserved exactly: `0013e98aa2b0ef2f2541a9954ccd34801e4a2c336a93ce3b235ebd1abd8edd22`
- canonical bundle source marker remains at historical position 24/38
- declaration/cascade order unchanged

### 2) Repeat presentation
Legacy source:
- `repeat-use-r26.css`

Canonical source:
- `repeat-presentation-owner.css`

Canonical runtime responsibility:
- `.r26-next-case` emitted by `repeat-presentation-owner.js`

Guarantees:
- source SHA-256 preserved exactly: `25740506bf405fac8c4a13ff641350a8d1f16d5c4b65ae2820821527c19a8a33`
- canonical bundle source marker remains at historical position 33/38
- declaration/cascade order unchanged

## Debt status after migration
- Retired JavaScript presentation modules: **13** (unchanged)
- Legacy-named retired CSS sources still awaiting migration: **11**
- Canonical CSS sources migrated from retired owners in this milestone: **2**
- Standalone CSS source files represented in bundle: **38**
- Bundle source markers: **38/38**
- Runtime stylesheets loaded by index: **2**

The remaining 11 legacy CSS sources are still active visual debt. Whole-source deletion or movement is not justified until each source has a safe owner mapping and cascade-preserving migration plan.

## Clinical scope preserved
No intentional changes to:
- drug dose / concentration calculations
- thresholds / alert semantics
- persistence schema
- Induction given/details-pending semantics
- editable induction administration time
- Intubation timestamp-only semantics
- End Surgery
- Emergency Return OR ↔ Recovery
- Recovery handoff / readiness
- Final Lock / archive verification
- Fast Vital behavior
- Quick Drug behavior
- PWA freeze / BFCache restoration

## Validation limitation
Static/source-contract + deterministic Node regression + syntax/parser validation only. This is not a physical Android/iPad/PWA/IME visual interaction test.
