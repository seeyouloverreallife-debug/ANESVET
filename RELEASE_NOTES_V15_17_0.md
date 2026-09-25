# ANESVET V15.17.0 — Drug Plan & Recovery Focus

## Goal
Continue the V15.16 one-hand workflow work without changing clinical calculations, dose references, safety gates, or case storage schema.

## Drug Plan efficiency
- Added a compact **Drug Plan quick workflow strip** under Case Drug Plan status.
- The main action adapts to the current state:
  - empty plan → `Build from hospital protocol`
  - unreviewed plan → `Save / Review plan`
  - reviewed/frozen plan → `Check readiness → OR LIVE`
- Added **Focus only Case Drug Plan** toggle for long mobile pages. This hides reference/calculator sections only; it never changes or deletes the plan.
- Added a concise planned/standby/reviewed summary.
- Existing OR readiness gate and Pre-OR Briefing remain authoritative.

## Recovery efficiency
- Added a compact **Recovery next-task strip**.
- Next-task guidance follows the existing Recovery requirements and points to:
  - Begin Recovery
  - required observations
  - first Recovery vital record
  - unfinished checklist items
  - Recovery readiness score
  - final readiness/complete action
- Added **Focus pending items** toggle that hides only already-reviewed Recovery checklist rows.
- Added concise Recovery progress summary: Vitals / Checklist / Score / Ready.
- Mobile workflow menu now shows active Recovery progress.

## Safety / compatibility
- No dose, concentration, ETT, ventilation, fluid, or alert-threshold changes.
- No storage schema changes.
- No bypass of Pre-OR readiness, Briefing, medication confirmation, Recovery completion override, or Final Lock.
- `app.js` clinical behavior is unchanged except `APP_VERSION` → `15.17.0`.
- New behavior stays in the UI-only `pilot-efficiency.js/.css` layer plus small markup additions.
