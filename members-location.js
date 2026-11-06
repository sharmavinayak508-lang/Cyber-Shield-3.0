// CYBER SHIELD 3.0 - MEMBER LOCATION SYSTEM
// Jab banda Register / Login karega, uski Location auto save hogi (Browser GPS + IP)
// Admin Globe pe click karega toh us Area ke Members dikhenge

// 1. Location Capture - Login/Register ke time call karo
window.captureMemberLocation = async function(username){
  let loc = {city:'Unknown', state:'Unknown', country:'India', lat:28.6139, lng:77.2090, ip:'', time:new Date().toISOString()};
  // A. Browser GPS try karo
  try{
    if(navigator.geolocation){
      let pos = await new Promise((res,rej)=>{ navigator.geolocation.getCurrentPosition(res, rej, {timeout:5000}); });
      loc.lat = pos.coords.latitude; loc.lng = pos.coords.longitude;
      // Reverse Geocode - Free API, no key needed
      try{
        let r = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${loc.lat}&longitude=${loc.lng}&localityLanguage=en`);
        let j = await r.json();
        loc.city = j.city || j.locality || 'Unknown';
        loc.state = j.principalSubdivision || 'Unknown';
        loc.country = j.countryName || 'India';
      }catch(e){}
    }
  }catch(e){ console.log('GPS denied, IP location use hogi'); }
  // B. IP se location (GPS nahi mila toh)
  if(loc.city==='Unknown'){
    try{
      let r = await fetch('https://ipapi.co/json/');
      let j = await r.json();
      loc.city = j.city || loc.city; loc.state = j.region || loc.state; loc.country = j.country_name || loc.country;
      loc.lat = j.latitude || loc.lat; loc.lng = j.longitude || loc.lng; loc.ip = j.ip || '';
    }catch(e){}
  }
  // C. Save karo - localStorage me
  let all = JSON.parse(localStorage.getItem('cyber_members')||'[]');
  let idx = all.findIndex(m=>m.username===username);
  let member = {username, email:localStorage.getItem('last_email')||'', phone:localStorage.getItem('last_phone')||'', role:localStorage.getItem('role')||'user', ...loc, lastSeen:new Date().toISOString()};
  if(idx>=0) all[idx]=member; else all.push(member);
  localStorage.setItem('cyber_members', JSON.stringify(all));
  return member;
};

// 2. Globe Click pe - Us Area ke Members dhoondo (50km / State / Country)
window.findMembersNear = function(clickLat, clickLng, clickCity, clickState, clickCountry){
  let all = JSON.parse(localStorage.getItem('cyber_members')||'[]');
  if(all.length===0){
    // Demo members - Agar koi real member nahi hai toh demo dikhao taaki feature samajh aaye
    all = [
      {username:'vinayak', city:'Sadhaura', state:'Haryana', country:'India', lat:30.25, lng:77.20, role:'admin', lastSeen:new Date().toISOString()},
      {username:'rahul', city:'Delhi', state:'Delhi', country:'India', lat:28.61, lng:77.20, role:'user', lastSeen:new Date().toISOString()},
      {username:'priya', city:'Mumbai', state:'Maharashtra', country:'India', lat:19.07, lng:72.87, role:'user', lastSeen:new Date().toISOString()},
      {username:'amit', city:'Jaipur', state:'Rajasthan', country:'India', lat:26.91, lng:75.78, role:'user', lastSeen:new Date().toISOString()},
      {username:'sneha', city:'Bangalore', state:'Karnataka', country:'India', lat:12.97, lng:77.59, role:'user', lastSeen:new Date().toISOString()},
      {username:'arjun', city:'New York', state:'New York', country:'United States', lat:40.71, lng:-74.00, role:'user', lastSeen:new Date().toISOString()},
    ];
  }
  // Distance calculate
  function dist(lat1,lng1,lat2,lng2){
    let R=6371, dLat=(lat2-lat1)*Math.PI/180, dLng=(lng2-lng1)*Math.PI/180;
    let a=Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
    return R*2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }
  let near = [], sameCity=[], sameState=[], sameCountry=[];
  all.forEach(m=>{
    let d = dist(clickLat, clickLng, m.lat||28.61, m.lng||77.20);
    m.distanceKm = Math.round(d);
    if(d < 100) near.push(m);
    if(m.city===clickCity) sameCity.push(m);
    if(m.state===clickState) sameState.push(m);
    if(m.country===clickCountry) sameCountry.push(m);
  });
  return {near, sameCity, sameState, sameCountry, all, clickCity, clickState, clickCountry};
};

// 3. Reverse Geocode for Globe Click
window.reverseGeocodeGlobe = async function(lat,lng){
  try{
    let r = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
    let j = await r.json();
    return {city:j.city||j.locality||'Unknown', state:j.principalSubdivision||'Unknown', country:j.countryName||'Unknown', lat, lng};
  }catch(e){ return {city:'Unknown', state:'Unknown', country:'Unknown', lat, lng}; }
};
