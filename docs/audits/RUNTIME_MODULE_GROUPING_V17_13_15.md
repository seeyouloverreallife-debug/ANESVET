# Runtime Module Grouping IV — V17.13.15

## Scope
Move the low-risk `app-foundation` core utility subgroup to `runtime/core/` while preserving exact startup order.

## Moved files
- `app-shell.js` → `runtime/core/app-shell.js`
- `case-lifecycle.js` → `runtime/core/case-lifecycle.js`
- `support.js` → `runtime/core/support.js`
- `reliability.js` → `runtime/core/reliability.js`

These remain startup positions 9–12.

## Preserved
- startup count: 69
- lazy count: 7
- platform positions 1–5 unchanged
- clinical positions 6–8 unchanged
- app-foundation positions 13–18 remain at root
- exact startup order unchanged
- Service Worker precaches all startup/lazy modules at current paths
- moved sources are byte-identical to V17.13.14
