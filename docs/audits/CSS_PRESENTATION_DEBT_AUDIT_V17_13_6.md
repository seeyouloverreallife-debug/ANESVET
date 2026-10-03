# CSS Presentation Debt Audit — ANESVET V17.13.6

## Audit method
1. Start from V17.13.5 production bundle and source CSS without rebuilding the bundle from standalone files.
2. Scan `index.html` startup runtime (69 scripts).
3. Include JavaScript referenced by Service Worker precache and lazy-loaded Knowledge modules.
4. Treat literal selector absence as insufficient when classes can be generated dynamically.
5. Do not classify `:not(.legacy-state)` selectors as dead solely because the state class is no longer emitted.
6. Remove only rules with a proven dead positive dependency and mirror the removal in the corresponding source CSS.
7. Re-run V17.13.5 regression before release version bump, then V17.13.6 release suites after bump.

## Safe-pruned groups
### style.css
Removed dead presentation groups including:
- `record-count`
- `or-action-groups`
- dose spotlight grid/title presentation
- archive recovery count
- report integrity value
- OR More profile/settings remnants
- pilot feedback status grid / sending state
- retired settings-wide presentation

### ui-refinement.css
- obsolete `.recovery-workspace,.recovery-panel` radius override

### progressive-disclosure.css
- `.pd-section-tag`

### progressive-clinical-flow.css
Removed positive dependencies on retired classes:
- `.ux-patient-form-toolbar`
- `.ux-patient-details-toggle`
- `.ux-patient-optional` rule tied to retired patient-details state

### clinical-simplicity.css
- retired `.ux-r22-case-return` rules only

### or-knowledge.css
Removed obsolete internal renderer rules:
- `.or-knowledge-item`
- `.or-knowledge-item-head`
- `.or-knowledge-priority`
- `.or-knowledge-body`
- `.or-knowledge-section`
- `.or-knowledge-source`
- `.or-knowledge-actions`
- `.or-knowledge-item.context-focus`

Current OR Knowledge shell/delegation presentation remains.

## Bundle result
- Before: 403,018 bytes
- After: 396,844 bytes
- Reduction: 6,174 bytes (~1.53%)
- Source markers: 38/38 retained

## Dynamic/lazy traps explicitly protected
### Lazy Knowledge
`knowledge-loader.js` loads seven Knowledge assets after startup. Therefore `.ck-*` rules are active even though the corresponding renderer is not in the initial 69-script startup list.

### Dynamic protocol class
`app.js` emits `review-${sev}`, therefore:
- `.protocol-review-row.review-warn`
- `.protocol-review-row.review-note`
- `.protocol-review-row.review-good`
remain live and must not be removed from literal-name grep alone.

## Deferred orphan-negative selectors
Not removed in V17.13.6:
- `body.or-mobile-active:not(.ux-or-context-compact) #orStickyMini`
- `#patient:not(.ux-patient-details-open) .patient-form-grid`

Reason: if the inner legacy class is no longer emitted, a `:not(...)` selector can become more broadly active rather than dead. Physical visual validation is required before changing these rules.

## Offline bug discovered during audit
V17.13.5 lazy Knowledge loader used `?v=17.6.1` while Service Worker precached the same files as `?v=17.13.5`. Because versioned JS/CSS offline fallback matches the exact request, this could cause a cache miss when opening Knowledge offline after a fresh startup.

V17.13.6 aligns loader + precache to `?v=17.13.6`.
