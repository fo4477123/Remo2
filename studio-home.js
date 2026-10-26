/* Warm-home walkthrough: phone input, rendering budget, and design validation. */
(() => {
  const css=document.createElement('link');css.rel='stylesheet';css.href='studio-home.css?v=20261025-gpu1';document.head.append(css);
  const mobile=matchMedia('(pointer:coarse)').matches||innerWidth<850;
  document.body.classList.add('home-ready');
  // Full-height walls and real windows are the default; cutaway is opt-in.
  const wallToggle=document.querySelector('#walls');wallToggle.checked=false;wallToggle.dispatchEvent(new Event('change'));
  document.querySelector('.intro').textContent='青埔八街與九街路口・五樓的暖木日常。客廳朝高鐵桃園站，後側為青松街。拉開窗簾，沿著生活動線探索每個房間。';
  document.querySelector('.edition').textContent=B1_ENGINE.webgpu?'WebGPU / WARM HOME':'WebGL2 / WARM HOME';
  const status=document.querySelector('.status');status.textContent='互動設計預覽｜青埔八街 × 青埔九街，客廳朝高鐵桃園站，後側青松街；窗外為依方向製作的區域情境。窗台50／150 cm，家具淨距與完成面尺寸須現場複核。';
  const controls=document.createElement('details');controls.className='home-controls';
  const summary=document.createElement('summary');summary.textContent='燈光、家具與顯示設定';controls.append(summary);
  const toolbar=document.querySelector('.toolbar');toolbar.before(controls);controls.append(toolbar);
  const roomPicker=document.createElement('select');roomPicker.className='room-picker';roomPicker.setAttribute('aria-label','前往房間');
  document.querySelector('.workspace').insertBefore(roomPicker,controls);
  // Add a direct bathroom stop and keep all room choices available on small screens.
  configs.bath={target:[887,433],radius:420,yaw:.7,pitch:.7,title:'客用四件式衛浴',sub:'洗手台・馬桶・方形浴缸・乾濕分離',text:'洗手台與馬桶已交換：上左為馬桶、下左為洗手台，兩者都朝向房間中央；右上保留 110 × 100 cm 方形浴缸，右下為獨立淋浴區。玻璃線沿 I-BATH 分隔，尺寸仍須現場放樣複核。'};
  configs.ensuite={target:[310,855],radius:310,yaw:-1.9,pitch:.85,title:'主臥衛浴',sub:'洗手台・馬桶・淋浴・高窗',text:'入口側為洗手台、淋浴前為馬桶；馬桶已轉向側牆。左側外牆補上與次臥同比例的 150 cm 窗台高窗，並重建窗洞下牆、過梁、窗框與玻璃；保留末端乾濕分離淋浴區。尺寸為設計示意。'};stops.ensuite=[339,825,Math.PI];
  stops.entry=[1140,670,-2.35];stops.bath=[880,470,-2.92];stops.living=[1175,718,-.37];stops.master=[639,825,-.75];stops.media=[760,805,.88];stops.kitchen=[490,604,-.92];stops.laundry=[292,478,2.85];
  const bathButton=document.createElement('button');bathButton.dataset.room='bath';bathButton.textContent='09　浴室';bathButton.onclick=()=>{select('bath');if(walking){[walkX,walkY,walkYaw]=stops.bath;lookPitch=-.48;}};document.querySelector('.rooms').append(bathButton);
  const ensuiteButton=document.createElement('button');ensuiteButton.dataset.room='ensuite';ensuiteButton.textContent='10　主臥衛浴';ensuiteButton.onclick=()=>{select('ensuite');if(walking){[walkX,walkY,walkYaw]=stops.ensuite;lookPitch=-.35;}};document.querySelector('.rooms').append(ensuiteButton);
  for(const b of document.querySelectorAll('[data-room]')){const opt=document.createElement('option');opt.value=b.dataset.room;opt.textContent=b.textContent.replace('↗','').trim();roomPicker.append(opt);}
  roomPicker.value=selected;
  roomPicker.onchange=()=>{const b=document.querySelector(`[data-room="${roomPicker.value}"]`);b.click();};
  const walkPicker=roomPicker.cloneNode(true);walkPicker.className='walk-picker';walkPicker.setAttribute('aria-label','漫遊中切換房間');walkPicker.onchange=()=>{roomPicker.value=walkPicker.value;roomPicker.onchange();};view.append(walkPicker);
  const selectBefore=select;select=function(name){selectBefore(name);roomPicker.value=walkPicker.value=name;};
  configs.kitchen.sub='245 cm / Panasonic NR-D505XGS-W';
  configs.master.text='床頭靠左、150 × 188 cm雙人床向左微移17 cm，床尾至滑門面約66 cm；衣櫥由275 cm減少20 cm，改為255 cm，入口端位置保留、靠窗端縮短。這仍是偏緊的通道，須現場複核。';
  configs.living.text='77 吋電視置中於連續奶油色電視牆，搭配暖嶼伴木沙發與島語淺橡木升降收納茶几；暖木、織品與暖光統一成安靜的暖日式質感，花台端不放植栽，入口通道保持留白。';
  configs.media.text='160 × 65 cm升降桌移到對面實牆，搭配高階網布人體工學椅與雙螢幕工作區；窗邊維持臥榻與採光，不再讓螢幕面對窗戶。';
  B1_REVIEW.clearances.masterBedToWardrobe=66;B1_REVIEW.clearances.sofaToTable=37;B1_REVIEW.clearances.tableToTV=51;B1_REVIEW.clearances.mediaDeskLength=160;B1_REVIEW.clearances.mediaDeskToBench=50;
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
  box(1016,496,22,2,2,chrome,112);box(1031,468,1,24,35,linen,77);
  // Subtle ceramic tile joints on the bath wall and splashback.
  const joint=mat('#bab6ae',.95);
  for(let z=60;z<ROOM_HEIGHT;z+=60)box(770,300.2,273,.3,.13,joint,z);
  for(let x=829;x<1043;x+=60)box(x,300.2,.13,.3,ROOM_HEIGHT,joint);
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
  const night=document.querySelector('#night');const ambience=()=>{hemi.intensity=night.checked?.3:1.05;hemi.groundColor.set('#8b8175');sun.intensity=night.checked?.08:2.1;renderer.toneMappingExposure=1.2;};night.addEventListener('change',ambience);ambience();
  let quality=document.querySelector('select[aria-label="畫質"]');
  if(!quality){quality=document.createElement('select');quality.setAttribute('aria-label','畫質');}
  // Upgrade the earlier two-option selector too, so auto/low are real choices.
  quality.replaceChildren();for(const [value,text]of [['auto','自動省電'],['low','整合顯示卡'],['balanced','平衡'],['high','畫質優先']]){const option=document.createElement('option');option.value=value;option.textContent=text;quality.append(option);}
  if(!quality.parentElement?.classList.contains('gpu-quality-control')){const label=document.createElement('label');label.className='gpu-quality-control';label.append(document.createTextNode('GPU 調校 '));quality.replaceWith(label);label.append(quality);document.querySelector('.toolbar').append(label);}
  const automaticQuality=mobile||!B1_ENGINE.webgpu||B1_ENGINE.gpuProfile.tier==='integrated'?'low':'high';
  function setQuality(){const selected=quality.value,effective=selected==='auto'?automaticQuality:selected;B1_ENGINE.quality=effective;const ratio=effective==='high'?Math.min(devicePixelRatio,1.5):effective==='low'?Math.min(devicePixelRatio,.82):Math.min(devicePixelRatio,1);renderer.setPixelRatio(ratio);scene.traverse(o=>{if(o.isSpotLight)o.castShadow=effective==='high';});renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;const name=effective==='low'?'整合 GPU 省電':effective==='balanced'?'平衡畫質':'畫質優先';B1_ENGINE.status.textContent=`${B1_ENGINE.webgpu?'WebGPU':'WebGL2'} · ${name}`;B1_ENGINE.status.title=B1_ENGINE.webgpu?`WebGPU ${B1_ENGINE.gpuProfile.tier==='integrated'?'整合 GPU':''}；目前畫質設定：${name}`:B1_ENGINE.reason;quality.title=`自動建議：${automaticQuality==='low'?'整合顯示卡省電':'畫質優先'}；可手動調整`}
  try{quality.value=localStorage.getItem('b1-gpu-quality-v1')||'auto';}catch{quality.value='auto';}if(!['auto','low','balanced','high'].includes(quality.value))quality.value='auto';quality.onchange=()=>{setQuality();try{localStorage.setItem('b1-gpu-quality-v1',quality.value);}catch{}};setQuality();
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
  const tourBefore=setTour;setTour=function(enabled){clearMovement();tourBefore(enabled);if(enabled)lookPitch=selected==='bath'?-.48:-.22;else{wallToggle.checked=false;wallToggle.dispatchEvent(new Event('change'));}document.body.classList.toggle('is-walking',enabled);renderer.shadowMap.needsUpdate=true;};
  B1_REVIEW.setTour=setTour;
  document.body.classList.toggle('is-walking',walking);
  help.textContent=mobile?'左下移動・右側拖曳轉頭・上方切換房間':'WASD 移動・拖曳轉頭・上方選擇房間';
  const immersive=document.createElement('button');immersive.className='immersive-button';immersive.textContent='沉浸參觀';
  immersive.onclick=()=>{const on=!view.classList.contains('immersive');view.classList.toggle('immersive',on);document.body.classList.toggle('immersed',on);immersive.textContent=on?'結束全畫面':'沉浸參觀';if(on&&!walking){select('living');renderButton.click();}};view.append(immersive);
  const capture=document.createElement('button');capture.id='capture-view';capture.textContent='儲存 3D 視角';capture.title='將目前即時渲染儲存為 PNG';capture.onclick=()=>{renderer.render(scene,camera);const link=document.createElement('a');link.download=`B1-${selected}-3d-render.png`;link.href=canvas.toDataURL('image/png');link.click();};document.querySelector('.toolbar').append(capture);
  // Curated photoreal render gallery: these are high-detail design views, while
  // the canvas above remains the measured interactive model.
  const premiumRenders={living:['客廳','renders/living-premium.png'],entry:['客廳全景（電視牆・大門・客衛隱藏門櫃）','renders/hidden-door-premium.png?v=20261025-gpu1'],kitchen:['餐廚','renders/kitchen-premium.png?v=20261024-layout5'],master:['主臥','renders/master-premium.png?v=20261024-layout2'],media:['多功能室','renders/media-premium.png?v=20261024-layout2'],guest:['次臥','renders/guest-premium.png?v=20261024-layout2'],bath:['客用衛浴','renders/bath-premium.png?v=20261024-layout3'],ensuite:['主臥衛浴','renders/ensuite-premium.png?v=20261024-layout2'],laundry:['洗衣陽台','renders/laundry-premium.png?v=20261024-layout3']};
  const gallery=document.createElement('section');gallery.className='render-gallery';gallery.innerHTML='<div class="render-gallery__head"><div><p class="overline">PREMIUM RENDER COLLECTION</p><b>高級空間渲染</b></div><label>選擇空間 <select aria-label="選擇高級渲染空間"></select></label></div><figure><img alt="高級室內設計渲染"><figcaption></figcaption></figure>';
  const gallerySelect=gallery.querySelector('select'),galleryImage=gallery.querySelector('img'),galleryCaption=gallery.querySelector('figcaption');
  for(const [key,[label]] of Object.entries(premiumRenders)){const option=document.createElement('option');option.value=key;option.textContent=label;gallerySelect.append(option);}
  galleryImage.loading='lazy';galleryImage.decoding='async';
  const showPremiumRender=name=>{const key=name==='all'?'living':name,entry=premiumRenders[key];if(!entry){gallery.hidden=true;return;}gallery.hidden=false;gallerySelect.value=key;galleryImage.src=entry[1];galleryImage.alt=`${entry[0]}設計提案`;galleryCaption.textContent=`${entry[0]} · 材質與氣氛提案，配置以互動平面為準`;};
  gallerySelect.onchange=()=>{select(gallerySelect.value);document.querySelector('[data-mode="3d"]').click();gallery.scrollIntoView({behavior:'smooth',block:'nearest'});};
  const gallerySelectBefore=select;select=function(name){gallerySelectBefore(name);showPremiumRender(name);};showPremiumRender(selected);
  document.querySelector('.workspace').append(gallery);
  // Phone-friendly plus/minus for orbit zoom, where wheel input is unavailable.
  const zoom=document.createElement('div');zoom.className='orbit-zoom';
  for(const [label,factor]of [['＋',.82],['−',1.22]]){const b=document.createElement('button');b.textContent=label;b.setAttribute('aria-label',factor<1?'拉近':'拉遠');b.onclick=()=>radius=Math.max(200,Math.min(2800,radius*factor));zoom.append(b);}view.append(zoom);
  // Keep plan-only mode from continuing a walk offscreen.
  document.querySelector('[data-mode="plan"]').addEventListener('click',clearMovement);

  // The game layer owns interaction state, animation and dynamic collisions.
  // Every jump target must be on free floor; pick the nearest free candidate if needed.
  for(const name of Object.keys(stops)){const p=stops[name];if(canStand(p[0],p[1]))continue;let found=null;for(let r=10;r<100&&!found;r+=10)for(let a=0;a<Math.PI*2;a+=Math.PI/8){const x=p[0]+Math.cos(a)*r,y=p[1]+Math.sin(a)*r;if(canStand(x,y)){found=[x,y,p[2]];break;}}if(found)stops[name]=found;}
  for(const b of document.querySelectorAll('[data-room]'))b.addEventListener('click',()=>{if(walking)lookPitch=b.dataset.room==='bath'?-.48:-.22;});
  if(walking){[walkX,walkY,walkYaw]=stops[selected]||stops.living;lookPitch=-.22;}
  else if(mobile&&!location.hash&&!location.search){renderButton.click();}
  select(selected);
  B1_REVIEW.audit=()=>({roomHeight:ROOM_HEIGHT,kitchenHeight:KITCHEN_HEIGHT,windows:windowSpecs,roomStops:Object.fromEntries(Object.entries(stops).map(([n,p])=>[n,{x:p[0],y:p[1],free:canStand(p[0],p[1])}])),finite:scene.children.every(o=>[o.position.x,o.position.y,o.position.z].every(Number.isFinite)),calls:B1_REVIEW.sceneCalls||renderer.info.render.calls,triangles:B1_REVIEW.sceneTriangles||renderer.info.render.triangles,pointLights:retained.size,pixelRatio:renderer.getPixelRatio(),wallElevations:wallGroup.children.every(m=>Math.abs(m.position.y-m.userData.fullHeightY*m.scale.y)<.01)});
  const renderScript=document.createElement('script');renderScript.src='studio-render.js?v=20261026-a18focus1';
  const loadGame=()=>{
    const modules=['studio-models.js','studio-refine.js','studio-shell.js','studio-life.js','studio-activities.js','studio-characters.js','studio-vehicles.js','studio-neighborhood.js','studio-community-design.js','studio-city-layout.js','studio-urban.js','studio-a18.js','studio-city.js','studio-community.js','studio-transit.js','studio-player.js','studio-remake.js','studio-owned.js','studio-personal.js','studio-seamless.js','studio-sound.js','studio-islewhisper.js','studio-music.js','studio-furniture.js','studio-atmosphere.js','studio-game.js'];let index=0;
    const next=async()=>{if(index===modules.length){try{await B1_ENGINE.prepare();}catch(error){console.error(error);loadFailure('WebGPU');return;}B1_REVIEW.ready=true;document.querySelector('footer span:last-child').textContent='室內 280 cm／廚房 245 cm';if(B1_REVIEW.gameReady&&window.B1_COMMUNITY)loading.remove();else loadFailure('社區探索');return;}const s=document.createElement('script');s.src=modules[index++]+'?v=20261026-a18focus1';s.onload=next;s.onerror=()=>loadFailure('社區互動');document.head.append(s);};next();
  };
  renderScript.onload=loadGame;renderScript.onerror=loadGame;document.head.append(renderScript);
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();clearMovement();loading.textContent='圖形記憶體暫時不足，請重新載入頁面。';view.append(loading);});
})();
