// Exercise actual keyboard input and skeletal poses using the fantasy browser harness.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
let source=fs.readFileSync(path.join(__dirname,'qa-fantasy.cjs'),'utf8');
const start=source.indexOf(" await ev('B1_COMMUNITY.enterLobby();keys.clear()');"),end=source.lastIndexOf('})().catch');
if(start<0||end<start)throw Error('Fantasy QA harness changed');
source=source.slice(0,start)+`
 await ev('B1_CITY.start();keys.clear();(()=>{const people=[...B1_CITY.pedestrians(),...B1_NEIGHBORHOOD.npcs.filter(n=>n.zone==="city"&&n.a18)];for(let r=0;r<5000;r+=300)for(let a=0;a<6.3;a+=.4){const x=walkX+Math.cos(a)*r,y=walkY+Math.sin(a)*r;if(B1_CITY.pedestrianClear(x,y,40)&&people.every(p=>Math.hypot(p.x-x,p.y-y)>600)){walkX=x;walkY=y;return;}}throw Error("No empty test space");})()');await sleep(2800);
 assert.equal(await ev('document.querySelectorAll(".fantasy-attack button").length'),1,'Only one touch attack button');
 const moves=['hook-left','hook-right','uppercut','low-hook'];
 for(const move of moves){await key('q');await key('q',false);assert.equal(await ev('B1_FANTASY.snapshot().lastMove'),move);await sleep(160);assert.equal(await ev('B1_PLAYER.rig.snapshot().pose'),move,'Skeletal pose '+move);await sleep(650);}
 await ev('(()=>{const p=B1_CITY.pedestrians().find(p=>B1_CITY.pedestrianClear(p.x+140,p.y,35));if(!p)throw Error("No clear pedestrian");p.pause=performance.now()+15000;window.combatVictim=p.id;walkX=p.x+140;walkY=p.y;walkYaw=-Math.PI/2;})()');
 await sleep(300);
 await key('q');await key('q',false);assert.equal(await ev('B1_FANTASY.snapshot().lastMove'),'kick','Single key reaches kick in standing combo');await sleep(160);assert.equal(await ev('B1_PLAYER.rig.snapshot().pose'),'kick');await sleep(300);assert(await ev('B1_FANTASY.snapshot().wounds.some(w=>w.id===combatVictim&&!w.down)'),'Kick reaches standing target');await sleep(350);
 await key('q');await key('q',false);await sleep(450);assert(await ev('B1_FANTASY.isDown(combatVictim)'),'Punch knocks target down');await sleep(350);
 await key('q');await key('q',false);assert.equal(await ev('B1_FANTASY.snapshot().lastMove'),'stomp','Same key detects downed target');await sleep(160);assert.equal(await ev('B1_PLAYER.rig.snapshot().pose'),'stomp');await sleep(300);assert(await ev('B1_FANTASY.isDead(combatVictim)'),'Stomp kills downed target');assert.equal(await ev('B1_COMMUNITY.useTarget("city-"+combatVictim)'),false,'Dead NPC cannot be spoken to');assert.equal(await ev('B1_FANTASY.attack()'),false,'Cooldown blocks rapid repeat');await sleep(350);
 await ev('walkYaw=Math.PI/2');await sleep(5300);assert(await ev('B1_FANTASY.isDead(combatVictim)'),'Dead NPC does not recover while nearby');await key('q');await key('q',false);assert.equal(await ev('B1_FANTASY.snapshot().lastMove'),'hook-left','Combo resets with no target');await sleep(750);const last=await ev('B1_FANTASY.snapshot().lastMove');await key('r');await key('r',false);await key('t');await key('t',false);assert.equal(await ev('B1_FANTASY.snapshot().lastMove'),last,'R and T do not start attacks');
 await ev('(()=>{const all=B1_CITY.pedestrians(),p=all.find(p=>p.rig.root.userData.child&&B1_CITY.pedestrianClear(p.x+140,p.y,35)&&all.every(o=>o===p||Math.hypot(o.x-p.x,o.y-p.y)>350));if(!p)throw Error("No child approach");p.pause=performance.now()+10000;walkX=p.x+140;walkY=p.y;walkYaw=-Math.PI/2;})()');await sleep(2500);await key('q');await key('q',false);assert.equal(await ev('B1_FANTASY.snapshot().lastMove'),'low-hook','Shorter standing target selects low attack');
 await ev('B1_COMMUNITY.returnHome("living")');assert.equal(await ev('B1_FANTASY.attack()'),false,'Combat disabled inside home');
 assert.equal(exceptions.length,0,'No browser errors');console.log('PASS single-key punch and kick combo, target-aware stomp, reset, cooldown and indoor guard');await cdp('Browser.close');
`+source.slice(end);
vm.runInThisContext('(function(require,__dirname){'+source+'\n})',{filename:path.join(__dirname,'qa-combat-runtime.cjs')})(require,__dirname);
