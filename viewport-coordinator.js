/* ANESVET V17.6.0 — shared viewport lifecycle coordinator.
 * UI infrastructure only: coalesces resize/orientation/VisualViewport bursts into
 * one app-level event per animation frame. No clinical state writes. */
(()=>{
  'use strict';
  if(window.ANESVET_VIEWPORT_COORDINATOR)return;
  const vv=window.visualViewport||null;
  let raf=0,seq=0,lastReason='boot';
  const snapshot=()=>Object.freeze({
    seq,
    reason:lastReason,
    width:window.innerWidth||document.documentElement.clientWidth||0,
    height:window.innerHeight||document.documentElement.clientHeight||0,
    visualWidth:vv?.width||window.innerWidth||0,
    visualHeight:vv?.height||window.innerHeight||0,
    offsetTop:vv?.offsetTop||0,
    offsetLeft:vv?.offsetLeft||0,
    orientation:screen?.orientation?.type||String(window.orientation||''),
    at:Date.now()
  });
  const emit=()=>{
    raf=0;seq+=1;
    document.dispatchEvent(new CustomEvent('anesvet:viewportchange',{detail:snapshot()}));
  };
  const schedule=(reason='viewport')=>{
    lastReason=reason;
    if(raf)return;
    raf=requestAnimationFrame(emit);
  };
  window.addEventListener('resize',()=>schedule('window-resize'),{passive:true});
  window.addEventListener('orientationchange',()=>schedule('orientationchange'),{passive:true});
  vv?.addEventListener('resize',()=>schedule('visual-resize'),{passive:true});
  screen?.orientation?.addEventListener?.('change',()=>schedule('screen-orientation'),{passive:true});
  window.ANESVET_VIEWPORT_COORDINATOR=Object.freeze({version:'17.6.0',schedule,snapshot});
})();
