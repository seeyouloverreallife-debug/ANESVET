/* ANESVET V15.20.0 — Hospital Branding & Report Identity */
(function(){
  'use strict';

  const SETTINGS_KEY='anesvet_v14_3_settings';
  const MAX_LOGO_DIM=192;
  const MAX_LOGO_DATA_URL=260000;
  let pendingLogoDataUrl=null;

  const $=id=>document.getElementById(id);
  const text=v=>v==null?'':String(v);
  const clean=(v,max=500)=>text(v).trim().slice(0,max);

  function readSettings(){
    try{return JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}')||{}}catch(e){return{}}
  }
  function writeSettings(settings){
    localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings||{}));
  }
  function brandingFromSettings(s={}){
    return {
      hospitalName:clean(s.hospitalName,180),
      hospitalShortName:clean(s.hospitalShortName,120),
      hospitalAddress:clean(s.hospitalAddress,500),
      hospitalPhone:clean(s.hospitalPhone,120),
      hospitalEmail:clean(s.hospitalEmail,180),
      hospitalWeb:clean(s.hospitalWeb,300),
      hospitalFooter:clean(s.hospitalFooter,500),
      hospitalLogoDataUrl:text(s.hospitalLogoDataUrl||''),
      showHospitalNameInReport:s.showHospitalNameInReport!==false,
      showHospitalContactInReport:s.showHospitalContactInReport!==false,
      showHospitalInApp:!!s.showHospitalInApp
    };
  }
  function getCurrent(){return brandingFromSettings(readSettings())}
  function snapshot(){return {...getCurrent(),capturedAt:Date.now(),format:'ANESVET_HOSPITAL_BRANDING_V1'}}
  function effectiveForState(state){
    if(state&&state.hospitalBrandingSnapshot&&state.hospitalBrandingSnapshot.format==='ANESVET_HOSPITAL_BRANDING_V1'){
      return brandingFromSettings(state.hospitalBrandingSnapshot);
    }
    return getCurrent();
  }
  function contactLine(b){
    const items=[];
    if(b.hospitalAddress)items.push(b.hospitalAddress);
    if(b.hospitalPhone)items.push(`Tel ${b.hospitalPhone}`);
    if(b.hospitalEmail)items.push(b.hospitalEmail);
    if(b.hospitalWeb)items.push(b.hospitalWeb);
    return items.join(' • ');
  }
  function hospitalDisplayName(b){return b.hospitalName||b.hospitalShortName||''}
  function appDisplayName(b){return b.hospitalShortName||b.hospitalName||''}

  function setImage(id,dataUrl){
    const img=$(id);if(!img)return;
    if(dataUrl){img.src=dataUrl;img.hidden=false}else{img.removeAttribute('src');img.hidden=true}
  }
  function setText(id,value,{hideWhenEmpty=false}={}){
    const el=$(id);if(!el)return;
    el.textContent=value||'';
    if(hideWhenEmpty)el.hidden=!value;
  }
  function applyReportBranding(state){
    const b=effectiveForState(state),name=b.showHospitalNameInReport?hospitalDisplayName(b):'',contact=b.showHospitalContactInReport?contactLine(b):'';
    ['report','summary'].forEach(prefix=>{
      setImage(`${prefix}HospitalLogo`,b.hospitalLogoDataUrl);
      setText(`${prefix}HospitalName`,name,{hideWhenEmpty:true});
      setText(`${prefix}HospitalContact`,contact,{hideWhenEmpty:true});
      const wrap=$(`${prefix}HospitalBranding`);if(wrap)wrap.classList.toggle('has-hospital-branding',!!(name||b.hospitalLogoDataUrl||contact));
    });
    const custom=b.hospitalFooter||'';
    setText('reportHospitalFooter',custom,{hideWhenEmpty:true});
    setText('summaryHospitalFooter',custom,{hideWhenEmpty:true});
    return b;
  }

  function renderAppHeader(){
    const b=getCurrent(),name=b.showHospitalInApp?appDisplayName(b):'';
    setText('appHospitalName',name,{hideWhenEmpty:true});
  }
  function renderPreview(){
    const b=formBranding();
    setImage('hospitalBrandingPreviewLogo',b.hospitalLogoDataUrl);
    setText('hospitalBrandingPreviewName',hospitalDisplayName(b)||'Hospital name');
    setText('hospitalBrandingPreviewContact',contactLine(b)||'Contact information will appear here');
    const noLogo=$('hospitalBrandingPreviewNoLogo');if(noLogo)noLogo.hidden=!!b.hospitalLogoDataUrl;
  }
  function formBranding(){
    const current=getCurrent();
    return {
      hospitalName:clean($('settingHospitalName')?.value,180),
      hospitalShortName:clean($('settingHospitalShortName')?.value,120),
      hospitalAddress:clean($('settingHospitalAddress')?.value,500),
      hospitalPhone:clean($('settingHospitalPhone')?.value,120),
      hospitalEmail:clean($('settingHospitalEmail')?.value,180),
      hospitalWeb:clean($('settingHospitalWeb')?.value,300),
      hospitalFooter:clean($('settingHospitalFooter')?.value,500),
      hospitalLogoDataUrl:pendingLogoDataUrl===null?current.hospitalLogoDataUrl:pendingLogoDataUrl,
      showHospitalNameInReport:$('settingShowHospitalNameInReport')?.checked!==false,
      showHospitalContactInReport:$('settingShowHospitalContactInReport')?.checked!==false,
      showHospitalInApp:$('settingShowHospitalInApp')?.checked===true
    };
  }
  function loadForm(){
    const b=getCurrent();
    const values={
      settingHospitalName:b.hospitalName,settingHospitalShortName:b.hospitalShortName,settingHospitalAddress:b.hospitalAddress,
      settingHospitalPhone:b.hospitalPhone,settingHospitalEmail:b.hospitalEmail,settingHospitalWeb:b.hospitalWeb,settingHospitalFooter:b.hospitalFooter
    };
    Object.entries(values).forEach(([id,v])=>{if($(id))$(id).value=v||''});
    if($('settingShowHospitalNameInReport'))$('settingShowHospitalNameInReport').checked=b.showHospitalNameInReport!==false;
    if($('settingShowHospitalContactInReport'))$('settingShowHospitalContactInReport').checked=b.showHospitalContactInReport!==false;
    if($('settingShowHospitalInApp'))$('settingShowHospitalInApp').checked=!!b.showHospitalInApp;
    pendingLogoDataUrl=null;
    renderPreview();renderAppHeader();
  }

  function imageFromFile(file){
    return new Promise((resolve,reject)=>{
      const reader=new FileReader();
      reader.onerror=()=>reject(new Error('Unable to read image'));
      reader.onload=()=>{
        const img=new Image();
        img.onerror=()=>reject(new Error('Unsupported image file'));
        img.onload=()=>resolve(img);
        img.src=reader.result;
      };
      reader.readAsDataURL(file);
    });
  }
  function canvasData(img,maxDim){
    const scale=Math.min(1,maxDim/Math.max(img.naturalWidth||img.width,img.naturalHeight||img.height));
    const w=Math.max(1,Math.round((img.naturalWidth||img.width)*scale)),h=Math.max(1,Math.round((img.naturalHeight||img.height)*scale));
    const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
    const ctx=canvas.getContext('2d');ctx.clearRect(0,0,w,h);ctx.drawImage(img,0,0,w,h);
    return canvas.toDataURL('image/png');
  }
  async function compressLogo(file){
    if(!file||!String(file.type||'').startsWith('image/'))throw new Error('Please choose a PNG/JPG image');
    if(file.size>8*1024*1024)throw new Error('Logo file is too large (max 8 MB before resize)');
    const img=await imageFromFile(file);
    for(const size of [MAX_LOGO_DIM,160,128]){
      const data=canvasData(img,size);if(data.length<=MAX_LOGO_DATA_URL)return data;
    }
    throw new Error('Logo could not be reduced enough for local storage');
  }
  async function onLogoChange(e){
    const file=e.target.files?.[0];if(!file)return;
    const status=$('hospitalBrandingLogoStatus');
    try{
      if(status)status.textContent='Preparing logo…';
      pendingLogoDataUrl=await compressLogo(file);
      if(status)status.textContent='Logo ready — press Save branding';
      renderPreview();
    }catch(err){
      pendingLogoDataUrl=null;if(status)status.textContent=err.message||String(err);e.target.value='';
    }
  }
  function removeLogo(){
    pendingLogoDataUrl='';if($('settingHospitalLogo'))$('settingHospitalLogo').value='';
    if($('hospitalBrandingLogoStatus'))$('hospitalBrandingLogoStatus').textContent='Logo will be removed after Save branding';
    renderPreview();
  }
  function saveBranding(){
    const old=readSettings(),b=formBranding();
    try{
      writeSettings({...old,...b});pendingLogoDataUrl=null;loadForm();
      if(typeof window.toast==='function')window.toast('Hospital branding saved');
      else if($('hospitalBrandingSaveStatus'))$('hospitalBrandingSaveStatus').textContent='✓ Hospital branding saved';
    }catch(err){
      const msg=(err&&err.name==='QuotaExceededError')?'Storage is full — try a smaller logo or remove old browser data.':(err.message||String(err));
      if($('hospitalBrandingSaveStatus'))$('hospitalBrandingSaveStatus').textContent=msg;
    }
  }

  function bind(){
    $('settingHospitalLogo')?.addEventListener('change',onLogoChange);
    $('removeHospitalLogoBtn')?.addEventListener('click',removeLogo);
    $('saveHospitalBrandingBtn')?.addEventListener('click',saveBranding);
    ['settingHospitalName','settingHospitalShortName','settingHospitalAddress','settingHospitalPhone','settingHospitalEmail','settingHospitalWeb','settingHospitalFooter','settingShowHospitalNameInReport','settingShowHospitalContactInReport','settingShowHospitalInApp'].forEach(id=>{
      $(id)?.addEventListener('input',renderPreview);$(id)?.addEventListener('change',renderPreview);
    });
    loadForm();
  }

  window.AnesvetBranding={getCurrent,snapshot,effectiveForState,applyReportBranding,renderAppHeader,loadForm,contactLine};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})();
