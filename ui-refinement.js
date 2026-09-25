/* ANESVET V15.20.0 — UI behavior refinement only. No clinical logic. */
(() => {
  'use strict';
  const workflow = document.querySelector('.workflow-tabs');
  if (!workflow) return;

  const syncActiveStep = () => {
    const active = workflow.querySelector('.tab.active');
    workflow.querySelectorAll('.tab').forEach(btn => {
      if (btn === active) btn.setAttribute('aria-current', 'step');
      else btn.removeAttribute('aria-current');
    });

    if (!active) return;
    const mobileLike = window.matchMedia('(max-width:1180px), (pointer:coarse)').matches;
    const inFocusedClinicalMode = document.body.classList.contains('or-mobile-active') || document.body.classList.contains('recovery-mobile-active');
    if (mobileLike && !inFocusedClinicalMode) {
      requestAnimationFrame(() => {
        try { active.scrollIntoView({block:'nearest', inline:'center', behavior:'smooth'}); }
        catch (_) { active.scrollIntoView(false); }
      });
    }
  };

  const observer = new MutationObserver(mutations => {
    if (mutations.some(m => m.type === 'attributes' && m.attributeName === 'class')) syncActiveStep();
  });
  workflow.querySelectorAll('.tab').forEach(btn => observer.observe(btn, {attributes:true, attributeFilter:['class']}));

  workflow.addEventListener('click', e => {
    if (e.target.closest('.tab')) setTimeout(syncActiveStep, 0);
  });
  window.addEventListener('resize', syncActiveStep, {passive:true});
  document.documentElement.classList.add('ui-refined-v1515');
  syncActiveStep();
})();
