/* Warm-home walkthrough: phone input, rendering budget, and design validation. */
(() => {
  const css=document.createElement('link');css.rel='stylesheet';css.href='studio-home.css?v=20261024';document.head.append(css);
  const mobile=matchMedia('(pointer:coarse)').matches||innerWidth<850;
  document.body.classList.add('home-ready');
  document.querySelector('.intro').textContent='青埔・五樓的暖木日常。洗白橡木、霧面奶油牆與柔和燈光，沿著真實尺寸走進每個房間。';
  document.querySelector('.edition').textContent='QINGPU / WARM HOME';
  const status=document.querySelector('.status');status.textContent='互動設計預覽｜青埔五樓情境。窗外為生成示意，非本戶實拍；窗台依你的指定為50／150 cm，窗頂與天花高度仍為假設。家具淨距及衛浴設備需現場複核。';
  const controls=document.createElement('details');controls.className='home-controls';
  const summary=document.createElement('summary');summary.textContent='燈光、家具與顯示設定';controls.append(summary);
  const toolbar=document.querySelector('.toolbar');toolbar.before(controls);controls.append(toolbar);
  const roomPicker=document.createElement('select');roomPicker.className='room-picker';roomPicker.setAttribute('aria-label','前往房間');
  document.querySelector('.workspace').insertBefore(roomPicker,controls);
  // Add a direct bathroom stop and keep all room choices available on small screens.
  configs.bath={target:[887,433],radius:420,yaw:.7,pitch:.7,title:'暖石色浴室',sub:'浴缸・陶瓷・霧面五金',text:'浴缸有實際內槽、馬桶與洗手台分別建立碰撞範圍。入口保持通行；設備尺寸為提案，未經現場放樣。'};
  configs.ensuite={target:[310,855],radius:370,yaw:.8,pitch:.7,title:'主臥衛浴',sub:'淋浴・馬桶・洗手台',text:'補上原圖第二間衛浴，淋浴區玻璃、排水槽及陶瓷設備；尺寸為設計示意。'};stops.ensuite=[339,825,Math.PI];
  stops.bath=[880,470,-2.92];stops.living=[1175,718,-.37];stops.master=[639,825,-.75];stops.media=[760,805,.88];stops.kitchen=[490,604,-.92];stops.laundry=[292,478,2.85];
  const bathButton=document.createElement('button');bathButton.dataset.room='bath';bathButton.textContent='09　浴室';bathButton.onclick=()=>{select('bath');if(walking){[walkX,walkY,walkYaw]=stops.bath;lookPitch=-.48;}};document.querySelector('.rooms').append(bathButton);
  const ensuiteButton=document.createElement('button');ensuiteButton.dataset.room='ensuite';ensuiteButton.textContent='10　主臥衛浴';ensuiteButton.onclick=()=>{select('ensuite');if(walking){[walkX,walkY,walkYaw]=stops.ensuite;lookPitch=-.35;}};document.querySelector('.rooms').append(ensuiteButton);
  for(const b of document.querySelectorAll('[data-room]')){const opt=document.createElement('option');opt.value=b.dataset.room;opt.textContent=b.textContent.replace('↗','').trim();roomPicker.append(opt);}
  roomPicker.value=selected;
  roomPicker.onchange=()=>{const b=document.querySelector(`[data-room="${roomPicker.value}"]`);b.click();};
  const walkPicker=roomPicker.cloneNode(true);walkPicker.className='walk-picker';walkPicker.setAttribute('aria-label','漫遊中切換房間');walkPicker.onchange=()=>{roomPicker.value=walkPicker.value;roomPicker.onchange();};view.append(walkPicker);
  const selectBefore=select;select=function(name){selectBefore(name);roomPicker.value=walkPicker.value=name;};
  configs.master.text='床頭靠左、150 × 188 cm雙人床向左微移17 cm，床尾至滑門面約66 cm；整牆衣櫥及浴室入口保留。這仍是偏緊的通道，須現場複核。';
  configs.living.text='77 吋電視置中於連續奶油色電視牆，尺寸約170.4 × 95.9 cm；兩側各保留約46 cm。洗白橡木SPC、亞麻與暖光維持溫馨氛圍，主要入口通道保持暢通。';
  configs.media.text='右側改為180 × 65 cm升降桌，配置雙螢幕工作區與Enjoy101網布人體工學椅；60 cm窗邊臥榻與桌端保留中央動線。窗台離地50 cm。';
  B1_REVIEW.clearances.masterBedToWardrobe=66;B1_REVIEW.clearances.sofaToTable=29;B1_REVIEW.clearances.tableToTV=55;B1_REVIEW.clearances.mediaDeskLength=180;B1_REVIEW.clearances.mediaDeskToBench=30;
  B1_REVIEW.windows=windowSpecs;

  // Geometry instancing reduces hundreds of floor draw calls to a handful.
  const buckets=new Map();
  for(const mesh of [...floorGroup.children]){
    const p=mesh.geometry.parameters;if(!p||p.height>=1)continue;
    if(!buckets.has(mesh.material))buckets.set(mesh.material,[]);buckets.get(mesh.material).push(mesh);
  }
  for(const [material,list]of buckets){
    const batch=new T.InstancedMesh(new T.BoxGeometry(1,1,1),material,list.length),transform=new T.Object3D();
    list.forEach((m,i)=>{const p=m.geometry.parameters;transform.position.copy(m.position);transform.scale.set(p.width,p.height,p.depth);transform.updateMatrix();batch.setMatrixAt(i,transform.matrix);floorGroup.remove(m);m.geometry.dispose();});
    batch.receiveShadow=true;batch.instanceMatrix.needsUpdate=true;floorGroup.add(batch);
  }
  // A floor-wide cloth texture repeated on a book or cushion made surfaces stripey.
  const cloth=tex.clone();cloth.repeat.set(1,1);cloth.needsUpdate=true;
  scene.traverse(m=>{if(m.isMesh&&m.material===linen){m.material.map=cloth;m.material.bumpMap=cloth;m.material.bumpScale=.045;}});
  glass.opacity=.12;glass.depthWrite=false;glass.roughness=.08;glass.needsUpdate=true;

  // Soft upholstery volume and seam piping, instead of squared mattress blocks.
  function softGeometry(w,h,d){const g=new T.SphereGeometry(1,32,20),p=g.attributes.position;for(let i=0;i<p.count;i++){const v=[p.getX(i),p.getY(i),p.getZ(i)];p.setXYZ(i,Math.sign(v[0])*Math.pow(Math.abs(v[0]),.35)*w/2,Math.sign(v[1])*Math.pow(Math.abs(v[1]),.48)*h/2,Math.sign(v[2])*Math.pow(Math.abs(v[2]),.35)*d/2);}g.computeVertexNormals();return g;}
  const seamMat=mat('#baae9c',.98);
  for(const m of [...scene.children]){
    if(!m.isMesh||!m.userData.furnitureName)continue;
    const p=m.geometry.parameters;if(!p?.width)continue;
    if((m.material===linen&&p.height>=12&&p.height<=25)||(/雙人床|客床/.test(m.userData.furnitureName)&&p.height===12)){
      m.geometry=softGeometry(p.width,p.height,p.depth);m.material=linen;
      const curve=[];for(let i=0;i<=80;i++){const t=i/80*Math.PI*2,c=Math.cos(t),s=Math.sin(t);curve.push(new T.Vector3(Math.sign(c)*Math.pow(Math.abs(c),.28)*(p.width/2-.8),-p.height*.1,Math.sign(s)*Math.pow(Math.abs(s),.28)*(p.depth/2-.8)));}
      const seam=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(curve),80,.16,4,false),seamMat);seam.position.copy(m.position);scene.add(seam);
    }
  }
  // A knitted bed runner drapes over the existing mattress, with folds at the foot.
  const throwMat=mat('#98a08c',.97);throwMat.map=cloth;throwMat.bumpMap=cloth;throwMat.bumpScale=.07;throwMat.side=T.DoubleSide;
  const throwGeo=new T.PlaneGeometry(66,149,28,48),tp=throwGeo.attributes.position;
  for(let i=0;i<tp.count;i++){const x=tp.getX(i),y=tp.getY(i);tp.setZ(i,Math.sin(y*.12+x*.08)*.8+Math.sin(y*.4)*.25);}throwGeo.computeVertexNormals();const runner=new T.Mesh(throwGeo,throwMat);runner.rotation.x=-Math.PI/2;runner.position.copy(W(558,965,49));runner.castShadow=runner.receiveShadow=true;scene.add(runner);
  // Brushed metal mixer and towel bar make the wet area read at human scale.
  box(941,498,45,2,2,chrome,112);box(952,497,24,1,35,linen,77);
  // Subtle ceramic tile joints on the bath wall and splashback.
  const joint=mat('#bab6ae',.95);
  for(let z=60;z<260;z+=60)box(770,300.2,273,.3,.13,joint,z);
  for(let x=829;x<1043;x+=60)box(x,300.2,.13,.3,260,joint);
  // Display pieces remain on the three short ledges above the TV.
  for(const [y,z,color]of [[806,191,'#a8b09a'],[860,203,'#cbb498'],[916,191,'#aebabc']]){
    const body=new T.Mesh(new T.SphereGeometry(1,20,16),mat(color,.5));body.scale.set(4.5,6,4.5);body.position.copy(W(1244,y,z+6));scene.add(body);
    const head=new T.Mesh(new T.SphereGeometry(3.6,20,16),body.material);head.position.copy(W(1244,y,z+14));scene.add(head);
  }

  // Warm cove light is static. Point-light shadow cubemaps are needlessly expensive
  // for a phone, so reserve shadows for sun/daylight and a short list of room lights.
  const points=[];scene.traverse(o=>{if(o.isPointLight)points.push(o);});
  const wanted=[[1234,865],[1040,548],[844,335],[559,775],[839,800],[579,335],[679,600],[790,820]];
  const retained=new Set();
  for(const [x,y]of wanted){let best=null,d=Infinity;for(const l of points){if(retained.has(l))continue;const v=l.position.distanceTo(W(x,y,235));if(v<d){d=v;best=l;}}if(best)retained.add(best);}
  for(const l of points){l.castShadow=false;if(!retained.has(l))l.removeFromParent();}
  const night=document.querySelector('#night');const ambience=()=>{hemi.intensity=night.checked?.3:1.05;hemi.groundColor.set('#8b8175');sun.intensity=night.checked?.08:2.1;renderer.toneMappingExposure=1.15;};night.addEventListener('change',ambience);ambience();
  let highQuality=!mobile;
  const quality=document.querySelector('select[aria-label="畫質"]');
  function setQuality(){highQuality=quality.value==='high';renderer.setPixelRatio(highQuality?Math.min(devicePixelRatio,1.75):Math.min(devicePixelRatio,1));scene.traverse(o=>{if(o.isSpotLight)o.castShadow=highQuality;});renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;}
  quality.value=mobile?'balanced':'high';quality.onchange=setQuality;setQuality();
  // Refresh static shadows when any geometry-changing UI is used.
  document.addEventListener('click',()=>{renderer.shadowMap.needsUpdate=true;});
  document.addEventListener('change',()=>{renderer.shadowMap.needsUpdate=true;});

  // Thumbstick and canvas use independent pointer captures for two-finger use.
  const stick=document.createElement('div');stick.id='walk-stick';stick.setAttribute('aria-label','按住並拖曳移動');stick.innerHTML='<span class="stick-label">移動</span><span class="stick-knob"></span>';view.append(stick);
  const knob=stick.querySelector('.stick-knob');let movePointer=null,lookPointer=null;
  function clearMovement(){movePointer=null;lookPointer=null;keys.clear();drag=null;knob.style.transform='translate(0,0)';}
  function moveStick(e){const r=stick.getBoundingClientRect(),dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2;const length=Math.hypot(dx,dy),limit=34;knob.style.transform=`translate(${dx/Math.max(1,length/limit)}px,${dy/Math.max(1,length/limit)}px)`;for(const k of ['w','a','s','d'])keys.delete(k);if(length>9){if(dy < -length*.38)keys.add('w');if(dy>length*.38)keys.add('s');if(dx < -length*.38)keys.add('a');if(dx>length*.38)keys.add('d');}}
  stick.onpointerdown=e=>{if(movePointer!==null)return;e.preventDefault();movePointer=e.pointerId;stick.setPointerCapture(e.pointerId);moveStick(e);};
  stick.onpointermove=e=>{if(e.pointerId===movePointer)moveStick(e);};
  stick.onpointerup=stick.onpointercancel=stick.onlostpointercapture=()=>{movePointer=null;for(const k of ['w','a','s','d'])keys.delete(k);knob.style.transform='translate(0,0)';};
  const oldDown=canvas.onpointerdown,oldMove=canvas.onpointermove,oldUp=canvas.onpointerup;
  canvas.onpointerdown=e=>{if(lookPointer!==null)return;lookPointer=e.pointerId;oldDown(e);};
  canvas.onpointermove=e=>{if(document.pointerLockElement===canvas||e.pointerId===lookPointer)oldMove(e);};
  canvas.onpointerup=canvas.onpointercancel=canvas.onlostpointercapture=e=>{if(e.pointerId===lookPointer){lookPointer=null;oldUp(e);}};
  window.addEventListener('blur',clearMovement);document.addEventListener('visibilitychange',()=>{if(document.hidden)clearMovement();});
  const tourBefore=setTour;setTour=function(enabled){clearMovement();tourBefore(enabled);if(enabled)lookPitch=selected==='bath'?-.48:-.22;document.body.classList.toggle('is-walking',enabled);renderer.shadowMap.needsUpdate=true;};
  B1_REVIEW.setTour=setTour;
  document.body.classList.toggle('is-walking',walking);
  help.textContent=mobile?'左下移動・右側拖曳轉頭・上方切換房間':'WASD 移動・拖曳轉頭・上方選擇房間';
  const immersive=document.createElement('button');immersive.className='immersive-button';immersive.textContent='沉浸參觀';
  immersive.onclick=()=>{const on=!view.classList.contains('immersive');view.classList.toggle('immersive',on);document.body.classList.toggle('immersed',on);immersive.textContent=on?'結束全畫面':'沉浸參觀';if(on&&!walking){select('living');renderButton.click();}};view.append(immersive);
  const capture=document.createElement('button');capture.textContent='儲存 3D 視角';capture.title='將目前即時渲染儲存為 PNG';capture.onclick=()=>{const link=document.createElement('a');link.download=`B1-${selected}-3d-render.png`;link.href=canvas.toDataURL('image/png');link.click();};document.querySelector('.toolbar').append(capture);
  // Phone-friendly plus/minus for orbit zoom, where wheel input is unavailable.
  const zoom=document.createElement('div');zoom.className='orbit-zoom';
  for(const [label,factor]of [['＋',.82],['−',1.22]]){const b=document.createElement('button');b.textContent=label;b.setAttribute('aria-label',factor<1?'拉近':'拉遠');b.onclick=()=>radius=Math.max(200,Math.min(2800,radius*factor));zoom.append(b);}view.append(zoom);
  // Keep plan-only mode from continuing a walk offscreen.
  document.querySelector('[data-mode="plan"]').addEventListener('click',clearMovement);

  // A chair is a physical obstacle as well as a visible object.
  const previousStand=canStand;canStand=(x,y)=>{
    if(x>800&&x<875&&y>846&&y<920)return false;
    if(doorOpen&&distanceToSegment(x,y,[829,475],[829,555])<14)return false;
    return previousStand(x,y);
  };B1_REVIEW.canStand=canStand;
  // Every jump target must be on free floor; pick the nearest free candidate if needed.
  for(const name of Object.keys(stops)){const p=stops[name];if(canStand(p[0],p[1]))continue;let found=null;for(let r=10;r<100&&!found;r+=10)for(let a=0;a<Math.PI*2;a+=Math.PI/8){const x=p[0]+Math.cos(a)*r,y=p[1]+Math.sin(a)*r;if(canStand(x,y)){found=[x,y,p[2]];break;}}if(found)stops[name]=found;}
  for(const b of document.querySelectorAll('[data-room]'))b.addEventListener('click',()=>{if(walking)lookPitch=b.dataset.room==='bath'?-.48:-.22;});
  if(walking){[walkX,walkY,walkYaw]=stops[selected]||stops.living;lookPitch=-.22;}
  else if(mobile&&!location.hash&&!location.search){renderButton.click();}
  select(selected);
  B1_REVIEW.audit=()=>({windows:windowSpecs,roomStops:Object.fromEntries(Object.entries(stops).map(([n,p])=>[n,{x:p[0],y:p[1],free:canStand(p[0],p[1])}])),finite:scene.children.every(o=>[o.position.x,o.position.y,o.position.z].every(Number.isFinite)),calls:B1_REVIEW.sceneCalls||renderer.info.render.calls,triangles:B1_REVIEW.sceneTriangles||renderer.info.render.triangles,pointLights:retained.size,pixelRatio:renderer.getPixelRatio(),wallElevations:wallGroup.children.every(m=>Math.abs(m.position.y-m.userData.fullHeightY*m.scale.y)<.01)});
  const renderScript=document.createElement('script');renderScript.src='studio-render.js?v=20261024-home';renderScript.onload=()=>{B1_REVIEW.ready=true;loading.remove();};renderScript.onerror=()=>{B1_REVIEW.ready=true;loading.remove();};document.head.append(renderScript);
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();clearMovement();loading.textContent='圖形記憶體暫時不足，請重新載入頁面。';view.append(loading);});
})();
