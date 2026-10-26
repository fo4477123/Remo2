/* OSM map: x east, y south (m). Indoor CAD: x east, y north (cm). */
(() => {
  const version=2,origin=[2400,800],toWorld=p=>[origin[0]+p[0]*100,origin[1]-p[1]*100],toMap=(x,y)=>[(x-origin[0])/100,(origin[1]-y)/100],normal=n=>[n[0],-n[1]],heading=(dx,dy)=>Math.atan2(dx,-dy);
  const bounds=([x,y,w,d])=>[...toWorld([x,y+d]),w*100,d*100];
  function migrateParking(parked,sourceVersion){if(!parked||typeof parked!=='object')return null;const out={};for(const type of ['car','scooter','cycle']){const p=parked[type];if(!p||![p.x,p.y,p.heading].every(Number.isFinite))continue;out[type]=sourceVersion===version?{...p}:{x:p.x,y:origin[1]*2-p.y,heading:Math.atan2(Math.sin(p.heading),-Math.cos(p.heading))};}return out;}
  const api={version,origin,toWorld,toMap,normal,heading,bounds,migrateParking};if(typeof module!=='undefined'&&module.exports)module.exports=api;else window.B1_CITY_GEO=api;
})();
