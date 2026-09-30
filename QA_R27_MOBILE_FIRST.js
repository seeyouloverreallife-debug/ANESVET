/* Standalone structural + isolated runtime tests for R27 mobile UX. */
'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert'),cp=require('child_process');
const dir=__dirname,read=x=>fs.readFileSync(path.join(dir,x),'utf8');
const html=read('index.html'),css=read('mobile-first-r27.css'),js=read('mobile-first-r27.js'),sw=read('service-worker.js'),app=read('app.js');
const checks=[];function test(name,run){try{run();checks.push({name,passed:true})}catch(e){checks.push({name,passed:false,error:e.message})}}
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
test('HTML IDs unique',()=>assert.equal(new Set(ids).size,ids.length));
test('R27 stylesheet last in the CSS stack',()=>assert(html.indexOf('repeat-use-r26.css?v=17.2.31')<html.indexOf('mobile-first-r27.css?v=17.2.31')));
test('R27 controller after R26 controller',()=>assert(html.indexOf('repeat-use-r26.js?v=17.2.31')<html.indexOf('mobile-first-r27.js?v=17.2.31')));
test('Version coherent in HTML, runtime and manifest',()=>{const m=JSON.parse(read('manifest.webmanifest'));assert(html.includes('<title>ANESVET V17.2.31</title>'));assert(app.includes("const APP_VERSION='17.2.31'"));assert(m.start_url==='./?v=17.2.31');assert(sw.includes('anesvet-v17-2-31-r27-mobile-first'))});
test('PWA precache assets all exist',()=>{const assets=JSON.parse(sw.match(/const ASSETS=(\[[^\n]+\]);/)[1]);for(const u of assets){const name=u.replace(/^\.\//,'').split('?')[0];if(name)assert(fs.existsSync(path.join(dir,name)),`Missing ${name}`)}});
test('PWA precache includes new responsive assets',()=>assert(sw.includes('./mobile-first-r27.js?v=17.2.31')&&sw.includes('./mobile-first-r27.css?v=17.2.31')));
test('Identity retains existing controller',()=>assert(js.includes('chip.click()')&&js.includes('workflow.close()')&&js.includes('id=\'mobileIdentityBtn\'')));
test('Identity does not directly change security or PIN values',()=>assert(!/(localStorage\.setItem|sessionStorage\.setItem|securityEnableBtn|securityUnlockBtn|securityResetPin)/.test(js)));
test('Save state not removed from header on mobile',()=>assert(css.includes('.topbar #saveState{display:inline-flex!important')));
test('Clinical alert elements still present',()=>assert(html.includes('id="patientRiskBanner"')&&html.includes('id="globalStatus"')));
test('Silent bug center remains available',()=>assert(html.includes('id="bootDiagnosticBtn"')));
test('Recovery and Final lock handlers still loaded',()=>assert(html.includes('recovery-controller.js')&&html.includes('finalization-archive-controller.js')));
test('Mobile buttons meet 44px minimum CSS target',()=>assert(css.includes('min-height:44px')&&css.includes('width:44px!important')));
test('Mobile form fields avoid iOS input zoom',()=>assert(css.includes('font-size:16px!important')));
test('Mobile 320px fallback',()=>assert(css.includes('@media (max-width:360px)')));
test('Mobile bottom sheet dynamic viewport-safe',()=>assert(css.includes('100dvh')&&css.includes('env(safe-area-inset-bottom)')));
test('Keyboard changes only mobile dock visibility',()=>assert(css.includes('body.r27-keyboard-open .mobile-quick-bar')));
test('Clinical core untouched in new controller',()=>assert(!/(save\(|state\.|casePhase\s*=|\.dose\s*=|\.disabled\s*=)/.test(js)));
test('No JS syntax errors (full file set)',()=>{const files=fs.readdirSync(dir).filter(x=>x.endsWith('.js'));for(const f of files){const p=cp.spawnSync(process.execPath,['--check',path.join(dir,f)],{encoding:'utf8'});assert.equal(p.status,0,`${f}: ${p.stderr.slice(0,220)}`)}});
function mock(){
 const elements=new Map(),callbacks={};let clicks=0;
 const child={textContent:''},small={textContent:''};
 const chip={textContent:'🔓 Identity off',dataset:{},attributes:{},setAttribute(k,v){this.attributes[k]=v},click(){clicks++}};
 const secondary={append(btn){elements.set(btn.id,btn)}};
 const workflow={open:true,close(){this.open=false},removeAttribute(){this.open=false},querySelector(sel){return sel==='.mobile-workflow-secondary'?secondary:null}};
 elements.set('securityIdentityChip',chip);elements.set('mobileWorkflowDialog',workflow);elements.set('mobileIdentityStatus',small);
 const document={getElementById:id=>elements.get(id)||null,createElement:()=>({id:'',type:'',className:'',innerHTML:'',events:{},addEventListener(n,f){this.events[n]=f},querySelector:sel=>sel==='.r27-identity-icon'?child:null}),activeElement:null,body:{classList:{values:new Set(),toggle(k,on){on?this.values.add(k):this.values.delete(k)}}},addEventListener(k,f){callbacks[k]=f}};
 const vv={height:844,addEventListener(k,f){callbacks['vv_'+k]=f}},window={innerHeight:844,visualViewport:vv,addEventListener(){}};
 let observer=null;class MutationObserver{constructor(fn){observer=fn}observe(){}}
 const context={document,window,MutationObserver,requestAnimationFrame:f=>f(),console};
 vm.runInNewContext(js,context);
 return {elements,document,window,vv,callbacks,chip,workflow,child,small,btn:elements.get('mobileIdentityBtn'),trigger:()=>observer(),clicks:()=>clicks};
}
test('Mobile Identity appears as one navigational action',()=>{const m=mock();assert(m.btn);assert.equal(m.btn.id,'mobileIdentityBtn')});
test('Identity action closes workflow sheet and forwards to real controller',()=>{const m=mock();m.btn.events.click();assert(!m.workflow.open);assert.equal(m.clicks(),1)});
test('Local Identity-off status communicated',()=>{const m=mock();assert.equal(m.chip.dataset.securityState,'off');assert(m.small.textContent.includes('ไม่เปิด'))});
test('Active user displays current staff identity',()=>{const m=mock();m.chip.textContent='👤 Dr Test';m.trigger();assert.equal(m.chip.dataset.securityState,'active');assert(m.small.textContent.includes('Dr Test'))});
test('Locked state indicated clearly without automatic unlock',()=>{const m=mock();m.chip.textContent='🔒 Locked';m.trigger();assert.equal(m.child.textContent,'🔒');assert.equal(m.clicks(),0)});
test('Virtual keyboard hides docks only while editing',()=>{const m=mock();m.document.activeElement={matches(){return true}};m.vv.height=500;m.callbacks.vv_resize();assert(m.document.body.classList.values.has('r27-keyboard-open'));m.vv.height=844;m.callbacks.vv_resize();assert(!m.document.body.classList.values.has('r27-keyboard-open'))});
const passed=checks.filter(x=>x.passed).length;const result={version:'17.2.31',checkpoint:'R27',scope:'Static validation + isolated mobile JS behavior; NOT real-device E2E',passed,total:checks.length,checks};fs.writeFileSync(path.join(dir,'R27_QA_RESULTS.json'),JSON.stringify(result,null,2)+'\n');
for(const c of checks)console.log(`${c.passed?'PASS':'FAIL'} ${c.name}${c.error?': '+c.error:''}`);
console.log(`RESULT ${passed}/${checks.length}`);process.exit(passed===checks.length?0:1);
