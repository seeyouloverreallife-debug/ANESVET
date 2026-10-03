# Runtime Module Map — V17.14.4

No runtime module path migration is introduced in V17.14.4.

- platform: positions 1–5
- clinical: positions 6–8
- core: positions 9–18
- domains: positions 19–23
- orchestration: positions 24–26
- controllers: positions 27–33
- remaining startup modules: root positions 34–69
- lazy knowledge: runtime/knowledge (7 modules)

The only intended non-version runtime logic change is Physical Pilot telemetry inside `production-pilot.js`; `index.html` adds its controls/surface. Clinical controllers/domains and startup order remain unchanged.
