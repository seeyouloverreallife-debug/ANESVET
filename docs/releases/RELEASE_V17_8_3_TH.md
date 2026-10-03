# ANESVET V17.8.3 — OR LIVE Simplification

## Core-first OR
The default OR LIVE surface now prioritizes:
1. Patient / phase / timer
2. Vitals workspace
3. Next clinical step
4. Planned medication queue
5. Compact Active Safety summary

Supporting panels are retained but grouped under `OR details`:
- workflow profile / full phase tracker
- BP & maintenance
- detailed Active Problems and prioritized alerts
- Fluid / Blood Loss
- Airway / Ventilation
- Event / Problem
- active complication detail
- mini trends / recent activity

## Safety behavior
The compact Active Safety surface watches the existing alert/problem/complication counts.
When any are active it changes prominence and reports the total.
`Review` expands OR details and moves to the existing problem/alert workspace.

No clinical state, alert thresholds, medication logic, vital recording, phase transition, recovery transition, audit or archive behavior was removed.
