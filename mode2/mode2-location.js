<!DOCTYPE html>
<html lang="en"><head><style>
@font-face {
  font-family: "Optimistic";
  font-style: normal;
  font-weight: 400 600;
  font-display: swap;
  src: url("/fonts/OptimisticAI_VF_Optimized.woff2") format("woff2");
}
@font-face {
  font-family: "Optimistic Mono";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("/fonts/OptimisticMono_W_TextRegular.woff2") format("woff2");
}
:where(html) {
  font-family: "Optimistic", system-ui, sans-serif;
}
:where(code, pre, kbd, samp) {
  font-family: "Optimistic Mono", ui-monospace, monospace;
}
</style><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Cyber Shield V4 - Secure Sign In</title>
<link rel="manifest" href="manifest.json"><meta name="theme-color" content="#050a14">
<style>
:root{--bg:#050a14;--card:rgba(10,22,40,.95);--input:#0f1f3a;--text:#fff;--muted:#9fb0cc;--border:#00d4ff;--accent:var(--accentColor,#00d4ff)}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font-family:Inter,system-ui,Segoe UI,Roboto,sans-serif}
.wrap{max-width:560px;margin:18px auto;padding:14px}.card{background:var(--card);border:1px solid var(--border);border-radius:18px;padding:22px}
h1{text-align:center;color:#ffaa00;margin:4px 0}.sub{text-align:center;color:var(--muted);font-size:13px}
.row{display:flex;gap:8px;flex-wrap:wrap}.row>*{flex:1}
select,input,textarea{width:100%;padding:12px;border-radius:10px;border:1px solid #333;background:var(--input);color:var(--text);margin:6px 0;font-size:14px}
button{cursor:pointer;border:0;border-radius:10px;padding:12px;font-weight:800;font-size:14px}
.blue{background:var(--accent);color:#000}.green{background:#00ff88;color:#000}.orange{background:#ff8800;color:#fff}.ghost{background:transparent;border:1px solid var(--accent);color:var(--text)}
.tabs{display:flex;gap:8px}.tabs button{flex:1;background:var(--input);color:var(--text)}.tabs button.active{background:var(--accent);color:#000}
.msg{text-align:center;font-weight:700;min-height:18px;margin:8px 0;color:#ffb347}.msg.ok{color:#00ff88}
.bar{height:8px;background:#222;border-radius:99px;overflow:hidden}.bar i{display:block;height:100%;background:#ff4444;width:0}
.box{background:rgba(0,255,136,.08);border:1px solid #00aa77;border-radius:10px;padding:10px;font-size:13px;margin:8px 0}
.small{font-size:12px;color:var(--muted);text-align:center}.link{color:var(--accent);cursor:pointer;font-weight:800}
.passWrap{position:relative}.passWrap button{position:absolute;right:8px;top:50%;transform:translateY(-50%);padding:6px 9px;font-size:12px}
.pill{display:inline-block;padding:4px 10px;border-radius:99px;background:rgba(0,212,255,.16);font-size:11px;font-weight:800}
.hidden{display:none}
</style></head>
<body><div class="wrap"><div class="card">
<h1>CYBER SHIELD <span class="pill">V4 • ALL 20 FEATURES</span></h1>
<p class="sub">Security Platform • Secure Sign In • English Version</p>
<div id="broadcastBar" class="box hidden"></div><div id="lockdownBar" class="box hidden"></div>

<!-- Theme Builder : Feature 16 -->
<div class="row"><select id="themeSel"><option value="dark">Dark Theme</option><option value="light">Light Theme</option><option value="blue">Blue Theme</option><option value="fire">Fire Theme</option><option value="cyber">Cyber Theme</option></select>
<input type="color" id="accentPick" value="#00d4ff" title="Pick your accent colour"></div>
<p class="small">Theme Builder: choose a theme + your own accent colour. Saved on this device.</p>

<div class="tabs"><button id="tabLogin" class="active" onclick="showTab('login')">Sign In</button><button id="tabReg" onclick="showTab('register')">Create Account</button></div>

<input id="uName" placeholder="Full Name">
<input id="uEmail" type="email" placeholder="Email Address">
<input id="uPhone" placeholder="Phone Number">
<input id="uCity" placeholder="City">
<input id="uState" placeholder="State">
<select id="roleSel"><option value="user">User</option><option value="admin">Admin (request approval)</option><option value="viewer">Viewer</option></select>

<div class="passWrap"><input id="uPass" type="password" placeholder="Password (Minimum 8 Characters)">
<!-- Feature 2 : Show / Hide --><button type="button" onclick="togglePass()">Show</button></div>
<!-- Feature 3 : Strength meter --><div class="bar"><i id="strengthBar"></i></div><p class="small" id="strengthText">Password strength: —</p>

<!-- Feature 6 : OTP / 2FA toggle -->
<label><input type="checkbox" id="otpToggle" style="width:auto"> Enable OTP / 2FA for this login (demo OTP shown on screen)</label>
<div id="otpBox" class="hidden"><input id="otpInput" placeholder="Enter 6-digit OTP"><button class="green" style="width:100%" onclick="verifyOTP()">Verify OTP &amp; Continue</button><p class="small" id="otpHint"></p></div>

<div class="box">Protected by Cyber Shield • Location-verified sign-in • Activity is logged for security.</div>
<button class="blue" style="width:100%" id="mainBtn" onclick="doAuth()">Sign In →</button>
<!-- Feature 1 : Forgot Password -->
<p class="small"><span class="link" onclick="forgotPassword()">Forgot Password?</span> • <span class="link" onclick="resendVerify()">Resend Verification Email</span></p>
<!-- Feature 4 : Lockout info --><p class="small" id="lockInfo"></p>
<!-- Feature 20 : PWA -->
<button class="ghost" style="width:100%" onclick="installPWA()">Install App (PWA)</button>
<button class="orange" style="width:100%;margin-top:8px" onclick="location.href='../index.html'">← Back</button>
<p id="msg" class="msg"></p>
<!-- Feature 9 : Login history preview (this device) -->
<details><summary>View My Login History (This Device)</summary><div id="historyBox" class="small"></div></details>
<!-- Feature 18 : Support ticket -->
<details><summary>Need Help? Create Support Ticket</summary><input id="ticketText" placeholder="Describe your issue"><button class="green" onclick="createTicket()">Create Ticket</button><div id="ticketBox" class="small"></div></details>
<p class="small">Cyber Shield • Privacy • Terms • Version 4.0 • All 20 Features</p>
</div></div>
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js"></script>
<script src="mode2-config.js"></script>
<script src="mode2-location.js"></script>
<script src="mode2-mail.js"></script>
<script>
let mode='login', pendingCred=null, pendingUser=null, pendingLoc=null, demoOTP='';
let deferredPrompt=null; window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;});
function installPWA(){ if(deferredPrompt){deferredPrompt.prompt();} else alert('On mobile: Share / Add to Home Screen to install Cyber Shield as an app. (Feature 20: PWA)'); }
// Theme Builder - Feature 16
function applyTheme(){ const th=document.getElementById('themeSel').value; const ac=document.getElementById('accentPick').value; document.documentElement.style.setProperty('--accentColor',ac); localStorage.setItem('cyber_theme',th); localStorage.setItem('cyber_accent',ac); }
document.getElementById('themeSel').addEventListener('change',applyTheme); document.getElementById('accentPick').addEventListener('input',applyTheme);
document.getElementById('themeSel').value=localStorage.getItem('cyber_theme')||'dark'; document.getElementById('accentPick').value=localStorage.getItem('cyber_accent')||'#00d4ff'; applyTheme();
function setMsg(m,ok){ const el=document.getElementById('msg'); el.innerText=m; el.className='msg'+(ok?' ok':''); }
function togglePass(){ const p=document.getElementById('uPass'); p.type=p.type==='password'?'text':'password'; }
// Feature 3
document.getElementById('uPass').addEventListener('input',e=>{ const v=e.target.value; let s=0; if(v.length>=8)s++; if(/[A-Z]/.test(v))s++; if(/[0-9]/.test(v))s++; if(/[^A-Za-z0-9]/.test(v))s++; const pct=[0,25,50,75,100][s]; const label=['—','Weak','Medium','Good','Strong'][s]; const col=['#555','#ff4444','#ff8800','#00d4ff','#00ff88'][s]; const b=document.getElementById('strengthBar'); b.style.width=pct+'%'; b.style.background=col; document.getElementById('strengthText').innerText='Password strength: '+label; });
function showTab(m){ mode=m; document.getElementById('tabLogin').className=m==='login'?'active':''; document.getElementById('tabReg').className=m==='register'?'active':''; document.getElementById('mainBtn').innerHTML=m==='login'?'Sign In →':'Create Account →'; ['uName','uPhone','uCity','uState'].forEach(id=>document.getElementById(id).style.display=m==='register'?'block':'none'); }
showTab('login');
async function getLocation(){ try{ if(window.getCurrentLocation) return await window.getCurrentLocation(); }catch(e){} return await new Promise(res=>{ if(!navigator.geolocation) return res(null); navigator.geolocation.getCurrentPosition(p=>res({lat:p.coords.latitude,lng:p.coords.longitude,accuracy:p.coords.accuracy}),()=>res(null),{timeout:8000}); }); }
async function getGlobalSettings(){ try{ const d=await window.CyberDB.collection('settings').doc('global').get(); if(d.exists) return d.data(); }catch(e){} return {lockdown:false,broadcast:''}; }
// Feature 4: 5 wrong tries = 15 min lock (per email, stored locally + Firestore attempt log)
function lockKey(email){ return 'cyber_lock_'+email.toLowerCase(); }
function isLocked(email){ const d=JSON.parse(localStorage.getItem(lockKey(email))||'null'); if(d && Date.now()<d.until){ document.getElementById('lockInfo').innerText='Account temporarily locked. Try again in '+Math.ceil((d.until-Date.now())/60000)+' minute(s). (Feature 4)'; return true; } return false; }
function recordFail(email){ const k=lockKey(email); const d=JSON.parse(localStorage.getItem(k)||'{"count":0}'); d.count++; if(d.count>=5){ d.until=Date.now()+15*60000; d.count=0; setMsg('Too many failed attempts. Locked for 15 minutes.'); } localStorage.setItem(k,JSON.stringify(d)); }
function clearFail(email){ localStorage.removeItem(lockKey(email)); }
// Feature 9 + 7 + 8 helpers
function saveHistory(email,ok,loc){ const h=JSON.parse(localStorage.getItem('cyber_history')||'[]'); h.unshift({email,time:new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'}),ok:!!ok,device:navigator.userAgent.slice(0,60),lat:loc?loc.lat:'',lng:loc?loc.lng:''}); localStorage.setItem('cyber_history',JSON.stringify(h.slice(0,30))); renderHistory(); }
function renderHistory(){ const h=JSON.parse(localStorage.getItem('cyber_history')||'[]'); document.getElementById('historyBox').innerHTML=h.length?h.map(x=>x.time+' • '+(x.ok?'✅ Success':'❌ Failed')+' • '+x.device).join('<br>'):'No logins on this device yet.'; }
renderHistory();
// Feature 7: trusted device
function trustedKey(email){ return 'cyber_trusted_'+email.toLowerCase()+'_'+(navigator.userAgent||'').slice(0,40); }
function checkTrusted(email){ if(!localStorage.getItem(trustedKey(email))){ if(confirm('New device detected. Trust this device for future logins? (Feature 7: Trusted Device)')) localStorage.setItem(trustedKey(email),'1'); } }
async function createAdminRequest(uid,u){ try{ const q=await window.CyberDB.collection('admin_requests').where('uid','==',uid).where('status','==','pending').get(); if(!q.empty) return; await window.CyberDB.collection('admin_requests').add({uid,email:u.email||'',name:u.name||'',phone:u.phone||'',city:u.city||'',state:u.state||'',status:'pending',createdAt:firebase.firestore.FieldValue.serverTimestamp()}); }catch(e){} }
// Feature 1
async function forgotPassword(){ const email=document.getElementById('uEmail').value.trim(); if(!email) return setMsg('Enter your email first, then click Forgot Password.'); try{ await window.CyberAuth.sendPasswordResetEmail(email); setMsg('Password reset link sent. Check inbox + spam.',true); }catch(e){ setMsg(e.message.replace('Firebase: ','')); } }
async function resendVerify(){ const email=document.getElementById('uEmail').value.trim(),pass=document.getElementById('uPass').value.trim(); if(!email||!pass) return setMsg('Enter email + password to resend verification.'); try{ const c=await window.CyberAuth.signInWithEmailAndPassword(email,pass); await c.user.sendEmailVerification(); await window.CyberAuth.signOut(); setMsg('Verification email sent.',true); }catch(e){ setMsg(e.message.replace('Firebase: ','')); } }
// Feature 18
function createTicket(){ const t=document.getElementById('ticketText').value.trim(); const email=document.getElementById('uEmail').value.trim(); if(!t) return alert('Write your issue first.'); const all=JSON.parse(localStorage.getItem('cyber_tickets')||'[]'); all.unshift({email:email||'guest',text:t,time:new Date().toLocaleString(),status:'Open'}); localStorage.setItem('cyber_tickets',JSON.stringify(all)); document.getElementById('ticketBox').innerHTML='Ticket created. Status: Open. Admin will reply in Dashboard (Feature 18).'; try{ window.CyberDB.collection('support_tickets').add({email,text:t,status:'Open',createdAt:firebase.firestore.FieldValue.serverTimestamp()}); }catch(e){} }
async function finishLogin(cred,u,loc){ checkTrusted(cred.user.email); if(window.logSIEMCloud) await window.logSIEMCloud('login_success',{email:cred.user.email,role:u.role,location:loc}); if(window.sendAuthMail) await window.sendAuthMail('login',{email:cred.user.email,name:u.name||'',location:loc,time:new Date().toISOString()}); localStorage.setItem('cyber_current_user',u.email); localStorage.setItem('cyber_role',u.role); // Feature 8: session record
  const s=JSON.parse(localStorage.getItem('cyber_sessions')||'[]'); s.unshift({email:u.email,time:new Date().toLocaleString(),device:navigator.userAgent.slice(0,60)}); localStorage.setItem('cyber_sessions',JSON.stringify(s.slice(0,10))); setMsg('Welcome back. Redirecting...',true); location.href=(u.role==='admin'||u.role==='super_admin')?'mode2-dashboard-v4.html':'mode2-dashboard-v4.html'; }
async function doAuth(){
  const email=document.getElementById('uEmail').value.trim(), pass=document.getElementById('uPass').value.trim();
  if(!email||pass.length<8) return setMsg('Enter a valid email and a password of at least 8 characters.');
  if(isLocked(email)) return;
  setMsg('Verifying location and signing in...');
  const loc=await getLocation(); if(!loc) return setMsg('Location verification is required. Allow location and try again.');
  try{
    if(mode==='login'){
      const cred=await window.CyberAuth.signInWithEmailAndPassword(email,pass); await cred.user.reload();
      if(!cred.user.emailVerified){ setMsg('Email not verified. Check inbox + spam, click verify link, then sign in.'); await window.CyberAuth.signOut(); return; }
      const doc=await window.CyberDB.collection('users').doc(cred.user.uid).get(); if(!doc.exists){ setMsg('Account not found. Please create an account.'); return; }
      const u=doc.data(); if(u.blocked){ setMsg('This account is restricted. Contact support.'); await window.CyberAuth.signOut(); return; }
      const gs=await getGlobalSettings(); if(gs.lockdown && u.role!=='super_admin'){ setMsg('Platform is in lockdown. Only Super Admin can sign in.'); await window.CyberAuth.signOut(); return; }
      const picked=document.getElementById('roleSel').value; if(picked==='admin' && u.role!=='admin' && u.role!=='super_admin'){ await createAdminRequest(cred.user.uid,u); setMsg('Admin request sent. Waiting for approval.'); }
      clearFail(email); saveHistory(email,true,loc);
      // Feature 6: OTP
      if(document.getElementById('otpToggle').checked){ demoOTP=String(Math.floor(100000+Math.random()*900000)); pendingCred=cred; pendingUser=u; pendingLoc=loc; document.getElementById('otpBox').classList.remove('hidden'); document.getElementById('otpHint').innerText='DEMO OTP (connect email/SMS in production): '+demoOTP; try{ window.CyberDB.collection('otp_codes').add({email,code:demoOTP,createdAt:firebase.firestore.FieldValue.serverTimestamp()}); }catch(e){} setMsg('OTP generated. Enter it below.'); return; }
      await finishLogin(cred,u,loc);
    } else {
      const name=document.getElementById('uName').value.trim()||email.split('@')[0]; const phone=document.getElementById('uPhone').value.trim(), city=document.getElementById('uCity').value.trim(), state=document.getElementById('uState').value.trim(); let role=document.getElementById('roleSel').value; const wantsAdmin=(role==='admin');
      if(email.toLowerCase()===String(window.SUPER_ADMIN_EMAIL||'').toLowerCase()){ role='super_admin'; } else if(wantsAdmin){ role='user'; }
      const cred2=await window.CyberAuth.createUserWithEmailAndPassword(email,pass); try{ await cred2.user.sendEmailVerification(); }catch(e){}
      await window.CyberDB.collection('users').doc(cred2.user.uid).set({email,name,phone,city,state,role,blocked:false,emailVerified:false,location:loc,createdAt:firebase.firestore.FieldValue.serverTimestamp()});
      if(wantsAdmin) await createAdminRequest(cred2.user.uid,{email,name,phone,city,state});
      if(window.logSIEMCloud) await window.logSIEMCloud('signup',{email,role,location:loc}); if(window.sendAuthMail) await window.sendAuthMail('register',{email,name,phone,city,state,location:loc,time:new Date().toISOString()});
      setMsg(wantsAdmin?'Account created. Admin request sent. Verify email before sign-in.':'Account created. Verify email, then sign in.',true); await window.CyberAuth.signOut(); showTab('login');
    }
  }catch(e){ recordFail(email); saveHistory(email,false,loc); setMsg(e.message.replace('Firebase: ','').replace('auth/','')); if(window.logSIEMCloud) await window.logSIEMCloud('login_failed',{email,error:e.message,location:loc}); }
}
async function verifyOTP(){ if(document.getElementById('otpInput').value.trim()===demoOTP && pendingCred){ setMsg('OTP verified.',true); await finishLogin(pendingCred,pendingUser,pendingLoc); } else setMsg('Wrong OTP. Try again.'); }
(async()=>{ try{ const gs=await getGlobalSettings(); if(gs.broadcast){ const b=document.getElementById('broadcastBar'); b.classList.remove('hidden'); b.innerText='📣 '+gs.broadcast; } if(gs.lockdown){ const l=document.getElementById('lockdownBar'); l.classList.remove('hidden'); l.innerText='🔒 Platform is in lockdown.'; } }catch(e){} })();
</script><script>(function(){var loc=location.href.replace(/#.*$/,"");var ATTR_NAMES=["data-product-id","data-productid","data-product_id","product-id","productid","product_id","data-source-entity-id","source-entity-id","source_entity_id","data-product","data-metadata","data-meta"];var DATASET_KEYS=["productId","productid","product_id","sourceEntityId","sourceentityid","source_entity_id","product","metadata","meta"];function readProductId(value){if(typeof value!=="string"||value.length===0)return null;if(/^[0-9]{6,}$/.test(value))return value;var match=value.match(/(?:product(?:_|-)?id|source(?:_|-)?entity(?:_|-)?id)["'=:\s]+([0-9]{6,})/i);return match?match[1]:null}function extractProductId(start){for(var node=start;node&&node!==document.body;node=node.parentElement){for(var i=0;i<ATTR_NAMES.length;i++){var attrValue=node.getAttribute&&node.getAttribute(ATTR_NAMES[i]);var attrProductId=readProductId(attrValue);if(attrProductId)return attrProductId}var dataset=node.dataset||null;if(dataset){for(var j=0;j<DATASET_KEYS.length;j++){var dataValue=dataset[DATASET_KEYS[j]];var dataProductId=readProductId(dataValue);if(dataProductId)return dataProductId}}}return null}function isInlineMediaSlotElement(node){return !!(node&&node.getAttribute&&node.getAttribute("data-clippy-inline-media-slot")!==null)}function findInlineMediaSlot(start){for(var node=start;node&&node!==document.body;node=node.parentElement){if(isInlineMediaSlotElement(node))return node}return null}function readInlineMediaUrl(node){if(!node)return null;return node.getAttribute&&((node.getAttribute("data-clippy-inline-media-url")||node.getAttribute("data-url")||node.getAttribute("data_url")))||node.href||null}function stripHash(url){return String(url).replace(/#.*$/,"")}function urlsMatch(a,b){if(!a||!b)return false;try{return stripHash(new URL(a,loc).href)===stripHash(new URL(b,loc).href)}catch(_){return stripHash(a)===stripHash(b)}}function isFirstPartyReelUrl(value){try{var url=new URL(value,loc);if(url.protocol!=="https:")return false;var host=url.hostname.toLowerCase();var supported=host==="instagram.com"||host.endsWith(".instagram.com")||host==="facebook.com"||host.endsWith(".facebook.com");return supported&&/\/reels?\//i.test(url.pathname)}catch(_){return false}}function isInlineMediaUrlClick(node,href){var slot=findInlineMediaSlot(node);if(!slot)return false;var slotUrl=readInlineMediaUrl(slot);if(slotUrl)return urlsMatch(href,slotUrl);return isFirstPartyReelUrl(href)}function findDataHref(start){for(var node=start;node&&node!==document.body;node=node.parentElement){if(node.getAttribute){var href=node.getAttribute("data-href")||node.getAttribute("data-url");if(href)return{href:href,node:node}}}return null}var nativeOpen=window.open;window.open=function(url){if(parent!==window&&typeof url==="string"&&/^https?:\/\//.test(url)){parent.postMessage({type:"ecto:usercontent-link-click",href:url},"*");return null}return nativeOpen?nativeOpen.apply(window,arguments):null};document.addEventListener("click",function(e){var target=e.target instanceof Element?e.target:null;if(!target)return;if(parent===window)return;var a=target.closest?target.closest("a[href]"):null;if(a&&a.href&&/^https?:\/\//.test(a.href)&&a.href.replace(/#.*$/,"")!==loc){if(isInlineMediaUrlClick(a,a.href))return;var productId=extractProductId(target)||extractProductId(a);if(productId){e.preventDefault();parent.postMessage({type:"ecto-artifact-link-click",productId:productId},"*");return}e.preventDefault();parent.postMessage({type:"ecto:usercontent-link-click",href:a.href},"*");return}var dataHref=findDataHref(target);if(dataHref&&/^https?:\/\//.test(dataHref.href)&&dataHref.href.replace(/#.*$/,"")!==loc){if(isInlineMediaUrlClick(dataHref.node,dataHref.href))return;e.preventDefault();parent.postMessage({type:"ecto:usercontent-link-click",href:dataHref.href},"*")}},true)})();</script><script>(function(){var FOCUS_TYPE="ecto:artifact-focus-request";var CLOSE_TYPE="ecto:artifact-close-request";function focusArtifactDocument(){var body=document.body;if(!body)return;try{window.focus();}catch(e){}if(!body.hasAttribute("tabindex"))body.setAttribute("tabindex","-1");try{body.focus({preventScroll:true});}catch(e){try{body.focus();}catch(e2){}}}window.addEventListener("message",function(event){if(event.source!==window.parent)return;var data=event.data;if(!data||typeof data!=="object"||data.type!==FOCUS_TYPE)return;if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",focusArtifactDocument,{once:true});return;}focusArtifactDocument();});window.addEventListener("keydown",function(event){if(event.key!=="Escape")return;window.setTimeout(function(){if(event.defaultPrevented)return;window.parent.postMessage({type:CLOSE_TYPE},"*");},0);});})();</script></body></html>
