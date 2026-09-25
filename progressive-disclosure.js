/* ANESVET V15.19.0 — Progressive Disclosure & Collapsible Sections
   UI-only. Does not alter clinical calculations, safety gates, storage schema,
   medication logic, phase transitions, or report contents. */
(() => {
  'use strict';

  const STORE_KEY = 'anesvet_pd_state_v1';
  const state = readState();
  const enhanced = new Map();

  const configs = [
    // Settings: compact by default. Safety functionality remains unchanged;
    // users open only the section they want to edit.
    { selector:'#settings > section.panel', group:'settings', defaultOpen:false },

    // Patient / pre-op: clinical core stays visible by default, but experienced
    // users can collapse completed/reference sections to reduce scrolling.
    { selector:'#patient > section.patient-master-panel', group:'patient', defaultOpen:true },
    { selector:'#patient > section.panel:not(.patient-master-panel):not(.patient-entry-panel)', group:'patient', defaultOpen:true },
    { selector:'#preop .preop-exam-panel', group:'preop', defaultOpen:true },
    { selector:'#preop .preop-risk-panel', group:'preop', defaultOpen:true },

    // Drug Plan: current plan/induction stay visible; long reference material is
    // compact until requested.
    { selector:'#drugs > section.drug-calculator-intro', group:'drugs', defaultOpen:false },
    { selector:'#drugs > section.phase-drug-panel', group:'drugs', defaultOpen:false },
    { selector:'#drugs > section.emergency-panel', group:'drugs', defaultOpen:false },

    // Recovery: safety/problem panels remain visible; long handoff/history
    // sections start compact and auto-open when focused.
    { selector:'#recovery > section.handoff-panel', group:'recovery', defaultOpen:false },
    { selector:'#recovery > section.recovery-score-panel', group:'recovery', defaultOpen:true },
    { selector:'#recovery > section.recovery-record-panel', group:'recovery', defaultOpen:false }
  ];

  function readState(){
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}') || {}; }
    catch (_) { return {}; }
  }
  function saveState(){
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
    catch (_) {}
  }
  function slug(text){
    return String(text || 'section').trim().toLowerCase()
      .replace(/[^a-z0-9\u0E00-\u0E7F]+/g,'-').replace(/^-+|-+$/g,'').slice(0,70) || 'section';
  }
  function directHeading(panel){
    return Array.from(panel.children).find(el => el.classList && el.classList.contains('section-heading')) || null;
  }
  function panelTitle(panel){
    const h = panel.querySelector(':scope > .section-heading h2, :scope > .section-heading h3, :scope > h2, :scope > h3');
    return h ? h.textContent.trim() : 'Section';
  }
  function panelDescription(panel){
    const p = panel.querySelector(':scope > .section-heading p');
    if (p && p.textContent.trim()) return p.textContent.trim();
    const title = panelTitle(panel).toLowerCase();
    if (title.includes('alert protocol')) return 'เกณฑ์แจ้งเตือนของโรงพยาบาลและประวัติการแก้ไข';
    if (title.includes('asa')) return 'เลือก ASA Physical Status และเก็บ rationale ของเคส';
    if (title.includes('emergency drugs')) return 'Reference ยาฉุกเฉินสำหรับเตรียมพร้อมก่อนใช้งานจริง';
    if (title.includes('recovery handoff')) return 'สรุปข้อมูลส่งต่อหลังวางยาสลบ';
    if (title.includes('recovery vital')) return 'ประวัติ vital signs ในช่วง recovery';
    return 'แตะเพื่อเปิดรายละเอียดเมื่อจำเป็น';
  }
  function makeKey(panel, group, index){
    return `${group}:${slug(panelTitle(panel))}:${index}`;
  }
  function setOpen(panel, open, persist=true){
    const meta = enhanced.get(panel);
    if (!meta) return;
    const next = !!open;
    panel.classList.toggle('pd-open', next);
    panel.classList.toggle('pd-collapsed', !next);
    meta.toggle.setAttribute('aria-expanded', String(next));
    meta.toggle.setAttribute('aria-label', `${next ? 'พับ' : 'เปิด'} ${meta.title}`);
    const label = meta.toggle.querySelector('.pd-toggle-label');
    if (label) label.textContent = next ? 'พับ' : 'เปิด';
    if (persist){ state[meta.key] = next; saveState(); }
  }
  function enhancePanel(panel, cfg, index){
    if (!panel || panel.classList.contains('pd-enhanced')) return;
    const heading = directHeading(panel);
    if (!heading) return;
    const title = panelTitle(panel);
    const key = makeKey(panel, cfg.group, index);
    const summary = document.createElement('div');
    summary.className = 'pd-summary';
    summary.textContent = panelDescription(panel);

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'pd-toggle session-safe';
    toggle.innerHTML = '<span class="pd-toggle-label">เปิด</span><span class="pd-toggle-icon" aria-hidden="true">⌄</span>';
    heading.appendChild(toggle);
    heading.insertAdjacentElement('afterend', summary);

    panel.classList.add('pd-panel','pd-enhanced');
    panel.dataset.pdKey = key;
    enhanced.set(panel,{key,title,toggle,group:cfg.group});

    const initial = Object.prototype.hasOwnProperty.call(state,key) ? !!state[key] : !!cfg.defaultOpen;
    setOpen(panel, initial, false);

    toggle.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      setOpen(panel, panel.classList.contains('pd-collapsed'));
    });
    heading.addEventListener('click', e => {
      if (e.target.closest('button,input,select,textarea,a,label,summary')) return;
      setOpen(panel, panel.classList.contains('pd-collapsed'));
    });
  }

  function setupPanels(){
    configs.forEach(cfg => {
      document.querySelectorAll(cfg.selector).forEach((panel,index) => enhancePanel(panel,cfg,index));
    });
  }

  function setupSettingsToolbar(){
    const settings = document.getElementById('settings');
    if (!settings || settings.querySelector('.pd-settings-toolbar')) return;
    const panels = () => Array.from(settings.querySelectorAll(':scope > section.panel.pd-enhanced'));
    const bar = document.createElement('div');
    bar.className = 'pd-settings-toolbar';
    bar.innerHTML = `
      <div class="pd-settings-toolbar-copy">
        <b>Settings แบบย่อ</b>
        <small>ทุกหมวดพับไว้ก่อน • เปิดเฉพาะหัวข้อที่ต้องการแก้ เพื่อลดการเลื่อนบนมือถือ</small>
      </div>
      <div class="pd-settings-tools">
        <input id="pdSettingsSearch" class="pd-settings-search" type="search" placeholder="ค้นหา เช่น logo, Drug Library, alert" autocomplete="off">
        <button id="pdSettingsCollapseAll" class="btn" type="button">พับทั้งหมด</button>
        <button id="pdSettingsExpandAll" class="btn" type="button">เปิดทั้งหมด</button>
        <span id="pdSettingsCount" class="pd-settings-count"></span>
      </div>`;
    settings.insertBefore(bar, settings.firstChild);

    const search = bar.querySelector('#pdSettingsSearch');
    const count = bar.querySelector('#pdSettingsCount');
    const updateCount = () => {
      const visible = panels().filter(p => !p.hidden).length;
      count.textContent = `${visible}/${panels().length} หมวด`;
    };
    bar.querySelector('#pdSettingsCollapseAll').addEventListener('click', () => panels().filter(p=>!p.hidden).forEach(p=>setOpen(p,false)));
    bar.querySelector('#pdSettingsExpandAll').addEventListener('click', () => panels().filter(p=>!p.hidden).forEach(p=>setOpen(p,true)));
    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      panels().forEach(panel => {
        const hay = `${panelTitle(panel)} ${panel.textContent}`.toLowerCase();
        const match = !q || hay.includes(q);
        panel.hidden = !match;
        if (q && match) setOpen(panel,true,false);
        panel.dataset.pdHighlight = q && match ? 'true' : 'false';
      });
      updateCount();
    });
    updateCount();
  }

  function revealAncestor(target, persist=false){
    if (!target || !target.closest) return;
    // Focusing the disclosure header/toggle itself must not auto-open before
    // the click handler runs, otherwise a single tap would open then close.
    if (target.closest('.section-heading')) return;
    const panel = target.closest('.pd-panel.pd-collapsed');
    if (panel) setOpen(panel,true,persist);
  }

  function setupAutoReveal(){
    document.addEventListener('focusin', e => revealAncestor(e.target,false), true);
    document.addEventListener('invalid', e => revealAncestor(e.target,false), true);
    window.addEventListener('hashchange', () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (id) revealAncestor(document.getElementById(id),false);
    });
  }

  function exposeApi(){
    window.ANESVETProgressiveDisclosure = {
      openForElement(el){ revealAncestor(el,true); },
      collapseSettings(){ document.querySelectorAll('#settings > .pd-panel').forEach(p=>setOpen(p,false)); },
      expandSettings(){ document.querySelectorAll('#settings > .pd-panel').forEach(p=>setOpen(p,true)); }
    };
  }

  function boot(){
    setupPanels();
    setupSettingsToolbar();
    setupAutoReveal();
    exposeApi();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
