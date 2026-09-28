const CACHE='anesvet-v16-8-2-orchestration-refactor';
const ASSETS=['./','./index.html','./style.css?v=16.8.2','./ui-refinement.css?v=16.8.2','./drug-dose-reference.js?v=16.8.2','./protocol-review.js?v=16.8.2','./clinical-workflow.js?v=16.8.2','./support.js?v=16.8.2','./reliability.js?v=16.8.2','./branding.js?v=16.8.2','./clinical-validation.js?v=16.8.2','./case-runtime.js?v=16.8.2','./core-storage.js?v=16.8.2','./session-coordination.js?v=16.8.2','./patient-domain.js?v=16.8.2','./or-domain.js?v=16.8.2','./recovery-domain.js?v=16.8.2','./patient-master-orchestration.js?v=16.8.2','./or-record-orchestration.js?v=16.8.2','./recovery-orchestration.js?v=16.8.2','./app.js?v=16.8.2','./help.js?v=16.8.2','./ui-refinement.js?v=16.8.2','./pilot-efficiency.css?v=16.8.2','./pilot-efficiency.js?v=16.8.2','./finalization.css?v=16.8.2','./finalization.js?v=16.8.2','./progressive-disclosure.css?v=16.8.2','./progressive-disclosure.js?v=16.8.2','./drug-priority.css?v=16.8.2','./medication-safety.css?v=16.8.2','./medication-reconciliation.css?v=16.8.2','./protocol-review.css?v=16.8.2','./clinical-calm.css?v=16.8.2','./focused-workspace.css?v=16.8.2','./focused-workspace.js?v=16.8.2','./progressive-clinical-flow.css?v=16.8.2','./progressive-clinical-flow.js?v=16.8.2','./adaptive-workspace.css?v=16.8.2','./adaptive-workspace.js?v=16.8.2','./usability-hardening.css?v=16.8.2','./usability-hardening.js?v=16.8.2','./data-resilience.css?v=16.8.2','./data-resilience.js?v=16.8.2','./medication-reconciliation.js?v=16.8.2','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener('message',e=>{if(e.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  const isNavigation=e.request.mode==='navigate'||url.pathname.endsWith('/')||url.pathname.endsWith('/index.html');
  if(isNavigation){
    e.respondWith(fetch(e.request).then(resp=>{const copy=resp.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy));return resp}).catch(()=>caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(resp=>{const copy=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return resp})));
});
