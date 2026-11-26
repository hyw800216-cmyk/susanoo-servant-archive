/* Non-blocking media loading indicator for the cinematic scenes. */
(() => {
  'use strict';
  const style = document.createElement('style');
  style.textContent = `.media-status{position:fixed;right:clamp(14px,2.5vw,36px);bottom:clamp(14px,3vh,28px);z-index:99999;width:min(260px,calc(100vw - 28px));box-sizing:border-box;padding:13px 16px 12px;color:#eadff2;background:rgba(13,9,20,.92);border:1px solid rgba(202,169,218,.48);box-shadow:0 8px 30px #0009;font:12px/1.6 'Microsoft YaHei',sans-serif;letter-spacing:.06em;transition:opacity .25s;pointer-events:auto}.media-status[hidden]{display:none}.media-status-title{color:#ead9f0;font-size:13px}.media-status-sub{color:#b7a6bf;font-size:11px;margin-top:3px}.media-status-bar{height:2px;margin-top:9px;overflow:hidden;background:#3e2c4a}.media-status-bar:after{content:'';display:block;width:38%;height:100%;background:#d5b4eb;box-shadow:0 0 8px #bd83eb;animation:media-load 1.4s ease-in-out infinite}.media-status button{margin-top:8px;border:1px solid #8b718f;background:transparent;color:#eadff2;padding:3px 10px;cursor:pointer}.media-status button[hidden]{display:none}@keyframes media-load{0%{transform:translateX(-110%)}100%{transform:translateX(365%)}}@media(prefers-reduced-motion:reduce){.media-status-bar:after{animation:none;width:100%}}`;
  document.head.append(style);
  const box=document.createElement('aside');box.className='media-status';box.hidden=true;box.setAttribute('role','status');box.setAttribute('aria-live','polite');
  box.innerHTML='<div class="media-status-title">画面正在加载</div><div class="media-status-sub">演出素材准备中，请稍候</div><div class="media-status-bar" aria-hidden="true"></div><button type="button" hidden>重新加载画面</button>';
  document.body.append(box);
  const title=box.querySelector('.media-status-title'), sub=box.querySelector('.media-status-sub'), retry=box.querySelector('button');
  const pending=new Set(); let showTimer=null,slowTimer=null;
  function visibleMedia(el){return el && el.isConnected && !el.closest('[aria-hidden="true"]') && el.getClientRects().length>0}
  // Decorative layers are excluded; the main scene and foreground media determine readiness.
  function relevant(el){if(el instanceof HTMLVideoElement && ['visual','storm-layer','god-layer','ghost-video'].includes(el.id)) return document.querySelector('#gate').classList.contains('hide');return el instanceof HTMLVideoElement && (el.classList.contains('final-scene-video')||!!el.closest('.pv-figure')) || el instanceof HTMLImageElement && !!el.closest('.pv-figure')}
  function reset(){clearTimeout(showTimer);clearTimeout(slowTimer);showTimer=slowTimer=null;box.hidden=true;retry.hidden=true}
  function prune(){for(const el of pending)if(!el.isConnected || (el instanceof HTMLVideoElement && el.paused && !el.closest('.skill-stage')))pending.delete(el);if(!pending.size)reset()}
  function start(el){if(!relevant(el))return;pending.add(el);if(showTimer||!box.hidden)return;showTimer=setTimeout(()=>{showTimer=null;prune();if(!pending.size)return;title.textContent='画面正在加载';sub.textContent='演出素材准备中，请稍候';box.hidden=false;slowTimer=setTimeout(()=>{if(!pending.size)return;title.textContent='网络加载较慢';sub.textContent='画面仍在准备，可稍候或重试';retry.hidden=false},15000)},650)}
  function done(el){pending.delete(el);prune()}
  for(const ev of ['loadstart','waiting','stalled'])document.addEventListener(ev,e=>{if(relevant(e.target) && (e.target instanceof HTMLImageElement || !e.target.paused || e.target.id==='visual'))start(e.target)},true);
  for(const ev of ['canplay','playing','loadeddata','load'])document.addEventListener(ev,e=>{if(relevant(e.target))done(e.target)},true);
  document.addEventListener('error',e=>{if(!relevant(e.target))return;pending.add(e.target);clearTimeout(showTimer);clearTimeout(slowTimer);showTimer=slowTimer=null;title.textContent='画面加载未完成';sub.textContent='请检查网络，或尝试重新加载';retry.hidden=false;box.hidden=false},true);
  document.addEventListener('pause',e=>{if(relevant(e.target))done(e.target)},true);
  retry.addEventListener('click',()=>{for(const el of [...pending]){if(!el.isConnected){pending.delete(el);continue}if(el instanceof HTMLVideoElement){el.load();el.play().catch(()=>{})}else{const src=el.src;el.src='';el.src=src}}reset();for(const el of pending)start(el)});
  new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes){if(!(node instanceof Element))continue;const media=[...(node.matches('.pv-figure img, .pv-figure video, .final-scene-video')?[node]:[]),...node.querySelectorAll('.pv-figure img, .pv-figure video, .final-scene-video')];for(const el of media){if(el instanceof HTMLImageElement ? !el.complete : el.readyState<2)start(el)}}prune()}).observe(document.body,{childList:true,subtree:true});
})();
