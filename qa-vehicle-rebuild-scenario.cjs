module.exports=async({ev,shot,assert,cdp,sleep})=>{
  const ids=await ev('B1_TAIWAN_TRAFFIC.specs.map(s=>s.id)');assert.equal(ids.length,13);assert(ids.includes('fox-d')&&ids.includes('model-3'));
  for(const id of [...ids,'model-y']){
    const report=await ev(`(()=>{const c=B1_VEHICLE_GALLERY.show(${JSON.stringify(id)}),box=new T.Box3().setFromObject(c.group),size=box.getSize(new T.Vector3());let finite=true,triangles=0;c.group.traverse(o=>{if(o.isMesh){const p=o.geometry.attributes.position;finite&&=Array.from(p.array).every(Number.isFinite);triangles+=(o.geometry.index?.count||p.count)/3;}});return {id:c.spec.id,wheels:c.wheels.length,finite,size:size.toArray(),triangles,features:c.features||c.group.userData.features};})()`);
    console.log(report);assert(report.finite,id+' finite vertices');assert.equal(report.wheels,4);assert(report.size.every(v=>v>0&&Number.isFinite(v)));if(id==='model-y')assert(report.features.includes('licensed-2025-model'),'real imported comparison asset');
    if(id==='fox-t'){assert(report.size[1]<=321,'Model T has no elevated rooftop pack');assert.equal(await ev("B1_VEHICLE_GALLERY.models.get('fox-t').group.userData.batteryLocation"),'chassis');}
    if(id==='fox-b')assert(await ev("B1_VEHICLE_GALLERY.models.get('fox-b').spec.name.includes('Bria')"));
    if(id==='fox-c')assert(await ev("B1_VEHICLE_GALLERY.models.get('fox-c').spec.name.includes('Cavira')"));
    if(id==='model-3'){
      assert(report.features.includes('licensed-2018-model'),'Downloaded Model 3 is actually used');
      assert(await ev("Math.abs(new T.Box3().setFromObject(B1_VEHICLE_GALLERY.models.get('model-3').high).getSize(new T.Vector3()).z-469.4)<2"),'Imported Model 3 length is in centimetres');
      const asset=await ev(`(()=>{const c=B1_VEHICLE_GALLERY.models.get('model-3');return {name:c.spec.name,lamps:c.lamps.length,parts:c.wheels.map(w=>w.children.length),pivots:c.wheels.map(w=>w.position.toArray())};})()`);
      assert(asset.name.includes('2018')&&!asset.name.includes('Highland'));assert(asset.lamps>=2);assert(asset.parts.every(n=>n>0));assert.equal(new Set(asset.pivots.map(p=>Math.sign(p[0])+','+Math.sign(p[2]))).size,4,'One pivot in each wheel quadrant');
    }
    for(const angle of ['front','side','rear',...(['fox-b','fox-c','model-3'].includes(id)?['wheel','interior']:[])]){await ev(`B1_VEHICLE_GALLERY.show(${JSON.stringify(id)},${JSON.stringify(angle)});true`);await shot(id+'-'+angle);}
    if(id!=='model-y'){
      const lod=await ev(`(()=>{const c=B1_VEHICLE_GALLERY.models.get(${JSON.stringify(id)});c.setDetail(false);const far=c.detail();c.setDetail(true);const near=c.detail(),before=c.wheels.map(w=>w.rotation.x);c.animateWheels(.5);return {far,near,rotates:c.wheels.every((w,i)=>Math.abs(w.rotation.x-before[i]-.5)<.001)};})()`);assert(!lod.far&&lod.near&&lod.rotates,id+' LOD / rolling');
    }
  }
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
