// CYBER SHIELD 3.0 - UNIVERSAL SOUND ON/OFF TOGGLE - COMPLETE FILE
// Upload this file to GitHub repo as sound-toggle.js
// Works for login.html, admin_dashboard.html, user_dashboard.html
// Setting is shared via localStorage across ALL pages

(function(){
  let soundEnabled = localStorage.getItem('cyber_sound_enabled') !== 'off';
  window.cyberSoundEnabled = soundEnabled;

  window.toggleCyberSound = function(){
    soundEnabled = !soundEnabled;
    window.cyberSoundEnabled = soundEnabled;
    localStorage.setItem('cyber_sound_enabled', soundEnabled ? 'on' : 'off');
    updateCyberSoundBtn();
    if(!soundEnabled){
      document.querySelectorAll('audio').forEach(a=>{ try{a.pause(); a.currentTime=0;}catch(e){} });
      console.log('🔇 Cyber Shield Sound OFF');
    } else {
      console.log('🔊 Cyber Shield Sound ON');
      if(window.triggerRoar) window.triggerRoar();
    }
    return soundEnabled;
  };

  window.isCyberSoundOn = function(){ return soundEnabled; };

  function updateCyberSoundBtn(){
    let btns = document.querySelectorAll('#cyberSoundToggleBtn, .cyberSoundToggleBtn');
    btns.forEach(btn=>{
      btn.innerText = soundEnabled ? '🔊 SOUND: ON' : '🔇 SOUND: OFF';
      btn.style.background = soundEnabled ? 'rgba(0,212,255,0.15)' : 'rgba(255,59,59,0.15)';
      btn.style.color = soundEnabled ? '#00d4ff' : '#ff3b3b';
      btn.style.borderColor = soundEnabled ? '#00d4ff' : '#ff3b3b';
    });
    let status = document.getElementById('cyberSoundStatus');
    if(status){
      status.innerText = soundEnabled ? '🔊 Eagle sound ON' : '🔇 Eagle sound OFF';
      status.style.color = soundEnabled ? '#00ff88' : '#ff3b3b';
    }
  }

  function createBtnIfMissing(){
    if(document.getElementById('cyberSoundToggleBtn')){ updateCyberSoundBtn(); return; }
    let header = document.querySelector('.header-controls') || document.querySelector('.header') || document.body;
    let btn = document.createElement('button');
    btn.id = 'cyberSoundToggleBtn';
    btn.onclick = window.toggleCyberSound;
    btn.style.cssText = 'padding:8px 12px;border-radius:20px;border:1px solid #00d4ff;background:rgba(0,212,255,0.15);color:#00d4ff;font-weight:800;cursor:pointer;font-size:11px;margin:4px;';
    btn.innerText = soundEnabled ? '🔊 SOUND: ON' : '🔇 SOUND: OFF';
    header.appendChild(btn);
    updateCyberSoundBtn();
  }

  // Patch triggerRoar to respect toggle
  function patchRoar(){
    if(window.triggerRoar && !window.triggerRoar._patched){
      let orig = window.triggerRoar;
      let patched = function(){ if(!soundEnabled) return; return orig(); };
      patched._patched = true;
      window.triggerRoar = patched;
    }
  }

  window.addEventListener('load', ()=>{
    createBtnIfMissing();
    patchRoar();
    // Backup: stop audio if OFF
    setInterval(()=>{ if(!soundEnabled) document.querySelectorAll('audio').forEach(a=>{ try{a.pause();}catch(e){} }); }, 1000);
  });

  window.updateCyberSoundBtn = updateCyberSoundBtn;
})();
