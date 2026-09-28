# ANESVET V16.1 — Clinical Calm Design System

## Goal
Make ANESVET feel like a modern clinical instrument: calm in the normal state, immediately legible when something needs attention, and fast on mobile during anesthesia.

## Core principles
1. **Clinical data first** — vital numbers and case state have higher visual priority than containers.
2. **Color has meaning** — teal = active/primary, amber = warning, red = critical; normal screens stay mostly neutral.
3. **One primary action** — secondary actions remain visible but quieter.
4. **Less chrome** — fewer gradients, shadows and heavy outlines.
5. **Consistent touch targets** — mobile dock and clinical actions remain easy to hit.
6. **No hidden clinical behavior** — V16.1 changes presentation, not decision logic.

## Tokens
- Background: `#f5f7f7`
- Surface: `#ffffff`
- Ink: `#172326`
- Primary: `#135c67`
- Warning: `#9a6413`
- Critical: `#b33b37`
- Radius: 8 / 10 / 14 / 18 / 22 px
- Focus ring: translucent teal, 3 px

## OR LIVE
- Dark solid command surface instead of gradient-heavy chrome.
- Vital tiles use large numerals, neutral surface and thin status accent.
- Primary workflow and Record Vitals remain the strongest actions.
- Routine status surfaces are visually quiet; abnormal state carries color.

## Recovery
- White recovery workspace with lighter timing/readiness treatment.
- Latest observations read as one strip instead of multiple heavy cards.
- Primary record action remains dominant.
- Existing handoff/checklist/score data remain available without changing completion rules.

## Responsive behavior
- 390 px mobile: two-column vital grid; floating bottom dock inside safe area.
- Tablet: three-column OR vital grid when space allows.
- Desktop: wide clinical workspace with reduced border/shadow noise.

## Accessibility
- Visible focus state for keyboard navigation.
- Reduced-motion preference respected.
- Warning and critical states are not communicated by color alone; labels/content remain intact.
