// Focused A18 service checks use the same browser harness as qa-city.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
let source=fs.readFileSync(path.join(__dirname,'qa-city.cjs'),'utf8');
const start=source.indexOf(" console.log('Ready'");
const end=source.lastIndexOf('})().catch');
if(start<0||end<start)throw Error('City QA harness changed');
source=source.slice(0,start)+`
 await ev('B1_CITY.start()');
 await shot('community-street');
 await ev('walkYaw+=Math.PI');await sleep(500);await shot('community-behind');
 const info=await ev("(()=>{const s=B1_CITY.snapshot(),d=B1_CITY.mapData();return {landmarks:s.landmarks.filter(x=>/qingpu-(police|fire)/.test(x.id)),stores:d.shops.filter(x=>x.kind==='convenience'),report:B1_CITY.scenery().report.publicSafety};})()");
 console.log('Public safety and stores',JSON.stringify(info));
 assert.equal(info.report.length,2);assert.equal(info.landmarks.length,2);assert(info.landmarks.every(l=>l.free));
 for(const name of ['7-Eleven','全家便利商店','萊爾富'])assert(info.stores.some(s=>s.name===name));
 await ev("(()=>{B1_A18_LIFE.ensure('hsr');return true})()");
 const targets=await ev("B1_NEIGHBORHOOD.zones['a18-hsr'].targets.filter(x=>x.activity?.startsWith('convenience-')).map(x=>x.activity)");
 assert.deepEqual(targets,['convenience-0','convenience-1','convenience-2']);
 assert.equal(exceptions.length,0,'No browser errors');
 console.log('PASS mapped services, free approaches, three store brands and station display interactions');
`+source.slice(end);
vm.runInThisContext('(function(require,__dirname){'+source+'\n})',{filename:path.join(__dirname,'qa-services-runtime.cjs')})(require,__dirname);
