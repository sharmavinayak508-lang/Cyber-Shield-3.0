// CYBER SHIELD 3.0 - DUAL OTP - Mobile + Email Dono Pe OTP
// Phone OTP: Firebase Phone Auth (Real SMS) - Enable in Firebase Console > Auth > Phone
// Email OTP: EmailJS (Real Email) - Free: emailjs.com > Create Service (Gmail) > Get Public Key
// Agar keys nahi daali toh DEMO Mode: OTP screen pe dikhega (testing ke liye)

const EMAILJS_PUBLIC_KEY = 'YOUR_EMAILJS_PUBLIC_KEY'; // <-- emailjs.com se lo
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

let DUAL = { phoneOTP:'', emailOTP:'', phoneSent:false, emailSent:false, attempts:0 };

window.generateOTP = function(){ return Math.floor(100000 + Math.random()*900000).toString(); };

// 1. PHONE OTP - Firebase Phone Auth (Real SMS)
window.sendPhoneOTPReal = async function(phone){
  try{
    if(!window.firebaseAuth) throw new Error('Firebase not loaded');
    const { RecaptchaVerifier, signInWithPhoneNumber } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js");
    if(!window.recaptchaVerifier){
      window.recaptchaVerifier = new RecaptchaVerifier(window.firebaseAuth, 'recaptcha-container', {size:'invisible'});
    }
    let conf = await signInWithPhoneNumber(window.firebaseAuth, phone, window.recaptchaVerifier);
    window.phoneConfirmation = conf;
    DUAL.phoneSent = true;
    return {success:true, real:true, msg:'REAL SMS OTP sent to '+phone};
  }catch(e){
    // Demo fallback - OTP generate karke screen pe dikhao
    DUAL.phoneOTP = window.generateOTP();
    DUAL.phoneSent = true;
    return {success:true, real:false, demoOTP:DUAL.phoneOTP, msg:'DEMO Phone OTP (Firebase Phone Enable nahi hai) - OTP: '+DUAL.phoneOTP};
  }
};

// 2. EMAIL OTP - EmailJS (Real Email)
window.sendEmailOTPReal = async function(email, username){
  DUAL.emailOTP = window.generateOTP();
  // Agar EmailJS configured hai toh real email bhejo
  if(EMAILJS_PUBLIC_KEY!=='YOUR_EMAILJS_PUBLIC_KEY' && window.emailjs){
    try{
      await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {to_email:email, to_name:username, otp_code:DUAL.emailOTP, from_name:'Cyber Shield 3.0'});
      DUAL.emailSent = true;
      return {success:true, real:true, msg:'REAL Email OTP sent to '+email};
    }catch(e){ console.log('EmailJS fail, demo', e); }
  }
  DUAL.emailSent = true;
  // Demo: OTP screen pe dikhega
  return {success:true, real:false, demoOTP:DUAL.emailOTP, msg:'DEMO Email OTP (EmailJS key nahi daali) - OTP: '+DUAL.emailOTP};
};

// 3. VERIFY BOTH - Dono sahi hone chahiye tabhi Allow
window.verifyDualOTP = async function(phoneOTPInput, emailOTPInput){
  DUAL.attempts++;
  let phoneOK = false, emailOK = false;
  // Phone verify - Real Firebase ya Demo
  if(window.phoneConfirmation){
    try{ await window.phoneConfirmation.confirm(phoneOTPInput); phoneOK=true; }catch(e){ phoneOK=false; }
  } else {
    phoneOK = (phoneOTPInput === DUAL.phoneOTP);
  }
  // Email verify - Demo / Generated
  emailOK = (emailOTPInput === DUAL.emailOTP);
  // Log to SIEM
  if(window.pushSIEMLog) window.pushSIEMLog('dual-otp', '127.0.0.1', 'Dual OTP attempt '+DUAL.attempts+' Phone:'+(phoneOK?'OK':'FAIL')+' Email:'+(emailOK?'OK':'FAIL'), (phoneOK&&emailOK)?'info':'high');
  return {phoneOK, emailOK, bothOK:(phoneOK&&emailOK), attempts:DUAL.attempts};
};
window.getDualOTPState = ()=> DUAL;
window.resetDualOTP = ()=>{ DUAL={phoneOTP:'',emailOTP:'',phoneSent:false,emailSent:false,attempts:0}; window.phoneConfirmation=null; };
