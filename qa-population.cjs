// Verify crowd variety, child scale and streaming around the player.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
let source=fs.readFileSync(path.join(__dirname,'qa-city.cjs'),'utf8');
const start=source.indexOf(" console.log('Ready'"),end=source.lastIndexOf('})().catch');
if(start<0||end<start)throw Error('City QA harness changed');
source=source.slice(0,start)+`
 await ev('B1_CITY.start()');await sleep(1200);
 const population=await ev("(()=>{const p=B1_CITY.pedestrians();return {count:p.length,looks:[...new Set(p.map(x=>x.rig.root.userData.variant+':'+x.rig.root.userData.appearance))].length,children:p.filter(x=>x.rig.root.userData.child).length,heights:p.filter(x=>x.rig.root.userData.child).slice(0,2).map(x=>new THREE.Box3().setFromObject(x.rig.root).getSize(new THREE.Vector3()).y),crowd:B1_CROWD.snapshot()};})()");
 console.log('Population',population);assert(population.count>=50&&population.looks>=50,'At least 50 combinations');assert(population.children>=1,'Children present');assert(population.heights.every(h=>h>100&&h<155),'Shorter child figures');assert(population.crowd.detailed<=2,'Low-quality detail budget');
 const before=await ev("(()=>{const p=B1_CITY.pedestrians();window.populationBefore=Object.fromEntries(p.map(x=>[x.id,[x.x,x.y]]));for(const s of B1_CITY.geometry().segments){const q=B1_CITY_GEO.toWorld([(s.a[0]+s.b[0])/2,(s.a[1]+s.b[1])/2]);if(B1_CITY.pedestrianClear(...q,35)&&p.filter(x=>Math.hypot(x.x-q[0],x.y-q[1])<9000).length<3&&p.filter(x=>Math.hypot(x.x-q[0],x.y-q[1])>18000).length>10){walkX=q[0];walkY=q[1];return p.filter(x=>Math.hypot(x.x-walkX,x.y-walkY)<9000).length;}}throw Error('No sparse test area');})()");
 await sleep(6500);const after=await ev("(()=>{const p=B1_CITY.pedestrians(),recycled=p.filter(x=>Math.hypot(x.x-populationBefore[x.id][0],x.y-populationBefore[x.id][1])>10000);return {near:p.filter(x=>Math.hypot(x.x-walkX,x.y-walkY)<9000).length,recycled:recycled.length,legal:recycled.every(x=>B1_CITY.pedestrianClear(x.x,x.y,25)&&!B1_CITY.waterAt(x.x,x.y,25))};})()");console.log('Crowd streaming',before,after);assert(after.recycled>0&&after.near>before&&after.legal,'Nearby crowd replenishes on legal ground');
 assert.equal(exceptions.length,0);console.log('PASS crowd variety, child proportions, and nearby streaming');await cdp('Browser.close');
`+source.slice(end);
vm.runInThisContext('(function(require,__dirname){'+source+'\n})',{filename:path.join(__dirname,'qa-population-runtime.cjs')})(require,__dirname);
