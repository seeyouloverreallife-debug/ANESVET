(function(){
'use strict';
function elapsed(timer,now=Date.now()){if(timer?.running&&timer?.startedEpoch)return (timer.elapsedMs||0)+(now-timer.startedEpoch);return timer?.elapsedMs||0}
function timerView(timer){if(timer?.running)return Object.freeze({mode:'running',badgeClass:'timer-state running',badgeText:'● RUNNING',startText:'Running',startDisabled:true,pauseDisabled:false,pauseText:'Pause case'});if((timer?.elapsedMs||0)>0)return Object.freeze({mode:'paused',badgeClass:'timer-state paused',badgeText:'PAUSED',startText:'▶ Resume case',startDisabled:false,pauseDisabled:true,pauseText:'Paused'});return Object.freeze({mode:'ready',badgeClass:'timer-state ready',badgeText:'READY',startText:'▶ Start case',startDisabled:false,pauseDisabled:true,pauseText:'Pause'})}
function sessionStatus(state){const started=!!state?.caseStartedAt,locked=!!state?.caseLocked,phase=state?.casePhase||'setup',emergency=!!state?.emergencyReturnActive;return Object.freeze({started,locked,phase,emergency,recoveryAccess:started&&['recovery','complete'].includes(phase)&&!emergency,orLiveByStartedCase:started,active:started&&!locked&&phase!=='complete'})}
window.ANESVET_SESSION_MODEL=Object.freeze({elapsed,timerView,sessionStatus});
})();
