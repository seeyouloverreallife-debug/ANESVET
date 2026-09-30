// R21 compatible copy of previous regression; original retained unchanged.
// Version-specific R20 compatibility copy; original regression retained.
// R18 version-adapted regression copy; the R17 original is retained unchanged.
// R17 version-bumped copy; original R16 test retained unchanged.
const fs=require('fs');
const index=fs.readFileSync('index.html','utf8');
const app=fs.readFileSync('app.js','utf8');
const tests=[];
const t=(name,pass)=>tests.push({name,pass:!!pass});
t('inline sentinel loads before first app script', index.indexOf('id="anesvetBootSentinel"')>=0 && index.indexOf('id="anesvetBootSentinel"')<index.indexOf('drug-dose-reference.js?v=17.2.25'));
t('sentinel captures window errors', index.includes("window.addEventListener('error'"));
t('sentinel captures unhandled rejections', index.includes("window.addEventListener('unhandledrejection'"));
t('sentinel has pointer capture', index.includes("document.addEventListener('pointerdown'"));
t('sentinel has touch fallback', index.includes("document.addEventListener('touchstart'"));
t('sentinel probes ASA coordinates', index.includes('function cardAt(x,y)') && index.includes("'ASA tap not handled'"));
t('sentinel does not set ASA value', !/document\.getElementById\(['"]asa['"]\)\.value\s*=/.test(index.match(/<script id="anesvetBootSentinel">([\s\S]*?)<\/script>/)?.[1]||''));
t('app marks entry', app.includes("BOOT?.mark?.('app-enter')"));
t('app marks patient binding', app.includes("BOOT?.mark?.('patient-master-bound')"));
t('app marks OR LIVE binding', app.includes("BOOT?.mark?.('or-live-bound')"));
t('app marks sync hydrate boundaries', app.includes("BOOT?.mark?.('sync-hydrate-start')")&&app.includes("BOOT?.mark?.('sync-hydrate-complete')"));
t('app publishes startup complete', app.includes("BOOT?.ready?.('startup-complete')"));
t('async bootstrap has top-level catch', app.includes("})().catch(err=>"));
const passed=tests.filter(x=>x.pass).length;
console.log(JSON.stringify({version:'17.2.25',suite:'boot-runtime-diagnostic',passed,total:tests.length,tests},null,2));
if(passed!==tests.length)process.exit(1);
