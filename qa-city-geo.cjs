const assert=require('node:assert/strict'),geo=require('./studio-city-geo.js'),data=require('./assets/city/a18-map.json');
const near=(a,b)=>Math.abs(a-b)<1e-8;for(const b of data.buildings)for(const p of b.points){const q=geo.toMap(...geo.toWorld(p));assert(near(p[0],q[0])&&near(p[1],q[1]));}
const base=geo.toWorld([0,0]),east=geo.toWorld([1,0]),north=geo.toWorld([0,-1]);assert(east[0]>base[0]&&north[1]>base[1]);
// W maps CAD y north to world -Z. East cross North must point Up in Three's right-handed world.
const east3=[east[0]-base[0],0,0],north3=[0,0,-(north[1]-base[1])];assert(east3[2]*north3[0]-east3[0]*north3[2]>0,'No horizontal geographic reflection');
for(const [dx,dy]of [[0,-1],[1,0],[0,1],[-1,0],[2,-3]]){const yaw=geo.heading(dx,dy),length=Math.hypot(dx,dy);assert(near(Math.sin(yaw),dx/length)&&near(-Math.cos(yaw),dy/length),'Compass/heading agrees with map');}
const old={car:{x:10000,y:-12000,heading:.7}},copy=JSON.stringify(old),migrated=geo.migrateParking(old,undefined);assert.equal(migrated.car.y,13600);assert(near(Math.sin(migrated.car.heading),Math.sin(.7))&&near(Math.cos(migrated.car.heading),-Math.cos(.7)));assert.deepEqual(geo.migrateParking(migrated,2),migrated);assert.equal(JSON.stringify(old),copy);
const bounds=geo.bounds(data.bounds);for(const p of [[data.bounds[0],data.bounds[1]],[data.bounds[0]+data.bounds[2],data.bounds[1]+data.bounds[3]]]){const [x,y]=geo.toWorld(p);assert(x>=bounds[0]&&x<=bounds[0]+bounds[2]&&y>=bounds[1]&&y<=bounds[1]+bounds[3]);}
// Local foot approach must go around a building, not draw through it.
const routing=require('./studio-a18-routing.js'),clear=p=>!(p[0]>2&&p[0]<8&&p[1]>-3&&p[1]<3),route=routing.connect([0,0],[10,0],clear);assert(route&&route.length>2);for(let i=1;i<route.length;i++)for(let j=0;j<=100;j++){const t=j/100;assert(clear([route[i-1][0]+(route[i][0]-route[i-1][0])*t,route[i-1][1]+(route[i][1]-route[i-1][1])*t]));}
console.log('PASS geographic orientation, all footprint round-trips, north/east handedness, heading/compass, old parking migration and obstacle-avoiding pedestrian approach');
