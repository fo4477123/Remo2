// Exercise actual keyboard input and skeletal poses using the fantasy browser harness.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
let source=fs.readFileSync(path.join(__dirname,'qa-fantasy.cjs'),'utf8');
const start=source.indexOf(" await ev('B1_COMMUNITY.enterLobby();keys.clear()');"),end=source.lastIndexOf('})().catch');
if(start<0||end<start)throw Error('Fantasy QA harness changed');
source=source.slice(0,start)+`
 await ev('B1_CITY.start();keys.clear()');await sleep(2800);
 const moves=['hook-left','hook-right','uppercut','low-hook'];
 for(const move of moves){await key('q');await key('q',false);assert.equal(await ev('B1_FANTASY.snapshot().lastMove'),move);await sleep(160);assert.equal(await ev('B1_PLAYER.rig.snapshot().pose'),move,'Skeletal pose '+move);await sleep(650);}
 await key('r');await key('r',false);assert.equal(await ev('B1_FANTASY.snapshot().lastMove'),'kick');await sleep(160);assert.equal(await ev('B1_PLAYER.rig.snapshot().pose'),'kick');const kickImage=await cdp('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,'kick-pose.png'),Buffer.from(kickImage.data,'base64'));await sleep(650);
 await key('t');await key('t',false);assert.equal(await ev('B1_FANTASY.snapshot().lastMove'),'stomp');await sleep(160);assert.equal(await ev('B1_PLAYER.rig.snapshot().pose'),'stomp');await sleep(650);
 await sleep(2400);await key('q');await key('q',false);assert.equal(await ev('B1_FANTASY.snapshot().lastMove'),'hook-left','Combo resets');
 assert.equal(await ev('B1_FANTASY.attack()'),false,'Cooldown blocks rapid repeat');await sleep(800);
 await ev('(()=>{const p=B1_CITY.pedestrians().find(p=>B1_CITY.pedestrianClear(p.x+140,p.y,35));if(!p)throw Error("No clear pedestrian");p.pause=performance.now()+15000;window.combatVictim=p.id;walkX=p.x+140;walkY=p.y;walkYaw=-Math.PI/2;})()');
 await key('r');await key('r',false);await sleep(450);assert(await ev('B1_FANTASY.snapshot().wounds.some(w=>w.id===combatVictim&&!w.down)'),'Kick reaches standing target');await sleep(350);
 await key('q');await key('q',false);await sleep(450);assert(await ev('B1_FANTASY.isDown(combatVictim)'),'Punch knocks target down');const before=await ev('B1_FANTASY.snapshot().wounds.find(w=>w.id===combatVictim).until');await sleep(350);
 await key('t');await key('t',false);await sleep(450);assert(await ev('B1_FANTASY.snapshot().wounds.find(w=>w.id===combatVictim).until')>before,'Stomp reaches downed target');await sleep(350);
 await ev('B1_COMMUNITY.returnHome("living")');assert.equal(await ev('B1_FANTASY.attack("kick")'),false,'Combat disabled inside home');
 assert.equal(exceptions.length,0,'No browser errors');console.log('PASS four punch combo poses, kick, stomp, reset, cooldown and indoor guard');await cdp('Browser.close');
`+source.slice(end);
vm.runInThisContext('(function(require,__dirname){'+source+'\n})',{filename:path.join(__dirname,'qa-combat-runtime.cjs')})(require,__dirname);
