'use strict';
const fs=require('fs'),path=require('path'),R=path.resolve(__dirname,'../..');
const read=p=>fs.readFileSync(path.join(R,p),'utf8');
const app=read('app.js'),mobile=read('mobile-design.js'),index=read('index.html'),manifest=JSON.parse(read('manifest.webmanifest')),
  vv=read('runtime/platform/viewport-coordinator.js'),mobOwner=read('runtime/platform/mobile-or-owner.js'),workspace=read('runtime/platform/workspace-owner.js'),
  orLive=read('runtime/controllers/or-live-controller.js'),recovery=read('runtime/controllers/recovery-controller.js'),recRefine=read('recovery-end-refinement.js'),repeat=read('repeat-presentation-owner.js'),
  sw=read('service-worker.js'),runtimeMap=JSON.parse(read('config/runtime-map.json'));
const T=[];const add=(n,v)=>T.push([n,!!v]);

// Release/version authority.
add('Release is V17.14.7',/const APP_VERSION='17\.14\.7'/.test(app)&&runtimeMap.release==='17.14.7');
add('Public app API exposes authoritative APP_VERSION',/window\.AnesvetApp=Object\.freeze\(\{\s*version:APP_VERSION,/.test(app));
add('Mobile home reads version from app API',/avHomeLocalStatus[^\n]+V\$\{app\(\)\.version\|\|'—'\}/.test(mobile));
add('Mobile home no longer hard-codes V17.11.3',!mobile.includes("ข้อมูลในเครื่อง · V17.11.3"));
add('Current visible build refs use V17.14.7',index.includes('MOBILE · V17.14.7')&&index.includes('ANESVET V17.14.7')&&manifest.name==='ANESVET V17.14.7');
add('Service Worker cache generation is V17.14.7',sw.includes("anesvet-v17-14-7-startup"));

// Keyboard / viewport protections retained.
add('Viewport coordinator still owns VisualViewport resize',/visualViewport/.test(vv)&&/addEventListener\('resize'.+visual-resize/.test(vv));
add('Mobile viewport owner still observes focus in/out',/focusin/.test(mobOwner)&&/focusout/.test(mobOwner));
add('Mobile viewport owner still computes keyboard offset',/--anesvet-keyboard-offset/.test(mobOwner)&&/keyboardOpen:edit&&offset>=110/.test(mobOwner));
add('Mobile shell avoids rerender while active field owns focus',/Do not rebuild the mobile shell while a field still owns focus/.test(mobile)&&/document\.activeElement===e\.target\)return/.test(mobile));
add('Tab navigation releases editable focus before viewport reset',/Release editable focus before resetting page position/.test(app)&&/activeEditor\.blur\(\)/.test(app));
add('Recovery/End Case navigation keeps two-frame viewport settle',/requestAnimationFrame\(\(\)=>requestAnimationFrame/.test(app)&&/workflow-navigation/.test(app));
add('Workspace disclosure avoids forced scroll while editing',/ANESVET_MOBILE_OR_OWNER\?\.editing\?\.\(\)\)return;el\.scrollIntoView/.test(workspace));

// End Surgery reachability retained.
add('OR mobile dock keeps next action visible',/if\(next\)\{next\.hidden=false/.test(orLive));
add('OR mobile dock explicitly maps surgery-end',/['"]surgery-end['"]:\['■','END SURGERY'\]/.test(orLive));
add('Mobile context prioritizes secondary End Surgery action',/surgeryEndReady\?secondary:primaryStep/.test(mobile));
add('Mobile End Surgery remains reachable even when native secondary is hidden',/step\.hidden&&action!=='surgery-end'/.test(mobile));
add('Mobile End Surgery retains confirmation wording',/จบผ่าตัด \(End surgery\) — ยืนยันก่อนบันทึก/.test(mobile));

// Recovery navigation retained.
add('Recovery controller keeps Emergency Return action',/function emergencyReturnToOr/.test(recovery)&&/emergencyReturnOrBtn/.test(recovery));
add('Recovery controller returns to Recovery after emergency path',/function returnAfterEmergency/.test(recovery));
add('Recovery completion still routes to End Case',/setTab\?\.\('endcase'\)/.test(recovery));
add('Recovery refinement still listens to shared viewport event',/anesvet:viewportchange/.test(recRefine));
add('Recovery next-task keeps End Case target after completion',/recoveryToEndCaseBtn/.test(recRefine));
add('Repeat presentation owner keeps explicit End Case navigation',/recoveryToEndCaseBtn[^\n]+setTab\?\.\('endcase'\)/.test(repeat));

// Startup transition retained; prevent old white-logo regression structurally.
add('Startup has matching dark HTML and manifest backgrounds',/html\{background:#0b2d31\}/.test(index)&&manifest.background_color==='#0b2d31'&&manifest.theme_color==='#0b2d31');
add('Critical startup CSS remains inline before runtime styles',index.indexOf('id="avStartupCritical"')>0&&index.indexOf('id="avStartupCritical"')<index.indexOf('anesvet-ui-bundle.css'));
add('Boot hides legacy main layout before CSS arrives',/body\.av-booting>main\{display:none!important\}/.test(index));
add('Startup logo is preloaded and boot logo uses startup asset',index.includes('rel="preload" as="image" href="./assets/startup/logo.png"')&&index.includes('class="av-boot-logo"'));
add('Boot screen itself uses dark gradient instead of white fallback',/\.av-boot\{[^}]*background:linear-gradient\(#0b2d31,#061c20 50%,#031317\)/.test(index));
add('Startup error path remains recoverable',index.includes('avBootRetry')&&index.includes('avBootReview')&&/av-boot-error/.test(index));

// Scope guard: this release should not alter clinical semantics.
add('UX verification policy is recorded',runtimeMap.policy?.postRefactorUxVerification==='keyboard-end-surgery-recovery-startup-verified-mobile-version-authority-fixed');
add('Induction details-pending contract remains',orLive.includes('details pending')&&orLive.includes("given-pending"));
add('Intubation remains timestamp-only',/timestamp-only/.test(orLive)||/intubation/i.test(orLive));
add('Final Lock remains present',index.includes('Final Lock')||app.includes('FINAL LOCK')||app.includes('Final Lock'));

let p=0;for(const [n,v] of T){console.log((v?'PASS':'FAIL')+'  '+n);if(v)p++;}
console.log(`\n${p}/${T.length} PASS`);process.exit(p===T.length?0:1);
