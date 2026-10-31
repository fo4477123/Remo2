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


 await cdp('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/qa-fixtures/natural-motion.html'});
 for(let i=0;i<300&&!await ev('Boolean(window.ready)');i++)await sleep(200);assert(await ev('Boolean(window.ready)'),'Motion preview ready');
 const shot=async name=>{await ev('render()');const p=await cdp('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,name+'.png'),Buffer.from(p.data,'base64'));};
 await shot('idle');
 const walk=await ev('step(90,{distance:170/60,speed:999})');assert(walk.every(r=>Math.abs(r.velocity-170)<1&&r.runBlend<.01),'Walk follows actual displacement rather than caller speed');await shot('walk');
 const run=await ev('step(90,{distance:290/60,speed:290})');assert(run.every(r=>r.runBlend>.9&&r.pose==="run"),'Indoor sprint transitions to running');await shot('run');
 const wave=await ev('rigs.forEach(r=>r.act("wave"));step(45,{distance:170/60,speed:170})');assert(wave.every(r=>r.pose==='wave'&&r.blend>.99),'Greeting retains lower-body locomotion');await shot('wave');
 await ev('step(240);rigs.forEach(r=>r.act("hook-right"));step(15)');await shot('hook');
 const combat=await ev('(()=>{const r=rigs[0],points=[];for(let i=0;i<40;i++){r.update(1/60);r.root.updateMatrixWorld(true);points.push(r.hands[1].getWorldPosition(new T.Vector3()).toArray());}return points;})()');assert(combat.every(p=>p.every(Number.isFinite)));assert(Math.max(...combat.map(p=>p[2]))-Math.min(...combat.map(p=>p[2]))>10,'Punch extends and retracts the wrist');
 const roster=await ev('B1_CHARACTERS.variants.map(variant=>{const r=B1_CHARACTERS.create({variant}),before=r.snapshot().feet;for(let i=0;i<45;i++)r.update(1/60,{distance:2,speed:120});const after=r.snapshot().feet,footTravel=after.reduce((sum,p,i)=>sum+Math.hypot(...p.map((v,k)=>v-before[i][k])),0);r.act("wave");for(let i=0;i<30;i++)r.update(1/60);r.act("hook-left");for(let i=0;i<45;i++)r.update(1/60);return {...r.snapshot(),footTravel};})');assert.equal(roster.length,25);assert(roster.every(r=>r.feet.flat().every(Number.isFinite)),'Every skeleton has finite feet');assert(roster.every(r=>r.footTravel>.2),'Every model including children really animates its feet');
 const recovery=await ev('step(240)');assert(recovery.every(r=>r.pose==="idle"&&r.blend<.001),'Gestures return to idle');await shot('recovery');
 assert.equal(exceptions.length,0,'No runtime errors');fs.writeFileSync(path.join(out,'motion-report.json'),JSON.stringify({walk,run,wave,roster:roster.map(r=>({variant:r.variant,pose:r.pose,bones:r.bones})),exceptions},null,2));console.log('PASS natural motion: displacement cadence, walk/run blending, moving greeting, punch recovery and 25 skeletons');await cdp('Browser.close');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>{ws?.close();browser?.kill();server.close();});
