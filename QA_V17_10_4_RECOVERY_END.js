'use strict';const fs=require('fs'),R=__dirname,read=f=>fs.readFileSync(R+'/'+f,'utf8'),h=read('index.html'),r=read('recovery-controller.js'),x=read('recovery-end-refinement.js'),o=read('or-live-controller.js'),m=read('medication-workspace-controller.js');
const T=[
['Recovery phase strip',h.includes('id="recoveryCorePhaseStrip"')&&['monitor','review','complete','final'].every(k=>h.includes(`data-recovery-core="${k}"`))],
['Single visible recovery completion owner',h.includes('id="recoveryFocusCompleteBtn"')&&x.includes("recovery-legacy-hidden")],
['Legacy completion action retained',h.includes('id="completeRecoveryBtn"')&&r.includes("completeRecoveryBtn")],
['Readiness still controls completion',r.includes("if(r.ready){complete();return}")],
['Incomplete readiness override remains documented',r.includes("Reason for completing despite incomplete readiness (required)")&&r.includes("Completed by")],
['No auto complete in refinement',!x.includes('.click()')&&!x.includes('complete()')],
['Emergency Return retained',h.includes('id="emergencyReturnOrBtn"')&&r.includes("emergencyReturnToOr")],
['Recovery handoff retained',h.includes('id="recoveryHandoffPanel"')&&h.includes('id="recoveryHandoffCompact"')],
['Unresolved problems remain core',h.includes('id="recoveryProblemsPanel"')],
['Exit to End Case only prominent after completion',x.includes("recovery-exit-ready")&&x.includes("recoveryCompletedAt")],
['End Case guide retained',h.includes('id="endCaseNextTaskBtn"')&&h.includes('id="endCaseBlockers"')],
['Final Lock action retained',h.includes('id="endSaveArchiveBtn"')],
['Final archive verification retained',h.includes('id="finalArchiveAssurancePanel"')&&h.includes('id="finalArchiveVerifyBtn"')],
['Recovery navigation uses shared workspace owner',r.includes("ANESVET_WORKSPACE_OWNER?.openForElement")],
['Recovery scroll protected while editing',r.includes("ANESVET_MOBILE_OR_OWNER?.editing?.()")],
['OR End Surgery retained',h.includes('data-label="Surgery end"')&&o.includes("'surgery-end':{title:'End surgery?'")],
['Calculated-as-given retained',h.includes('id="orQuickDrugChangeActual"')&&m.includes('actual=changeActual||!hasCalculatedDefault')]
];let p=0;for(const [n,v] of T){console.log((v?'PASS':'FAIL')+'  '+n);if(v)p++}console.log(`\n${p}/${T.length} PASS`);process.exit(p===T.length?0:1);