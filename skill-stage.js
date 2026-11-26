/* Standalone cinematic skill stage; never alters card data or background audio. */
(() => {
 'use strict';
 const THEMES = {
  '对魔力':{kind:'ward',chapter:'I / CLASS SKILL',subtitle:'神代 · 三贵子',glyph:'神',art:'ward'},
  '神性（？）':{kind:'exile',chapter:'II / CLASS SKILL',subtitle:'神逐 · 失落的权能',glyph:'逐',art:'exile'},
  '神炎雷鸣':{kind:'flame',chapter:'I / PERSONAL SKILL',subtitle:'不熄之火 · 神剑之锋',glyph:'炎',art:'sword'},
  '武神魔眼':{kind:'eye',chapter:'II / PERSONAL SKILL',subtitle:'万象 · 气之流转',glyph:'眼',art:'eye'},
  '荒神神相':{kind:'storm',chapter:'III / PERSONAL SKILL',subtitle:'海原 · 荒神之威',glyph:'荒',art:'storm'},
  '神临人间':{kind:'descent',chapter:'IV / PERSONAL SKILL',subtitle:'风雨 · 天途断绝',glyph:'行',art:'descent'},
  '天羽羽斩':{kind:'blade',chapter:'I / NOBLE PHANTASM',subtitle:'十拳之剑 · 斩蛇之刃',glyph:'刃',art:'sword'},
  '武神躯':{kind:'guardian',chapter:'II / NOBLE PHANTASM',subtitle:'神力 · 武神之躯',glyph:'躯',art:'guardian'},
  '佛魔一念':{kind:'dual',chapter:'III / NOBLE PHANTASM',subtitle:'荒神 · 未至的英雄',glyph:'念',art:'dual'}
 };
 const art = {
  sword:`<svg viewBox="0 0 500 600" aria-hidden="true"><defs><linearGradient id="pvSteel" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#3d284a"/><stop offset=".53" stop-color="#f0d4c3"/><stop offset="1" stop-color="#c7a4ed"/></linearGradient></defs><g class="pv-art-lines"><circle cx="250" cy="280" r="203"/><circle cx="250" cy="280" r="161"/><path d="M48 280H452M250 77V485"/></g><g class="pv-sword"><path class="pv-blade-shape" d="M113 453 L364 113 L393 88 L382 126 L140 471 Z"/><path class="pv-cross" d="M121 406 L171 448 M123 451 L77 508 M66 514 L89 527"/><path class="pv-flames" d="M159 435 Q 148 384 209 345 Q 186 321 223 294 Q 213 326 243 300 Q 222 275 263 240 Q 260 267 280 246 Q 270 223 313 186"/></g></svg>`,
  eye:`<svg viewBox="0 0 500 600" aria-hidden="true"><g class="pv-art-lines"><circle cx="250" cy="280" r="205"/><circle cx="250" cy="280" r="174"/><path d="M250 48V514M30 280H470"/></g><g class="pv-eye-art"><path d="M62 280 Q250 118 438 280 Q250 442 62 280Z"/><circle cx="250" cy="280" r="91"/><circle cx="250" cy="280" r="59"/><circle cx="250" cy="280" r="22"/><path d="M80 225 Q250 132 420 225M80 335 Q250 428 420 335"/></g></svg>`,
  storm:`<svg viewBox="0 0 500 600" aria-hidden="true"><g class="pv-storm-art"><circle cx="250" cy="280" r="195"/><circle cx="250" cy="280" r="154"/><path d="M12 360 Q140 285 250 341 T488 310 M-4 410 Q115 335 243 390 T500 358 M5 460 Q120 380 240 435 T496 410"/><path class="pv-bolt" d="M285 40 L220 191 L269 185 L198 317 L303 172 L253 176 Z"/></g></svg>`,
  ward:`<svg viewBox="0 0 500 600" aria-hidden="true"><g class="pv-art-lines"><circle cx="250" cy="280" r="203"/><circle cx="250" cy="280" r="168"/><circle cx="250" cy="280" r="105"/><path d="M250 57V503M27 280H473"/></g><g class="pv-seal"><path d="M250 118 L294 250 L250 227 L206 250Z M250 227V425 M177 292L250 247L323 292 L250 354Z"/><circle cx="250" cy="280" r="142"/></g></svg>`,
  exile:`<svg viewBox="0 0 500 600" aria-hidden="true"><g class="pv-art-lines"><circle cx="250" cy="280" r="204" stroke-dasharray="520 44 120 55"/><circle cx="250" cy="280" r="156" stroke-dasharray="200 70"/><path d="M250 50V510M28 280H472"/></g><g class="pv-seal"><path d="M250 99L279 174L250 158L221 174Z M250 158L250 430 M180 285L250 238L320 285 M180 285L250 348L320 285"/></g></svg>`,
  descent:`<svg viewBox="0 0 500 600" aria-hidden="true"><g class="pv-art-lines"><circle cx="250" cy="280" r="205"/><path d="M25 280H475 M250 55V505"/></g><g class="pv-descent-art"><path d="M94 150 Q260 90 420 155 M105 185 Q260 128 409 190 M128 225 L371 225 M158 225 L158 405 M342 225 L342 405 M138 405H362 M250 233V432"/><path d="M-10 500 Q 120 432 250 492 T510 475"/></g></svg>`,
  guardian:`<svg viewBox="0 0 500 600" aria-hidden="true"><g class="pv-art-lines"><circle cx="250" cy="280" r="205"/><circle cx="250" cy="280" r="172"/></g><g class="pv-guardian-art"><path d="M173 205 L192 143 L224 123 L250 139 L276 123 L308 143 L327 205 L301 251 L199 251 Z M191 251 L151 300 L121 412 L200 383 L250 417 L300 383 L379 412 L349 300 L309 251 M212 168 L232 176 M288 168 L268 176 M250 174V235 M206 227 L250 242 L294 227"/><path d="M164 311 L250 350 L336 311 M250 350V416 M103 472 Q250 520 398 472"/></g></svg>`,
  dual:`<svg viewBox="0 0 500 600" aria-hidden="true"><g class="pv-art-lines"><circle cx="250" cy="280" r="205"/><circle cx="250" cy="280" r="162"/><path d="M250 58V502M28 280H472"/></g><g class="pv-duality"><path d="M250 118 A162 162 0 0 0 250 442 A81 81 0 0 0 250 280 A81 81 0 0 1 250 118Z"/><path d="M250 118 A162 162 0 0 1 250 442"/><circle cx="250" cy="199" r="13"/><circle cx="250" cy="361" r="13"/></g></svg>`
 };
 let layer=null,formerFocus=null,oldOverflow='';
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 function close(){if(!layer)return;const node=layer;layer=null;node.classList.add('is-closing');document.body.style.overflow=oldOverflow;document.removeEventListener('keydown',onKey);setTimeout(()=>node.remove(),reduced.matches?0:350);if(formerFocus&&formerFocus.isConnected)formerFocus.focus({preventScroll:true})}
 function onKey(e){if(e.key==='Escape'){e.preventDefault();close()}else if(e.key==='Tab'&&layer){const options=[...layer.querySelectorAll('button:not([disabled])')].filter(el=>el.offsetParent!==null);if(!options.length)return;const first=options[0],last=options[options.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}}
 function el(tag,cls,text){let x=document.createElement(tag);if(cls)x.className=cls;if(text!==undefined)x.textContent=text;return x}
 window.openSkillStage = function(item){
  if(!item||typeof item!=='object')return;
  if(layer){layer.remove();layer=null;document.removeEventListener('keydown',onKey)}
  else {formerFocus=document.activeElement;oldOverflow=document.body.style.overflow}
  const title=String(item.title||'').replace(/[【】]/g,'');const theme=THEMES[title]||{kind:'ward',chapter:'SERVANT / LANCER',subtitle:'荒神 · 神代之记',glyph:'神',art:'ward'};
  const root=el('section','skill-stage pv-'+theme.kind);root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-label',title+' · 技能演出');root.tabIndex=-1;
  const backdrop=el('div','pv-backdrop');backdrop.setAttribute('aria-hidden','true');const flecks=el('div','pv-flecks');flecks.setAttribute('aria-hidden','true');
  const closeBtn=el('button','pv-close','返回典籍  ×');closeBtn.type='button';closeBtn.setAttribute('aria-label','关闭技能演出，返回典籍');closeBtn.addEventListener('click',close);
  const scroller=el('div','pv-scroll');const opening=el('div','pv-opening');const giant=el('span','pv-giant',theme.glyph);giant.setAttribute('aria-hidden','true');
  const figure=el('div','pv-figure');figure.setAttribute('aria-hidden','true');const media={'神炎雷鸣':'assets/flame-cropped.mp4','武神躯':'assets/guardian-web.mp4','武神魔眼':'assets/eye-composite.svg','荒神神相':'assets/arashigami-hd.jpg','神临人间':'assets/descent-web.mp4','天羽羽斩':'assets/sword-hd.jpg','佛魔一念':'assets/duality-web.mp4'}[title];if(media){figure.classList.add('pv-figure-media');const visual=document.createElement((/\.(gif|jpe?g|png|svg)$/i.test(media))?'img':'video');if(visual.tagName==='VIDEO'){visual.muted=true;visual.loop=true;visual.playsInline=true;visual.autoplay=true;visual.preload='metadata'}else{visual.alt=''}visual.src=media;figure.append(visual);}else{figure.innerHTML=art[theme.art]}
  const copy=el('div','pv-title-block');const eyebrow=el('p','pv-eyebrow',theme.chapter);const sub=el('p','pv-subtitle',theme.subtitle);const line=el('div','pv-title-line');const h=el('h2','pv-title',title);const rank=el('div','pv-rank');rank.append(el('small','','RANK'),el('strong','',String(item.rank||'')));line.append(h,rank);const rule=el('div','pv-title-rule');const quote=el('blockquote','pv-quote',String(item.quote||''));
  const go=el('button','pv-read','展开记述   ↓');go.type='button';copy.append(eyebrow,sub,line,rule,quote,go);opening.append(giant,figure,copy);
  const paper=el('article','pv-paper');const cap=el('div','pv-paper-cap');cap.append(el('span','','NARRATIVE / 神话记述'),el('span','',theme.chapter));const heading=el('h3','pv-paper-heading',title);const body=el('div','pv-prose',String(item.body||''));const ending=el('div','pv-ending','SUSANOO  /  LANCER');const back=el('button','pv-back','返回技能列表');back.type='button';back.addEventListener('click',close);paper.append(cap,heading,body,ending,back);
  go.addEventListener('click',()=>paper.scrollIntoView({behavior:reduced.matches?'auto':'smooth',block:'start'}));scroller.append(opening,paper);root.append(backdrop,flecks,scroller,closeBtn);document.body.append(root);document.body.style.overflow='hidden';layer=root;document.addEventListener('keydown',onKey);requestAnimationFrame(()=>root.classList.add('is-visible'));closeBtn.focus({preventScroll:true});
 };
})();


