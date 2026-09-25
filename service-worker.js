const CACHE='anesvet-v15-20-0-drug-quick-preset-priority';
const ASSETS=['./','./index.html','./style.css?v=15.20.0','./ui-refinement.css?v=15.20.0','./clinical-workflow.js?v=15.20.0','./support.js?v=15.20.0','./reliability.js?v=15.20.0','./branding.js?v=15.20.0','./app.js?v=15.20.0','./help.js?v=15.20.0','./ui-refinement.js?v=15.20.0','./pilot-efficiency.css?v=15.20.0','./pilot-efficiency.js?v=15.20.0','./finalization.css?v=15.20.0','./finalization.js?v=15.20.0','./progressive-disclosure.css?v=15.20.0','./progressive-disclosure.js?v=15.20.0','./drug-priority.css?v=15.20.0','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png'];
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
