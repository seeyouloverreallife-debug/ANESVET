/* ANESVET V16.18.0 — Dose Reference Controller
   Presentation/controller boundary for loaded dose-reference content only.
   It never calculates, recommends, orders, or records medication administration. */
(function(root){
'use strict';
function create({doseReference=null,getSpecies=()=>''}={}){
  const shell=root.ANESVET_APP_SHELL;if(!shell)throw new Error('ANESVET app-shell.js failed to load');
  const {$,$$,escapeHtml}=shell;
  function currentSpecies(){return String(getSpecies?.()||'')}
  function brief(drug,species=currentSpecies()){return doseReference?.brief?.(drug,species)||''}
  function buttonHtml(drug,species=currentSpecies(),prefix='Dose ref'){
    const b=brief(drug,species);if(!b)return '';
    const id=typeof drug==='object'?(drug.name||drug.id||''):drug;
    return `<button type="button" class="dose-reference-chip" data-dose-reference="${escapeHtml(id)}"><span>${escapeHtml(prefix)}</span><b>${escapeHtml(b)}</b></button>`;
  }
  function renderInline(targetId,drug){
    const el=$(targetId);if(!el)return;const b=brief(drug);if(!b){el.hidden=true;el.innerHTML='';return}
    const id=typeof drug==='object'?(drug.name||drug.id||''):drug;
    el.hidden=false;el.innerHTML=`<button type="button" class="dose-reference-inline-btn" data-dose-reference="${escapeHtml(id)}"><span>Typical reference</span><b>${escapeHtml(b)}</b><small>Details / source</small></button>`;
  }
  function speciesLabel(list){return (list||[]).map(x=>x==='dog'?'DOG':x==='cat'?'CAT':String(x).toUpperCase()).join(' / ')}
  function openDialog(drug){
    const species=currentSpecies(),ref=doseReference?.get?.(drug,species)||doseReference?.get?.(drug,'');
    const dlg=$('doseReferenceDialog');if(!dlg)return;
    $('doseReferenceTitle').textContent=typeof drug==='object'?(drug.name||'Medication reference'):String(drug||'Medication reference');
    $('doseReferenceSpecies').textContent=species?`Patient species: ${species==='dog'?'DOG':species==='cat'?'CAT':species.toUpperCase()}`:'Patient species not selected — showing available dog/cat references';
    if(!ref||!ref.entries?.length){$('doseReferenceEntries').innerHTML='<div class="dose-reference-empty">No loaded reference for this medication. Use the hospital protocol / verified source.</div>';$('doseReferenceSources').textContent=''}
    else{
      $('doseReferenceEntries').innerHTML=ref.entries.map(e=>`<article class="dose-reference-entry"><div><span>${escapeHtml(speciesLabel(e.species))}</span><b>${escapeHtml(e.context||'Reference dose')}</b></div><strong>${escapeHtml(e.dose)}</strong><em>${escapeHtml(e.route||'')}</em>${e.extra?`<small>${escapeHtml(e.extra)}</small>`:''}<footer>${escapeHtml(doseReference.sourceShort?.(e.source)||e.source||'')}</footer></article>`).join('');
      const src=[...new Set(ref.entries.map(e=>e.source).filter(Boolean))];$('doseReferenceSources').innerHTML=src.map(x=>`<div><b>${escapeHtml(doseReference.sourceShort?.(x)||x)}</b> — ${escapeHtml(doseReference.sourceLabel?.(x)||x)}</div>`).join('')+(ref.note?`<div class="dose-reference-note">${escapeHtml(ref.note)}</div>`:'');
    }
    $('doseReferenceDisclaimer').textContent=doseReference?.disclaimer||'Clinical reference only — verify hospital protocol.';
    try{if(!dlg.open)dlg.showModal()}catch(_){dlg.setAttribute('open','')}
  }
  function renderChips(){
    if(!doseReference)return;
    $$('.drug-card').forEach(card=>{
      const head=card.querySelector('.drug-card-head'),title=head?.querySelector('h3')?.textContent?.trim();if(!head||!title)return;
      const existing=card.querySelector(':scope > .dose-reference-chip'),b=brief(title);
      if(!b){existing?.remove();return}
      if(existing){existing.dataset.doseReference=title;const strong=existing.querySelector('b');if(strong)strong.textContent=b;return}
      head.insertAdjacentHTML('afterend',buttonHtml(title));
    });
  }
  function bind(){document.addEventListener('click',e=>{const btn=e.target.closest?.('[data-dose-reference]');if(!btn)return;e.preventDefault();openDialog(btn.dataset.doseReference)})}
  return Object.freeze({currentSpecies,brief,buttonHtml,renderInline,speciesLabel,openDialog,renderChips,bind});
}
root.ANESVET_DOSE_REFERENCE_CONTROLLER=Object.freeze({create});
if(typeof module!=='undefined'&&module.exports)module.exports={create};
})(typeof globalThis!=='undefined'?globalThis:this);
