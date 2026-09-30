#!/usr/bin/env python3
"""Checkpoint R02 release checks; set --baseline to extracted R01 folder when comparing parity."""
import hashlib, json, re, subprocess, sys
from html.parser import HTMLParser
from pathlib import Path
root=Path(__file__).resolve().parent
base_arg=sys.argv[1] if len(sys.argv)>1 else None
baseline=Path(base_arg).resolve() if base_arg else None

expected={
 'QA_R01_PATIENT_ASA_BINDING.js':3,
 'QA_INTERACTION_GATE_V17_2_4.js':6,
 'QA_ACTIVE_CASE_RESCUE_V17_2_3.js':7,
 'QA_MOBILE_RESCUE_V17_2_2.js':3,
 'QA_SYNC_FOUNDATION_V17_1_0.js':17,
 'QA_SYNC_SAFETY_V17_2_0.js':19,
 'QA_BOOT_RUNTIME_V17_2_6.js':13,
 'QA_R02_MOBILE_DIAGNOSTIC.js':10,
}
for f,count in expected.items():
 p=subprocess.run(['node',str(root/f)],cwd=root,capture_output=True,text=True,timeout=30)
 if p.returncode:
  print(p.stdout,p.stderr);raise SystemExit(f'FAIL suite {f}')
 print(f'PASS {f}: {count} checks')

js=list(root.glob('*.js'))
for f in js:
 p=subprocess.run(['node','--check',str(f)],capture_output=True,text=True,timeout=10)
 if p.returncode:raise SystemExit(f'FAIL syntax {f.name}: {p.stderr}')
print(f'PASS JavaScript syntax: {len(js)} files')

class IDParser(HTMLParser):
 def __init__(self):super().__init__();self.ids=[]
 def handle_starttag(self,tag,attrs):
  for k,v in attrs:
   if k=='id':self.ids.append(v)
p=IDParser();p.feed((root/'index.html').read_text())
if len(p.ids)!=len(set(p.ids)):raise SystemExit('FAIL duplicated HTML ids')
print(f'PASS HTML IDs: {len(p.ids)} unique')

index=(root/'index.html').read_text()
refs=re.findall(r'(?:src|href)="\./([^"#]+)"',index)
for ref in refs:
 if not (root/ref.split('?')[0]).exists():raise SystemExit(f'FAIL missing index ref {ref}')
print(f'PASS HTML local refs: {len(refs)}')

sw=(root/'service-worker.js').read_text()
assets=json.loads(re.search(r'const ASSETS=(\[.*?\]);',sw).group(1))
for asset in assets:
 file=asset.split('?')[0].removeprefix('./')
 if file and not (root/file).exists():raise SystemExit(f'FAIL missing service worker ref {asset}')
print(f'PASS service worker asset refs: {len(assets)}')
assert 'anesvet-v17-2-6-r02-mobile-diagnostic' in sw
assert "const APP_VERSION='17.2.6'" in (root/'app.js').read_text()
assert 'ANESVET V17.2.6' in index
print('PASS release version and SW cache busting')

# Preserves source parity with R01 except version shell and sentinel.
parity=None
if baseline:
 old={p.relative_to(baseline):p for p in baseline.rglob('*') if p.is_file()}
 unchanged=[];changed=[];missing=[]
 for rel,oldp in old.items():
  nowp=root/rel
  if not nowp.exists():missing.append(str(rel))
  elif hashlib.sha256(oldp.read_bytes()).digest()==hashlib.sha256(nowp.read_bytes()).digest():unchanged.append(str(rel))
  else:changed.append(str(rel))
 permitted={'index.html','app.js','service-worker.js','manifest.webmanifest'}
 if missing or set(changed)!=permitted:raise SystemExit('FAIL source parity: missing='+str(missing)+' unexpected changed='+str(set(changed)-permitted)+' absent expected='+str(permitted-set(changed)))
 # app.js only contains the version constant change
 assert (root/'app.js').read_text().replace("const APP_VERSION='17.2.6'","const APP_VERSION='17.2.5'")== (baseline/'app.js').read_text()
 parity={'baseline_file_count':len(old),'unchanged_count':len(unchanged),'changed':changed,'missing':missing,'app_js_only_version_change':True}
 print(f'PASS source parity: {len(unchanged)}/{len(old)} unchanged, only {len(changed)} approved shell files changed')

results={'checkpoint':'R02','version':'17.2.6','suites':{f:count for f,count in expected.items()},'test_pass':sum(expected.values())+len(js),'test_total':sum(expected.values())+len(js),'js_syntax_files':len(js),'html_ids':len(p.ids),'index_local_refs':len(refs),'service_worker_refs':len(assets),'source_parity':parity,'real_device_verified':False,'main_interaction_incident_resolved':False}
(root/'QA_R02_RESULTS.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
print('SUMMARY',json.dumps({'test_pass':results['test_pass'],'test_total':results['test_total'],'parity':parity},ensure_ascii=False))
