'use strict';
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict'),crypto=require('crypto'),{chromium}=require('playwright');
const R=path.resolve(__dirname,'../..'),D=require(path.join(R,'runtime/knowledge/clinical-knowledge-data.js'));let count=0;const check=(label,ok)=>{assert.ok(ok,label);count++};
check('six sequential lessons',D.basics.length===6&&new Set(D.basics.map(x=>x.id)).size===6);
check('source review date is explicit',D.basicsReview.reviewedAt==='2026-10-10'&&D.basicsReview.reviewStatus.includes('ผู้เชี่ยวชาญอิสระ'));
check('content is immutable',Object.isFrozen(D.basics)&&D.basics.every(Object.isFrozen));
for(const lesson of D.basics){
 check(lesson.id+' summary, diagram and checklist',lesson.summary.length>=2&&lesson.diagram.items.length>=2&&lesson.checklist.length>=2&&lesson.watch.length>=2&&lesson.sections.length===3);
 const claims=[...lesson.summary,...lesson.sections.flatMap(x=>x.claims),...lesson.watch,...lesson.checklist];
 check(lesson.id+' every clinical paragraph has registered evidence',claims.every(c=>c.text&&c.refs.length&&c.refs.every(r=>D.sources[r.source]?.url?.startsWith('https://')&&r.locator)));
 check(lesson.id+' links only to existing clinical guides',lesson.relatedGuides.every(id=>D.guides.some(g=>g.id===id)));
}
const prior=JSON.parse(JSON.stringify(D));delete prior.basics;delete prior.basicsReview;for(const key of Object.keys(prior.sources))if(key.startsWith('BASIC_'))delete prior.sources[key];
// The entire pre-existing dataset must retain its original clinical content.
const originalHash='04436e23bf797e6f87bb87c1021fba5ca283eab27720941ebd9ae73d716de817';check('all existing drugs, guides, ECG rules and source entries preserved',crypto.createHash('sha256').update(JSON.stringify(prior)).digest('hex')===originalHash);
async function run(){
 const server=http.createServer((req,res)=>{const u=decodeURIComponent(new URL(req.url,'http://local').pathname),f=path.join(R,u==='/'?'index.html':u);if(!f.startsWith(R+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);res.end();return}res.setHeader('Content-Type',{'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'}[path.extname(f)]||'application/octet-stream');res.end(fs.readFileSync(f))});await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{for(const width of [320,390,1024]){
 const ctx=await browser.newContext({viewport:{width,height:844},hasTouch:true,isMobile:width<768}),page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());page.setDefaultTimeout(12000);const ck=(label,ok)=>check(width+' '+label,ok);
 await page.goto(url);await page.waitForFunction(()=>window.AnesvetApp?.version==='17.14.14'&&!document.body.classList.contains('av-booting'));
 await page.evaluate(()=>{for(const[id,v]of[['patientName','QA Basics Education'],['species','cat'],['weight','3'],['patientProcedure','QA'],['procedure','QA'],['asa','II'],['anesthetist','QA']])document.getElementById(id).value=v;const s=AnesvetApp.getState();s.patientSaved=true;s.caseStartedAt=Date.now()-60000;s.casePhase='intraop';s.timer={elapsedMs:60000,running:false,startedEpoch:null};s.protocolSnapshot={version:'qa-synthetic',caseDrugPlan:[]};document.getElementById('reminderOn').checked=false;AnesvetApp.save();AnesvetApp.setTab('preop',{force:true})});await page.waitForTimeout(500);
 ck('knowledge stays lazy before opening',await page.evaluate(()=>!window.ANESVET_CLINICAL_KNOWLEDGE));
 const before=await page.evaluate(()=>JSON.stringify(AnesvetApp.getState()));
 await page.locator('#preopOpenBasicsBtn').tap();await page.waitForFunction(()=>document.getElementById('clinicalKnowledgeDialog')?.open&&document.querySelectorAll('[data-ck-lesson]').length===6);
 ck('Pre-check opens basics directly',await page.locator('[data-ck-tab="basics"]').getAttribute('aria-pressed')==='true');
 ck('all six chapters and five navigation tabs visible',await page.locator('#ckBody [data-ck-lesson]').count()===6&&await page.locator('[data-ck-tab]').count()===5);
 ck('education does not check off patient readiness',await page.locator('.ck-basics-intro').innerText().then(t=>t.includes('ไม่ยืนยันความพร้อม')));
 const evidence=path.join(R,'qa/evidence/BASICS_KNOWLEDGE_V17_14_14');fs.mkdirSync(evidence,{recursive:true});await page.screenshot({path:path.join(evidence,width+'-index.png')});
 await page.locator('#ckSearch').fill('งดอาหาร');
 ck('Thai search finds patient preparation',await page.locator('#ckBody [data-ck-lesson]').count()===1&&await page.locator('[data-ck-lesson="basics-preparation"]').isVisible());
 await page.locator('#ckSearch').fill('capnography');ck('English keyword finds monitoring',await page.locator('#ckBody [data-ck-lesson]').count()===1);
 await page.locator('#ckSearch').fill('QA missing lesson');ck('no match is explained',await page.locator('#ckBody').innerText().then(t=>t.includes('ไม่พบบทเรียน')));
 await page.locator('#ckSearch').fill('');await page.locator('[data-ck-lesson="basics-meaning"]').tap();
 for(let index=0;index<6;index++){
 const lesson=D.basics[index];
 ck('chapter '+(index+1)+' opens correct title',await page.locator('#ckLessonTitle').innerText()===lesson.title);
 ck('chapter '+(index+1)+' summary, watch-outs and checklist present',await page.locator('.ck-basics-summary').isVisible()&&await page.locator('.ck-basics-watch').count()===1&&await page.locator('.ck-basics-check').count()===1);
 ck('chapter '+(index+1)+' diagram accessible as text',await page.locator('.ck-basics-diagram').getAttribute('aria-label').then(x=>!!x)&&await page.locator('.ck-basics-diagram b').count()===lesson.diagram.items.length);
 ck('chapter '+(index+1)+' expandable content contains sources',await page.locator('.ck-basics-section').count()===3&&await page.locator('.ck-basics-section').first().locator('.ck-evidence').count()>=1);
 ck('chapter '+(index+1)+' has reviewed date and status',await page.locator('.ck-basics-lesson').innerText().then(t=>t.includes('2026-10-10')&&t.includes('ผู้เชี่ยวชาญอิสระ')));
 // Open all paragraphs so their layout, evidence and content can be inspected.
 await page.evaluate(()=>document.querySelectorAll('.ck-basics-section').forEach(e=>e.open=true));
 ck('chapter '+(index+1)+' fits dialog without horizontal scroll',await page.locator('#clinicalKnowledgeDialog').evaluate(e=>e.scrollWidth<=e.clientWidth+1)&&await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 if(index===0||index===3||index===5){await page.evaluate(()=>document.getElementById('clinicalKnowledgeDialog').scrollTop=0);await page.screenshot({path:path.join(evidence,width+'-lesson-'+(index+1)+'.png')})}
 if(index<5)await page.locator('.ck-basics-pagination [data-ck-lesson="'+D.basics[index+1].id+'"]').tap();
 }
 await page.locator('.ck-entry>summary').filter({hasText:'คู่มืออ่านต่อ'}).tap();await page.locator('[data-ck-guide="hypercapnia"]').tap();ck('related guide opens existing clinical decision tree',await page.locator('#ckDecisionTitle').count()===1);
 await page.locator('[data-ck-lesson="basics-monitoring"]').tap();ck('related guide returns to the same lesson',await page.locator('#ckLessonTitle').innerText()===D.basics[5].title);
 await page.locator('.ck-basics-pagination [data-ck-lesson="basics-medication"]').tap();ck('previous chapter navigation works',await page.locator('#ckLessonTitle').innerText()===D.basics[4].title);
 await page.locator('#ckBody [data-ck-back]').first().tap();ck('Back returns to basics index',await page.locator('.ck-basics-list [data-ck-lesson]').count()===6);
 // Keyboard activation and close-focus return must remain reachable.
 await page.locator('[data-ck-lesson="basics-assessment"]').focus();await page.keyboard.press('Enter');ck('keyboard opens lesson and moves focus to its heading',await page.locator('#ckLessonTitle').evaluate(e=>document.activeElement===e));
 await page.locator('#ckBody>.btn[data-ck-back]').tap();await page.locator('[data-ck-tab="guides"]').tap();ck('existing clinical guides remain available',await page.locator('[data-ck-select="hypotension"]').count()===1);await page.locator('[data-ck-select="hypotension"]').tap();ck('existing clinical decision tree still renders',await page.locator('#ckDecisionTitle').count()===1&&await page.locator('[data-tree-branch]').count()>0);
 await page.locator('[data-ck-tab="drugs"]').tap();ck('existing drug library remains available',await page.locator('[data-ck-select="propofol"]').count()===1);
 await page.locator('[data-ck-tab="ecg"]').tap();ck('ECG educational workflow still renders',await page.locator('#ckECGForm').count()===1);
 await page.locator('[data-ck-tab="sources"]').tap();ck('source register includes basics content review',await page.locator('#ckBody').innerText().then(t=>t.includes('2026-10-10.basics.1')&&t.includes('BASIC_MONITOR')));
 ck('source links use HTTPS and safe new-tab attributes',await page.locator('#ckBody a').evaluateAll(list=>list.length>0&&list.every(a=>a.href.startsWith('https://')&&a.target==='_blank'&&a.rel.includes('noopener'))));
 await page.locator('#ckClose').tap();ck('close returns to Pre-check launcher',await page.locator('#preopOpenBasicsBtn').evaluate(e=>document.activeElement===e));
 ck('entire case remains unchanged after lessons, search, ECG and sources',await page.evaluate(()=>JSON.stringify(AnesvetApp.getState()))===before);
 await page.evaluate(()=>AnesvetApp.setTab('start',{force:true}));await page.locator('#start [data-av-knowledge]').tap();ck('home knowledge entry opens basics',await page.locator('[data-ck-tab="basics"]').getAttribute('aria-pressed')==='true');await page.keyboard.press('Escape');ck('Escape closes modal',!await page.locator('#clinicalKnowledgeDialog').isVisible());
 // No content fetches are needed after the established lazy modules are loaded.
 await ctx.setOffline(true);await page.evaluate(()=>AnesvetApp.setTab('preop',{force:true}));await page.locator('#preopOpenBasicsBtn').tap();await page.locator('[data-ck-lesson="basics-equipment"]').tap();ck('loaded lessons work offline',await page.locator('#ckLessonTitle').innerText()===D.basics[3].title);await ctx.setOffline(false);
 ck('knowledge controls retain minimum touch targets',await page.locator('[data-ck-tab]').evaluateAll(list=>list.every(b=>b.getBoundingClientRect().height>=48)));
 ck('no browser errors',errors.length===0);await ctx.close();
 }}finally{await browser.close();await new Promise(r=>server.close(r))}console.log(count+'/'+count+' PASS');
}
run().catch(e=>{console.error(e);process.exitCode=1});
