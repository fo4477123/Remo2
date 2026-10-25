/* Whole-home surface and construction pass: retain measured equipment and animation refs. */
(() => {
  const {rounded,rod,tube,actors}=B1_MODELS,detail=new T.Group();detail.name='whole-home-construction-details';scene.add(detail);
  const brushed=mat('#a8b2b1',.25,{metalness:.92}),rubber=mat('#363d3b',.8),porcelain=mat('#eeeee8',.18),paper=mat('#deded3',.9);
  function attach(mesh,leaf){leaf.attach(mesh);return mesh;}
  const fridgeAttach=(mesh,leaf)=>attach(FRIDGE_LAYOUT.transformMesh(mesh),leaf),applianceAttach=(mesh,leaf)=>attach(APPLIANCE_LAYOUT.transformMesh(mesh),leaf);
  function disk(x,y,z,r,material,parent=detail,axis='h'){const m=new T.Mesh(new T.CylinderGeometry(r,r,.45,32),material);if(axis==='v')m.rotation.x=Math.PI/2;m.position.copy(W(x,y,z));parent.add(m);return m;}
  function label(text,x,y,z,w,h,parent=detail,angle=0){const c=document.createElement('canvas');c.width=512;c.height=128;const p=c.getContext('2d');p.fillStyle='#26332e';p.font='34px sans-serif';p.fillText(text,12,80);const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map,transparent:true}));m.position.copy(W(x,y,z));m.rotation.y=angle;parent.add(m);return m;}
  const windowMetal=mat('#b9bdb4',.27,{metalness:.78});
  for(const w of windowSpecs){for(const m of [...scene.children]){if(!m.isMesh||m.userData.furnitureName||m.geometry.type!=='BoxGeometry'||(m.material!==oak&&m.material!==linen))continue;const x=m.position.x+750,y=700-m.position.z;if(w.axis==='h'?Math.abs(y-w.line)<12&&x>w.from-12&&x<w.to+12:Math.abs(x-w.line)<12&&y>w.from-12&&y<w.to+12)m.material=windowMetal;}
    const mid=(w.from+w.to)/2;if(w.axis==='h')rod([mid+4,w.line-8,118],[mid+4,w.line-8,132],.55,brushed);else rod([w.line+8,mid+4,183],[w.line+8,mid+4,197],.55,brushed);
  }
  const mirror=mat('#ced9d4',.055,{metalness:1,envMapIntensity:1.2});rounded(240.5,749,1.5,68,86,brushed,104,detail,.6);const ensuiteMirror=new T.Mesh(new T.PlaneGeometry(62,80),mirror);ensuiteMirror.rotation.y=Math.PI/2;ensuiteMirror.position.copy(W(242.2,783,147));detail.add(ensuiteMirror);
  for(const [x,y]of [[1100,800],[840,900],[860,640],[1070,580]]){const trim=new T.Mesh(new T.TorusGeometry(6.1,.4,8,40),brushed);trim.rotation.x=Math.PI/2;trim.position.copy(W(x,y,279));detail.add(trim);}

  // Cabinet edge gaps and pull profiles stay attached to the actual moving panels.
  wardrobeDoors.forEach((leaf,i)=>attach(rod([i?657.4:660.4,i?1000:876,102],[i?657.4:660.4,i?1000:876,153],.42,brushed),leaf));
  attach(rounded(939,552.5,1,1.4,52,brushed,100,detail,.4),cleaningDoors[0]);
  applianceDoors.forEach((leaf,i)=>applianceAttach(rod([i?593:579,668.1,214],[i?593:579,668.1,235],.4,brushed),leaf));
  for(const [i,leaf]of fridgeDoors.entries()){
    const x=i?507:478,w=i?34:22;
    for(const z of [108,137,165]){fridgeAttach(rounded(x,669,w,8,1.2,porcelain,z,detail,.4),leaf);fridgeAttach(rounded(x,676,w,.8,7,glass,z+1,detail,.2),leaf);}
    fridgeAttach(rounded(i?505.2:501.8,667.9,.8,1.1,82,rubber,96,detail,.2),leaf);
  }
  fridgeAttach(label('Panasonic',518,666.05,173,16,3.8,detail,Math.PI),fridgeDoors[1]);
  // The machine retains its approved 360-degree orientation and rotating drum.
  const knob=new T.Mesh(new T.CylinderGeometry(4.6,4.6,2,40),brushed);knob.rotation.x=Math.PI/2;knob.position.set(16,86,-33.3);B1_WASHER.add(knob);
  for(let i=0;i<12;i++){const a=i/12*Math.PI*2,m=new T.Mesh(new T.BoxGeometry(.45,1.1,.2),rubber);m.position.set(16+Math.sin(a)*5.6,86+Math.cos(a)*5.6,-33.6);B1_WASHER.add(m);}
  const machineSeal=new T.Mesh(new T.TorusGeometry(20.9,.75,8,64),rubber);machineSeal.position.set(0,47,-33.2);B1_WASHER.add(machineSeal);
  const machineLabel=label('LG / 15 kg',330,385.9,89,11,2.8,detail,Math.PI);B1_WASHER.attach(machineLabel);
  // Charging contacts, lidar cap and a compliant bumper distinguish the robot from a plain disc.
  const bumper=new T.Mesh(new T.TorusGeometry(15.3,.75,8,56),rubber);bumper.rotation.x=Math.PI/2;bumper.position.copy(W(799,545,5));detail.add(bumper);
  disk(799,545,10,4,rubber);disk(799,545,10.7,2.6,brushed);for(const x of [787,807])rounded(x,530,3,1,1,brushed,5,detail,.3);

  // Sanitaryware: separate seat rings, hinges, flush buttons, drains and overflow fittings.
  for(const [x,y,tankX]of [[805,339,780],[279,858,253]]){
    const seat=new T.Mesh(new T.TorusGeometry(1,.075,10,72),porcelain);seat.rotation.x=-Math.PI/2;seat.scale.set(24,18,8);seat.position.copy(W(x+3,y,43));detail.add(seat);
    for(const yy of [y-11,y+11])rod([x-18,yy,41],[x-15,yy,45],1,brushed);
    disk(tankX,y,68.4,2.1,brushed);rounded(tankX-1.5,y-5,3,10,.5,brushed,68.3,detail,.2);
  }
  for(const [x,y,z]of [[792,468,79],[263,783,79],[421,699.5,70],[1008,328,8],[1026,500,5],[371,971,5]]){disk(x,y,z,2.7,brushed);for(let i=0;i<6;i++){const a=i*Math.PI/3;disk(x+Math.cos(a)*1.5,y+Math.sin(a)*1.5,z+.3,.23,rubber);}}
  for(const [x,y]of [[1018,455],[378,944]]){
    for(const z of [111,183]){const m=new T.Mesh(new T.CylinderGeometry(3.5,3.5,.7,28),brushed);m.rotation.x=Math.PI/2;m.position.copy(W(x,y,z));detail.add(m);}
    rod([x,y,108],[x-12,y,108],1.5,brushed);tube([[x-7,y,109],[x-11,y+6,87],[x-7,y+12,66],[x+1,y+8,71],[x+1,y,112]],.55,brushed);
  }
  for(const [x,y]of [[912,433],[1018,434],[277,928]])for(const z of [33,166])rounded(x-.7,y,2.4,5.5,6,brushed,z,detail,.5);
  // Kitchen doors have real edges and hinges; one lower bay is operable.
  let kitchenLeaf;scene.traverse(o=>{if(o.isMesh&&o.userData.furnitureName==='橫向廚具 230×60'&&o.geometry.parameters?.width===44&&o.position.x+750<270&&o.geometry.parameters.height===78)kitchenLeaf=o;});
  if(kitchenLeaf){const hinge=new T.Group();hinge.position.copy(W(...KITCHEN_LAYOUT.map(241,670)));scene.add(hinge);hinge.attach(kitchenLeaf);
    for(const o of [...scene.children])if(o.isMesh&&o.userData.furnitureName==='\u6a6b\u5411\u5eda\u5177 230\u00d760'&&o.position.x+750>250&&o.position.x+750<280&&o.position.y>70&&o.position.y<78&&o.geometry.parameters?.width===18)hinge.attach(o);
    for(const z of [16,59])attach(rounded(243,672,3,4,5,brushed,z,detail,.5),kitchenLeaf);
    rounded(244,678,36,43,1.5,oak,23,detail,.3);
    actors.push({id:'kitchen-storage',name:'廚房下櫃',x:264,y:668.5,h:55,range:130,on:false,p:0,leaf:hinge,span:44,verbs:['打開廚房下櫃','關閉廚房下櫃'],room:'kitchen',apply:p=>hinge.rotation.y=-p*Math.PI*.48});
  }
  for(const x of [270,300]){const burner=new T.Mesh(new T.TorusGeometry(7.7,.45,8,40),brushed);burner.rotation.x=Math.PI/2;burner.position.copy(W(x,700.5,92.3));detail.add(burner);for(const a of [0,Math.PI/2])rod([x-Math.cos(a)*9,700.5-Math.sin(a)*9,92.5],[x+Math.cos(a)*9,700.5+Math.sin(a)*9,92.5],.45,rubber);}
  // A continuous frame seal and a proper lever sit on the moving entrance door.
  for(const x of [1107.4,1206.4])rounded(x,504.1,.5,1,222,rubber,5,detail,.15);
  attach(rod([1192,498,114],[1177,498,114],.85,brushed),window.mainDoorHinge);
  attach(rounded(1189,498.5,5,1.1,26,rubber,102,detail,.5),window.mainDoorHinge);

  function grain(size,type){const c=document.createElement('canvas');c.width=c.height=size;const p=c.getContext('2d');p.fillStyle='#bcbcbc';p.fillRect(0,0,size,size);let seed=331;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    if(type==='cloth'){for(let i=0;i<size;i+=3){p.strokeStyle=i%2?'#b3b3b3':'#c7c7c7';p.lineWidth=.5;p.beginPath();p.moveTo(i,0);p.lineTo(i,size);p.moveTo(0,i);p.lineTo(size,i);p.stroke();}}
    else for(let i=0;i<14000;i++){const v=type==='metal'?150+rand()*14:177+rand()*15;p.fillStyle=`rgb(${v},${v},${v})`;p.fillRect(rand()*size,rand()*size,type==='metal'?1:1.2,type==='metal'?10+rand()*30:1.2);}
    const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.colorSpace=T.NoColorSpace;return t;}
  const weave=grain(512,'cloth'),metalGrain=grain(256,'metal'),finishGrain=grain(256,'paint');
  const materials=new Map(),coverage=new Map(furniture.map(f=>[f.name,0])),geometries=new Map();let refinedMeshes=0;
  const category=o=>{let p=o;while(p){if(p.userData.furnitureName)return p.userData.furnitureName;p=p.parent;}return '';};
  function physical(source,kind){if(!source?.isMeshStandardMaterial||source===black)return source;const key=source.uuid+kind;if(materials.has(key))return materials.get(key);
    const m=new T.MeshPhysicalMaterial({color:source.color,roughness:source.roughness,metalness:source.metalness,map:source.map,normalMap:source.normalMap,bumpMap:source.bumpMap,bumpScale:source.bumpScale,roughnessMap:source.roughnessMap,alphaMap:source.alphaMap,alphaTest:source.alphaTest,transparent:source.transparent,opacity:source.opacity,side:source.side,depthWrite:source.depthWrite,emissive:source.emissive,emissiveIntensity:source.emissiveIntensity,envMapIntensity:.55});
    if(source.metalness>.8&&source.roughness<.1){m.roughness=.055;m.bumpMap=null;m.envMapIntensity=1.2;}
    else if(source.metalness>.55){m.roughness=Math.max(.18,Math.min(.32,source.roughness));m.bumpMap=metalGrain;m.bumpScale=.012;m.envMapIntensity=1.2;}
    else if(source===glass){m.roughness=.045;m.opacity=.1;m.clearcoat=.9;m.ior=1.5;m.envMapIntensity=.85;m.depthWrite=false;}
    else if(source===ceramic||source===porcelain){m.color.set('#eeeee8');m.roughness=.18;m.clearcoat=.6;m.clearcoatRoughness=.16;m.bumpMap=finishGrain;m.bumpScale=.006;}
    else if(source===oak){m.roughness=.61;m.bumpScale=.022;}
    else if(kind==='fabric'){m.sheen=.8;m.sheenColor.set('#e5ded1');m.sheenRoughness=.95;m.roughness=.93;m.bumpMap=weave;m.bumpScale=.045;}
    else if(kind==='appliance'){m.clearcoat=.65;m.clearcoatRoughness=.14;m.roughness=.22;m.bumpMap=finishGrain;m.bumpScale=.006;}
    else if(kind==='stone'){m.roughness=.29;m.clearcoat=.13;m.clearcoatRoughness=.35;m.bumpScale=.013;}
    else{m.bumpMap=source.bumpMap||finishGrain;m.bumpScale=source.bumpMap?Math.min(.04,source.bumpScale):.01;}
    m.userData.surface=source===glass?'glass':source===ceramic||source===porcelain?'ceramic':source.metalness>.55?'metal':source===oak?'wood':source===cream&&kind==='surface'?'paint':kind;materials.set(key,m);return m;
  }
  const all=[];scene.traverse(o=>{if(o.isMesh)all.push(o);});
  const uses=new Map();for(const o of all)uses.set(o.geometry,(uses.get(o.geometry)||0)+1);
  for(const o of all){const name=category(o);if(coverage.has(name))coverage.set(name,coverage.get(name)+1);const list=Array.isArray(o.material)?o.material:[o.material];if(list.includes(glass))o.castShadow=false;if(o.geometry.type==='CylinderGeometry'&&o.geometry.parameters.radiusTop===6&&o.geometry.parameters.height===2&&o.position.y>270)o.position.y=279;o.material=list.map(m=>{const cloth=/沙發|雙人床|客床|人體工學椅|地毯|臥榻/.test(name)&&m.roughness>.75;const kind=cloth?'fabric':/冰箱|洗脫烘/.test(name)&&m.roughness<.6?'appliance':/茶几|廚具|洗手台/.test(name)&&m.roughness<.6?'stone':'surface';return physical(m,kind);});if(!Array.isArray(list)||list.length===1)o.material=o.material[0];
    if(name&&!o.geometry.userData.modernRounded&&o.geometry.type==='BoxGeometry'&&o.parent!==wallGroup&&o.parent!==floorGroup&&o.parent!==ceilingGroup){const {width:w,height:h,depth:d}=o.geometry.parameters;if(Math.min(w,h,d)>.4){const radius=Math.min(.35,w/5,h/5,d/5),key=[w,h,d,radius].join(',');let g=geometries.get(key);if(!g){const temp=rounded(0,0,w,d,h,o.material,0,new T.Group(),radius);g=temp.geometry;geometries.set(key,g);}const old=o.geometry;o.geometry=g;uses.set(old,uses.get(old)-1);if(!uses.get(old))old.dispose();}}
    if(name)refinedMeshes++;
  }
  // Keep the screen material identity needed by TV interaction detection.
  black.roughness=.2;black.envMapIntensity=.9;
  // Repeated small pieces share one draw call without affecting moving door parts.
  const staticCylinders=detail.children.filter(o=>o.isMesh&&o.geometry.type==='CylinderGeometry');
  const batches=new Map();for(const m of staticCylinders){const key=m.material.uuid;if(!batches.has(key))batches.set(key,[]);batches.get(key).push(m);}
  for(const [key,list]of batches){if(list.length<4)continue;const batch=new T.InstancedMesh(new T.CylinderGeometry(1,1,1,16),list[0].material,list.length),transform=new T.Object3D();for(let i=0;i<list.length;i++){const m=list[i],p=m.geometry.parameters;transform.position.copy(m.position);transform.quaternion.copy(m.quaternion);transform.scale.copy(m.scale).multiply(new T.Vector3(p.radiusTop,p.height,p.radiusTop));transform.updateMatrix();batch.setMatrixAt(i,transform.matrix);detail.remove(m);m.geometry.dispose();}batch.receiveShadow=true;detail.add(batch);}
  const keys=scene.children.filter(o=>o.isMesh&&o.userData.furnitureName==='160 cm 升降工作桌／對面實牆'&&o.geometry.parameters?.width===2&&o.geometry.parameters?.height===.35);
  if(keys.length){const batch=new T.InstancedMesh(keys[0].geometry,keys[0].material,keys.length),center=W(900,849,77.575),transform=new T.Object3D();batch.position.copy(center);batch.userData.furnitureName='160 cm 升降工作桌／對面實牆';keys.forEach((m,i)=>{transform.position.copy(m.position).sub(center);transform.updateMatrix();batch.setMatrixAt(i,transform.matrix);scene.remove(m);if(i)m.geometry.dispose();});batch.receiveShadow=true;scene.add(batch);}
  const scanSpecs=[{kind:'fabric',id:'rough_linen',repeat:[3,3],strength:.18},{kind:'wood',id:'oak_veneer_01',repeat:[1,1],strength:.12},{kind:'stone',id:'marble_01',repeat:[.22,.18],offset:[.08,.48],strength:.2,color:true},{kind:'paint',id:'painted_plaster_wall',repeat:[3,3],strength:.08}];
  const loadMap=(path,color=false)=>new Promise((resolve,reject)=>new T.TextureLoader().load(path,t=>{t.colorSpace=color?T.SRGBColorSpace:T.NoColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());resolve(t);},undefined,reject));
  B1_MODELS.pbrReady=Promise.all(scanSpecs.map(async spec=>{try{const base='assets/pbr/'+spec.id+'-',maps=await Promise.all([loadMap(base+'nor_gl.jpg'),loadMap(base+'rough.jpg'),spec.color?loadMap(base+'diffuse.jpg',true):Promise.resolve(null)]);for(const t of maps.filter(Boolean)){t.repeat.set(...spec.repeat);if(spec.offset)t.offset.set(...spec.offset);}for(const m of materials.values())if(m.userData.surface===spec.kind){m.normalMap=maps[0];m.normalScale.set(spec.strength,spec.strength);m.bumpMap=null;m.roughnessMap=maps[1];if(spec.kind==='fabric')m.roughness=1;if(maps[2]){m.map=maps[2];m.color.set('#ffffff');}m.needsUpdate=true;}return spec.kind;}catch{return null;}})).then(loaded=>{B1_REVIEW.materialScans={loaded:loaded.filter(Boolean),license:'CC0-1.0',local:true};return loaded.filter(Boolean);});
  B1_MODELS.coverage=Object.fromEntries(coverage);B1_MODELS.refinement={meshes:refinedMeshes,categories:coverage.size,physicalMaterials:materials.size};B1_REVIEW.wholeHomeQuality=B1_MODELS.refinement;
})();
