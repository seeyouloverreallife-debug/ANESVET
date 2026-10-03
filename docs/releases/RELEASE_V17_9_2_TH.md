# ANESVET V17.9.2 — Rendering Consolidation I

## Single presentation owner
Added `repeat-presentation-owner.js` as the single renderer for overlapping Recovery → End Case / repeat-use presentation state.

It now owns:
- active-case resume button text/visibility
- Recovery exit-card completed state and text
- End Case locked/unlocked/ready presentation
- End Case quick identity
- Next Case visibility after Final Lock
- R24/R25/R26 presentation classes

## Legacy modules retained only for distinct behavior
- `repeat-use-ux.js`: creates resume actions, final-review progressive disclosure and summary extras.
- `repeat-use-r26.js`: creates Next Case action and Recovery Enter-key focus progression.
- `recovery-endcase-ux.js`: compatibility action bridge for Recovery → End Case and guided Final Review click.

Their overlapping MutationObserver/click/change/pageshow/final-archive repaint ownership was removed.

## Clinical behavior
No case state mutation, Recovery completion, Final Lock, archive verification, medication, OR LIVE, vital recording or clinical safety gate was moved into the presentation owner.
