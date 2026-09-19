# V14.7 change record

Status: implementation delivered; supported automated tests passed; real browser E2E gate pending due environment block.

## Architecture and compatibility

Inspected the supplied V14.6.4 before editing. Retained the async IIFE, central state, DOM IDs, OR_SYNC mapping, original event/drug writer, patient master, archive/backup flows, service-worker waiting lifecycle, storage keys and IndexedDB schema. Added a small production helper module for deterministic protocol and handoff logic. No framework or server dependency added to runtime.

Case data additions are optional: alertProtocolOverride, alertProtocolHistory, recoveryHandoffs; protocolSnapshot.alertProtocol; record.alertProtocol; administration.calculationBasis; richer existing alertEpisodes. Old episode key names remain compatible. Snapshot thresholds have precedence over later hospital settings; explicit case overrides have precedence over snapshot thresholds.

## Features

Hospital alert configuration and case override both require actor/reason and preserve structured before/after audit. Protocol lock governs hospital defaults. OR Quick Drug reuses the original calculator and administration writer, uses confirmed Current BW and frozen doses/concentrations, starts with a blank actual dose, requires preparation/route/actor and explicit confirmation, preserves duplicate warning and VOID audit, and keeps OR LIVE open.

Active problem panels combine the existing complication collection and warning/critical alert episodes. Interventions and resolutions are auditable. Handoff records identify the patient/team, procedure/risks, airway, recorded vital extrema, latest OR/recovery records, actual non-VOID medications, documented fluids, unresolved problems, recovery observations/plan, and protocol provenance. Transfer snapshots remain unchanged when later observations arrive. Summary is also included in the report.

Legacy Monitoring moved into More → Advanced with its original route and inputs retained. Runtime version/manifest/cache/backup updated to 14.7.

## Clinical behavior disclosure

No built-in clinical dose, concentration default, HR/RR range, fluid reference, plausibility limit or recovery scoring value was changed. The four alert defaults match baseline exactly; the complete table is in README_TH.md. No upper temperature threshold is enabled by default.

New configurable bounds apply to display, alerts, record snapshots and guide trigger text. Custom upper MAP/SpO₂/Temperature alerts use neutral reassessment text rather than low-value treatment instructions. This changes guidance selection for newly configurable upper alerts, not the original dose or default threshold.

Episode tracking now operates independently of popup preference and includes warning + critical for all four parameters. Auto resolution requires a measured value within configured normal bounds. Missing/N/A never resolves an episode. Manual resolution retains reasons and is rechecked on a new observation. Protocol edits close prior episodes explicitly as protocol-change. Unresolved alerts now block final lock. These lifecycle changes are intentional and covered by tests.

## Bugs fixed

- Sticky OR Record button accumulated listeners during repeated render, producing multiple records per click.
- Blank/null historical readings were treated as zero when computing previous-case minima.
- Hospital settings save overwrote concentration controls for a running case.
- Turning off popup also prevented critical alert tracking.
- A warning acknowledged earlier could escalate without requesting acknowledgment again.
- Quick Drug could be submitted against a stale BW; it now recalculates and clears actual input.
- New workflows enforce final-lock and view-only guards; Extubation cannot bypass invalid case setup.
- Recovery reload restores the correct tab; explicit, extubation and Emergency-return paths capture handoffs.
- Ordinary autosave does not resample locked clinical payloads. The final-lock transaction persists the sealed payload before reset; tests verify current/archive checksums.
- Backup verification now checks a locked current case as well as archived cases.
- Configured guide text reports the actual thresholds and avoids warming advice for an upper Temperature alert.

## Test scope and limits

See tests/TEST_RESULTS.txt for the final run. Compatibility fixtures are synthetic V14.6.4-shaped cases; no real patient data supplied or modified. Full DOM integration evaluates the complete production app and exercises its real listeners and functions, while replacing browser-only primitives. Model scenarios are retained as independent baseline checks.

Real Chromium E2E was attempted earlier in the task but could not launch/install. The available managed browser denied access to both the local HTTP application and local-file route. No bypass was attempted. The supplied real-browser runner has syntax validation only and must be run on an authorized host with Chromium. No browser screenshots, native rendering, print pagination or PWA upgrade pass is claimed.
