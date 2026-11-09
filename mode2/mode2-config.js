// FILE NAME: mode2-config.js
// Path: mode2/mode2-config.js
// Kaam: Firebase connect + CyberAuth + CyberDB + CyberNow + Super Admin
// FIXED: Iron Dom (irondom674@gmail.com) ab asli Super Admin hai.
// Vinayak wali purani mail bhi backup Super Admin rakhi hai, taaki koi ek bhi
// fail ho to dusri se Dashboard khul jaye.

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

// 👑 Super Admin - Inki mail se AdminBox khulega Dashboard me
window.SUPER_ADMIN_EMAIL = "irondom674@gmail.com";
window.SUPER_ADMIN_EMAILS = ["irondom674@gmail.com", "vinayak@cybershield.com"];
window.isSuperAdminEmail = function(email){
  if(!email) return false;
  var e = String(email).toLowerCase().trim();
  return window.SUPER_ADMIN_EMAILS.indexOf(e) !== -1;
};

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
