const gate=document.querySelector('#gate'),hero=document.querySelector('#hero'),archive=document.querySelector('#archive'),video=document.querySelector('#visual'),transition=document.querySelector('#transition');
const lists=[document.querySelector('#class-list'),document.querySelector('#personal-list'),document.querySelector('#treasure-list')];
const data=window.ARCHIVE_DATA;
function addEntries(items,container){for(const item of items){const details=document.createElement('details');details.className='skill';const summary=document.createElement('summary');const title=document.createElement('span');title.className='skill-title';title.textContent=item.title;const rank=document.createElement('span');rank.className='skill-rank';rank.textContent=item.rank;title.append(rank);const toggle=document.createElement('span');toggle.className='skill-toggle';toggle.setAttribute('aria-hidden','true');toggle.textContent='+';summary.append(title,toggle);summary.addEventListener('click',event=>{event.preventDefault();window.openSkillStage(item)});const inner=document.createElement('div');inner.className='skill-inner';const quote=document.createElement('div');quote.className='epigraph';quote.textContent=item.quote;const body=document.createElement('div');body.className='prose';body.textContent=item.body;inner.append(quote,body);details.append(summary,inner);container.append(details)}}
addEntries(data.classSkills,lists[0]);addEntries(data.personalSkills,lists[1]);addEntries(data.treasures,lists[2]);
const facts=document.querySelector('.facts');facts.replaceChildren();for(const item of data.profile.filter(item=>item.label!=='圣杯心愿')){const el=document.createElement('div');if(['外貌描述','角色性格'].includes(item.label))el.classList.add('fact-long');const label=document.createElement('span');label.textContent=item.label;const value=document.createElement('b');value.textContent=item.value;el.append(label,value);facts.append(el)}
const stats=document.querySelector('.stats');stats.replaceChildren();for(const item of data.stats){const el=document.createElement('div');const label=document.createElement('small');label.textContent=item.label;const value=document.createElement('strong');value.textContent=item.value;el.append(label,value);stats.append(el)}
const wish=document.querySelector('.wish p');wish.textContent=data.profile.find(item=>item.label==='圣杯心愿')?.value||'';
const bonds=document.querySelector('#bond-list');data.bonds.forEach((item,index)=>{const details=document.createElement('details');details.className='bond-card';const title=document.createElement('summary');title.textContent=item.title;const body=document.createElement('div');body.className='prose';body.textContent=item.body;details.append(title,body);bonds.append(details)});
function openHero(){
 if(gate.classList.contains('hide'))return;
 const summon=document.querySelector('#summon'),ghost=document.querySelector('#ghost-video');
 const layers=[video,document.querySelector('#storm-layer'),document.querySelector('#god-layer'),ghost];
 ghost.hidden=true;ghost.classList.remove('manifest');summon.classList.remove('finish');
 gate.classList.add('hide');hero.setAttribute('aria-hidden','false');
 layers.forEach(layer=>{layer.currentTime=0;layer.play().catch(()=>{})});
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){hero.classList.add('awake');layers.slice(1).forEach(layer=>layer.pause());return}
 summon.classList.add('playing');
 setTimeout(()=>{ghost.hidden=false;ghost.classList.add('manifest')},3100);
 setTimeout(()=>{hero.classList.add('awake');summon.classList.add('finish')},4900);
 setTimeout(()=>{summon.classList.remove('playing','finish');layers.slice(1).forEach(layer=>layer.pause())},5900)
}
function showArchive(){archive.classList.add('visible');archive.setAttribute('aria-hidden','false');document.body.classList.remove('opening');window.scrollTo(0,0)}
function openArchive(){window.beginBurn(()=>{hero.style.display='none';video.pause();window.mountMythScenes({onComplete:showArchive})})}
function replay(){archive.classList.remove('visible');archive.setAttribute('aria-hidden','true');hero.style.display='';hero.classList.remove('awake');hero.setAttribute('aria-hidden','true');gate.classList.remove('hide');document.body.classList.add('opening');video.pause();video.currentTime=0;window.scrollTo(0,0)}
document.querySelector('#emblem-trigger').addEventListener('click',openHero);document.querySelector('#enter-archive').addEventListener('click',openArchive);document.querySelector('#replay').addEventListener('click',replay);document.querySelector('#enter-final').addEventListener('click',()=>window.openFinalScene());document.querySelector('#to-top').addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

// Animated lightning is drawn as branching arcs around the lettering.
function animateLightning(canvas,mode){
  const context=canvas.getContext('2d'); if(!context)return;
  let width=0,height=0,last=0,arcs=[],sparkles=[];
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  function size(){const bounds=canvas.getBoundingClientRect();let ratio=Math.min(window.devicePixelRatio||1,2);width=bounds.width;height=bounds.height;canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);context.setTransform(ratio,0,0,ratio,0,0)}
  new ResizeObserver(size).observe(canvas);size();
  function bolt(x1,y1,x2,y2,rough){const count=9+Math.floor(Math.random()*7),points=[[x1,y1]];for(let i=1;i<count;i++){let t=i/count;points.push([x1+(x2-x1)*t+(Math.random()-.5)*rough,y1+(y2-y1)*t+(Math.random()-.5)*rough])}points.push([x2,y2]);return points}
  function create(){const left=width*(mode==='title'?.17:.12),right=width*(mode==='title'?.83:.9),center=height*.52;let count=mode==='title'?2:1;arcs=[];for(let i=0;i<count;i++){let x=left+Math.random()*(right-left)*.9,y=center+(Math.random()-.5)*height*.4,dx=(Math.random()>.5?1:-1)*(35+Math.random()*width*.18),dy=(Math.random()-.5)*height*.38;let points=bolt(x,y,x+dx,y+dy,18);arcs.push(points);if(Math.random()>.35){const p=points[Math.floor(points.length*.6)];arcs.push(bolt(p[0],p[1],p[0]+dx*.35,p[1]+(Math.random()-.5)*45,8))}}sparkles=Array.from({length:3},()=>[left+Math.random()*(right-left),center+(Math.random()-.5)*height*.6,Math.random()*1.8+.5])}
  function draw(time){context.clearRect(0,0,width,height);if(!motion.matches&&canvas.offsetParent!==null){if(time-last>110+Math.random()*180){create();last=time}let age=time-last,alpha=Math.max(0,1-age/260);context.save();context.globalAlpha=alpha*.85;context.lineCap='round';context.lineJoin='round';for(const path of arcs){context.beginPath();path.forEach((p,i)=>i?context.lineTo(p[0],p[1]):context.moveTo(p[0],p[1]));context.shadowColor='#967dff';context.shadowBlur=14;context.strokeStyle='#7165ff';context.lineWidth=3;context.stroke();context.shadowColor='#c9efff';context.shadowBlur=7;context.strokeStyle='#e5faff';context.lineWidth=.8;context.stroke()}for(const [x,y,r] of sparkles){context.beginPath();context.fillStyle='#d5eaff';context.shadowBlur=14;context.shadowColor='#9a7eff';context.arc(x,y,r,0,Math.PI*2);context.fill()}context.restore()}requestAnimationFrame(draw)}requestAnimationFrame(draw)
}
animateLightning(document.querySelector('.lightning'),'title');animateLightning(document.querySelector('.identity-lightning'),'identity');

// The soundtrack may be supplied as 出阵.mp3 next to index.html, or selected locally.
(() => {
 const audio = document.getElementById('soundtrack');
 const file = document.getElementById('music-file');
 const toggle = document.getElementById('music-toggle');
 const choose = document.getElementById('music-choose');
 const status = document.getElementById('music-status');
 const label = document.getElementById('music-state');
 let sourceAvailable = true, objectUrl = null, manuallyPaused = false;
 audio.volume = 0.22;
 const indicate = message => { status.textContent = message; };
 function sync() {
  const playing = !audio.paused;
  label.textContent = playing ? '暂停' : '配乐';
  toggle.setAttribute('aria-label', playing ? '暂停背景音乐' : '播放背景音乐');
 }
 async function playMusic() {
  if (!sourceAvailable) return;
  try { await audio.play(); indicate('背景音乐正在播放'); }
  catch (_) { indicate('音乐未能播放，可检查音频文件并重新选择'); }
  sync();
 }
 choose.addEventListener('click', () => file.click());
 toggle.addEventListener('click', () => {
  if (!sourceAvailable) { file.click(); return; }
  if (audio.paused) { manuallyPaused = false; playMusic(); }
  else { manuallyPaused = true; audio.pause(); sync(); indicate('背景音乐已暂停'); }
 });
 file.addEventListener('change', () => {
  if (!file.files || !file.files[0]) return;
  if (objectUrl) URL.revokeObjectURL(objectUrl);
  objectUrl = URL.createObjectURL(file.files[0]);
  audio.src = objectUrl; sourceAvailable = true; manuallyPaused = false;
  indicate('音频已选择');
  if (document.getElementById('gate').classList.contains('hide')) playMusic();
  sync();
 });
 audio.addEventListener('error', () => { sourceAvailable = false; sync(); indicate('无法读取音频，请选择可播放的文件'); });
 document.getElementById('emblem-trigger').addEventListener('click', () => {
  if (!manuallyPaused) playMusic();
 });
 // Browsers can block audible autoplay; the emblem click is the fallback gesture.
 audio.play().then(sync).catch(()=>{indicate('点击徽记后开始播放音乐');sync()});
 window.addEventListener('pagehide', () => { if (objectUrl) URL.revokeObjectURL(objectUrl); });
 sync();
})();


