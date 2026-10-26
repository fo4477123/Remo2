/* B1-5F and the shared corridor are rendered together in one coordinate system. */
(() => {
  const hall=B1_NEIGHBORHOOD.zones.hallB5,source=hall.scene,group=new T.Group();group.name='B1-5F-continuous-corridor';group.position.set(-953,0,200);
  for(const child of [...source.children]){if(child.name.includes('environment'))continue;if(child.isHemisphereLight){child.intensity=.25;continue;}if(child.isDirectionalLight){child.intensity=.65;child.castShadow=false;}group.add(child);}scene.add(group);
  hall.bounds=[hall.bounds[0]-953,hall.bounds[1]-200,...hall.bounds.slice(2)];hall.walkAreas=hall.walkAreas.map(([x,y,w,d])=>[x-953,y-200,w,d]);hall.spawn=[1157,410,Math.PI];hall.cameraFov=42;hall.viewPitch=0;
  for(const item of [...hall.targets,...hall.units,...hall.npcs]){item.x-=953;item.y-=200;}
  for(const o of hall.obstacles){o[0]-=953;o[1]-=200;}hall.canStand=(x,y)=>(x>1120&&x<1194&&y>488&&y<536||hall.walkAreas.some(([a,b,w,d])=>x>a+14&&x<a+w-14&&y>b+14&&y<b+d-14))&&!hall.obstacles.some(([a,b,w,d])=>x>a-14&&x<a+w+14&&y>b-14&&y<b+d+14);hall.scene=scene;hall.exterior=null;hall.connectedHome=true;hall.arrivals={stairs:[1390,270,Math.PI],B:[1580,725,Math.PI/2],A:[1580,725,Math.PI/2]};scene.userData.floorAt=()=>0;
  let crossingAt=0;
  function tick(dt,now){if(!walking||now<crossingAt||!window.B1_GAME||document.querySelector('dialog[open]'))return;const zone=B1_COMMUNITY.zone;if(zone&&zone!=='hallB5')return;
    if(!zone&&walkX>1100&&walkX<1210&&walkY<485&&walkY>300){B1_COMMUNITY.travel('hallB5','walk');crossingAt=now+350;}
    else if(zone==='hallB5'&&walkX>1100&&walkX<1210&&walkY>525){B1_COMMUNITY.returnHome('entry',false,true);crossingAt=now+350;}
  }
  window.B1_SEAMLESS={group,hall,hallStand:hall.canStand,tick,snapshot:()=>({sameScene:hall.scene===scene,offset:[-953,-200],door:[1157,505],mainWidth:920,mainDepth:310,branchWidth:250})};
})();
