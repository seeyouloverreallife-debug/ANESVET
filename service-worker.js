const CACHE='anesvet-v17-11-4-startup';
const ASSETS=["./assets/fonts/inter-400.ttf","./assets/fonts/inter-600.ttf","./assets/fonts/inter-700.ttf","./anesvet-ui-bundle.css?v=17.11.4","./or-workspace-restructure.css?v=17.11.4","./mobile-design.css?v=17.11.4","./mobile-design.js?v=17.11.4","./assets/visual-glow.svg","./assets/system-indicator.svg","./","./index.html","./manifest.webmanifest","./icon-192.png","./style.css?v=17.11.4","./ui-refinement.css?v=17.11.4","./pilot-efficiency.css?v=17.11.4","./finalization.css?v=17.11.4","./final-archive-assurance.css?v=17.11.4","./progressive-disclosure.css?v=17.11.4","./drug-priority.css?v=17.11.4","./medication-safety.css?v=17.11.4","./medication-reconciliation.css?v=17.11.4","./protocol-review.css?v=17.11.4","./hospital-protocol-governance.css?v=17.11.4","./security-baseline.css?v=17.11.4","./sync-foundation.css?v=17.11.4","./clinical-calm.css?v=17.11.4","./focused-workspace.css?v=17.11.4","./progressive-clinical-flow.css?v=17.11.4","./adaptive-workspace.css?v=17.11.4","./usability-hardening.css?v=17.11.4","./data-resilience.css?v=17.11.4","./data-safety-2.css?v=17.11.4","./procedure-templates.css?v=17.11.4","./recovery-refinement.css?v=17.11.4","./recovery-2.css?v=17.11.4","./or-speed-hardening.css?v=17.11.4","./documentation-guardian.css?v=17.11.4","./problem-response-review.css?v=17.11.4","./production-pilot.css?v=17.11.4","./validation-center.css?v=17.11.4","./case-review-dashboard.css?v=17.11.4","./lifecycle-coordinator.js?v=17.11.4","./drug-dose-reference.js?v=17.11.4","./protocol-review.js?v=17.11.4","./clinical-workflow.js?v=17.11.4","./app-shell.js?v=17.11.4","./case-lifecycle.js?v=17.11.4","./support.js?v=17.11.4","./reliability.js?v=17.11.4","./branding.js?v=17.11.4","./clinical-validation.js?v=17.11.4","./case-runtime.js?v=17.11.4","./core-storage.js?v=17.11.4","./session-coordination.js?v=17.11.4","./session-controller.js?v=17.11.4","./pwa-controller.js?v=17.11.4","./dose-reference-controller.js?v=17.11.4","./patient-domain.js?v=17.11.4","./or-domain.js?v=17.11.4","./recovery-domain.js?v=17.11.4","./patient-master-orchestration.js?v=17.11.4","./or-record-orchestration.js?v=17.11.4","./recovery-orchestration.js?v=17.11.4","./patient-master-controller.js?v=17.11.4","./preop-controller.js?v=17.11.4","./medication-workspace-controller.js?v=17.11.4","./or-live-controller.js?v=17.11.4",
  './or-simplification-controller.js?v=17.11.4',"./recovery-controller.js?v=17.11.4","./backup-restore-controller.js?v=17.11.4","./finalization-archive-controller.js?v=17.11.4","./procedure-templates.js?v=17.11.4","./validation-center.js?v=17.11.4","./hospital-protocol-governance.js?v=17.11.4","./security-baseline.js?v=17.11.4","./sync-transport.js?v=17.11.4","./sync-foundation.js?v=17.11.4","./case-review-dashboard.js?v=17.11.4","./architecture-registry.js?v=17.11.4","./production-pilot.js?v=17.11.4","./active-case-rescue.js?v=17.11.4","./active-case-freshness.js?v=17.11.4","./app-pure-utils.js?v=17.11.4","./recovery-handoff-view-model.js?v=17.11.4","./case-lifecycle-model.js?v=17.11.4","./session-lifecycle-model.js?v=17.11.4","./app.js?v=17.11.4","./data-resilience.js?v=17.11.4","./data-safety-2.js?v=17.11.4","./medication-reconciliation.js?v=17.11.4","./help.js?v=17.11.4","./ui-refinement.js?v=17.11.4","./pilot-efficiency.js?v=17.11.4",
  "./clinical-next-step-controller.js?v=17.11.4","./finalization.js?v=17.11.4","./final-archive-assurance.js?v=17.11.4","./documentation-guardian.js?v=17.11.4","./problem-response-review.js?v=17.11.4","./mobile-or-owner.js?v=17.11.4","./workspace-owner.js?v=17.11.4",
  "./patient-preop-simplification.js?v=17.11.4",
  "./drug-start-simplification.js?v=17.11.4",
  "./or-workflow-refinement.js?v=17.11.4",
  "./or-workspace-restructure.js?v=17.11.4",
  "./recovery-end-refinement.js?v=17.11.4","./progressive-disclosure.js?v=17.11.4","./focused-workspace.js?v=17.11.4","./progressive-clinical-flow.js?v=17.11.4","./adaptive-workspace.js?v=17.11.4","./usability-hardening.js?v=17.11.4","./or-speed-hardening.js?v=17.11.4","./clinical-simplicity.css?v=17.11.4","./clinical-simplicity.js?v=17.11.4","./recovery-endcase-ux.css?v=17.11.4","./repeat-presentation-owner.js?v=17.11.4","./recovery-endcase-ux.js?v=17.11.4","./repeat-use-ux.css?v=17.11.4","./repeat-use-ux.js?v=17.11.4","./repeat-use-r26.css?v=17.11.4","./repeat-use-r26.js?v=17.11.4","./mobile-first-r27.css?v=17.11.4","./mobile-first-r27.js?v=17.11.4","./simulation-mode.css?v=17.11.4","./simulation-mode.js?v=17.11.4","./or-knowledge.css?v=17.11.4","./knowledge-loader.js?v=17.11.4","./or-knowledge.js?v=17.11.4","./icon-512.png","./icon-maskable-512.png","./clinical-knowledge.css?v=17.11.4","./clinical-knowledge-data.js?v=17.11.4","./ecg-educational-rules.js?v=17.11.4","./clinical-knowledge-ui.js?v=17.11.4","./assets/fonts/noto-sans-thai-thai-400-normal.woff2","./assets/fonts/noto-sans-thai-thai-700-normal.woff2","./ecg-visual-atlas-data.js?v=17.11.4","./ecg-visual-atlas.js?v=17.11.4","./assets/ecg/p-qrs-t-schematic.svg","./assets/ecg/01-sinus.png","./assets/ecg/02-sinus.png","./assets/ecg/03-sinus_brady.png","./assets/ecg/04-sinus_tachy.png","./assets/ecg/05-sinus_arrhythmia.png","./assets/ecg/06-apc.png","./assets/ecg/07-svt.png","./assets/ecg/08-af.png","./assets/ecg/09-av1.png","./assets/ecg/10-av2.png","./assets/ecg/11-av2.png","./assets/ecg/12-av3.png","./assets/ecg/13-vpc.png","./assets/ecg/14-vt.png","./assets/ecg/15-vf.png","./assets/ecg/16-asystole.png","./assets/ecg/17-pea.png","./assets/ecg/18-artifact.png","./special-patient-knowledge.js?v=17.11.4","./comorbidity-knowledge.js?v=17.11.4","./assets/startup/ring.svg","./assets/startup/ecg.svg","./assets/startup/glow.svg","./assets/startup/system.svg","./assets/startup/logo.png","./assets/startup/home-logo.png","./assets/startup/connection.svg","./icon-192.png?v=17.11.4","./icon-512.png?v=17.11.4","./icon-maskable-512.png?v=17.11.4"];
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
