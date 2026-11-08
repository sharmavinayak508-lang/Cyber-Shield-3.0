// ============================================
// FILE NAME: mode2-firebase.js
// KAAM: MODE 2 (Realistic) ko Firebase se jodta hai
// MODE 1 ko chhedta nahi hai - MODE 1 = localStorage, MODE 2 = Firebase
// USE: <script src="mode2-firebase.js"></script>
// ============================================
// STEP 1: Firebase Console > Project Settings > Web App se apna config copy karke neeche PASTE karo
// STEP 2: Firestore > Rules me test mode ke liye allow read, write: if true; Publish karo (sirf demo ke liye)

window.CyberFirebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "PASTE_YOUR_PROJECT.firebaseapp.com",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_PROJECT.appspot.com",
  messagingSenderId: "PASTE_SENDER_ID",
  appId: "PASTE_APP_ID"
};

(function(){
  window.CyberFirebase = { ready:false, reason:'not-configured' };
  function isConfigured(){
    var c = window.CyberFirebaseConfig || {};
    return c.apiKey && c.apiKey.indexOf('PASTE_') !== 0 && c.projectId && c.projectId.indexOf('PASTE_') !== 0;
  }
  window.CyberFirebase.isConfigured = isConfigured;
  window.initCyberFirebase = function(){
    if(!isConfigured()){ window.CyberFirebase.ready=false; window.CyberFirebase.reason='config-missing'; return false; }
    if(typeof firebase === 'undefined'){ window.CyberFirebase.reason='sdk-not-loaded'; return false; }
    try{
      if(!firebase.apps || !firebase.apps.length) firebase.initializeApp(window.CyberFirebaseConfig);
      window.CyberFirebase.auth = firebase.auth();
      window.CyberFirebase.db = firebase.firestore();
      window.CyberFirebase.ready = true;
      window.CyberFirebase.reason = 'connected';
      console.log('[CyberShield MODE 2] Firebase Connected');
      return true;
    }catch(e){ window.CyberFirebase.ready=false; window.CyberFirebase.reason=String(e); console.warn('[CyberShield MODE 2] Firebase failed', e); return false; }
  };
  document.addEventListener('DOMContentLoaded', function(){ setTimeout(window.initCyberFirebase, 300); });
})();
