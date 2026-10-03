# Physical Pilot UX Fix II Audit — V17.14.6

Evidence source: user-provided V17.14.5 physical-device screenshots/feedback.

## Defects confirmed
1. Vent workspace buttons could receive touch/focus but did not reliably change the authoritative ventilation mode or reveal mode fields.
2. Recovery displayed read-only summary/history before the editable Recovery vital-sign entry workflow.
3. Recovery score numeric buttons hid the clinical meaning of 0/1/2 from users unfamiliar with the internal score.

## Acceptance contract
### Vent
- One canonical owner changes `airwayVentMode`, `orVentilation`, and master `ventilation` together.
- Mechanical / Manual PPV expose ventilator settings; Spontaneous hides them.
- Mode selection shows visible selected-state feedback.

### Recovery
- Editable vital-sign inputs appear before the read-only summary on mobile.
- HR/RR/SpO₂/Temp/Mentation/Extubation are immediately visible.
- Record and Copy-last actions are available beside the entry workflow.
- MAP/O₂ support/interval/notes remain available but do not crowd the first screen.
- Record history is secondary.

### Recovery assessment
- Descriptive option meaning remains visible.
- Numeric-only quick controls are not the primary input UI.
- Existing score calculation and readiness semantics remain unchanged.

## Validation limitation
Automated source/runtime checks verify ownership and deterministic state transitions. Physical acceptance still requires re-test on the same mobile device because touch, browser viewport, IME, font rendering, and PWA/browser chrome cannot be fully reproduced by Node-based QA.
