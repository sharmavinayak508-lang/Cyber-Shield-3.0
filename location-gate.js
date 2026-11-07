// CYBER SHIELD 3.0 - LOCATION GATE
// Rule: Login se pehle Location Access maanga jayega. YES karega tabhi aage ja sakta hai. NO = Login Block.
// Location har login pe save hoti hai - Super Admin ko Admin/User ki Country + State + City dikhegi.
(function(){
  window.CyberLocation = {
    get: function(){ try{ return JSON.parse(localStorage.getItem('cyber_location')||'null'); }catch(e){ return null; } },
    isAllowed: function(){ return localStorage.getItem('cyber_location_allowed')==='yes' && !!this.get(); },
    logs: function(){ try{ return JSON.parse(localStorage.getItem('cyber_location_logs')||'[]'); }catch(e){ return []; } }
  };
  function saveLoc(loc, username){
    localStorage.setItem('cyber_location', JSON.stringify(loc));
    localStorage.setItem('cyber_location_allowed','yes');
    // Har user ki last location uske user record me save karo - Super Admin Dashboard me dikhegi
    try{
      var users = JSON.parse(localStorage.getItem('cyber_users')||'[]');
      if(username){
        var u = users.find(function(x){ return x.username===username; });
        if(u){ u.lastLocation = loc; u.lastLoginAt = new Date().toISOString(); localStorage.setItem('cyber_users', JSON.stringify(users)); }
      }
      var logs = JSON.parse(localStorage.getItem('cyber_location_logs')||'[]');
      logs.push({ username: username||localStorage.getItem('cyber_current_user')||'guest', time: new Date().toISOString(), city: loc.city||'', state: loc.state||'', country: loc.country||'', lat: loc.lat, lon: loc.lon, ip: loc.ip||'' });
      if(logs.length>500) logs = logs.slice(-500);
      localStorage.setItem('cyber_location_logs', JSON.stringify(logs));
    }catch(e){}
    if(window.logSIEM) window.logSIEM('location_allowed', { user: username||'', city: loc.city, state: loc.state, country: loc.country });
    return loc;
  }
  // GPS -> City/State/Country (free reverse-geocode, no key). Fail hua toh IP se.
  async function reverseGeocode(lat, lon){
    try{
      var r = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client?latitude='+lat+'&longitude='+lon+'&localityLanguage=en');
      var j = await r.json();
      return { city: j.city||j.locality||'', state: j.principalSubdivision||'', country: j.countryName||'', lat: lat, lon: lon, source: 'GPS' };
    }catch(e){ return { city:'', state:'', country:'', lat: lat, lon: lon, source:'GPS' }; }
  }
  async function ipLocation(){
    try{
      var r = await fetch('https://ipapi.co/json/'); var j = await r.json();
      return { city: j.city||'', state: j.region||'', country: j.country_name||'', lat: j.latitude, lon: j.longitude, ip: j.ip||'', source: 'IP' };
    }catch(e){ return { city:'', state:'', country:'', lat:null, lon:null, source:'IP' }; }
  }
  // YES dabane pe browser ka Location popup aayega. Allow karega tabhi aage.
  window.requestCyberLocation = async function(username){
    var statusEl = document.getElementById('locStatus');
    function setStatus(t){ if(statusEl) statusEl.innerText=t; var m=document.getElementById('msg'); if(m) m.innerText=t; }
    if(!('geolocation' in navigator)){ setStatus('📍 GPS nahi hai - IP se location le rahe hain...'); var ip = await ipLocation(); saveLoc(ip, username); return ip; }
    setStatus('📍 Location maang rahe hain... Browser me Allow dabao...');
    return new Promise(function(resolve){
      navigator.geolocation.getCurrentPosition(async function(pos){
        var loc = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        // IP bhi saath me le lo - teacher ko IP bhi dikhega
        var ip = await ipLocation(); if(ip && ip.ip) loc.ip = ip.ip; if(!loc.city) loc.city = ip.city||''; if(!loc.state) loc.state = ip.state||''; if(!loc.country) loc.country = ip.country||'';
        saveLoc(loc, username); setStatus('✅ Location Allowed: '+(loc.city||'')+', '+(loc.state||'')+', '+(loc.country||''));
        resolve(loc);
      }, async function(err){
        // NO / Deny kiya - Location Block, Login nahi hoga
        localStorage.setItem('cyber_location_allowed','no');
        setStatus('❌ Location Denied - Location Allow kiye bina Login nahi hoga. Page reload karke Allow dabao.');
        if(window.logSIEM) window.logSIEM('location_denied', { user: username||'', error: String(err && err.message || err) });
        resolve(null);
      }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
    });
  };
  window.denyCyberLocation = function(){
    localStorage.setItem('cyber_location_allowed','no');
    var m=document.getElementById('msg'); if(m) m.innerText='❌ Tumne Location Deny ki - Isliye Login Block hai. Location Allow karo tabhi System use kar paoge.';
    var g=document.getElementById('locationGate'); if(g) g.style.display='block';
    if(window.logSIEM) window.logSIEM('location_denied_manual', {});
  };
  // Login ke time: agar location pehle se allowed hai toh usko refresh karke user se jodo, nahi hai toh gate dikhao
  window.ensureLocationBeforeLogin = async function(username){
    if(window.CyberLocation.isAllowed()){
      var loc = window.CyberLocation.get(); saveLoc(loc, username); return loc;
    }
    return null; // Gate ko handle karne do - login yahin rukega
  };
})();
