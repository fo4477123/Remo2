/* Community chapter: local quests, a lobby scene and visible home memories. */
(() => {
  const {rounded,rod}=B1_MODELS;
  const lobby=new T.Scene();lobby.background=new T.Color('#d7e0dd');lobby.environment=scene.environment;
  lobby.userData.floor=1;const groundView=scene.getObjectByName('qingpu-360-environment').clone();groundView.name='qingpu-ground-environment';groundView.material=B1_EXTERIOR.groundMaterial;groundView.position.copy(W(2400,800,160));groundView.userData.floor=1;groundView.frustumCulled=false;lobby.add(groundView);
  const ambient=new T.HemisphereLight('#fff2de','#8b968b',2.3);lobby.add(ambient);
  const key=new T.DirectionalLight('#fff0d8',2.5);key.position.copy(W(2050,650,1400));lobby.add(key);
  const stone=mat('#dbd8cf',.45),timber=oak.clone(),metal=mat('#716b5f',.3,{metalness:.8}),cloth=mat('#a4afa2',.9),ink=mat('#3a5148',.6);
  const lb=(x,y,w,d,h,m,z=0)=>rounded(x,y,w,d,h,m,z,lobby,.8);
  const floorMaterial=stone.clone(),floorCanvas=document.createElement('canvas');floorCanvas.width=floorCanvas.height=256;const fctx=floorCanvas.getContext('2d');fctx.fillStyle='#dcdad2';fctx.fillRect(0,0,256,256);fctx.strokeStyle='#b7b9ac';fctx.lineWidth=1;fctx.strokeRect(.5,.5,255,255);for(let i=0;i<7;i++){fctx.strokeStyle='rgba(135,140,128,.025)';fctx.beginPath();fctx.moveTo(0,i*45);fctx.bezierCurveTo(70,i*45+20,150,i*45-30,256,i*45+12);fctx.stroke();}const floorMap=new T.CanvasTexture(floorCanvas);floorMap.colorSpace=T.SRGBColorSpace;floorMap.wrapS=floorMap.wrapT=T.RepeatWrapping;floorMap.repeat.set(12,10);floorMaterial.map=floorMap;
  lb(1800,300,1200,1000,8,floorMaterial,-8);lb(1800,300,1200,1000,8,cream,280);
  lb(1800,300,1200,12,280,cream);lb(1800,300,12,1000,280,cream);lb(2988,300,12,1000,280,cream);
  // Glazing and entrance mullions on the south wall bring a calm street-side light.
  for(let x=1812;x<2988;x+=147){lb(x,1290,6,10,280,metal);lb(x+6,1294,140,2,250,glass,14);}lb(1812,1290,1176,10,14,metal,266);
  for(const [x,y]of [[2000,600],[2650,600],[2400,1100]]){const l=new T.PointLight('#ffe1b2',15000,650,2);l.position.copy(W(x,y,250));lobby.add(l);lb(x-65,y-2,130,4,1,mat('#fff0ce',.2,{emissive:0xffdc9f,emissiveIntensity:1.3}),274);}
  lb(1900,360,320,140,100,timber);lb(1896,356,328,148,5,stone,100);lb(1915,351,290,3,55,ink,20);
  for(let x=1915;x<2200;x+=13)lb(x,350,2,3,55,metal,20);
  lb(1860,840,110,300,20,timber,4);for(let y=848;y<1130;y+=94){rounded(1872,y,84,87,13,cloth,24,lobby,5);rounded(1862,y,14,87,45,cloth,35,lobby,5);}
  lb(2260,820,120,160,7,stone,48);for(const x of [2275,2355])rod([x,840,0],[x,840,48],2,metal,lobby);
  for(let row=0;row<4;row++)for(let col=0;col<3;col++){lb(2923,420+col*85,58,78,39,timber,38+row*44);lb(2919,425+col*85,3,68,29,metal,43+row*44);}
  for(const y of [1030,1130])lb(2980,y,6,90,235,metal,0);
  const accent=mat('#d3b98e',.4,{emissive:0xc5a776,emissiveIntensity:.25});lb(2973,1025,5,200,5,accent,238);

  function canvasTexture(draw,w=768,h=384){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t;}
  function sign(text,sub,x,y,z,w,h,parent=lobby,angle=Math.PI){const map=canvasTexture((c,cw,ch)=>{c.fillStyle='#304c43';c.fillRect(0,0,cw,ch);c.fillStyle='#e4d4b4';c.font='24px sans-serif';c.fillText(sub,45,65);c.fillStyle='#faf4e8';c.font='48px Microsoft JhengHei,sans-serif';c.fillText(text,45,146);c.fillStyle='#b8c7ad';c.font='21px sans-serif';c.fillText('QINGPU / WARM NEIGHBOURHOOD',45,ch-45);});const mesh=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map}));mesh.position.copy(W(x,y,z));mesh.rotation.y=angle;parent.add(mesh);return mesh;}
  sign('1F 暖木社區','WELCOME HOME',2050,318,180,300,100);
  sign('社區任務看板','EXPLORE · HELP · COLLECT',2600,320,158,310,158);
  sign('住戶電梯','1F LOBBY / 5F HOME',2970,1120,154,155,72,lobby,-Math.PI/2);
  const obstacles=[[1900,360,320,140],[1860,840,110,300],[2260,820,120,160],[2915,410,73,300]];
  const canStandLobby=(x,y)=>x>1825&&x<2965&&y>325&&y<1275&&!obstacles.some(([a,b,w,d])=>x>a-12&&x<a+w+12&&y>b-12&&y<b+d+12);
  let inLobby=false,homePosition=null,homeUI=null,api=null,progress={visited:[],actions:[],completed:[]},accepted=new Set(),claimed=new Set();
  const quests=[
    {id:'welcome',title:'新住戶報到',body:'查看大廳信箱，再走訪客廳、主臥與多功能室。',rooms:['living','master','media'],actions:['lobby-mail'],xp:180,coins:50,card:'鄰里問候'},
    {id:'smart-home',title:'智慧住宅體驗',body:'回家試用升降茶几、工作螢幕、冰箱與客廳窗簾。',rooms:[],actions:['coffee-lift','desk-screen','fridge','curtain-living'],xp:220,coins:60,card:'智慧日常'},
    {id:'daily-care',title:'舒服的一天',body:'體驗兩間衛浴的水龍頭、花灑和沖水，再點亮兩間臥室的閱讀燈。',rooms:[],actions:['bath-faucet','ensuite-faucet','bath-shower','ensuite-shower','bath-flush','ensuite-flush','master-reading','guest-reading'],xp:180,coins:50,card:'舒心日常'},
    {id:'home-chef',title:'收納與料理',body:'試用爐火、抽油煙機、烤箱與晾衣桿，打開冰箱上櫃和上掀臥榻看看收納。',rooms:[],actions:['cooktop','range-hood','oven','drying-rack','fridge-upper','bench-storage'],xp:200,coins:60,card:'井然有味'}
  ];
  const homeRewards=[['secret','收納的秘密','收納小屋',100,30],['work','換個姿勢工作','工作靈感',100,30],['home','準備回家時光','回家咖啡',100,30],['evening','留一盞暖光','暖光夜曲',100,30],['morning','讓家動起來','晨間節奏',100,30]];
  const rewardList=[...homeRewards.map(([id,title,card,xp,coins])=>({id,title,card,xp,coins,community:false})),...quests.map(q=>({...q,community:true}))];
  const rewards=()=>rewardList.filter(r=>r.community?claimed.has(r.id):progress.completed.includes(r.id));
  const stats=()=>{const list=rewards(),xp=list.reduce((s,r)=>s+r.xp,0);return {xp,coins:list.reduce((s,r)=>s+r.coins,0),level:1+Math.floor(xp/200),cards:list.map(r=>r.id)};};
  const ready=q=>q.rooms.every(id=>progress.visited.includes(id))&&q.actions.every(id=>progress.actions.includes(id));
  const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n;};
  const btn=(text,fn)=>{const b=el('button','',text);b.type='button';b.onclick=fn;return b;};
  const board=el('dialog','community-board');board.innerHTML='<div class="community-board-head"><div><small>QINGPU / RESIDENT SERVICES</small><h2>大廳任務看板</h2></div></div><p>接下委託，回家體驗日常，再帶著成果回來。獎勵會成為客廳記憶牆的一部分。</p><div class="community-quest-list"></div><div class="community-board-foot"></div>';view.append(board);
  board.querySelector('.community-board-head').append(btn('關閉',()=>board.close()));
  board.querySelector('.community-board-foot').append(btn('回到家裡',()=>returnHome('entry')));
  board.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();board.close();}});board.addEventListener('close',()=>keys.clear());
  const hud=el('div','community-hud');hud.innerHTML='<small>1F / COMMUNITY LOBBY</small><strong>一樓・暖木社區大廳</strong><span>信箱・任務看板・電梯前往 5F 住宅</span>';view.append(hud);
  const travel=el('div','community-travel');const lobbyButton=btn('搭電梯到 1F 大廳',()=>inLobby?returnHome('entry'):enterLobby());lobbyButton.className='community-travel-button';travel.append(lobbyButton);view.append(travel);
  const prompt=btn('',()=>activate());prompt.className='community-interact';prompt.hidden=true;view.append(prompt);
  const lobbyTools=el('div','community-lobby-tools');lobbyTools.append(btn('前往看板',()=>{walkX=2600;walkY=480;walkYaw=Math.PI;lookPitch=-.05;keys.clear();}),btn('返回住宅',()=>returnHome('entry')));view.append(lobbyTools);
  let nearby=null;
  const targets=[{id:'board',x:2600,y:320,h:158,range:195,label:'查看任務看板',use:()=>openBoard()},
    {id:'mail',x:2910,y:560,h:125,range:150,label:'查看住戶信箱',use:()=>{api.recordAction('lobby-mail');api.notify('信箱已查看 · 歡迎回到暖木社區');}},
    {id:'elevator',x:2970,y:1120,h:150,range:170,label:'搭電梯返回五樓',use:()=>returnHome('entry')}];
  function openBoard(){if(!inLobby)return false;keys.clear();if(document.pointerLockElement)document.exitPointerLock();renderBoard();if(!board.open)board.showModal();return true;}
  function accept(id){const q=quests.find(q=>q.id===id);if(!inLobby||!q||accepted.has(id))return false;accepted.add(id);api?.save();renderBoard();api?.notify(`已接取：${q.title}`);return true;}
  function claim(id){const q=quests.find(q=>q.id===id);if(!inLobby||!q||!accepted.has(id)||claimed.has(id)||!ready(q))return false;claimed.add(id);api?.save();sync(progress);renderBoard();api?.notify(`委託完成 · +${q.xp} 經驗 / +${q.coins} 生活點 / ${q.card}`);return true;}
  function renderBoard(){const list=board.querySelector('.community-quest-list');list.replaceChildren();for(const q of quests){const card=el('article','community-quest'),done=q.rooms.filter(id=>progress.visited.includes(id)).length+q.actions.filter(id=>progress.actions.includes(id)).length,total=q.rooms.length+q.actions.length;card.append(el('small','',claimed.has(q.id)?'✓ 已領取':accepted.has(q.id)?`${done}/${total} · 進行中`:'可接取'),el('h3','',q.title),el('p','',q.body),el('p','quest-reward',`${q.xp} 經驗 · ${q.coins} 生活點 · 收藏「${q.card}」`));const b=btn(claimed.has(q.id)?'已完成':!accepted.has(q.id)?'接取委託':ready(q)?'領取獎勵':'回家繼續',()=>!accepted.has(q.id)?accept(q.id):ready(q)?claim(q.id):returnHome('living'));b.dataset.quest=q.id;b.disabled=claimed.has(q.id);card.append(b);list.append(card);}}

  // Above the sofa: each completed mission adds one physical postcard.
  const memories=new T.Group();memories.name='living-memory-wall';scene.add(memories);
  rounded(960,752,5,198,114,timber,146,memories,2);
  sign('生活記憶牆','LITTLE MOMENTS, A RICHER HOME',966,850,245,174,18,memories,Math.PI/2);
  function drawCard(c,w,h,i,label){const colors=['#9eab89','#aab7bd','#c5ae8f','#84998d','#d0bb8e','#a6afa7','#9aacb1','#a2b4ae','#c1a587'];c.fillStyle='#f7f0df';c.fillRect(0,0,w,h);c.fillStyle=colors[i];c.fillRect(15,15,w-30,h-85);c.strokeStyle='#fff9eb';c.fillStyle='#fff4dc';c.lineWidth=5;c.lineCap='round';
    if(i===0||i===5){c.beginPath();c.moveTo(65,90);c.lineTo(125,43);c.lineTo(187,90);c.lineTo(187,151);c.lineTo(65,151);c.closePath();c.stroke();c.strokeRect(113,112,24,39);if(i===5){c.beginPath();c.arc(188,50,17,0,Math.PI*2);c.fill();}}
    if(i===1){c.strokeRect(58,50,139,84);c.beginPath();c.moveTo(128,135);c.lineTo(128,155);c.moveTo(91,155);c.lineTo(165,155);c.stroke();c.fillRect(74,69,70,5);c.fillRect(74,87,99,5);}
    if(i===2){c.beginPath();c.moveTo(72,86);c.lineTo(72,133);c.quadraticCurveTo(126,172,171,133);c.lineTo(171,86);c.closePath();c.stroke();c.beginPath();c.arc(174,108,20,-Math.PI/2,Math.PI/2);c.moveTo(100,68);c.quadraticCurveTo(89,52,104,38);c.moveTo(135,68);c.quadraticCurveTo(124,52,139,38);c.stroke();}
    if(i===3){c.beginPath();c.moveTo(128,75);c.lineTo(128,151);c.moveTo(101,151);c.lineTo(155,151);c.moveTo(94,49);c.lineTo(162,49);c.lineTo(182,97);c.lineTo(74,97);c.closePath();c.stroke();c.fillStyle='#ffe8a6';c.beginPath();c.arc(128,113,15,0,Math.PI);c.fill();}
    if(i===4){c.beginPath();c.arc(128,99,34,0,Math.PI*2);c.stroke();for(let a=0;a<Math.PI*2;a+=Math.PI/4){c.beginPath();c.moveTo(128+Math.cos(a)*48,99+Math.sin(a)*48);c.lineTo(128+Math.cos(a)*63,99+Math.sin(a)*63);c.stroke();}}
    if(i===6){for(const [x,y]of [[73,57],[183,57],[73,143],[183,143]]){c.beginPath();c.moveTo(128,100);c.lineTo(x,y);c.stroke();c.beginPath();c.arc(x,y,12,0,Math.PI*2);c.fill();}c.strokeRect(104,77,48,46);}
    if(i===7){c.beginPath();c.arc(128,110,46,0,Math.PI*2);c.stroke();for(const x of [110,146]){c.beginPath();c.arc(x,100,4,0,Math.PI*2);c.fill();}c.beginPath();c.arc(128,112,23,.1,Math.PI-.1);c.stroke();}
    if(i===8){c.strokeRect(66,62,124,93);c.beginPath();c.moveTo(66,105);c.lineTo(190,105);c.moveTo(128,62);c.lineTo(128,155);c.stroke();}
    c.fillStyle='#354b40';c.font='27px Microsoft JhengHei,sans-serif';c.fillText(label,22,h-32);
  }
  const memoryCards=[];
  rewardList.forEach((r,i)=>{const row=Math.floor(i/3),col=i%3,y=790+col*58,z=226-row*34;const map=canvasTexture((c,w,h)=>drawCard(c,w,h,i,r.card),256,256);const m=new T.Mesh(new T.PlaneGeometry(43,29),new T.MeshBasicMaterial({map}));m.position.copy(W(966.2,y,z));m.rotation.y=Math.PI/2;m.visible=false;memories.add(m);memoryCards.push({id:r.id,mesh:m});});
  const rewardPanel=el('section','community-rewards');rewardPanel.innerHTML='<div class="community-player-stats"></div><p>每個任務都會增加收藏貼圖，回到客廳看看生活記憶牆。</p><div class="community-reward-cards"></div>';
  const memoryActor={id:'memory-wall',name:'生活記憶牆',x:968,y:850,h:211,range:180,on:false,p:0,verbs:['查看生活記憶牆','查看生活記憶牆'],interact:()=>api?.openJournal(),apply:()=>{}};
  function sync(next){progress={visited:[...(next.visited||[])],actions:[...(next.actions||[])],completed:[...(next.completed||[])]};const s=stats();for(const c of memoryCards)c.mesh.visible=s.cards.includes(c.id);rewardPanel.querySelector('.community-player-stats').textContent=`Lv.${s.level} 鄰里生活家 · ${s.xp} 經驗 · ${s.coins} 生活點 · ${s.cards.length}/${rewardList.length} 收藏`;const cards=rewardPanel.querySelector('.community-reward-cards');cards.replaceChildren();for(const r of rewardList){const n=el('span',s.cards.includes(r.id)?'is-earned':'',s.cards.includes(r.id)?`✓ ${r.card}`:`○ ${r.card}`);cards.append(n);}if(board.open)renderBoard();}
  function showLobbyUI(){const values={'#title':'1F 社區大廳','#subtitle':'一樓接待・信箱・住戶電梯','#description':'這裡是一樓社區大廳。到看板接取委託，完成後回來領獎；住戶電梯通往五樓住宅。','.intro':'一樓・暖木社區大廳。從街道人行道進入社區，在接待區查看任務，搭電梯前往五樓住宅。','.status':'1F 社區大廳遊戲提案｜可步行、查看信箱及接取委託，電梯往返 5F 住宅。'};homeUI=[];for(const [selector,text]of Object.entries(values)){const n=document.querySelector(selector);if(n){homeUI.push([n,n.textContent]);n.textContent=text;}}}
  function restoreHomeUI(){for(const [n,text]of homeUI||[])n.textContent=text;homeUI=null;}
  function enterLobby(){if(!api||inLobby)return;homePosition=[walkX,walkY,walkYaw,lookPitch];document.querySelector('dialog[open]')?.close();if(document.pointerLockElement)document.exitPointerLock();if(canvas.hidden||compare||!walking)renderButton.click();api.setTour(true);inLobby=true;walkX=2450;walkY=1130;walkYaw=Math.PI;lookPitch=0;keys.clear();document.body.classList.add('community-active');showLobbyUI();lobbyButton.textContent='返回五樓住宅';document.querySelector('#viewname').textContent='1F / COMMUNITY LOBBY';renderer.shadowMap.needsUpdate=true;view.scrollIntoView({block:'center',behavior:'auto'});}
  function returnHome(room='entry',navigate=true){if(!inLobby)return;inLobby=false;board.close();keys.clear();document.body.classList.remove('community-active');restoreHomeUI();lobbyButton.textContent='前往社區大廳';if(homePosition){[walkX,walkY,walkYaw,lookPitch]=homePosition;if(!canStand(walkX,walkY))[walkX,walkY,walkYaw]=stops.entry;}renderer.shadowMap.needsUpdate=true;if(navigate)api.goRoom(room);}
  function activate(){if(nearby)nearby.use();}
  function tick(){hud.hidden=lobbyTools.hidden=!inLobby;if(!inLobby){prompt.hidden=true;return;}keys.forEach(k=>{if(board.open)keys.delete(k);});nearby=null;if(!board.open&&!document.querySelector('.explore-journal[open]')){const candidates=targets.map(a=>{const dx=a.x-walkX,dy=a.y-walkY,d=Math.hypot(dx,dy),p=W(a.x,a.y,a.h).project(camera);return {a,d,p,facing:(dx*Math.sin(walkYaw)+dy*Math.cos(walkYaw))/Math.max(1,d)};}).filter(v=>v.d<v.a.range&&v.facing>.4&&Math.abs(v.p.x)<.95&&Math.abs(v.p.y)<.95&&v.p.z<1).sort((a,b)=>a.d-b.d);nearby=candidates[0]?.a;}prompt.hidden=!nearby;if(nearby)prompt.textContent=`E · ${nearby.label}`;}
  addEventListener('keydown',e=>{if(!inLobby||e.key.toLowerCase()!=='e'||e.repeat||isEditing(e)||document.querySelector('dialog[open]'))return;e.preventDefault();e.stopImmediatePropagation();activate();},true);
  document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{if(inLobby)returnHome('entry',false);}));
  const renderBefore=renderer.render.bind(renderer);renderer.render=(world,cam)=>{B1_EXTERIOR.ensure();groundView.visible=Boolean(B1_EXTERIOR.groundMaterial.map);renderBefore(inLobby&&world===scene?lobby:world,cam);};
  window.B1_COMMUNITY={get inLobby(){return inLobby;},scene:lobby,canStand:canStandLobby,tick,enterLobby,returnHome,openBoard,accept,claim,sync,stats,actors:[memoryActor],rewardPanel,
    restore:s=>{accepted=new Set((Array.isArray(s?.accepted)?s.accepted:[]).filter(id=>quests.some(q=>q.id===id)));claimed=new Set((Array.isArray(s?.claimed)?s.claimed:[]).filter(id=>accepted.has(id)&&quests.some(q=>q.id===id)));},
    serialize:()=>({accepted:[...accepted],claimed:[...claimed]}),reset:()=>{accepted.clear();claimed.clear();returnHome('entry',false);},
    attachGame:a=>{api=a;sync(a.snapshot());const journal=document.querySelector('.explore-journal');journal.querySelector('.journal-lead').after(rewardPanel);journal.querySelector('.journal-rooms').before(btn('前往社區大廳',enterLobby));},
    snapshot:()=>({inLobby,floor:inLobby?1:5,lobbyFloor:1,homeFloor:5,...stats(),accepted:[...accepted],claimed:[...claimed],visibleCards:memoryCards.filter(c=>c.mesh.visible).map(c=>c.id),quests:quests.map(q=>({id:q.id,accepted:accepted.has(q.id),ready:ready(q),claimed:claimed.has(q.id)}))})};
  hud.hidden=lobbyTools.hidden=true;sync(progress);
})();
