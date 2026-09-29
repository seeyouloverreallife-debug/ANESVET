from pathlib import Path
from html.parser import HTMLParser
import subprocess, json, re
ROOT=Path(__file__).resolve().parent
checks=[]
def add(name, ok, detail=''):
    checks.append({'name':name,'pass':bool(ok),'detail':str(detail)})

js=sorted(ROOT.glob('*.js'))
syntax_bad=[]
for f in js:
    r=subprocess.run(['node','--check',str(f)],capture_output=True,text=True)
    if r.returncode: syntax_bad.append({'file':f.name,'error':(r.stderr or r.stdout).strip()})
add('JavaScript syntax', not syntax_bad, f'{len(js)-len(syntax_bad)}/{len(js)} PASS' if not syntax_bad else syntax_bad)

class P(HTMLParser):
    def __init__(self): super().__init__(); self.ids=[]; self.refs=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.append(a['id'])
        if tag in ('script','link'):
            v=a.get('src') or a.get('href')
            if v:self.refs.append(v)
p=P(); html=(ROOT/'index.html').read_text(errors='replace'); p.feed(html)
dups=sorted({x for x in p.ids if p.ids.count(x)>1})
add('HTML IDs unique', not dups, f'{len(p.ids)}/{len(set(p.ids))} unique' if not dups else dups)
missing=[]; local_refs=[]
for ref in p.refs:
    if ref.startswith(('http:','https:','data:','#')):continue
    path=ref.split('?',1)[0].split('#',1)[0]
    if not path or path=='./':continue
    if path.startswith('./'):path=path[2:]
    local_refs.append(path)
    if not (ROOT/path).exists():missing.append(path)
add('Local script/style references present', not missing, f'{len(local_refs)-len(missing)}/{len(local_refs)}')

sw=(ROOT/'service-worker.js').read_text(); app=(ROOT/'app.js').read_text(); pwa=(ROOT/'pwa-controller.js').read_text(); session=(ROOT/'session-controller.js').read_text(); sync=(ROOT/'sync-foundation.js').read_text(); trans=(ROOT/'sync-transport.js').read_text(); backup=(ROOT/'backup-restore-controller.js').read_text(); security=(ROOT/'security-baseline.js').read_text(); manifest=json.loads((ROOT/'manifest.webmanifest').read_text())
m=re.search(r'const ASSETS=(\[.*?\]);',sw,re.S);assets=[];sw_missing=[]
if m:
    try:assets=json.loads(m.group(1))
    except Exception as e:sw_missing=[f'ASSETS parse: {e}']
else:sw_missing=['ASSETS not found']
for ref in assets:
    path=ref.split('?',1)[0]
    if path in ('./',''):continue
    if path.startswith('./'):path=path[2:]
    if not (ROOT/path).exists():sw_missing.append(path)
add('Service Worker assets present', not sw_missing, f'{len(assets)-(1 if "./" in assets else 0)}/{len(assets)-(1 if "./" in assets else 0)}' if not sw_missing else sw_missing)

release='17.2.2'
add('App patch version aligned', f"const APP_VERSION='{release}'" in app)
add('Manifest patch version aligned', release in manifest.get('name','') and release in manifest.get('short_name','') and release in manifest.get('start_url',''))
add('Index patch version aligned', 'V17.2.2' in html)
add('Service Worker cache aligned', 'anesvet-v17-2-2-mobile-active-case-rescue' in sw and 'v=17.2.2' in sw)
add('DB_VERSION remains 2', 'const DB_VERSION=2;' in app)
add('backupSchema remains 3', 'const BACKUP_SCHEMA=3;' in backup)
add('identity registry schema remains 2', 'const SCHEMA=2, ITERATIONS=120000;' in security)
add('Sync Foundation remains experimental/default disabled', 'enabled:false' in sync)
add('Sync Transport remains provider-neutral', "PROTOCOL='anesvet-sync'" in trans and 'Provider-neutral Sync Transport' in trans)
add('Local save verifies before sync capture', app.find('Local save verification failed') < app.find('syncCaptureAfterLocalSave(reason)') and app.find('Verified safety checkpoint failed') < app.find('syncCaptureAfterLocalSave(reason)'))
add('administeredBy/documentedBy separation retained', 'administeredBy' in app and 'documentedBy' in app)

# V17.2.2 rescue invariants
add('Active-case update is no longer disabled', "$('updateNowBtn').disabled=false" in pwa and 'Save case & update' in pwa)
add('Active-case update invokes verified preparation', 'await prepareForUpdate()' in pwa and 'prepareForVersionUpdate' in app)
add('Update preparation writes current case checkpoint', "save({reason:'version-update'})" in app and 'writeSafetyCheckpoint(payload)' in app)
add('Update preparation mirrors current case', "await idbPutMeta('current',persisted)" in app)
add('Update stores clinical resume target', 'SAFE_UPDATE_KEY' in app and 'resumeTab:preferredTab' in app)
add('Controlled update suppresses unload blocker only after preparation', 'versionUpdateReloadInProgress' in app and "flushPendingSave('version-update-unload')" in app)
add('Startup resumes progressed anesthesia case directly in OR LIVE', "?'orlive':storedTab" in app and 'setTab(initialTab,{force:resumeClinicalTab})' in app)
add('Recovery resume bypasses inappropriate navigation gate', "initialTab==='recovery'" in app and 'state.recoveryStartedAt' in app and 'resumeClinicalTab' in app)
add('Stale session lock can self-recover', 'recoverOrphanedSession' in session and 'if(isFresh(lock))return false' in session and 'coordinator.takeControl' in session)
add('Stale session watchdog is installed', 'setInterval(()=>recoverOrphanedSession(false)' in session)
add('Visible/pageshow triggers ownership recovery', "addEventListener?.('pageshow'" in session and "visibilityState==='visible'" in session)
add('Rescue service worker skips waiting after verified cache install', '.then(()=>self.skipWaiting())' in sw)
add('Rescue service worker claims existing clients', 'self.clients.claim()' in sw)
add('SW registration bypasses HTTP cache for update check', "updateViaCache:'none'" in pwa and 'reg.update()' in pwa)
add('Versioned service-worker registration used', 'serviceWorkerUrl:`./service-worker.js?v=${APP_VERSION}`' in app)
add('Existing modal interaction recovery retained', 'recoverInvisibleModalBlockers' in app and "'orMoreDialog'" in app)

out={'version':release,'suite':'static-qa-mobile-active-case-rescue','passed':sum(1 for x in checks if x['pass']),'total':len(checks),'checks':checks}
print(json.dumps(out,indent=2,ensure_ascii=False))
if out['passed']!=out['total']:raise SystemExit(1)
