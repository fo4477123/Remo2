/* Visible household interactions; no network or audio is required. */
(() => {
  'use strict';
  const actors=[],curtains=window.B1_CURTAINS||[],zones=[];
  const point=(x,y,h)=>({x,y,h});
  const pivot=(mesh,x,y)=>{const g=new T.Group();g.position.copy(W(x,y));scene.add(g);g.attach(mesh);return g;};

  for(const c of curtains){
    const closedWidth=c.width/2+7,scale=closedWidth/38;
    const a={id:`curtain-${c.id}`,name:`${{living:'客廳',master:'主臥',media:'多功能室'}[c.id]}窗簾`,...point(c.x+c.width/2,c.y-8,145),range:170,on:false,p:0,verbs:['拉上窗簾','打開窗簾'],room:c.id,
      apply:p=>{c.panels.forEach((m,i)=>{m.scale.x=1+(scale-1)*p;const closedX=c.x+(i?.75:.25)*c.width-750;m.position.x=c.openX[i]+(closedX-c.openX[i])*p;});c.closed=p;applyDaylight();}};
    actors.push(a);
  }
  const daylight=[];scene.traverse(o=>{if(o.isSpotLight)daylight.push(o);});
  function applyDaylight(){for(const l of daylight){const x=l.position.x+750;const c=curtains.find(c=>x>=c.x-40&&x<=c.x+c.width+40);l.intensity=document.querySelector('#night').checked?0:35000*(1-(c?.closed||0)*.85);}}

  const fridgePivots=[pivot(fridgeDoors[0],...FRIDGE_LAYOUT.map(474.6,667.4).slice(0,2)),pivot(fridgeDoors[1],...FRIDGE_LAYOUT.map(545,667.4).slice(0,2))];
  const fridgeLight=new T.PointLight('#d8ebff',0,100,2);fridgeLight.position.copy(W(...FRIDGE_LAYOUT.map(510,682,151)));scene.add(fridgeLight);
  actors.push({id:'fridge',name:'Panasonic 冰箱',...point(...FRIDGE_LAYOUT.map(510,666,136)),range:125,on:false,p:0,room:'kitchen',verbs:['打開冰箱','關閉冰箱'],leaves:[{leaf:fridgePivots[0],span:28.5},{leaf:fridgePivots[1],span:-41}],apply:p=>{fridgePivots[0].rotation.y=-p*Math.PI*.48;fridgePivots[1].rotation.y=p*Math.PI*.48;fridgeLight.intensity=p*260;}});

  const drumCanvas=document.createElement('canvas');drumCanvas.width=drumCanvas.height=128;const dc=drumCanvas.getContext('2d');dc.fillStyle='#1c252a';dc.fillRect(0,0,128,128);
  for(let i=0;i<3;i++){dc.save();dc.translate(64,64);dc.rotate(i*Math.PI*2/3);dc.fillStyle='#80918c';dc.beginPath();dc.ellipse(0,30,17,30,.3,0,Math.PI*2);dc.fill();dc.restore();}
  dc.strokeStyle='#a2afac';dc.lineWidth=3;dc.beginPath();dc.arc(64,64,57,0,Math.PI*2);dc.stroke();
  const drumTexture=new T.CanvasTexture(drumCanvas);drumTexture.colorSpace=T.SRGBColorSpace;
  const drum=new T.Mesh(new T.CircleGeometry(18,48),new T.MeshBasicMaterial({map:drumTexture}));drum.rotation.y=Math.PI;drum.position.set(0,47,-33.4);B1_WASHER.add(drum);
  const washerLed=box(337,385.8,9,1,3,mat('#9fb7b3',.4,{emissive:0x64ccb3,emissiveIntensity:0}),85.5);
  let washSeconds=0;
  const washer={id:'washer',name:'LG 洗衣機',...point(347.5,386,65),range:120,on:false,p:0,room:'laundry',verbs:['啟動洗衣示範','停止洗衣示範'],apply:p=>{washerLed.material.emissiveIntensity=p*1.5;},flag:on=>{washSeconds=on?45:0;}};actors.push(washer);

  const waterMaterial=new T.MeshStandardMaterial({color:'#bcdeec',transparent:true,opacity:.65,roughness:.08,metalness:.05});
  const water=new T.Mesh(new T.CylinderGeometry(.65,1.15,29,12),waterMaterial);water.position.copy(W(...KITCHEN_LAYOUT.map(421,699,99)));water.visible=false;scene.add(water);
  let waterSeconds=0;
  const faucet={id:'faucet',name:'廚房水龍頭',...point(...KITCHEN_LAYOUT.map(421,699,109)),range:125,on:false,p:0,room:'kitchen',verbs:['打開水龍頭','關閉水龍頭'],apply:p=>{water.visible=p>.01;water.scale.y=Math.max(.01,p);water.position.y=113.5-14.5*p;},flag:on=>{waterSeconds=on?90:0;}};actors.push(faucet);

  const specs=[
    {id:'living',name:'客廳燈光',x:1246,y:736,bounds:[959,520,300,482]},
    {id:'master',name:'主臥燈光',x:402,y:819,bounds:[399,740,320,327]},
    {id:'media',name:'多功能室燈光',x:732,y:797,bounds:[729,765,220,302]}
  ];
  for(const s of specs){
    const indicator=mat('#e5e7dc',.5,{emissive:0x8dbd8c,emissiveIntensity:.35});
    const plate=box(s.x,s.y-4,1.2,8,12,cream,108);plate.name=`switch-${s.id}`;box(s.x-.2,s.y-2,1.5,4,6,indicator,111);
    const lamps=[];scene.traverse(l=>{if(!l.isPointLight||l===fridgeLight)return;const x=l.position.x+750,y=700-l.position.z,[a,b,w,d]=s.bounds;if(x>=a&&x<=a+w&&y>=b&&y<=b+d)lamps.push({light:l,power:l.intensity});});
    const z={...s,lamps,indicator,on:true};zones.push(z);
    actors.push({id:`light-${s.id}`,name:s.name,...point(s.x,s.y,117),range:135,on:true,p:1,initial:true,room:s.id,verbs:['開啟分區燈光','關閉分區燈光'],apply:p=>{z.on=p>.5;for(const {light,power}of z.lamps)light.intensity=power*p;indicator.emissiveIntensity=.35*p;indicator.color.set(p>.5?'#d8e6c8':'#767b73');}});
  }
  function refreshLighting(){for(const z of zones){for(const l of z.lamps)if(l.light.intensity>0||z.on)l.power=l.light.intensity;if(!z.on)for(const l of z.lamps)l.light.intensity=0;}applyDaylight();}
  document.querySelector('input[aria-label="氣氛燈亮度"]')?.addEventListener('input',refreshLighting);
  document.querySelector('#night').addEventListener('change',refreshLighting);
  function tick(dt,now){
    if(washer.on&&washer.p>.1){washSeconds=Math.max(0,washSeconds-dt);drum.rotation.z+=dt*2.8;washerLed.material.emissiveIntensity=.7+Math.sin(now*.004)*.3;if(!washSeconds)window.B1_GAME?.toggle('washer',{stayHere:true});}
    if(faucet.on){waterSeconds=Math.max(0,waterSeconds-dt);water.scale.x=.95+Math.sin(now*.02)*.06;if(!waterSeconds)window.B1_GAME?.toggle('faucet',{stayHere:true});}
  }
  window.B1_LIFE={actors,tick,refreshLighting,curtains,zones,fridgePivots,drum,water,fridgeLight,
    reset:()=>{washSeconds=waterSeconds=0;drum.rotation.z=0;},
    snapshot:()=>({washerSeconds:Math.ceil(washSeconds),waterSeconds:Math.ceil(waterSeconds),drumAngle:drum.rotation.z,waterVisible:water.visible,fridgeLight:fridgeLight.intensity,curtains:Object.fromEntries(curtains.map(c=>[c.id,c.closed||0])),lighting:Object.fromEntries(zones.map(z=>[z.id,{on:z.on,lamps:z.lamps.map(l=>l.light.intensity)}]))})};
  applyDaylight();
})();
