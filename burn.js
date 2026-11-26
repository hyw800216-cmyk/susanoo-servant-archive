/* An ember catches at the lower right and consumes the picture like paper. */
(() => {
  'use strict';
  let active = false;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  // A slow catch followed by an accelerating burn, easing out once the page is gone.
  const ease = t => t * t * (3 - 2 * t);
  window.beginBurn = function beginBurn(callback) {
    if (active) return Promise.resolve(false);
    active = true;
    const layer = document.createElement('div');
    layer.className = 'burn-transition';
    layer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer);
    const finish = () => {
      try { if (typeof callback === 'function') callback(); }
      finally {
        requestAnimationFrame(() => layer.classList.add('is-fading'));
        setTimeout(() => { layer.remove(); active = false; }, reduced.matches ? 320 : 1050);
      }
    };
    if (reduced.matches) {
      layer.classList.add('is-reduced');
      layer.style.opacity = '0';
      requestAnimationFrame(() => { layer.style.opacity = '1'; });
      return new Promise(resolve => setTimeout(() => { layer.style.opacity = ''; finish(); resolve(true); }, 300));
    }
    const canvas = document.createElement('canvas');
    layer.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) { finish(); return Promise.resolve(true); }
    let width, height, dpr, far, previous = 0, done = false;
    let sparks = [];
    function resize() {
      width = window.innerWidth; height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1);
      canvas.width = Math.ceil(width * dpr); canvas.height = Math.ceil(height * dpr);
      canvas.style.width = width + 'px'; canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      far = Math.hypot(width, height) + 190;
    }
    resize(); window.addEventListener('resize', resize, { passive: true });
    function edge(angle, radius, ms) {
      // Small jagged charcoal edge over larger slow organic folds.
      const fold = Math.sin(angle * 9.5 + ms * .0015) * 19
        + Math.sin(angle * 21 - ms * .0025) * 9
        + Math.sin(angle * 47 + ms * .0035) * 3;
      const r = Math.max(0, radius + fold);
      return [width + Math.cos(angle) * r, height + Math.sin(angle) * r];
    }
    function trace(points) {
      ctx.beginPath();
      for (let i = 0; i < points.length; i++) i ? ctx.lineTo(points[i][0], points[i][1]) : ctx.moveTo(points[i][0], points[i][1]);
    }
    function ember(x, y) {
      if (sparks.length > 48 || Math.random() > .25) return;
      const speed = .08 + Math.random() * .30;
      sparks.push({x,y,vx:(Math.random()-.72)*speed,vy:-speed*(1.2+Math.random()*1.8),
        age:0,life:550+Math.random()*1150,r:.6+Math.random()*2.1,hot:Math.random()>.35});
    }
    // Pre-render a flame once: many gradients and blur filters per animation frame
    // compete with the video layers during the transition.
    const flameSprite = document.createElement('canvas');
    flameSprite.width = 48; flameSprite.height = 96;
    const fg = flameSprite.getContext('2d');
    if (fg) {
      const gradient = fg.createLinearGradient(0, 90, 0, 3);
      gradient.addColorStop(0, 'rgba(255,211,133,.72)');
      gradient.addColorStop(.32, 'rgba(255,142,37,.42)');
      gradient.addColorStop(.72, 'rgba(224,65,18,.15)');
      gradient.addColorStop(1, 'rgba(180,42,14,0)');
      fg.fillStyle = gradient; fg.beginPath(); fg.moveTo(9, 94);
      fg.bezierCurveTo(3, 70, 19, 43, 25, 3);
      fg.bezierCurveTo(30, 42, 46, 74, 39, 94);
      fg.closePath(); fg.fill();
    }
    function flame(x, y, i, ms) {
      if (!fg) return;
      const pulse = .5 + .5 * Math.sin(ms * .008 + i * 2.36);
      const tall = (23 + (i % 5) * 7) * (.8 + pulse * .5);
      const wide = 12 + (i % 3) * 5;
      const lean = Math.sin(ms * .004 + i) * 6 - 4;
      ctx.drawImage(flameSprite, x - wide/2 + lean, y - tall, wide, tall + 3);
    }
    let resolvePromise;
    const promise = new Promise(resolve => { resolvePromise = resolve; });
    const started = performance.now();
    function frame(timestamp) {
      if (!previous) previous = timestamp;
      const elapsed = timestamp - started;
      const delta = Math.min(timestamp - previous, 40); previous = timestamp;
      const progress = clamp(elapsed / 3200, 0, 1), radius = far * ease(progress);
      ctx.clearRect(0, 0, width, height);
      const points = [];
      for (let i = 0; i <= 72; i++) points.push(edge(Math.PI + (Math.PI / 2) * i / 72, radius, elapsed));
      // The burnt-away portion is almost black; several warm, irregular bands form the char edge.
      ctx.beginPath();ctx.moveTo(width,height);points.forEach(p=>ctx.lineTo(p[0],p[1]));ctx.closePath();
      const fill=ctx.createRadialGradient(width,height,Math.max(0,radius-190),width,height,Math.max(1,radius+25));
      fill.addColorStop(0,'#0b080c');fill.addColorStop(.72,'#10090c');fill.addColorStop(.87,'#29100e');fill.addColorStop(.96,'#5d1c0d');fill.addColorStop(1,'#96320c');
      ctx.fillStyle=fill;ctx.fill();
      if (progress < .98 && radius > 10) {
        ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
        // Wider diffuse light glows around a dark scorched paper edge, then a fine hot seam.
        trace(points);ctx.strokeStyle='rgba(225,74,19,.10)';ctx.lineWidth=38;ctx.stroke();
        trace(points);ctx.strokeStyle='rgba(39,14,11,.85)';ctx.lineWidth=13;ctx.stroke();
        trace(points);ctx.strokeStyle='rgba(246,100,29,.82)';ctx.lineWidth=5.2;ctx.stroke();
        trace(points);ctx.strokeStyle='rgba(255,222,160,.93)';ctx.lineWidth=1.3;ctx.stroke();
        ctx.globalCompositeOperation='screen';
        for(let i=3;i<points.length-3;i+=5){
          const [x,y]=points[i];
          if(x < -50 || x > width+50 || y < -50 || y > height+50)continue;
          flame(x,y,i,elapsed);ember(x,y);
        }
        ctx.restore();
      }
      sparks=sparks.filter(s=>(s.age+=delta)<s.life);
      ctx.save();ctx.globalCompositeOperation='screen';
      for(const s of sparks){
        s.x+=s.vx*delta;s.y+=s.vy*delta;s.vx+=.00003*delta;
        const alpha=Math.pow(1-s.age/s.life,1.3);ctx.globalAlpha=alpha;
        ctx.fillStyle=s.hot?'#ffe1a3':'#ed5b25';
        ctx.beginPath();ctx.ellipse(s.x,s.y,s.r*.65,s.r*1.35,-.25,0,Math.PI*2);ctx.fill();
      }
      ctx.restore();
      if(progress>=1){if(!done){done=true;window.removeEventListener('resize',resize);finish();resolvePromise(true)}return}
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    return promise;
  };
})();
