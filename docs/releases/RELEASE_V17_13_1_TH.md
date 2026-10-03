# ANESVET V17.13.1 — Legacy Presentation Retirement I

## เป้าหมาย
ลด runtime presentation patch ที่ซ้ำกับ canonical owners โดยไม่เปลี่ยน clinical logic, case state, dose calculation, safety gate หรือ persistence.

## Retired from runtime
V17.13.1 เลิกโหลด 6 modules:
- `ui-refinement.js` — compatibility marker only
- `adaptive-workspace.js` — save feedback moved to `app-shell.js`
- `clinical-simplicity.js` — OR layout ownership retired; final navigation labels are static in `index.html`
- `recovery-endcase-ux.js` — compatibility marker only
- `repeat-use-ux.js` — merged into `repeat-presentation-owner.js`
- `repeat-use-r26.js` — merged into `repeat-presentation-owner.js`

Runtime script references ลดจาก **82 → 76**.

## Ownership hardening
- `focused-workspace.js` no longer mutates OR LIVE presentation when `or-workspace-v17130` owns `orlive.layout`.
- `progressive-disclosure.js` skips Patient / Pre-op / Drug Plan / Recovery surfaces already owned by canonical V17.13 owners.
- Presentation Ownership diagnostics now expose the retired module list.

## Behavior preserved
`repeat-presentation-owner.js` now owns the still-needed repeat-use presentation behavior:
- Resume active case buttons
- End Case fast-review arrangement
- New-case CTA after Final Lock
- Recovery Enter-key field navigation (focus only; never auto-saves)

`app-shell.js` now owns the small Saved-state visual feedback previously in `adaptive-workspace.js`.

## Clinical behavior unchanged
Preserved: Induction given/details-pending, editable individual induction drug time, Intubation timestamp-only, Calculated-as-Given, OR LIVE layout contract, End Surgery, Emergency Return, Recovery, Final Lock and archive integrity.

## Scope
This is Legacy Retirement I. Several older presentation helpers still remain loaded because they contain behavior not yet transferred to canonical owners. They should be retired incrementally with regression coverage rather than deleted in one large change.
