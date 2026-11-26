/* Final scene for the servant archive. The source video remains a single, intact layer. */
(() => {
 'use strict';
 let layer=null,previous=null,oldOverflow='';
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 function close(){
  if(!layer)return;
  const node=layer;layer=null;
  node.querySelectorAll('video').forEach(video=>video.pause());
  node.classList.add('is-closing');document.body.style.overflow=oldOverflow;
  document.removeEventListener('keydown',keys);
  setTimeout(()=>node.remove(),reduced.matches?0:650);
  if(previous&&previous.isConnected)previous.focus({preventScroll:true});
 }
 function keys(event){
  if(event.key==='Escape'){event.preventDefault();close();return}
  if(event.key==='Tab'&&layer){
   const list=[...layer.querySelectorAll('button:not([disabled])')].filter(e=>e.offsetParent!==null);
   if(!list.length)return;const first=list[0],last=list[list.length-1];
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  }
 }
 window.openFinalScene = function(){
  if(layer)return;
  previous=document.activeElement;oldOverflow=document.body.style.overflow;
  const node=document.createElement('section');node.className='final-scene';node.setAttribute('role','dialog');node.setAttribute('aria-modal','true');node.setAttribute('aria-label','终幕：荒神的旅途');
  node.innerHTML=`<video class="final-scene-ambient" muted loop playsinline preload="auto" aria-hidden="true"><source src="assets/finale-web.mp4" type="video/mp4"></video><div class="final-scene-frame" aria-hidden="true"><video class="final-scene-video" muted loop playsinline preload="auto"><source src="assets/finale-web.mp4" type="video/mp4"></video></div><div class="final-scene-shade" aria-hidden="true"></div><div class="final-scene-grain" aria-hidden="true"></div><div class="final-scene-embers" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="final-scene-border" aria-hidden="true"></div><header class="final-scene-header"><span>FATE / RESTART PLAY</span><span>THE EXILED GOD OF WAR</span></header><div class="final-scene-content"><p class="final-scene-eyebrow">EPILOGUE / 终幕</p><div class="final-scene-rule"></div><h2>高天原不再是归处。<br><em>荒神的足迹却还将继续向前。</em></h2><p class="final-scene-sub">荒神 / 现界 / 未至的英雄</p></div><footer class="final-scene-footer"><span>LANCER &nbsp; / &nbsp; SUSANOO NO MIKOTO</span><span>THE ROAD CONTINUES</span></footer><button type="button" class="final-scene-close" aria-label="返回角色典籍">返回典籍 <span aria-hidden="true">×</span></button>`;
  node.querySelector('.final-scene-close').addEventListener('click',close);document.body.append(node);document.body.style.overflow='hidden';layer=node;document.addEventListener('keydown',keys);
  const video=node.querySelector('.final-scene-video'), ambient=node.querySelector('.final-scene-ambient');
  if(reduced.matches){video.addEventListener('loadeddata',()=>video.pause(),{once:true});ambient.addEventListener('loadeddata',()=>ambient.pause(),{once:true})}else{
   video.addEventListener('timeupdate',()=>{if(ambient.readyState&&Math.abs(ambient.currentTime-video.currentTime)>.18)ambient.currentTime=video.currentTime});
   video.addEventListener('play',()=>ambient.play().catch(()=>{}));
   video.addEventListener('pause',()=>ambient.pause());
   video.play().catch(()=>{});
  }
  requestAnimationFrame(()=>node.classList.add('is-visible'));node.querySelector('.final-scene-close').focus({preventScroll:true});
 };
})();

