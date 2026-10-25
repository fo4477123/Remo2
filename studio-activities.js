/* Reversible everyday activities, all in the same CAD coordinate system. */
(() => {
  'use strict';
  const {rounded,rod}=B1_MODELS,actors=[],effects=[],timed=new Map();
  const metal=mat('#a7afaa',.24,{metalness:.85}),waterMat=mat('#b9e4ed',.12,{transparent:true,opacity:.58}),warm=mat('#fff0bf',.5,{emissive:0xffc766,emissiveIntensity:0});
  const actor=(id,name,x,y,h,room,verbs,apply,seconds=0)=>{const a={id,name,x,y,h,room,range:145,verbs,on:false,p:0,apply,flag:on=>{if(seconds)timed.set(id,on?seconds:0);}};actors.push(a);return a;};
  const streams=[];
  function stream(id,name,x,y,top,bottom,room,shower=false){
    const g=new T.Group();g.name=id+'-water';scene.add(g);
    for(let i=0;i<(shower?9:1);i++){const angle=i*Math.PI*2/9,r=shower?5:0,m=new T.Mesh(new T.CylinderGeometry(shower?.18:.55,shower?.35:.8,top-bottom,6),waterMat);m.position.copy(W(x+Math.cos(angle)*r,y+Math.sin(angle)*r,(top+bottom)/2));g.add(m);}
    g.visible=false;streams.push(g);effects.push(g);
    actor(id,name,x,y,shower?120:100,room,['開啟'+name,'關閉'+name],p=>{g.visible=p>.01;g.scale.y=Math.max(.01,p);g.position.y=top*(1-p);},shower?60:45);
  }
  stream('bath-faucet','客衛水龍頭',788,465,94,80,'bath');stream('ensuite-faucet','主衛水龍頭',254,778,94,80,'ensuite');
  stream('bath-shower','客衛花灑',1020,452,205,5,'bath',true);stream('ensuite-shower','主衛花灑',367,943,205,5,'ensuite',true);
  const flushes=[];
  for(const [id,name,x,y,room]of [['bath-flush','客衛沖水',805,339,'bath'],['ensuite-flush','主衛沖水',279,858,'ensuite']]){
    const g=new T.Group();g.position.copy(W(x,y,29));g.name=id+'-swirl';scene.add(g);const ring=new T.Mesh(new T.TorusGeometry(9,.7,6,40,.0+Math.PI*1.75),waterMat);ring.rotation.x=-Math.PI/2;ring.scale.set(1.4,1,1);g.add(ring);g.visible=false;effects.push(g);flushes.push(g);
    actor(id,name,x,y,67,room,['按下沖水','停止沖水'],p=>{g.visible=p>.01;},5);
  }
  const flames=new T.Group();flames.name='cooktop-flames';scene.add(flames);const flameMat=mat('#589ed6',.35,{emissive:0x247cfa,emissiveIntensity:1.5});
  for(const x of [270,300])for(let i=0;i<12;i++){const a=i*Math.PI/6,m=new T.Mesh(new T.ConeGeometry(.65,3.8,5),flameMat);m.position.copy(W(x+Math.cos(a)*7,700.5+Math.sin(a)*7,93));flames.add(m);}flames.visible=false;effects.push(flames);
  actor('cooktop','雙口爐示範',284,691,95,'kitchen',['開啟爐火示範','關閉爐火'],p=>{flames.visible=p>.01;},60);
  const fan=new T.Group();fan.name='range-hood-fan';fan.position.copy(W(281,720,186));scene.add(fan);for(let i=0;i<3;i++){const b=rounded(276,706,10,20,.6,metal,186,scene,.5);fan.attach(b);b.rotation.y=i*Math.PI*2/3;}
  const hoodLed=rounded(264,714,22,1.5,.6,warm.clone(),185.3,scene,.2);
  const hood=actor('range-hood','抽油煙機',282,717,180,'kitchen',['啟動抽油煙機','關閉抽油煙機'],p=>hoodLed.material.emissiveIntensity=p*1.8,90);
  const [ox,oy,oz]=APPLIANCE_LAYOUT.map(560,668.6,109),oven=rounded(ox,oy,42, .5,20,warm.clone(),oz,scene,.4);oven.visible=false;effects.push(oven);
  actor('oven','電器櫃烤箱',ox+20,oy,122,'kitchen',['啟動烤箱示範','關閉烤箱'],p=>{oven.visible=p>.01;oven.material.emissiveIntensity=p*1.3;},90);
  const lamps=[];
  for(const [id,name,x,y,room]of [['master-reading','主臥閱讀燈',447,864,'master'],['guest-reading','次臥閱讀燈',577,485,'guest']]){
    rounded(x-12,y-12,24,24,44,oak,0,scene,1.5);rod([x,y,46],[x,y,77],.8,metal);rounded(x-8,y-8,16,16,1.5,metal,45,scene,1);
    const shade=rounded(x-11,y-11,22,22,17,warm.clone(),72,scene,3),l=new T.PointLight('#ffdc9c',0,140,2);l.position.copy(W(x,y,76));scene.add(l);lamps.push(l);
    actor(id,name,x,y,77,room,['打開閱讀燈','關閉閱讀燈'],p=>{shade.material.emissiveIntensity=p*.8;l.intensity=p*1600;});
  }
  const rack=new T.Group();rack.name='lowering-drying-rack';scene.add(rack);for(const y of [435,475])rod([253,y,231],[362,y,231],1,metal,rack);for(const x of [262,285,308,331,354])rod([x,435,231],[x,475,231],.65,metal,rack);
  for(const [x,y]of [[253,435],[362,475]])rod([x,y,232],[x,y,274],.35,metal);
  actor('drying-rack','陽台晾衣桿',307,455,160,'laundry',['降下晾衣桿','升起晾衣桿'],p=>{rack.position.y=-p*58;});
  // A usable cabinet above the refrigerator, with shelves behind two doors.
  const upper=new T.Group();upper.name='fridge-overhead-storage';scene.add(upper);const x=FRIDGE_LAYOUT.x,y=669,z=187,w=FRIDGE_LAYOUT.width;
  for(const xx of [x,x+w-2])rounded(xx,y,2,60,KITCHEN_HEIGHT-z,oak,z,upper,.4);
  for(const zz of [z,z+28,KITCHEN_HEIGHT-2])rounded(x,y,w,60,2,oak,zz,upper,.4);rounded(x,y+58,w,2,KITCHEN_HEIGHT-z,cream,z,upper,.3);
  const upperItems=new T.Group();upperItems.name='fridge-stored-items';upper.add(upperItems);upperItems.visible=false;
  for(const xx of [x+7,x+39]){rounded(xx,y+11,24,30,19,linen,z+2,upperItems,1);rounded(xx+2,y+10.6,20,.5,3,metal,z+11,upperItems,.2);}
  const upperPivots=[];for(let i=0;i<2;i++){const g=new T.Group();g.position.copy(W(i?x+w:x,y,z));upper.add(g);const leaf=rounded(x+1+i*w/2,y-1,w/2-1.4,2,KITCHEN_HEIGHT-z-1,cream,z+.5,upper,.4);g.attach(leaf);const pull=rod([x+w/2+(i?3:-3),y-1.5,z+10],[x+w/2+(i?3:-3),y-1.5,z+26],.35,metal,upper);g.attach(pull);upperPivots.push(g);}
  const upperActor=actor('fridge-upper','冰箱上方收納櫃',x+w/2,y,207,'kitchen',['打開冰箱上櫃','關閉冰箱上櫃'],p=>{upperPivots.forEach((g,i)=>g.rotation.y=(i?1:-1)*p*Math.PI/2);});
  // Replace the solid bench block with a hollow carcass and an actual lift-up lid.
  for(const o of [...scene.children])if(o.userData.furnitureName==='60 cm 收納臥榻')o.visible=false;
  const bench=new T.Group();bench.name='lift-up-storage-bench';scene.add(bench);
  rounded(739,1000,200,60,3,oak,0,bench,.6);for(const xx of [739,837,936])rounded(xx,1000,3,60,34,oak,3,bench,.5);for(const yy of [1000,1057])rounded(739,yy,200,3,34,oak,3,bench,.5);
  const benchItems=new T.Group();benchItems.name='bench-stored-items';bench.add(benchItems);benchItems.visible=false;
  for(const xx of [750,850]){rounded(xx,1010,76,37,20,linen,4,benchItems,2);rounded(xx+24,1009,28,1,6,cream,13,benchItems,.5);}
  const lid=new T.Group();lid.position.copy(W(739,1058,37));bench.add(lid);for(const m of [rounded(739,1000,200,60,3,oak,34,bench,1),rounded(739,1000,200,60,7,linen,37,bench,2),rounded(755,1020,45,30,10,sage,44,bench,2)])lid.attach(m);
  for(const xx of [762,912])rod([xx,1057,34],[xx+12,1057,34],1,metal,bench);
  const benchActor=actor('bench-storage','多功能室上掀臥榻',837,1000,56,'media',['上掀臥榻收納','關閉臥榻掀蓋'],p=>{lid.rotation.x=-p*1.24;});
  const upperStore=actor('fridge-store','上櫃物品',x+w/2,y+8,216,'kitchen',['放入收納盒','取出收納盒'],p=>{upperItems.visible=p>.5;});upperStore.blocked=()=>!upperActor.on;upperStore.available=()=>upperActor.p>.9;upperStore.blockedMessage='請先打開冰箱上方收納櫃';upperStore.flag=()=>window.B1_GAME?.save();
  const benchStore=actor('bench-store','臥榻物品',837,1018,25,'media',['收好換季寢具','取出換季寢具'],p=>{benchItems.visible=p>.5;});benchStore.blocked=()=>!benchActor.on;benchStore.available=()=>benchActor.p>.9;benchStore.blockedMessage='請先掀開臥榻，再放入物品';benchStore.flag=()=>window.B1_GAME?.save();
  upperStore.guard=()=>upperActor.on;benchStore.guard=()=>benchActor.on;
  const standBefore=canStand;canStand=(x,y)=>standBefore(x,y)&&![[435,852],[565,473]].some(([a,b])=>x>a-12&&x<a+36&&y>b-12&&y<b+36);
  // Join the existing controls/state machine instead of maintaining a second save system.
  B1_LIFE.actors.push(...actors);const tickBefore=B1_LIFE.tick,resetBefore=B1_LIFE.reset;
  B1_LIFE.tick=(dt,now)=>{tickBefore(dt,now);for(const [id,left]of timed){if(left<=0)continue;const next=Math.max(0,left-dt);timed.set(id,next);if(next===0&&actors.find(a=>a.id===id)?.on)B1_GAME.toggle(id);}for(const g of flushes)if(g.visible)g.rotation.y+=dt*4;if(hood.on)fan.rotation.y+=dt*9;if(flames.visible)flames.scale.y=1+Math.sin(now*.015)*.09;};
  B1_LIFE.reset=()=>{resetBefore();timed.clear();fan.rotation.y=0;flushes.forEach(g=>g.rotation.y=0);};
  window.B1_ACTIVITIES={actors,effects,streams,flames,fan,oven,upper,upperPivots,bench,lid,lamps,upperItems,benchItems,timers:()=>Object.fromEntries(timed),serialize:()=>({upper:upperStore.on,bench:benchStore.on}),restore:s=>{for(const [a,on]of [[upperStore,s?.upper===true],[benchStore,s?.bench===true]]){a.on=on;a.p=on?1:0;a.apply(a.p);}},snapshot:()=>({count:actors.length,active:actors.filter(a=>a.on).map(a=>a.id),timers:Object.fromEntries(timed),benchAngle:lid.rotation.x,upperAngles:upperPivots.map(g=>g.rotation.y)})};
})();
