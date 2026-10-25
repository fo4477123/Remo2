/* Warm-home exploration. Measured geometry stays authoritative; state is local. */
(() => {
  'use strict';
  const css=document.createElement('link');css.rel='stylesheet';css.href='studio-game.css?v=20261025-gpu1';document.head.append(css);
  const SAVE_KEY='b1-warm-home-exploration-v1', reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const roomList=[
    {id:'entry',name:'迎接日常',label:'大門與隱藏門',bounds:[769,510,445,190],tip:'沿電視牆轉角是大門，再接客衛隱藏門櫃；室內走道通往其他房間。'},
    {id:'living',name:'把光留給客廳',label:'客廳',bounds:[959,630,300,372],tip:'打開 77 吋電視，再試試可收合的小餐桌。'},
    {id:'master',name:'慢下來的地方',label:'主臥',bounds:[399,740,320,327],tip:'衣櫥以滑門保留床尾通道；靠近門片，看看裡面的收納。'},
    {id:'media',name:'工作，也能放鬆',label:'多功能室',bounds:[729,765,220,302],tip:'160 公分工作桌靠實牆，可切換坐姿與站姿高度。'},
    {id:'guest',name:'留一間彈性',label:'次臥',bounds:[399,300,360,255],tip:'保留客床與乾淨的通道，讓日常使用保持彈性。'},
    {id:'kitchen',name:'準備一頓晚餐',label:'廚房',bounds:[239,565,390,165],tip:'左側爐具、右側水槽；雲岩白冰箱旁是可開啟的電器收納櫃。'},
    {id:'bath',name:'藏在櫃牆之後',label:'客用衛浴',bounds:[769,300,275,210],tip:'先開隱藏門，再走進客衛；洗手台與馬桶同向，浴缸與淋浴分區。'},
    {id:'ensuite',name:'安靜的清晨',label:'主臥衛浴',bounds:[239,740,150,250],tip:'高窗讓光進來，淋浴區與乾區保持分隔。'},
    {id:'laundry',name:'生活的後台',label:'洗衣陽台',bounds:[239,300,145,250],tip:'LG 洗脫烘與陽台欄杆沿用模型位置，保留維護空間。'}
  ];
  const missions=[
    {id:'secret',title:'收納的秘密',body:'打開客衛隱藏門、清潔櫃及主臥衣櫥。',needs:['hidden','cleaning','wardrobe'],room:'entry'},
    {id:'work',title:'換個姿勢工作',body:'到多功能室，把工作桌升到站姿高度。',needs:['desk'],room:'media'},
    {id:'home',title:'準備回家時光',body:'開啟客廳電視，展開小餐桌。',needs:['tv','table'],room:'living'},
    {id:'evening',title:'留一盞暖光',body:'切換夕暮或夜間，看看光如何改變空間。',needs:['mood'],room:'living'},
    {id:'morning',title:'讓家動起來',body:'拉上客廳窗簾、打開冰箱、試試水龍頭與洗衣機。',needs:['curtain-living','fridge','faucet','washer'],room:'living'},
    {id:'fresh-air',title:'把春光請進家',body:'拉開客廳窗簾，再為次臥打開百葉，讓兩個空間都迎進日光。',needs:['curtain-living','guest-blind'],room:'guest'},
    {id:'weekend-reset',title:'週末整理日',body:'收好主臥寢具、打開床下收納，再把多功能室臥榻整理好。',needs:['master-bed-lift','master-bed-store','bench-storage'],room:'master'},
    {id:'winter-ready',title:'雪季裝備歸位',body:'把寶藍雪板拉出檢視，並點亮次臥閱讀燈，準備好出發。',needs:['snowboard-rack','guest-reading'],room:'guest'}
  ];
  const knownActions=new Set(['hidden','cleaning','wardrobe','desk','tv','table','mood','entrance','appliance','lobby-mail',...(window.B1_LIFE?.actors||[]).map(a=>a.id),...(window.B1_MODELS?.actors||[]).map(a=>a.id),'memory-wall']);
  let visited=new Set(),actions=new Set(),sceneMode='day',sound=false,saveOK=true,communityState={},storageState={};
  try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');if(s?.version===1){visited=new Set((Array.isArray(s.visited)?s.visited:[]).filter(id=>roomList.some(r=>r.id===id)));actions=new Set((Array.isArray(s.actions)?s.actions:[]).filter(id=>knownActions.has(id)));sceneMode=['day','dusk','night'].includes(s.scene)?s.scene:'day';sound=s.sound===true;communityState=s.community||{};storageState=s.storage||{};}}catch{saveOK=false;}
  window.B1_COMMUNITY?.restore(communityState);window.B1_ACTIVITIES?.restore(storageState);
  const completed=()=>missions.filter(m=>m.needs.every(id=>actions.has(id)));
  const persist=()=>{try{localStorage.setItem(SAVE_KEY,JSON.stringify({version:1,visited:[...visited],actions:[...actions],scene:sceneMode,sound,community:window.B1_COMMUNITY?.serialize(),storage:window.B1_ACTIVITIES?.serialize()}));}catch{saveOK=false;}};
  const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n;};
  const button=(text,action,cls='')=>{const b=el('button',cls,text);b.type='button';b.onclick=action;return b;};
  const workspace=document.querySelector('.workspace');document.body.classList.add('game-ready');
  const intro=el('section','explore-intro');intro.setAttribute('aria-label','暖木日常探索');
  intro.innerHTML=`<div><p class="explore-eyebrow">B1 · QINGPU 8TH × 9TH STREET</p><h2>走進暖木日常</h2><p>九個空間，${missions.length}個生活任務。拉開窗簾看看高鐵站方向，讓家隨你的日常動起來。</p></div>`;
  const introActions=el('div','explore-intro-actions'),start=button('開始探索',()=>goRoom('living'),'explore-primary');
  const journalButton=button('探索手札',()=>openJournal());introActions.append(start,journalButton);intro.append(introActions);workspace.prepend(intro);
  const progress=el('div','explore-progress');progress.innerHTML=`<span class="explore-progress-label"></span><progress max="${9+missions.length}" value="0" aria-label="探索完成進度"></progress><span class="explore-save"></span>`;intro.append(progress);
  const hud=el('div','explore-hud');hud.innerHTML='<span class="explore-eyebrow">WARM HOME / EXPLORE</span><strong>暖木日常</strong><small>隨意走走，或打開探索手札</small>';view.append(hud);
  const crosshair=el('span','explore-crosshair');crosshair.setAttribute('aria-hidden','true');view.append(crosshair);
  const quickJournal=button('探索手札',()=>openJournal(),'explore-journal-trigger');view.append(quickJournal);
  const marker=el('span','explore-marker');marker.setAttribute('aria-hidden','true');marker.hidden=true;view.append(marker);
  const prompt=button('',()=>activateNearby(),'interaction-prompt');prompt.hidden=true;view.append(prompt);
  const hint=el('div','explore-hint','WASD 移動 · 拖曳轉頭 · E 操作 · J 手札');view.append(hint);
  const toast=el('div','explore-toast');toast.setAttribute('role','status');toast.setAttribute('aria-live','polite');toast.hidden=true;view.append(toast);let toastUntil=0;
  const notify=message=>{toast.textContent=message;toast.hidden=false;toastUntil=performance.now()+3800;};
  const burstStyle=el('style');burstStyle.textContent='.quest-celebration{position:absolute;inset:0;z-index:35;display:grid;place-items:center;pointer-events:none;overflow:hidden}.quest-celebration-card{display:grid;gap:5px;text-align:center;padding:17px 26px;border:1px solid #f5e5bb;border-radius:18px;background:linear-gradient(135deg,#fff9e9f5,#e8efddf5);box-shadow:0 12px 45px #26392c55;color:#304c43;animation:quest-pop 1.65s cubic-bezier(.2,.8,.25,1) both}.quest-celebration-card strong{font-size:19px}.quest-celebration-card span{font-size:13px;color:#71805e}.quest-particle{position:absolute;left:50%;top:50%;width:9px;height:14px;border-radius:3px;background:var(--tone);animation:quest-spark 1.35s ease-out both;animation-delay:var(--delay)}@keyframes quest-pop{0%{opacity:0;transform:translateY(18px) scale(.72)}18%{opacity:1;transform:translateY(0) scale(1.05)}35%{transform:scale(1)}83%{opacity:1}100%{opacity:0;transform:translateY(-18px) scale(.98)}}@keyframes quest-spark{0%{opacity:0;transform:translate(0,0) rotate(0) scale(.2)}16%{opacity:1}100%{opacity:0;transform:translate(var(--dx),var(--dy)) rotate(var(--turn)) scale(.6)}}@media(prefers-reduced-motion:reduce){.quest-celebration-card,.quest-particle{animation-duration:.01ms}}';document.head.append(burstStyle);
  const celebrate=(title,detail='新收藏已加入客廳')=>{const burst=el('div','quest-celebration');burst.setAttribute('aria-hidden','true');const card=el('div','quest-celebration-card');card.append(el('strong','',`✦ ${title} 完成`),el('span','',detail));burst.append(card);const palette=['#d6ae64','#809477','#c68d79','#91abb0','#e8d6ac'];if(!reduced.matches)for(let i=0;i<28;i++){const p=el('i','quest-particle');p.style.setProperty('--dx',`${Math.round((Math.random()-.5)*Math.min(view.clientWidth*.8,760))}px`);p.style.setProperty('--dy',`${Math.round((Math.random()-.65)*Math.min(view.clientHeight*.8,520))}px`);p.style.setProperty('--turn',`${Math.round(Math.random()*720-360)}deg`);p.style.setProperty('--delay',`${Math.random()*.13}s`);p.style.setProperty('--tone',palette[i%palette.length]);burst.append(p);}view.append(burst);window.setTimeout(()=>burst.remove(),1900);chime();};
  const journal=el('dialog','explore-journal');journal.setAttribute('aria-labelledby','journal-title');
  journal.innerHTML='<div class="journal-head"><div><p class="explore-eyebrow">YOUR HOME JOURNAL</p><h2 id="journal-title">探索手札</h2></div></div><p class="journal-lead">任務沒有時間限制。走進每個空間，試試那些為日常留下的小設計。</p><div class="journal-missions"></div><h3>空間足跡</h3><div class="journal-rooms"></div><details class="journal-help"><summary>怎麼玩</summary><p>桌面：WASD／方向鍵移動，拖曳畫面轉頭。面向附近的物件，按 E 或點畫面提示。J 開關手札。Esc 釋放滑鼠或結束漫遊。</p><p>手機：左下搖桿移動、另一指拖曳轉頭，點畫面上的操作提示。上方房間選單可以快速前往空間。</p><p>門櫃會擋住行走；靠近並打開再通過。你的足跡與任務成果只儲存在這台裝置。</p></details>';
  const closeJournal=()=>{journal.close();keys.clear();};
  journal.querySelector('.journal-head').append(button('關閉',closeJournal,'journal-close'));
  const journalFoot=el('div','journal-foot');let resetArmedUntil=0;
  const resetButton=button('重新探索',()=>{if(performance.now()>resetArmedUntil){resetArmedUntil=performance.now()+5000;resetButton.textContent='再次點擊以清除探索紀錄';return;}resetHome();});
  resetButton.dataset.action='reset-exploration';
  const soundButton=button('',()=>{sound=!sound;persist();updateProgress();chime();});journalFoot.append(soundButton,resetButton);journal.append(journalFoot);view.append(journal);
  journal.addEventListener('keydown',e=>{if(e.key==='Escape'||e.key.toLowerCase()==='j'){e.preventDefault();e.stopPropagation();closeJournal();}});
  journal.addEventListener('close',()=>keys.clear());
  function openJournal(){keys.clear();if(document.pointerLockElement)document.exitPointerLock();updateProgress();if(!journal.open)journal.showModal();}
  function goRoom(id){window.B1_COMMUNITY?.returnHome(id,false);closeJournal();if(!walking)renderButton.click();document.querySelector(`[data-room="${id}"]`)?.click();keys.clear();view.scrollIntoView({block:'center',behavior:reduced.matches?'auto':'smooth'});}
  let audioContext;
  function chime(){if(!sound)return;try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;audioContext??=new AC();audioContext.resume().catch(()=>{});const osc=audioContext.createOscillator(),gain=audioContext.createGain(),now=audioContext.currentTime;osc.type='sine';osc.frequency.setValueAtTime(523,now);osc.frequency.exponentialRampToValueAtTime(784,now+.12);gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.045,now+.02);gain.gain.exponentialRampToValueAtTime(.0001,now+.3);osc.connect(gain);gain.connect(audioContext.destination);osc.start();osc.stop(now+.32);}catch{sound=false;}}
  function updateProgress(){const done=completed();progress.querySelector('progress').value=visited.size+done.length;progress.querySelector('.explore-progress-label').textContent=`${visited.size} / 9 空間 · ${done.length} / ${missions.length} 任務`;progress.querySelector('.explore-save').textContent=saveOK?'進度保存在本機':'本次進度暫存於頁面';soundButton.textContent=`提示音：${sound?'開':'關'}`;soundButton.setAttribute('aria-pressed',String(sound));start.textContent=visited.size?'繼續探索':'開始探索';
    const missionList=journal.querySelector('.journal-missions');missionList.replaceChildren();for(const m of missions){const card=el('article','journal-mission');const count=m.needs.filter(id=>actions.has(id)).length;card.classList.toggle('is-complete',count===m.needs.length);card.append(el('small','quest-reward','+100 XP / +30 LP / 1 COLLECTIBLE'),el('span','mission-state',count===m.needs.length?'✓':`${count}/${m.needs.length}`),el('h4','',m.title),el('p','',m.body),button(count===m.needs.length?'再去看看':'前往空間',()=>goRoom(m.room)));missionList.append(card);}
    window.B1_COMMUNITY?.sync({visited:[...visited],actions:[...actions],completed:done.map(m=>m.id)});
    const roomsEl=journal.querySelector('.journal-rooms');roomsEl.replaceChildren();for(const r of roomList){const b=button(`${visited.has(r.id)?'✓':'○'} ${r.label}`,()=>goRoom(r.id));b.classList.toggle('is-visited',visited.has(r.id));b.title=r.tip;roomsEl.append(b);}
    for(const label of document.querySelectorAll('[data-explore-room]'))label.classList.toggle('is-visited',visited.has(label.dataset.exploreRoom));
  }
  function award(id){if(actions.has(id))return;const before=completed().length;actions.add(id);persist();updateProgress();if(completed().length>before){const mission=missions.find(m=>m.needs.includes(id)&&m.needs.every(n=>actions.has(n)));notify(`完成手札：${mission.title} · +100 經驗 / +30 生活點 / 新收藏已掛上記憶牆`);celebrate(mission.title,'+100 XP · +30 生活點 · 客廳新增一張收藏');}}
  const moodRow=el('div','explore-moods');moodRow.setAttribute('role','group');moodRow.setAttribute('aria-label','光影情境');
  for(const [id,label]of [['day','晨光'],['dusk','夕暮'],['night','夜間']]){const b=button(label,()=>setMood(id,true));b.dataset.mood=id;moodRow.append(b);}introActions.append(moodRow);
  const journalMoods=moodRow.cloneNode(true);journalMoods.querySelectorAll('button').forEach(b=>b.onclick=()=>setMood(b.dataset.mood,true));journal.querySelector('.journal-lead').after(journalMoods);
  const lifeControls=el('section','journal-life');lifeControls.innerHTML='<h3>生活控制</h3><p>可在這裡直接控制設備，也可以到房間內靠近物件按 E。</p><div class="journal-life-actions"></div><small>窗外：青埔八街 × 青埔九街朝高鐵桃園站，後側為青松街。區域景觀模擬。</small>';journal.querySelector('.journal-rooms').after(lifeControls);
  const lifeButtons=new Map();
  for(const a of window.B1_LIFE?.actors||[]){const b=button('',()=>{toggle(a.id);updateLifeControls();});b.dataset.life=a.id;lifeButtons.set(a.id,b);lifeControls.querySelector('.journal-life-actions').append(b);}
  function updateLifeControls(){for(const a of window.B1_LIFE?.actors||[]){const b=lifeButtons.get(a.id);b.textContent=`${a.name} · ${a.verbs[a.on?1:0]}`;b.setAttribute('aria-pressed',String(a.on));}}
  let changingMood=false;
  function setMood(mode,earned=false){sceneMode=mode;changingMood=true;const n=document.querySelector('#night');n.checked=mode==='night';n.dispatchEvent(new Event('change'));changingMood=false;
    sun.color.set(mode==='dusk'?'#ffc48b':'#fff2da');sun.intensity=mode==='night'?.08:mode==='dusk'?1.05:2.1;hemi.intensity=mode==='night'?.3:mode==='dusk'?.8:1.05;scene.background.set(mode==='night'?'#303b38':mode==='dusk'?'#d5c5b2':'#dedfd5');renderer.toneMappingExposure=1.2;renderer.shadowMap.needsUpdate=true;
    window.B1_EXTERIOR?.setMood(mode);window.B1_LIFE?.refreshLighting();document.querySelectorAll('[data-mood]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mood===mode)));if(earned&&mode!=='day')award('mood');persist();}
  document.querySelector('#night').addEventListener('change',e=>{if(!changingMood)setMood(e.target.checked?'night':'day',true);});

  // Each actor holds an actual leaf/mesh, one state and a reversible transition.
  const hinge=(mesh,x,y)=>{const g=new T.Group();g.position.copy(W(x,y));scene.add(g);g.attach(mesh);return g;};
  const cleanHinge=hinge(cleaningDoors[0],912,555);
  const applianceHinges=[hinge(applianceDoors[0],...APPLIANCE_LAYOUT.map(548.1,670).slice(0,2)),hinge(applianceDoors[1],...APPLIANCE_LAYOUT.map(624.1,670).slice(0,2))];
  const wardrobeZ=wardrobeDoors[1].position.z;
  const deskParts=scene.children.filter(o=>o.userData.furnitureName==='160 cm 升降工作桌／對面實牆'&&o.position.y>=70).map(mesh=>({mesh,y:mesh.position.y}));
  const extensions=[804,914].map(y=>box(905,y,5.5,5.5,38,chrome,51));extensions.forEach(m=>m.visible=false);
  let tvMesh;scene.traverse(o=>{if(o.isMesh&&o.userData.furnitureName==='延伸電視牆／單扇玻璃門'&&o.material===black&&Math.abs((o.geometry.parameters?.depth||0)-170.4)<1)tvMesh=o;});
  const screenCanvas=document.createElement('canvas');screenCanvas.width=512;screenCanvas.height=288;const sc=screenCanvas.getContext('2d');const grad=sc.createLinearGradient(0,0,512,288);grad.addColorStop(0,'#183e42');grad.addColorStop(1,'#83987b');sc.fillStyle=grad;sc.fillRect(0,0,512,288);sc.fillStyle='#ffffff18';sc.beginPath();sc.arc(440,60,160,0,Math.PI*2);sc.fill();sc.fillStyle='#f8eed5';sc.font='22px sans-serif';sc.fillText('WARM HOME',42,72);sc.font='bold 50px serif';sc.fillText('Slow living.',40,158);sc.font='16px sans-serif';sc.fillText('A little light. A little time.',43,208);const tvTexture=new T.CanvasTexture(screenCanvas);tvTexture.colorSpace=T.SRGBColorSpace;
  const tvOff=tvMesh?.material.clone(),tvOn=new T.MeshBasicMaterial({map:tvTexture});
  const actors=[
    {id:'entrance',name:'入口大門',x:1157,y:507,h:125,range:125,on:false,p:0,leaf:window.mainDoorHinge,span:100,apply:p=>window.mainDoorHinge.rotation.y=p*Math.PI/2,flag:on=>{mainDoorOpen=on;mainDoorSwing.setAttribute('visibility',on?'visible':'hidden');mainDoorButton.textContent=on?'關閉大門':'開啟大門';}},
    {id:'hidden',name:'客衛隱藏門',x:869,y:554,h:120,range:115,on:false,p:0,leaf:hiddenDoorHinge,span:80,apply:p=>hiddenDoorHinge.rotation.y=-p*Math.PI/2,flag:on=>{doorOpen=on;doorSwing.setAttribute('visibility',on?'visible':'hidden');doorButton.textContent=on?'關閉隱藏門':'開啟隱藏門';}},
    {id:'cleaning',name:'清潔收納櫃',x:942,y:555,h:130,range:100,on:false,p:0,leaf:cleanHinge,span:60,apply:p=>cleanHinge.rotation.y=p*Math.PI/2,flag:on=>cleaningButton.textContent=on?'關閉清潔櫃':'打開清潔櫃'},
    {id:'wardrobe',name:'主臥滑門衣櫥',x:660,y:900,h:140,range:100,on:false,p:0,apply:p=>wardrobeDoors[1].position.z=wardrobeZ+122*p},
    {id:'appliance',name:'電器收納櫃',x:APPLIANCE_LAYOUT.map(585,668)[0],y:APPLIANCE_LAYOUT.map(585,668)[1],h:225,range:120,on:false,p:0,apply:p=>{applianceHinges[0].rotation.y=-p*Math.PI/2;applianceHinges[1].rotation.y=p*Math.PI/2;}},
    {id:'desk',name:'升降工作桌',x:873,y:870,h:90,range:120,on:false,p:0,verbs:['升至站姿','降回坐姿'],apply:p=>{for(const {mesh,y}of deskParts)mesh.position.y=y+37*p;for(const m of extensions){m.visible=p>.01;m.scale.y=Math.max(.01,p);m.position.y=72+18.5*p;}}},
    {id:'tv',name:'客廳電視',x:1248,y:863,h:120,range:185,on:false,p:0,verbs:['開啟電視','關閉電視'],apply:p=>{if(tvMesh)tvMesh.material=p>.5?tvOn:tvOff;}},
    {id:'table',name:'收合小餐桌',x:865,y:685,h:75,range:110,on:false,p:0,verbs:['展開餐桌','收起餐桌'],blocked:()=>walking&&walkX>808&&walkX<922&&walkY>638&&walkY<697,apply:p=>{leaf.visible=leafLeg.visible=p>.5;leafPlan.setAttribute('visibility',p>.5?'visible':'hidden');},flag:on=>foldButton.textContent=on?'收起小餐桌':'展開小餐桌'},
    ...(window.B1_LIFE?.actors||[]),...(window.B1_MODELS?.actors||[]),...(window.B1_COMMUNITY?.actors||[])
  ];
  const actor=id=>actors.find(a=>a.id===id);
  const leaves=a=>a.leaves||(a.leaf?[a]:[]);
  const segment=a=>{a.leaf.updateWorldMatrix(true,false);const start=a.leaf.localToWorld(new T.Vector3(0,0,0)),end=a.leaf.localToWorld(new T.Vector3(a.span,0,0));return [[start.x+750,700-start.z],[end.x+750,700-end.z]];};
  function doorDistance(a,x,y){return Math.min(...leaves(a).map(l=>{const [s,e]=segment(l);return distanceToSegment(x,y,s,e);}));}
  function toggle(id){const a=actor(id);if(!a)return false;if(window.B1_COMMUNITY?.inLobby)B1_COMMUNITY.returnHome(a.room||'living');if(a.interact){a.interact();return true;}if(a.guard&&!a.guard()){notify(a.blockedMessage);return false;}if(!a.on&&a.blocked?.()){notify(a.blockedMessage||'請先離開餐桌展開範圍，再展開桌面');return false;}a.on=!a.on;a.motion={from:a.p,at:performance.now()};a.flag?.(a.on);if(reduced.matches){const before=a.p;a.p=a.on?1:0;a.apply(a.p);if(leaves(a).length&&walking&&doorDistance(a,walkX,walkY)<13){a.p=before;a.on=before>.5;a.apply(before);a.flag?.(a.on);notify('門邊有點擠，請退一步再操作');return false;}}if(a.on&&a.p===1)award(id);updateLifeControls();renderer.shadowMap.needsUpdate=true;return true;}
  mainDoorButton.onclick=()=>toggle('entrance');doorButton.onclick=()=>toggle('hidden');cleaningButton.onclick=()=>toggle('cleaning');foldButton.onclick=()=>toggle('table');
  const staticStand=canStand;canStand=(x,y)=>(window.B1_COMMUNITY?.inLobby?B1_COMMUNITY.canStand(x,y):staticStand(x,y)&&actors.filter(a=>leaves(a).length).every(a=>doorDistance(a,x,y)>=12));B1_REVIEW.canStand=canStand;
  // Rays stop at physical walls, windows and other door leaves, not at rooms' names.
  const walls=B1_PLAN.walls.flatMap(w=>w.points.slice(1).map((p,i)=>[w.points[i],p]));
  for(const w of windowSpecs)walls.push(w.axis==='h'?[[w.from,w.line],[w.to,w.line]]:[[w.line,w.from],[w.line,w.to]]);
  function crossing(ax,ay,bx,by,c,d){const rx=bx-ax,ry=by-ay,sx=d[0]-c[0],sy=d[1]-c[1],den=rx*sy-ry*sx;if(Math.abs(den)<.0001)return null;const t=((c[0]-ax)*sy-(c[1]-ay)*sx)/den,u=((c[0]-ax)*ry-(c[1]-ay)*rx)/den;return t>0&&t<1&&u>=0&&u<=1?t:null;}
  function visible(a,x=walkX,y=walkY){const dist=Math.hypot(a.x-x,a.y-y);return !walls.some(([c,d])=>{const t=crossing(x,y,a.x,a.y,c,d);return t!==null&&t*dist>5&&(1-t)*dist>12;})&&!actors.some(b=>b!==a&&b.id!==a.id&&leaves(b).some(l=>crossing(x,y,a.x,a.y,...segment(l))!==null));}
  function chooseTarget(){if(!walking||canvas.hidden||journal.open)return null;return actors.map(a=>{const dx=a.x-walkX,dy=a.y-walkY,d=Math.hypot(dx,dy),facing=(dx*Math.sin(walkYaw)+dy*Math.cos(walkYaw))/Math.max(d,1);const p=W(a.x,a.y,a.h).project(camera);return {a,d,facing,p};}).filter(({a,d,facing,p})=>(!a.available||a.available())&&d<a.range&&facing>.35&&Math.abs(p.x)<.9&&Math.abs(p.y)<.95&&p.z<1&&visible(a)).sort((u,v)=>(u.d+50*(1-u.facing)+40*(Math.abs(u.p.x)+Math.abs(u.p.y)))-(v.d+50*(1-v.facing)+40*(Math.abs(v.p.x)+Math.abs(v.p.y))))[0]?.a||null;}
  let nearby=null;
  function activateNearby(){nearby=chooseTarget();if(nearby)toggle(nearby.id);}
  addEventListener('keydown',e=>{if(isEditing(e)||journal.open)return;if(e.key.toLowerCase()==='j'&&!e.repeat){e.preventDefault();openJournal();}if(e.key.toLowerCase()==='e'&&!e.repeat&&walking){e.preventDefault();activateNearby();}});
  B1_REVIEW.interaction={targets:actors.map(({id,name,x,y,h,range})=>({id,name,x,y,h,range})),toggle:activateNearby};
  const setTourBefore=setTour;setTour=function(enabled){if(!enabled)window.B1_COMMUNITY?.returnHome('entry',false);setTourBefore(enabled);if(!enabled){nearby=null;prompt.hidden=marker.hidden=true;}keys.clear();};B1_REVIEW.setTour=setTour;
  // Clear floor-map labels replace overlapping per-furniture paragraphs.
  svg.querySelectorAll('text').forEach(n=>n.classList.add('plan-technical-label'));
  const planLabels=document.createElementNS(NS,'g');planLabels.classList.add('plan-room-labels');svg.append(planLabels);
  for(const r of roomList){const [x,y,w,d]=r.bounds;const g=document.createElementNS(NS,'g');g.dataset.exploreRoom=r.id;const t=document.createElementNS(NS,'text');t.setAttribute('x',x+w/2);t.setAttribute('y',1100-y-d/2);t.setAttribute('text-anchor','middle');t.textContent=r.label;g.append(t);planLabels.append(g);}
  const defaultStops=Object.fromEntries(Object.entries(stops).map(([id,p])=>[id,[...p]]));
  function repairStop(id){const p=defaultStops[id];if(!p)return;const within=(x,y)=>{const b=roomList.find(r=>r.id===id)?.bounds;return !b||(x>=b[0]&&x<=b[0]+b[2]&&y>=b[1]&&y<=b[1]+b[3]);};if(canStand(p[0],p[1])){stops[id]=[...p];return;}for(let r=5;r<=160;r+=5)for(let a=0;a<Math.PI*2;a+=Math.PI/12){const x=p[0]+Math.cos(a)*r,y=p[1]+Math.sin(a)*r;if(within(x,y)&&canStand(x,y)){stops[id]=[x,y,p[2]];return;}}}
  function repairStops(){for(const id of Object.keys(stops))repairStop(id);}
  const selectBeforeGame=select;select=function(id){window.B1_COMMUNITY?.returnHome(id,false);repairStop(id);selectBeforeGame(id);};
  repairStops();let uiClock=0,currentRoom=null,completeNotified=false;
  function resetHome(){window.B1_COMMUNITY?.reset();setTour(false);for(const a of actors){a.on=Boolean(a.initial);a.p=a.on?1:0;a.motion=null;a.flag?.(a.on);a.apply(a.p);}window.B1_LIFE?.reset();setMood('day');visited.clear();actions.clear();completeNotified=false;persist();resetButton.textContent='重新探索';resetArmedUntil=0;updateProgress();updateLifeControls();renderer.shadowMap.needsUpdate=true;notify('已復原門櫃、設備與晨光，探索紀錄已清除');}
  function tick(dt,now){window.B1_COMMUNITY?.tick(dt,now);if(window.B1_COMMUNITY?.inLobby)return;
    for(const a of actors){if(a.on&&!a.blockedMessage&&a.blocked?.()){a.on=false;a.motion={from:a.p,at:now};a.flag?.(false);}const goal=a.on?1:0;if(a.p===goal)continue;a.motion??={from:a.p,at:now};const elapsed=Math.max(0,Math.min(1,(now-a.motion.at)/500)),next=a.motion.from+(goal-a.motion.from)*elapsed,old=a.p,steps=Math.max(1,Math.ceil(Math.abs(next-old)/.025));let blocked=false;
      for(let i=1;i<=steps;i++){const candidate=old+(next-old)*i/steps,previous=a.p;a.p=candidate;a.apply(candidate*candidate*(3-2*candidate));if(leaves(a).length&&walking&&doorDistance(a,walkX,walkY)<12){a.p=previous;a.on=!a.on;a.motion={from:a.p,at:now};a.apply(a.p*a.p*(3-2*a.p));a.flag?.(a.on);updateLifeControls();blocked=true;break;}}
      if(!blocked&&elapsed===1){a.p=goal;a.apply(goal);a.motion=null;if(a.on)award(a.id);}renderer.shadowMap.needsUpdate=true;
    }
    window.B1_LIFE?.tick(dt,now);
    if(toastUntil&&now>toastUntil){toast.hidden=true;toastUntil=0;}if(resetArmedUntil&&now>resetArmedUntil){resetArmedUntil=0;resetButton.textContent='重新探索';}
    if(journal.open)keys.clear();uiClock+=dt;if(uiClock<.12)return;uiClock=0;
    if(walking&&!canvas.hidden){const r=roomList.find(({bounds:[x,y,w,d]})=>walkX>=x&&walkX<=x+w&&walkY>=y&&walkY<=y+d);if(r){currentRoom=r.id;hud.querySelector('strong').textContent=r.name;hud.querySelector('small').textContent=r.label;if(!visited.has(r.id)){visited.add(r.id);persist();updateProgress();notify(`走進 ${r.label} · ${visited.size} / 9`);}}else{currentRoom=null;hud.querySelector('strong').textContent='串起日常的走道';hud.querySelector('small').textContent='前往其他房間，繼續探索';}}
    nearby=chooseTarget();prompt.hidden=marker.hidden=!nearby;hint.hidden=!walking||canvas.hidden||journal.open||Boolean(nearby);if(nearby){prompt.textContent=`E · ${nearby.verbs?nearby.verbs[nearby.on?1:0]:`${nearby.on?'關閉':'打開'}${nearby.name}`}`;prompt.setAttribute('aria-label',prompt.textContent);const p=W(nearby.x,nearby.y,nearby.h).project(camera);marker.hidden=Math.abs(p.x)>1||Math.abs(p.y)>1||p.z>1;marker.style.left=`${(p.x+1)*canvas.clientWidth/2}px`;marker.style.top=`${(1-p.y)*canvas.clientHeight/2}px`;}
    if(visited.size===9&&completed().length===missions.length&&!completeNotified){completeNotified=true;notify('暖木日常探索完成！所有空間與日常任務已收集。');chime();}
  }
  window.B1_GAME={recordAction:award,save:persist,notify,celebrate,setTour,tick,goRoom,toggle,setMood,visible,chooseTarget:()=>chooseTarget()?.id||null,openJournal,snapshot:()=>({visited:[...visited],actions:[...actions],completed:completed().map(m=>m.id),scene:sceneMode,currentRoom,actors:Object.fromEntries(actors.map(a=>[a.id,{open:a.on,progress:a.p}])),saveOK}),roomList};
  updateProgress();updateLifeControls();setMood(sceneMode);window.B1_COMMUNITY?.attachGame(B1_GAME);B1_REVIEW.gameReady=true;
})();
