const CACHE='anesvet-v17-11-2-startup';
const ASSETS=["./assets/fonts/inter-400.ttf","./assets/fonts/inter-600.ttf","./assets/fonts/inter-700.ttf","./anesvet-ui-bundle.css?v=17.11.2","./or-workspace-restructure.css?v=17.11.2","./mobile-design.css?v=17.11.2","./mobile-design.js?v=17.11.2","./assets/visual-glow.svg","./assets/system-indicator.svg","./","./index.html","./manifest.webmanifest","./icon-192.png","./style.css?v=17.11.2","./ui-refinement.css?v=17.11.2","./pilot-efficiency.css?v=17.11.2","./finalization.css?v=17.11.2","./final-archive-assurance.css?v=17.11.2","./progressive-disclosure.css?v=17.11.2","./drug-priority.css?v=17.11.2","./medication-safety.css?v=17.11.2","./medication-reconciliation.css?v=17.11.2","./protocol-review.css?v=17.11.2","./hospital-protocol-governance.css?v=17.11.2","./security-baseline.css?v=17.11.2","./sync-foundation.css?v=17.11.2","./clinical-calm.css?v=17.11.2","./focused-workspace.css?v=17.11.2","./progressive-clinical-flow.css?v=17.11.2","./adaptive-workspace.css?v=17.11.2","./usability-hardening.css?v=17.11.2","./data-resilience.css?v=17.11.2","./data-safety-2.css?v=17.11.2","./procedure-templates.css?v=17.11.2","./recovery-refinement.css?v=17.11.2","./recovery-2.css?v=17.11.2","./or-speed-hardening.css?v=17.11.2","./documentation-guardian.css?v=17.11.2","./problem-response-review.css?v=17.11.2","./production-pilot.css?v=17.11.2","./validation-center.css?v=17.11.2","./case-review-dashboard.css?v=17.11.2","./lifecycle-coordinator.js?v=17.11.2","./drug-dose-reference.js?v=17.11.2","./protocol-review.js?v=17.11.2","./clinical-workflow.js?v=17.11.2","./app-shell.js?v=17.11.2","./case-lifecycle.js?v=17.11.2","./support.js?v=17.11.2","./reliability.js?v=17.11.2","./branding.js?v=17.11.2","./clinical-validation.js?v=17.11.2","./case-runtime.js?v=17.11.2","./core-storage.js?v=17.11.2","./session-coordination.js?v=17.11.2","./session-controller.js?v=17.11.2","./pwa-controller.js?v=17.11.2","./dose-reference-controller.js?v=17.11.2","./patient-domain.js?v=17.11.2","./or-domain.js?v=17.11.2","./recovery-domain.js?v=17.11.2","./patient-master-orchestration.js?v=17.11.2","./or-record-orchestration.js?v=17.11.2","./recovery-orchestration.js?v=17.11.2","./patient-master-controller.js?v=17.11.2","./preop-controller.js?v=17.11.2","./medication-workspace-controller.js?v=17.11.2","./or-live-controller.js?v=17.11.2",
  './or-simplification-controller.js?v=17.11.2',"./recovery-controller.js?v=17.11.2","./backup-restore-controller.js?v=17.11.2","./finalization-archive-controller.js?v=17.11.2","./procedure-templates.js?v=17.11.2","./validation-center.js?v=17.11.2","./hospital-protocol-governance.js?v=17.11.2","./security-baseline.js?v=17.11.2","./sync-transport.js?v=17.11.2","./sync-foundation.js?v=17.11.2","./case-review-dashboard.js?v=17.11.2","./architecture-registry.js?v=17.11.2","./production-pilot.js?v=17.11.2","./active-case-rescue.js?v=17.11.2","./active-case-freshness.js?v=17.11.2","./app-pure-utils.js?v=17.11.2","./recovery-handoff-view-model.js?v=17.11.2","./case-lifecycle-model.js?v=17.11.2","./session-lifecycle-model.js?v=17.11.2","./app.js?v=17.11.2","./data-resilience.js?v=17.11.2","./data-safety-2.js?v=17.11.2","./medication-reconciliation.js?v=17.11.2","./help.js?v=17.11.2","./ui-refinement.js?v=17.11.2","./pilot-efficiency.js?v=17.11.2",
  "./clinical-next-step-controller.js?v=17.11.2","./finalization.js?v=17.11.2","./final-archive-assurance.js?v=17.11.2","./documentation-guardian.js?v=17.11.2","./problem-response-review.js?v=17.11.2","./mobile-or-owner.js?v=17.11.2","./workspace-owner.js?v=17.11.2",
  "./patient-preop-simplification.js?v=17.11.2",
  "./drug-start-simplification.js?v=17.11.2",
  "./or-workflow-refinement.js?v=17.11.2",
  "./or-workspace-restructure.js?v=17.11.2",
  "./recovery-end-refinement.js?v=17.11.2","./progressive-disclosure.js?v=17.11.2","./focused-workspace.js?v=17.11.2","./progressive-clinical-flow.js?v=17.11.2","./adaptive-workspace.js?v=17.11.2","./usability-hardening.js?v=17.11.2","./or-speed-hardening.js?v=17.11.2","./clinical-simplicity.css?v=17.11.2","./clinical-simplicity.js?v=17.11.2","./recovery-endcase-ux.css?v=17.11.2","./repeat-presentation-owner.js?v=17.11.2","./recovery-endcase-ux.js?v=17.11.2","./repeat-use-ux.css?v=17.11.2","./repeat-use-ux.js?v=17.11.2","./repeat-use-r26.css?v=17.11.2","./repeat-use-r26.js?v=17.11.2","./mobile-first-r27.css?v=17.11.2","./mobile-first-r27.js?v=17.11.2","./simulation-mode.css?v=17.11.2","./simulation-mode.js?v=17.11.2","./or-knowledge.css?v=17.11.2","./knowledge-loader.js?v=17.11.2","./or-knowledge.js?v=17.11.2","./icon-512.png","./icon-maskable-512.png","./clinical-knowledge.css?v=17.11.2","./clinical-knowledge-data.js?v=17.11.2","./ecg-educational-rules.js?v=17.11.2","./clinical-knowledge-ui.js?v=17.11.2","./assets/fonts/noto-sans-thai-thai-400-normal.woff2","./assets/fonts/noto-sans-thai-thai-700-normal.woff2","./ecg-visual-atlas-data.js?v=17.11.2","./ecg-visual-atlas.js?v=17.11.2","./assets/ecg/p-qrs-t-schematic.svg","./assets/ecg/01-sinus.png","./assets/ecg/02-sinus.png","./assets/ecg/03-sinus_brady.png","./assets/ecg/04-sinus_tachy.png","./assets/ecg/05-sinus_arrhythmia.png","./assets/ecg/06-apc.png","./assets/ecg/07-svt.png","./assets/ecg/08-af.png","./assets/ecg/09-av1.png","./assets/ecg/10-av2.png","./assets/ecg/11-av2.png","./assets/ecg/12-av3.png","./assets/ecg/13-vpc.png","./assets/ecg/14-vt.png","./assets/ecg/15-vf.png","./assets/ecg/16-asystole.png","./assets/ecg/17-pea.png","./assets/ecg/18-artifact.png","./special-patient-knowledge.js?v=17.11.2","./comorbidity-knowledge.js?v=17.11.2","./assets/startup/ring.svg","./assets/startup/ecg.svg","./assets/startup/glow.svg","./assets/startup/system.svg","./assets/startup/logo.png","./assets/startup/home-logo.png","./assets/startup/connection.svg","./icon-192.png?v=17.11.2","./icon-512.png?v=17.11.2","./icon-maskable-512.png?v=17.11.2"];
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
