# Runtime Module Map — V17.14.2

Runtime paths and startup order are unchanged from V17.14.0.

- platform: positions 1–5
- clinical: positions 6–8
- core: positions 9–18
- domains: positions 19–23
- orchestration: positions 24–26
- controllers: positions 27–33
- remaining startup modules: root positions 34–69
- lazy knowledge: runtime/knowledge (7 modules)

V17.14.2 introduces no runtime module path migration. Production clinical controller/domain ownership and startup order are unchanged. The release adds deterministic pilot evidence and fixes build-version authority in Simulation Mode, Production Pilot and Validation Center.


## V17.14.2 pilot evidence authority
- `simulation-mode.js`: current build version from `AnesvetApp.version`; simulation remains sandboxed.
- `production-pilot.js`: current-build readiness evidence only.
- `validation-center.js`: current-build active/history qualification evidence.
- Clinical production ownership and startup order are unchanged.
