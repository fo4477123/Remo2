/* Warm practical light and stronger directional contrast without extra shadow cubemaps. */
(() => {
  const practical=[];
  function pool(world,x,y,h,color,power,distance){const light=new T.PointLight(color,power,distance,2);light.position.copy(W(x,y,h));light.castShadow=false;world.add(light);practical.push({light,power});}
  pool(scene,1157,445,245,'#ffe5bb',650,420);pool(scene,1515,740,245,'#e7edff',450,450);pool(scene,1490,260,245,'#ffe3b3',500,420);
  for(const z of Object.values(B1_NEIGHBORHOOD.zones)){if(z.id==='city'||z.scene===scene)continue;for(const o of z.scene.children)if(o.isHemisphereLight)o.intensity*=.55;if(z.id==='lobby'){pool(z.scene,2500,1910,275,'#ffe2ac',850,560);pool(z.scene,2500,2710,275,'#ffe2ac',850,600);pool(z.scene,2500,3310,275,'#dce9f5',600,470);}else if(z.floor===1)pool(z.scene,z.spawn[0],z.spawn[1]-250,245,'#ffe0ae',650,420);}
  const shadow=new T.SpotLight('#ffe8bd',11000,900,.85,.7,1.5);shadow.position.copy(W(1510,760,275));shadow.target.position.copy(W(1580,790,0));shadow.castShadow=B1_ENGINE.quality==='high';shadow.shadow.mapSize.set(512,512);shadow.shadow.bias=-.0005;scene.add(shadow,shadow.target);
  function setMood(mode){for(const p of practical)p.light.intensity=p.power*(mode==='night'?1.25:mode==='dusk'?1:.65);shadow.intensity=mode==='night'?6500:11000;renderer.shadowMap.needsUpdate=true;}
  window.B1_ATMOSPHERE={setMood,practical,shadow};setMood('day');
})();
