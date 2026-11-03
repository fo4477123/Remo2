module.exports=async({ev,cdp,sleep,shot,assert,key})=>{
  await ev('B1_CITY.start()');await sleep(1500);
  assert.equal(await ev('B1_CITY.traffic().snapshot().models.length'),13);
  assert(await ev("B1_CITY.ownedVehicle().group.userData.features.includes('licensed-2025-model')"),'Original owned Model Y remains imported');
  // Find a clear street pose, replace a stopped traffic instance with each new body,
  // then use F and W through the actual game handlers. No synthetic mount API.
  await ev(`window.__ownedBefore=B1_CITY.ownedVehicle();window.__trafficBefore=B1_CITY.traffic().cars.length`);
  for(const id of ['fox-d','model-3','fox-k','fox-t']){
    await ev(`B1_CITY.dismount();keys.clear()`);
    const setup=await ev(`(()=>{const traffic=B1_CITY.traffic(),c=traffic.cars.find(c=>c.p&&c.vehicle.group.visible&&c.path&&c.path.length-c.s>45);if(!c)return false;c.speed=0;const old=c.vehicle,v=B1_TAIWAN_TRAFFIC.create(${JSON.stringify(id)},'#a9b3bc');old.group.parent.add(v.group);v.group.position.copy(old.group.position);v.group.rotation.copy(old.group.rotation);old.group.removeFromParent();c.vehicle=v;v.group.visible=true;let standing=null;for(const [dx,dy]of [[300,0],[-300,0],[0,300],[0,-300]])if(B1_CITY.pedestrianClear(c.p[0]+dx,c.p[1]+dy,30)){standing=[c.p[0]+dx,c.p[1]+dy];break;}if(!standing)return false;walkX=standing[0];walkY=standing[1];window.dispatchEvent(new KeyboardEvent('keydown',{key:'f'}));return B1_CITY.snapshot().mode;})()`);
    assert.equal(setup,'borrowed',id+' takeover');await sleep(100);await key('h');
    assert(!(await ev("document.querySelector('.city-speed').textContent")).includes('undefined'),'Vehicle HUD has a name');
    const before=await ev('[walkX,walkY]');await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'w'});await sleep(1100);await cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'w'});const after=await ev('[walkX,walkY]');
    const distance=Math.hypot(after[0]-before[0],after[1]-before[1]);console.log(id,'travelled',distance.toFixed(1),'cm');assert(distance>30,id+' drives on the road');await shot('driving-'+id);
    await key('f');assert.equal(await ev('B1_CITY.snapshot().mode'),'walk',id+' dismount');await key('f');assert.equal(await ev('B1_CITY.snapshot().mode'),'borrowed',id+' reboard');
    assert(await ev('B1_CITY.ownedVehicle()===window.__ownedBefore'),'Owned Model Y preserved');
  }
  await ev('B1_CITY.dismount()');assert(await ev('B1_CITY.traffic().snapshot().detailed<=2'),'Low-quality near detail cap');
  assert(await ev('B1_CITY.traffic().cars.length===window.__trafficBefore'),'Taking cars does not empty traffic pool');
  await ev('B1_CITY.openMap()');assert(await ev("document.querySelector('.city-map a[href=\"vehicle-gallery.html\"]')!==null"),'Gallery is discoverable from city map');
};
