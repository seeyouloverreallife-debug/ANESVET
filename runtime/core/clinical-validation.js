(() => {
  'use strict';

  const num = v => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  function medicationReferenceSafety(drug, overrides = {}) {
    const d = drug || {};
    const mode = String(overrides.mode ?? d.mode ?? '').toLowerCase();
    const dose = num(overrides.dose ?? d.dose);
    const conc = num(overrides.conc ?? d.conc);
    const concUnit = String(overrides.concUnit ?? d.concUnit ?? '').trim();

    if (!drug) return { actionable:false, code:'missing-drug', label:'Drug not selected', reason:'Select a medication first.' };
    if (mode === 'manual') return { actionable:false, code:'manual', label:'Manual preparation', reason:'No automatic volume is generated for manual medications.' };
    if (!['mgkg','mcgkg','mlkg','bwdiv'].includes(mode)) return { actionable:false, code:'unknown-mode', label:'Formula not supported', reason:'This formula is not eligible for automatic volume fill.' };
    if (!(dose > 0)) return { actionable:false, code:'dose-missing', label:'Dose/factor required', reason:'Set a valid dose or factor before calculating a volume.' };

    // V15.21 safety rule: every drug volume shown as actionable must be tied to
    // a configured preparation/concentration. This prevents legacy BW÷factor
    // references from looking like ready-to-inject volumes.
    if (!(conc > 0) || !concUnit) {
      return {
        actionable:false,
        code:'preparation-missing',
        label:'Preparation required',
        reason: mode === 'bwdiv'
          ? 'Legacy BW ÷ factor reference is not auto-filled until a preparation/concentration is configured.'
          : 'Configure the preparation/concentration before using an automatic mL value.'
      };
    }

    return {
      actionable:true,
      code:'ready',
      label:'Calculation ready',
      reason:`Preparation configured: ${conc} ${concUnit}`
    };
  }

  function safeCalculation(drug, result, overrides = {}) {
    const safety = medicationReferenceSafety(drug, overrides);
    const rawMl = num(result?.ml);
    return {
      ...(result || {}),
      rawMl,
      actionableMl: safety.actionable && rawMl !== null && rawMl > 0 ? rawMl : null,
      safety
    };
  }

  function runMedicationMatrix(calculate) {
    const checks = [];
    const add = (label, ok, detail) => checks.push({label, ok:!!ok, detail});
    const close = (a,b,tol=1e-9) => Number.isFinite(a) && Math.abs(a-b) <= tol;
    try {
      let r = calculate({mode:'mgkg',concUnit:'mg/mL'},10,4,10);
      add('mg/kg ÷ mg/mL arithmetic', close(r.ml,4), `10 kg × 4 mg/kg ÷ 10 mg/mL = ${r.ml} mL`);
      r = calculate({mode:'mgkg',concUnit:'μg/mL'},10,4,10000);
      add('mg/kg ÷ μg/mL unit conversion', close(r.ml,4), `40 mg ÷ 10,000 μg/mL = ${r.ml} mL`);
      r = calculate({mode:'mcgkg',concUnit:'μg/mL'},10,2,50);
      add('μg/kg ÷ μg/mL arithmetic', close(r.ml,0.4), `20 μg ÷ 50 μg/mL = ${r.ml} mL`);
      r = calculate({mode:'mcgkg',concUnit:'mg/mL'},10,2,0.05);
      add('μg/kg ÷ mg/mL unit conversion', close(r.ml,0.4), `20 μg ÷ 0.05 mg/mL = ${r.ml} mL`);
      r = calculate({mode:'mlkg',concUnit:'mg/mL'},10,0.2,5);
      add('mL/kg arithmetic', close(r.ml,2), `10 kg × 0.2 mL/kg = ${r.ml} mL`);
      r = calculate({mode:'bwdiv',concUnit:'mg/mL'},10,5,20);
      add('BW ÷ factor arithmetic', close(r.ml,2), `10 kg ÷ 5 = ${r.ml} mL`);

      const missing = medicationReferenceSafety({mode:'mgkg',dose:2,conc:'',concUnit:'mg/mL'});
      add('Missing concentration blocks actionable mL', !missing.actionable && missing.code==='preparation-missing', missing.reason);
      const legacy = medicationReferenceSafety({mode:'bwdiv',dose:10,conc:'',concUnit:''});
      add('Legacy BW ÷ factor blocks auto-fill without preparation', !legacy.actionable && legacy.code==='preparation-missing', legacy.reason);
      const preparedLegacy = medicationReferenceSafety({mode:'bwdiv',dose:10,conc:100,concUnit:'mg/mL'});
      add('BW ÷ factor can be enabled after preparation is explicitly configured', preparedLegacy.actionable, preparedLegacy.reason);
      const manual = medicationReferenceSafety({mode:'manual'});
      add('Manual medications never auto-fill', !manual.actionable && manual.code==='manual', manual.reason);
    } catch (err) {
      add('Medication validation runtime', false, err?.message || String(err));
    }
    return checks;
  }

  function runEttMatrix(dogFn, catFn) {
    const checks = [];
    const add = (label, ok, detail) => checks.push({label, ok:!!ok, detail});
    try {
      const dogWeights=[1,2,3.5,4.5,6,8,10,12,14,16,20,25,30,35,40];
      const catWeights=[1,2,3.5,4.5,6,8];
      const valid = x => x && Number.isFinite(Number(x.min)) && Number.isFinite(Number(x.max)) && Number(x.min)>0 && Number(x.max)>=Number(x.min);
      const monotonic = arr => arr.every((x,i)=>i===0 || Number(x.min)>=Number(arr[i-1].min));
      const dogs=dogWeights.map(dogFn), cats=catWeights.map(catFn);
      add('Dog ETT preparation table returns valid ranges', dogs.every(valid), `${dogWeights.length} weight bands checked`);
      add('Dog ETT ranges are non-decreasing with BW', monotonic(dogs), `${dogs[0]?.range || '—'} → ${dogs.at(-1)?.range || '—'}`);
      add('Cat ETT preparation table returns valid ranges', cats.every(valid), `${catWeights.length} weight bands checked`);
      add('Cat ETT ranges are non-decreasing with BW', monotonic(cats), `${cats[0]?.range || '—'} → ${cats.at(-1)?.range || '—'}`);
      const d10=dogFn(10), c4=catFn(4);
      add('Known ETT spot checks', d10?.min===7 && d10?.max===8 && c4?.min===4 && c4?.max===4.5, `Dog 10 kg ${d10?.range || '—'} • Cat 4 kg ${c4?.range || '—'}`);
    } catch (err) {
      add('ETT validation runtime', false, err?.message || String(err));
    }
    return checks;
  }

  function summarize(checks) {
    const list = Array.isArray(checks) ? checks : [];
    const passed = list.filter(x=>x.ok).length;
    return {ok:passed===list.length, passed, total:list.length, checks:list};
  }

  window.AnesvetClinicalValidation = {
    version:'1.0.0',
    medicationReferenceSafety,
    safeCalculation,
    runMedicationMatrix,
    runEttMatrix,
    summarize
  };
})();
