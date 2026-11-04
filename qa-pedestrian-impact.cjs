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
 const tabs=await (await fetch(`http://127.0.0.1:${port}/json`)).json();ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));
 let id=0;const pending=new Map(),exceptions=[];ws.addEventListener('close',()=>{for(const p of pending.values())p.reject(new Error('Browser connection closed'));pending.clear();});
 ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);if(p){pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result);}}if(m.method==='Runtime.exceptionThrown'){exceptions.push(m.params.exceptionDetails);console.log('RUNTIME',JSON.stringify(m.params.exceptionDetails));}if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error'){const error=m.params.args.map(x=>x.value||x.description);exceptions.push(error);console.log('RENDER ERROR',JSON.stringify(error));}};
 const cdp=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}));});
 const ev=async expression=>{const r=await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
 await cdp('Runtime.enable');await cdp('Page.enable');await cdp('Network.enable');
 await cdp('Network.setBlockedURLs',{urls:['https://*','http://cdn.*']});
 const mode=process.env.B1_RENDERER||'webgl';
 await cdp('Page.navigate',{url:`http://127.0.0.1:${server.address().port}/index.html?renderer=${mode}`});
 const wait=async(ex,message,ms=90000)=>{const end=Date.now()+ms;while(Date.now()<end){if(await ev(ex))return;await sleep(180);}throw Error(message+' '+JSON.stringify(await ev('({load:loading.textContent,city:window.B1_CITY?.snapshot(),errors:window.B1_REVIEW?.ready})')));};
 await wait('Boolean(window.B1_REVIEW?.ready&&window.B1_ENGINE?.ready&&window.B1_GAME)','Ready');
 await ev('(()=>{const q=document.querySelector("select[aria-label=畫質]");q.value="low";q.dispatchEvent(new Event("change"));})()');await cdp('Page.bringToFront');await cdp('Page.captureScreenshot',{format:'png'});
 if(mode==='webgpu')assert(await ev('B1_ENGINE.webgpu'),'Real WebGPU required');
 const shot=async name=>{await sleep(300);const p=await cdp('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,name+'.png'),Buffer.from(p.data,'base64'));};
 const key=async k=>{await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:k});await cdp('Input.dispatchKeyEvent',{type:'keyUp',key:k});};
 const clickText=async(selector,label)=>{const ok=await ev(`(()=>{const b=[...document.querySelectorAll(${JSON.stringify(selector+' button')})].find(b=>b.textContent===${JSON.stringify(label)});if(!b)return false;b.click();return true;})()`);assert(ok,'Missing '+label);};
 const close=async()=>await ev('document.querySelectorAll("dialog[open]").forEach(d=>d.close());keys.clear()');

 await require('./qa-pedestrian-impact-scenario.cjs')({ev,cdp,sleep,shot,assert,key});assert.equal(exceptions.length,0);await cdp('Browser.close');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>{ws?.close();browser?.kill();server.close();});
