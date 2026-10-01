/* V17.4: existing OR entry points only; direction-aware alert mapping is unchanged. */
(()=>{
'use strict';
const K=()=>window.ANESVET_CLINICAL_KNOWLEDGE;
function open(topic=''){if(topic)K()?.openQuick(topic);else K()?.open('guides')}
function close(){const q=document.getElementById('knowledgeQuickDialog');if(q?.open)q.close();K()?.close()}
function bind(){
 document.querySelectorAll('[data-open-or-knowledge]').forEach(b=>b.addEventListener('click',()=>open(b.dataset.topic||'')));
 document.addEventListener('click',e=>{const b=e.target.closest?.('[data-knowledge-topic]');if(!b)return;e.preventDefault();e.stopPropagation();open(b.dataset.knowledgeTopic||'')});
}
window.ANESVET_OR_KNOWLEDGE=Object.freeze({open,close,topics:Object.freeze(Object.fromEntries((window.ANESVET_KNOWLEDGE_DATA?.guides||[]).map(g=>[g.id,g])))});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})();
