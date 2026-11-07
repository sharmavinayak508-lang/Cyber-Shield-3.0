// EAGLE.PNG CHECK - If eagle.png missing in repo, auto fallback to Unsplash
(function(){
  window.addEventListener('load', ()=>{
    let imgs = document.querySelectorAll('img[src="eagle.png"], img.eagle-backdrop');
    imgs.forEach(img=>{
      img.addEventListener('error', ()=>{
        img.src = 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=1400';
        console.log('eagle.png not found - Using Unsplash fallback');
        let n = document.createElement('div');
        n.style.cssText='position:fixed;bottom:10px;left:10px;background:rgba(255,122,0,0.9);color:#000;padding:8px 12px;border-radius:8px;font-size:11px;z-index:9999';
        n.innerText='⚠️ eagle.png repo me nahi mila - Fallback image use ho rahi hai. eagle.png upload karo for original eagle.';
        document.body.appendChild(n);
        setTimeout(()=>n.remove(), 6000);
      });
    });
  });
})();
