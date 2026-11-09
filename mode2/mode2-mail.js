// CYBER SHIELD MODE 2 - MAIL SYSTEM - mode2-mail.js
// Kaam: Register / Login pe user ko MAIL bhejna - Time + Location ke saath, Password KABHI NAHI
// Setup (1 baar, 5 min): https://www.emailjs.com -> Free account -> Email Service connect (Gmail) -> Email Template banao
// Phir neeche 3 cheezein bharo: PUBLIC_KEY, SERVICE_ID, TEMPLATE_ID
// GitHub me: mode2/ folder me ye file daalo - mode2-login.html ke paas

var EMAILJS_PUBLIC_KEY = 'YOUR_EMAILJS_PUBLIC_KEY'; // <-- Yahan EmailJS Public Key daalo
var EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';         // <-- Yahan Service ID daalo, jaise service_xxxx
var EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';       // <-- Yahan Template ID daalo, jaise template_xxxx

// EmailJS CDN load karo (agar pehle se load nahi hai)
(function(){ if(window.emailjs) return; var s=document.createElement('script'); s.src='https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js'; s.onload=function(){ try{ emailjs.init(EMAILJS_PUBLIC_KEY); }catch(e){} }; document.head.appendChild(s); })();

function formatLoc(loc){
  if(!loc) return 'Location not available';
  if(typeof loc === 'string') return loc;
  var t = '';
  if(loc.lat!==undefined) t += 'Lat: ' + loc.lat + ', Lng: ' + loc.lng;
  if(loc.city) t += ' | ' + loc.city;
  if(loc.state) t += ', ' + loc.state;
  if(loc.accuracy) t += ' (Accuracy: ' + Math.round(loc.accuracy) + 'm)';
  return t || 'Location captured';
}

// MAIN FUNCTION - login.html isko call karta hai: window.sendAuthMail('register'|'login', {...})
window.sendAuthMail = async function(type, data){
  data = data || {};
  try{
    if(EMAILJS_PUBLIC_KEY === 'YOUR_EMAILJS_PUBLIC_KEY'){
      console.log('[Cyber Shield Mail] EmailJS Key nahi bhari - Mail nahi bheja. mode2-mail.js me key bharo. Data:', type, data);
      return false;
    }
    if(!window.emailjs){ console.log('[Cyber Shield Mail] EmailJS load nahi hua'); return false; }
    try{ emailjs.init(EMAILJS_PUBLIC_KEY); }catch(e){}
    var isRegister = (type === 'register');
    var subject = isRegister ? 'Welcome to Cyber Shield - Your Account Has Been Created' : 'Cyber Shield - New Sign-In Detected';
    var message = isRegister
      ? 'Hello ' + (data.name || 'User') + ',\n\nYou have created an account in Cyber Shield.\n\nAccount Email: ' + data.email + '\nRole: ' + (data.role || 'user') + '\nTime: ' + (data.time || new Date().toISOString()) + '\nLocation: ' + formatLoc(data.location) + '\n\nIf this was not you, please contact Super Admin immediately.\n\n- Team Cyber Shield'
      : 'Hello ' + (data.name || 'User') + ',\n\nYou have signed in to Cyber Shield.\n\nAccount Email: ' + data.email + '\nTime: ' + (data.time || new Date().toISOString()) + '\nLocation: ' + formatLoc(data.location) + '\n\nIf this was not you, please change your password and contact Super Admin immediately.\n\n- Team Cyber Shield';
    // NOTE: Password is NEVER sent in mail - by design
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email: data.email,
      to_name: data.name || data.email,
      subject: subject,
      message: message,
      user_email: data.email,
      user_name: data.name || '',
      login_time: data.time || new Date().toISOString(),
      login_location: formatLoc(data.location),
      event_type: type
    });
    console.log('[Cyber Shield Mail] Mail bheja gaya:', data.email, type);
    return true;
  }catch(e){ console.log('[Cyber Shield Mail] Fail:', e); return false; }
};
