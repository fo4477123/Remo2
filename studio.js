/* B1: shared centimetre coordinates for CAD, furniture and WebGL. */
const tourStyles=document.createElement('link');tourStyles.rel='stylesheet';tourStyles.href='studio-tour.css';document.head.append(tourStyles);
const detailScript=document.createElement('script');detailScript.src='studio-detail.js';detailScript.defer=true;document.head.append(detailScript);
const T=THREE,canvas=document.querySelector('#scene'),view=document.querySelector('#viewport');
const renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
const scene=new T.Scene();scene.background=new T.Color('#dedfd5');const camera=new T.PerspectiveCamera(42,1,1,8000);
const hemi=new T.HemisphereLight(0xfff9eb,0x858b76,2.3);scene.add(hemi);const sun=new T.DirectionalLight(0xfff2da,3);sun.position.set(-300,1300,-600);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-1300,right:1300,top:1300,bottom:-1300,far:4000});sun.shadow.bias=-0.0002;scene.add(sun);
function mat(color,roughness=.8,extra={}){return new T.MeshStandardMaterial({color,roughness,...extra})}
const oak=mat('#b9a084'),cream=mat('#eee9df'),linen=mat('#d0c9b9'),sage=mat('#87937d'),dark=mat('#454d43'),glass=mat('#a6b8af',.12,{transparent:true,opacity:.28,metalness:.1}),black=mat('#20282a',.2),white=mat('#e5e4dd');
const fabric=document.createElement('canvas');fabric.width=fabric.height=128;const fc=fabric.getContext('2d');fc.fillStyle='#d3cebf';fc.fillRect(0,0,128,128);for(let i=0;i<128;i+=2){fc.strokeStyle=i%4?'#c7c1b3':'#ded7ca';fc.beginPath();fc.moveTo(i,0);fc.lineTo(i,128);fc.moveTo(0,i);fc.lineTo(128,i);fc.stroke()}const tex=new T.CanvasTexture(fabric);tex.wrapS=tex.wrapT=T.RepeatWrapping;tex.repeat.set(4,4);linen.map=tex;
const furniture=[],floorGroup=new T.Group(),wallGroup=new T.Group(),ceilingGroup=new T.Group();scene.add(floorGroup,wallGroup,ceilingGroup);
const W=(x,y,h=0)=>new T.Vector3(x-750,h,700-y);
function box(x,y,w,d,h,material,z=0,parent=scene){const m=new T.Mesh(new T.BoxGeometry(w,h,d),material);m.position.copy(W(x+w/2,y+d/2,z+h/2));m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function cyl(x,y,r,h,material,z=0){const m=new T.Mesh(new T.CylinderGeometry(r,r,h,48),material);m.position.copy(W(x,y,z+h/2));m.castShadow=true;m.receiveShadow=true;scene.add(m);return m}
function item(name,x,y,w,d,fn){
  // Apply the same placement correction to the model and plan footprint.
  const shift=name==='220 cm 木框沙發'?[0,65]:name==='升降工作桌'?[135,0]:name==='影音展示收納'?[-161,0]:[0,0];
  const start=scene.children.length;fn();
  for(const mesh of scene.children.slice(start)){mesh.position.x+=shift[0];mesh.position.z-=shift[1];}
  furniture.push({name,x:x+shift[0],y:y+shift[1],w,d});
}
const rooms=[[399,740,320,320],[729,765,220,295],[959,520,300,475],[399,300,360,255],[769,300,275,210],[399,565,560,175],[239,565,160,165],[239,300,145,250],[239,740,150,250]];
for(const [x,y,w,d]of rooms){box(x,y,w,d,4,cream,-4,floorGroup);for(let j=0;j<d;j+=18){const shade=mat(j%36?'#ceb48c':'#d8bd96');box(x,y+j,w,17.6,.6,shade,.1,floorGroup)}box(x,y,w,d,8,cream,260,ceilingGroup)}ceilingGroup.visible=false;
const seen=new Set();for(const p of B1_PLAN.walls){for(let i=1;i<p.points.length;i++){const a=p.points[i-1],b=p.points[i],dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy);if(length<20)continue;const key=[...a,...b].map(Math.round).join();if(seen.has(key))continue;seen.add(key);const m=new T.Mesh(new T.BoxGeometry(length,260,3),cream);m.position.copy(W((a[0]+b[0])/2,(a[1]+b[1])/2,130));m.rotation.y=Math.atan2(dy,dx);m.castShadow=m.receiveShadow=true;wallGroup.add(m)}}
// Windows: thin frames and a soft curtain rhythm at existing north openings.
for(const [x,w,y]of [[454,180,1067],[764,120,1067],[999,180,1002]]){box(x,y,w,2,140,glass,80);for(let a=0;a<w;a+=16){box(x+a,y+3,3,3,150,linen,70)}box(x,y,w,7,4,oak,76)}
item('220 cm 木框沙發',970,700,92,220,()=>{box(970,700,92,220,10,oak,17);box(972,705,15,210,55,oak,27);box(985,705,72,103,18,linen,28);box(985,812,72,103,18,linen,28);box(986,705,14,102,35,linen,44);box(986,813,14,102,35,linen,44);for(const yy of [700,910])box(970,yy,90,9,34,oak,27);box(998,718,25,38,12,sage,46);for(const yy of [710,900])for(const xx of [980,1040])box(xx,yy,4,4,20,oak)});
item('羊毛地毯',1020,680,210,250,()=>box(1020,680,210,250,1.5,mat('#ded8c7'),1));
item('島語升降茶几／收納茶几',1066,768,82,125,()=>{
  // Isle Whisper reference: warm rounded island table with lift top and two stools.
  box(1069,771,76,119,8,oak,38);box(1074,776,66,109,18,mat('#b99970',.52),46);
  box(1077,779,60,103,5,mat('#d8c4a8',.45),64);box(1081,783,52,95,3,oak,69);
  for(const [x,y]of [[1088,800],[1128,850]]){cyl(x,y,16,5,linen,8);cyl(x,y,6,8,oak,13)}
  box(1078,829,58,12,3,mat('#e0d3bc',.6),72);box(1080,831,54,8,2,oak,75);
});
item('延伸電視牆／單扇玻璃門',1220,505,38,490,()=>{
  // One continuous timber plane and floating base run to the planter; no tall cabinet at the end.
  box(1255,505,3,490,235,oak,25);box(1220,505,38,490,32,oak,25);box(1220,505,38,490,5,oak,255);
  // TV panel spans y732..995; center screen on y863.5, excluding tall storage.
  box(1250,791,4,145,82,black,85);
  for(let z=65;z<245;z+=48){box(1220,675,38,55,2,oak,z);cyl(1237,700,7,17,cream,z+2)}
  box(1220,677,2,51,188,glass,64);box(1218,682,2,2,22,dark,130);
  // Small display ledges above the screen for figures, matching the reference wall.
  const led=mat('#ffe3ad',.36,{emissive:0xffc978,emissiveIntensity:1.15});
  for(const [yy,w,z]of [[783.5,50,188],[838.5,50,200],[893.5,50,188]]){box(1235,yy,20,w,3,oak,z);box(1238,yy+1,2,w-2,1,led,z-.5)}
  for(const yy of [505,561,617])box(1220,yy+2,2,52,193,oak,60);
  // No top cabinets above the TV: this central portion is a clean timber backing.
  for(const yy of [505,561,617,675,730,790,850,895,950])box(1219,yy+2,2,Math.min(54,993-yy),28,oak,27);
  for(const yy of [505,561,617,675,730])box(1220,yy,38,2,235,oak,25);
  // Slippers remain below the suspended cabinet, nearest the entrance.
  for(const yy of [540,553,580,593]){box(1224,yy,25,10,3,sage,1);box(1234,yy,8,10,5,linen,4)}
});
item('收納折疊餐桌 90×40',820,685,90,40,()=>{
  box(820,685,90,40,4,oak,73);box(820,685,90,35,70,cream,3);
  for(const xx of [822,867]){box(xx,684,42,2,64,oak,5);box(xx+33,682,3,2,12,dark,47)}
  box(820,680,90,3,32,oak,39);
});
item('60 cm 收納臥榻',739,1000,200,60,()=>{box(739,1000,200,60,37,oak);box(739,1000,200,60,7,linen,37);for(let x=740;x<930;x+=65){box(x,999,62,1,31,cream,3)}box(755,1020,45,30,10,sage,44)});
item('升降工作桌',739,835,65,135,()=>{box(739,835,65,135,4,oak,73);for(const yy of [848,950]){box(750,yy,45,6,4,dark);box(770,yy,5,5,72,dark)}box(795,875,3,55,33,black,77);box(765,882,24,45,1,dark,78);box(690,870,43,43,8,sage,43);cyl(711,892,6,43,dark)});
item('影音輕量低櫃 110 cm',739,865,30,110,()=>{box(739,865,30,110,60,oak,8);for(const y of [867,921])box(768,y,2,51,54,cream,11);box(739,880,24,80,3,oak,122);cyl(751,895,6,15,cream,125);cyl(753,955,7,15,sage,68)});
// Cabinet follows the bathroom north wall; door opening x829..909 stays clear.
const cleaningDoors=[];
item('面向浴室右手側／掃地機器人',769,520,60,35,()=>{
  box(769,520,2,35,260,oak);box(827,520,2,35,260,oak);box(769,520,60,2,260,oak);box(769,520,60,35,3,oak,257);
  box(771,522,56,32,3,oak,51);box(771,554,56,2,202,oak,55);
  box(780,524,38,15,37,cream,1);cyl(799,545,16,9,white,1);
});
item('面向浴室左手側／掃具高櫃',910,520,64,35,()=>{
  box(910,520,2,35,260,oak);box(972,520,2,35,260,oak);box(910,520,64,2,260,oak);box(910,520,64,35,3,oak,257);
  cleaningDoors.push(box(912,554,60,2,174,oak,3));
  for(const z of [178,214,254])box(912,522,60,32,2,oak,z);
  box(926,535,3,3,150,dark,8);box(918,532,20,12,5,sage,5);box(953,535,3,3,130,oak,8);
  for(const x of [924,941,956])cyl(x,538,4,13,cream,180);
});
const hiddenDoorHinge=new T.Group();hiddenDoorHinge.position.copy(W(829,555));scene.add(hiddenDoorHinge);
item('隱藏門 80 cm／齊平內開',829,553,80,3,()=>{const leaf=box(829,553,80,3,230,cream);hiddenDoorHinge.attach(leaf);box(829,553,80,3,30,oak,230)});
item('連續工作平台／延伸至大門',974,520,130,35,()=>{
  box(974,520,130,35,88,oak,3);
  for(const x of [976,1040])box(x,554,62,2,84,cream,5);
  box(974,520,130,36,3,cream,91);
  box(974,520,130,2,166,oak,94);
  box(974,520,130,30,90,oak,170);
  for(const x of [976,1040])box(x,549,62,2,84,oak,173);
  box(1060,530,25,16,2,dark,94);
});
item('LG 洗脫烘預留／對面旋轉180度',310,320,75,65,()=>{box(310,320,75,65,85,white);const drum=new T.Mesh(new T.CylinderGeometry(23,23,3,48),black);drum.rotation.x=Math.PI/2;drum.position.copy(W(347.5,387,43));scene.add(drum);box(310,320,75,65,4,oak,90)});
item('主臥雙人床／轉向90度',425,890,188,150,()=>{box(425,890,188,150,25,oak);box(425,890,188,150,20,linen,25);box(417,890,8,150,85,oak);for(const yy of [900,970])box(438,yy,35,60,12,cream,45);box(538,890,75,150,3,sage,45)});
item('主臥整牆頂天滑門衣櫥',664,765,55,295,()=>{box(664,765,55,295,260,oak);for(let y=767;y<1058;y+=73){box(662,y,2,71,254,oak,3);box(660,y+61,2,2,35,dark,100)}});
item('次臥客床 150×188',415,320,150,188,()=>{box(415,320,150,188,25,oak);box(415,320,150,188,20,linen,25);box(415,508,150,8,75,oak);box(430,465,110,35,12,cream,45)});
item('原圖橫向廚具 235×60',239,670,235,60,()=>{box(239,670,235,60,85,oak);box(239,670,235,60,4,cream,85);box(255,682,52,36,2,mat('#9ea7a4',.2,{metalness:.6}),89);box(391,680,60,43,2,black,89);for(const x of [404,435])cyl(x,701,9,1,dark,91);for(let x=241;x<470;x+=47)box(x,669,44,2,78,cream,5)});
// Panasonic NR-D505XGS: W72.1 × D69.5 × H183.4 cm.  Kept beside the existing counter run.
item('Panasonic NR-D505XGS 冰箱',474,670,72.1,69.5,()=>{
  box(474,670,72.1,69.5,183.4,white,2);box(475,668,70.1,2,90,mat('#d8ddd9',.18,{metalness:.18}),4);box(475,668,70.1,2,89,mat('#eef0ea',.18,{metalness:.18}),95);
  box(510,666.5,2,2,179,oak,4);box(475,668,70.1,1,3,oak,92);box(475,668,70.1,1,3,oak,140);box(475,668,70.1,1,3,oak,175);
});
item('頂天電器櫃 80 cm',546.1,670,80,70,()=>{
  box(546.1,670,80,70,260,oak);box(548.1,738,76,2,256,cream,3);
  // Two ventilated appliance bays plus enclosed pantry storage.
  box(550,669,72,2,2,oak,92);box(550,669,72,2,2,oak,150);box(550,669,72,2,2,oak,205);
  box(552,670,68,20,38,black,100);box(554,669,64,2,30,mat('#313735',.25,{metalness:.25}),104);
  box(552,670,68,20,36,black,158);box(554,669,64,2,28,mat('#313735',.25,{metalness:.25}),162);
  box(548.1,738,36,2,52,cream,208);box(588.1,738,36,2,52,cream,208);
});
const nightLights=[];for(const [x,y]of [[1100,800],[840,900],[860,640],[1070,580]]){const l=new T.PointLight(0xffc17d,0,440,2);l.position.copy(W(x,y,220));scene.add(l);nightLights.push(l);cyl(x,y,6,2,mat('#fff3cd',.2,{emissive:0xffdba3,emissiveIntensity:.5}),255)}
const configs={all:{target:[750,690],radius:1650,yaw:.6,pitch:.8,title:'全室配置',sub:'依 DWG 房間位置配置',text:'客廳在右側、最小臥室位於上方中央；將其規劃為影音工作室。淨高暫定 260 cm，牆體顯示為可切換剖面。'},living:{target:[1110,790],radius:560,yaw:1.2,pitch:.46,title:'木框沙發 × 玻璃收藏牆',sub:'客廳 / 暖木與留白',text:'220 cm 沙發沿影音室外牆擺放，朝向右側電視。展示櫃集中於電視兩端，以封閉底櫃收整日常雜物；淺色地毯統一客廳範圍。'},media:{target:[840,900],radius:490,yaw:.8,pitch:.65,title:'一間房，三種日常',sub:'影音 / 工作 / 收藏',text:'最小房暫採上方中央約 220 × 300 cm 臥室。60 cm 深臥榻沿窗、升降桌靠左牆、展示收納靠右牆。影音設備與座位視線待選型調整。'},entry:{target:[1080,570],radius:500,yaw:1,pitch:.6,title:'以同一片立面迎接回家',sub:'玄關 / 隱藏門概念',text:'玄關以淺橡木與奶油白櫃門串連入口。廁所隱藏門須依原門洞位置及開門方向確認；目前展示櫃體語彙與預留範圍。'},laundry:{target:[310,420],radius:500,yaw:-1,pitch:.7,title:'清爽的洗衣陽台',sub:'洗脫烘 / 耐潮工作檯',text:'LG 15 kg 機器先預留 65 × 75 cm 示意體積，並非已核對型號尺寸。陽台安排獨立洗衣檯面，後續依實際型號確認管線與維修空間。'}};
configs.living.yaw=-1.12;configs.living.radius=700;
configs.living.text='由大門一路延伸至花台端：490 cm連續木背板與懸浮下櫃形成完整電視牆。花台端不做高牆櫃，維持立面留白；僅保留一扇55 cm展示玻璃門。電視上方不做頂櫃，底下淨高25 cm可放拖鞋。';
configs.media.text='右牆升降桌保留；左側展示改為 110 cm 長、30 cm 深的低櫃，僅搭配一片短層板。低櫃離開原門弧，窗邊 60 cm 臥榻維持不變。';
configs.entry.target=[935,560];configs.entry.yaw=.15;configs.entry.pitch=.4;configs.entry.text='隱藏門兩側改為完整櫃體：左側下段收納掃具，上段朝走道開放可放浴室物品；右側下方預留掃地機器人高度，上方為置物與封閉收納。櫃體正面與隱藏門切平，門往廁所內開。';
configs.master={target:[555,900],radius:590,yaw:.5,pitch:.8,title:'床尾整牆衣櫥，頂天收納',sub:'主臥 / 約295 × 55 × 260 cm',text:'維持床頭朝左、150 × 188 cm雙人床。床尾右側牆做滿木質滑門衣櫥，延伸至天花板，入口門洞保留；原入口側櫃體移除。床尾至門面約49 cm，偏窄，須現場確認與調整後才能施工；260 cm高度為模型暫定值。'};
configs.guest={target:[580,430],radius:570,yaw:.7,pitch:.85,title:'清空次臥櫃體，保留彈性',sub:'次臥 / 只保留客床與完整動線',text:'移除原本的衣櫃、書桌與零散櫃體，留下150×188 cm客床及完整門口動線。後續可依實際需求再放入活動式家具，不先以固定櫃體壓縮空間。'};
configs.laundry.text='LG 15 kg洗脫烘已移到原位置對面並旋轉180度，門面朝室內；仍須確認給排水、插座、散熱與維修空間。';
configs.kitchen={target:[470,690],radius:620,yaw:-.7,pitch:.7,title:'橫向廚具＋冰箱與頂天電器櫃',sub:'NR-D505XGS / 72.1 × 69.5 × 183.4 cm',text:'保留原圖I-KITCHEN的235 × 60 cm橫向檯面；右端接Panasonic NR-D505XGS冰箱，再接80 cm寬、70 cm深頂天電器櫃，設微波／蒸烤設備凹槽與上方封閉收納。冰箱散熱、插座、門片全開與通道尺寸仍須以現場及原廠安裝圖複核。'};
for(const [name,label]of [['master','06　主臥'],['guest','07　次臥'],['kitchen','08　廚房']]){const b=document.createElement('button');b.dataset.room=name;b.textContent=label;document.querySelector('.rooms').append(b)}
let selected='all',yaw=.6,pitch=.8,radius=1650,target=W(750,690,30);function select(name){selected=name;const c=configs[name];yaw=c.yaw;pitch=c.pitch;radius=c.radius;target=W(...c.target,35);document.querySelector('#title').textContent=c.title;document.querySelector('#description').textContent=c.text;document.querySelector('#subtitle').textContent=c.sub;document.querySelector('#viewname').textContent=c.title;document.querySelectorAll('[data-room]').forEach(b=>b.classList.toggle('active',b.dataset.room===name))}document.querySelectorAll('[data-room]').forEach(b=>b.onclick=()=>select(b.dataset.room));document.querySelector('#reset').onclick=()=>select(selected);
let walking=false,compare=false,walkX=1150,walkY=600,walkYaw=0,lookPitch=0,drag=null;
canvas.onpointerdown=e=>{drag=[e.clientX,e.clientY];canvas.setPointerCapture(e.pointerId)};canvas.onpointermove=e=>{if(!drag)return;const dx=e.clientX-drag[0],dy=e.clientY-drag[1];if(walking){walkYaw+=dx*.006;lookPitch=Math.max(-1,Math.min(1,lookPitch-dy*.005))}else{yaw-=dx*.008;pitch=Math.max(.12,Math.min(1.5,pitch+dy*.006))}drag=[e.clientX,e.clientY]};canvas.onpointerup=canvas.onpointercancel=()=>drag=null;canvas.onwheel=e=>{e.preventDefault();if(!walking)radius=Math.max(200,Math.min(2800,radius*Math.exp(e.deltaY*.001))) };
document.querySelector('#walls').onchange=e=>{for(const m of wallGroup.children){m.scale.y=e.target.checked?.35:1;m.position.y=e.target.checked?45.5:130}};document.querySelector('#walls').dispatchEvent(new Event('change'));document.querySelector('#ceiling').onchange=e=>ceilingGroup.visible=e.target.checked;document.querySelector('#night').onchange=e=>{const n=e.target.checked;hemi.intensity=n?.5:2.3;sun.intensity=n?.15:3;scene.background.set(n?'#303b38':'#dedfd5');nightLights.forEach(l=>l.intensity=n?15000:0)};
const svg=document.querySelector('#plan'),NS='http://www.w3.org/2000/svg';function el(n,a,text){const e=document.createElementNS(NS,n);for(const[k,v]of Object.entries(a))e.setAttribute(k,v);if(text)e.textContent=text;svg.append(e);return e}for(const [x,y,w,d]of rooms)el('rect',{x,y:1100-y-d,width:w,height:d,fill:'#e5d3b3',stroke:'#c1b49b','stroke-width':1});for(const p of B1_PLAN.paths)el('polyline',{points:p.points.map(([x,y])=>`${x},${1100-y}`).join(' '),fill:'none',stroke:/WALL|A-RC|wall-i/.test(p.layer)?'#475247':'#a1a897','stroke-width':/WALL/.test(p.layer)?2:1});for(const f of furniture){el('rect',{x:f.x,y:1100-f.y-f.d,width:f.w,height:f.d,rx:5,fill:f.name.includes('地毯')?'#ded8c7':'#b5c0a4','fill-opacity':.75,stroke:'#6f8063','stroke-width':1});el('text',{x:f.x+f.w/2,y:1100-f.y-f.d/2,'text-anchor':'middle','font-size':12,fill:'#314334'},f.name)}
const compareButton=document.createElement('button');compareButton.dataset.mode='compare';compareButton.textContent='3D＋平面對照';document.querySelector('header nav').append(compareButton);
const renderButton=document.createElement('button');renderButton.dataset.mode='render';renderButton.textContent='寫實3D漫遊';document.querySelector('header nav').append(renderButton);
const renderPanel=document.createElement('div');renderPanel.id='render-panel';renderPanel.hidden=true;renderPanel.style.cssText='position:absolute;inset:0;background:#e8e0d3;display:none;flex-direction:column;align-items:stretch;justify-content:center;pointer-events:auto';const renderImage=document.createElement('img');renderImage.src='living-room-photoreal-render.png';renderImage.alt='客廳寫實渲染';renderImage.style.cssText='width:100%;height:calc(100% - 48px);object-fit:cover';renderPanel.append(renderImage);const renderNav=document.createElement('div');renderNav.style.cssText='height:48px;display:flex;gap:6px;align-items:center;justify-content:center;background:#f5f0e7';const renderScenes=[['客廳','living-room-photoreal-render.png'],['玄關／浴室櫃','render-entry.png'],['廚房','render-kitchen.png'],['主臥','render-master.png'],['影音室','render-media.png'],['次臥','render-guest.png'],['陽台','render-laundry.png']];for(const [label,src]of renderScenes){const rb=document.createElement('button');rb.textContent=label;rb.style.cssText='padding:6px 10px;font-size:11px;background:#e5e7dc';rb.onclick=()=>{renderImage.src=src;renderImage.alt=label+'寫實渲染'};renderNav.append(rb)}renderPanel.append(renderNav);view.append(renderPanel);
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{const mode=b.dataset.mode;const plan=mode==='plan';compare=mode==='compare';const render=mode==='render';canvas.hidden=plan;svg.toggleAttribute('hidden',!(plan||compare));renderPanel.hidden=true;renderPanel.style.display='none';view.classList.toggle('compare',compare);document.querySelectorAll('[data-mode]').forEach(x=>x.classList.toggle('active',x===b));if(render){select('living');setTour(true)}else if(!plan&&walking){setTour(false)}});
const leaf=box(820,650,90,35,4,oak,73);leaf.visible=false;
const leafLeg=box(825,654,3,3,73,oak);leafLeg.visible=false;
const leafPlan=el('rect',{x:820,y:415,width:90,height:35,fill:'#d3b98d',stroke:'#6f8063',visibility:'hidden'});
const foldButton=document.createElement('button');foldButton.textContent='展開小餐桌';foldButton.onclick=()=>{leaf.visible=!leaf.visible;leafLeg.visible=leaf.visible;leafPlan.setAttribute('visibility',leaf.visible?'visible':'hidden');foldButton.textContent=leaf.visible?'收起小餐桌':'展開小餐桌'};document.querySelector('.toolbar').append(foldButton);
el('path',{d:'M 1150 570 L 1150 500 L 790 500',fill:'none',stroke:'#5c967c','stroke-width':90,'stroke-opacity':.09});
el('path',{d:'M 1150 570 L 1150 500 L 790 500',fill:'none',stroke:'#5c967c','stroke-width':2,'stroke-dasharray':'8 6'});
el('text',{x:970,y:493,'text-anchor':'middle','font-size':13,fill:'#3e7059'},'入口 ↔ 餐區通道');
const cleaningButton=document.createElement('button');cleaningButton.textContent='查看清潔櫃內部';cleaningButton.onclick=()=>{const visible=!cleaningDoors[0].visible;cleaningDoors.forEach(m=>m.visible=visible);cleaningButton.textContent=visible?'查看清潔櫃內部':'關閉清潔櫃';select('entry')};document.querySelector('.toolbar').append(cleaningButton);
for(const [x,y,w,d]of [[626,478,90,87],[732,763,84,80]])el('rect',{x,y:1100-y-d,width:w,height:d,fill:'none',stroke:'#b88b67','stroke-width':2,'stroke-dasharray':'5 5'});
window.B1_REVIEW={furniture,clearances:{masterBedToWardrobe:49,mediaDeskToCabinet:105,diningFolded:130,diningExpanded:95,slipperHeight:25,planterEndClear:85},select};
const visitor=el('g',{});visitor.innerHTML='<path d="M 0 0 L -24 -42 L 24 -42 Z" fill="#b87e44" opacity=".3"/><circle r="10" fill="#b87e44" stroke="white" stroke-width="3"/><path d="M 0 0 L 0 -26" stroke="#714b26" stroke-width="3"/>';
const doorSwing=el('path',{d:'M 909 545 A 80 80 0 0 1 829 625 L 829 545',fill:'none',stroke:'#b87e44','stroke-width':3,'stroke-dasharray':'5 4',visibility:'hidden'});
const doorButton=document.createElement('button');doorButton.textContent='開啟隱藏門';let doorOpen=false;doorButton.onclick=()=>{doorOpen=!doorOpen;hiddenDoorHinge.rotation.y=doorOpen?-Math.PI/2:0;doorSwing.setAttribute('visibility',doorOpen?'visible':'hidden');doorButton.textContent=doorOpen?'關閉隱藏門':'開啟隱藏門'};document.querySelector('.toolbar').append(doorButton);
const tourButton=document.createElement('button');tourButton.textContent='進入室內漫遊';document.querySelector('.toolbar').append(tourButton);
const help=document.createElement('div');help.className='tour-help';help.hidden=true;help.textContent='拖曳轉頭 · WASD／方向鍵移動 · 點平面地板換位置 · Esc 返回鳥瞰';view.append(help);
const motionPad=document.createElement('div');motionPad.className='motion-pad';motionPad.hidden=true;view.append(motionPad);
const keys=new Set();for(const [label,key]of [['↑','w'],['←','a'],['↓','s'],['→','d']]){const b=document.createElement('button');b.textContent=label;b.onpointerdown=e=>{keys.add(key);b.setPointerCapture(e.pointerId)};b.onpointerup=b.onpointercancel=()=>keys.delete(key);motionPad.append(b)}
const stops={all:[1150,600,0],living:[1135,710,Math.PI/2],media:[825,860,0],entry:[960,610,Math.PI],laundry:[340,450,Math.PI],master:[645,850,-Math.PI/2],guest:[590,460,-Math.PI/2],kitchen:[355,610,0]};
function setTour(enabled){walking=enabled;keys.clear();tourButton.textContent=enabled?'退出室內漫遊':'進入室內漫遊';help.hidden=motionPad.hidden=!enabled;if(enabled){[walkX,walkY,walkYaw]=stops[selected]||stops.all;lookPitch=0;document.querySelector('#walls').checked=false;document.querySelector('#walls').dispatchEvent(new Event('change'));ceilingGroup.visible=true;document.querySelector('#ceiling').checked=true;}else{ceilingGroup.visible=false;document.querySelector('#ceiling').checked=false;document.querySelector('#walls').checked=true;document.querySelector('#walls').dispatchEvent(new Event('change'));}document.querySelector('.view-label span').textContent=enabled?'眼高 160 cm · 即時 3D 模擬':'拖曳旋轉 · 滾輪縮放'}
tourButton.onclick=()=>setTour(!walking);
document.querySelectorAll('[data-room]').forEach(b=>b.addEventListener('click',()=>{if(walking){[walkX,walkY,walkYaw]=stops[b.dataset.room];lookPitch=0;}}));
addEventListener('keydown',e=>{if(e.key==='Escape')setTour(false);const k=e.key.toLowerCase();if(walking&&['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(k)){e.preventDefault();keys.add(k)}});addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));addEventListener('blur',()=>keys.clear());
const doorZones=[{x:829,y:510,w:80,d:20},{x:1104,y:505,w:110,d:20}];
function distanceToSegment(x,y,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],l=dx*dx+dy*dy,t=l?Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/l)):0;return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy)}
function canStand(x,y){if(!rooms.some(([rx,ry,w,d])=>x>=rx&&x<=rx+w&&y>=ry&&y<=ry+d))return false;for(const f of furniture){if(/地毯|隱藏門/.test(f.name))continue;if(x>f.x-12&&x<f.x+f.w+12&&y>f.y-12&&y<f.y+f.d+12)return false}for(const p of B1_PLAN.walls)for(let i=1;i<p.points.length;i++)if(distanceToSegment(x,y,p.points[i-1],p.points[i])<12)return false;return true}
svg.style.cursor='crosshair';svg.addEventListener('click',e=>{const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;const q=p.matrixTransform(svg.getScreenCTM().inverse()),y=1100-q.y;if(canStand(q.x,y)){if(!walking)setTour(true);walkX=q.x;walkY=y}});
window.B1_REVIEW.canStand=canStand;window.B1_REVIEW.setTour=setTour;
let lastTime=performance.now();function frame(now=performance.now()){const dt=Math.min((now-lastTime)/1000,.05);lastTime=now;const w=compare?view.clientWidth/2:view.clientWidth,h=view.clientHeight;if(canvas.width!==Math.round(w*renderer.getPixelRatio())||canvas.height!==Math.round(h*renderer.getPixelRatio())){renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}if(walking){let forward=(keys.has('w')||keys.has('arrowup')?1:0)-(keys.has('s')||keys.has('arrowdown')?1:0),side=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0);const speed=95*dt/Math.max(1,Math.hypot(forward,side)),dx=(Math.sin(walkYaw)*forward+Math.cos(walkYaw)*side)*speed,dy=(Math.cos(walkYaw)*forward-Math.sin(walkYaw)*side)*speed;if(canStand(walkX+dx,walkY))walkX+=dx;if(canStand(walkX,walkY+dy))walkY+=dy;camera.position.copy(W(walkX,walkY,160));camera.lookAt(W(walkX+Math.sin(walkYaw)*100,walkY+Math.cos(walkYaw)*100,160+Math.tan(lookPitch)*100));}else{camera.position.set(target.x+radius*Math.cos(pitch)*Math.sin(yaw),target.y+radius*Math.sin(pitch),target.z+radius*Math.cos(pitch)*Math.cos(yaw));camera.lookAt(target)}visitor.setAttribute('transform',`translate(${walkX} ${1100-walkY}) rotate(${walkYaw*180/Math.PI})`);visitor.style.display=walking?'':'none';renderer.render(scene,camera);requestAnimationFrame(frame)}select(configs[location.hash.slice(1)]?location.hash.slice(1):'all');if(new URLSearchParams(location.search).has('tour'))setTour(true);if(new URLSearchParams(location.search).has('compare'))compareButton.click();frame();
