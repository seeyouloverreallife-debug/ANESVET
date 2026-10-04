const CACHE='anesvet-v17-14-7-startup';
const ASSETS=["./assets/fonts/inter-400.ttf","./assets/fonts/inter-600.ttf","./assets/fonts/inter-700.ttf","./assets/css/anesvet-ui-bundle.css?v=17.14.7","./assets/css/or-workspace-restructure.css?v=17.14.7","./mobile-design.js?v=17.14.7","./assets/visual-glow.svg","./assets/system-indicator.svg","./","./index.html","./manifest.webmanifest","./assets/icons/icon-192.png","./runtime/platform/lifecycle-coordinator.js?v=17.14.7","./runtime/platform/viewport-coordinator.js?v=17.14.7","./runtime/clinical/drug-dose-reference.js?v=17.14.7","./runtime/clinical/protocol-review.js?v=17.14.7","./runtime/clinical/clinical-workflow.js?v=17.14.7","./runtime/core/app-shell.js?v=17.14.7","./runtime/core/case-lifecycle.js?v=17.14.7","./runtime/core/support.js?v=17.14.7","./runtime/core/reliability.js?v=17.14.7","./runtime/core/branding.js?v=17.14.7","./runtime/core/clinical-validation.js?v=17.14.7","./runtime/core/case-runtime.js?v=17.14.7","./runtime/core/core-storage.js?v=17.14.7","./runtime/core/session-coordination.js?v=17.14.7","./runtime/core/session-controller.js?v=17.14.7","./runtime/domains/pwa-controller.js?v=17.14.7","./runtime/domains/dose-reference-controller.js?v=17.14.7","./runtime/domains/patient-domain.js?v=17.14.7","./runtime/domains/or-domain.js?v=17.14.7","./runtime/domains/recovery-domain.js?v=17.14.7","./runtime/orchestration/patient-master-orchestration.js?v=17.14.7","./runtime/orchestration/or-record-orchestration.js?v=17.14.7","./runtime/orchestration/recovery-orchestration.js?v=17.14.7","./runtime/controllers/patient-master-controller.js?v=17.14.7","./runtime/controllers/preop-controller.js?v=17.14.7","./runtime/controllers/medication-workspace-controller.js?v=17.14.7","./runtime/controllers/or-live-controller.js?v=17.14.7",
  './or-simplification-controller.js?v=17.14.7',"./runtime/controllers/recovery-controller.js?v=17.14.7","./runtime/controllers/backup-restore-controller.js?v=17.14.7","./runtime/controllers/finalization-archive-controller.js?v=17.14.7","./procedure-templates.js?v=17.14.7","./validation-center.js?v=17.14.7","./hospital-protocol-governance.js?v=17.14.7","./security-baseline.js?v=17.14.7","./sync-transport.js?v=17.14.7","./sync-foundation.js?v=17.14.7","./case-review-dashboard.js?v=17.14.7","./architecture-registry.js?v=17.14.7","./production-pilot.js?v=17.14.7","./active-case-rescue.js?v=17.14.7","./active-case-freshness.js?v=17.14.7","./app-pure-utils.js?v=17.14.7","./recovery-handoff-view-model.js?v=17.14.7","./case-lifecycle-model.js?v=17.14.7","./session-lifecycle-model.js?v=17.14.7","./app.js?v=17.14.7","./data-resilience.js?v=17.14.7","./data-safety-2.js?v=17.14.7","./medication-reconciliation.js?v=17.14.7","./help.js?v=17.14.7",
  "./clinical-next-step-controller.js?v=17.14.7","./finalization.js?v=17.14.7","./final-archive-assurance.js?v=17.14.7","./documentation-guardian.js?v=17.14.7","./problem-response-review.js?v=17.14.7","./runtime/platform/mobile-or-owner.js?v=17.14.7","./runtime/platform/workspace-owner.js?v=17.14.7","./runtime/platform/presentation-ownership.js?v=17.14.7",
  "./patient-preop-simplification.js?v=17.14.7",
  "./drug-start-simplification.js?v=17.14.7",
  "./or-workflow-refinement.js?v=17.14.7",
  "./or-workspace-restructure.js?v=17.14.7",
  "./recovery-end-refinement.js?v=17.14.7","./repeat-presentation-owner.js?v=17.14.7","./simulation-mode.js?v=17.14.7","./knowledge-loader.js?v=17.14.7","./or-knowledge.js?v=17.14.7","./assets/icons/icon-512.png","./assets/icons/icon-maskable-512.png","./runtime/knowledge/clinical-knowledge-data.js?v=17.14.7","./runtime/knowledge/ecg-educational-rules.js?v=17.14.7","./runtime/knowledge/clinical-knowledge-ui.js?v=17.14.7","./assets/fonts/noto-sans-thai-thai-400-normal.woff2","./assets/fonts/noto-sans-thai-thai-700-normal.woff2","./runtime/knowledge/ecg-visual-atlas-data.js?v=17.14.7","./runtime/knowledge/ecg-visual-atlas.js?v=17.14.7","./assets/ecg/p-qrs-t-schematic.svg","./assets/ecg/01-sinus.png","./assets/ecg/02-sinus.png","./assets/ecg/03-sinus_brady.png","./assets/ecg/04-sinus_tachy.png","./assets/ecg/05-sinus_arrhythmia.png","./assets/ecg/06-apc.png","./assets/ecg/07-svt.png","./assets/ecg/08-af.png","./assets/ecg/09-av1.png","./assets/ecg/10-av2.png","./assets/ecg/11-av2.png","./assets/ecg/12-av3.png","./assets/ecg/13-vpc.png","./assets/ecg/14-vt.png","./assets/ecg/15-vf.png","./assets/ecg/16-asystole.png","./assets/ecg/17-pea.png","./assets/ecg/18-artifact.png","./runtime/knowledge/special-patient-knowledge.js?v=17.14.7","./runtime/knowledge/comorbidity-knowledge.js?v=17.14.7","./assets/startup/ring.svg","./assets/startup/ecg.svg","./assets/startup/glow.svg","./assets/startup/system.svg","./assets/startup/logo.png","./assets/startup/home-logo.png","./assets/startup/connection.svg","./assets/icons/icon-192.png?v=17.14.7","./assets/icons/icon-512.png?v=17.14.7","./assets/icons/icon-maskable-512.png?v=17.14.7"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener('message',e=>{if(e.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('anesvet-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  // Android checks this stable URL to update the installed splash screen.
  // A cache-first manifest can keep old colors/icons even after the web UI updates.
  if(url.origin===self.location.origin&&url.pathname.endsWith('/manifest.webmanifest')){
    e.respondWith((async()=>{
      try{
        const response=await fetch(e.request,{cache:'no-store'});
        if(!response.ok)throw new Error('Manifest unavailable');
        const copy=response.clone();
        e.waitUntil(caches.open(CACHE).then(c=>c.put('./manifest.webmanifest',copy)));
        return response;
      }catch(error){
        const cached=await caches.match('./manifest.webmanifest');
        if(cached)return cached;
        return Response.error();
      }
    })());
    return;
  }
  const isNavigation=e.request.mode==='navigate'||url.pathname.endsWith('/')||url.pathname.endsWith('/index.html');
  if(isNavigation){
    e.respondWith(fetch(e.request).then(resp=>{const copy=resp.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy));return resp}).catch(()=>caches.match('./index.html')));
    return;
  }
  // Versioned application code must not be satisfied by an accidentally mixed
  // runtime cache. Prefer the network and refresh the active cache; offline falls
  // back to this release's precache.
  const isVersionedCode=url.origin===self.location.origin&&/\.(?:js|css)$/.test(url.pathname)&&url.searchParams.has('v');
  if(isVersionedCode){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(resp=>{if(!resp.ok)throw new Error('Versioned asset unavailable');const copy=resp.clone();e.waitUntil(caches.open(CACHE).then(c=>c.put(e.request,copy)));return resp}).catch(()=>caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(resp=>{const copy=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return resp})));
});
