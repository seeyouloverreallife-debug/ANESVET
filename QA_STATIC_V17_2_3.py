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

sw=(ROOT/'service-worker.js').read_text(); app=(ROOT/'app.js').read_text(); pwa=(ROOT/'pwa-controller.js').read_text(); session=(ROOT/'session-controller.js').read_text(); sync=(ROOT/'sync-foundation.js').read_text(); trans=(ROOT/'sync-transport.js').read_text(); backup=(ROOT/'backup-restore-controller.js').read_text(); security=(ROOT/'security-baseline.js').read_text(); rescue=(ROOT/'active-case-rescue.js').read_text(); ux=(ROOT/'usability-hardening.js').read_text(); ucss=(ROOT/'usability-hardening.css').read_text(); manifest=json.loads((ROOT/'manifest.webmanifest').read_text())
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

release='17.2.3'
add('App patch version aligned', f"const APP_VERSION='{release}'" in app)
add('Manifest patch version aligned', release in manifest.get('name','') and release in manifest.get('short_name','') and release in manifest.get('start_url',''))
add('Index patch version aligned', 'V17.2.3' in html)
add('Service Worker cache aligned', 'anesvet-v17-2-3-active-case-state-repair' in sw and 'v=17.2.3' in sw)
add('Active-case rescue module loaded before app', html.find('active-case-rescue.js?v=17.2.3') < html.find('app.js?v=17.2.3'))
add('Active-case rescue module cached', './active-case-rescue.js?v=17.2.3' in sw)
add('DB_VERSION remains 2', 'const DB_VERSION=2;' in app)
add('backupSchema remains 3', 'const BACKUP_SCHEMA=3;' in backup)
add('identity registry schema remains 2', 'const SCHEMA=2, ITERATIONS=120000;' in security)
add('Sync Foundation remains experimental/default disabled', 'enabled:false' in sync)
add('Sync Transport remains provider-neutral', "PROTOCOL='anesvet-sync'" in trans and 'Provider-neutral Sync Transport' in trans)
add('Local save verifies before sync capture', app.find('Local save verification failed') < app.find('syncCaptureAfterLocalSave(reason)') and app.find('Verified safety checkpoint failed') < app.find('syncCaptureAfterLocalSave(reason)'))
add('administeredBy/documentedBy separation retained', 'administeredBy' in app and 'documentedBy' in app)

add('Started SETUP contradiction repairs to intraop', "s.casePhase==='setup'||!s.casePhase" in rescue and "s.casePhase='intraop'" in rescue)
add('Repair never marks patientSaved true', 'patientSaved=true' not in rescue)
add('Frozen case-start snapshot only fills missing BW/identity', 'restored missing current BW from frozen case-start snapshot' in rescue and "caseIdentitySnapshot" in rescue)
add('Active case startup wins over NOT SAVED setup', "const activeCaseTarget=ACTIVE_CASE_RESCUE.targetForState(state);" in app and "const initialTab=activeCaseTarget||(state.patientSaved?storedTab:'patient');" in app)
add('Resume API exported', 'resumeActiveCase:(options={})=>resumeActiveClinicalWorkspace(options)' in app)
add('Resume uses forced clinical activation fallback', 'forceActivateClinicalUI(target)' in app and 'requestAnimationFrame(()=>{if(!$(target)?.classList.contains' in app)
add('Resume clears stale inert only when Identity is not locked', "if(!securityLocked)" in app and "removeAttribute('inert')" in app and "document.body.classList.remove('security-locked')" in app)
add('Resume closes restored open dialogs without bypassing locked Identity', "document.querySelectorAll('dialog[open]')" in app and "if(securityLocked&&d.id?.startsWith('security'))return" in app)
add('Android coordinate pointer fallback present', "pointerInsideReturnShortcut" in ux and "addEventListener('pointerup'" in ux and "shortcut-pointer-fallback" in ux)
add('Return shortcut promoted above ordinary overlays', 'z-index:2147483000' in ucss and 'touch-action:manipulation' in ucss)

add('Active-case update remains actionable', "$('updateNowBtn').disabled=false" in pwa and 'Save case & update' in pwa)
add('Stale session lock can self-recover', 'recoverOrphanedSession' in session and 'if(isFresh(lock))return false' in session and 'coordinator.takeControl' in session)
add('Rescue service worker skips waiting', '.then(()=>self.skipWaiting())' in sw)
add('Rescue service worker claims clients', 'self.clients.claim()' in sw)
add('SW registration bypasses HTTP cache', "updateViaCache:'none'" in pwa and 'reg.update()' in pwa)

out={'version':release,'suite':'static-qa-active-case-state-repair','passed':sum(1 for x in checks if x['pass']),'total':len(checks),'checks':checks}
(ROOT/'STATIC_QA_V17_2_3.json').write_text(json.dumps(out,indent=2,ensure_ascii=False),encoding='utf-8')
print(json.dumps(out,indent=2,ensure_ascii=False))
if out['passed']!=out['total']:raise SystemExit(1)
