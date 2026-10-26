/* Real-time material study: imagined whitewashed oak SPC, not a manufacturer scan. */
(() => {
  let state=731;const random=()=>{state=(1664525*state+1013904223)>>>0;return state/4294967296;};
  function texture(c,color=true){const t=new T.CanvasTexture(c);t.colorSpace=color?T.SRGBColorSpace:T.NoColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=renderer.capabilities.getMaxAnisotropy();return t;}
  const boards=[];
  // Quiet cabinet grain: the previous high-contrast texture read as coarse stripes.
  const cabinet=document.createElement('canvas');cabinet.width=cabinet.height=512;const cc=cabinet.getContext('2d');cc.fillStyle='#d6c6af';cc.fillRect(0,0,512,512);
  for(let i=0;i<1700;i++){const x=random()*512;cc.strokeStyle=`rgba(113,91,65,${.015+random()*.035})`;cc.lineWidth=.3+random()*.5;cc.beginPath();cc.moveTo(x,0);for(let y=0;y<=512;y+=16)cc.lineTo(x+Math.sin(y/150+i)*1.6,y);cc.stroke();}
  oak.map=texture(cabinet);oak.bumpMap=texture(cabinet,false);oak.bumpScale=.025;oak.color.set('#f4eee5');oak.roughness=.64;oak.needsUpdate=true;
  for(let variant=0;variant<8;variant++){
    const c=document.createElement('canvas');c.width=1024;c.height=256;const q=c.getContext('2d');
    const tone=variant*1.2;q.fillStyle=`rgb(${207+tone},${196+tone},${178+tone})`;q.fillRect(0,0,1024,256);
    for(let i=0;i<950;i++){
      const y=random()*256,phase=random()*6,amp=1+random()*6;
      q.strokeStyle=`rgba(${i%3?'107,88,65':'255,249,234'},${.025+random()*.10})`;q.lineWidth=.25+random()*1.2;q.beginPath();
      for(let x=0;x<=1024;x+=8){const py=y+amp*Math.sin(x/160+phase)+1.2*Math.sin(x/48+phase);if(x===0)q.moveTo(x,py);else q.lineTo(x,py);}q.stroke();
    }
    // Broad cathedral grain and small pores avoid a uniformly striped appearance.
    for(let i=0;i<16;i++){q.strokeStyle='rgba(112,93,68,.07)';q.lineWidth=.5;q.beginPath();q.ellipse(500,130,80+i*24,8+i*2.8,.04,0,Math.PI*2);q.stroke();}
    for(let i=0;i<3500;i++){q.fillStyle='rgba(91,78,62,.055)';q.fillRect(random()*1024,random()*256,2+random()*8,.5);}
    const map=texture(c),bump=texture(c,false);
    boards.push(new T.MeshStandardMaterial({color:0xffffff,map,bumpMap:bump,bumpScale:.018,roughness:.4,metalness:.1,envMapIntensity:.32}));
  }
  // Replace room-wide strips with individual 122 x 18 cm staggered planks.
  for(const mesh of [...floorGroup.children])if(mesh.geometry.parameters.height<1){floorGroup.remove(mesh);mesh.geometry.dispose();}
  let plankCount=0;const wetTile=mat('#c9c5bb',.85);
  for(const [x,y,w,d]of rooms){
    const wet=(x===769&&y===300)||(x===239&&y===300)||(x===239&&y===740);
    if(wet){for(let a=0;a<w;a+=60)for(let b=0;b<d;b+=60)box(x+a,y+b,Math.min(60,w-a)-.15,Math.min(60,d-b)-.15,.45,wetTile,.05,floorGroup);continue;}
    for(let row=0;row*18<d;row++){
      const yy=y+row*18,depth=Math.min(18,d-row*18),offset=[0,40,81][row%3];
      for(let start=-offset;start<w;start+=122){const from=Math.max(0,start),to=Math.min(w,start+122);if(to-from<.5)continue;
        box(x+from+.04,yy+.04,to-from-.08,depth-.08,.45,boards[Math.floor(random()*boards.length)],.06,floorGroup);plankCount++;
      }
    }
  }
  // Subtle plaster bump, not a flat uniform paint shader.
  const plaster=document.createElement('canvas');plaster.width=plaster.height=256;const p=plaster.getContext('2d'),pixels=p.createImageData(256,256);
  for(let i=0;i<pixels.data.length;i+=4){const value=120+random()*16;pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=value;pixels.data[i+3]=255;}p.putImageData(pixels,0,0);
  cream.bumpMap=texture(plaster,false);cream.bumpMap.repeat.set(4,4);cream.bumpScale=.025;cream.roughness=.9;cream.metalness=0;cream.needsUpdate=true;
  // Source high-resolution CC0 PBR maps from Poly Haven when online. These
  // replace only the corresponding procedural fallback after every map arrives.
  // A visitor who is offline keeps the existing locally generated material.
  const pbrSource='https://api.polyhaven.com/files/wood_floor';
  const mapFrom=(files,key)=>files?.[key]?.['2k']?.jpg?.url||files?.[key]?.['2k']?.png?.url;
  const remoteAssets=new URLSearchParams(location.search).get('assets')==='remote';
  B1_REVIEW.materialLibrary={wood:'local procedural PBR',maps:['albedo','bump','roughness']};
  if(remoteAssets)fetch(pbrSource).then(r=>r.ok?r.json():Promise.reject()).then(files=>{
    const diffuse=mapFrom(files,'diff'),normal=mapFrom(files,'nor_gl'),roughness=mapFrom(files,'rough');
    if(!diffuse||!normal||!roughness)return;
    const load=url=>new Promise((resolve,reject)=>new T.TextureLoader().load(url,t=>{t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=renderer.capabilities.getMaxAnisotropy();resolve(t)},undefined,reject));
    return Promise.all([load(diffuse),load(normal),load(roughness)]).then(([color,norm,rough])=>{
      color.colorSpace=T.SRGBColorSpace;for(const m of boards){m.map=color.clone();m.normalMap=norm.clone();m.roughnessMap=rough.clone();m.map.repeat.set(2,4);m.normalMap.repeat.copy(m.map.repeat);m.roughnessMap.repeat.copy(m.map.repeat);m.roughness=.52;m.metalness=.03;m.needsUpdate=true;}
      B1_REVIEW.materialLibrary={wood:'Poly Haven Wood Floor CC0',maps:['albedo','normal','roughness'],fallback:'local procedural PBR'};
    });
  }).catch(()=>{B1_REVIEW.materialLibrary={wood:'local procedural PBR fallback',maps:['albedo','bump','roughness']};});
  // Material response is calibrated by surface category, so warm daylight does
  // not make fabric look plastic or ceramic look like unfinished concrete.
  linen.roughness=.94;linen.metalness=0;ceramic.roughness=.18;ceramic.metalness=0;chrome.roughness=.16;chrome.metalness=.92;glass.roughness=.045;glass.metalness=.08;
  // Soft furniture grounding: transparent radial contact shadows, no baked scene image.
  const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=128;const s=shadowCanvas.getContext('2d');const gradient=s.createRadialGradient(64,64,8,64,64,64);gradient.addColorStop(0,'rgba(39,29,18,.3)');gradient.addColorStop(.6,'rgba(39,29,18,.18)');gradient.addColorStop(1,'rgba(39,29,18,0)');s.fillStyle=gradient;s.fillRect(0,0,128,128);
  const shadowMaterial=new T.MeshBasicMaterial({map:texture(shadowCanvas),transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1});
  for(const f of furniture){if(/地毯|隱藏門/.test(f.name))continue;const m=new T.Mesh(new T.PlaneGeometry(f.w+26,f.d+26),shadowMaterial);m.rotation.x=-Math.PI/2;m.position.copy(W(f.x+f.w/2,f.y+f.d/2,.58));scene.add(m);}
  // Fine loop-pile rug instead of a solid block of beige.
  const rugMat=new T.MeshStandardMaterial({color:'#a99d8b',map:tex,bumpMap:tex,bumpScale:.15,roughness:1});
  scene.traverse(m=>{if(m.isMesh&&m.geometry.parameters?.width===210&&m.geometry.parameters?.depth===250)m.material=rugMat;});
  // Replace the former narrow curtain bars with flowing fabric panels.
  const curtainMat=new T.MeshStandardMaterial({color:'#eee5d6',roughness:.98,side:T.DoubleSide,map:tex,transparent:true,opacity:.9});
  window.B1_CURTAINS=[];
  for(const [x,width,y]of [[454,180,1067],[764,120,1067],[999,180,1002]]){
    const panels=[];
    for(const m of [...scene.children])if(m.isMesh&&m.material===linen&&m.geometry.parameters?.width===3&&Math.abs(m.position.z-(700-y-4.5))<1){scene.remove(m);}
    for(const edge of [x-7,x+width-28]){
      const g=new T.PlaneGeometry(38,ROOM_HEIGHT-18,36,32),a=g.attributes.position;
      for(let i=0;i<a.count;i++){const xx=a.getX(i),yy=a.getY(i);a.setZ(i,Math.sin(xx*.65)*2.4+Math.sin(yy*.018)*.6);a.setY(i,yy+Math.cos(xx*.65)*.6);}g.computeVertexNormals();
      const m=new T.Mesh(g,curtainMat);m.position.copy(W(edge+19,y-4,ROOM_HEIGHT/2+2));m.receiveShadow=true;scene.add(m);panels.push(m);
    }
    box(x-10,y-8,width+20,9,6,cream,ROOM_HEIGHT-6);
    B1_CURTAINS.push({id:x===454?'master':x===764?'media':'living',x,width,y,panels,openX:panels.map(m=>m.position.x)});
  }
  // Reflection environment from neutral interior surfaces and large window lights.
  const envScene=new T.Scene();envScene.background=new T.Color('#b8b7b0');
  const room=new T.Mesh(new T.BoxGeometry(1000,600,1000),new T.MeshBasicMaterial({color:'#b6afa2',side:T.BackSide}));envScene.add(room);
  for(const [x,y,z,w,h]of [[0,80,-490,380,260],[-490,60,0,260,230],[0,290,0,300,300]]){const panel=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:new T.Color(2,1.92,1.78),side:T.DoubleSide}));panel.position.set(x,y,z);panel.lookAt(0,0,0);envScene.add(panel);}
  const generator=new T.PMREMGenerator(renderer);const environment=generator.fromScene(envScene,.06,.1,2000);scene.environment=environment.texture;generator.dispose();
  scene.traverse(m=>{if(m.isMesh&&m.material?.isMeshStandardMaterial){m.material.envMapIntensity=m.material===black?.65:.28;m.material.needsUpdate=true;}});
  sun.shadow.normalBias=.25;sun.shadow.radius=3;sun.shadow.mapSize.set(2048,2048);renderer.toneMappingExposure=1.2;
  // Light entering each actual north-facing window gives the room directional form.
  const daylight=[];
  for(const [x,y,z,tx,ty]of [[1100,970,230,1120,700],[545,1040,235,550,820],[850,1040,235,850,860]]){
    const l=new T.SpotLight(0xfff1dc,35000,600,1.15,.85,2);l.position.copy(W(x,y,z));l.target.position.copy(W(tx,ty,30));l.castShadow=true;l.shadow.mapSize.set(1024,1024);l.shadow.bias=-.0001;l.shadow.normalBias=.3;scene.add(l,l.target);daylight.push(l);
  }
  const nightControl=document.querySelector('#night');const applyDaylight=()=>daylight.forEach(l=>l.intensity=nightControl.checked?0:35000);nightControl.addEventListener('change',applyDaylight);applyDaylight();
  configs.living.text='洗白橡木SPC材質示意：122 × 18 cm錯縫拼接、細木紋及霧面反光；搭配亞麻、奶油色礦物牆和暖光。尺寸與色澤為本次設計假設。';
  if(selected==='living')document.querySelector('#description').textContent=configs.living.text;
  window.B1_REVIEW.finishes={plankCount,plankVariants:boards.length,daylightCount:daylight.length,environment:true};
  // One continuous panorama: living-room +CAD-y points toward Taoyuan HSR.
  // The other headings show adjacent streets rather than cloning that facade.
  const exteriorMaterial=new T.MeshBasicMaterial({color:'#d5e0df',side:T.BackSide,fog:false,depthWrite:false,toneMapped:false});
  const exterior=new T.Mesh(new T.SphereGeometry(6000,64,32),exteriorMaterial);exterior.name='qingpu-360-environment';exterior.position.copy(W(750,690,160));exterior.rotation.y=Math.PI/2;exterior.renderOrder=-10;scene.add(exterior);
  camera.far=20000;camera.updateProjectionMatrix();
  B1_REVIEW.exterior={location:'青埔八街 × 青埔九街',rear:'青松街',livingFacing:'高鐵桃園站',floor:5,kind:'generated-regional-panorama',continuous:true};
  window.B1_EXTERIOR={material:exteriorMaterial,setMood:mode=>{exteriorMaterial.color.set(mode==='night'?'#344362':mode==='dusk'?'#e2bca1':'#ffffff');}};
  // A forward-facing detail plate keeps the station view crisp at window scale.
  // Project it onto the same sky sphere so the plate never forms a floating card.
  const detailGeometry=new T.PlaneGeometry(9600,4800,48,24),detailVertices=detailGeometry.attributes.position;
  for(let i=0;i<detailVertices.count;i++){const p=new T.Vector3(detailVertices.getX(i),detailVertices.getY(i)-400,-5000).normalize().multiplyScalar(5995);detailVertices.setXYZ(i,p.x,p.y,p.z);}
  const detailMaterial=new T.MeshBasicMaterial({color:'#ffffff',depthWrite:false,depthTest:false,toneMapped:false,fog:false});
  const groundMaterial=new T.MeshBasicMaterial({color:'#ffffff',side:T.BackSide,depthWrite:false,toneMapped:false,fog:false});B1_EXTERIOR.groundMaterial=groundMaterial;
  const stationDetail=new T.Mesh(detailGeometry,detailMaterial);stationDetail.name='qingpu-station-detail';stationDetail.position.copy(exterior.position);stationDetail.renderOrder=-9;stationDetail.visible=false;scene.add(stationDetail);
  const setExteriorMood=B1_EXTERIOR.setMood;B1_EXTERIOR.setMood=mode=>{setExteriorMood(mode);detailMaterial.color.copy(exteriorMaterial.color);groundMaterial.color.copy(exteriorMaterial.color);};
  let backupPromise,generation=0;
  const reloadView=document.createElement('button');reloadView.type='button';reloadView.textContent='重新載入窗景';reloadView.onclick=()=>loadStreetViews();document.querySelector('.toolbar').append(reloadView);
  function backup(){if(!backupPromise)backupPromise=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='exterior-texture.js?v=20261025-rug1';s.onload=()=>window.B1_EXTERIOR_CACHE?resolve(B1_EXTERIOR_CACHE):reject(new Error('No backup'));s.onerror=reject;document.head.append(s);}).catch(e=>{backupPromise=null;throw e;});return backupPromise;}
  function loadStreetViews(){const current=++generation;reloadView.textContent='窗景載入中…';
    for(const [id,url,material]of [['panorama','assets/qingpu-8th-9th-panorama.jpg',exteriorMaterial],['station','assets/qingpu-station-facing.jpg',detailMaterial],['ground','assets/qingpu-ground-panorama.jpg',groundMaterial]]){
      let fallbackStarted=false,timer;
      const applyMap=map=>{if(current!==generation){map.dispose();return;}clearTimeout(timer);map.colorSpace=T.SRGBColorSpace;map.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());if(id!=='station')map.wrapS=T.RepeatWrapping;const old=material.map;material.map=map;material.needsUpdate=true;if(old&&old!==map)old.dispose();if(id==='panorama'){exterior.visible=true;B1_REVIEW.exteriorLoaded=true;}else if(id==='station'){stationDetail.visible=true;B1_REVIEW.exteriorDetailLoaded=true;}else B1_REVIEW.exteriorGroundLoaded=true;B1_EXTERIOR.setMood(window.B1_GAME?.snapshot().scene||(nightControl.checked?'night':'day'));if(B1_REVIEW.exteriorLoaded&&B1_REVIEW.exteriorDetailLoaded&&B1_REVIEW.exteriorGroundLoaded)reloadView.textContent='重新載入窗景';};
      const rescue=()=>{if(fallbackStarted||current!==generation)return;fallbackStarted=true;backup().then(cache=>new T.TextureLoader().load(cache[id],map=>{B1_REVIEW.exteriorFallbackUsed=true;applyMap(map);},undefined,()=>reloadView.textContent='點此重新載入窗景')).catch(()=>reloadView.textContent='點此重新載入窗景');};
      timer=setTimeout(rescue,12000);new T.TextureLoader().load(url+'?v=20261025-rug1',applyMap,undefined,()=>new T.TextureLoader().load(url+'?retry='+Date.now(),applyMap,undefined,rescue));
    }
  }
  exterior.frustumCulled=stationDetail.frustumCulled=false;
  B1_EXTERIOR.reload=loadStreetViews;B1_EXTERIOR.ensure=()=>{if(camera.far<20000){camera.far=20000;camera.updateProjectionMatrix();}if(exteriorMaterial.map)exterior.visible=true;if(detailMaterial.map)stationDetail.visible=true;};
  loadStreetViews();
  const exteriorNight=()=>B1_EXTERIOR.setMood(nightControl.checked?'night':'day');nightControl.addEventListener('change',exteriorNight);exteriorNight();
  // Rounded linen pillows with stitched seams, fitted within the existing sofa.
  function pillow(x,y,z,color){const material=linen.clone();material.color.set(color);const g=new T.SphereGeometry(1,28,20);const a=g.attributes.position;for(let i=0;i<a.count;i++){const px=a.getX(i),py=a.getY(i),pz=a.getZ(i);a.setXYZ(i,Math.sign(px)*Math.pow(Math.abs(px),.55)*8,Math.sign(py)*Math.pow(Math.abs(py),.55)*18,Math.sign(pz)*Math.pow(Math.abs(pz),.55)*18);}g.computeVertexNormals();const m=new T.Mesh(g,material);m.position.copy(W(x,y,z));m.rotation.z=-.16;m.castShadow=m.receiveShadow=true;scene.add(m);}
  pillow(1005,795,66,'#d1c5af');pillow(1007,945,65,'#939b85');
  // Warm, lived-in details: small objects and layered amber light make the apartment
  // read as a home instead of a showroom while keeping the DWG circulation clear.
  const cozyGroup=new T.Group();cozyGroup.name='cozy-home-details';scene.add(cozyGroup);
  const cozyLightSet=[];
  function cozyLight(x,y,z,color,intensity,range){const l=new T.PointLight(color,intensity,range,2);l.position.copy(W(x,y,z));l.castShadow=false;scene.add(l);cozyLightSet.push({light:l,intensity});return l;}
  cozyLight(1060,805,190,0xffc982,180,360);
  cozyLight(1010,540,170,0xffd79b,115,260);
  cozyLight(790,820,165,0xffcf91,90,220);
  cozyLight(260,410,150,0xffc982,70,210);
  function decoBox(x,y,w,d,h,material,z=.7){const m=box(x,y,w,d,h,material,.05,cozyGroup);m.position.y=z;return m;}
  function decoCyl(x,y,r,h,material,z=0){const m=cyl(x,y,r,h,material,z);scene.remove(m);cozyGroup.add(m);return m;}
  // Coffee-table books and a ceramic tray.
  decoBox(1108,796,21,28,1.8,mat('#b7a58d',.88),73);decoBox(1109,798,19,25,1.6,mat('#6d7b69',.82),74.7);
  const tray=decoCyl(1132,864,12,1.8,mat('#c8b596',.9),72);
  const mug=decoCyl(1132,864,3.8,7.5,mat('#f1eadc',.9),74);
  // Soft throw at the end of the sofa and a small entry catch-all dish.
  decoBox(1000,903,50,37,2,mat('#b7a995',.98),47.5);
  const catchAll=decoCyl(1038,538,11,2.2,mat('#c7ad83',.86),94);
  // Bedside glow and a simple fabric pendant silhouette.
  cozyLight(450,810,230,0xffc477,600,170);
  const shade=new T.Mesh(new T.ConeGeometry(18,18,24,1,true),mat('#d8c5a6',.82));shade.position.copy(W(450,810,230));cozyGroup.add(shade);
  const stem=box(449,809,2,2,21,chrome,239,cozyGroup);
  const applyCozy=()=>cozyLightSet.forEach(({light,intensity})=>{light.intensity=cozyEnabled?(nightControl.checked?1.15:1)*intensity:0;});
  const cozyButton=document.createElement('button');cozyButton.textContent='溫馨情境';cozyButton.setAttribute('aria-pressed','true');cozyButton.style.cssText='border-color:#c79a67;background:#fff4df';
  let cozyEnabled=true;cozyButton.onclick=()=>{cozyEnabled=!cozyEnabled;cozyButton.setAttribute('aria-pressed',String(cozyEnabled));cozyButton.style.background=cozyEnabled?'#fff4df':'#f8f6ef';cozyLightSet.forEach(({light,intensity})=>light.intensity=cozyEnabled?(nightControl.checked?1.15:1)*intensity:0);cozyGroup.visible=cozyEnabled;window.B1_REVIEW.cozy=cozyEnabled;};
  document.querySelector('.toolbar').append(cozyButton);window.B1_REVIEW.cozy=true;nightControl.addEventListener('change',applyCozy);applyCozy();
  // Turn simple cylindrical display placeholders into ceramic vessels.
  for(const m of [...scene.children]){if(m.geometry?.type==='CylinderGeometry'&&m.material===cream&&m.position.x>470&&m.position.z<30&&m.position.z>-35){const h=m.geometry.parameters.height;m.geometry=new T.LatheGeometry([new T.Vector2(0,0),new T.Vector2(5,0),new T.Vector2(7,3),new T.Vector2(6,h*.65),new T.Vector2(3,h*.9),new T.Vector2(3,h)],32);m.position.y-=h/2;m.material=mat('#d6cbbc',.45);}}
  const quality=document.createElement('select');quality.setAttribute('aria-label','畫質');quality.innerHTML='<option value="high">高畫質</option><option value="balanced">順暢模式</option>';quality.style.cssText='padding:7px;border:1px solid #c9c8bb;background:#f8f6ef;border-radius:4px';document.querySelector('.toolbar').append(quality);
  quality.onchange=()=>{const high=quality.value==='high';renderer.setPixelRatio(high?Math.min(devicePixelRatio,2):1);daylight.forEach(l=>l.castShadow=high);sun.shadow.needsUpdate=true;};
  const aim=document.createElement('span');aim.textContent='·';aim.style.cssText='display:none;position:absolute;left:50%;top:50%;font-size:28px;color:white;pointer-events:none;text-shadow:0 1px 3px black';view.append(aim);
  const gameButton=document.createElement('button');gameButton.textContent='遊戲式滑鼠視角';gameButton.onclick=async()=>{try{if(!walking)renderButton.click();await canvas.requestPointerLock();}catch{help.textContent='目前瀏覽器未允許鎖定滑鼠，仍可拖曳轉頭。';}};document.querySelector('.toolbar').append(gameButton);
  const originalMove=canvas.onpointermove;canvas.onpointermove=e=>{if(document.pointerLockElement===canvas&&walking){walkYaw+=e.movementX*.0025;lookPitch=Math.max(-1,Math.min(1,lookPitch-e.movementY*.0025));}else originalMove(e);};
  document.addEventListener('pointerlockchange',()=>{const locked=document.pointerLockElement===canvas;aim.style.display=locked?'block':'none';help.textContent=locked?'WASD 走動 · 移動滑鼠轉頭 · Esc 釋放滑鼠':'拖曳轉頭 · WASD 移動 · 小地圖定位 · Esc 返回鳥瞰';});
  document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.mode!=='render'&&document.pointerLockElement)document.exitPointerLock();}));
  // A small instrumentation hook for browser QA without placing technical data in the UI.
  let previous=performance.now(),samples=[];function measure(now){samples.push(now-previous);previous=now;if(samples.length>90)samples.shift();window.B1_REVIEW.frameMs=samples.reduce((a,b)=>a+b,0)/samples.length;requestAnimationFrame(measure);}requestAnimationFrame(measure);
  // Selected CC0 furniture GLBs become the visible, detailed model only after
  // they are fully loaded. The measured local item remains the offline fallback
  // and keeps plan collisions stable regardless of network availability.
  const gltfAssets={};
  function showMeasuredFallback(name,visible){scene.traverse(o=>{if(o.userData?.furnitureName===name)o.visible=visible;});}
  function placeGLB(root,{x,y,width,depth,height,rotate=0}){
    root.rotation.y=rotate;root.updateMatrixWorld(true);const before=new T.Box3().setFromObject(root),size=before.getSize(new T.Vector3());
    root.scale.set(width/Math.max(size.x,.001),height/Math.max(size.y,.001),depth/Math.max(size.z,.001));
    root.updateMatrixWorld(true);const after=new T.Box3().setFromObject(root),center=after.getCenter(new T.Vector3()),target=W(x+width/2,y+depth/2);
    root.position.add(new T.Vector3(target.x-center.x,-after.min.y,target.z-center.z));root.updateMatrixWorld(true);
  }
  function loadPremiumAsset(loader,{id,url,placement,fallbackName}){
    loader.load(url,gltf=>{
      const model=gltf.scene;placeGLB(model,placement);model.name=`premium-${id}`;
      model.traverse(child=>{if(child.isMesh){child.castShadow=true;child.receiveShadow=true;if(child.material)child.material.needsUpdate=true;}});
      scene.add(model);showMeasuredFallback(fallbackName,false);gltfAssets[id]={loaded:true,url};renderer.shadowMap.needsUpdate=true;
    },undefined,()=>{gltfAssets[id]={loaded:false,url};});
  }
  const premiumAssets=[
    // CC0, detailed piped two-seat sofa — warm timber and upholstery suit the living room.
    {id:'livingSofa',disabled:true,url:null,fallbackName:'奶油弧背模組沙發'},
    // CC0 platform bed with textured bedding, used in the two bedroom footprints.
    {id:'masterBed',url:'https://www.innerscene.com/api/library/platform-bed-with-bedding-original-interior-furnishing-d69cf237/download',placement:{x:408,y:890,width:188,depth:150,height:105},fallbackName:'主臥飯店級軟包雙人床／轉向90度'},
    {id:'guestBed',url:'https://www.innerscene.com/api/library/platform-bed-with-bedding-original-interior-furnishing-d69cf237/download',placement:{x:415,y:320,width:150,depth:188,height:92},fallbackName:'次臥飯店級客床 150×188'},
    // The locally modelled mesh chair stays in place: the externally available
    // showcase chair is saturated red and would break the home's quiet palette.
    {id:'deskChair',disabled:true,url:null,fallbackName:'高階網布人體工學椅'},
    {id:'refrigerator',disabled:true,url:null,fallbackName:'Panasonic NR-D505XGS 冰箱'},
    // The desk model is rescaled to the approved 200 × 65 cm footprint.
    {id:'sitStandDesk',disabled:true,url:null,fallbackName:'160 cm 升降工作桌／無窗側'}
  ];
  window.B1_REVIEW.assetPolicy={remoteModels:remoteAssets,plant:false,localFurnitureFallback:true};window.B1_REVIEW.premiumAssets=premiumAssets.map(({id,url,fallbackName,disabled=false})=>({id,url,fallbackName,disabled}));window.B1_REVIEW.gltfAssets=gltfAssets;
  function attachPremiumAssets(){
    if(attachPremiumAssets.done||!window.B1_GLTFLoader)return;attachPremiumAssets.done=true;const loader=new window.B1_GLTFLoader();premiumAssets.filter(asset=>!asset.disabled).forEach(asset=>loadPremiumAsset(loader,asset));
  }
  if(remoteAssets){if(window.B1_GLTFLoader)attachPremiumAssets();else{
    window.addEventListener('b1-gltf-loader-ready',attachPremiumAssets,{once:true});
    const importMap=document.createElement('script');importMap.type='importmap';importMap.textContent='{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js"}}';document.head.append(importMap);
    const loaderModule=document.createElement('script');loaderModule.type='module';loaderModule.textContent="import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/loaders/GLTFLoader.js'; window.B1_GLTFLoader=GLTFLoader; window.dispatchEvent(new Event('b1-gltf-loader-ready'));";document.head.append(loaderModule);
  }
  }
  const homeScript=document.createElement('script');homeScript.src='studio-home.js?v=20261026-world2';homeScript.onerror=()=>loadFailure('空間介面');document.head.append(homeScript);
})();
