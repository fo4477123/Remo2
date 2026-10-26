/* Public spaces share centimetre scale; only the active room is rendered. */
(() => {
  'use strict';
  const {rounded,rod}=B1_MODELS,zones={},npcs=[],elevators=[],motions=[];
  const stone=mat('#d9d5c9',.65),wall=mat('#ece7dc',.85),wood=oak.clone(),ink=mat('#364b44',.7),metal=mat('#9c9d93',.3,{metalness:.75}),cloth=mat('#9ca58f',.95),dark=mat('#303a3b',.55),gold=mat('#b39a63',.3,{metalness:.72});
  wood.color.set('#c1a882');
  const b=(z,x,y,w,d,h,m=wood,height=0,r=1)=>rounded(x,y,w,d,h,m,height,z.scene||z,r);
  function text(z,label,sub,x,y,h,w=180,height=60,angle=Math.PI){
    const c=document.createElement('canvas');c.width=768;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle='#344c43';ctx.fillRect(0,0,768,256);ctx.fillStyle='#d6c49d';ctx.font='24px sans-serif';ctx.fillText(sub,30,55,708);ctx.fillStyle='#fff8e8';ctx.font='46px Microsoft JhengHei,sans-serif';ctx.fillText(label,30,142,708);ctx.fillStyle='#c5d0bd';ctx.font='20px sans-serif';ctx.fillText('QINGPU · OUR NEIGHBOURHOOD',30,214,708);const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;const mesh=new T.Mesh(new T.PlaneGeometry(w,height),new T.MeshBasicMaterial({map}));mesh.position.copy(W(x,y,h));mesh.rotation.y=angle;(z.scene||z).add(mesh);return mesh;
  }
  function room(id,name,floor=1,bounds=[1800,300,1200,1000]){
    const world=new T.Scene();world.name='community-'+id;world.background=new T.Color('#cdd9d2');world.environment=scene.environment;world.userData.floor=floor;
    const z={id,name,floor,scene:world,bounds,obstacles:[],targets:[],spawn:[2400,1120,Math.PI],description:'',npcs:[]};zones[id]=z;
    const [x,y,w,d]=bounds;b(z,x,y,w,d,8,stone,-8);b(z,x,y,w,d,8,wall,280);b(z,x,y,w,10,280,wall);b(z,x,y,10,d,280,wall);
    const eastWindow=id.startsWith('hall')||['gym','library'].includes(id);
    if(eastWindow){const lo=y+100,hi=y+d-90,sill=id.startsWith('hall')?45:80;b(z,x+w-10,y,10,100,280,wall);b(z,x+w-10,hi,10,90,280,wall);b(z,x+w-10,lo,10,hi-lo,sill,wall);b(z,x+w-10,lo,10,hi-lo,45,wall,235);b(z,x+w-13,lo,2,hi-lo,235-sill,glass,sill);for(let yy=lo;yy<=hi;yy+=130)b(z,x+w-16,yy,12,3,235-sill,metal,sill);}
    else b(z,x+w-10,y,10,d,280,wall);
    if(id==='lobby'){b(z,x,y+d-10,w,10,20,wall);b(z,x,y+d-10,w,10,30,wall,250);for(const xx of [x,x+w-25])b(z,xx,y+d-10,25,10,280,wall);}
    else b(z,x,y+d-10,w,10,280,wall);
    // Insets and joints give the room scale without a second full floor mesh.
    for(let xx=x+60;xx<x+w;xx+=120)b(z,xx,y+10,.35,d-20,.2,metal,.1,.1);
    for(let yy=y+60;yy<y+d;yy+=120)b(z,x+10,yy,w-20,.35,.2,metal,.1,.1);
    for(const xx of [x+w*.28,x+w*.72]){b(z,xx-90,y+d*.5,180,5,1,mat('#fff1cf',.4,{emissive:0xffe2b4,emissiveIntensity:.8}),276,.2);}
    const hemi=new T.HemisphereLight('#fff3dc','#7e9184',1.8),sunny=new T.DirectionalLight('#fff1db',1.8);sunny.position.copy(W(x+w*.7,y+d*.7,265));sunny.target.position.copy(W(x+w*.4,y+d*.4,0));sunny.castShadow=B1_ENGINE.quality!=='low';sunny.shadow.mapSize.set(1024,1024);Object.assign(sunny.shadow.camera,{left:-800,right:800,top:800,bottom:-800,near:1,far:1800});sunny.shadow.bias=-.0005;world.add(hemi,sunny,sunny.target);
    const source=scene.getObjectByName('qingpu-360-environment');if(source&&floor>0){const view=source.clone();view.name=floor===1?'qingpu-ground-environment':'qingpu-corridor-environment';view.material=floor===1?B1_EXTERIOR.groundMaterial:source.material;view.position.copy(W(x+w/2,y+d/2,160));view.frustumCulled=false;world.add(view);z.exterior=view;}
    z.canStand=(px,py)=>px>x+24&&px<x+w-24&&py>y+24&&py<y+d-24&&!z.obstacles.some(([a,c,r,s])=>px>a-14&&px<a+r+14&&py>c-14&&py<c+s+14);
    return z;
  }
  function obstacle(z,x,y,w,d){z.obstacles.push([x,y,w,d]);}
  function target(z,id,label,x,y,h,data={},range=170){const a={id,label,x,y,h,range,...data};z.targets.push(a);return a;}
  function portal(z,x,y,label,sub,destination,angle=Math.PI){
    const front=angle===0?-1:1;
    b(z,x-61,y-3,122,8,237,wood);b(z,x-53,y+(front>0?6:-9),106,5,229,dark,2);b(z,x-50,y+(front>0?12:-13),100,3,222,mat('#788a7e',.3,{metalness:.15}),5);
    b(z,x+34,y+(front>0?16:-17),2,4,24,gold,99);text(z,label,sub,x,y+front*18,260,190,52,angle);
    target(z,'portal-'+destination,label,x,y,130,{kind:'travel',destination},175);
  }
  function seat(z,x,y,w=180){b(z,x,y,w,76,18,wood,7,3);b(z,x+5,y+5,w-10,68,15,cloth,25,5);b(z,x,y,w,12,54,cloth,29,3);obstacle(z,x,y,w,76);}
  function plant(z,x,y){const pot=new T.Mesh(new T.CylinderGeometry(19,14,36,20),stone);pot.position.copy(W(x,y,18));z.scene.add(pot);for(let i=0;i<6;i++){const a=i*Math.PI/3,leaf=new T.Mesh(new T.SphereGeometry(1,12,8),mat(i%2?'#718c6a':'#91a17b',.9));leaf.scale.set(8,30,5);leaf.position.copy(W(x+Math.cos(a)*15,y+Math.sin(a)*15,58+i%2*12));leaf.rotation.z=Math.cos(a)*.6;z.scene.add(leaf);}obstacle(z,x-20,y-20,40,40);}
  function elevator(z,x,y,tower,index,side='west'){
    b(z,x-3,y-67,6,134,239,metal);const cabin=b(z,x+(side==='west'?-6:5),y-57,2,114,225,dark,3);
    const left=b(z,x,y-56,3,55,224,metal,3),right=b(z,x,y+1,3,55,224,metal,3);
    b(z,x+(side==='west'?5:-5),y+73,2,12,36,ink,95);
    // A separate side-facing label remains readable from the hall.
    const label=text(z,`${tower}棟 ${index}號梯`,`${z.floor}F · 按 E 選樓層`,x+(side==='west'?8:-8),y,253,130,42,side==='west'?Math.PI/2:-Math.PI/2);
    const e={id:`${z.id}-${tower}-${index}`,zone:z.id,tower,index,left,right,open:0,goal:0,leftZ:left.position.z,rightZ:right.position.z};elevators.push(e);
    target(z,e.id,`${tower}棟 ${index}號電梯`,x+(side==='west'?28:-28),y,133,{kind:'elevator',elevator:e.id,tower},160);return e;
  }
  function npc(z,id,name,role,x,y,color='#71877d'){
    const rig=B1_CHARACTERS.create({color,variant:/小雨|秘書|小姐/.test(name+role)?'urban-woman':'urban-man'}),{root,torso,head,arms}=rig;root.name='npc-'+id;root.position.copy(W(x,y,z.scene.userData.floorAt?.(x,y)||0));z.scene.add(root);
    const badge=text(z,name,role,x,y,198,105,36);const n={id,name,role,x,y,zone:z.id,root,torso,head,arms,rig,badge,waveUntil:0};npcs.push(n);z.npcs.push(n);obstacle(z,x-20,y-20,40,40);target(z,'npc-'+id,'與'+name+'交談',x,y,150,{kind:'npc',npc:id},240);return n;
  }
  function hall(tower){
    const z=room('hall'+tower+'5',`${tower}棟・五樓電梯廊廳`,5,[1800,400,1200,700]);z.tower=tower;z.spawn=[2050,505,Math.PI/2];z.description=`同側 ${tower}1-5F、${tower}3-5F；走道另一側 ${tower}2-5F、${tower}5-5F。西側為雙電梯。`;
    text(z,`${tower}棟 5F`, '四戶 · 兩部電梯',2400,412,255,280,55);
    const units=[{n:1,rooms:3,x:2050,y:413},{n:3,rooms:3,x:2760,y:413},{n:2,rooms:2,x:2050,y:1084},{n:5,rooms:2,x:2760,y:1084}];
    z.units=units.map(u=>({...u,id:tower+u.n+'-5F',own:tower==='B'&&u.n===1}));
    for(const u of z.units){const south=u.y>1000;const door=b(z,u.x-50,u.y,100,4,225,u.own?ink:wood,2);b(z,u.x+34,u.y+(south?-4:4),2,4,22,gold,100);text(z,u.id,`${u.rooms}房${u.own?' · R & Y 的家':''}`,u.x,u.y+(south?-4:5),250,160,46,south?0:Math.PI);target(z,'unit-'+u.id,u.own?'進入 B1-5F・你的家':`按 ${u.id} 門鈴`,u.x,u.y,130,{kind:'unit',unit:u.id,own:u.own},165);}
    elevator(z,1817,650,tower,1);elevator(z,1817,890,tower,2);
    seat(z,2880,660,76);plant(z,2930,955);
    b(z,2981,470,2,540,190,glass,45);for(let y=475;y<1010;y+=135)b(z,2978,y,8,3,220,metal,30);
    npc(z,tower==='B'?'chen':'yu',tower==='B'?'陳先生':'小雨',tower==='B'?'B3-5F 鄰居・包裹代收':'A5-5F 鄰居・社區活動',tower==='B'?2690:2580,tower==='B'?585:870,tower==='B'?'#8a9b83':'#b18e80');return z;
  }
  const hallA=hall('A'),hallB=hall('B');
  const lobby=room('lobby','一樓・雙棟共享大廳');lobby.spawn=[2400,1150,Math.PI];lobby.description='A／B 棟由本大廳連結。北側通往四項公設；兩側為各棟電梯，中央是秘書接待。';
  text(lobby,'暖木日常・共同生活','A + B / SHARED LOBBY',2400,315,266,360,47);
  for(const [x,name,sub,id]of [[1940,'健身房','FITNESS','gym'],[2230,'小圖書館','LIBRARY','library'],[2570,'琴房','PIANO','piano'],[2860,'鼓室','DRUMS','drums']])portal(lobby,x,320,name,sub,id);
  for(const [x,tower,side]of [[1818,'A','west'],[2980,'B','east']])for(const [i,y]of [[1,620],[2,845]])elevator(lobby,x,y,tower,i,side);
  b(lobby,2240,690,320,95,100,wood,0,2);b(lobby,2235,686,330,103,5,stone,100,1);obstacle(lobby,2235,686,330,103);text(lobby,'住戶服務','RESIDENT SERVICES',2400,795,64,240,50,0);
  npc(lobby,'secretary','小林秘書','社區服務・委託・包裹',2400,630,'#647b75');
  b(lobby,2510,710,35,40,29,mat('#b5a080',.85),105);text(lobby,'社區任務看板','接取委託・查看收藏',2700,530,160,220,90);target(lobby,'board','查看社區任務看板',2700,540,150,{kind:'board'},190);
  for(let row=0;row<3;row++)for(let col=0;col<4;col++){b(lobby,2860+col*24,1040,22,20,30,metal,35+row*34,.5);b(lobby,2866+col*24,1038,10,1,1,ink,52+row*34,.2);}obstacle(lobby,2860,1038,96,24);target(lobby,'mail','查看住戶信箱',2900,1033,110,{kind:'action',action:'lobby-mail',message:'住戶信箱已查看・今天也有新的鄰里消息'},170);
  seat(lobby,1900,1040,210);seat(lobby,2190,1120,185);b(lobby,2150,1010,100,65,5,stone,42);obstacle(lobby,2150,1010,100,65);plant(lobby,1900,940);plant(lobby,2790,1190);
  // Street glazing is on the ground floor; mullions and a low sill frame it.
  b(lobby,1830,1282,1120,3,225,glass,25);for(let x=1840;x<2980;x+=145)b(lobby,x,1278,4,9,250,metal,20);
  const gym=room('gym','一樓・健身房',1,[1800,300,1200,1000]);gym.description='和阿哲完成散步與單車節奏，替鄰里活動暖身。';
  portal(gym,2400,1280,'返回共用大廳','LOBBY','lobby',0);text(gym,'每天多動一點','FITNESS / TRAIN TOGETHER',2400,318,240,380,70);
  for(const [i,x]of [[0,1950],[1,2130]]){
    b(gym,x,460,100,205,15,dark,4,3);b(gym,x+8,480,84,160,1,mat('#52615b',.86),20,.2);const belt=[];for(let y=488;y<634;y+=18)belt.push({mesh:b(gym,x+10,y,80,1,.6,metal,21,.1),base:y});
    for(const xx of [x+5,x+90])rod([xx,485,22],[xx,495,130],2.5,metal,gym.scene);b(gym,x+5,480,90,20,4,dark,130);b(gym,x+28,482,45,15,2,ink,135);obstacle(gym,x,460,100,205);
    target(gym,'treadmill-'+i,'跑步機・散步節奏',x+50,655,118,{kind:'activity',activity:'gym-walk'},175);motions.push({zone:'gym',kind:'belt',parts:belt,until:0});
  }
  b(gym,2440,490,150,140,4,dark,1,2);const bike=new T.Group();bike.position.copy(W(2520,560,45));gym.scene.add(bike);const wheel=new T.Mesh(new T.CylinderGeometry(28,28,5,32),metal);wheel.rotation.z=Math.PI/2;wheel.position.set(0,0,-25);bike.add(wheel);rod([2500,520,20],[2515,570,90],3,metal,gym.scene);rod([2515,570,90],[2540,610,110],3,metal,gym.scene);b(gym,2504,565,24,28,5,dark,94);rod([2530,505,22],[2530,515,123],3,metal,gym.scene);b(gym,2513,507,38,5,3,dark,123);obstacle(gym,2440,490,150,140);target(gym,'cycle','飛輪單車・踩踏節奏',2515,640,115,{kind:'activity',activity:'gym-cycle'},180);motions.push({zone:'gym',kind:'bike',mesh:bike,until:0});
  b(gym,2815,410,110,265,145,wood,0);for(let y=430;y<650;y+=44)rod([2825,y,118],[2910,y,118],4,dark,gym.scene);obstacle(gym,2815,410,110,265);b(gym,1830,1185,330,40,55,wood);obstacle(gym,1830,1185,330,40);b(gym,1820,335,3,380,180,mat('#bccbc5',.16,{metalness:.7}),50);npc(gym,'trainer','阿哲','鄰居教練・一起動一動',2670,875,'#718b89');
  const library=room('library','一樓・小圖書館');library.description='挑一本書借閱，在閱讀桌歇歇，再將書交回林阿姨。';portal(library,2400,1280,'返回共用大廳','LOBBY','lobby',0);text(library,'留一點時間給閱讀','THE LITTLE LIBRARY',2400,318,240,400,65);
  const bookColors=['#819789','#b99b7e','#bfc3ac','#838d9f'];
  for(const x of [1890,2220,2550]){b(library,x,350,250,45,220,wood);for(const z of [8,52,96,140,184,218])b(library,x+4,345,242,52,3,wood,z);obstacle(library,x,345,250,52);
    const transforms=bookColors.map(()=>[]);for(let row=0;row<4;row++)for(let col=0;col<26;col++){const o=new T.Object3D();o.position.copy(W(x+10+col*9,370,29+row*44));o.scale.y=.85+(col%3)*.1;o.rotation.z=(col%9===0?.09:0);o.updateMatrix();transforms[(row+col)%4].push(o.matrix.clone());}
    transforms.forEach((data,i)=>{const batch=new T.InstancedMesh(new T.BoxGeometry(7,35,28),mat(bookColors[i],.88),data.length);data.forEach((m,n)=>batch.setMatrixAt(n,m));batch.castShadow=batch.receiveShadow=true;library.scene.add(batch);});}
  target(library,'books','挑選與借閱書籍',2340,410,135,{kind:'activity',activity:'library-borrow'},180);
  b(library,2180,690,300,115,5,wood,72);for(const x of [2190,2460])for(const y of [700,780])rod([x,y,0],[x,y,72],3,metal,library.scene);obstacle(library,2180,690,300,115);for(const x of [2210,2390])seat(library,x,850,75);
  b(library,2770,730,150,90,80,wood);obstacle(library,2770,730,150,90);target(library,'return-books','歸還借閱書籍',2810,830,100,{kind:'activity',activity:'library-return'},165);npc(library,'reader','林阿姨','閱讀志工・借還服務',2700,655,'#b79b85');plant(library,1900,1110);
  const piano=room('piano','一樓・琴房');piano.description='小晴準備了一段四音暖心旋律，跟著提示彈奏。';portal(piano,2400,1280,'返回共用大廳','LOBBY','lobby',0);text(piano,'把旋律留在日常','PIANO / A LITTLE REVERIE',2400,318,240,400,65);
  const pianoBody=mat('#414844',.24,{metalness:.12}),ivory=mat('#f0eadb',.42),keys=[];
  b(piano,2080,480,230,90,120,pianoBody,0,2);b(piano,2073,570,244,42,9,pianoBody,68,1);for(let i=0;i<22;i++){const key=b(piano,2080+i*10.4,574,10,35,3,ivory,77,.2);keys.push({mesh:key,base:key.position.y});if(![2,6].includes(i%7)&&i<21)b(piano,2087+i*10.4,573,5.6,20,4,dark,80,.2);}b(piano,2150,552,90,4,45,wood,100);b(piano,2140,530,115,20,2,wood,145);obstacle(piano,2073,480,244,132);seat(piano,2150,695,90);target(piano,'piano-keys','彈奏四音旋律',2210,645,102,{kind:'activity',activity:'piano-play'},180);motions.push({zone:'piano',kind:'keys',keys,until:0,note:0});npc(piano,'pianist','小晴','音樂鄰居・旋律練習',2575,715,'#a09aae');
  for(let i=0;i<10;i++)b(piano,1830+i*25,335,8,150,80,i%2?cloth:wood,130);seat(piano,2690,1040,180);plant(piano,1900,1120);
  const drums=room('drums','一樓・鼓室');drums.description='跟著阿澤完成四拍節奏，鼓皮、鈸片和鼓棒會回應敲擊。';portal(drums,2400,1280,'返回共用大廳','LOBBY','lobby',0);text(drums,'讓節奏慢慢發光','DRUM STUDIO / FIND YOUR GROOVE',2400,318,240,430,65);
  b(drums,2060,470,400,360,2,cloth,.2);const drumParts=[];
  function drum(x,y,z,r,h){const shell=new T.Mesh(new T.CylinderGeometry(r,r,h,28),mat('#8d7667',.6));shell.position.copy(W(x,y,z));drums.scene.add(shell);const skin=new T.Mesh(new T.CylinderGeometry(r+1,r+1,1.2,28),ivory);skin.position.copy(W(x,y,z+h/2+.5));drums.scene.add(skin);const rim=new T.Mesh(new T.TorusGeometry(r,1.2,8,32),metal);rim.rotation.x=Math.PI/2;rim.position.copy(skin.position);drums.scene.add(rim);drumParts.push({mesh:skin,base:skin.position.y});return shell;}
  const bass=new T.Mesh(new T.CylinderGeometry(42,42,58,32),mat('#8d7667',.6));bass.rotation.x=Math.PI/2;bass.position.copy(W(2250,625,45));drums.scene.add(bass);const bassHead=new T.Mesh(new T.CircleGeometry(42,32),ivory);bassHead.rotation.y=Math.PI;bassHead.position.copy(W(2250,654.5,45));drums.scene.add(bassHead);const bassRim=new T.Mesh(new T.TorusGeometry(42,1.4,8,40),metal);bassRim.position.copy(bassHead.position);drums.scene.add(bassRim);drumParts.push({mesh:bassHead,base:45});drum(2200,540,84,24,27);drum(2270,540,84,24,27);drum(2350,650,62,30,35);drum(2150,650,60,24,15);
  for(const [x,y,r]of [[2110,520,30],[2370,500,33],[2390,720,26]]){rod([x,y,0],[x,y,125],1.8,metal,drums.scene);for(let a=0;a<Math.PI*2;a+=Math.PI*2/3)rod([x,y,25],[x+Math.cos(a)*28,y+Math.sin(a)*28,2],1.3,metal,drums.scene);const cymbal=new T.Mesh(new T.ConeGeometry(r,3,32),gold);cymbal.position.copy(W(x,y,126));drums.scene.add(cymbal);drumParts.push({mesh:cymbal,base:126});}
  b(drums,2210,760,75,55,9,dark,46,3);obstacle(drums,2085,475,335,355);target(drums,'drum-kit','練習四拍鼓點',2250,865,106,{kind:'activity',activity:'drums-play'},190);motions.push({zone:'drums',kind:'drums',parts:drumParts,until:0,note:0});npc(drums,'drummer','阿澤','節奏鄰居・週末鼓手',2670,800,'#a58e74');
  for(let x=1840;x<2960;x+=95)b(drums,x,318,64,6,150,x%2?cloth:dark,85,2);
  // B3 resident parking includes the owner's correctly scaled Model Y.
  const parkingZone=room('parking','地下停車場・B3-31',-3,[1800,300,2400,1800]);parkingZone.spawn=[2040,1120,Math.PI/2];parkingZone.description='A／B 棟電梯共用的 B3 停車層。北側綠色標線為 R & Y 專屬 B3-31，沿黃色步行帶尋找車位。';
  const concrete=mat('#727b76',.88),paint=mat('#dfd6ac',.75),reserved=mat('#688c7b',.85),red=mat('#a57761',.7);parkingZone.scene.background.set('#39463f');
  b(parkingZone,1820,320,2360,1760,.3,concrete,.15,.1);
  const ownedSlot={id:'B3-31',number:31,owner:'R & Y',x:2370,y:350,w:250,d:520};
  const slots=[];for(const [row,y]of [[0,350],[1,1510]])for(let i=0;i<7;i++){const x=2110+i*260,number=30+i+row*7;slots.push({x,y,w:250,d:520,number});for(const xx of [x,x+248])b(parkingZone,xx,y,2,520,.5,number===31?reserved:paint,.55,.1);b(parkingZone,x,y,250,2,.5,paint,.55,.1);b(parkingZone,x+55,y+(row?460:35),140,15,10,dark,.5,2);const label=text(parkingZone,`B3-${number}`,number===31?'R & Y 專屬':'RESIDENT PARKING',x+125,y+275,.85,195,70);label.rotation.set(-Math.PI/2,0,Math.PI);}
  b(parkingZone,2373,353,244,514,.2,reserved,.4,.1);text(parkingZone,'B3-31・R & Y 專用','YOUR OWN PARKING SPACE',2495,318,180,255,85);
  for(const xx of [2110,3150,4160]){b(parkingZone,xx-18,820,36,70,280,wall);b(parkingZone,xx-19,819,38,72,70,reserved);obstacle(parkingZone,xx-18,820,36,70);b(parkingZone,xx-18,1450,36,70,280,wall);b(parkingZone,xx-19,1449,38,72,70,reserved);obstacle(parkingZone,xx-18,1450,36,70);b(parkingZone,xx-18,320,36,1760,30,concrete,250);}
  for(let x=2050;x<4050;x+=250)b(parkingZone,x,1135,140,3,.5,paint,.55,.1);
  for(let x=2150;x<2600;x+=55)b(parkingZone,x,970,30,100,.5,paint,.65,.1);
  for(const y of [985,1350])rod([1830,y,258],[4160,y,258],4,red,parkingZone.scene);
  for(let x=2200;x<4100;x+=480)b(parkingZone,x,1100,180,8,2,mat('#eef4e6',.35,{emissive:0xe1eed5,emissiveIntensity:.8}),246,.3);
  for(const [x,tower,side]of [[1818,'A','west'],[4180,'B','east']])for(const [i,y]of [[1,1020],[2,1260]])elevator(parkingZone,x,y,tower,i,side);
  text(parkingZone,'B3 地下停車場','A / B 雙棟電梯連通',3000,2080,170,320,80,0);
  function car(x,y,color){const body=mat(color,.3,{metalness:.28}),windows=mat('#526862',.18,{metalness:.35});b(parkingZone,x,y,180,414,67,body,34,8);b(parkingZone,x+17,y+115,146,188,56,windows,94,9);b(parkingZone,x+13,y+113,154,4,54,body,94,1);b(parkingZone,x+13,y+300,154,4,54,body,94,1);b(parkingZone,x+18,y+135,144,142,3,body,150,3);for(const xx of [x+4,x+174])for(const yy of [y+82,y+329]){const tire=new T.Mesh(new T.CylinderGeometry(30,30,11,24),dark);tire.rotation.z=Math.PI/2;tire.position.copy(W(xx,yy,34));parkingZone.scene.add(tire);const hub=new T.Mesh(new T.CylinderGeometry(19,19,11.5,20),metal);hub.rotation.copy(tire.rotation);hub.position.copy(tire.position);parkingZone.scene.add(hub);}for(const xx of [x+12,x+137])b(parkingZone,xx,y+412,31,2,13,mat('#e3dfc3',.35,{emissive:0x80784a,emissiveIntensity:.15}),67,1);obstacle(parkingZone,x,y,180,414);}
  car(2145,400,'#b9c0b6');car(2665,400,'#5d716c');car(3705,1560,'#c0b8a5');
  const ownedVehicle=B1_VEHICLES.createModelY();ownedVehicle.group.name='b3-31-tesla-model-y-juniper';ownedVehicle.group.position.copy(W(2495,610,0));ownedVehicle.group.rotation.y=Math.PI;parkingZone.scene.add(ownedVehicle.group);obstacle(parkingZone,2388.55,368.5,212.9,483);target(parkingZone,'parking-model-y','坐上 Tesla Model Y 煥新版',2350,740,110,{kind:'activity',activity:'owned-model-y'},165);
  const locator=mat('#c9e5aa',.4,{emissive:0x82d66f,emissiveIntensity:0}),locatorLamp=b(parkingZone,2485,335,20,12,8,locator,225,2);
  const lock=new T.Group();lock.name='b3-31-parking-lock';lock.position.copy(W(2495,855,7));parkingZone.scene.add(lock);const arm=new T.Mesh(new T.TorusGeometry(38,4,8,24,Math.PI),gold);arm.position.y=3;lock.add(arm);b(parkingZone,2447,842,96,25,7,dark,.4,2);
  const parking={...ownedSlot,vehicle:ownedVehicle,bar:lock,locator,state:{located:false,light:false,barDown:false},apply:s=>{parking.state={located:s?.located===true,light:s?.light===true,barDown:s?.barDown===true};locator.emissiveIntensity=parking.state.light?2:0;lock.rotation.x=parking.state.barDown?-Math.PI/2:0;}};
  const parkingStand=parkingZone.canStand;parkingZone.canStand=(x,y)=>parkingStand(x,y)&&(parking.state.barDown||!(x>2440&&x<2550&&y>830&&y<881));
  target(parkingZone,'parking-31','B3-31・我的專屬車位',2495,900,108,{kind:'activity',activity:'parking-space'},185);parkingZone.ownedSpace=ownedSlot;
  const activeUntil={};
  function pulse(kind,note=0){activeUntil[kind]=performance.now()+10000;for(const m of motions)if(m.kind===kind){m.until=performance.now()+250;m.note=note;}}
  function tick(zone,dt,now,px,py){for(const n of npcs)if(n.zone===zone){const d=Math.hypot(px-n.x,py-n.y);if(d<260){const goal=-Math.atan2(px-n.x,py-n.y);n.root.rotation.y+=Math.atan2(Math.sin(goal-n.root.rotation.y),Math.cos(goal-n.root.rotation.y))*Math.min(1,dt*3);}n.rig.update(dt,{wave:n.waveUntil>now});const goal=n.root.rotation.y;n.badge.rotation.y=goal+Math.PI;}
    for(const door of zones[zone]?.stairDoors||[])door.rotation.y+=((door.userData.goal||0)*1.25-door.rotation.y)*Math.min(1,dt*6);
    for(const e of elevators)if(e.zone===zone){e.open+=(e.goal-e.open)*Math.min(1,dt*7);e.left.position.z=e.leftZ+e.open*49;e.right.position.z=e.rightZ-e.open*49;}
    for(const m of motions)if(m.zone===zone){if(m.kind==='belt'&&(activeUntil.belt||0)>now)for(const p of m.parts)p.mesh.position.z=700-(488+(p.base-488+now*.04)%146);if(m.kind==='bike'&&(activeUntil.bike||0)>now)m.mesh.rotation.x+=dt*4;if(m.kind==='keys')m.keys.forEach((p,i)=>p.mesh.position.y=p.base-(m.until>now&&i===[0,2,4,7][m.note%4]?1.8:0));if(m.kind==='drums')m.parts.forEach((p,i)=>{p.mesh.position.y=p.base+(m.until>now&&i===m.note%m.parts.length?Math.sin(now*.07)*1.6:0);});}
  }
  window.B1_NEIGHBORHOOD={zones,npcs,elevators,parking,text,tick,pulse,topology:{towers:['A','B'],sharedLobbyFloor:1,homeFloor:5,parkingFloor:-3,ownedParkingSpace:'B3-31',unitsPerFloor:4,elevatorsPerTower:2,bedroomsPerFloor:[3,3,2,2]},reset:()=>{for(const e of elevators)e.goal=0;for(const m of motions)m.until=0;for(const k of Object.keys(activeUntil))delete activeUntil[k];parking.apply({});}};
})();
