'use strict';
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict'),{chromium}=require('playwright');
const root=path.resolve(process.argv[2]||path.join(__dirname,'../..'));let count=0;
const check=(label,ok)=>{assert.ok(ok,label);count++};
(async()=>{
 const server=http.createServer((req,res)=>{const u=decodeURIComponent(new URL(req.url,'http://local').pathname),f=path.join(root,u==='/'?'index.html':u);if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);res.end();return}res.setHeader('Content-Type',{'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'}[path.extname(f)]||'application/octet-stream');res.end(fs.readFileSync(f))});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{for(const [width,height] of [[320,844],[390,844],[430,932],[667,375],[1024,844]]){
 const ctx=await browser.newContext({viewport:{width,height},isMobile:width<768,hasTouch:true}),page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(12000);
 await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForFunction(()=>window.AnesvetApp&&!document.body.classList.contains('av-booting'));
 await page.evaluate(()=>AnesvetApp.setTab('start',{force:true}));await page.locator('#start [data-av-knowledge]').click();await page.waitForFunction(()=>document.getElementById('clinicalKnowledgeDialog')?.open);
 const before=await page.evaluate(()=>JSON.stringify(AnesvetApp.getState()));
 const evidence=path.join(root,'qa/evidence/KNOWLEDGE_LAYOUT_V17_14_19');fs.mkdirSync(evidence,{recursive:true});
 async function layout(label){
  const g=await page.evaluate(()=>{const d=document.getElementById('clinicalKnowledgeDialog'),b=document.getElementById('ckBody'),r=d.getBoundingClientRect(),c=getComputedStyle(b),br=b.getBoundingClientRect();
  return {left:parseFloat(c.paddingLeft),right:parseFloat(c.paddingRight),bottom:parseFloat(c.paddingBottom),overflow:d.scrollWidth>d.clientWidth+1||document.documentElement.scrollWidth>innerWidth+1,inside:[...b.querySelectorAll('input,select,button,details,.ck-list-item')].filter(e=>e.getClientRects().length).every(e=>{const q=e.getBoundingClientRect();return q.left>=br.left+parseFloat(c.paddingLeft)-1&&q.right<=br.right-parseFloat(c.paddingRight)+1}),title:document.getElementById('ckTitle').getBoundingClientRect().right<=r.right-8,close:document.getElementById('ckClose').getBoundingClientRect().right<=r.right-8};});
  check(width+' '+label+' reading gutters stay at least 16px on both sides',g.left>=16&&g.right>=16);
  check(width+' '+label+' no sideways page scrolling',!g.overflow);
  check(width+' '+label+' controls and expandable cards stay inside reading area',g.inside);
  check(width+' '+label+' reader does not inherit bottom navigation space',g.bottom<=40);
  check(width+' '+label+' title and close stay inside dialog',g.title&&g.close);
 }
 for(const tab of ['basics','drugs','guides','ecg','sources']){
  await page.locator('[data-ck-tab="'+tab+'"]').click();await layout(tab+' index');
  if(width===390)await page.screenshot({path:path.join(evidence,tab+'-index-390.png')});
  if(tab==='basics'){await page.locator('[data-ck-lesson="basics-equipment"]').click();await layout('lesson detail');}
  if(tab==='drugs'){await page.locator('[data-ck-select="propofol"]').click();await layout('drug detail');}
  if(tab==='guides'){await page.locator('[data-ck-select="hypotension"]').click();await layout('guide detail');}
  if(tab==='sources'){await page.locator('#ckBody .ck-entry').last().locator('summary').click();await layout('expanded reference');}
  if(width===390&&['basics','drugs','guides'].includes(tab)){await page.evaluate(()=>document.getElementById('clinicalKnowledgeDialog').scrollTop=0);await page.screenshot({path:path.join(evidence,tab+'-detail-390.png')});}
 }
 await page.locator('[data-ck-tab="basics"]').click();await page.addStyleTag({content:'.ck-body{font-size:20px}'});await layout('enlarged reading text');
 await page.locator('#ckClose').click();check(width+' read-only case unchanged',await page.evaluate(()=>JSON.stringify(AnesvetApp.getState()))===before);
 for(const route of ['more','preop']){
  await page.evaluate(route=>AnesvetApp.setTab(route,{force:true}),route);
  await page.locator(route==='more'?'#more [data-av-knowledge]':'#preopOpenBasicsBtn').click();await page.waitForFunction(()=>document.getElementById('clinicalKnowledgeDialog')?.open);await layout(route+' launcher');await page.locator('#ckClose').click();
 }
 check(width+' no browser errors',errors.length===0);await ctx.close();
 }}finally{await browser.close();await new Promise(r=>server.close(r))}console.log(count+'/'+count+' PASS');
})().catch(e=>{console.error(e);process.exitCode=1});
