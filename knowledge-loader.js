/* ANESVET V17.14.5 — lazy clinical knowledge loader.
   Keeps knowledge assets available offline via service-worker precache while
   removing their parse/initialization cost from the critical app startup path. */
(()=>{
'use strict';
const VERSION='17.14.5';
const FILES=[
 'runtime/knowledge/clinical-knowledge-data.js','runtime/knowledge/ecg-educational-rules.js','runtime/knowledge/ecg-visual-atlas-data.js',
 'runtime/knowledge/special-patient-knowledge.js','runtime/knowledge/comorbidity-knowledge.js','runtime/knowledge/clinical-knowledge-ui.js','runtime/knowledge/ecg-visual-atlas.js'
];
let pending=null;
function loadScript(file){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=`./${file}?v=${VERSION}`;s.async=false;s.dataset.anesvetLazy='knowledge';s.onload=()=>resolve(file);s.onerror=()=>reject(new Error(`Knowledge asset failed: ${file}`));document.head.appendChild(s);});}
async function ensure(){
 if(window.ANESVET_CLINICAL_KNOWLEDGE)return window.ANESVET_CLINICAL_KNOWLEDGE;
 if(pending)return pending;
 pending=(async()=>{for(const file of FILES)await loadScript(file);if(!window.ANESVET_CLINICAL_KNOWLEDGE)throw new Error('Clinical knowledge did not initialize');document.dispatchEvent(new CustomEvent('anesvet:knowledge-ready'));return window.ANESVET_CLINICAL_KNOWLEDGE;})().catch(err=>{pending=null;console.error(err);throw err;});
 return pending;
}
async function open(tab='guides'){const api=await ensure();api.open(tab);return api;}
async function openQuick(topic=''){const api=await ensure();if(topic)api.openQuick(topic);else api.open('guides');return api;}

document.addEventListener('click',event=>{const b=event.target.closest?.('[data-open-clinical-knowledge]');if(!b)return;event.preventDefault();event.stopPropagation();open(b.dataset.openClinicalKnowledge||'guides').catch(console.error);});
window.ANESVET_KNOWLEDGE_LOADER=Object.freeze({version:VERSION,ensure,open,openQuick});
})();
