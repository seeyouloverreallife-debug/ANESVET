# ANESVET V17.10.11 — Mobile Modal & Toast Hotfix
- Replaced native `dialog.showModal()` for Airway/Intubation with a deterministic app-owned bottom sheet.
- Opening Intubation can no longer leave an invisible native modal blocking the OR screen.
- Explicit Close, Later, and backdrop-close paths restore interaction immediately.
- Airway/anesthesia controls from V17.10.10 remain, including vaporizer dial and O2 flowmeter.
- Mobile toast geometry is now explicitly bounded: content-height, max 96–120px, bottom auto, pointer-events none.
- Existing safety/workflow actions remain unchanged.
