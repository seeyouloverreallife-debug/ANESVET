/* ANESVET R27 — mobile navigation/identity discoverability and viewport comfort.
   No clinical state writes; delegates staff session actions to the existing security controller. */
(()=>{
  'use strict';
  const $=id=>document.getElementById(id);
  const chip=$('securityIdentityChip');
  const workflow=$('mobileWorkflowDialog');
  const secondary=workflow?.querySelector('.mobile-workflow-secondary');
  if(chip&&secondary&&!$('mobileIdentityBtn')){
    const btn=document.createElement('button');
    btn.id='mobileIdentityBtn';btn.type='button';btn.className='session-safe';
    btn.innerHTML='<span class="r27-identity-icon" aria-hidden="true">👤</span><span class="r27-identity-info"><b>ผู้ใช้งาน / Identity</b><small id="mobileIdentityStatus">กำลังโหลดสถานะ</small></span>';
    secondary.append(btn);
    btn.addEventListener('click',()=>{
      if(workflow?.open){try{workflow.close()}catch(_){workflow.removeAttribute('open')}}
      // Reuse the authenticated Session / Switch User / Lock dialog. Do not bypass the PIN.
      chip.click();
    });
    const sync=()=>{
      const raw=(chip.textContent||'').trim();
      const state=/locked/i.test(raw)?'locked':/off|unmanaged/i.test(raw)?'off':'active';
      chip.dataset.securityState=state;
      const label=state==='off'?'Identity ยังไม่เปิดใช้งาน':state==='locked'?'Identity ถูกล็อก':raw.replace(/^[^\p{L}\p{N}]*/u,'').trim()||'Identity';
      chip.setAttribute('aria-label',`ผู้ใช้งาน / Identity: ${label}`);
      chip.setAttribute('title',`ผู้ใช้งาน / Identity: ${label}`);
      $('mobileIdentityStatus').textContent=label;
      btn.querySelector('.r27-identity-icon').textContent=state==='locked'?'🔒':state==='off'?'🔓':'👤';
    };
    new MutationObserver(sync).observe(chip,{childList:true,characterData:true,subtree:true});
    sync();
  }
  // Native virtual keyboards shrink visualViewport. Hide floating docks while typing,
  // so they cannot cover vitals / recovery inputs; reveal them again when editing ends.
  const vv=window.visualViewport;
  const syncKeyboard=()=>{
    // The current mobile shell has one viewport/keyboard owner in OR speed
    // hardening. Keep this legacy behavior only for the original shell.
    if(document.body.classList.contains('av-mobile-design'))return;
    const el=document.activeElement;
    const edit=!!el?.matches?.('input:not([type=checkbox]):not([type=radio]):not([type=button]),textarea,select,[contenteditable="true"]');
    const shrink=vv?Math.max(0,window.innerHeight-vv.height):0;
    document.body.classList.toggle('r27-keyboard-open',edit&&shrink>130);
  };
  vv?.addEventListener('resize',syncKeyboard,{passive:true});
  document.addEventListener('focusin',syncKeyboard);
  document.addEventListener('focusout',()=>requestAnimationFrame(syncKeyboard));
  window.addEventListener('pageshow',syncKeyboard);
})();
