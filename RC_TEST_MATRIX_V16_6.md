# RC TEST MATRIX — ANESVET V16.6

Use this for hospital/device acceptance. Mark each scenario PASS / FAIL and attach a support report for failures.

| # | Scenario | Automated | Real-device | Acceptance |
|---|---|---|---|---|
| 1 | New patient → Pre-check → Drug plan → OR → Recovery → Final Lock | Partial | Required | No lost data; no blocker dead-end |
| 2 | Induction with 2–3 drugs | Partial | Required | Actual administrations remain distinct |
| 3 | MAP low → alert → intervention → resolved | Partial | Required | Episode/audit sequence preserved |
| 4 | Planned medication marked Not given | Partial | Required | Reconciliation can complete with reason/reviewer |
| 5 | Medication outside Frozen Plan | Partial | Required | Appears as other actual administration |
| 6 | Reload during active OR | Harness | Required | Latest saved/checkpoint state returns |
| 7 | Close PWA then reopen active case | Harness | Required | No state rollback |
| 8 | Offline during case | PASS | Required | Current case continues local save |
| 9 | Keyboard open/close repeatedly on mobile | Prior regression | Required | No viewport jump / obscured critical action |
|10 | Void medication | Prior regression | Required | Queue/reconciliation return to pending correctly |
|11 | Abnormal Recovery | Partial | Required | WATCH/Handoff preserves abnormal-first context |
|12 | Incomplete case → Final Lock attempt | Partial | Required | Lock remains blocked with actionable blocker |
|13 | Final Lock → Archive → verify checksum | Static/partial | Required | Checksum valid |
|14 | Backup → restore → archive integrity | Partial | Required | Counts and locked checksums preserved |
|15 | Storage nearly full | Not reproducible here | Required | Save failure visible; backup remains accessible |
|16 | Two tabs open | PASS simulated | Required | One active owner; second VIEW ONLY |
|17 | App update while active mutable case | PASS guard | Required | Update button disabled/deferred |
|18 | App update after sealed Final Lock | PASS guard | Required | Update allowed without Reset |
|19 | Legacy V14.2 current case | PASS | Optional real device | Migrates without data loss |
|20 | Android/iPad rotation portrait ↔ landscape | Responsive harness | Required | No lost input / inaccessible controls |

## Device set
Minimum acceptance set:
- Android Chrome installed PWA
- iPad Safari / Add to Home Screen
- Windows Chrome
- Windows Edge

## RC exit criterion
Do not call V16.6 production-stable until all Required scenarios pass on the hospital's actual OR device(s), with no unresolved data-loss, medication-record, Final Lock, or recovery-handoff defect.
