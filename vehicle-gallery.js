import * as T from './vendor/three/build/three.module.js';

window.T=T;
window.mat=(color,roughness=.8,extra={})=>new T.MeshStandardMaterial({color,roughness,...extra});
window.W=(x,y,z=0)=>new T.Vector3(x,z,y);
window.B1_MODELS={rounded(x,y,w,d,h,m,z,parent){const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,z+h/2,y);parent.add(o);return o;}};
const status=document.querySelector('#status'),select=document.querySelector('#model'),compare=document.querySelector('#compare'),spin=document.querySelector('#spin');
try{
  for(const file of ['studio-vehicles.js','studio-vehicle-faces.js','studio-vehicle-sculpt.js','studio-vehicle-ev.js','studio-vehicle-commercial.js','studio-taiwan-traffic.js'])await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=file+'?v=20261103-vehicles2';s.onload=resolve;s.onerror=()=>reject(Error('無法載入 '+file));document.head.append(s);});
  if(!await B1_VEHICLES.ready)throw Error('Model Y 對照資產載入失敗，請重新整理。');
  const renderer=new T.WebGLRenderer({canvas:document.querySelector('canvas'),antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
  const scene=new T.Scene();scene.background=new T.Color('#dce1e5');
  const camera=new T.PerspectiveCamera(36,innerWidth/innerHeight,1,10000),spherical=new T.Spherical(850,1.3,.5),target=new T.Vector3();
  let drag=null,last=performance.now();
  const controls={target,autoRotate:false,sync(){spherical.setFromVector3(camera.position.clone().sub(target));},update(){const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;if(this.autoRotate&&!drag)spherical.theta+=dt*.16;spherical.phi=Math.max(.15,Math.min(Math.PI*.49,spherical.phi));spherical.radius=Math.max(300,Math.min(4200,spherical.radius));camera.position.copy(target).add(new T.Vector3().setFromSpherical(spherical));camera.lookAt(target);}};
  const canvas=renderer.domElement;
  canvas.addEventListener('pointerdown',e=>{if(drag)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,pan:e.button===2};canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.x=e.clientX;drag.y=e.clientY;if(drag.pan){target.x-=Math.cos(spherical.theta)*dx*spherical.radius*.001;target.z+=Math.sin(spherical.theta)*dx*spherical.radius*.001;target.y+=dy*spherical.radius*.001;}else{spherical.theta-=dx*.005;spherical.phi-=dy*.005;}});
  for(const type of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(type,e=>{if(drag?.id===e.pointerId)drag=null;});
  canvas.addEventListener('wheel',e=>{e.preventDefault();spherical.radius*=Math.exp(e.deltaY*.001);},{passive:false});canvas.addEventListener('contextmenu',e=>e.preventDefault());
  // Local studio light rig; no network textures or renderer-specific postprocessing.
  const environment=new T.Scene();environment.background=new T.Color('#9ba6af');
  for(const [p,size,value]of [[[0,500,0],[900,10,850],5],[[-400,230,350],[10,400,650],8],[[400,230,-250],[10,450,600],4]]){const o=new T.Mesh(new T.BoxGeometry(...size),new T.MeshBasicMaterial({color:new T.Color(value,value,value)}));o.position.set(...p);environment.add(o);}
  const pmrem=new T.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(environment,.04).texture;pmrem.dispose();environment.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
  scene.add(new T.HemisphereLight('#f2f6ff','#a5a7a6',2));
  const sun=new T.DirectionalLight('#fff8ed',3);sun.position.set(-500,900,450);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-850,right:850,top:850,bottom:-850,near:10,far:2500});sun.shadow.normalBias=.6;sun.shadow.bias=-.00015;scene.add(sun);
  const floor=new T.Mesh(new T.PlaneGeometry(30000,30000),mat('#c9ced2',.92));floor.rotation.x=-Math.PI/2;floor.position.y=-.7;floor.receiveShadow=true;scene.add(floor);
  const models=new Map(),owned=B1_VEHICLES.createModelY();owned.spec={...owned.spec,id:'model-y',name:'Tesla Model Y · 閃電銀',axle:owned.spec.wheelbase};models.set('model-y',owned);scene.add(owned.group);
  for(const s of [...B1_TAIWAN_TRAFFIC.specs,owned.spec])select.add(new Option(s.name,s.id));
  let current='model-3',comparing=false;
  function show(id,angle='front'){
    if(!models.has(id)){const v=B1_TAIWAN_TRAFFIC.create(id,id==='fox-d'?'#7d96a6':id==='fox-k'?'#e0e2de':'#a9b3bc');models.set(id,v);scene.add(v.group);}
    for(const [key,v]of models)v.group.visible=key===id;
    const car=models.get(id),s=car.spec,k=Math.max(1,s.length/490);controls.target.set(0,s.height*.48,0);camera.position.set(...(angle==='side'?[760*k,170*k,0]:angle==='rear'?[390*k,215*k,-690*k]:[390*k,215*k,690*k]));controls.sync();controls.update();
    document.querySelector('#name').textContent=s.name;document.querySelector('#spec').textContent=`長 ${s.length} × 寬 ${s.width} × 高 ${s.height} cm${s.estimatedDimensions?' · 尺寸為外觀估算':''}`;
    renderer.render(scene,camera);return car;
  }
  select.value=current;select.disabled=compare.disabled=false;select.addEventListener('change',()=>{current=select.value;comparing=false;compare.setAttribute('aria-pressed','false');show(current);});
  compare.addEventListener('click',()=>{comparing=!comparing;compare.setAttribute('aria-pressed',String(comparing));show(comparing?'model-y':current);});
  document.querySelectorAll('[data-angle]').forEach(b=>b.addEventListener('click',()=>show(comparing?'model-y':current,b.dataset.angle)));
  spin.addEventListener('click',()=>{controls.autoRotate=!controls.autoRotate;spin.setAttribute('aria-pressed',String(controls.autoRotate));});
  function resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();}
  addEventListener('resize',resize);resize();show(current);status.hidden=true;
  renderer.setAnimationLoop(()=>{if(document.hidden)return;controls.update();renderer.render(scene,camera);});
  window.B1_VEHICLE_GALLERY={ready:true,show,models,renderer,scene};
}catch(error){status.textContent='車款展示載入失敗：'+error.message;status.className='error';console.error(error);}
