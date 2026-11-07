module.exports=async({ev,shot,assert,cdp,sleep})=>{
  const ids=await ev('B1_TAIWAN_TRAFFIC.specs.map(s=>s.id)');assert.equal(ids.length,13);assert(ids.includes('fox-d')&&ids.includes('model-3'));
  for(const id of (process.argv.includes('--foxtron')?['fox-b','fox-c']:[...ids,'model-y'])){
    const report=await ev(`(()=>{const c=B1_VEHICLE_GALLERY.show(${JSON.stringify(id)}),box=new T.Box3().setFromObject(c.group),size=box.getSize(new T.Vector3());let finite=true,triangles=0;c.group.traverse(o=>{if(o.isMesh){const p=o.geometry.attributes.position;finite&&=Array.from(p.array).every(Number.isFinite);triangles+=(o.geometry.index?.count||p.count)/3;}});return {id:c.spec.id,wheels:c.wheels.length,finite,size:size.toArray(),triangles,features:c.features||c.group.userData.features};})()`);
    console.log(report);assert(report.finite,id+' finite vertices');assert.equal(report.wheels,4);assert(report.size.every(v=>v>0&&Number.isFinite(v)));if(id==='model-y')assert(report.features.includes('licensed-2025-model'),'real imported comparison asset');
    if(id==='fox-t'){assert(report.size[1]<=321,'Model T has no elevated rooftop pack');assert.equal(await ev("B1_VEHICLE_GALLERY.models.get('fox-t').group.userData.batteryLocation"),'chassis');}
    if(id==='fox-b')assert(await ev("B1_VEHICLE_GALLERY.models.get('fox-b').spec.name.includes('Bria')"));
    if(id==='fox-c')assert(await ev("B1_VEHICLE_GALLERY.models.get('fox-c').spec.name.includes('Cavira')"));
    if(id==='fox-b'||id==='fox-c'){
      const runningGear=await ev(`(()=>{const c=B1_VEHICLE_GALLERY.models.get(${JSON.stringify(id)});return {trim:c.spec.trim,tyre:c.spec.tyreSpec,axles:[-1,1].map(sign=>{const w=c.wheels.filter(w=>Math.sign(w.position.z)===sign);return Math.abs(w[0].position.x-w[1].position.x);}),diameter:new T.Box3().setFromObject(c.wheels[0]).getSize(new T.Vector3()).y};})()`);
      assert.equal(runningGear.trim,'Pioneer');assert.equal(runningGear.tyre,id==='fox-b'?'235/40 R20':'245/45 R19');
      assert(Math.abs(runningGear.axles[1]-163.9)<.01,'Pioneer front track from official brochure');assert(Math.abs(runningGear.axles[0]-(id==='fox-b'?163.8:163.5))<.01,'Pioneer rear track from official brochure');
      assert(Math.abs(runningGear.diameter-(id==='fox-b'?69.6:70.31))<.8,'Pioneer tyre diameter from sidewall specification');
      assert(await ev(`(()=>{const badge=B1_VEHICLE_GALLERY.models.get(${JSON.stringify(id)}).high.getObjectByName('official-tailgate-emblem');if(!badge)return false;badge.geometry.computeBoundingBox();return badge.geometry.boundingBox.max.z<0&&badge.geometry.attributes.position.count>100;})()`),id+' has a visible rear emblem mesh, not only the front badge');
      const mouth=await ev(`(()=>{const c=B1_VEHICLE_GALLERY.models.get(${JSON.stringify(id)}),s=c.spec,p=B1_VEHICLE_FACES.profiles[s.id],y=(p.ductInlet[0][1]+p.ductInlet[2][1])*s.height/2;c.group.updateMatrixWorld(true);const ray=new T.Raycaster(new T.Vector3(0,y,s.length/2+30),new T.Vector3(0,0,-1)),hits=ray.intersectObject(c.high,true);return {firstDepth:hits[0]?.distance,lamps:c.lamps.length};})()`);
      console.log(id,'front duct',mouth);assert(mouth.firstDepth>40,id+' forward duct mouth has no surface cap');assert(mouth.lamps>=1,id+' headlight meshes survive material batching');
      const ramp=await ev(`(()=>{const c=B1_VEHICLE_GALLERY.models.get(${JSON.stringify(id)});let badge;c.high.traverse(o=>{if(o.name==='ramp-conforming-foxtron-wordmark')badge=o;});if(!badge)return null;const p=badge.geometry.attributes.position,z=Array.from({length:p.count},(_,i)=>p.getZ(i));return {depth:Math.max(...z)-Math.min(...z),vertices:p.count};})()`);
      assert(ramp&&ramp.depth>1&&ramp.vertices>100,id+' wordmark follows inclined surface instead of a flat plane');
      const wells=await ev(`(()=>{const c=B1_VEHICLE_GALLERY.models.get(${JSON.stringify(id)}),s=c.spec,r=B1_VEHICLE_SCULPT.shapes[s.id].wheelRadius;c.group.updateMatrixWorld(true);return [-1,1].flatMap(side=>[-1,1].map(axle=>{const ray=new T.Raycaster(new T.Vector3(side*(s.width+20),2*r+2,axle*s.axle/2),new T.Vector3(-side,0,0));return ray.intersectObject(c.high,true)[0]?.distance??Infinity;}));})()`);
      assert(wells.every(d=>Number.isFinite(d)&&d<190),id+' wheel houses block the background above all four tyres');
      const channels=await ev(`(()=>{const c=B1_VEHICLE_GALLERY.models.get(${JSON.stringify(id)});let ports;c.high.traverse(o=>{if(o.userData.fenderDucts)ports=o.userData.fenderDucts;});return (ports||[]).map(p=>{const a=new T.Vector3(...p.entry),b=new T.Vector3(...p.exit),d=b.sub(a).normalize(),ray=new T.Raycaster(a.clone().addScaledVector(d,-10),d);return ray.intersectObject(c.high,true)[0]?.distance??null;});})()`);
      console.log(id,'open fender ducts',channels);assert.equal(channels.length,4);assert(channels.every(d=>d===null||d>18),id+' fender ducts have no shallow closing plate');
      const clearance=await ev(`(()=>{const c=B1_VEHICLE_GALLERY.models.get(${JSON.stringify(id)}),r=B1_VEHICLE_SCULPT.shapes[c.spec.id].wheelRadius;let ports;c.high.traverse(o=>{if(o.userData.fenderDucts)ports=o.userData.fenderDucts;});return ports.map(p=>Math.min(...p.upperRim.map(q=>q[1]))-2*r);})()`);
      console.log(id,'vent upper-edge clearance above tyre',clearance);assert(clearance.every(v=>v>5),id+' front and rear duct upper edges exceed tyre crown');
      const fittings=await ev(`(()=>{const c=B1_VEHICLE_GALLERY.models.get(${JSON.stringify(id)}),mirrors=[];c.group.updateMatrixWorld(true);c.high.traverse(o=>{if(o.name==='mirror-reflective-face'){o.geometry.computeBoundingBox();const p=o.geometry.boundingBox.getCenter(new T.Vector3()).applyMatrix4(o.matrixWorld),ray=new T.Raycaster(p.clone().add(new T.Vector3(0,0,-15)),new T.Vector3(0,0,1)),hit=ray.intersectObject(c.high,true)[0];mirrors.push(hit?.object===o);}});const lamp=c.high.getObjectByName('spoiler-third-brake-lamp'),visible=[];if(lamp){const pos=lamp.geometry.attributes.position,rings=pos.count/6;for(const ring of [0,Math.floor(rings/2),rings-1]){const p=new T.Vector3();for(let i=0;i<5;i++)p.add(new T.Vector3().fromBufferAttribute(pos,ring*6+i));p.multiplyScalar(.2).applyMatrix4(lamp.matrixWorld);const ray=new T.Raycaster(p.clone().add(new T.Vector3(0,0,-10)),new T.Vector3(0,0,1));visible.push(ray.intersectObject(c.high,true)[0]?.object===lamp);}}return {mirrors,stopLamp:visible};})()`);
      assert.equal(fittings.mirrors.length,2);assert(fittings.mirrors.every(Boolean),id+' mirror glass is not buried in its housing');
      assert.equal(fittings.stopLamp.length,3);assert(fittings.stopLamp.every(Boolean),id+' third brake lamp is exposed across the spoiler trailing edge');
    }
    if(id==='model-3'){
      assert(report.features.includes('licensed-2018-model'),'Downloaded Model 3 is actually used');
      assert(await ev("Math.abs(new T.Box3().setFromObject(B1_VEHICLE_GALLERY.models.get('model-3').high).getSize(new T.Vector3()).z-469.4)<2"),'Imported Model 3 length is in centimetres');
      const asset=await ev(`(()=>{const c=B1_VEHICLE_GALLERY.models.get('model-3');return {name:c.spec.name,lamps:c.lamps.length,parts:c.wheels.map(w=>w.children.length),pivots:c.wheels.map(w=>w.position.toArray())};})()`);
      assert(asset.name.includes('2018')&&!asset.name.includes('Highland'));assert(asset.lamps>=2);assert(asset.parts.every(n=>n>0));assert.equal(new Set(asset.pivots.map(p=>Math.sign(p[0])+','+Math.sign(p[2]))).size,4,'One pivot in each wheel quadrant');
    }
    for(const angle of ['front','side','rear',...(['fox-b','fox-c','model-3'].includes(id)?['frontFlat','profile','rearFlat','hood','nose','tailgate','pillar','charge','mirror','wheel','interior']:[])]){await ev(`B1_VEHICLE_GALLERY.show(${JSON.stringify(id)},${JSON.stringify(angle)});true`);await ev("document.querySelector('aside').hidden=true");await shot(id+'-'+angle);await ev("document.querySelector('aside').hidden=false");}
    if(id!=='model-y'){
      const lod=await ev(`(()=>{const c=B1_VEHICLE_GALLERY.models.get(${JSON.stringify(id)});c.setDetail(false);const far=c.detail();c.setDetail(true);const near=c.detail(),before=c.wheels.map(w=>w.rotation.x);c.animateWheels(.5);return {far,near,rotates:c.wheels.every((w,i)=>Math.abs(w.rotation.x-before[i]-.5)<.001)};})()`);assert(!lod.far&&lod.near&&lod.rotates,id+' LOD / rolling');
    }
  }
  if(process.argv.includes('--foxtron'))return;
  const lights=await ev(`(()=>{const a=B1_TAIWAN_TRAFFIC.create('model-3','#ababab'),b=B1_TAIWAN_TRAFFIC.create('model-3','#ababab');a.lamps[0].material.emissiveIntensity=3;return {attached:a.lamps.every(l=>!!l.parent),isolated:b.lamps[0].material.emissiveIntensity!==3};})()`);assert(lights.attached&&lights.isolated,'Headlights survive batching and do not affect other cars');
  // Registry selection, reference toggle, drag and mobile framing use the public UI.
  await ev(`document.querySelector('#model').value='fox-d';document.querySelector('#model').dispatchEvent(new Event('change'));document.querySelector('#compare').click()`);
  assert(await ev("document.querySelector('#name').textContent.includes('Model Y')"));await ev("document.querySelector('#compare').click()");assert(await ev("document.querySelector('#name').textContent.includes('Model D')"));
  await ev("document.querySelector('[data-angle=side]').click();document.querySelector('#compare3').click()");
  assert(await ev("document.querySelector('#name').textContent.includes('Model 3')&&document.querySelector('#compare3').getAttribute('aria-pressed')==='true'"));
  await shot('model-3-side-comparison');
  await ev("document.querySelector('#compare3').click()");assert(await ev("document.querySelector('#name').textContent.includes('Model D')"));
  await cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await sleep(300);assert(await ev('document.documentElement.scrollWidth<=innerWidth'),'Mobile width');await shot('gallery-mobile');
};
