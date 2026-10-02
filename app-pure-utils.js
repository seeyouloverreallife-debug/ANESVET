/* ANESVET V17.10.10 — side-effect-free application helpers.
   Keep this module free of patient/case state, storage, DOM writes, timers and clinical decisions. */
(function(root){
  'use strict';
  const api=Object.freeze({
    fmt1(n){
      return Number.isFinite(Number(n)) ? Number(n).toFixed(Number(n)>=10?0:1) : '—';
    },
    normalizeDrugLibrary(list){
      return (Array.isArray(list)?list:[]).map(d=>({...d,concUnit:d.concUnit||(d.mode==='mcgkg'?'μg/mL':'mg/mL')}));
    },
    formulaLabel(mode,concUnit=''){
      return ({mgkg:`mg/kg ÷ ${concUnit||'concentration'}`,mcgkg:`μg/kg ÷ ${concUnit||'concentration'}`,mlkg:'mL/kg × BW',bwdiv:'BW ÷ factor',manual:'Manual'})[mode]||mode;
    },
    drugPhaseLabel(phase){
      return ({induction:'Induction',pre:'Pre-anesthetic',post:'Post-anesthetic',emergency:'Emergency / standby'})[phase]||phase;
    },
    normalizedHandoffDrugName(name){
      return String(name||'').toLowerCase().replace(/\([^)]*\)/g,' ').replace(/[—–-]+/g,' ').replace(/\s+/g,' ').trim();
    }
  });
  root.ANESVET_APP_UTILS=api;
})(window);
