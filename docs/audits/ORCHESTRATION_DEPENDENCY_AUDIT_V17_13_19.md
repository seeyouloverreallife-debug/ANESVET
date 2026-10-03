# Orchestration Dependency Audit — V17.13.19

## Scope
Startup positions 24–26:
1. `patient-master-orchestration.js`
2. `or-record-orchestration.js`
3. `recovery-orchestration.js`

## Findings
All three modules are pure orchestration helpers exposed through stable `window.ANESVET_*` globals. None contains relative `fetch()`, dynamic `import()`, `new URL()`, `currentScript`, `import.meta`, `__dirname`, or `__filename` path dependencies.

### Patient Master orchestration
Owns pure patient record operations such as active-patient resolution, duplicate merge target search, retire/restore and merge transformations. It does not own persistence or presentation.

### OR Record orchestration
Owns pure vital-record append/delete/correction transformations, including duplicate rejection and correction audit entries. It does not own DOM presentation or persistence.

### Recovery orchestration
Owns pure Recovery append/phase patch helpers. It does not own Recovery UI or navigation.

## Migration decision
The three modules form one contiguous startup boundary and can be moved together to `runtime/orchestration/` while preserving positions 24–26.

## Source preservation
All three V17.13.19 files are byte-identical to their V17.13.18 sources. Only package paths changed.

## Regression protection
`QA_V17_13_19_ORCHESTRATION_DEPENDENCY_AUDIT.js` verifies canonical paths, exact source hashes and deterministic patient/OR/recovery behavior.
