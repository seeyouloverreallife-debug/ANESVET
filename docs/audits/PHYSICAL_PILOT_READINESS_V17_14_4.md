# Physical Pilot Readiness Audit — V17.14.4

## Problem
Software simulation V17.14.2–V17.14.3 ตรวจ state/controller/data integrity ได้ แต่ไม่สามารถอธิบายปัญหาที่เกิดเฉพาะเครื่องจริง เช่น soft keyboard ทำ viewport หด, BFCache resume, main-thread stall หรือ memory pressure ได้

## Design
Production Pilot เป็น owner ของ technical evidence และต้องไม่เป็น clinical writer

### Captured technical evidence
- window + VisualViewport dimensions/offset
- estimated keyboard inset
- orientation
- focus transition: tag/input type only
- long task duration
- event-loop scheduling delay
- BFCache/resume count
- optional JS heap usage where supported

### Explicitly not captured
- input values
- patient/case identifiers or state payload
- vital measurements
- medication names/doses
- clinical notes

## Overhead control
Continuous telemetry is opt-in. Event hooks return immediately when telemetry is disabled. Manual snapshot and readiness probe remain explicit user-triggered operations.

## Storage
Telemetry uses a dedicated localStorage namespace and bounded event history (240 entries). Production Pilot reset removes telemetry and enable state.

## Export
`ANESVET_PRODUCTION_PILOT_V2` includes a build-scoped telemetry snapshot together with existing readiness/lifecycle/acceptance evidence.
