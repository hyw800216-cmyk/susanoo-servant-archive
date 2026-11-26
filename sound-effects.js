(() => {
 'use strict';
 const button=document.getElementById('sfx-toggle');
 const cue={thunder:{url:'assets/sfx/thunder.ogg',volume:.18,limit:5.5},fire:{url:'assets/sfx/fire.ogg',volume:.20,limit:4.5},energy:{url:'assets/sfx/energy.ogg',volume:.10,limit:1.6}};
 let enabled=true,unlocked=false,lastStrike=0,revealTimer=null;
 const active=new Set();
 function play(kind){
  if(!enabled||!unlocked||!cue[kind])return;
  const c=cue[kind],a=new Audio(c.url);a.volume=c.volume;active.add(a);
  a.play().catch(()=>{active.delete(a)});
  const fadeStart=Math.max(0,c.limit-.6)*1000;
  setTimeout(()=>{let step=0;const timer=setInterval(()=>{step++;a.volume=Math.max(0,c.volume*(1-step/6));if(step>=6){clearInterval(timer);a.pause();active.delete(a)}},100)},fadeStart);
  a.addEventListener('ended',()=>active.delete(a),{once:true});
 }
 function stop(){for(const a of active){a.pause()}active.clear()}
 button.addEventListener('click',()=>{unlocked=true;enabled=!enabled;button.textContent=enabled?'音效 开':'音效 关';button.setAttribute('aria-pressed',String(enabled));button.setAttribute('aria-label',enabled?'关闭音效':'开启音效');if(!enabled)stop()});
 document.getElementById('music-toggle').addEventListener('click',()=>{unlocked=true});
 document.getElementById('emblem-trigger').addEventListener('click',()=>{
  unlocked=true;play('energy');clearTimeout(revealTimer);revealTimer=setTimeout(()=>{play('thunder');lastStrike=performance.now()},2900);
 });
 document.getElementById('enter-archive').addEventListener('click',()=>{unlocked=true;play('fire')});
 // Detect the CSS lightning rather than playing sounds on an unrelated timer.
 const gate=document.getElementById('gate'),hero=document.getElementById('hero');
 const bolts=[...document.querySelectorAll('.skybolt-a,.skybolt-b,.scene-bolt-a,.scene-bolt-b')];
 const previous=new WeakMap();
 function observe(now){
  if(unlocked&&enabled&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
   for(const bolt of bolts){
    const inGate=bolt.classList.contains('skybolt-a')||bolt.classList.contains('skybolt-b');
    const visible=inGate?!gate.classList.contains('hide'):hero.classList.contains('awake')&&hero.style.display!=='none';
    const lit=visible&&Number.parseFloat(getComputedStyle(bolt).opacity)>.35;
    if(lit&&!previous.get(bolt)&&now-lastStrike>8000){play('thunder');lastStrike=now}
    previous.set(bolt,lit);
   }
  }
  requestAnimationFrame(observe);
 }
 requestAnimationFrame(observe);
})();
