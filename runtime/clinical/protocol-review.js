(function(){
'use strict';

const REF=window.ANESVET_DOSE_REFERENCE||null;
const UNIT_BY_MODE={mgkg:'mg/kg',mcgkg:'ug/kg'};
const ROUTES=['IV','IO','IM','SC','PO'];

function normText(v){return String(v??'').trim().toLowerCase()}
function normUnit(v){return String(v||'').replace(/μ/g,'u').replace(/µ/g,'u').replace(/\s+/g,'').toLowerCase()}
function routeTokens(v){const u=String(v||'').toUpperCase();return ROUTES.filter(r=>new RegExp(`(^|[^A-Z])${r}([^A-Z]|$)`).test(u))}
function routeCompatible(protocolRoute,referenceRoute){
  const a=routeTokens(protocolRoute),b=routeTokens(referenceRoute);
  if(!a.length)return {ok:true,unknown:true,protocol:a,reference:b};
  if(!b.length)return {ok:true,unknown:true,protocol:a,reference:b};
  return {ok:a.some(x=>b.includes(x)),unknown:false,protocol:a,reference:b};
}
function extractDoseSegments(text){
  const s=String(text||'').replace(/[–—−]/g,'-').replace(/μ/g,'u').replace(/µ/g,'u');
  const out=[];
  const re=/(\d+(?:\.\d+)?)\s*(?:-\s*(\d+(?:\.\d+)?))?\s*(mg\/kg|ug\/kg)(\s*\/(?:min|h|hr|hour))?/ig;
  let m;
  while((m=re.exec(s))){
    const lo=Number(m[1]),hi=m[2]?Number(m[2]):lo,unit=normUnit(m[3]),rate=normText(m[4]).replace(/\s+/g,'');
    if(Number.isFinite(lo)&&Number.isFinite(hi))out.push({min:Math.min(lo,hi),max:Math.max(lo,hi),unit,rate,raw:m[0]});
  }
  return out;
}
function valueInSegment(value,seg){
  const eps=Math.max(1e-9,Math.abs(value)*1e-9);
  return value>=seg.min-eps&&value<=seg.max+eps;
}
function referenceSpecies(name){
  const r=REF?.get?.(name,'');if(!r)return [];
  const set=new Set();(r.allEntries||r.entries||[]).forEach(e=>(e.species||[]).forEach(s=>set.add(s)));
  return [...set];
}
function evaluate(item,{species=''}={}){
  const name=item?.name||item?.id||'',dose=Number(item?.dose),mode=String(item?.mode||'').toLowerCase(),route=String(item?.route||'');
  const ref=REF?.get?.(name,species)||REF?.get?.(name,'');
  const base={name:String(name),species:String(species||''),dose:Number.isFinite(dose)?dose:null,mode,route,reference:ref,status:'no-reference',severity:'info',label:'NO REFERENCE',detail:'No loaded dose reference for this medication.',matches:[],eligible:[]};
  if(!ref||!(ref.entries||[]).length)return base;
  if(!(Number.isFinite(dose)&&dose>0))return {...base,status:'not-set',severity:'info',label:'DOSE NOT SET',detail:'Protocol dose is blank; no numeric comparison performed.'};
  const expectedUnit=UNIT_BY_MODE[mode];
  if(!expectedUnit)return {...base,status:'not-comparable',severity:'info',label:'NOT COMPARABLE',detail:`Calculation mode ${mode||'unknown'} is not a direct mg/kg or μg/kg dose.`};
  const expected=normUnit(expectedUnit);
  const entries=(ref.entries||[]).map((e,index)=>{
    const segments=extractDoseSegments(e.dose).filter(s=>s.unit===expected&&!s.rate);
    const routeCheck=routeCompatible(route,e.route);
    const supports=segments.some(s=>valueInSegment(dose,s));
    return {entry:e,index,segments,routeCheck,supports,comparable:segments.length>0};
  });
  const comparable=entries.filter(x=>x.comparable);
  if(!comparable.length){
    const hasRate=(ref.entries||[]).some(e=>extractDoseSegments(e.dose).some(s=>s.unit===expected&&s.rate));
    return {...base,status:'not-comparable',severity:'info',label:'NOT COMPARABLE',detail:hasRate?'Loaded reference uses a rate (e.g. per min/hour) while this protocol field is a bolus-style dose.':'Loaded references do not use the same direct dose unit.'};
  }
  const eligible=comparable.filter(x=>x.routeCheck.ok),routeMismatch=comparable.filter(x=>!x.routeCheck.ok);
  if(!eligible.length&&route&&routeMismatch.length){
    return {...base,status:'route-mismatch',severity:'warn',label:'ROUTE MISMATCH',detail:`Protocol route ${route} does not match the loaded comparable reference route(s).`,eligible:comparable};
  }
  const pool=eligible.length?eligible:comparable;
  const matches=pool.filter(x=>x.supports),primary=pool.find(x=>x.entry.primary),primarySupports=!!primary?.supports;
  if(primarySupports){
    return {...base,status:'within-primary',severity:'good',label:'WITHIN PRIMARY',detail:'Protocol dose is within the loaded primary reference for this species/context.',matches,eligible:pool};
  }
  if(matches.length){
    return {...base,status:'supported-alternative',severity:'note',label:'SUPPORTED — CHECK CONTEXT',detail:'Dose is supported by a loaded alternative reference, but not by the current primary reference. Verify intended indication/route/context.',matches,eligible:pool};
  }
  const primaryText=primary?`${primary.entry.dose} ${primary.entry.route||''} • ${primary.entry.context||''}`:'';
  return {...base,status:'outside-reference',severity:'warn',label:'OUTSIDE LOADED REFERENCE',detail:primaryText?`No compatible loaded reference contains ${dose} ${expectedUnit}. Primary: ${primaryText}`:`No compatible loaded reference contains ${dose} ${expectedUnit}.`,matches:[],eligible:pool};
}
function fnv1a(str){let h=0x811c9dc5;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,0x01000193)}return ('00000000'+(h>>>0).toString(16)).slice(-8)}
function fingerprint(payload){return fnv1a(JSON.stringify(payload||null))}
function summarize(results){
  const all=(results||[]).flatMap(r=>Array.isArray(r.speciesResults)?r.speciesResults:[r]);
  const count=status=>all.filter(x=>x.status===status).length;
  const warnings=all.filter(x=>x.severity==='warn').length;
  const notes=all.filter(x=>x.severity==='note').length;
  const good=all.filter(x=>x.severity==='good').length;
  const info=all.filter(x=>x.severity==='info').length;
  return {total:all.length,warnings,notes,good,info,withinPrimary:count('within-primary'),supportedAlternative:count('supported-alternative'),outsideReference:count('outside-reference'),routeMismatch:count('route-mismatch'),notComparable:count('not-comparable'),noReference:count('no-reference'),notSet:count('not-set')};
}

window.ANESVET_PROTOCOL_REVIEW=Object.freeze({version:'15.27.0',evaluate,referenceSpecies,extractDoseSegments,routeCompatible,fingerprint,summarize});
})();
