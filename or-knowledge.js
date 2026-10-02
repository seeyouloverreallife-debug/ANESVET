/* V17.4: existing OR entry points only; direction-aware alert mapping is unchanged. */
(()=>{
'use strict';
const K=()=>window.ANESVET_CLINICAL_KNOWLEDGE;
async function open(topic=''){const L=window.ANESVET_KNOWLEDGE_LOADER;if(L){try{return await L.openQuick(topic)}catch(err){console.error(err);return}}if(topic)K()?.openQuick(topic);else K()?.open('guides')}
function close(){const q=document.getElementById('knowledgeQuickDialog');if(q?.open)q.close();K()?.close()}
function bind(){
 document.querySelectorAll('[data-open-or-knowledge]').forEach(b=>b.addEventListener('click',()=>open(b.dataset.topic||'')));
 document.addEventListener('click',e=>{const b=e.target.closest?.('[data-knowledge-topic]');if(!b)return;e.preventDefault();e.stopPropagation();open(b.dataset.knowledgeTopic||'')});
}
window.ANESVET_OR_KNOWLEDGE=Object.freeze({open,close,get topics(){return Object.freeze(Object.fromEntries((window.ANESVET_KNOWLEDGE_DATA?.guides||[]).map(g=>[g.id,g])))}});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})();
