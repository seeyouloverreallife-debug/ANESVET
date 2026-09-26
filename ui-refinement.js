/* ANESVET V15.24.0 — UI behavior refinement only. No clinical logic. */
(() => {
  'use strict';
  const workflow = document.querySelector('.workflow-tabs');
  if (!workflow) return;

  const alignActiveStepHorizontally = (active, behavior='smooth') => {
    if (!active || workflow.scrollWidth <= workflow.clientWidth + 1) return;
    const maxLeft = Math.max(0, workflow.scrollWidth - workflow.clientWidth);
    const targetLeft = Math.max(0, Math.min(maxLeft, active.offsetLeft - (workflow.clientWidth - active.offsetWidth) / 2));
    try { workflow.scrollTo({left:targetLeft, behavior}); }
    catch (_) { workflow.scrollLeft = targetLeft; }
  };

  const syncActiveStep = ({behavior='smooth'}={}) => {
    const active = workflow.querySelector('.tab.active');
    workflow.querySelectorAll('.tab').forEach(btn => {
      if (btn === active) btn.setAttribute('aria-current', 'step');
      else btn.removeAttribute('aria-current');
    });

    if (!active) return;
    const mobileLike = window.matchMedia('(max-width:1180px), (pointer:coarse)').matches;
    const inFocusedClinicalMode = document.body.classList.contains('or-mobile-active') || document.body.classList.contains('recovery-mobile-active');
    if (mobileLike && !inFocusedClinicalMode) {
      requestAnimationFrame(() => alignActiveStepHorizontally(active, behavior));
    }
  };

  const observer = new MutationObserver(mutations => {
    if (mutations.some(m => m.type === 'attributes' && m.attributeName === 'class')) syncActiveStep({behavior:'auto'});
  });
  workflow.querySelectorAll('.tab').forEach(btn => observer.observe(btn, {attributes:true, attributeFilter:['class']}));

  workflow.addEventListener('click', e => {
    if (e.target.closest('.tab')) setTimeout(()=>syncActiveStep({behavior:'smooth'}), 0);
  });
  window.addEventListener('resize', ()=>syncActiveStep({behavior:'auto'}), {passive:true});
  document.documentElement.classList.add('ui-refined-v15231');
  syncActiveStep({behavior:'auto'});
})();
