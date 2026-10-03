(function(){
'use strict';

const DISCLAIMER='Clinical reference only — verify indication, patient factors, product label and hospital protocol. Reference doses never auto-fill or replace the protocol dose.';
const SOURCES={
  bsava:{short:'BSAVA SAF 10e',label:'BSAVA Small Animal Formulary, Part A: Canine and Feline, 10th ed.'},
  recover2024:{short:'RECOVER 2024',label:'2024 RECOVER Guidelines: Updated treatment recommendations for CPR in dogs and cats'},
  enovat2025:{short:'ENOVAT 2025',label:'ENOVAT guideline: surgical antimicrobial prophylaxis in dogs and cats'},
  merck_penicillin:{short:'Merck Vet Manual',label:'Merck Veterinary Manual — Penicillins / beta-lactam dosing'},
  merck_emergency:{short:'Merck Vet Manual',label:'Merck Veterinary Manual — Initial triage and resuscitation of small animal emergency patients'},
  merck_analgesics:{short:'Merck Vet Manual',label:'Merck Veterinary Manual — Selected analgesics for dogs'},
  aafp:{short:'AAFP Feline Anesthesia',label:'AAFP Feline Anesthesia Guidelines — IV induction agents'}
};

const DATA={
  diazepam:{names:['diazepam','diazepamdose'],entries:[
    {species:['dog','cat'],context:'Anaesthesia / recovery adjunct',dose:'0.2–0.3 mg/kg',route:'IV',source:'bsava',primary:true},
    {species:['dog'],context:'Sedation / premedication',dose:'0.2–0.5 mg/kg',route:'IV/IM',source:'bsava'}
  ]},
  propofol:{names:['propofol','propofoldose'],entries:[
    {species:['dog'],context:'Induction — premedicated',dose:'1–4 mg/kg',route:'IV to effect',source:'bsava',primary:true},
    {species:['dog'],context:'Induction — unpremedicated',dose:'6–7 mg/kg',route:'IV to effect',source:'bsava'},
    {species:['cat'],context:'Induction — premedicated',dose:'2–5 mg/kg',route:'IV to effect',source:'bsava',primary:true},
    {species:['cat'],context:'Induction — unpremedicated',dose:'8 mg/kg',route:'IV to effect',source:'bsava'},
    {species:['dog','cat'],context:'Maintenance / sedation CRI',dose:'0.1–0.4 mg/kg/min',route:'IV CRI',source:'bsava'}
  ]},
  tramadol:{names:['tramadol','tramadoldose'],entries:[
    {species:['dog'],context:'Peri-anaesthetic analgesia',dose:'2 mg/kg',route:'IV',source:'bsava',primary:true},
    {species:['cat'],context:'Peri-anaesthetic analgesia',dose:'1–2 mg/kg',route:'IV/SC',source:'bsava',primary:true},
    {species:['dog'],context:'Oral analgesia',dose:'2–5 mg/kg',route:'PO q8h',source:'bsava'},
    {species:['cat'],context:'Oral analgesia',dose:'2–4 mg/kg',route:'PO q8h',source:'bsava'}
  ],note:'Route matters: the IV reference is lower than common oral ranges.'},
  carprofen:{names:['carprofen','rimadyl','rimadylcarprofen','carprofendose'],entries:[
    {species:['dog'],context:'Perioperative NSAID',dose:'4 mg/kg',route:'IV/SC',source:'bsava',primary:true},
    {species:['dog'],context:'Daily analgesic / anti-inflammatory reference',dose:'4.4 mg/kg/day',route:'PO/SC/IV',source:'merck_analgesics'},
    {species:['dog'],context:'Formulary perioperative reference',dose:'4 mg/kg',route:'IV/SC',source:'bsava'}
  ],note:'Confirm hydration, renal/GI risk and the specific product label before use.'},
  meloxicam:{names:['meloxicam','metacam','metacammeloxicam','meloxicamdose'],entries:[
    {species:['cat'],context:'Initial injectable dose',dose:'0.2 mg/kg',route:'SC',source:'bsava'},
    {species:['cat'],context:'Single postoperative dose',dose:'0.3 mg/kg',route:'SC',source:'bsava',primary:true},
    {species:['dog'],context:'Initial dose',dose:'0.2 mg/kg',route:'SC/PO',source:'bsava',primary:true},
    {species:['dog'],context:'Maintenance',dose:'0.1 mg/kg',route:'PO q24h',source:'bsava'}
  ],note:'NSAID licensing and repeat-dose recommendations vary by country/product, especially in cats.'},
  cefazolin:{names:['cefazolin','cefazolinabo','cefazolindivisor'],entries:[
    {species:['dog','cat'],context:'Surgical antimicrobial prophylaxis — when indicated',dose:'22–25 mg/kg',route:'IV',source:'enovat2025',primary:true,extra:'Give before incision; intraoperative redosing is typically q2h when prophylaxis remains indicated.'}
  ],note:'Not recommended as routine prophylaxis for every clean procedure; follow stewardship and local policy.'},
  cefovecin:{names:['cefovecin','convenia','conveniadivisor'],entries:[
    {species:['dog','cat'],context:'Long-acting antimicrobial',dose:'8 mg/kg',route:'SC',source:'bsava',primary:true,extra:'A repeat dose may be considered after 14 days when clinically indicated.'}
  ],note:'Long duration limits the ability to stop therapy; use antimicrobial stewardship and an appropriate indication.'},
  epinephrine:{names:['epinephrine','adrenaline','adrenalineepinephrine','adrenalinecpr','adrenalinedose'],entries:[
    {species:['dog','cat'],context:'CPR — standard epinephrine dose',dose:'0.01 mg/kg',route:'IV/IO',source:'recover2024',primary:true,extra:'For nonshockable arrest, standard dosing interval is 3–5 min while indicated. High-dose epinephrine is not recommended.'}
  ]},
  atropine:{names:['atropine','atropinebradycardia','atropinecpr','atropinebradydose','atropinecprdose'],entries:[
    {species:['dog','cat'],context:'Hemodynamically significant bradycardia / prevention of CPA',dose:'0.04 mg/kg',route:'IV/IO',source:'recover2024',primary:true},
    {species:['dog','cat'],context:'CPR — nonshockable arrest, if atropine is used',dose:'0.04 mg/kg (table range 0.04–0.054)',route:'IV/IO once',source:'recover2024',extra:'Give early; do not repeat during the same CPR event.'},
    {species:['dog','cat'],context:'Bradyarrhythmia — formulary reference',dose:'0.01–0.03 mg/kg',route:'IV',source:'bsava'}
  ],note:'RECOVER 2024 differs from older formulary bradyarrhythmia ranges; the hospital protocol is intentionally not changed automatically.'},
  dopamine:{names:['dopamine','dopaminecri'],entries:[
    {species:['dog'],context:'Hemodynamic support CRI',dose:'2–10 μg/kg/min',route:'IV CRI titrate to effect',source:'bsava',primary:true},
    {species:['cat'],context:'Hemodynamic support CRI',dose:'1–5 μg/kg/min',route:'IV CRI titrate to effect',source:'bsava',primary:true}
  ],note:'Continuous BP/ECG/perfusion monitoring is required; response and receptor effects are dose dependent.'},
  midazolam:{names:['midazolam'],entries:[
    {species:['dog','cat'],context:'Anaesthesia / recovery adjunct',dose:'0.2–0.3 mg/kg',route:'IV',source:'bsava',primary:true}
  ]},
  alfaxalone:{names:['alfaxalone'],entries:[
    {species:['dog'],context:'Induction — premedicated',dose:'2 mg/kg',route:'IV to effect',source:'bsava',primary:true},
    {species:['dog'],context:'Induction — unpremedicated',dose:'3 mg/kg',route:'IV to effect',source:'bsava'},
    {species:['cat'],context:'Induction',dose:'2–5 mg/kg',route:'IV to effect',source:'bsava',primary:true},
    {species:['dog'],context:'Maintenance',dose:'6–9 mg/kg/h',route:'IV CRI',source:'bsava'},
    {species:['cat'],context:'Maintenance',dose:'7–10 mg/kg/h',route:'IV CRI',source:'bsava'}
  ]},
  ketamine:{names:['ketamine'],entries:[
    {species:['dog'],context:'Induction with diazepam/midazolam',dose:'2 mg/kg',route:'IV',source:'bsava',primary:true},
    {species:['cat'],context:'Induction with midazolam',dose:'2–5 mg/kg',route:'IV',source:'aafp',primary:true},
    {species:['dog','cat'],context:'Perioperative analgesia — loading',dose:'250–500 μg/kg',route:'IV',source:'bsava'},
    {species:['dog','cat'],context:'Perioperative analgesia — intra-op',dose:'10 μg/kg/min',route:'IV CRI',source:'bsava'},
    {species:['dog','cat'],context:'Post-op analgesia',dose:'2–5 μg/kg/min',route:'IV CRI',source:'bsava'}
  ]},
  etomidate:{names:['etomidate'],entries:[
    {species:['dog'],context:'Induction / rapid sequence intubation',dose:'0.5–2 mg/kg',route:'IV to effect',source:'merck_emergency',primary:true},
    {species:['cat'],context:'Induction',dose:'1.5–4 mg/kg',route:'IV to effect',source:'aafp',primary:true}
  ],note:'Dose requirement is reduced by effective premedication; titrate slowly to effect.'},
  ampicillin_sulbactam:{names:['ampicillinsulbactam','ampicillinsulbactam'],entries:[
    {species:['dog','cat'],context:'Injectable antimicrobial treatment',dose:'10–30 mg/kg',route:'IV q6–8h',source:'merck_penicillin',primary:true},
    {species:['dog','cat'],context:'Continuous infusion reference',dose:'3.75–8.3 mg/kg/h',route:'IV CRI',source:'merck_penicillin'}
  ],note:'This is a treatment reference, not an automatic recommendation for surgical prophylaxis.'},
  clindamycin:{names:['clindamycin'],entries:[
    {species:['dog','cat'],context:'Common oral antimicrobial dosing',dose:'5.5 mg/kg q12h or 11 mg/kg q24h',route:'PO',source:'bsava',primary:true},
    {species:['dog','cat'],context:'Severe infection',dose:'11 mg/kg',route:'PO q12h',source:'bsava'}
  ],note:'Not a generic perioperative prophylaxis recommendation; indication and pathogen/site matter.'},
  methadone:{names:['methadone'],entries:[
    {species:['dog','cat'],context:'Analgesia',dose:'0.1–0.5 mg/kg',route:'IM',source:'bsava',primary:true},
    {species:['dog','cat'],context:'Analgesia',dose:'0.1–0.3 mg/kg',route:'IV',source:'bsava'}
  ]},
  buprenorphine:{names:['buprenorphine'],entries:[
    {species:['dog'],context:'Analgesia',dose:'0.02 mg/kg',route:'IV/IM/SC q6h',source:'bsava',primary:true},
    {species:['cat'],context:'Analgesia',dose:'0.02–0.03 mg/kg',route:'IV/IM/SC q6h',source:'bsava',primary:true}
  ]},
  fentanyl:{names:['fentanyl'],entries:[
    {species:['dog','cat'],context:'Loading / bolus',dose:'2.5–10 μg/kg',route:'IV slowly',source:'bsava',primary:true},
    {species:['dog','cat'],context:'Intraoperative analgesia',dose:'2.5–10 μg/kg/h',route:'IV CRI',source:'bsava'},
    {species:['dog','cat'],context:'Postoperative analgesia',dose:'1–5 μg/kg/h',route:'IV CRI',source:'bsava'}
  ]},
  butorphanol:{names:['butorphanol'],entries:[
    {species:['dog','cat'],context:'Analgesia',dose:'0.2–0.5 mg/kg',route:'IV/IM/SC',source:'bsava',primary:true},
    {species:['dog','cat'],context:'Sedation / anaesthesia combination',dose:'0.1–0.4 mg/kg',route:'IV/IM',source:'bsava'}
  ]},
  robenacoxib:{names:['robenacoxib'],entries:[
    {species:['dog','cat'],context:'Perioperative injectable NSAID',dose:'2 mg/kg',route:'SC q24h; max 2 doses',source:'bsava',primary:true},
    {species:['dog','cat'],context:'Oral NSAID',dose:'1–2 mg/kg',route:'PO q24h',source:'bsava'}
  ],note:'Confirm current local product licensing and patient-specific NSAID contraindications.'},
  amoxicillin_clavulanate:{names:['amoxicillinclavulanate','coamoxiclav','amoxiclav'],entries:[
    {species:['dog','cat'],context:'Surgical antimicrobial prophylaxis — when indicated',dose:'22–25 mg/kg (combined drug)',route:'IV',source:'bsava',primary:true,extra:'Give about 30 min before surgery; intraoperative redosing q1.5–2h may be used when prophylaxis remains indicated.'},
    {species:['dog','cat'],context:'General parenteral treatment range',dose:'8.75–25 mg/kg (combined drug)',route:'parenteral',source:'bsava'}
  ],note:'Use prophylaxis selectively according to procedure risk, local policy and antimicrobial stewardship.'}
};

function norm(v){return String(v||'').toLowerCase().replace(/[^a-z0-9]+/g,'')}
const INDEX=new Map();
Object.entries(DATA).forEach(([key,drug])=>{INDEX.set(norm(key),key);(drug.names||[]).forEach(n=>INDEX.set(norm(n),key))});
function keyFor(value){const n=norm(typeof value==='object'?(value?.id||value?.name):value);if(!n)return null;if(INDEX.has(n))return INDEX.get(n);if(n.startsWith('library')&&INDEX.has(n.slice(7)))return INDEX.get(n.slice(7));return null}
function speciesNorm(v){const n=norm(v);if(n.startsWith('dog')||n==='canine')return 'dog';if(n.startsWith('cat')||n==='feline')return 'cat';return ''}
function get(value,species=''){
  const key=keyFor(value);if(!key)return null;const drug=DATA[key],sp=speciesNorm(species);
  const entries=(drug.entries||[]).filter(e=>!sp||e.species.includes(sp));
  return {key,names:drug.names||[],entries,allEntries:drug.entries||[],note:drug.note||'',disclaimer:DISCLAIMER};
}
function primary(value,species=''){
  const r=get(value,species);if(!r||!r.entries.length)return null;return r.entries.find(e=>e.primary)||r.entries[0];
}
function brief(value,species=''){
  const e=primary(value,species);if(!e)return '';const sp=speciesNorm(species),label=sp?sp.toUpperCase():(e.species||[]).map(x=>x.toUpperCase()).join('/');return `${label?label+' • ':''}${e.dose} ${e.route}${e.context?' • '+e.context:''}`;
}
function sourceLabel(id){return SOURCES[id]?.label||id||''}
function sourceShort(id){return SOURCES[id]?.short||id||''}

window.ANESVET_DOSE_REFERENCE=Object.freeze({version:'15.26.0',sources:SOURCES,data:DATA,keyFor,get,primary,brief,sourceLabel,sourceShort,disclaimer:DISCLAIMER});
})();
