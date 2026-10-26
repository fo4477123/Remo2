/* Detail layer for the shared CAD-coordinate scene. All assets are local. */
(() => {
  const grainCanvas=document.createElement('canvas');grainCanvas.width=grainCanvas.height=512;
  const ctx=grainCanvas.getContext('2d');ctx.fillStyle='#cbbba5';ctx.fillRect(0,0,512,512);
  let seed=41;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
  for(let i=0;i<2300;i++){const x=rand()*512;ctx.strokeStyle=`rgba(${rand()>.4?'91,68,43':'255,245,221'},${.025+rand()*.10})`;ctx.lineWidth=.3+rand();ctx.beginPath();ctx.moveTo(x,0);for(let y=0;y<=512;y+=8)ctx.lineTo(x+Math.sin(y/110+i)*(.5+rand()*2),y);ctx.stroke();}
  const grain=new T.CanvasTexture(grainCanvas);grain.colorSpace=T.SRGBColorSpace;grain.wrapS=grain.wrapT=T.RepeatWrapping;grain.anisotropy=renderer.capabilities.getMaxAnisotropy();
  oak.map=grain;oak.bumpMap=grain;oak.bumpScale=.07;oak.color.set('#eee4d5');oak.roughness=.62;oak.needsUpdate=true;
  cream.color.set('#ede6da');cream.roughness=.93;
  linen.bumpMap=tex;linen.bumpScale=.12;linen.color.set('#f6efe3');linen.roughness=.98;
  floorGroup.children.forEach(m=>{if(m.material!==cream){m.material.map=grain;m.material.color.set('#e2d2bd');m.material.roughness=.66;m.material.needsUpdate=true;}});

  // A small bevel catches light on furniture edges instead of razor-sharp cubes.
  const rounded=new Map();
  scene.traverse(m=>{if(!m.isMesh||m.geometry.type!=='BoxGeometry'||m.parent===wallGroup||m.parent===floorGroup||m.parent===ceilingGroup)return;
    const {width:w,height:h,depth:d}=m.geometry.parameters;if(Math.min(w,h,d)<3)return;
    const r=Math.min(m.material===linen?5:.9,Math.min(w,h,d)/3),key=[w,h,d,r].join(',');
    if(!rounded.has(key)){const g=new T.BoxGeometry(w,h,d,4,4,4),p=g.attributes.position,n=new T.Vector3(),q=new T.Vector3();
      for(let i=0;i<p.count;i++){n.fromBufferAttribute(p,i);q.set(Math.max(-w/2+r,Math.min(w/2-r,n.x)),Math.max(-h/2+r,Math.min(h/2-r,n.y)),Math.max(-d/2+r,Math.min(d/2-r,n.z)));n.sub(q).normalize().multiplyScalar(r).add(q);p.setXYZ(i,n.x,n.y,n.z);}g.computeVertexNormals();rounded.set(key,g);}
    m.geometry=rounded.get(key);
  });

  // TV field stays one uninterrupted cream panel toward the planter.
  box(1253,732,1.5,263,ROOM_HEIGHT-27,cream,26);
  const lights=[],strips=[],warm=new T.MeshStandardMaterial({color:'#ffe0ad',emissive:'#ffcf91',emissiveIntensity:2});
  function strip(x,y,w,d,z){strips.push(box(x,y,w,d,1,warm,z));}
  function light(x,y,z,power,range){const l=new T.PointLight(0xffd9ad,power,range,2);l.position.copy(W(x,y,z));scene.add(l);lights.push([l,power]);}
  strip(1246,735,2,254,ROOM_HEIGHT-10);strip(1226,510,2,480,24);
  for(const y of [770,865,955]){light(1234,y,239,3800,230);light(1214,y,22,1500,155);}
  for(const z of [65,113,161,209]){strip(1225,678,2,48,z+2);light(1228,702,z+15,450,75);}
  for(const [x,y,w,d]of rooms){
    if(w<180)continue;
    box(x+8,y+8,w-16,7,7,cream,ROOM_HEIGHT-14);strip(x+10,y+10,w-20,2,ROOM_HEIGHT-6);
    light(x+w/2,y+35,ROOM_HEIGHT-20,6500,Math.max(w,d));
  }
  strip(915,525,54,2,212);light(942,546,205,800,100);
  strip(978,545,122,2,168);light(1040,548,155,1100,150);
  const illumination=document.createElement('label');illumination.textContent='氣氛燈 ';
  const dimmer=document.createElement('input');dimmer.type='range';dimmer.min=0;dimmer.max=100;dimmer.value=65;dimmer.setAttribute('aria-label','氣氛燈亮度');illumination.append(dimmer);document.querySelector('.toolbar').append(illumination);
  const updateLights=()=>{const value=Number(dimmer.value)/100;for(const [l,p]of lights)l.intensity=p*value;warm.emissiveIntensity=value*2.8;};dimmer.oninput=updateLights;updateLights();
  hemi.intensity=1.8;sun.intensity=2.4;renderer.toneMappingExposure=1;
  const night=document.querySelector('#night');night.addEventListener('change',()=>{hemi.intensity=night.checked?.65:1.8;sun.intensity=night.checked?.12:2.4;nightLights.forEach(l=>l.intensity=night.checked?8000:0);});

  // Actual door thresholds join the room rectangles used for navigation.
  const thresholds=[[614,665,115,90],[729,740,90,25],[829,500,80,65],[626,550,90,20],[239,548,145,20],[389,740,10,79]];
  for(const z of thresholds){rooms.push(z);box(...z,2,cream,-2,floorGroup);}
  // Door leaves are handled by the animated interaction layer, including their swing.
  stops.master=[640,840,-Math.PI/2];stops.living=[1100,700,.95];stops.entry=[970,620,Math.PI];
  camera.fov=65;camera.near=2;camera.updateProjectionMatrix();
  help.textContent='拖曳轉頭 · WASD 移動 · 右下角方向鍵 · 小地圖點選定位 · Esc 離開';
  document.querySelector('#reset').onclick=()=>{select(selected);if(walking){[walkX,walkY,walkYaw]=stops[selected];lookPitch=0;}};
  // View switching preserves the walk position when comparing with the plan.
  document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{const mode=b.dataset.mode;compare=mode==='compare';canvas.hidden=mode==='plan';svg.toggleAttribute('hidden',!(mode==='plan'||compare));renderPanel.hidden=true;renderPanel.style.display='none';view.classList.toggle('compare',compare);document.querySelectorAll('[data-mode]').forEach(x=>x.classList.toggle('active',x===b));if(mode==='render'){if(!walking){select('living');setTour(true);}}else if(mode==='3d'||mode==='plan')setTour(false);});
  const mini=svg.cloneNode(true);mini.id='tour-map';mini.removeAttribute('hidden');mini.setAttribute('aria-label','漫遊定位小地圖');mini.style.cssText='position:absolute;right:14px;top:14px;width:170px;height:140px;background:#f8f5ebe8;border:1px solid #c6b89e;border-radius:8px;cursor:crosshair;display:none';mini.querySelectorAll('text').forEach(t=>t.remove());view.append(mini);
  const miniVisitor=mini.querySelector('g:last-of-type');
  mini.onclick=e=>{const point=mini.createSVGPoint();point.x=e.clientX;point.y=e.clientY;const p=point.matrixTransform(mini.getScreenCTM().inverse());if(canStand(p.x,1100-p.y)){walkX=p.x;walkY=1100-p.y;}};
  const full=document.createElement('button');full.textContent='全螢幕參觀';full.onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await view.requestFullscreen();}catch{help.textContent='瀏覽器未允許全螢幕；仍可在目前視窗參觀。';}};document.querySelector('.toolbar').append(full);
  const detailStyle=document.createElement('style');detailStyle.textContent='#viewport:fullscreen{height:100vh;width:100vw;max-height:none;border-radius:0}.motion-pad{z-index:5}.motion-pad button{min-width:44px;min-height:44px}#tour-map text{display:none}.toolbar input[type=range]{width:90px}.tour-help{max-width:calc(100% - 210px)}@media(max-width:650px){#tour-map{width:120px!important;height:105px!important}.tour-help{max-width:calc(100% - 160px);font-size:10px}}';document.head.append(detailStyle);
  function hud(){mini.style.display=walking&&!compare&&!canvas.hidden?'block':'none';if(miniVisitor)miniVisitor.setAttribute('transform',`translate(${walkX} ${1100-walkY}) rotate(${walkYaw*180/Math.PI})`);requestAnimationFrame(hud);}hud();
  window.B1_REVIEW.canStand=canStand;window.B1_REVIEW.getTourState=()=>({walking,x:walkX,y:walkY,yaw:walkYaw,compare,lights:lights.length});
  configs.living.text='依參考圖調整淡橡木、奶油色連續電視立面、櫃底與展示層板暖光。可用滑鼠轉頭、WASD行走，或用小地圖換位置。';
  configs.entry.text='沿電視牆轉角看向大門，再接客衛隱藏門收納；右側室內動線延伸到主臥、多功能室、次臥與廚房。130 cm 工作檯與短收納立面保留原配置。';
  if(new URLSearchParams(location.search).has('realistic')){renderButton.click();}
  const finishScript=document.createElement('script');finishScript.src='studio-finishes.js?v=20261027-realpeople1';finishScript.onerror=()=>loadFailure('材質');document.head.append(finishScript);
})();
