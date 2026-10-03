(()=>{
'use strict';
function clone(v){return JSON.parse(JSON.stringify(v))}
function create({dbName='ANESVET_DB',dbVersion=2,onBlocked=null}={}){
  let dbPromise=null;
  function resetConnection(){dbPromise=null}
  function openDb(){
    if(dbPromise)return dbPromise;
    dbPromise=new Promise((resolve,reject)=>{
      if(!('indexedDB' in window)){reject(new Error('IndexedDB unavailable'));return}
      const req=indexedDB.open(dbName,dbVersion);
      req.onupgradeneeded=()=>{
        const db=req.result;
        if(!db.objectStoreNames.contains('cases')){const s=db.createObjectStore('cases',{keyPath:'caseId'});s.createIndex('archivedAt','archivedAt',{unique:false})}
        if(!db.objectStoreNames.contains('meta'))db.createObjectStore('meta',{keyPath:'key'});
        if(!db.objectStoreNames.contains('patients')){
          const p=db.createObjectStore('patients',{keyPath:'patientId'});
          p.createIndex('hospitalId','hospitalId',{unique:false});p.createIndex('patientNameLower','patientNameLower',{unique:false});
          p.createIndex('microchip','microchip',{unique:false});p.createIndex('updatedAt','updatedAt',{unique:false});
        }
      };
      let settled=false;
      req.onblocked=()=>{if(settled)return;settled=true;dbPromise=null;try{onBlocked?.()}catch(e){}reject(new Error('IndexedDB upgrade blocked by another ANESVET tab'))};
      req.onsuccess=()=>{if(settled){try{req.result.close()}catch(e){}return}settled=true;resolve(req.result)};
      req.onerror=()=>{if(settled)return;settled=true;dbPromise=null;reject(req.error||new Error('IndexedDB failed'))};
    });
    return dbPromise;
  }
  async function request(store,mode,op){const db=await openDb();return await new Promise((resolve,reject)=>{let r;try{r=op(db.transaction(store,mode).objectStore(store))}catch(e){reject(e);return}r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
  async function getAllCases(){const rows=await request('cases','readonly',s=>s.getAll());return (rows||[]).sort((a,b)=>(b.archivedAt||b.createdAt||0)-(a.archivedAt||a.createdAt||0))}
  async function putCase(c){const copy=clone(c);if(!copy.caseId)copy.caseId=crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random());await request('cases','readwrite',s=>s.put(copy));return copy}
  async function deleteCase(id){await request('cases','readwrite',s=>s.delete(id))}
  async function clearCases(){await request('cases','readwrite',s=>s.clear())}
  async function getAllPatients(){const rows=await request('patients','readonly',s=>s.getAll());return (rows||[]).sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0))}
  async function putPatient(p){const copy=clone(p);if(!copy.patientId)copy.patientId=crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random());copy.patientNameLower=String(copy.patientName||'').toLowerCase();copy.updatedAt=copy.updatedAt||Date.now();await request('patients','readwrite',s=>s.put(copy));return copy}
  async function clearPatients(){await request('patients','readwrite',s=>s.clear())}
  async function putMeta(key,value){try{await request('meta','readwrite',s=>s.put({key,value,updatedAt:Date.now()}));return true}catch(e){return false}}
  async function getMeta(key){try{return await request('meta','readonly',s=>s.get(key))||null}catch(e){return null}}
  async function replaceDataset({cases=[],patients=[],current=null,meta={}}={}){
    const db=await openDb();
    return await new Promise((resolve,reject)=>{
      const tx=db.transaction(['cases','patients','meta'],'readwrite'),cs=tx.objectStore('cases'),ps=tx.objectStore('patients'),ms=tx.objectStore('meta');
      cs.clear();ps.clear();
      for(const c of cases)cs.put(clone(c));for(const p of patients)ps.put(clone(p));ms.put({key:'current',value:clone(current),updatedAt:Date.now()});for(const [key,value] of Object.entries(meta||{}))ms.put({key,value:clone(value),updatedAt:Date.now()});
      tx.oncomplete=()=>resolve(true);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('Dataset transaction aborted'));
    });
  }
  return Object.freeze({openDb,resetConnection,getAllCases,putCase,deleteCase,clearCases,getAllPatients,putPatient,clearPatients,putMeta,getMeta,replaceDataset});
}
window.ANESVET_CORE_STORAGE=Object.freeze({create});
})();
