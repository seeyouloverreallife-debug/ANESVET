from pathlib import Path
from html.parser import HTMLParser
import subprocess, json, re, hashlib
ROOT=Path(__file__).resolve().parent
checks=[]
def add(name, ok, detail=''):
    checks.append({'name':name,'pass':bool(ok),'detail':str(detail)})

# JS syntax
js=sorted(ROOT.glob('*.js'))
syntax_bad=[]
for f in js:
    r=subprocess.run(['node','--check',str(f)],capture_output=True,text=True)
    if r.returncode: syntax_bad.append({'file':f.name,'error':(r.stderr or r.stdout).strip()})
add('JavaScript syntax', not syntax_bad, f'{len(js)-len(syntax_bad)}/{len(js)} PASS' if not syntax_bad else syntax_bad)

# HTML IDs and refs
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
local_refs=[]; missing=[]
for ref in p.refs:
    if ref.startswith(('http:','https:','data:','#')): continue
    path=ref.split('?',1)[0].split('#',1)[0]
    if not path or path=='./':continue
    if path.startswith('./'):path=path[2:]
    local_refs.append(path)
    if not (ROOT/path).exists(): missing.append(path)
add('Local script/style references present', not missing, f'{len(local_refs)-len(missing)}/{len(local_refs)}')

# service worker asset paths
sw=(ROOT/'service-worker.js').read_text()
m=re.search(r'const ASSETS=(\[.*?\]);',sw,re.S)
assets=[]; sw_missing=[]
if m:
    try: assets=json.loads(m.group(1))
    except Exception as e: sw_missing=[f'ASSETS parse: {e}']
else: sw_missing=['ASSETS not found']
for ref in assets:
    path=ref.split('?',1)[0]
    if path in ('./',''):continue
    if path.startswith('./'):path=path[2:]
    if not (ROOT/path).exists(): sw_missing.append(path)
add('Service Worker assets present', not sw_missing, f'{len(assets)-(1 if "./" in assets else 0)}/{len(assets)-(1 if "./" in assets else 0)}' if not sw_missing else sw_missing)

# Version alignment
version='17.2.0'
app=(ROOT/'app.js').read_text(); sync=(ROOT/'sync-foundation.js').read_text(); trans=(ROOT/'sync-transport.js').read_text(); arch=(ROOT/'architecture-registry.js').read_text(); manifest=json.loads((ROOT/'manifest.webmanifest').read_text())
add('App version aligned', f"const APP_VERSION='{version}'" in app)
add('Sync Foundation version aligned', f"const VERSION='{version}'" in sync)
add('Sync Transport version aligned', f"const VERSION='{version}'" in trans)
add('Architecture Registry version aligned', f"const VERSION='{version}'" in arch)
add('Manifest version aligned', version in manifest.get('name','') and version in manifest.get('short_name','') and version in manifest.get('start_url',''))
add('Index version aligned', html.count('17.1.0')==0 and 'V17.2.0' in html)
add('Service Worker cache version aligned', 'anesvet-v17-2-0-backend-ready-sync-review' in sw and 'v=17.1.0' not in sw)
add('Sync Transport loads before Sync Foundation', html.find('sync-transport.js')>=0 and html.find('sync-transport.js')<html.find('sync-foundation.js'))

# Compatibility/safety invariants
backup=(ROOT/'backup-restore-controller.js').read_text(); security=(ROOT/'security-baseline.js').read_text()
add('DB_VERSION remains 2', 'const DB_VERSION=2;' in app)
add('backupSchema remains 3', 'const BACKUP_SCHEMA=3;' in backup)
add('identity registry schema remains 2', 'const SCHEMA=2, ITERATIONS=120000;' in security)
add('PIN PBKDF2 iterations retained', 'ITERATIONS=120000' in security and 'PBKDF2' in security)
add('Sync default remains disabled', 'enabled:false' in sync)
add('V17.1 durable queue key retained', "queue:'anesvet_v17_1_sync_queue_v1'" in sync)
add('Unresolved conflict creates case-level hold', 'openConflictCases()' in sync and "if(held.has(live.caseId))continue" in sync)
add('Conflict review explicitly does not resolve', 'reviewDoesNotResolve:true' in sync and "resolutionState:'manual-required'" in sync)
add('Remote pull is preview-only', 'previewRemoteChanges' in sync and 'applied:false' in sync)
add('No remote pull auto-apply path exposed', 'applyRemote' not in sync and 'applyPull' not in sync)
add('Strict clinical conflict types retained', all(x in sync for x in ["'final-signoff'","'final-lock'","'archive'","'clinical-void'"]))
add('Medication conflict policy retained', 'MEDICATION_CONFLICT' in sync and 'MEDICATION_TYPES' in sync)
add('Snapshot coalescing limited to case-snapshot', "const COALESCIBLE_TYPES=new Set(['case-snapshot'])" in sync)
add('Local save verifies before sync capture', app.find('Local save verification failed') < app.find('syncCaptureAfterLocalSave(reason)') and app.find('Verified safety checkpoint failed') < app.find('syncCaptureAfterLocalSave(reason)'))
add('Sync error remains non-blocking for clinical save', "console.warn('ANESVET sync foundation capture skipped'" in app)
add('administeredBy/documentedBy semantic separation retained', 'administeredBy' in app and 'documentedBy' in app)

# Transport contract
add('Provider-neutral HTTP adapter present', 'createHttpCanonicalAdapter' in trans and '/api/anesvet-sync/v1/' in trans)
add('Public HTTP rejected', 'Plain HTTP is allowed only for localhost/private LAN endpoints' in trans)
add('Capability handshake validates canonical endpoint', "x.protocol!==PROTOCOL" in trans and 'x.canonical!==true' in trans)
add('Operation IDs sent for idempotency', 'X-ANESVET-Operation-Ids' in trans)
add('Fault injection adapter present', 'createFaultInjectionAdapter' in trans and 'dropAckNext' in trans and 'failNext' in trans)
add('Architecture Registry includes transport and sync modules', 'ANESVET_SYNC_TRANSPORT' in arch and 'ANESVET_SYNC_FOUNDATION' in arch)

out={'version':version,'suite':'static-qa','passed':sum(1 for x in checks if x['pass']),'total':len(checks),'checks':checks}
print(json.dumps(out,indent=2,ensure_ascii=False))
if out['passed']!=out['total']: raise SystemExit(1)
