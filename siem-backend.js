// CYBER SHIELD 3.0 - REAL SIEM BACKEND via Firestore
// Collection: siem_logs - Each log = {type, ip, message, level, timestamp, user}
// Admin Dashboard will read LIVE from Firestore + fallback to demo if offline
// To push a log: window.pushSIEMLog('auth','192.168.1.5','Failed login','high')

window.pushSIEMLog = async function(type, ip, message, level){
  try{
    if(!window.firebaseDB) return false;
    const { collection, addDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");
    await addDoc(collection(window.firebaseDB, 'siem_logs'), {type:type||'syslog', ip:ip||'192.168.1.1', message:message||'Log', level:level||'info', username:localStorage.getItem('username')||'system', timestamp:serverTimestamp()});
    return true;
  }catch(e){ console.log('SIEM push offline, using demo', e); return false; }
};
window.listenSIEMLive = async function(callback){
  try{
    if(!window.firebaseDB) return false;
    const { collection, query, orderBy, limit, onSnapshot } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");
    const q = query(collection(window.firebaseDB, 'siem_logs'), orderBy('timestamp','desc'), limit(50));
    onSnapshot(q, (snap)=>{ let logs=[]; snap.forEach(d=>logs.push(d.data())); callback(logs); });
    return true;
  }catch(e){ return false; }
};
// Auto-push login / containment actions to SIEM
window.siemLogAction = function(action){ window.pushSIEMLog('audit','127.0.0.1', action, 'info'); };
