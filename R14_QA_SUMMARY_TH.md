# ANESVET R14 — QA Summary

- Parent: V17.2.17 R13
- New: V17.2.18 R14
- Regression suites: **19/19 PASS**
- R14 focused unit/scenario checks: **15/15 PASS**
- JS syntax: **117 PASS**
- HTML ID duplicates: **0**
- Cached referenced assets missing: **0**
- Version consistency: **True**
- Source files unchanged: **614/619**
- Changed existing source files: `active-case-freshness.js, app.js, index.html, manifest.webmanifest, service-worker.js`
- Clinical controllers unchanged: yes (hash checked against R13)
- Browser E2E: **NOT VERIFIED** (not claimed)
- Android / iPad device testing: **NOT VERIFIED** (not claimed)
- Known limit: Cross-tab localStorage compare and set is not atomic; latest-case protection still requires device acceptance testing.

Backward tests modified only as copies where release number is checked; original QA tests/results remain in archive. Full output: `QA_R14_RESULTS.json`.
