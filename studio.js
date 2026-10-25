/* B1: shared centimetre coordinates for CAD, furniture and WebGL. */
const tourStyles=document.createElement('link');tourStyles.rel='stylesheet';tourStyles.href='studio-tour.css';document.head.append(tourStyles);
const loading=document.createElement('p');loading.textContent='正在整理光線與材質，準備走進家裡…';loading.style.cssText='position:absolute;left:20px;top:45%;padding:14px;background:#faf6e8;border-radius:8px;z-index:20';document.querySelector('#viewport').append(loading);
// Appended after the base scene below: dynamic scripts otherwise can race a
// fast local response before `configs` / `B1_REVIEW` are initialized.
const detailScript=document.createElement('script');detailScript.src='studio-detail.js?v=20261025-gpu1';detailScript.async=false;
function loadFailure(name){if(window.B1_REVIEW)B1_REVIEW.ready=true;loading.replaceChildren(document.createTextNode(`${name}載入未完成。`));const retry=document.createElement('button');retry.textContent='重新載入';retry.onclick=()=>location.reload();loading.append(retry);}
detailScript.onerror=()=>loadFailure('空間細節');
setTimeout(()=>{if(!window.B1_REVIEW?.ready)loadFailure('空間資源');},120000);
const ROOM_HEIGHT=280;
const T=THREE,canvas=document.querySelector('#scene'),view=document.querySelector('#viewport');
const renderer=B1_ENGINE.renderer;renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
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
  const shift=name==='主臥飯店級軟包雙人床／轉向90度'?[-17,0]:[0,0];
  const start=scene.children.length;fn();
  for(const mesh of scene.children.slice(start)){mesh.position.x+=shift[0];mesh.position.z-=shift[1];mesh.userData.furnitureName=name;}
  furniture.push({name,x:x+shift[0],y:y+shift[1],w,d});
}
function softBox(x,y,w,d,h,material,z=0,parent=scene,curve=.42){
  const g=new T.SphereGeometry(1,28,20),p=g.attributes.position;
  for(let i=0;i<p.count;i++){const px=p.getX(i),py=p.getY(i),pz=p.getZ(i);p.setXYZ(i,Math.sign(px)*Math.pow(Math.abs(px),curve)*w/2,Math.sign(py)*Math.pow(Math.abs(py),curve)*h/2,Math.sign(pz)*Math.pow(Math.abs(pz),curve)*d/2);}
  g.computeVertexNormals();const m=new T.Mesh(g,material);m.position.copy(W(x+w/2,y+d/2,z+h/2));m.castShadow=m.receiveShadow=true;parent.add(m);return m;
}
const rooms=[[399,740,320,320],[729,765,220,295],[959,520,300,475],[399,300,360,255],[769,300,275,210],[399,565,560,175],[239,565,160,165],[239,300,145,250],[239,740,150,250]];
for(const [x,y,w,d]of rooms){box(x,y,w,d,4,cream,-4,floorGroup);for(let j=0;j<d;j+=18){const shade=mat(j%36?'#ceb48c':'#d8bd96');box(x,y+j,w,17.6,.6,shade,.1,floorGroup)}box(x,y,w,d,8,cream,ROOM_HEIGHT,ceilingGroup)}ceilingGroup.visible=false;
// Rebuild CAD walls with real window voids instead of leaving the exterior as a
// blank plane.  The opening locations follow the DWG room edges: ordinary
// windows in the bedrooms/kitchen and low-sill windows in living/media rooms.
const windowSpecs=[
  {axis:'v',line:391.1,from:309.7,to:429.7,sill:150,head:235,name:'次臥高窗'},
  {axis:'v',line:231.1,from:574.7,to:654.7,sill:150,head:235,name:'廚房高窗'},
  {axis:'v',line:231.1,from:790,to:870,sill:150,head:235,name:'主臥衛浴高窗'},
  {axis:'h',line:1067.2,from:453.6,to:633.6,sill:50,head:232,name:'主臥低檯窗'},
  {axis:'h',line:1067.2,from:763.6,to:883.6,sill:50,head:232,name:'多功能室低檯窗'},
  {axis:'h',line:1002.2,from:998.6,to:1178.6,sill:50,head:232,name:'客廳低檯窗'}
];
function addWallPiece(a,b,z0,h){const dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy);if(length<1||h<1)return;const m=new T.Mesh(new T.BoxGeometry(length,h,3),cream);m.position.copy(W((a[0]+b[0])/2,(a[1]+b[1])/2,z0+h/2));m.rotation.y=Math.atan2(dy,dx);m.castShadow=m.receiveShadow=true;wallGroup.add(m)}
function addWallWithWindows(a,b){const dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy);if(length<20)return;const horizontal=Math.abs(dy)<2,vertical=Math.abs(dx)<2;if(!horizontal&&!vertical){addWallPiece(a,b,0,ROOM_HEIGHT);return;}
  const lo=horizontal?Math.min(a[0],b[0]):Math.min(a[1],b[1]),hi=horizontal?Math.max(a[0],b[0]):Math.max(a[1],b[1]);
  const openings=windowSpecs.filter(w=>(horizontal?w.axis==='h':w.axis==='v')&&Math.abs((horizontal?((a[1]+b[1])/2):((a[0]+b[0])/2))-w.line)<10).map(w=>({...w,from:Math.max(lo,w.from),to:Math.min(hi,w.to)})).filter(w=>w.to-w.from>8);
  if(!openings.length){addWallPiece(a,b,0,ROOM_HEIGHT);return;}
  const dir=horizontal?Math.sign(dx):Math.sign(dy),ordered=openings.sort((u,v)=>u.from-v.from);let cursor=lo;
  const pointAt=t=>horizontal?[t,(a[1]+b[1])/2]:[(a[0]+b[0])/2,t];
  for(const w of ordered){if(w.from>cursor)addWallPiece(pointAt(cursor),pointAt(w.from),0,ROOM_HEIGHT);addWallPiece(pointAt(w.from),pointAt(w.to),0,w.sill);addWallPiece(pointAt(w.from),pointAt(w.to),w.head,ROOM_HEIGHT-w.head);cursor=w.to;}
  if(cursor<hi)addWallPiece(pointAt(cursor),pointAt(hi),0,ROOM_HEIGHT);
}
const seen=new Set();for(const p of B1_PLAN.walls){for(let i=1;i<p.points.length;i++){const a=p.points[i-1],b=p.points[i],length=Math.hypot(b[0]-a[0],b[1]-a[1]);if(length<20)continue;const key=[...a,...b].map(Math.round).join();if(seen.has(key))continue;seen.add(key);addWallWithWindows(a,b)}}
// Windows: real glass, sill, head and mullions.  The two upper openings are
// regular windows; living/media remain low-sill windows as requested.
function makeWindow(axis,line,from,to,sill,head){
  const w=to-from,frame=5;
  if(axis==='h'){
    box(from,line,w,3,head-sill,glass,sill);
    box(from-frame,line-3,w+frame*2,8,5,oak,sill-5);
    box(from-frame,line-3,w+frame*2,8,5,oak,head);
    box(from-frame,line-3,5,8,head-sill+10,oak,sill-5);box(to-1,line-3,5,8,head-sill+10,oak,sill-5);
    box((from+to)/2-2.5,line-4,5,10,head-sill-8,linen,sill+4);
  }else{
    box(line,from,3,w,head-sill,glass,sill);
    box(line-3,from-frame,8,w+frame*2,5,oak,sill-5);
    box(line-3,from-frame,8,w+frame*2,5,oak,head);
    box(line-3,from-frame,8,5,head-sill+10,oak,sill-5);box(line-3,to-1,8,5,head-sill+10,oak,sill-5);
    box(line-4,(from+to)/2-2.5,10,5,head-sill-8,linen,sill+4);
  }
}
for(const spec of windowSpecs){
  // CAD window gaps contain no full-height wall segments: add solid lower and upper walls.
  const {axis,line,from,to,sill,head}=spec;
  const piece=(z,h)=>axis==='h'?box(from,line-7.5,to-from,15,h,cream,z,wallGroup):box(line-7.5,from,15,to-from,h,cream,z,wallGroup);
  piece(0,sill);piece(head,ROOM_HEIGHT-head);
  makeWindow(axis,line,from,to,sill,head);
}
// These exterior returns were stored on the CAD's 3F layer, not WALL.
for(const [x,y,w,d]of [[396,989.7,5,77.5],[398.6,292.2,30,15],[1223.6,994.7,35,15]])box(x,y,w,d,ROOM_HEIGHT,cream,0,wallGroup);
for(const m of wallGroup.children)m.userData.fullHeightY=m.position.y;
item('奶油弧背模組沙發',970,750,90,210,()=>{
  // The low walnut plinth, rounded arms and separate down cushions read as a
  // tailored Italian-style sofa, not a generic imported asset.
  const boucle=mat('#d8d0c1',.95),walnut=mat('#6f5540',.52),piping=mat('#aa9880',.9);
  box(975,755,78,200,7,walnut,16);softBox(973,758,18,194,58,boucle,31);softBox(978,751,76,16,48,boucle,31);softBox(978,946,76,16,48,boucle,31);
  softBox(987,766,65,84,19,boucle,38);softBox(987,857,65,84,19,boucle,38);
  softBox(980,770,18,78,42,boucle,57);softBox(980,861,18,78,42,boucle,57);
  for(const yy of [781,872]){box(1000,yy,2,52,1.2,piping,58);box(1000,yy+67,2,52,1.2,piping,58);}
  for(const yy of [770,936])for(const xx of [980,1040])cyl(xx,yy,2.5,12,walnut,8);
});
item('羊毛地毯',1025,690,205,235,()=>box(1025,690,205,235,1.5,mat('#ded8c7'),1));
item('圓角石材升降茶几',1097,785,72,110,()=>{
  const stone=mat('#c7baaa',.32),bronze=mat('#8e745b',.28,{metalness:.6}),warmOak=mat('#a98a69',.58);
  softBox(1099,787,68,106,10,stone,43);box(1104,792,58,96,6,warmOak,34);
  for(const [x,y]of [[1112,805],[1152,805],[1112,870],[1152,870]])cyl(x,y,3.5,33,bronze,5);
  box(1122,831,22,20,3,stone,57);box(1124,833,18,16,2,mat('#7f907d',.86),60);
});
item('延伸電視牆／單扇玻璃門',1220,505,38,490,()=>{
  // One continuous timber plane and floating base run to the planter; no tall cabinet at the end.
  box(1255,505,3,490,ROOM_HEIGHT-25,oak,25);box(1220,505,38,490,32,oak,25);box(1220,505,38,490,5,oak,ROOM_HEIGHT-5);
  // 77-inch 16:9 screen: 170.4 × 95.9 cm, centred on the clean wall field.
  box(1250,778.3,4,170.4,95.9,black,78);
  for(let z=65;z<245;z+=48){box(1220,675,38,55,2,oak,z);cyl(1237,700,7,17,cream,z+2)}
  box(1220,677,2,51,188,glass,64);box(1218,682,2,2,22,dark,130);
  // Small display ledges above the screen for figures, matching the reference wall.
  const led=mat('#ffe3ad',.36,{emissive:0xffc978,emissiveIntensity:1.15});
  for(const [yy,w,z]of [[783.5,50,188],[838.5,50,200],[893.5,50,188]]){box(1235,yy,20,w,3,oak,z);box(1238,yy+1,2,w-2,1,led,z-.5)}
  for(const yy of [505,561,617])box(1220,yy+2,2,52,193,oak,60);
  // No top cabinets above the TV: this central portion is a clean timber backing.
  for(const yy of [505,561,617,675,730,790,850,895,950])box(1219,yy+2,2,Math.min(54,993-yy),28,oak,27);
  for(const yy of [505,561,617,675,730])box(1220,yy,38,2,ROOM_HEIGHT-25,oak,25);
  // Slippers remain below the suspended cabinet, nearest the entrance.
  for(const yy of [540,553,580,593]){box(1224,yy,25,10,3,sage,1);box(1234,yy,8,10,5,linen,4)}
});
item('圓角岩板折疊餐桌 90×40',820,685,90,40,()=>{
  softBox(821,686,88,38,4,mat('#d9d0c2',.24),73);box(820,685,90,35,70,cream,3);
  for(const xx of [824,866]){box(xx,687,4,32,66,dark,5);box(xx+31,687,4,32,66,dark,5);}
  box(820,680,90,3,32,oak,39);
});
item('60 cm 收納臥榻',739,1000,200,60,()=>{box(739,1000,200,60,37,oak);box(739,1000,200,60,7,linen,37);for(let x=740;x<930;x+=65){box(x,999,62,1,31,cream,3)}box(755,1020,45,30,10,sage,44)});
item('160 cm 升降工作桌／對面實牆',874,790,65,160,()=>{
  // Opposite wall placement keeps the window-side volume free for the bench.
  box(874,790,65,160,4,oak,73);
  for(const yy of [804,914]){box(885,yy,45,7,4,dark,6);box(905,yy,6,6,70,dark,6);}
  // Dual monitor / laptop zone, cable tray and a slim side drawer integrated below the top.
  for(const yy of [822,880]){box(931,yy,3,48,30,black,77);box(915,yy+5,16,34,2,dark,77);}
  box(877,798,4,144,3,dark,64);box(877,798,18,46,38,cream,20);
});
item('高階網布人體工學椅',805,850,66,65,()=>{
  // Mesh back, adjustable headrest, lumbar pad, 4D armrests and five-star base.
  const frame=mat('#2e3534',.36,{metalness:.38}),mesh=mat('#55615c',.72),accent=mat('#92a28b',.68);
  box(812,858,52,48,7,mesh,45);box(814,860,48,44,3,frame,42);
  const back=new T.Mesh(new T.SphereGeometry(1,28,20),mesh);back.scale.set(4,34,24);back.position.copy(W(811,882,99));back.castShadow=back.receiveShadow=true;scene.add(back);
  const lumbar=new T.Mesh(new T.SphereGeometry(1,20,16),accent);lumbar.scale.set(4,12,19);lumbar.position.copy(W(806,882,84));lumbar.castShadow=true;scene.add(lumbar);
  // A visible neck stem keeps the adjustable headrest physically tied to the mesh back.
  box(806,879,6,6,28,frame,124);
  // A wide, shallow headrest reads correctly at room scale; a sphere made it appear like a floating orb.
  box(806,865,5,34,13,mesh,143);box(804,869,3,26,8,accent,146);
  for(const yy of [854,908]){box(823,yy,16,5,4,frame,67);box(828,yy,5,5,15,frame,49);}
  cyl(837,882,5,43,frame,2);for(const [x,y]of [[808,882],[828,852],[858,856],[858,908],[828,912]]){box(Math.min(837,x),Math.min(882,y),Math.abs(x-837)+4,Math.abs(y-882)+4,3,frame,3);cyl(x,y,4,5,dark,0);}
});
const designSpecs={style:'warm-japandi-premium',tv:{diagonalInches:77,width:170.4,height:95.9,centerY:863.5},mediaDesk:{width:160,depth:65,wall:'opposite-solid'},chair:{model:'PremiumMesh',width:66,depth:65},living:{sofa:[970,750,90,210],table:[1097,785,72,110],sofaToTable:37,tableToTvWall:51},kitchen:{counter:[239,670,235,60],cooktop:[255,680,60,43],sink:[421,700,52,36],fridge:[474,670,72.1,69.5],fridgeModel:'Panasonic NR-D505XGS-W',fridgeDoorLayout:'asymmetric upper double doors + two full-width drawers',applianceCabinet:[546.1,670,80,70]},guestBath:{vanity:[772,426,40,84],toilet:[772,318,66,42],vanityFacing:'east',toiletFacing:'east',squareTub:[924,310,110,100],shower:[914,420,130,90]},ensuite:{vanity:[241,752,42,62],toilet:[246,837,66,42]},laundry:{model:'LG WD-S15NDB',sizeCm:[65,95,64.5],rotationDeg:360,rotationSteps:[270,90]},corridorStorage:{nicheDepth:14,nicheWidth:30,cleaningBay:true,livingFace:'closed'}};
// Shortened to 70 cm so the desk chair has an unobstructed side route.
item('影音輕量低櫃 70 cm',739,915,30,70,()=>{box(739,915,30,70,60,oak,8);for(const y of [917,951])box(768,y,2,32,54,cream,11);box(739,930,24,40,3,oak,122);cyl(751,940,6,15,cream,125);cyl(753,965,7,15,sage,68)});
// Cabinet follows the bathroom north wall; door opening x829..909 stays clear.
const cleaningDoors=[];
item('面向浴室右手側／掃地機器人',769,520,60,35,()=>{
  box(769,520,2,35,ROOM_HEIGHT,oak);box(827,520,2,35,ROOM_HEIGHT,oak);box(769,520,60,2,ROOM_HEIGHT,oak);box(769,520,60,35,3,oak,ROOM_HEIGHT-3);
  box(771,522,56,32,3,oak,51);box(771,554,56,2,ROOM_HEIGHT-58,oak,55);
  box(780,524,38,15,37,cream,1);cyl(799,545,16,9,white,1);
});
item('浴室走道側淺挖備品／清潔櫃',910,520,64,35,()=>{
  // The 14-cm-deep niche opens only toward the bathroom corridor (west face).
  // The living-room face remains a continuous, closed cabinet front.
  box(972,520,2,35,ROOM_HEIGHT,oak);box(924,520,50,2,ROOM_HEIGHT,oak);box(910,520,64,35,3,oak,ROOM_HEIGHT-3);
  box(923,522,2,30,118,cream,70);box(910,520,14,2,188,oak,3);box(910,553,14,2,188,oak,3);
  for(const z of [80,114,148,182])box(910,522,14,30,2,oak,z);
  // Bathroom consumables stay shallow and visible from the corridor.
  for(const [y,z,col]of [[529,92,'#e9e5dc'],[540,126,'#b7c1ad'],[530,160,'#d4c5b0']]){cyl(916,y,3,13,mat(col,.65),z);}
  // Broom / mop handles are stored in the same corridor-accessible bay.
  box(914,546,3,3,150,dark,8);box(919,548,3,3,136,oak,8);box(912,542,9,6,5,sage,5);
  // South face toward the living room: flush, ordinary cabinet doors with no notch.
  cleaningDoors.push(box(912,553,60,2,ROOM_HEIGHT-8,oak,3));
  for(const z of [178,214,ROOM_HEIGHT-6])box(925,522,47,30,2,oak,z);
});
const hiddenDoorHinge=new T.Group();hiddenDoorHinge.position.copy(W(829,555));scene.add(hiddenDoorHinge);
// Independent fixtures leave a navigable bathroom, instead of one room-sized collider.
const ceramic=mat('#f3f0e8',.22),chrome=mat('#bac4c5',.18,{metalness:.85});
function vessel(x,y,w,d,h,z,material){
  // Continuous rounded rectangular shell: exterior, rim, sloped inner bowl and floor.
  const rings=[[w/2,d/2,0],[w/2,d/2,h-2],[w/2-2,d/2-2,h],[w/2-7,d/2-7,h],[w/2-11,d/2-11,9],[w/2-13,d/2-13,7]];
  const vertices=[],indices=[],count=64;
  for(const [rx,ry,zz]of rings)for(let i=0;i<count;i++){const t=i/count*Math.PI*2,c=Math.cos(t),s=Math.sin(t);vertices.push(Math.sign(c)*Math.pow(Math.abs(c),.48)*rx,zz,Math.sign(s)*Math.pow(Math.abs(s),.48)*ry);}
  for(let r=0;r<rings.length-1;r++)for(let i=0;i<count;i++){const a=r*count+i,b=r*count+(i+1)%count,c=a+count,e=b+count;indices.push(a,b,c,b,e,c);}
  const center=vertices.length/3;vertices.push(0,7,0);for(let i=0;i<count;i++)indices.push(center,(rings.length-1)*count+i,(rings.length-1)*count+(i+1)%count);
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));g.setIndex(indices);g.computeVertexNormals();
  const m=new T.Mesh(g,material);m.material.side=T.DoubleSide;m.position.copy(W(x,y,z));m.castShadow=m.receiveShadow=true;scene.add(m);return m;
}
// Guest bathroom: swap the vanity and toilet, and align both fronts toward the room.
// Their backs share the left wall; the tub and shower stay on the right.
item('客用衛浴馬桶／上左面向房間',772,318,66,42,()=>{
  const base=cyl(805,339,14,28,ceramic,3);base.scale.z=1.2;
  vessel(805,339,55,42,15,27,ceramic);box(772,318,14,42,65,ceramic,3);box(777,320,6,10,2,chrome,68);
});
item('客用衛浴洗手台／下左面向房間',772,426,40,84,()=>{
  box(772,426,40,84,43,oak,30);box(770,424,44,88,4,ceramic,73);
  vessel(792,468,30,52,13,77,ceramic);box(777,464,3,3,18,chrome,79);box(777,464,14,3,3,chrome,95);
  box(771,426,1.5,84,78,mat('#bac5c5',.08,{metalness:.85}),105);
});
item('客用衛浴方形浴缸 110×100',924,310,110,100,()=>{
  vessel(979,360,110,100,55,0,ceramic);cyl(1008,328,3,1,chrome,8);
  box(1025,316,3,3,96,chrome);box(1012,316,16,3,3,chrome,93);
  box(1027,317,2,2,210,chrome);cyl(1017,340,10,2,chrome,208);
});
item('客用衛浴乾濕分離淋浴區／右下',914,420,130,90,()=>{
  box(914,420,130,90,3,ceramic,1);
  // CAD I-BATH line at x≈914 separates the shower from dry fixtures.
  box(912,420,2,90,195,glass,4);box(1018,420,2,70,195,glass,4);
  box(1030,442,2,2,205,chrome,4);cyl(1020,452,9,2,chrome,206);
  box(1018,495,20,3,1,chrome,4);cyl(1026,500,3,1,chrome,5);
});
// The second wet room in the CAD also needs fixtures, not an empty tiled rectangle.
item('主臥衛浴淋浴區',277,914,106,72,()=>{
  box(277,914,106,72,3,ceramic,1);box(277,914,106,2,195,glass,4);
  box(378,930,2,2,205,chrome,4);cyl(367,943,9,2,chrome,206);
  box(283,975,92,3,1,chrome,4);
});
// Swap these two fixtures so the ensuite matches the CAD orientation.
item('主臥衛浴洗手台／入口側',241,752,42,62,()=>{
  box(241,752,42,62,45,oak,30);vessel(263,783,42,60,12,77,ceramic);
  box(243,776,3,3,20,chrome,79);box(243,776,14,3,3,chrome,96);
});
item('主臥衛浴馬桶／淋浴前轉向',246,837,66,42,()=>{
  const pedestal=cyl(279,858,14,28,ceramic,3);pedestal.scale.z=1.3;
  vessel(279,858,55,42,15,27,ceramic);box(246,840,14,36,65,ceramic,3);
});
item('隱藏門 80 cm／齊平內開',829,553,80,3,()=>{const leaf=box(829,553,80,3,230,cream);hiddenDoorHinge.attach(leaf);box(829,553,80,3,ROOM_HEIGHT-230,oak,230)});
item('連續工作平台／延伸至大門',974,520,130,35,()=>{
  box(974,520,130,35,88,oak,3);
  for(const x of [976,1040])box(x,554,62,2,84,cream,5);
  box(974,520,130,36,3,cream,91);
  box(974,520,130,2,ROOM_HEIGHT-94,oak,94);
  box(974,520,130,30,ROOM_HEIGHT-170,oak,170);
  for(const x of [976,1040])box(x,549,62,2,ROOM_HEIGHT-176,oak,173);
  box(1060,530,25,16,2,dark,94);
// Restore the entrance at the CAD door zone. It stays outside the furniture
// collider list so a visitor can pass the threshold while it is open.
window.mainDoorHinge=new T.Group();window.mainDoorHinge.position.copy(W(1107,505));scene.add(window.mainDoorHinge);
const mainDoorMat=mat('#625548',.5,{metalness:.08});
const mainDoorLeaf=box(1107,505,100,4,228,mainDoorMat,3);window.mainDoorHinge.attach(mainDoorLeaf);
const mainDoorHandle=box(1192,500,4,7,24,chrome,104);window.mainDoorHinge.attach(mainDoorHandle);
// Solid oak jambs, head and threshold make the door legible in every view.
box(1101,501,6,12,229,oak,2);box(1207,501,6,12,229,oak,2);box(1101,501,112,12,6,oak,231);box(1107,501,100,12,ROOM_HEIGHT-237,cream,237);box(1101,501,112,12,4,dark,0);
});
item('LG WD-S15NDB 洗脫烘／270度再轉90度',315,320.25,65,64.5,()=>{
  const washer=new T.Group();washer.position.copy(W(347.5,352.5));washer.rotation.y=2*Math.PI;scene.add(washer);
  window.B1_WASHER=washer;
  const graphite=mat('#30383a',.24,{metalness:.12}),glassDoor=mat('#171d20',.14,{metalness:.22}),display=mat('#a9b8b1',.28,{emissive:0x16201d,emissiveIntensity:.12});
  const body=new T.Mesh(new T.BoxGeometry(65,95,64.5),graphite);body.position.y=47.5;body.castShadow=body.receiveShadow=true;washer.add(body);
  const trim=new T.Mesh(new T.TorusGeometry(23,2.5,12,56),mat('#5c6262',.23,{metalness:.55}));trim.position.set(0,47,-32.5);trim.castShadow=true;washer.add(trim);
  const glassDoorMesh=new T.Mesh(new T.CylinderGeometry(20,20,1.4,48),glassDoor);glassDoorMesh.rotation.x=Math.PI/2;glassDoorMesh.position.set(0,47,-32.2);glassDoorMesh.castShadow=true;washer.add(glassDoorMesh);
  const control=new T.Mesh(new T.BoxGeometry(29,7,1.5),graphite);control.position.set(0,87,-32);washer.add(control);
  const screen=new T.Mesh(new T.BoxGeometry(9,3,1),display);screen.position.set(-9,87,-33);washer.add(screen);
});
// Balcony guard: slim vertical slats with a continuous top rail.
item('陽台直條格柵欄',220,300,12,250,()=>{
  const rail=mat('#4a514c',.48,{metalness:.35});
  for(let y=301;y<=519;y+=11)box(230,y,3,3,115,rail,0);
  box(228,298,7,224,4,rail,0);box(228,298,7,224,4,rail,112);
  for(let x=240;x<=335;x+=11)box(x,295,3,3,115,rail,0);
  box(230,293,108,7,4,rail,0);box(230,293,108,7,4,rail,112);
});
item('主臥飯店級軟包雙人床／轉向90度',425,890,188,150,()=>{box(425,890,188,150,12,oak,14);softBox(425,890,188,150,22,linen,24);softBox(417,890,12,150,82,mat('#c2b4a3',.94),18);for(const yy of [902,972])softBox(438,yy,35,58,11,cream,46);box(538,890,75,150,3,sage,47)});
const wardrobeDoors=[];
item('主臥頂天滑門衣櫥 255 cm',664,765,55,255,()=>{
  box(716,765,3,255,ROOM_HEIGHT,oak);box(664,765,55,3,ROOM_HEIGHT,oak);box(664,1017,55,3,ROOM_HEIGHT,oak);box(664,765,55,255,3,oak,ROOM_HEIGHT-3);
  for(const z of [3,60,195])box(664,768,52,249,3,oak,z);
  for(const [x,y]of [[661,767],[658,891]])wardrobeDoors.push(box(x,y,2,124,ROOM_HEIGHT-8,oak,4));
});
item('次臥飯店級客床 150×188',415,320,150,188,()=>{box(415,320,150,188,12,oak,14);softBox(415,320,150,188,22,linen,24);softBox(415,508,150,10,76,mat('#c2b4a3',.94),16);softBox(430,465,110,35,12,cream,46)});
const KITCHEN_LAYOUT={map:(x,y,z=0)=>[x,y-.5,z],transformMesh:m=>{m.position.z+=.5;return m;}};
item('橫向廚具 230×60',239,669.5,230,60,()=>{
  const kitchenStart=scene.children.length;
  // Keep the existing I-KITCHEN counter while swapping the cooktop and sink bays.
  box(239,670,230,60,7,oak,3);box(239,670,3,60,75,oak,10);box(466,670,3,60,75,oak,10);
  box(239,727,230,3,75,oak,10);
  for(const [x,w]of [[239,156],[447,22]])box(x,670,w,60,4,cream,85);
  box(395,670,52,12,4,cream,85);box(395,718,52,12,4,cream,85);
  vessel(421,700,52,36,20,69,mat('#aeb5b3',.3,{metalness:.8}));
  const curve=new T.CatmullRomCurve3([W(421,724,89),W(421,724,115),W(421,713,122),W(421,699,114)]);
  const faucet=new T.Mesh(new T.TubeGeometry(curve,32,1.6,10,false),chrome);faucet.castShadow=true;scene.add(faucet);
  box(255,680,60,43,2,black,89);for(const x of [270,300])cyl(x,701,9,1,dark,91);
  for(let x=241;x<467;x+=47){box(x,669,Math.min(44,467-x),2,78,cream,5);box(x+13,667,18,2,1.5,dark,74);}
  box(239,728,230,1,75,cream,90);box(253,714,64,15,9,chrome,186);box(273,718,24,11,65,chrome,195);
  for(const m of scene.children.slice(kitchenStart))KITCHEN_LAYOUT.transformMesh(m);
});
// Panasonic NR-D505XGS-W cloud-rock white: upper French doors + two wide drawers.
const FRIDGE_LAYOUT={x:530.5,y:655.2,width:72.1,depth:69.5,height:183.4,backClearance:5,map:(x,y,z=0)=>[x+56.5,655.2+(y-666.2)*69.5/73.3,z-2],transformMesh:m=>{const [x,y,z]=FRIDGE_LAYOUT.map(m.position.x+750,700-m.position.z,m.position.y);m.position.copy(W(x,y,z));m.scale.z*=69.5/73.3;return m;}};
const fridgeDoors=[];
item('Panasonic NR-D505XGS-W 雲岩白四門冰箱',530.5,655.2,72.1,69.5,()=>{
  const fridgeStart=scene.children.length;
  const glassWhite=mat('#e7e5dc',.19,{metalness:.08}),edge=mat('#aeb1ad',.22,{metalness:.18});
  box(474,670,2.2,69.5,183.4,white,2);box(543.9,670,2.2,69.5,183.4,white,2);box(476.2,737,67.7,2.5,183.4,white,2);
  for(const z of [2,90,183.2])box(476.2,670,67.7,67,2.2,white,z);
  for(const z of [112,137,161])box(477,678,66,55,1.2,glass,z);
  for(const [x,y,z]of [[485,704,115],[507,714,140],[526,707,115]])cyl(x,y,4,14,cream,z);
  // Upper doors: left leaf is narrower than the right. Drawers below span full width.
  fridgeDoors.push(box(474.6,666.8,28.5,1.2,91,glassWhite,92),box(504,666.8,41,1.2,91,glassWhite,92));
  box(474.6,666.8,70.9,1.2,33,glassWhite,57);box(474.6,666.8,70.9,1.2,47,glassWhite,8);
  // Fine shadow gaps reproduce the four-door arrangement without wood trim or handles.
  box(474.4,666.2,71.2,1.5,1.1,edge,91.7);
  box(474.4,666.2,71.2,1.5,1.1,edge,56);box(474.4,666.2,71.2,1.5,1.1,edge,8);
  const fridgeControl=box(539.3,666.7,2,1.2,2,dark,177);fridgeDoors[1].attach(fridgeControl);
  for(const m of scene.children.slice(fridgeStart))FRIDGE_LAYOUT.transformMesh(m);
});
const KITCHEN_HEIGHT=245;
const APPLIANCE_LAYOUT={x:470.5,y:669,width:58.5,depth:60,map:(x,y,z=0)=>[470.5+(x-546.1)*58.5/80,669+(y-668)*60/72,z],transformMesh:m=>{const [x,y,z]=APPLIANCE_LAYOUT.map(m.position.x+750,700-m.position.z,m.position.y);m.position.copy(W(x,y,z));m.scale.x*=58.5/80;m.scale.z*=60/72;return m;}};
const applianceDoors=[];
item('頂天電器櫃 58.5 cm',470.5,669,58.5,60,()=>{
  const applianceStart=scene.children.length;
  box(546.1,670,2,70,KITCHEN_HEIGHT,oak);box(624.1,670,2,70,KITCHEN_HEIGHT,oak);box(548.1,738,76,2,KITCHEN_HEIGHT-4,cream,3);
  for(const z of [2,92,150,205,KITCHEN_HEIGHT-3])box(548.1,670,76,68,3,oak,z);
  box(548.1,668,76,2,86,cream,4);
  // Two ventilated appliance bays plus enclosed pantry storage.
  box(550,669,72,2,2,oak,92);box(550,669,72,2,2,oak,150);box(550,669,72,2,2,oak,205);
  box(552,670,68,20,38,black,100);box(554,669,64,2,30,mat('#313735',.25,{metalness:.25}),104);
  box(552,670,68,20,36,black,158);box(554,669,64,2,28,mat('#313735',.25,{metalness:.25}),162);
  for(const x of [548.1,588.1])applianceDoors.push(box(x,668,36,2,KITCHEN_HEIGHT-212,cream,208));
  for(const m of scene.children.slice(applianceStart))APPLIANCE_LAYOUT.transformMesh(m);
});
const nightLights=[];for(const [x,y]of [[1100,800],[840,900],[860,640],[1070,580]]){const l=new T.PointLight(0xffc17d,0,440,2);l.position.copy(W(x,y,220));scene.add(l);nightLights.push(l);cyl(x,y,6,2,mat('#fff3cd',.2,{emissive:0xffdba3,emissiveIntensity:.5}),ROOM_HEIGHT-5)}
Object.assign(designSpecs.kitchen,{counter:[239,669.5,230,60],cooktop:[255,679.5,60,43],sink:[421,699.5,52,36],fridge:[530.5,655.2,72.1,69.5],ceilingHeight:KITCHEN_HEIGHT,fridgeHeight:183.4,fridgeBackClearance:5,applianceCabinet:[470.5,669,58.5,60],usableWallRight:603.6,backWallFace:729.7});
const configs={all:{target:[750,690],radius:1650,yaw:.6,pitch:.8,title:'全室配置',sub:'依 DWG 房間位置配置',text:'客廳在右側、最小臥室位於上方中央；將其規劃為影音工作室。淨高暫定 280 cm，牆體顯示為可切換剖面。'},living:{target:[1110,790],radius:560,yaw:1.2,pitch:.46,title:'木框沙發 × 玻璃收藏牆',sub:'客廳 / 暖木與留白',text:'220 cm 沙發沿影音室外牆擺放，朝向右側電視。展示櫃集中於電視兩端，以封閉底櫃收整日常雜物；淺色地毯統一客廳範圍。'},media:{target:[840,900],radius:490,yaw:.8,pitch:.65,title:'一間房，三種日常',sub:'影音 / 工作 / 收藏',text:'最小房暫採上方中央約 220 × 300 cm 臥室。60 cm 深臥榻沿窗、升降桌靠左牆、展示收納靠右牆。影音設備與座位視線待選型調整。'},entry:{target:[1080,570],radius:500,yaw:1,pitch:.6,title:'以同一片立面迎接回家',sub:'玄關 / 隱藏門概念',text:'玄關以淺橡木與奶油白櫃門串連入口。廁所隱藏門須依原門洞位置及開門方向確認；目前展示櫃體語彙與預留範圍。'},laundry:{target:[310,420],radius:500,yaw:-1,pitch:.7,title:'清爽的洗衣陽台',sub:'洗脫烘 / 耐潮工作檯',text:'LG 15 kg 機器先預留 65 × 75 cm 示意體積，並非已核對型號尺寸。陽台安排獨立洗衣檯面，後續依實際型號確認管線與維修空間。'}};
configs.living.yaw=-1.12;configs.living.radius=700;
configs.living.title='弧背沙發 × 石材茶几';configs.living.text='奶油色弧背模組沙發改採低矮、柔和的飯店式比例，搭配圓角石材升降茶几；桌緣至沙發保留約37 cm、至電視牆約51 cm。花台端不放植栽或高櫃，讓採光與主要動線保持留白。';
configs.media.text='160 × 65 cm升降桌移到對面實牆，椅子面向桌面；窗邊只保留 60 cm 臥榻與採光，中央通道保持開闊。';
configs.entry.target=[1020,650];configs.entry.yaw=2.65;configs.entry.radius=350;configs.entry.pitch=.65;configs.entry.title='客廳全景與客衛隱藏門';configs.entry.sub='窗戶・大門・電視牆・隱藏門';configs.entry.text='按 3D 配置由客廳查看窗戶、主大門及側向電視牆；客衛隱藏門位在大門旁的短收納立面，門後即客用衛浴。清潔櫃與大門旁 130 cm 工作檯依模型位置保留；隱藏門與主大門是兩扇不同的門。';
configs.master={target:[555,900],radius:590,yaw:.5,pitch:.8,title:'床尾滑門衣櫥，頂天收納',sub:'主臥 / 衣櫥255 × 55 × 280 cm',text:'維持床頭朝左、150 × 188 cm雙人床。木質滑門衣櫥由275 cm減少20 cm，改為255 cm，入口端不動，靠窗端縮短；淨高280 cm。'};
configs.guest={target:[580,430],radius:570,yaw:.7,pitch:.85,title:'清空次臥櫃體，保留彈性',sub:'次臥 / 只保留客床與完整動線',text:'移除原本的衣櫃、書桌與零散櫃體，留下150×188 cm客床及完整門口動線。後續可依實際需求再放入活動式家具，不先以固定櫃體壓縮空間。'};
configs.laundry.text='LG WD-S15NDB 15公斤洗脫烘（65 × 64.5 × 95 cm）放在既有陽台位置，依270度後再轉90度設定為360度；門面朝室內。現場仍需確認開門深度、給排水與插座。';
configs.kitchen={target:[470,690],radius:620,yaw:-.7,pitch:.7,title:'廚具・電器收納・冰箱',sub:'230 × 60 cm 檯面 / Panasonic NR-D505XGS-W',text:'依家人指定，沿檯面往側牆依序為230 cm 檯面、58.5 × 60 cm 電器櫃、72.1 cm 冰箱。冰箱實際外尺寸為72.1 × 69.5 × 183.4 cm，預留背後5 cm，兩側設備保持間隙，櫃體不伸進側牆或背牆。散熱與安裝間距仍須依現場及原廠安裝圖複核。'};
for(const [name,label]of [['master','06　主臥'],['guest','07　次臥'],['kitchen','08　廚房']]){const b=document.createElement('button');b.dataset.room=name;b.textContent=label;document.querySelector('.rooms').append(b)}
let selected='all',yaw=.6,pitch=.8,radius=1650,target=W(750,690,30);function select(name){selected=name;const c=configs[name];yaw=c.yaw;pitch=c.pitch;radius=c.radius;target=W(...c.target,35);document.querySelector('#title').textContent=c.title;document.querySelector('#description').textContent=c.text;document.querySelector('#subtitle').textContent=c.sub;document.querySelector('#viewname').textContent=c.title;document.querySelectorAll('[data-room]').forEach(b=>b.classList.toggle('active',b.dataset.room===name))}document.querySelectorAll('[data-room]').forEach(b=>b.onclick=()=>select(b.dataset.room));document.querySelector('#reset').onclick=()=>select(selected);
let walking=false,compare=false,walkX=1150,walkY=600,walkYaw=0,lookPitch=0,drag=null;
canvas.onpointerdown=e=>{drag=[e.clientX,e.clientY];canvas.setPointerCapture(e.pointerId)};canvas.onpointermove=e=>{if(!drag)return;const dx=e.clientX-drag[0],dy=e.clientY-drag[1];if(walking){walkYaw+=dx*.006;lookPitch=Math.max(-1,Math.min(1,lookPitch-dy*.005))}else{yaw-=dx*.008;pitch=Math.max(.12,Math.min(1.5,pitch+dy*.006))}drag=[e.clientX,e.clientY]};canvas.onpointerup=canvas.onpointercancel=()=>drag=null;canvas.onwheel=e=>{e.preventDefault();if(!walking)radius=Math.max(200,Math.min(2800,radius*Math.exp(e.deltaY*.001))) };
document.querySelector('#walls').onchange=e=>{for(const m of wallGroup.children){const scale=e.target.checked?.35:1;m.scale.y=scale;m.position.y=m.userData.fullHeightY*scale;}renderer.shadowMap.needsUpdate=true;};document.querySelector('#walls').dispatchEvent(new Event('change'));document.querySelector('#ceiling').onchange=e=>{ceilingGroup.visible=e.target.checked;renderer.shadowMap.needsUpdate=true;};document.querySelector('#night').onchange=e=>{const n=e.target.checked;hemi.intensity=n?.5:2.3;sun.intensity=n?.15:3;scene.background.set(n?'#303b38':'#dedfd5');nightLights.forEach(l=>l.intensity=n?15000:0)};
const svg=document.querySelector('#plan'),NS='http://www.w3.org/2000/svg';function el(n,a,text){const e=document.createElementNS(NS,n);for(const[k,v]of Object.entries(a))e.setAttribute(k,v);if(text)e.textContent=text;svg.append(e);return e}for(const [x,y,w,d]of rooms)el('rect',{x,y:1100-y-d,width:w,height:d,fill:'#e5d3b3',stroke:'#c1b49b','stroke-width':1});for(const p of B1_PLAN.paths)el('polyline',{points:p.points.map(([x,y])=>`${x},${1100-y}`).join(' '),fill:'none',stroke:/WALL|A-RC|wall-i/.test(p.layer)?'#475247':'#a1a897','stroke-width':/WALL/.test(p.layer)?2:1});for(const f of furniture){el('rect',{x:f.x,y:1100-f.y-f.d,width:f.w,height:f.d,rx:5,fill:f.name.includes('地毯')?'#ded8c7':'#b5c0a4','fill-opacity':.75,stroke:'#6f8063','stroke-width':1});el('text',{x:f.x+f.w/2,y:1100-f.y-f.d/2,'text-anchor':'middle','font-size':12,fill:'#314334'},f.name)}
const compareButton=document.createElement('button');compareButton.dataset.mode='compare';compareButton.textContent='3D＋平面對照';document.querySelector('header nav').append(compareButton);
const renderButton=document.createElement('button');renderButton.dataset.mode='render';renderButton.textContent='寫實3D漫遊';document.querySelector('header nav').append(renderButton);
const renderPanel=document.createElement('div');renderPanel.id='render-panel';renderPanel.hidden=true;renderPanel.style.display='none';view.append(renderPanel);
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
window.B1_REVIEW={furniture,designSpecs,clearances:{masterBedToWardrobe:49,mediaDeskToCabinet:105,diningFolded:130,diningExpanded:95,slipperHeight:25,planterEndClear:85},select};
const visitor=el('g',{});visitor.innerHTML='<path d="M 0 0 L -24 -42 L 24 -42 Z" fill="#b87e44" opacity=".3"/><circle r="10" fill="#b87e44" stroke="white" stroke-width="3"/><path d="M 0 0 L 0 -26" stroke="#714b26" stroke-width="3"/>';
const doorSwing=el('path',{d:'M 909 545 A 80 80 0 0 1 829 625 L 829 545',fill:'none',stroke:'#b87e44','stroke-width':3,'stroke-dasharray':'5 4',visibility:'hidden'});
const doorButton=document.createElement('button');doorButton.textContent='開啟隱藏門';let doorOpen=false;doorButton.onclick=()=>{doorOpen=!doorOpen;hiddenDoorHinge.rotation.y=doorOpen?-Math.PI/2:0;doorSwing.setAttribute('visibility',doorOpen?'visible':'hidden');doorButton.textContent=doorOpen?'關閉隱藏門':'開啟隱藏門'};document.querySelector('.toolbar').append(doorButton);
const mainDoorSwing=el('path',{d:'M 1104 595 A 110 110 0 0 0 1214 705 L 1104 705',fill:'none',stroke:'#67513d','stroke-width':3,'stroke-dasharray':'5 4',visibility:'hidden'});
const mainDoorButton=document.createElement('button');mainDoorButton.textContent='開啟大門';let mainDoorOpen=false;mainDoorButton.onclick=()=>{mainDoorOpen=!mainDoorOpen;window.mainDoorHinge.rotation.y=mainDoorOpen?Math.PI/2:0;mainDoorSwing.setAttribute('visibility',mainDoorOpen?'visible':'hidden');mainDoorButton.textContent=mainDoorOpen?'關閉大門':'開啟大門';renderer.shadowMap.needsUpdate=true;};document.querySelector('.toolbar').append(mainDoorButton);
const tourButton=document.createElement('button');tourButton.textContent='進入室內漫遊';document.querySelector('.toolbar').append(tourButton);
const help=document.createElement('div');help.className='tour-help';help.hidden=true;help.textContent='拖曳轉頭 · WASD／方向鍵移動 · 點平面地板換位置 · Esc 返回鳥瞰';view.append(help);
const motionPad=document.createElement('div');motionPad.className='motion-pad';motionPad.hidden=true;view.append(motionPad);
const keys=new Set();for(const [label,key]of [['↑','w'],['←','a'],['↓','s'],['→','d']]){const b=document.createElement('button');b.textContent=label;b.onpointerdown=e=>{keys.add(key);b.setPointerCapture(e.pointerId)};b.onpointerup=b.onpointercancel=()=>keys.delete(key);motionPad.append(b)}
const stops={all:[1150,600,0],living:[1135,710,Math.PI/2],media:[825,860,0],entry:[960,610,Math.PI],laundry:[340,450,Math.PI],master:[645,850,-Math.PI/2],guest:[590,460,-Math.PI/2],kitchen:[355,610,0]};
function setTour(enabled){walking=enabled;keys.clear();tourButton.textContent=enabled?'退出室內漫遊':'進入室內漫遊';help.hidden=motionPad.hidden=!enabled;if(enabled){[walkX,walkY,walkYaw]=stops[selected]||stops.all;lookPitch=0;document.querySelector('#walls').checked=false;document.querySelector('#walls').dispatchEvent(new Event('change'));ceilingGroup.visible=true;document.querySelector('#ceiling').checked=true;}else{ceilingGroup.visible=false;document.querySelector('#ceiling').checked=false;document.querySelector('#walls').checked=true;document.querySelector('#walls').dispatchEvent(new Event('change'));}document.querySelector('.view-label span').textContent=enabled?'眼高 160 cm · 即時 3D 模擬':'拖曳旋轉 · 滾輪縮放'}
tourButton.onclick=()=>setTour(!walking);
document.querySelectorAll('[data-room]').forEach(b=>b.addEventListener('click',()=>{if(walking){[walkX,walkY,walkYaw]=stops[b.dataset.room];lookPitch=0;}}));
const isEditing=e=>Boolean(e.target?.closest?.('input,select,textarea,[contenteditable="true"],dialog[open]'));
addEventListener('keydown',e=>{if(isEditing(e))return;if(e.key==='Escape'){if(document.pointerLockElement)document.exitPointerLock();else setTour(false);}const k=e.key.toLowerCase();if(walking&&!canvas.hidden&&['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(k)){e.preventDefault();keys.add(k)}});addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));addEventListener('blur',()=>keys.clear());
const doorZones=[{x:829,y:510,w:80,d:20},{x:1104,y:505,w:110,d:20}];
function distanceToSegment(x,y,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],l=dx*dx+dy*dy,t=l?Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/l)):0;return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy)}
function canStand(x,y){if(!rooms.some(([rx,ry,w,d])=>x>=rx&&x<=rx+w&&y>=ry&&y<=ry+d))return false;for(const f of furniture){if(/地毯|隱藏門/.test(f.name))continue;if(x>f.x-12&&x<f.x+f.w+12&&y>f.y-12&&y<f.y+f.d+12)return false}for(const p of B1_PLAN.walls)for(let i=1;i<p.points.length;i++)if(distanceToSegment(x,y,p.points[i-1],p.points[i])<12)return false;for(const w of windowSpecs){const a=w.axis==='h'?[w.from,w.line]:[w.line,w.from],b=w.axis==='h'?[w.to,w.line]:[w.line,w.to];if(distanceToSegment(x,y,a,b)<16)return false;}if(leaf.visible&&x>808&&x<922&&y>638&&y<697)return false;return true}
svg.style.cursor='crosshair';svg.addEventListener('click',e=>{const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;const q=p.matrixTransform(svg.getScreenCTM().inverse()),y=1100-q.y;if(canStand(q.x,y)){if(!walking)setTour(true);walkX=q.x;walkY=y}});
window.B1_REVIEW.canStand=canStand;window.B1_REVIEW.setTour=setTour;
let lastTime=performance.now();function frame(now=performance.now()){if(!window.B1_REVIEW?.ready){lastTime=now;requestAnimationFrame(frame);return;}const dt=Math.min((now-lastTime)/1000,.05);lastTime=now;const stacked=compare&&matchMedia('(max-width:650px)').matches;const w=compare&&!stacked?view.clientWidth/2:view.clientWidth,h=stacked?view.clientHeight/2:view.clientHeight;if(canvas.width!==Math.round(w*renderer.getPixelRatio())||canvas.height!==Math.round(h*renderer.getPixelRatio())){renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}if(walking){let forward=(keys.has('w')||keys.has('arrowup')?1:0)-(keys.has('s')||keys.has('arrowdown')?1:0),side=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0);const speed=95*dt/Math.max(1,Math.hypot(forward,side)),dx=(Math.sin(walkYaw)*forward+Math.cos(walkYaw)*side)*speed,dy=(Math.cos(walkYaw)*forward-Math.sin(walkYaw)*side)*speed;if(canStand(walkX+dx,walkY))walkX+=dx;if(canStand(walkX,walkY+dy))walkY+=dy;camera.position.copy(W(walkX,walkY,160));camera.lookAt(W(walkX+Math.sin(walkYaw)*100,walkY+Math.cos(walkYaw)*100,160+Math.tan(lookPitch)*100));}else{camera.position.set(target.x+radius*Math.cos(pitch)*Math.sin(yaw),target.y+radius*Math.sin(pitch),target.z+radius*Math.cos(pitch)*Math.cos(yaw));camera.lookAt(target)}window.B1_GAME?.tick(dt,now);visitor.setAttribute('transform',`translate(${walkX} ${1100-walkY}) rotate(${walkYaw*180/Math.PI})`);visitor.style.display=walking?'':'none';renderer.render(scene,camera);requestAnimationFrame(frame)}select(configs[location.hash.slice(1)]?location.hash.slice(1):'all');if(new URLSearchParams(location.search).has('tour'))setTour(true);if(new URLSearchParams(location.search).has('compare'))compareButton.click();frame();document.head.append(detailScript);
