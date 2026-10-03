# ANESVET V17.13.2 — Legacy Presentation Retirement II

## เป้าหมาย
ลด runtime presentation layer ต่อจาก V17.13.1 โดยย้าย behavior ที่ยังจำเป็นเข้า canonical owners ก่อนหยุดโหลด legacy modules.

## Runtime retirement
หยุดโหลด JavaScript เพิ่ม 4 ตัว:
- `focused-workspace.js`
- `progressive-disclosure.js`
- `progressive-clinical-flow.js`
- `pilot-efficiency.js`

Runtime script references ลดจาก **76 → 72**.

## Behavior ที่ย้ายแล้ว
### Patient / Pre-op owner
- linked Patient Master compact mode
- Pre-op remaining count / focus incomplete
- next incomplete target + focus
- patient completion presentation

### Drug Plan owner
- Build / Review / OR LIVE next-action derivation
- compatibility next-task button
- Focus Case Drug Plan
- Quick Presets disclosure

### Recovery owner
- Recovery Observation / Checklist collapsible panels
- Recovery summary / remaining next-task behavior
- Focus pending state
- compatibility `ANESVETFocusedWorkspace` API

### Workspace owner
- workflow step-state labels
- mobile Continue button
- mobile workflow status badges
- Settings search/collapse/expand disclosure
- compatibility `ANESVETProgressiveDisclosure` API

## Clinical behavior preserved
ไม่มีการเปลี่ยน dose calculation, safety thresholds, persistence, Induction semantics, Intubation timestamp, End Surgery, Emergency Return, Recovery completion criteria หรือ Final Lock.

## Scope
ยังเป็น source-contract/Node regression ไม่ใช่ physical Android/iPad browser E2E.
