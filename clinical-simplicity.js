/* ANESVET V17.2.26 R22 — Clinical Simplicity hotfix.
 * UI sequencing/navigation only. Do not change clinical records, formulas,
 * phase transitions, alert rules, safety gates, storage or dose logic.
 * Moving existing DOM nodes preserves element IDs and attached listeners.
 */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);

  function orderOrWorkspace() {
    const page = $('orlive');
    const primary = page?.querySelector('.or-primary-flow');
    const focus = $('orVitalsFocus');
    if (!page || !primary || !focus || page.dataset.uxR22Or === '1') return;
    // The clinical next-step action must be first; vitals must appear before
    // reference/context panels instead of being buried far down on phones.
    page.insertBefore(primary, focus);
    let after = focus;
    const sequence = [
      page.querySelector('.or-vital-grid'),
      page.querySelector('.or-status-row'),
      $('orMedicationQueue'),
      page.querySelector('.or-secondary-grid'),
      $('orDocumentationGuardian'),
      $('orCaseContextPanel'),
      page.querySelector('.or-phase-tracker-panel')
    ];
    for (const el of sequence) {
      if (el && el.parentElement === page && after !== el) {
        after.insertAdjacentElement('afterend', el);
        after = el;
      }
    }
    page.dataset.uxR22Or = '1';
  }

  function labelNavigation() {
    const labels = [
      ['.workflow-tabs .tab[data-tab="drugs"] span:last-child', 'ยา / Drug Plan'],
      ['.workflow-tabs .tab[data-tab="orlive"] span:last-child', 'OR LIVE'],
      ['[data-mobile-tab="drugs"] b', 'ยา / Drug Plan'],
      ['[data-mobile-tab="orlive"] b', 'OR LIVE'],
      ['#orMobileMoreBtn b', 'เมนู'],
      ['#recoveryMobileMoreBtn b', 'เมนู'],
      ['#orMobileRecordBtn b', 'Vital signs'],
      ['#orMobileMedsBtn b', 'ยา'],
      ['#recoveryMobileMedicationBtn b', 'ยา']
    ];
    labels.forEach(([selector,label]) => {const el=document.querySelector(selector); if(el) el.textContent=label;});
  }

  function addReturnToCase() {
    if ($('uxR22ReturnCase')) return;
    const actions = document.querySelector('.topbar .top-actions');
    if (!actions) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'uxR22ReturnCase';
    button.className = 'btn light session-safe ux-r22-case-return';
    button.textContent = '← สรุปเคส';
    button.setAttribute('aria-label','กลับหน้าสรุปเคสโดยไม่ปิดเคส');
    button.title = 'กลับหน้าสรุปเคส • ไม่ได้จบเคส';
    button.addEventListener('click', () => {
      const target = $('orlive')?.classList.contains('active')
        ? $('orMobileCaseSummaryBtn')
        : $('recovery')?.classList.contains('active')
        ? $('recoveryMoreCaseSummaryBtn') : null;
      // Reuse the original controller navigation. This respects session
      // protections and the normal workflow; no forced page transition.
      target?.click();
    });
    actions.insertBefore(button, actions.firstChild);
  }

  function boot() {
    orderOrWorkspace();
    labelNavigation();
    addReturnToCase();
    document.documentElement.classList.add('ux-r22-clinical-simplicity');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
