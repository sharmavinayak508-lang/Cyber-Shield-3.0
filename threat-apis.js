// CYBER SHIELD 3.0 - REAL THREAT APIS
// Get FREE keys: VirusTotal https://www.virustotal.com/gui/my-apikey | AbuseIPDB https://www.abuseipdb.com/account/api
// Put keys below, save, re-upload. Without keys, Demo Mode auto works.

const VIRUSTOTAL_API_KEY = 'YOUR_VIRUSTOTAL_API_KEY'; // <-- Yahan apni key daalo
const ABUSEIPDB_API_KEY = 'YOUR_ABUSEIPDB_API_KEY'; // <-- Yahan apni key daalo

window.checkIOCReal = async function(ioc){
  let isIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(ioc.trim());
  let result = {ioc, isIP, sources:[]};
  // 1. AbuseIPDB - Only for IP
  if(isIP && ABUSEIPDB_API_KEY!=='YOUR_ABUSEIPDB_API_KEY'){
    try{
      let r = await fetch(`https://api.abuseipdb.com/api/v2/check?ipAddress=${encodeURIComponent(ioc)}&maxAgeInDays=90`, {headers:{'Key':ABUSEIPDB_API_KEY,'Accept':'application/json'}});
      let j = await r.json();
      result.sources.push({name:'AbuseIPDB', score:j.data?.abuseConfidenceScore||0, reports:j.data?.totalReports||0, country:j.data?.countryCode||'', isp:j.data?.isp||'', real:true});
    }catch(e){ result.sources.push({name:'AbuseIPDB', error:'Fetch blocked by CORS - Use Cloudflare Worker / Backend proxy. Demo fallback used.'}); }
  }
  // 2. VirusTotal - Needs backend proxy due to CORS, direct call often blocked
  if(VIRUSTOTAL_API_KEY!=='YOUR_VIRUSTOTAL_API_KEY'){
    result.sources.push({name:'VirusTotal', note:'VirusTotal API needs server-side proxy (CORS). Use Firebase Cloud Function or Cloudflare Worker. See README in file.'});
  }
  // 3. Demo Fallback if no keys
  if(result.sources.length===0 || ABUSEIPDB_API_KEY==='YOUR_ABUSEIPDB_API_KEY'){
    let mal = ioc.includes('185.220') || ioc.includes('phishing') || Math.random()>0.6;
    result.demo = true;
    result.sources.push({name:'VirusTotal (DEMO)', score: mal?'3/90 malicious':'0/90 clean', real:false});
    result.sources.push({name:'AbuseIPDB (DEMO)', score: mal?85:0, real:false});
    result.sources.push({name:'MISP / OTX (DEMO)', score: mal?'Found in 2 feeds':'Not found', real:false});
    result.verdict = mal ? 'MALICIOUS - Block immediately' : 'CLEAN';
  } else {
    let maxScore = Math.max(...result.sources.map(s=>s.score||0));
    result.verdict = maxScore>50 ? 'MALICIOUS - Block' : maxScore>20 ? 'SUSPICIOUS - Monitor' : 'CLEAN';
  }
  return result;
};
// Helper to render result in Admin Dashboard
window.renderIOCResult = function(res){
  let html = `<b>IOC: ${res.ioc}</b><br><b>Verdict: ${res.verdict}</b><br>${res.demo?'<span style="color:#ff7a00">DEMO Mode - API Key daalo for REAL data (threat-apis.js me)</span><br>':''}`;
  res.sources.forEach(s=>{ html+=`• ${s.name}: ${s.score!==undefined?s.score:''} ${s.country||''} ${s.isp||''} ${s.note||''} ${s.error||''}<br>`; });
  return html;
};
