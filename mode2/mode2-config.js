// FILE NAME: mode2-config.js
// 【entity-GitHub¦canonical_name=GitHub】 Path: mode2/mode2-config.js
// Kaam: Firebase connect + CyberAuth + CyberDB + CyberNow + Super Admin
// Tera Asli Config - Neeche daal diya hai, kuch badalna nahi hai!

var firebaseConfig = {
  apiKey: "AIzaSyCQilWZIBkHNXPgb2SyEkEItjL6Syhug_c",
  authDomain: "cyber-shield-11c28.firebaseapp.com",
  projectId: "cyber-shield-11c28",
  storageBucket: "cyber-shield-11c28.firebasestorage.app",
  messagingSenderId: "1078658729202",
  appId: "1:1078658729202:web:2a9028ca291d600dbbbc6b"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

window.CyberAuth = firebase.auth();
window.CyberDB = firebase.firestore();

// 👑 Super Admin - Iski mail se AdminBox khulega Dashboard me
window.SUPER_ADMIN_EMAIL = "vinayak@cybershield.com";

// 🕐 Time - IST me, Dashboard + Login dono isi ko use karte hain
window.CyberNow = function(){
  var d = new Date();
  return {
    iso: d.toISOString(),
    display: d.toLocaleString('en-IN', {timeZone:'Asia/Kolkata', day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit', hour12:true}) + ' IST',
    ts: Date.now()
  };
};
console.log('✅ Cyber Shield Firebase Connected: cyber-shield-11c28');
