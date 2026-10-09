'use strict';
// Uses the shipped HTML, CSS, workspace builder and controller in a real browser.
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const http=require('http');
const {chromium}=require('playwright');
const R=path.resolve(__dirname,'../..'),read=f=>fs.readFileSync(path.join(R,f),'utf8');
async function run(){
  const browser=await chromium.launch({channel:'msedge',headless:true});
  let checks=0;
  const check=(label,ok)=>{assert.ok(ok,label);console.log('PASS '+label);checks++};
  try{
    for(const width of [390,1024]){
      const page=await browser.newPage({viewport:{width,height:844},hasTouch:true});
      const errors=[];page.on('pageerror',e=>errors.push(e.message));
      await page.setContent(read('index.html').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<link\b[^>]*>/gi,''));
      await page.evaluate(()=>{
        const or=document.getElementById('orlive'),master=document.getElementById('ventilation');
        document.body.replaceChildren(or);document.body.className='';or.classList.add('active');
        if(master){const holder=document.createElement('div');holder.hidden=true;holder.append(master);or.append(holder)}
      });
      await page.addStyleTag({content:read('assets/css/anesvet-ui-bundle.css')});
      await page.addStyleTag({content:read('assets/css/or-workspace-restructure.css')});
      await page.addScriptTag({content:read('runtime/controllers/or-live-controller.js')});
      await page.evaluate(()=>{
        window.testState={caseStartedAt:1,casePhase:'intraop',caseLocked:false,records:[],events:[],timer:{elapsedMs:1,running:false},protocolSnapshot:{caseDrugPlan:[{id:'mel',name:'Meloxicam',phase:'post',route:'SC',conc:5,concUnit:'mg/mL'},{id:'standby',name:'Emergency standby',phase:'emergency',standby:true}]},drugAdministrations:[],inductionProvisionalAdministrations:[]};
        window.savedFields={};window.openedDrug=null;
        const persist=()=>{for(const id of ['airwayVentMode','orVentilation','ventilation','airwayVentRr','airwayPip','airwayPeep','airwayVt'])window.savedFields[id]=document.getElementById(id)?.value};
        window.ANESVET_OR_LIVE_INSTANCE=window.ANESVET_OR_LIVE_CONTROLLER.create({$:id=>document.getElementById(id),$$:s=>[...document.querySelectorAll(s)],getState:()=>window.testState,workflow:{},procedureTemplates:{},save:persist,scheduleAutosave:persist,openOrQuickDrug:opts=>{window.openedDrug=opts}});
      });
      await page.addScriptTag({content:read('or-workspace-restructure.js')});
      await page.locator('[data-or-workspace="vent"]').click();
      await page.locator('[data-vent-mode="Mechanical ventilation"]').tap();
      check(width+' Mechanical tap updates canonical mode',await page.locator('#airwayVentMode').inputValue()==='Mechanical ventilation');
      check(width+' Mechanical displays editable fields',await page.locator('#airwayVentRr').isVisible()&&await page.locator('#airwayPip').isVisible()&&await page.locator('#airwayVt').isVisible());
      await page.waitForFunction(()=>document.activeElement?.id==='airwayVentRr');
      check(width+' RR receives focus',true);
      for(const [id,value] of [['airwayVentRr','12'],['airwayPip','14'],['airwayPeep','3'],['airwayVt','30']])await page.locator('#'+id).fill(value);
      await page.evaluate(()=>window.ANESVET_OR_LIVE_INSTANCE.renderAirwayPanel());
      check(width+' rerender keeps fields visible and saved',await page.locator('#airwayVt').isVisible()&&await page.evaluate(()=>savedFields.airwayVt==='30'&&savedFields.airwayVentRr==='12'&&savedFields.ventilation==='Mechanical ventilation'&&savedFields.orVentilation==='Mechanical ventilation'));
      await page.locator('[data-vent-mode="Spontaneous"]').tap();
      check(width+' Spontaneous hides settings',!await page.locator('#airwayVentRr').isVisible());
      await page.locator('[data-vent-mode="Manual PPV"]').tap();
      check(width+' Manual PPV opens settings and retains values',await page.locator('#airwayVentRr').isVisible()&&await page.locator('#airwayVt').inputValue()==='30');
      await page.locator('[data-or-workspace="meds"]').tap();
      await page.evaluate(()=>window.ANESVET_OR_LIVE_INSTANCE.renderOrMedicationQueue());
      check(width+' later-only Meloxicam remains visible',await page.locator('#orMedicationQueueList').isVisible()&&await page.locator('.or-medication-queue-row').filter({hasText:'Meloxicam'}).isVisible());
      check(width+' phase label retained and no standby suggestion',await page.locator('#orMedicationQueueList').innerText().then(t=>t.includes('post')&&t.includes('PLANNED')&&!t.includes('Emergency standby')));
      await page.locator('.or-medication-record-btn').tap();
      check(width+' Record opens selected planned medication without recording automatically',await page.evaluate(()=>openedDrug.drugId==='mel'&&openedDrug.phase==='post'&&openedDrug.purpose==='planned'&&testState.drugAdministrations.length===0));
      check(width+' future-phase medication is not auto-next',!await page.locator('#orMedicationQueueNextBtn').isVisible());
      await page.evaluate(()=>{testState.protocolSnapshot.caseDrugPlan=Array.from({length:8},(_,i)=>({id:'p'+i,name:'Planned '+i,phase:i<5?'pre':'post'}));ANESVET_OR_LIVE_INSTANCE.renderOrMedicationQueue()});
      check(width+' all pending planned rows visible',await page.locator('.or-medication-record-btn').count()===8);
      await page.evaluate(()=>{testState.protocolSnapshot.caseDrugPlan=[];ANESVET_OR_LIVE_INSTANCE.renderOrMedicationQueue()});
      check(width+' no unplanned medication invented',!await page.locator('#orMedicationQueue').isVisible());
      await page.evaluate(()=>{testState.protocolSnapshot.caseDrugPlan=[{id:'mel',name:'Meloxicam',phase:'post'}];testState.caseLocked=true;ANESVET_OR_LIVE_INSTANCE.renderOrMedicationQueue()});
      check(width+' locked case hides actionable queue',!await page.locator('#orMedicationQueue').isVisible());
      check(width+' no browser errors',errors.length===0);
      await page.close();
    }
    const server=http.createServer((req,res)=>{
      const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=path.join(R,name==='/'?'index.html':name);
      if(!file.startsWith(R+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return}
      const type={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml'}[path.extname(file)]||'application/octet-stream';
      res.writeHead(200,{'Content-Type':type});res.end(fs.readFileSync(file));
    });
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
    const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true});
    try{
      const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
      await page.goto('http://127.0.0.1:'+server.address().port+'/');
      await page.waitForFunction(()=>window.AnesvetApp?.version==='17.14.8'&&!document.body.classList.contains('av-booting'));
      check('Full application starts with current release',true);
      await page.evaluate(()=>AnesvetApp.setTab('orlive',{force:true}));
      await page.locator('[data-or-workspace="vent"]').tap();
      await page.locator('[data-vent-mode="Mechanical ventilation"]').tap();
      await page.locator('#airwayVentRr').fill('12');await page.locator('#airwayVt').fill('30');
      await page.evaluate(()=>AnesvetApp.save({reason:'qa-vent'}));
      check('Full application saves ventilation controls',await page.evaluate(()=>AnesvetApp.getState().airwayVentMode==='Mechanical ventilation'&&String(AnesvetApp.getState().airwayVt)==='30'));
      await page.reload();
      await page.waitForFunction(()=>window.AnesvetApp?.version==='17.14.8'&&!document.body.classList.contains('av-booting'));
      check('Ventilation persists across full application reload',await page.locator('#airwayVentMode').inputValue()==='Mechanical ventilation'&&await page.locator('#airwayVt').inputValue()==='30'&&await page.locator('#airwayVentRr').inputValue()==='12');
      await page.waitForFunction(async()=>!!(await caches.open('anesvet-v17-14-8-startup')).match('./index.html'));
      check('Current service worker cache is installed',true);
      await page.evaluate(()=>{
        const s=AnesvetApp.getState();s.caseStartedAt=Date.now();s.casePhase='intraop';s.species='cat';s.weight=3;s.patientSaved=true;
        document.getElementById('species').value='cat';document.getElementById('weight').value='3';
        // Synthetic plan, without a dose recommendation or actual administration.
        s.protocolSnapshot={version:'qa-synthetic',caseDrugPlan:[{id:'meloxicamDose',name:'Meloxicam',phase:'post',mode:'manual',route:'SC',conc:5,concUnit:'mg/mL'}]};
        AnesvetApp.save({reason:'qa-synthetic-plan'});AnesvetApp.setTab('orlive',{force:true});ANESVET_OR_LIVE_INSTANCE.renderOrMedicationQueue();
      });
      await page.locator('[data-or-workspace="meds"]').tap();
      check('Full mobile shell keeps planned medication accessible',await page.locator('.or-medication-record-btn').isVisible()&&await page.locator('#avMedicationDetails').count()===0);
      await page.locator('.or-medication-record-btn').tap();
      await page.waitForFunction(()=>document.getElementById('orQuickDrugDialog').open);
      check('Full application opens Meloxicam administration editor',await page.locator('#orQuickDrugDialog').evaluate(el=>el.open)&&await page.locator('#orQuickDrugSelect option:checked').innerText().then(t=>t.includes('Meloxicam')));
      check('Editor preserves selected plan route and requires explicit administration',await page.locator('#orQuickDrugRoute').inputValue()==='SC'&&await page.evaluate(()=>AnesvetApp.getState().drugAdministrations.length===0));
      check('Full application has no browser errors',errors.length===0);
    }finally{await context.close();await new Promise(resolve=>server.close(resolve))}
  }finally{await browser.close()}
  console.log(checks+'/'+checks+' PASS');
}
run().catch(e=>{console.error(e);process.exitCode=1});
