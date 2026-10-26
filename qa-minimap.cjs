// Dependency-free Chromium/CDP verification; no files are uploaded by this script.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{spawn}=require('node:child_process');
const assert=require('node:assert/strict');
const root=__dirname,outputRoot=path.join(root,'qa-output');fs.mkdirSync(outputRoot,{recursive:true});const out=fs.mkdtempSync(path.join(outputRoot,'run-'));console.log('QA artifacts: '+out);
const server=http.createServer((req,res)=>{const target=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!target.startsWith(root+path.sep)){res.writeHead(403).end();return;}fs.readFile(target,(err,data)=>{if(err){res.writeHead(404).end();return;}const ext=path.extname(target);res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html','.png':'image/png','.jpg':'image/jpeg','.glb':'model/gltf-binary','.mp3':'audio/mpeg'})[ext]||'application/octet-stream');res.end(data);});});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));let browser,ws;
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const profile=fs.mkdtempSync(path.join(require('node:os').tmpdir(),'b1-browser-'));
 browser=spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',['--headless=new','--remote-debugging-port=0','--user-data-dir='+profile,'--no-first-run','--no-default-browser-check','--disable-background-networking','--enable-unsafe-swiftshader','--disable-gpu-vsync','--disable-frame-rate-limit','--disable-renderer-backgrounding','--disable-background-timer-throttling','--disable-features=CalculateNativeWinOcclusion','--enable-unsafe-webgpu','--ignore-gpu-blocklist','--enable-dawn-features=allow_unsafe_apis','--window-size=1440,1000','about:blank'],{windowsHide:true,stdio:'ignore'});
 let port;for(let i=0;i<100;i++){try{port=fs.readFileSync(path.join(profile,'DevToolsActivePort'),'utf8').split('\n')[0];break;}catch{await sleep(200);}}
 assert(port,'Chromium debugging port unavailable');
 const tabs=await (await fetch(`http://127.0.0.1:${port}/json`)).json();ws=new WebSocket((tabs.find(t=>t.url==='about:blank')||tabs.find(t=>t.type==='page')).webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));
 let id=0;const pending=new Map(),exceptions=[];ws.addEventListener('close',()=>{for(const p of pending.values())p.reject(new Error('Browser connection closed'));pending.clear();});
 ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);if(p){pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result);}}if(m.method==='Runtime.exceptionThrown'){exceptions.push(m.params.exceptionDetails);console.log('RUNTIME',JSON.stringify(m.params.exceptionDetails));}if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error'){const error=m.params.args.map(x=>x.value||x.description);exceptions.push(error);console.log('RENDER ERROR',JSON.stringify(error));}};
 const cdp=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}));});
 const ev=async expression=>{const r=await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
 await cdp('Runtime.enable');await cdp('Page.enable');await cdp('Network.enable');
 await cdp('Network.setBlockedURLs',{urls:['https://*','http://cdn.*']});
 const mode=process.env.B1_RENDERER||process.argv[2]||'webgl';await cdp('Page.navigate',{url:`http://127.0.0.1:${server.address().port}/index.html?renderer=${mode}`});
 const wait=async(ex,msg,limit=120000)=>{const end=Date.now()+limit;while(Date.now()<end){if(await ev(ex))return;await sleep(200);}throw Error(msg+' '+JSON.stringify(await ev('({engine:window.B1_ENGINE?.ready,ready:window.B1_REVIEW?.ready,load:loading.textContent})')));};
 await wait('Boolean(window.B1_REVIEW?.ready&&window.B1_ENGINE?.ready&&window.B1_GAME)','Ready');await ev('(()=>{const q=document.querySelector("select[aria-label=畫質]");q.value="low";q.dispatchEvent(new Event("change"));})()');await cdp('Page.bringToFront');await cdp('Page.captureScreenshot',{format:'png'});
 if(mode==='webgpu')assert(await ev('B1_ENGINE.webgpu'),'Actual WebGPU');
 const shot=async name=>{await sleep(500);const p=await cdp('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,name+'.png'),Buffer.from(p.data,'base64'));};
 const key=async(k,down=true)=>cdp('Input.dispatchKeyEvent',{type:down?'keyDown':'keyUp',key:k});




 await ev('B1_CITY.start();keys.clear()');const samples=[];
 for(const [name,yaw]of [['north',0],['east',Math.PI/2],['south',Math.PI],['west',-Math.PI/2]]){
  await ev('(()=>{const p=B1_CITY.mapData().sites.station.center,world=B1_CITY_GEO.toWorld([p[0],p[1]+100]);walkX=world[0];walkY=world[1];walkYaw='+yaw+';lookPitch=0;})()');await sleep(220);
  const sample=await ev('(()=>{const f=B1_CITY.minimapFrame(),c=document.querySelector(".city-minimap"),ctx=c.getContext("2d"),p=B1_CITY.mapData().sites.station.center,center=B1_CITY_GEO.toMap(walkX,walkY),offset=B1_CITY_GEO.minimapOffset(p,center,f.yaw),x=Math.round(120+offset[0]),y=Math.round(120+offset[1]);return{frame:f,marker:[x,y],landmark:[...ctx.getImageData(x,y,1,1).data],arrow:[...ctx.getImageData(120,118,1,1).data],label:c.getAttribute("aria-label")};})()');samples.push({name,...sample});assert.equal(sample.frame.mode,'heading-up');assert.deepEqual(sample.frame.arrow,[0,-1]);assert(Math.abs(sample.frame.yaw-yaw)<.001);assert.deepEqual(sample.landmark.slice(0,3),[188,149,88],'Actual station dot rotates to expected canvas pixel '+name);assert.deepEqual(sample.arrow.slice(0,3),[255,247,227],'Actual centre arrow stays screen-up '+name);await shot('minimap-'+name);
 }
 assert(samples[0].frame.north[1]<-100&&samples[1].frame.north[0]<-100&&samples[2].frame.north[1]>100&&samples[3].frame.north[0]>100,'North compass moves around the circular edge');
 await ev('B1_CITY.recoverVehicle("car")');await sleep(150);assert(await ev('Math.abs(B1_CITY.minimapFrame().yaw-B1_CITY.avatarState().heading)<.001'),'Vehicle minimap uses vehicle forward heading');await ev('B1_CITY.openMap()');assert(await ev('document.querySelector(".city-fullmap text").textContent.includes("N ↑")'),'Full map stays north-up');await shot('full-map-north-up');
 console.log('Minimap pixels',JSON.stringify(samples));assert(await ev('B1_A18_LIFE.snapshot().venues.length===8&&B1_CITY.snapshot().geoVersion===2'),'Retains venues and geographic correction');fs.writeFileSync(path.join(out,'minimap-report.json'),JSON.stringify({backend:await ev('B1_ENGINE.backend'),samples,exceptions},null,2));console.log('PASS heading-up minimap actual pixels for four directions, fixed player arrow, rotating north compass, vehicle heading and north-up full map');
 assert.equal(exceptions.length,0,'Runtime errors '+JSON.stringify(exceptions));await cdp('Browser.close');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>{ws?.close();browser?.kill();server.close();});
