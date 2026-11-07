// CYBER SHIELD 3.0 - SUPER ADMIN CONTROL + EXTRA ADMIN FEATURES
// Rule: Sirf 1 Super Admin hoga (pehla wala - 'admin'). Wahi dusre Admin ko Allow karega.
// File ko login.html + admin_dashboard.html dono me add karo:
// <script src="admin-control.js"></script>

(function(){
  // ---- STORAGE KEYS ----
  var USERS_KEY='cyber_users', PENDING_KEY='cyber_admin_requests', BLOCKED_KEY='cyber_blocked_users';

  function getUsers(){ try{ return JSON.parse(localStorage.getItem(USERS_KEY)||'[]'); }catch(e){ return []; } }
  function saveUsers(u){ localStorage.setItem(USERS_KEY, JSON.stringify(u)); }
  function getPending(){ try{ return JSON.parse(localStorage.getItem(PENDING_KEY)||'[]'); }catch(e){ return []; } }
  function savePending(p){ localStorage.setItem(PENDING_KEY, JSON.stringify(p)); }
  function getBlocked(){ try{ return JSON.parse(localStorage.getItem(BLOCKED_KEY)||'[]'); }catch(e){ return []; } }
  function saveBlocked(b){ localStorage.setItem(BLOCKED_KEY, JSON.stringify(b)); }

  // ---- SUPER ADMIN = Pehla Admin ----
  // Agar koi admin nahi hai, toh pehla register hone wala hi Super Admin banega.
  window.getSuperAdmin = function(){
    var users = getUsers();
    var admins = users.filter(function(u){ return u.role==='admin' || u.role==='super_admin'; });
    if(admins.length===0) return null;
    var sup = admins.find(function(u){ return u.role==='super_admin'; });
    return sup || admins[0];
  };
  window.isSuperAdmin = function(username){
    var sup = window.getSuperAdmin();
    if(!sup) return false;
    return sup.username===username || sup.name===username;
  };

  // ---- NAYA ADMIN BANNE KI REQUEST ----
  // Koi bhi khud se Admin nahi ban sakta. Request jayegi Super Admin ke paas.
  window.requestAdminAccess = function(username, phone, email){
    var pending = getPending();
    if(pending.find(function(p){ return p.username===username; })) return {ok:false, msg:'Request pehle se Pending hai!'};
    pending.push({username:username, phone:phone||'', email:email||'', time:new Date().toISOString(), status:'pending'});
    savePending(pending);
    if(window.logSIEM) window.logSIEM('admin_request', {username:username});
    return {ok:true, msg:'Request Super Admin ko bhej di! Approve hone ke baad hi Admin banoge.'};
  };

  // ---- SUPER ADMIN: APPROVE / REJECT ----
  window.approveAdmin = function(currentUser, username){
    if(!window.isSuperAdmin(currentUser)) return {ok:false, msg:'Sirf Super Admin approve kar sakta hai!'};
    var pending = getPending();
    var idx = pending.findIndex(function(p){ return p.username===username; });
    if(idx===-1) return {ok:false, msg:'Request nahi mili!'};
    pending.splice(idx,1); savePending(pending);
    var users = getUsers();
    var u = users.find(function(x){ return x.username===username; });
    if(u){ u.role='admin'; u.approvedBy=currentUser; u.approvedAt=new Date().toISOString(); saveUsers(users); }
    else { users.push({username:username, role:'admin', approvedBy:currentUser, approvedAt:new Date().toISOString()}); saveUsers(users); }
    if(window.logSIEM) window.logSIEM('admin_approved', {by:currentUser, user:username});
    return {ok:true, msg: username + ' ab Admin ban gaya!'};
  };
  window.rejectAdmin = function(currentUser, username){
    if(!window.isSuperAdmin(currentUser)) return {ok:false, msg:'Sirf Super Admin reject kar sakta hai!'};
    var pending = getPending(); var idx = pending.findIndex(function(p){ return p.username===username; });
    if(idx!==-1){ pending.splice(idx,1); savePending(pending); }
    if(window.logSIEM) window.logSIEM('admin_rejected', {by:currentUser, user:username});
    return {ok:true, msg: username + ' ki request Reject kar di!'};
  };

  // ---- EXTRA ADMIN FEATURES ----
  // 1. User ko Block / Unblock (Super Admin + Admin dono kar sakte, Super Admin ko koi block nahi kar sakta)
  window.blockUser = function(by, username){
    if(window.isSuperAdmin(username)) return {ok:false, msg:'Super Admin ko block nahi kar sakte!'};
    var b=getBlocked(); if(!b.includes(username)){ b.push(username); saveBlocked(b); }
    if(window.logSIEM) window.logSIEM('user_blocked', {by:by, user:username});
    return {ok:true, msg: username + ' Blocked!'};
  };
  window.unblockUser = function(by, username){
    var b=getBlocked(); b=b.filter(function(x){ return x!==username; }); saveBlocked(b);
    if(window.logSIEM) window.logSIEM('user_unblocked', {by:by, user:username});
    return {ok:true, msg: username + ' Unblocked!'};
  };
  window.isBlocked = function(username){ return getBlocked().includes(username); };

  // 2. Admin se wapas User banana (Demote) - Sirf Super Admin
  window.demoteAdmin = function(by, username){
    if(!window.isSuperAdmin(by)) return {ok:false, msg:'Sirf Super Admin demote kar sakta hai!'};
    if(window.isSuperAdmin(username)) return {ok:false, msg:'Super Admin ko demote nahi kar sakte!'};
    var users=getUsers(); var u=users.find(function(x){ return x.username===username; });
    if(u){ u.role='user'; saveUsers(users); }
    if(window.logSIEM) window.logSIEM('admin_demoted', {by:by, user:username});
    return {ok:true, msg: username + ' ab User ban gaya!'};
  };

  // 3. Member Delete - Sirf Super Admin
  window.deleteMember = function(by, username){
    if(!window.isSuperAdmin(by)) return {ok:false, msg:'Sirf Super Admin delete kar sakta hai!'};
    if(window.isSuperAdmin(username)) return {ok:false, msg:'Super Admin ko delete nahi kar sakte!'};
    var users=getUsers().filter(function(x){ return x.username!==username; }); saveUsers(users);
    if(window.logSIEM) window.logSIEM('member_deleted', {by:by, user:username});
    return {ok:true, msg: username + ' Delete ho gaya!'};
  };

  // 4. Emergency Lockdown - Sabka Login Band (Sirf Super Admin)
  window.setLockdown = function(by, on){
    if(!window.isSuperAdmin(by)) return {ok:false, msg:'Sirf Super Admin lockdown kar sakta hai!'};
    localStorage.setItem('cyber_lockdown', on?'on':'off');
    if(window.logSIEM) window.logSIEM('lockdown', {by:by, on:on});
    return {ok:true, msg: on?'LOCKDOWN ON - Sabka Login Band!':'Lockdown OFF - Login Chalu!'};
  };
  window.isLockdown = function(){ return localStorage.getItem('cyber_lockdown')==='on'; };

  // 5. Broadcast Message - Sabko dikhega
  window.broadcastMessage = function(by, msg){
    localStorage.setItem('cyber_broadcast', JSON.stringify({by:by, msg:msg, time:new Date().toISOString()}));
    if(window.logSIEM) window.logSIEM('broadcast', {by:by, msg:msg});
    return {ok:true, msg:'Broadcast bhej diya!'};
  };
  window.getBroadcast = function(){ try{ return JSON.parse(localStorage.getItem('cyber_broadcast')||'null'); }catch(e){ return null; } };

  // ---- ADMIN PANEL UI (Admin Dashboard me auto dikhega) ----
  window.renderSuperAdminPanel = function(currentUser){
    var el = document.getElementById('superAdminPanel');
    if(!el) return;
    var sup = window.getSuperAdmin();
    var pending = getPending();
    var users = getUsers();
    var isSup = window.isSuperAdmin(currentUser);
    var html = '<div style="background:#0a1628;border:1px solid #00d4ff;border-radius:12px;padding:14px;margin:10px 0;color:#fff">';
    html += '<h3>👑 Super Admin Control</h3>';
    html += '<p>Super Admin: <b>'+(sup?sup.username:'Koi nahi - Pehla Admin hi Super Admin banega')+'</b> | Tum: <b>'+currentUser+(isSup?' (Super Admin 👑)':' (Admin)')+'</b> | Lockdown: <b>'+(window.isLockdown()?'🔴 ON':'🟢 OFF')+'</b></p>';
    html += '<h4>⏳ Pending Admin Requests ('+pending.length+')</h4>';
    if(pending.length===0) html += '<p>Koi request nahi hai.</p>';
    pending.forEach(function(p){
      html += '<div style="display:flex;justify-content:space-between;gap:8px;background:rgba(255,255,255,0.06);padding:8px;border-radius:8px;margin:6px 0"><span>'+p.username+' ('+p.email+')</span><span>';
      if(isSup){ html += '<button onclick="window.approveAdmin(\''+currentUser+'\',\''+p.username+'\');window.renderSuperAdminPanel(\''+currentUser+'\');alert(\'Approved!\')" style="background:#00ff88;border:0;padding:6px 10px;border-radius:8px;font-weight:800;cursor:pointer">✅ Approve</button> <button onclick="window.rejectAdmin(\''+currentUser+'\',\''+p.username+'\');window.renderSuperAdminPanel(\''+currentUser+'\');alert(\'Rejected!\')" style="background:#ff3b3b;color:#fff;border:0;padding:6px 10px;border-radius:8px;font-weight:800;cursor:pointer">❌ Reject</button>'; }
      else { html += '<i>Sirf Super Admin Approve kar sakta hai</i>'; }
      html += '</span></div>';
    });
    html += '<h4>👥 All Members ('+users.length+')</h4>';
    users.forEach(function(u){
      var blocked = window.isBlocked(u.username) ? ' 🚫 Blocked' : '';
      html += '<div style="display:flex;justify-content:space-between;gap:8px;background:rgba(255,255,255,0.04);padding:6px 8px;border-radius:8px;margin:4px 0"><span>'+u.username+' - '+u.role+blocked+'</span><span>';
      if(isSup && !window.isSuperAdmin(u.username)){
        html += '<button onclick="window.blockUser(\''+currentUser+'\',\''+u.username+'\');window.renderSuperAdminPanel(\''+currentUser+'\')" style="padding:4px 8px;border-radius:6px;cursor:pointer">🚫 Block</button> ';
        html += '<button onclick="window.unblockUser(\''+currentUser+'\',\''+u.username+'\');window.renderSuperAdminPanel(\''+currentUser+'\')" style="padding:4px 8px;border-radius:6px;cursor:pointer">✅ Unblock</button> ';
        if(u.role==='admin') html += '<button onclick="window.demoteAdmin(\''+currentUser+'\',\''+u.username+'\');window.renderSuperAdminPanel(\''+currentUser+'\')" style="padding:4px 8px;border-radius:6px;cursor:pointer">⬇ Demote</button> ';
        html += '<button onclick="if(confirm(\'Delete '+u.username+'?\')){window.deleteMember(\''+currentUser+'\',\''+u.username+'\');window.renderSuperAdminPanel(\''+currentUser+'\')}" style="padding:4px 8px;border-radius:6px;cursor:pointer;background:#ff3b3b;color:#fff;border:0">🗑 Delete</button>';
      }
      html += '</span></div>';
    });
    if(isSup){
      html += '<div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">';
      html += '<button onclick="var r=window.setLockdown(\''+currentUser+'\',!window.isLockdown());alert(r.msg);window.renderSuperAdminPanel(\''+currentUser+'\')" style="padding:8px 12px;border-radius:8px;background:#ffaa00;font-weight:800;cursor:pointer">🔒 Lockdown ON/OFF</button>';
      html += '<button onclick="var m=prompt(\'Broadcast Message likho:\');if(m){window.broadcastMessage(\''+currentUser+'\',m);alert(\'Broadcast bhej diya!\')}" style="padding:8px 12px;border-radius:8px;background:#00d4ff;font-weight:800;cursor:pointer">📣 Broadcast Bhejo</button>';
      html += '</div>';
    } else {
      html += '<p style="opacity:0.8">Lockdown / Delete / Demote sirf Super Admin kar sakta hai.</p>';
      html += '<button onclick="var r=window.requestAdminAccess(\''+currentUser+'\');alert(r.msg)" style="padding:8px 12px;border-radius:8px;background:#fff;font-weight:800;cursor:pointer">🙏 Super Admin Ko Request Bhejo</button>';
    }
    html += '</div>';
    el.innerHTML = html;
  };
})();

// Viewer = Read Only
window.canEdit=function(role){ return role==='admin'||role==='super_admin'; };
window.isViewer=function(role){ return role==='viewer'; };
