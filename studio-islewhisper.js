/* Nuanyu Isle Whisper: official 80×60×53 cm, unfolded 80×120×74 cm. */
(() => {
  'use strict';
  const key='暖嶼家居島語升降茶几',{rounded,rod}=B1_MODELS,old=B1_MODELS.groups[key];old.visible=false;
  B1_MODELS.actors.splice(B1_MODELS.actors.findIndex(a=>a.id==='coffee-lift'),1);
  const root=new T.Group();root.name='nuanyu-isle-whisper-80x60';root.userData.furnitureName=key;scene.add(root);B1_MODELS.groups[key]=root;
  const pale=new T.MeshPhysicalMaterial({color:'#d9cdb5',roughness:.7,clearcoat:.04}),inside=pale.clone();inside.color.set('#c8baa0');const steel=mat('#393c37',.4,{metalness:.65}),rim=mat('#8a8574',.3,{metalness:.75}),rubber=mat('#393b36',.85),seat=linen.clone();seat.color.set('#9b9384');seat.roughness=.96;seat.bumpScale=.03;
  const g=name=>{const o=new T.Group();o.name=name;root.add(o);return o;},b=(x,y,w,d,h,z,m=pale,parent=root,r=.45)=>rounded(x,y,w,d,h,m,z,parent,r);
  const cx=1100,cy=800,depth=60,length=80;
  // Cabinet ends, central back, shelf and upper storage tray have real thickness.
  b(cx,cy,depth,2,42,7);b(cx,cy+78,depth,2,42,7);b(cx+27,cy+2,2,76,41,7,inside);b(cx+2,cy+2,25,76,2,7,inside);b(cx+2,cy+2,25,76,2,28,inside);b(cx+29,cy+2,29,76,2,34,inside);
  for(const y of [cy,cy+78])b(cx, y,depth,2,2,47);b(cx+26,cy+2,2,76,8,39,inside);
  // West face: open niche over two low drawers. East face: wide drawer over two stools.
  b(cx,cy+2,2,76,4,44);b(cx,cy+2,2,76,1.6,27);b(cx,cy,2,2,42,7);b(cx,cy+78,2,2,42,7);
  const actors=[],drawers=[],stools=[];
  const action=(id,name,x,y,h,verbs,apply)=>{const a={id,name,x,y,h,room:'living',range:145,on:false,p:0,verbs,apply};actors.push(a);return a;};
  function pull(parent,x,y,z,w=8){b(x,y,w,1,4,z,steel,parent,.3);b(x+.8,y-.25,w-1.6,1.2,1.2,z+.5,rubber,parent,.2);}
  function drawer(id,y,d,wide=false){const part=g(id),faceX=wide?1158:1100,bodyX=wide?1131:1102,z=wide?36:9,h=wide?11:16;
    b(bodyX,y,25,d,1.4,z,inside,part);for(const yy of [y,y+d-1.2])b(bodyX,yy,25,1.2,h-1.5,z+1.4,inside,part);b(wide?bodyX:bodyX+23.6,y,1.4,d,h-1.5,z+1.4,inside,part);b(faceX,y,1.6,d,h,z,pale,part);
    // Recessed pull is on the outward vertical face, with an inset dark grip.
    b(wide?faceX+1.65:faceX-.35,y+d/2-4,.35,8,4,z+h/2-2,steel,part,.25);b(wide?faceX+2:faceX-.6,y+d/2-3,.25,6,1.2,z+h/2-1,rubber,part,.15);
    const a=action(id,wide?'島語・正面單抽屜':'島語・背面收納抽屜',wide?1162:1099,y+d/2,z+h/2,['拉開收納抽屜','收起收納抽屜'],p=>part.position.x=(wide?21:-21)*p);a.available=()=>!walking||(wide?walkX>1129:walkX<1129);drawers.push({part,a,y,d,wide});return a;
  }
  drawer('coffee-drawer-left',803,35);drawer('coffee-drawer-right',842,35);drawer('coffee-drawer-wide',809,62,true);
  function caster(x,y){const plate=b(x-2,y-2,4,4,1.2,5.5,rim);const wheel=new T.Mesh(new T.CylinderGeometry(2.55,2.55,1.9,24),rubber);wheel.rotation.z=Math.PI/2;wheel.position.copy(W(x,y,2.9));root.add(wheel);const hub=new T.Mesh(new T.CylinderGeometry(1.5,1.5,2.05,20),rim);hub.rotation.copy(wheel.rotation);hub.position.copy(wheel.position);root.add(hub);b(x-2,y-1,4,2,3,3.5,rim);b(x-2,y+1,4,1.5,.7,4,steel);}
  for(const x of [1103,1157])for(const y of [803,877])caster(x,y);
  const carrier=g('isle-lifting-carrier');b(cx,cy,60,80,2,49,pale,carrier,.75);
  const flap=new T.Group();flap.name='isle-folding-leaf';flap.position.copy(W(1160,840,51));carrier.add(flap);const leaf=new T.Mesh(new T.BoxGeometry(60,2,80,1,1,1),pale);leaf.position.set(-30,1,0);leaf.castShadow=leaf.receiveShadow=true;flap.add(leaf);
  for(const y of [811,869]){b(1158.5,y,2.2,4,.4,50.4,rim,carrier,.15);}
  const arms=[];for(const y of [806,874])for(const x of [1106,1147]){const bar=new T.Mesh(new T.BoxGeometry(1.3,1,2.2),steel);root.add(bar);arms.push({bar,x,y});}
  let cup=null,cupBase=null,clearCup=null,lift=null,expand=null;
  function syncTop(){const p=lift?.p||0,q=expand?.p||0,slide=-30*p,raise=21*p+2*p*q;carrier.position.set(slide,raise,0);flap.rotation.z=-Math.PI*q;for(const a of arms){const from=W(a.x,a.y,39),to=W(a.x+slide+2,a.y,48+raise),delta=to.clone().sub(from);a.bar.position.copy(from).add(to).multiplyScalar(.5);a.bar.scale.y=delta.length();a.bar.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());}if(cup&&cupBase){cup.position.set(cupBase.x+slide,cupBase.y+21*p,cupBase.z);cup.visible=!clearCup.on;}renderer.shadowMap.needsUpdate=true;}
  lift=action('coffee-lift','島語・升降桌板',1130,796,59,['升起島語桌板','降低島語桌板'],()=>syncTop());
  expand=action('coffee-expand','島語・翻折加倍桌面',1162,840,75,['展開為 80 × 120 cm 桌面','折回 80 × 60 cm 桌面'],()=>syncTop());expand.available=()=>lift.p>.98;expand.guard=()=>lift.p>.98&&(!cup||clearCup.on);expand.blockedMessage='請先升起桌板，並收好桌面茶杯，再展開桌面';lift.guard=()=>expand.p<.01&&!expand.on;lift.blockedMessage='請先折回加倍桌面，再降低茶几';
  clearCup=action('coffee-clear-top','島語・桌面茶杯',1128,840,61,['收好桌面茶杯','放回桌面茶杯'],()=>syncTop());clearCup.guard=()=>!expand.on;clearCup.blockedMessage='請先收合加倍桌面，再放回茶杯';
  for(const [index,y]of [804,842].entries()){
    const stool=g('isle-storage-stool-'+index);b(1130,y,29,34,2,2,inside,stool);for(const xx of [1130,1157.4])b(xx,y,1.6,34,27,4,pale,stool);for(const yy of [y,y+32.4])b(1131.6,yy,25.8,1.6,27,4,pale,stool);for(const xx of [1133,1154])for(const yy of [y+3,y+31])b(xx,yy,2.5,2.5,2,0,rubber,stool);
    const lid=new T.Group();lid.position.copy(W(1130,y+17,31));stool.add(lid);const pad=new T.Mesh(new T.BoxGeometry(30,3,35),seat);pad.position.set(14.5,1.5,0);pad.castShadow=pad.receiveShadow=true;lid.add(pad);
    const pullActor=action('coffee-stool-'+index,`島語・收納凳 ${index+1}`,1162,y+17,29,['拉出收納凳','收回收納凳'],p=>stool.position.x=33*p);pullActor.available=()=>!walking||walkX>1129;
    const lidActor=action('coffee-stool-lid-'+index,`島語・凳下置物 ${index+1}`,1180,y+17,38,['掀開凳面收納','蓋回凳面'],p=>lid.rotation.z=p*1.35);lidActor.available=()=>pullActor.p>.98;lidActor.guard=()=>pullActor.p>.98;lidActor.blockedMessage='先拉出收納凳，才可掀開凳面';pullActor.guard=()=>lidActor.p<.01&&!lidActor.on;pullActor.blockedMessage='請先蓋回凳面，再收回茶几底下';stools.push({stool,y,pullActor,lidActor});
  }
  // Full table and unfolded surface use the manufacturer dimensions, never the old footprint.
  const f=furniture.find(f=>f.name===key);Object.assign(f,{x:1100,y:800,w:60,d:80});const label=[...svg.querySelectorAll('text')].find(t=>t.textContent===key);if(label){const r=label.previousElementSibling;if(r?.tagName==='rect')for(const [k,v]of Object.entries({x:1100,y:220,width:60,height:80}))r.setAttribute(k,v);label.setAttribute('x',1130);label.setAttribute('y',260);}
  Object.assign(designSpecs.living,{table:[1100,800,60,80],tableClosedSize:[80,60,53],tableOpenSize:[80,120,74],tableOpenBounds:[1070,800,120,80],tableModel:'NUANYU Isle Whisper 80x60x53 / 80x120x74',sofaToTable:35,tableToTvWall:60});Object.assign(B1_REVIEW.clearances,{sofaToTable:35,tableToTV:60});
  const previousStand=canStand;canStand=(x,y)=>previousStand(x,y)&&!(expand.p>.15&&x>1058&&x<1202&&y>788&&y<892)&&!stools.some(s=>s.pullActor.p>.1&&x>1118+33*s.pullActor.p&&x<1171+33*s.pullActor.p&&y>s.y-12&&y<s.y+46);
  expand.blocked=()=>walking&&!expand.on&&walkX>1058&&walkX<1202&&walkY>788&&walkY<892;
  // Remove old books/decor that otherwise float at the former 74cm tabletop.
  const oldProps=[];scene.traverse(o=>{let parent=o;while(parent){if(parent.userData.furnitureName)return;parent=parent.parent;}const p=o.geometry?.parameters;if(o.isMesh&&p&&o.position.x+750>1097&&o.position.x+750<1169&&700-o.position.z>785&&700-o.position.z<895&&o.position.y>50&&o.position.y<95)oldProps.push(o);});for(const o of oldProps)o.removeFromParent();
  B1_MODELS.actors.push(...actors);syncTop();
  const ready=B1_REMAKE.ready.then(()=>{cup=scene.getObjectByName('remake-porcelain-teacup');if(cup){scene.attach(cup);const bounds=new T.Box3().setFromObject(cup),center=bounds.getCenter(new T.Vector3());cup.position.add(W(1128,840,53+(bounds.max.y-bounds.min.y)/2).sub(center));cupBase=cup.position.clone();syncTop();}const source=wardrobeDoors.find(m=>m.material.normalMap)?.material;if(source)for(const m of [pale,inside]){m.map=source.map;m.normalMap=source.normalMap;m.normalScale.set(.08,.08);m.roughnessMap=source.roughnessMap;m.needsUpdate=true;}let count=0;root.traverse(o=>{if(o.isMesh)count++;});B1_MODELS.coverage[key]=count;return true;});
  configs.living.title='伴木灰沙發 × 島語升降翻折茶几';configs.living.text='島語依官方規格重建：收合 80 × 60 × 53 cm、展開 80 × 120 × 74 cm。一面為單抽屜與兩張可上掀收納凳，另一面為開放格與雙抽屜。先升起、清空桌面再翻折展開；淺木紋、黑色嵌入把手與腳輪依商品實圖製作。';if(selected==='living')document.querySelector('#description').textContent=configs.living.text;
  window.B1_ISLE={root,carrier,flap,actors,drawers,stools,ready,snapshot:()=>({closed:[80,60,53],open:[80,120,74],lift:lift.p,expand:expand.p,carrier:[carrier.position.x,carrier.position.y],stools:stools.map(s=>({out:s.pullActor.p,lid:s.lidActor.p})),cupVisible:cup?.visible,cupBottom:cup?new T.Box3().setFromObject(cup).min.y:null})};
})();
