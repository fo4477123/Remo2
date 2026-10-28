// Verify an ordinary URL, without a renderer query parameter.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
let source=fs.readFileSync(path.join(__dirname,'qa-city.cjs'),'utf8');
source=source.replace('index.html?renderer=${mode}','index.html');
const start=source.indexOf(" console.log('Ready'"),end=source.lastIndexOf('})().catch');
if(start<0||end<start)throw Error('City QA harness changed');
source=source.slice(0,start)+`
 const info=await ev('({backend:B1_ENGINE.backend,reason:B1_ENGINE.reason,ready:B1_ENGINE.ready})');
 console.log('Default renderer',info);assert.equal(info.backend,'webgl2');assert(info.ready);
 assert.equal(exceptions.length,0,'No browser errors');console.log('PASS default URL uses WebGL2');
`+source.slice(end);
vm.runInThisContext('(function(require,__dirname){'+source+'\n})',{filename:path.join(__dirname,'qa-engine-default-runtime.cjs')})(require,__dirname);
