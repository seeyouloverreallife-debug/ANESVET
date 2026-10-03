'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path');
const R=__dirname,read=f=>fs.readFileSync(path.join(R,f),'utf8');
const h=read('index.html'),own=read('presentation-ownership.js'),orw=read('or-workspace-restructure.js'),cs=read('clinical-simplicity.js'),pc=read('progressive-clinical-flow.js'),pp=read('patient-preop-simplification.js'),dr=read('drug-start-simplification.js'),rec=read('recovery-end-refinement.js'),ar=read('architecture-registry.js');
const scripts=[...h.matchAll(/<script[^>]+src=["']([^"']+)/g)].map(x=>x[1].split('?')[0]);
const idx=f=>scripts.findIndex(x=>x.endsWith(f));
const T=[];function test(n,v){T.push([n,!!v])}

test('Presentation ownership registry loads before canonical/legacy presentation modules',idx('presentation-ownership.js')>idx('workspace-owner.js')&&idx('presentation-ownership.js')<idx('or-workspace-restructure.js')&&idx('presentation-ownership.js')<idx('clinical-simplicity.js'));
test('OR LIVE canonical owner claimed',orw.includes("claim?.('orlive.layout','or-workspace-v17130')"));
test('Patient/Pre-op canonical owner claimed',pp.includes("claim?.('patient.layout','patient-preop-v17130')")&&pp.includes("claim?.('preop.layout','patient-preop-v17130')"));
test('Drug Plan canonical owner claimed',dr.includes("claim?.('drugs.layout','drug-start-v17130')"));
test('Recovery canonical owner claimed',rec.includes("claim?.('recovery.layout','recovery-end-v17130')"));
test('Legacy Clinical Simplicity asks ownership before OR mutation',cs.includes("canMutate?.('orlive.layout','clinical-simplicity')"));
test('Progressive patient layout delegates to canonical owner',pc.includes("canMutate?.('patient.layout','progressive-clinical-flow')"));
test('OR page receives stable layout contract',orw.includes("page.dataset.layoutContract='monitor-first-v17130'"));
test('Architecture diagnostics include presentation owners',ar.includes('presentationOwners:root.ANESVET_PRESENTATION_OWNERSHIP?.snapshot?.().owners'));
test('Device diagnostic exposes presentation ownership',h.includes('presentationOwners:window.ANESVET_PRESENTATION_OWNERSHIP?.snapshot?.().owners'));
test('Owner map artifact exists',fs.existsSync(path.join(R,'OWNER_MAP_V17_13_0.md')));
test('OR layout contract artifact exists',fs.existsSync(path.join(R,'OR_LIVE_LAYOUT_CONTRACT_V17_13_0.md')));

// Runtime semantics of the registry itself.
const ctx={window:{},Date};vm.createContext(ctx);vm.runInContext(own,ctx,{filename:'presentation-ownership.js'});const api=ctx.window.ANESVET_PRESENTATION_OWNERSHIP;
test('Ownership registry exports',!!api&&api.version==='17.13.0');
test('First owner claim succeeds',api.claim('test.zone','owner-a')===true);
test('Conflicting owner claim is denied',api.claim('test.zone','owner-b')===false&&api.ownerOf('test.zone')==='owner-a');
test('Owner may mutate its zone',api.canMutate('test.zone','owner-a')===true);
test('Non-owner cannot mutate owned zone',api.canMutate('test.zone','owner-b')===false);
test('Unclaimed zone remains backward-compatible',api.canMutate('legacy.zone','legacy-module')===true);

const pass=T.filter(x=>x[1]).length;for(const [n,v] of T)console.log(`${v?'PASS':'FAIL'}  ${n}`);console.log(`\n${pass}/${T.length} PASS`);process.exit(pass===T.length?0:1);
