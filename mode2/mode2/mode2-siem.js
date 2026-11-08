// ============================================
// FILE NAME: mode2-siem.js
// KAAM: SIEM Logs - DUAL WRITE
// MODE 1: localStorage (hamesha) + MODE 2: Firestore (jab Firebase ready ho)
// USE: Isko purani siem-backend.js ki jagah ya uske baad load karo.
// Baaki code same rahega - window.logSIEM same hai.
// ============================================
(function(){
  window.CyberSIEM = {
    logs: JSON.parse(localStorage.getItem('cyber_siem_logs')||'[]'),
    log: function(event, data){
      var entry = { time: new Date().toISOString(), event: event, data: data||{}, ip: 'demo-ip', userAgent: navigator.userAgent.slice(0,120), mode: (window.CyberMode ? window.CyberMode.getMode() : 'demo') };
      this.logs.push(entry);
      if(this.logs.length>500) this.logs = this.logs.slice(-500);
      localStorage.setItem('cyber_siem_logs', JSON.stringify(this.logs));
      console.log('[SIEM]', event, data);
      try{
        var fb = window.CyberFirebase;
        if(fb && fb.ready && fb.db) fb.db.collection('siem_logs').add(entry).catch(function(){});
      }catch(e){}
      return entry;
    },
    getLogs: function(){ return this.logs; },
    clear: function(){ this.logs=[]; localStorage.removeItem('cyber_siem_logs'); }
  };
  window.logSIEM = function(e,d){ return window.CyberSIEM.log(e,d); };
})();
