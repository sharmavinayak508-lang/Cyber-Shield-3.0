// ============================================
// FILE NAME: mode2-controller.js
// KAAM: MODE 1 / MODE 2 Switch + MODE 2 Login/Register/OTP
// MODE 1 = DEMO (localStorage, login.html me pehle se hai)
// MODE 2 = REALISTIC (Firebase Auth + Firestore)
// USE: <script src="mode2-controller.js"></script>
// ============================================
(function(){
  function getMode(){ return localStorage.getItem('cyber_mode') || 'demo'; }
  function setMode(m){
    if(m!=='demo' && m!=='realistic') m='demo';
    localStorage.setItem('cyber_mode', m);
    updateUI();
    var msg = document.getElementById('msg');
    if(msg) msg.innerText = m==='demo' ? 'MODE 1 - DEMO MODE ON (localStorage)' : 'MODE 2 - REALISTIC MODE ON (Firebase)';
    if(window.logSIEM) window.logSIEM('mode_switch', {mode:m});
    return m;
  }
  function updateUI(){
    var m = getMode();
    // 1) Switch buttons ka colour
    document.querySelectorAll('[data-mode-btn]').forEach(function(b){
      var on = b.getAttribute('data-mode-btn')===m;
      b.style.background = on ? (m==='demo' ? '#00ff88' : '#ff4444') : 'transparent';
      b.style.color = on ? '#000' : '#fff';
      b.style.border = '1px solid ' + (on ? '#fff' : 'rgba(255,255,255,.3)');
    });
    // 2) Upar wala bada MODE 2 banner - YEHI TERI DUSRI REQUEST HAI
    var banner = document.getElementById('mode2Banner');
    if(banner){
      if(m==='realistic'){
        banner.style.display = 'block';
        banner.innerHTML = '<b>MODE 2 - REALISTIC MODE</b> &nbsp;|&nbsp; Firebase Auth + Firestore &nbsp;|&nbsp; Data Cloud me save hoga';
      } else {
        banner.style.display = 'block';
        banner.innerHTML = '<b>MODE 1 - DEMO MODE</b> &nbsp;|&nbsp; localStorage &nbsp;|&nbsp; Data browser me save hoga &nbsp;|&nbsp; Bina Firebase ke chalega';
        banner.style.background = '#00ff88';
        banner.style.color = '#000';
      }
      if(m==='realistic'){ banner.style.background = '#ff4444'; banner.style.color = '#fff'; }
    }
    // 3) Login card ke upar wala chhota badge
    var badge = document.getElementById('modeBadge');
    if(badge) badge.innerText = m==='demo' ? 'MODE 1 - DEMO' : 'MODE 2 - REALISTIC (Firebase)';
    // 4) Page ka title bhi badal do taaki tab me bhi MODE 2 dikhe
    try{ document.title = m==='realistic' ? 'Cyber Shield - MODE 2 - Sign in' : 'Cyber Shield - MODE 1 - Sign in'; }catch(e){}
    // 5) Neeche wali line
    var note = document.getElementById('modeNote');
    if(note) note.innerText = m==='demo'
      ? 'Demo Mode: Data browser me save hoga. Bina internet / bina Firebase ke chalega. Teacher ke liye quick test.'
      : 'Realistic Mode: Data Firebase Firestore me save hoga. Firebase config bhara hona chahiye. Agar Firebase na chale to MODE 1 use karo.';
  }
  window.CyberMode = { getMode:getMode, setMode:setMode, updateUI:updateUI };
  window.setCyberMode = setMode; window.getCyberMode = getMode;

  function emailFromUsername(u){ return String(u||'').trim().toLowerCase().replace(/\s+/g,'.') + '@cybershield.demo'; }
  window.CyberMode2 = {
    emailFromUsername: emailFromUsername,
    async register(username, password, extra){
      var fb = window.CyberFirebase; if(!fb || !fb.ready) return {ok:false, msg:'Firebase connected nahi hai. Config bharo ya MODE 1 use karo.'};
      try{
        var cred = await fb.auth.createUserWithEmailAndPassword(emailFromUsername(username), password);
        await fb.db.collection('users').doc(cred.user.uid).set({username:username, email:extra&&extra.email||'', phone:extra&&extra.phone||'', role:'user', createdAt:new Date().toISOString(), mode:'realistic'});
        await fb.db.collection('siem_logs').add({time:new Date().toISOString(), event:'mode2_register', data:{user:username}});
        return {ok:true, msg:'MODE 2 Account Firebase me ban gaya!'};
      }catch(e){ return {ok:false, msg: String(e.message||e)}; }
    },
    async login(username, password){
      var fb = window.CyberFirebase; if(!fb || !fb.ready) return {ok:false, msg:'Firebase connected nahi hai. Config bharo ya MODE 1 use karo.'};
      try{
        var cred = await fb.auth.signInWithEmailAndPassword(emailFromUsername(username), password);
        var snap = await fb.db.collection('users').doc(cred.user.uid).get();
        var data = snap.exists ? snap.data() : {username:username, role:'user'};
        await fb.db.collection('siem_logs').add({time:new Date().toISOString(), event:'mode2_login', data:{user:username, role:data.role}});
        return {ok:true, user:data, uid:cred.user.uid};
      }catch(e){ return {ok:false, msg: String(e.message||e)}; }
    },
    async sendOTP(username){
      var otp = String(Math.floor(100000 + Math.random()*900000));
      var fb = window.CyberFirebase;
      if(fb && fb.ready){ try{ await fb.db.collection('otps').add({username:username, otp:otp, time:new Date().toISOString(), mode:'realistic-test'}); }catch(e){} }
      return otp;
    }
  };
  document.addEventListener('DOMContentLoaded', updateUI);
})();
