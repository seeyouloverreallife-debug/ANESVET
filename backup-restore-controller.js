/* ANESVET V16.19.0 — Backup / Restore Controller + Data Safety 2.0
   Adds whole-backup integrity manifests, backup history, off-device copy receipts,
   backup-file verification, and post-restore verification. Clinical record semantics,
   final-lock rules, and IndexedDB schema remain unchanged. */
(function(root){
'use strict';
const VERSION='17.0.0';
const BACKUP_SCHEMA=3;
const HISTORY_KEY='anesvet_v16_19_backup_history';
const RESTORE_VERIFY_KEY='anesvet_v16_19_last_restore_verification';
const HISTORY_LIMIT=50;

function create(ctx={}){
  const $=ctx.$;
  const toast=ctx.toast||(()=>{});
  if(!$||typeof ctx.getState!=='function')return null;
  const keys=ctx.keys||{};
  const procedureTemplates=ctx.procedureTemplates||null;
  const localStorage=root.localStorage;

  const getArchiveBackend=()=>ctx.getArchiveBackend?.()||'initializing';
  const getPatientBackend=()=>ctx.getPatientBackend?.()||'initializing';
  const getArchive=()=>ctx.getArchive?.()||[];
  const getPatients=()=>ctx.getPatients?.()||[];
  const deepClone=v=>v==null?v:JSON.parse(JSON.stringify(v));

  function getLastBackupEpoch(){
    const candidates=[keys.lastBackup,'anesvet_v14_2_last_backup','anesvet_v14_1_last_backup','anesvet_v14_last_backup','anesvet_v13_4_last_backup'].filter(Boolean);
    for(const key of candidates){
      const n=Number(localStorage.getItem(key)||0);
      if(Number.isFinite(n)&&n>0){
        if(key!==keys.lastBackup&&keys.lastBackup)localStorage.setItem(keys.lastBackup,String(n));
        return n;
      }
    }
    return 0;
  }

  function formatBytes(n){
    if(!Number.isFinite(Number(n)))return '—';
    n=Number(n);
    if(n<1024)return `${n} B`;
    if(n<1024**2)return `${(n/1024).toFixed(1)} KB`;
    if(n<1024**3)return `${(n/1024**2).toFixed(1)} MB`;
    return `${(n/1024**3).toFixed(2)} GB`;
  }

  async function renderBackupHealth(){
    if($('dbBackendHealth'))$('dbBackendHealth').textContent=getArchiveBackend();
    if($('archiveCountHealth'))$('archiveCountHealth').textContent=String(getArchive().length);
    const last=getLastBackupEpoch(),age=last?Date.now()-last:null;
    if($('backupLastTime'))$('backupLastTime').textContent=last?`${ctx.formatDate?.(last)||''} ${ctx.formatClock?.(last)||''}`:'Never';
    if($('backupAgeStatus')){
      const days=age==null?null:Math.floor(age/86400000);
      $('backupAgeStatus').textContent=days==null?'Backup recommended':days>=7?`⚠ ${days} days ago`:days===0?'✓ Today':`✓ ${days} day${days===1?'':'s'} ago`;
      $('backupAgeStatus').className=days==null||days>=7?'health-warn':'health-good';
    }
    try{
      if(root.navigator?.storage?.estimate){
        const e=await root.navigator.storage.estimate();
        if($('storageUsedHealth'))$('storageUsedHealth').textContent=formatBytes(e.usage);
        if($('storageQuotaHealth'))$('storageQuotaHealth').textContent=e.quota?`of ${formatBytes(e.quota)} browser quota`:'Browser estimate';
      }
    }catch(e){}
    try{root.AnesvetDataResilience?.renderHealth?.()}catch(e){}
    try{root.ANESVET_DATA_SAFETY_2?.render?.()}catch(e){}
  }

  function stableValue(v){
    if(Array.isArray(v))return v.map(stableValue);
    if(v&&typeof v==='object'){
      const out={};for(const k of Object.keys(v).sort())out[k]=stableValue(v[k]);return out;
    }
    return v;
  }
  function stableJson(v){return JSON.stringify(stableValue(v))}
  async function sha256Text(text){
    if(typeof ctx.sha256Text==='function')return await ctx.sha256Text(String(text));
    if(root.crypto?.subtle){
      const bytes=new TextEncoder().encode(String(text));
      const hash=await root.crypto.subtle.digest('SHA-256',bytes);
      return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,'0')).join('');
    }
    if(typeof require==='function')return require('crypto').createHash('sha256').update(String(text)).digest('hex');
    throw new Error('SHA-256 is unavailable in this runtime');
  }
  function sortByIdentity(rows,keysToTry){
    return (Array.isArray(rows)?rows:[]).map(deepClone).sort((a,b)=>{
      const key=x=>keysToTry.map(k=>String(x?.[k]??'')).find(Boolean)||stableJson(x);
      return key(a).localeCompare(key(b));
    });
  }
  function clinicalDataset(raw){
    return {
      current:deepClone(raw?.current||{}),
      archive:sortByIdentity(raw?.archive||[],['caseId','humanRecordId','archivedAt']),
      patients:sortByIdentity(raw?.patients||[],['patientId','hospitalId','patientName'])
    };
  }
  function payloadForDigest(raw){const c=deepClone(raw||{});if(c)delete c.integrityManifest;return c}
  async function createIntegrityManifest(payload){
    const source=payloadForDigest(payload);
    return {
      version:1,algorithm:'SHA-256',generatedAt:Date.now(),
      payloadDigest:await sha256Text(stableJson(source)),
      clinicalDigest:await sha256Text(stableJson(clinicalDataset(source))),
      counts:{archive:Array.isArray(source.archive)?source.archive.length:0,patients:Array.isArray(source.patients)?source.patients.length:0,locked:(source.archive||[]).filter(c=>c?.caseLocked).length},
      currentCaseId:source.current?.caseId||''
    };
  }
  async function ensureIntegrityManifest(payload){
    if(!payload||typeof payload!=='object')throw new Error('Invalid backup payload');
    if(!payload.integrityManifest||payload.backupSchema!==BACKUP_SCHEMA){
      payload.backupSchema=BACKUP_SCHEMA;
      payload.integrityManifest=await createIntegrityManifest(payload);
    }
    return payload;
  }

  async function verifyBackupPayloadIntegrity(raw){
    const cases=[...(Array.isArray(raw?.archive)?raw.archive:[]),...(raw?.current?.caseLocked?[raw.current]:[])],out={locked:0,verifiable:0,valid:0,mismatch:0,unverifiable:0,details:[],payload:{available:false,valid:null,expected:'',actual:'',algorithm:''},clinical:{available:false,valid:null,expected:'',actual:''}};
    for(const c of cases){
      if(!c?.caseLocked)continue;
      out.locked++;
      if(!c.finalChecksum){out.unverifiable++;out.details.push(`${c.humanRecordId||c.caseId||'case'}: no checksum`);continue}
      const alg=String(c.checksumAlgorithm||'').toUpperCase();
      if(alg&&alg!=='SHA-256'&&!String(c.finalChecksum).startsWith('FNV1A-')){out.unverifiable++;out.details.push(`${c.humanRecordId||c.caseId||'case'}: unsupported ${alg}`);continue}
      if(String(c.finalChecksum).startsWith('FNV1A-')){out.unverifiable++;continue}
      out.verifiable++;
      const got=await ctx.computeCaseChecksum?.(c);
      if(String(got).toUpperCase()===String(c.finalChecksum).toUpperCase())out.valid++;
      else{out.mismatch++;out.details.push(`${c.humanRecordId||c.caseId||'case'}: checksum mismatch`)}
    }
    const m=raw?.integrityManifest;
    if(m?.payloadDigest&&String(m.algorithm||'').toUpperCase()==='SHA-256'){
      out.payload.available=true;out.payload.algorithm='SHA-256';out.payload.expected=String(m.payloadDigest);
      try{out.payload.actual=await sha256Text(stableJson(payloadForDigest(raw)));out.payload.valid=out.payload.actual.toUpperCase()===out.payload.expected.toUpperCase();if(!out.payload.valid)out.details.push('Backup file digest mismatch')}catch(e){out.payload.valid=false;out.details.push('Backup file digest could not be verified')}
    }
    if(m?.clinicalDigest){
      out.clinical.available=true;out.clinical.expected=String(m.clinicalDigest);
      try{out.clinical.actual=await sha256Text(stableJson(clinicalDataset(raw)));out.clinical.valid=out.clinical.actual.toUpperCase()===out.clinical.expected.toUpperCase();if(!out.clinical.valid)out.details.push('Clinical dataset digest mismatch')}catch(e){out.clinical.valid=false;out.details.push('Clinical dataset digest could not be verified')}
    }
    return out;
  }

  function backupUuid(){return root.crypto?.randomUUID?root.crypto.randomUUID():`backup-${Date.now()}-${Math.random().toString(16).slice(2)}`}
  function normalizedRestorePatients(raw){
    if(Array.isArray(raw?.patients)&&raw.patients.length)return raw.patients.map(p=>({...p}));
    const seen=new Map();
    for(const c of [...(raw?.archive||[]),raw?.current].filter(Boolean)){
      const p=ctx.patientFromCase?.(c);if(!p)continue;
      const k=ctx.patientIdentityKey?.(p);if(!seen.has(k))seen.set(k,p);
    }
    return [...seen.values()];
  }

  async function buildBackupPayload(){
    ctx.save?.();
    await ctx.initArchiveDb?.();
    await ctx.initPatientMaster?.();
    const archive=getArchive().map(deepClone);
    const patients=getPatients().map(deepClone);
    const current=deepClone(ctx.getState());
    const latestArchiveAt=Math.max(0,...archive.map(c=>Number(c.archivedAt||c.createdAt||0)).filter(Number.isFinite));
    const payload={
      format:'ANESVET_BACKUP',backupSchema:BACKUP_SCHEMA,backupId:backupUuid(),version:ctx.appVersion,sourceAppVersion:ctx.appVersion,exportedAt:Date.now(),
      summary:{archiveCount:archive.length,lockedCount:archive.filter(c=>c.caseLocked).length,voidedCount:archive.filter(c=>c.voidedAt).length,patientCount:patients.length,latestArchiveAt,currentCaseId:current.caseId||'',currentPatientName:current.patientName||'',currentPhase:current.casePhase||'preop',currentLocked:!!current.caseLocked,currentLastSavedAt:Number(current.lastSavedAt)||0,archiveBackend:getArchiveBackend(),patientBackend:getPatientBackend()},
      current,archive,patients,
      breedAliases:ctx.loadBreedAliases?.()||[],
      settings:(()=>{try{return JSON.parse(localStorage.getItem(keys.settings)||'null')}catch(e){return null}})(),
      drugLibrary:ctx.loadDrugLibraryData?.()||[],
      quickPresets:ctx.loadQuickPresets?.(),
      procedureTemplates:procedureTemplates?.exportHospital?.(),
      protocolAudit:ctx.getProtocolAudit?.()||[],
      protocolGovernance:(()=>{try{return keys.protocolGovernance?JSON.parse(localStorage.getItem(keys.protocolGovernance)||'null'):null}catch(e){return null}})(),
      pilotFeedbackQueue:ctx.getPilotFeedbackQueue?.()||[]
    };
    return await ensureIntegrityManifest(payload);
  }

  function readBackupHistory(){
    try{const rows=JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]');if(Array.isArray(rows)&&rows.length)return rows.slice(0,HISTORY_LIMIT)}catch(e){}
    const legacy=readBackupReceipt();return legacy?[{...legacy,source:'legacy-receipt'}]:[];
  }
  function writeBackupHistory(rows){
    const cleaned=(Array.isArray(rows)?rows:[]).filter(x=>x&&x.backupId).sort((a,b)=>(b.epoch||0)-(a.epoch||0)).slice(0,HISTORY_LIMIT);
    localStorage.setItem(HISTORY_KEY,JSON.stringify(cleaned));
    return cleaned;
  }
  function upsertHistoryReceipt(r){
    const rows=readBackupHistory(),i=rows.findIndex(x=>x.backupId===r.backupId);if(i>=0)rows[i]={...rows[i],...r};else rows.unshift(r);const out=writeBackupHistory(rows);dispatchDataSafetyChanged();return out.find(x=>x.backupId===r.backupId)||r;
  }
  function writeBackupReceipt(payload){
    const r={backupId:payload.backupId||'',epoch:Number(payload.exportedAt)||Date.now(),version:payload.version||ctx.appVersion,backupSchema:Number(payload.backupSchema)||1,archiveCount:payload.archive?.length||0,patientCount:payload.patients?.length||0,lockedCount:(payload.archive||[]).filter(c=>c.caseLocked).length,latestArchiveAt:Math.max(0,...(payload.archive||[]).map(c=>Number(c.archivedAt||c.createdAt||0)).filter(Number.isFinite)),currentCaseId:payload.current?.caseId||'',currentLastSavedAt:Number(payload.current?.lastSavedAt)||0,payloadDigest:payload.integrityManifest?.payloadDigest||'',clinicalDigest:payload.integrityManifest?.clinicalDigest||'',source:'created'};
    if(keys.lastBackup)localStorage.setItem(keys.lastBackup,String(r.epoch));
    if(keys.backupReceipt)localStorage.setItem(keys.backupReceipt,JSON.stringify(r));
    upsertHistoryReceipt(r);
    return r;
  }
  function readBackupReceipt(){try{return JSON.parse(localStorage.getItem(keys.backupReceipt)||'null')}catch(e){return null}}
  async function downloadBackupPayload(payload,{skipAuthorization=false}={}){
    if(!skipAuthorization&&ctx.authorizeAction){const auth=await ctx.authorizeAction('backup-export',{title:'Authorize full backup export'});if(!auth?.ok)throw new Error('Backup export authorization cancelled or not permitted')}
    if(!payload||typeof payload!=='object')throw new Error('Invalid backup payload');
    payload.backupSchema=BACKUP_SCHEMA;payload.integrityManifest=await createIntegrityManifest(payload);
    ctx.downloadBlob?.(JSON.stringify(payload,null,2),'application/json',`ANESVET_BACKUP_${ctx.formatDate?.(payload.exportedAt||Date.now())||Date.now()}_V${ctx.appVersion}.json`);
    const r=writeBackupReceipt(payload);
    if($('backupStatus'))$('backupStatus').textContent=`Verified backup created ${ctx.formatClock?.(r.epoch)||''} • ${r.archiveCount} cases • ${r.patientCount} patients`;
    renderBackupHealth();toast('Verified full backup created');return payload;
  }
  async function backupAllData({direct=false}={}){
    if(!direct&&root.AnesvetDataResilience?.openBackupPreflight)return root.AnesvetDataResilience.openBackupPreflight();
    const payload=await buildBackupPayload();return downloadBackupPayload(payload);
  }

  async function idbReplaceClinicalStores(raw){
    const archive=(raw.archive||[]).map(c=>{const x=deepClone(c);if(!x.caseId)x.caseId=root.crypto?.randomUUID?root.crypto.randomUUID():String(Date.now()+Math.random());return x});
    const patients=normalizedRestorePatients(raw).map(p=>{const x=deepClone(p);if(!x.patientId)x.patientId=root.crypto?.randomUUID?root.crypto.randomUUID():String(Date.now()+Math.random());x.patientNameLower=String(x.patientName||'').toLowerCase();x.updatedAt=x.updatedAt||Date.now();return x});
    await ctx.coreStorage?.replaceDataset?.({cases:archive,patients,current:raw.current,meta:{last_restore:{backupId:raw.backupId||'',sourceVersion:raw.version||'',restoredAt:Date.now()}}});
    return {archive,patients};
  }
  async function storePreRestoreSnapshot(){
    const payload=await buildBackupPayload();
    try{const stored=await ctx.idbPutMeta?.('pre_restore_backup',{createdAt:Date.now(),payload});return {stored:stored===true,payload}}
    catch(e){console.error('Pre-restore snapshot failed',e);return {stored:false,payload}}
  }
  async function getPreRestoreSnapshot(){const r=await ctx.idbGetMeta?.('pre_restore_backup');return r?.value||null}
  async function clearPreRestoreSnapshot(){try{await ctx.idbPutMeta?.('pre_restore_backup',null)}catch(e){}}
  function localStorageRestoreKeys(){return [keys.current,keys.settings,keys.drugLibrary,keys.quickPreset,procedureTemplates?.storageKey,keys.protocolAudit,keys.protocolGovernance,keys.breedAlias,keys.pilotFeedback,keys.patientFallback,keys.archive].filter(Boolean)}

  function currentFromStorage(){try{return JSON.parse(localStorage.getItem(keys.current)||'null')||{}}catch(e){return{}}}
  async function verifyRestoredDataset(raw){
    const actual={current:currentFromStorage(),archive:(ctx.getArchiveCache?.()||[]).map(deepClone),patients:(ctx.getPatientCache?.()||[]).map(deepClone)};
    const expectedArchiveIds=sortByIdentity(raw?.archive||[],['caseId','humanRecordId','archivedAt']).map(x=>x.caseId||x.humanRecordId||'');
    const actualArchiveIds=sortByIdentity(actual.archive,['caseId','humanRecordId','archivedAt']).map(x=>x.caseId||x.humanRecordId||'');
    const expectedPatientIds=sortByIdentity(normalizedRestorePatients(raw),['patientId','hospitalId','patientName']).map(x=>x.patientId||`${x.hospitalId||''}|${x.patientName||''}`);
    const actualPatientIds=sortByIdentity(actual.patients,['patientId','hospitalId','patientName']).map(x=>x.patientId||`${x.hospitalId||''}|${x.patientName||''}`);
    const countsMatch=actual.archive.length===(raw?.archive||[]).length&&actual.patients.length===normalizedRestorePatients(raw).length;
    const archiveIdsMatch=stableJson(actualArchiveIds)===stableJson(expectedArchiveIds);
    const patientIdsMatch=stableJson(actualPatientIds)===stableJson(expectedPatientIds);
    const currentMatch=String(actual.current?.caseId||'')===String(raw?.current?.caseId||'');
    let clinicalDigestMatch=null,expectedDigest=raw?.integrityManifest?.clinicalDigest||'',actualDigest='';
    if(expectedDigest){actualDigest=await sha256Text(stableJson(clinicalDataset(actual)));clinicalDigestMatch=actualDigest.toUpperCase()===String(expectedDigest).toUpperCase()}
    const full=!!expectedDigest;
    return {ok:countsMatch&&archiveIdsMatch&&patientIdsMatch&&currentMatch&&(!full||clinicalDigestMatch===true),level:full?'full':'structural',countsMatch,archiveIdsMatch,patientIdsMatch,currentMatch,clinicalDigestMatch,expectedClinicalDigest:expectedDigest,actualClinicalDigest:actualDigest,archiveCount:actual.archive.length,patientCount:actual.patients.length,verifiedAt:Date.now(),backupId:raw?.backupId||''};
  }
  function writeRestoreVerificationReceipt(raw,verification,precheck,rollbackStored){
    const receipt={epoch:Date.now(),backupId:raw?.backupId||'',sourceVersion:raw?.version||'',backupSchema:Number(raw?.backupSchema)||1,rollbackStored:!!rollbackStored,verification:deepClone(verification),payloadDigestVerified:precheck?.payload?.available?precheck.payload.valid:null,lockedChecksumMismatch:Number(precheck?.mismatch)||0};
    localStorage.setItem(RESTORE_VERIFY_KEY,JSON.stringify(receipt));
    if(keys.lastRestore)localStorage.setItem(keys.lastRestore,JSON.stringify(receipt));
    dispatchDataSafetyChanged();return receipt;
  }
  function readLastRestoreVerification(){try{return JSON.parse(localStorage.getItem(RESTORE_VERIFY_KEY)||localStorage.getItem(keys.lastRestore)||'null')}catch(e){return null}}

  async function applyRestorePayload(raw,{storeRollback=true,allowIntegrityMismatch=false,skipAuthorization=false}={}){
    if(!skipAuthorization&&ctx.authorizeAction){const auth=await ctx.authorizeAction('restore-data',{reauth:true,title:'Administrator authorization required for Restore'});if(!auth?.ok)throw new Error('Restore authorization cancelled or not permitted')}
    if(raw?.format!=='ANESVET_BACKUP'||!raw.current||!Array.isArray(raw.archive))throw new Error('Invalid backup');
    const precheck=await verifyBackupPayloadIntegrity(raw);
    if(precheck.payload.available&&precheck.payload.valid!==true)throw new Error('Backup file digest mismatch — restore blocked');
    if(precheck.clinical.available&&precheck.clinical.valid!==true)throw new Error('Backup clinical digest mismatch — restore blocked');
    if(precheck.mismatch&&!allowIntegrityMismatch)throw new Error('Locked final checksum mismatch — explicit override required');
    const rollback=storeRollback?await storePreRestoreSnapshot():null,old=new Map();
    for(const k of localStorageRestoreKeys())old.set(k,localStorage.getItem(k));
    try{
      await ctx.initArchiveDb?.();let restored;
      if(getArchiveBackend()==='IndexedDB')restored=await idbReplaceClinicalStores(raw);
      else restored={archive:(raw.archive||[]).map(c=>({...c,caseId:c.caseId||(root.crypto?.randomUUID?root.crypto.randomUUID():String(Date.now()+Math.random()))})),patients:normalizedRestorePatients(raw)};
      localStorage.setItem(keys.current,JSON.stringify(raw.current));
      raw.settings?localStorage.setItem(keys.settings,JSON.stringify(raw.settings)):localStorage.removeItem(keys.settings);
      Array.isArray(raw.pilotFeedbackQueue)?ctx.setPilotFeedbackQueue?.(raw.pilotFeedbackQueue):ctx.setPilotFeedbackQueue?.([]);
      Array.isArray(raw.drugLibrary)?localStorage.setItem(keys.drugLibrary,JSON.stringify(raw.drugLibrary)):localStorage.removeItem(keys.drugLibrary);
      raw.quickPresets?localStorage.setItem(keys.quickPreset,JSON.stringify(raw.quickPresets)):localStorage.removeItem(keys.quickPreset);
      if(raw.procedureTemplates){const tplRows=Array.isArray(raw.procedureTemplates)?raw.procedureTemplates:(raw.procedureTemplates.templates||[]);procedureTemplates?.replaceHospital?.(tplRows)}
      Array.isArray(raw.protocolAudit)?localStorage.setItem(keys.protocolAudit,JSON.stringify(raw.protocolAudit)):localStorage.removeItem(keys.protocolAudit);
      if(keys.protocolGovernance){raw.protocolGovernance?localStorage.setItem(keys.protocolGovernance,JSON.stringify(raw.protocolGovernance)):localStorage.removeItem(keys.protocolGovernance)}
      Array.isArray(raw.breedAliases)?localStorage.setItem(keys.breedAlias,JSON.stringify(raw.breedAliases)):localStorage.removeItem(keys.breedAlias);
      ctx.setArchiveCache?.(restored.archive);ctx.setPatientCache?.(restored.patients);
      const rows=ctx.getArchiveCache?.()||[];rows.sort((a,b)=>(b.archivedAt||b.createdAt||0)-(a.archivedAt||a.createdAt||0));ctx.setArchiveCache?.(rows);
      if(getArchiveBackend()!=='IndexedDB'){localStorage.setItem(keys.archive,JSON.stringify(rows));ctx.saveFallbackPatients?.()}
      const verification=await verifyRestoredDataset(raw);
      if(!verification.ok)throw new Error('Post-restore verification failed — automatic rollback triggered');
      writeRestoreVerificationReceipt(raw,verification,precheck,rollback?.stored);
      return {ok:true,rollbackStored:!!rollback?.stored,archiveCount:(ctx.getArchiveCache?.()||[]).length,patientCount:(ctx.getPatientCache?.()||[]).length,verification};
    }catch(err){
      for(const [k,v] of old){try{v===null?localStorage.removeItem(k):localStorage.setItem(k,v)}catch(e){}}
      if(rollback?.payload){
        try{
          if(getArchiveBackend()==='IndexedDB'){
            const restored=await idbReplaceClinicalStores(rollback.payload);ctx.setArchiveCache?.(restored.archive);ctx.setPatientCache?.(restored.patients);
          }else{
            ctx.setArchiveCache?.((rollback.payload.archive||[]).map(deepClone));ctx.setPatientCache?.(normalizedRestorePatients(rollback.payload));
          }
        }catch(revertErr){console.error('Automatic restore rollback failed',revertErr)}
      }
      throw err;
    }
  }
  async function rollbackLastRestore(){if(ctx.authorizeAction){const auth=await ctx.authorizeAction('restore-data',{reauth:true,title:'Administrator authorization required for Restore rollback'});if(!auth?.ok)throw new Error('Rollback authorization cancelled or not permitted')}const snap=await getPreRestoreSnapshot();if(!snap?.payload)throw new Error('No pre-restore snapshot available');const result=await applyRestorePayload(snap.payload,{storeRollback:false,allowIntegrityMismatch:true,skipAuthorization:true});await clearPreRestoreSnapshot();return result}
  async function verifyAllArchiveIntegrity(progress){
    const list=getArchive(),out={locked:0,verifiable:0,valid:0,mismatch:0,unverifiable:0,details:[]};let done=0;
    for(const c of list){
      if(!c?.caseLocked){done++;progress?.(done,list.length,out);continue}
      out.locked++;
      if(!c.finalChecksum||String(c.finalChecksum).startsWith('FNV1A-')){out.unverifiable++;done++;progress?.(done,list.length,out);continue}
      const alg=String(c.checksumAlgorithm||'SHA-256').toUpperCase();
      if(alg!=='SHA-256'){out.unverifiable++;done++;progress?.(done,list.length,out);continue}
      out.verifiable++;
      const got=await ctx.computeCaseChecksum?.(c);
      if(String(got).toUpperCase()===String(c.finalChecksum).toUpperCase())out.valid++;
      else{out.mismatch++;out.details.push(`${c.humanRecordId||c.caseId||'case'}: checksum mismatch`)}
      done++;progress?.(done,list.length,out);
    }
    return out;
  }
  async function recoveryCopyStatus(){
    const cp=ctx.readSafetyCheckpoint?.(),rawMirror=(await ctx.idbGetMeta?.('current'))?.value||null,rollback=await getPreRestoreSnapshot();
    const mirrorHasData=!!(rawMirror&&(rawMirror.patientSaved||rawMirror.caseStartedAt||rawMirror.timer?.running||(rawMirror.timer?.elapsedMs||0)>0||(rawMirror.records||[]).length||(rawMirror.events||[]).length||(rawMirror.drugAdministrations||[]).length));
    const mirror=mirrorHasData?rawMirror:null;
    return {checkpoint:cp?{caseId:cp.caseId,patientName:cp.patientName||cp.state?.patientName||'',savedAt:cp.lastSavedAt||cp.verifiedAt||0}:null,mirror:mirror?{caseId:mirror.caseId||'',patientName:mirror.patientName||'',savedAt:mirror.lastSavedAt||ctx.caseActivityEpoch?.(mirror)}:null,rollback:rollback?{createdAt:rollback.createdAt||0,sourceVersion:rollback.payload?.version||'',archiveCount:rollback.payload?.archive?.length||0}:null};
  }

  async function verifyBackupFilePayload(raw,{fileName=''}={}){
    if(raw?.format!=='ANESVET_BACKUP'||!raw.current||!Array.isArray(raw.archive))throw new Error('Not an ANESVET backup');
    const integrity=await verifyBackupPayloadIntegrity(raw),full=integrity.payload.available&&integrity.payload.valid===true&&integrity.clinical.available&&integrity.clinical.valid===true;
    const level=full?'full':'legacy-partial',ok=full?integrity.mismatch===0:integrity.mismatch===0;
    const receipt={backupId:raw.backupId||`legacy-${Number(raw.exportedAt)||Date.now()}`,epoch:Number(raw.exportedAt)||Date.now(),version:raw.version||'',backupSchema:Number(raw.backupSchema)||1,archiveCount:raw.archive?.length||0,patientCount:Array.isArray(raw.patients)?raw.patients.length:0,lockedCount:(raw.archive||[]).filter(c=>c?.caseLocked).length,payloadDigest:raw.integrityManifest?.payloadDigest||'',clinicalDigest:raw.integrityManifest?.clinicalDigest||'',source:'verified-file',fileVerifiedAt:Date.now(),verificationLevel:level,verifiedFileName:fileName||'',verificationOk:!!ok,lockedChecksumMismatch:integrity.mismatch};
    upsertHistoryReceipt(receipt);return {ok,level,integrity,receipt};
  }
  function markBackupOffDevice(backupId,{destination='other',label='',note='',confirmed=true}={}){
    const rows=readBackupHistory();const id=backupId||rows[0]?.backupId;if(!id)throw new Error('No backup history available');const i=rows.findIndex(x=>x.backupId===id);if(i<0)throw new Error('Backup receipt not found');
    rows[i]={...rows[i],external:{confirmed:confirmed!==false,confirmedAt:Date.now(),destination:String(destination||'other'),label:String(label||'').slice(0,160),note:String(note||'').slice(0,500)}};
    writeBackupHistory(rows);dispatchDataSafetyChanged();return rows[i];
  }
  function dataSafetySnapshot(){
    const history=readBackupHistory(),latest=history[0]||null,verified=history.find(x=>x.fileVerifiedAt&&x.verificationOk&&x.verificationLevel==='full')||null,external=history.find(x=>x.external?.confirmed&&x.external?.confirmedAt)||null;
    return {history,latest,verified,external,lastRestore:readLastRestoreVerification(),historyKey:HISTORY_KEY,restoreVerifyKey:RESTORE_VERIFY_KEY};
  }
  function dispatchDataSafetyChanged(){try{root.dispatchEvent?.(new CustomEvent('anesvet:data-safety-changed'))}catch(e){}}

  function installBridge(){
    root.AnesvetDataBridge={
      appVersion:()=>ctx.appVersion,
      buildBackupPayload,downloadBackupPayload,verifyBackupPayloadIntegrity,applyRestorePayload,rollbackLastRestore,getPreRestoreSnapshot,clearPreRestoreSnapshot,verifyAllArchiveIntegrity,recoveryCopyStatus,
      getArchive:()=>getArchive(),getPatients:()=>getPatients(),getCurrent:()=>deepClone(ctx.getState()),
      getArchiveBackend,getPatientBackend,getLastBackupEpoch,getBackupReceipt:readBackupReceipt,
      getBackupHistory:readBackupHistory,verifyBackupFilePayload,markBackupOffDevice,dataSafetySnapshot,readLastRestoreVerification,verifyRestoredDataset,
      restart:()=>ctx.restartAtAppRoot?.(),renderBackupHealth,renderArchives:()=>ctx.renderArchives?.(),
      hasMutableActiveCase:()=>ctx.hasMutableActiveCase?.(),toast:(msg)=>toast(msg),legacyArchiveSeed:()=>ctx.getLegacyArchiveSeed?.(),
      runClinicalValidation:(announce=false)=>ctx.runClinicalValidation?.(announce)
    };
    return root.AnesvetDataBridge;
  }

  function bind(){
    $('backupNowHealthBtn')?.addEventListener('click',()=>backupAllData());
    $('backupAllBtn')?.addEventListener('click',()=>backupAllData());
    $('restoreBackupBtn')?.addEventListener('click',()=>$('restoreBackupInput')?.click());
    $('restoreBackupInput')?.addEventListener('change',async e=>{
      const file=e.target.files?.[0];if(!file)return;
      try{
        if(root.AnesvetDataResilience?.previewRestoreFile){await root.AnesvetDataResilience.previewRestoreFile(file);return}
        const raw=JSON.parse(await file.text()),integrity=await verifyBackupPayloadIntegrity(raw);
        if(integrity.payload.available&&integrity.payload.valid!==true)throw new Error('Backup file digest mismatch');
        if(integrity.mismatch)throw new Error('Backup checksum mismatch');
        if(root.confirm?.(`Restore backup from ${new Date(raw.exportedAt||Date.now()).toLocaleString()}?`)){await applyRestorePayload(raw);ctx.restartAtAppRoot?.()}
      }catch(err){console.error(err);toast(`Restore failed: ${err.message||'invalid backup file'}`)}
      finally{e.target.value=''}
    });
  }

  return Object.freeze({version:VERSION,backupSchema:BACKUP_SCHEMA,bind,installBridge,getLastBackupEpoch,formatBytes,renderBackupHealth,verifyBackupPayloadIntegrity,backupUuid,normalizedRestorePatients,buildBackupPayload,writeBackupReceipt,readBackupReceipt,downloadBackupPayload,backupAllData,idbReplaceClinicalStores,storePreRestoreSnapshot,getPreRestoreSnapshot,clearPreRestoreSnapshot,localStorageRestoreKeys,applyRestorePayload,rollbackLastRestore,verifyAllArchiveIntegrity,recoveryCopyStatus,readBackupHistory,verifyBackupFilePayload,markBackupOffDevice,dataSafetySnapshot,readLastRestoreVerification,verifyRestoredDataset,createIntegrityManifest,ensureIntegrityManifest});
}

const api=Object.freeze({version:VERSION,backupSchema:BACKUP_SCHEMA,create});
root.ANESVET_BACKUP_RESTORE_CONTROLLER=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
