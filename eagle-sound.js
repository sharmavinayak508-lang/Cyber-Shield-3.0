// CYBER SHIELD - EAGLE SOUND - Flying Eagle Screech + Wings + Wind
// If you add a real file named eagle.mp3 in repo, it will play that first. Otherwise Web Audio synthesis plays.
// To use real eagle sound: download a free eagle screech from Pixabay / Freesound, rename to eagle.mp3, upload to GitHub.
(function(){
  var ctx=null, soundOn = localStorage.getItem('cyber_sound_enabled')!=='off';
  function ensure(){ if(!ctx){ try{ ctx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } if(ctx && ctx.state==='suspended') ctx.resume(); return ctx; }
  function playScreech(){
    var c=ensure(); if(!c) return;
    var t=c.currentTime;
    // 1) WIND - flying in air
    var len=c.sampleRate*1.8, buf=c.createBuffer(1,len,c.sampleRate), d=buf.getChannelData(0);
    for(var i=0;i<len;i++){ d[i]=(Math.random()*2-1)*0.06*Math.sin(i/len*Math.PI); }
    var src=c.createBufferSource(); src.buffer=buf; var f=c.createBiquadFilter(); f.type='bandpass'; f.frequency.value=500; f.Q.value=0.6;
    var g=c.createGain(); g.gain.value=0.7; src.connect(f); f.connect(g); g.connect(c.destination); src.start(t);
    // 2) WING FLAPS - 3 large thumps
    [0,0.35,0.7].forEach(function(off){
      var o=c.createOscillator(), og=c.createGain(); o.type='sine'; o.frequency.setValueAtTime(70,t+off); o.frequency.exponentialRampToValueAtTime(38,t+off+0.22);
      og.gain.setValueAtTime(0.0001,t+off); og.gain.exponentialRampToValueAtTime(0.35,t+off+0.05); og.gain.exponentialRampToValueAtTime(0.0001,t+off+0.28);
      o.connect(og); og.connect(c.destination); o.start(t+off); o.stop(t+off+0.3);
    });
    // 3) EAGLE SCREECH - high, loud, descending: KEEEE-AAAH - two screeches
    [0.25,1.05].forEach(function(off,idx){
      var o=c.createOscillator(), o2=c.createOscillator(), og=c.createGain(), vib=c.createOscillator(), vg=c.createGain();
      o.type='sawtooth'; o2.type='square';
      var startF = idx===0?2600:2400;
      o.frequency.setValueAtTime(startF,t+off); o.frequency.exponentialRampToValueAtTime(1400,t+off+0.45); o.frequency.exponentialRampToValueAtTime(900,t+off+0.7);
      o2.frequency.setValueAtTime(startF*1.5,t+off); o2.frequency.exponentialRampToValueAtTime(2100,t+off+0.45);
      vib.frequency.value=28; vg.gain.value=35; vib.connect(vg); vg.connect(o.frequency); vib.start(t+off); vib.stop(t+off+0.7);
      og.gain.setValueAtTime(0.0001,t+off); og.gain.exponentialRampToValueAtTime(0.22,t+off+0.06); og.gain.setValueAtTime(0.22,t+off+0.45); og.gain.exponentialRampToValueAtTime(0.0001,t+off+0.75);
      var bp=c.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=2200; bp.Q.value=1.2;
      o.connect(bp); o2.connect(bp); bp.connect(og); og.connect(c.destination);
      o.start(t+off); o.stop(t+off+0.8); o2.start(t+off); o2.stop(t+off+0.8);
    });
    // 4) FIRE WHOOSH at end
    var flen=c.sampleRate*0.6, fbuf=c.createBuffer(1,flen,c.sampleRate), fd=fbuf.getChannelData(0);
    for(var i=0;i<flen;i++) fd[i]=(Math.random()*2-1)*0.08*(1-i/flen);
    var fsrc=c.createBufferSource(); fsrc.buffer=fbuf; var ff=c.createBiquadFilter(); ff.type='lowpass'; ff.frequency.value=1200;
    var fg=c.createGain(); fg.gain.value=0.6; fsrc.connect(ff); ff.connect(fg); fg.connect(c.destination); fsrc.start(t+1.1);
  }
  window.playEagleSound = function(){
    if(localStorage.getItem('cyber_sound_enabled')==='off') return;
    // Try real file first
    var a=new Audio('eagle.mp3');
    a.volume=0.9;
    a.oncanplaythrough=function(){ try{ a.play().catch(function(){ playScreech(); }); }catch(e){ playScreech(); } };
    a.onerror=function(){ playScreech(); };
    a.load();
    // Fallback if file does not load in 400ms
    setTimeout(function(){ if(a.paused && a.readyState<3) playScreech(); }, 450);
  };
  window.triggerRoar = window.playEagleSound;
  window.toggleCyberSound = function(){
    var cur = localStorage.getItem('cyber_sound_enabled')!=='off';
    var next=!cur; localStorage.setItem('cyber_sound_enabled', next?'on':'off'); window.cyberSoundEnabled=next;
    document.querySelectorAll('#soundBtn').forEach(function(b){ b.innerText = next?'🦅 🔊':'🦅 🔇'; });
    if(next) window.playEagleSound();
    return next;
  };
})();
