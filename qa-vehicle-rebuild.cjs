// Dependency-free Chromium/CDP verification; no files are uploaded by this script.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{spawn}=require('node:child_process');
const assert=require('node:assert/strict');
const root=__dirname,outputRoot=path.join(root,'qa-output');fs.mkdirSync(outputRoot,{recursive:true});const out=fs.mkdtempSync(path.join(outputRoot,'run-'));console.log('QA artifacts: '+out);
const originalModel3=fs.readFileSync(path.join(root,'assets/models/vehicles/model-3-2018.glb'));
assert.equal(require('node:crypto').createHash('sha1').update('blob '+originalModel3.length+'\0').update(originalModel3).digest('hex'),'49b385eb2b431427e5970881868c906f4efca133','Model 3 GLB is byte-identical to its original imported asset');
const server=http.createServer((req,res)=>{const target=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!target.startsWith(root+path.sep)){res.writeHead(403).end();return;}const send=()=>fs.readFile(target,(err,data)=>{if(err){res.writeHead(404).end();return;}const ext=path.extname(target);res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html','.png':'image/png','.jpg':'image/jpeg','.glb':'model/gltf-binary','.mp3':'audio/mpeg'})[ext]||'application/octet-stream');res.end(data);});if(process.argv.includes('--slow-model3')&&target.endsWith('model-3-2018.glb'))setTimeout(send,21000);else send();});
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
 await cdp('Network.setBlockedURLs',{urls:['https://*','http://cdn.*',...(process.argv.includes('--fallback')?['*model-3-2018.glb']:[])]});
 await cdp('Page.addScriptToEvaluateOnNewDocument',{source:'localStorage.setItem("b1-gpu-quality-v1","low")'});
 const mode=process.env.B1_RENDERER||process.argv[2]||'webgl';await cdp('Page.navigate',{url:`http://127.0.0.1:${server.address().port}/vehicle-gallery.html`});
 const wait=async(ex,msg,limit=120000)=>{const end=Date.now()+limit;while(Date.now()<end){if(await ev(ex))return;await sleep(200);}throw Error(msg+' '+JSON.stringify(await ev('({load:document.querySelector("#status")?.textContent})')));};
 if(process.argv.includes('--slow-model3')){
   await wait('Boolean(window.B1_TAIWAN_TRAFFIC)&&B1_VEHICLE_IMPORTS.status.pending','Factories available before delayed GLB');
   assert(await ev(`(()=>{const v=B1_TAIWAN_TRAFFIC.create('model-3','#a9b3bc');window.lateModel3={vehicle:v,original:v.high};v.group.position.set(7,8,9);v.setDetail(false);v.animateWheels(.4);const driver=new T.Group();driver.name='late-test-driver';v.rider.add(driver);v.rider.visible=true;return v.spec.interpretation===true;})()`),'Reproduce early substitute while download is pending');
 }
 await wait('Boolean(window.B1_VEHICLE_GALLERY?.ready)','Ready');await cdp('Page.bringToFront');await cdp('Page.captureScreenshot',{format:'png'});
 if(process.argv.includes('--slow-model3')){
   const recovery=await ev(`(async()=>{const v=lateModel3.vehicle;return {grace:await B1_VEHICLE_IMPORTS.ready,loaded:B1_VEHICLE_IMPORTS.status.loaded,licensed:v.features.includes('licensed-2018-model'),interpretation:v.spec.interpretation,oldDetached:!lateModel3.original.parent,position:v.group.position.toArray(),far:!v.detail()&&!v.high.visible&&v.low.visible,wheels:v.wheels.every(w=>Math.abs(w.rotation.x-.4)<.001),driver:Boolean(v.rider.getObjectByName('late-test-driver'))&&v.rider.visible};})()`);
   console.log('Delayed Model 3 recovery',recovery);assert(!recovery.grace&&recovery.loaded&&recovery.licensed&&!recovery.interpretation&&recovery.oldDetached&&recovery.far&&recovery.wheels&&recovery.driver);assert.deepEqual(recovery.position,[7,8,9]);
 }
 if(mode==='webgpu')assert(await ev('B1_ENGINE.webgpu'),'Actual WebGPU');
 const shot=async name=>{await sleep(500);const p=await cdp('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,name+'.png'),Buffer.from(p.data,'base64'));};
 const key=async(k,down=true)=>cdp('Input.dispatchKeyEvent',{type:down?'keyDown':'keyUp',key:k});





 if(process.argv.includes('--fallback')){
 assert(await ev("!B1_VEHICLE_IMPORTS.status.loaded&&Boolean(B1_VEHICLE_IMPORTS.status.error)"),'Failed asset status is recorded');
 assert(await ev("B1_VEHICLE_GALLERY.show('model-3').wheels.length===4"),'Fallback still renders with four wheels');
 assert(await ev("B1_VEHICLE_GALLERY.models.get('model-3').spec.interpretation===true"),'Fallback is not misrepresented as imported');
 await shot('model-3-fallback');
}else await require('./qa-vehicle-rebuild-scenario.cjs')({ev,cdp,sleep,shot,assert});assert.equal(exceptions.length,0);await cdp('Browser.close');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>{ws?.close();browser?.kill();server.close();});
