# Architecture review before implementation

Baseline: supplied ANESVET_V14_6_4(1).zip; original archive and extracted source preserved unmodified for comparison.

- Offline vanilla HTML/CSS/JS PWA. app.js owns state in an async IIFE. No framework/build step.
- OR_SYNC mirrors existing monitoring fields into OR LIVE. Keep original IDs, including dashboard under Advanced.
- localStorage keys stay anesvet_v14_3_*. IndexedDB stays ANESVET_DB v2, same stores.
- Start Case captures protocolSnapshot (builtInProtocol, concentrations, drugLibrary, quickPresets). Extend additively without rewriting signed clinical payloads.
- drugAdministrations links to events through drugAdministrationId. Reuse writer and VOID behavior.
- Existing alertEpisodes only covers critical MAP/SpO2 and tracking depends on popup preference. Decouple notifications from tracking; retain key names.
- Recovery has explicit, extubation and emergency return paths; capture each handoff without inventing observations.
- Existing regression is source checks; existing workflow tests are an independent model; browser smoke uses mocked storage. Add production-logic and full-DOM tests, plus a real HTTP-origin browser runner.

Preserve baseline clinical values: MAP warning <70, critical <60; SpO2 warning <95, critical <90; ETCO2 warning <40/>55, critical <30/>60; temperature warning <99F, critical <98F. No default upper temperature trigger. Preserve doses, HR/RR and fluid references.

Add clinical-workflow.js for deterministic protocol validation/classification/summary. Keep original app state/rendering; new clinical writes must check session and final lock. Running legacy cases without alert configuration retain legacy thresholds, not recently changed hospital settings.

Baseline defects identified: sticky Record listener bound during every render; missing history values converted to zero; hospital settings can overwrite a running case's concentration controls; popup-off stops alert tracking. Address and test explicitly.

Recovery note: scratch was reset during a continuation before persistent save. Reconstructed these edits from the task history using the same baseline, and reran tests. See current TEST_RESULTS.txt for actual verified results.
