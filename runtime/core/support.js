/* ANESVET V15.13.0 — Support/report composer (no network backend). */
(function(root){
'use strict';
const SUPPORT_EMAIL='anesvetth@gmail.com';
const FACEBOOK_SEARCH='https://www.facebook.com/search/pages/?q=Anesvet';
const clean=(v,max=4000)=>v==null?'':String(v).trim().slice(0,max);
function buildReportText(report={}){
  const c=report.caseContext||{},d=report.device||{},x=report.diagnostics||{};
  const errors=Array.isArray(report.runtimeErrors)?report.runtimeErrors.slice(-3):[];
  const lines=[
    'ANESVET SUPPORT REPORT',
    `Report ID: ${clean(report.reportId)||'—'}`,
    `App version: V${clean(report.appVersion)||'—'}`,
    `Reporter: ${clean(report.reporter)||'—'}`,
    `Site: ${clean(report.site)||'—'}`,
    `Category: ${clean(report.category)||'—'}`,
    `Severity: ${clean(report.severity)||'—'}`,
    `Reproducible: ${clean(report.reproducible)||'—'}`,
    '',
    `Summary: ${clean(report.summary)||'—'}`,
    '',
    'What happened:',
    clean(report.description,6000)||'—',
    '',
    'Expected:',
    clean(report.expected,3000)||'—',
    '',
    'ANONYMIZED APP CONTEXT',
    `Tab / phase: ${clean(c.tab)||'—'} / ${clean(c.casePhase)||'—'}`,
    `Workflow: ${clean(c.workflowProfile)||'—'} • Species: ${clean(c.species)||'—'} • ASA: ${clean(c.asa)||'—'} • Emergency: ${c.emergency===true?'Yes':'No'}`,
    `Record counts: anesthesia ${Number(c.anesthesiaRecordCount)||0} • recovery ${Number(c.recoveryRecordCount)||0} • drugs ${Number(c.drugAdministrationCount)||0} • events ${Number(c.eventCount)||0} • complications ${Number(c.complicationCount)||0} • active alerts ${Number(c.activeAlertCount)||0}`,
    `Elapsed: ${Number(c.caseElapsedSec)||0} sec`,
    '',
    'DEVICE / APP',
    `Device/browser: ${clean(d.userAgent,1200)||'—'}`,
    `Platform: ${clean(d.platform)||'—'} • Viewport: ${clean(d.viewport)||'—'} • Screen: ${clean(d.screen)||'—'} • Touch: ${Number(d.touchPoints)||0}`,
    `Online: ${d.online===false?'No':'Yes'} • Standalone/PWA: ${d.standalone===true?'Yes':'No'} • Timezone: ${clean(d.timezone)||'—'}`,
    `OR menu: ${clean(x.orMenuProfile)||'—'} • OR focus: ${x.orFocusMode===false?'Off':'On'} • Save: ${clean(x.saveState)||'—'} • Connectivity: ${clean(x.connectivityState)||'—'}`,
  ];
  if(errors.length){
    lines.push('', 'RECENT APP ERRORS');
    for(const e of errors)lines.push(`- ${clean(e.message,500)}${e.source?` @ ${clean(e.source,180)}`:''}${e.line?`:${e.line}`:''}`);
  }
  lines.push('', 'Privacy: patient name, HN, microchip and owner information are not included automatically.');
  return lines.join('\n');
}
function emailUrl(report){
  const subject=`[ANESVET V${clean(report.appVersion,30)}][${clean(report.severity,30)||'report'}] ${clean(report.summary,120)||clean(report.reportId,60)||'Support report'}`;
  const body=buildReportText(report).slice(0,7500);
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
const api=Object.freeze({SUPPORT_EMAIL,FACEBOOK_SEARCH,buildReportText,emailUrl});
root.AnesvetSupport=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
