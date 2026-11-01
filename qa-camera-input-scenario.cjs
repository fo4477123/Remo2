// Focused browser regression for immersive camera controls (real CDP input).
module.exports=async({ev,cdp,sleep,shot,assert})=>{
 const mouse=(type,x,y,extra={})=>cdp('Input.dispatchMouseEvent',{type,x,y,...extra});
 const wait=async expression=>{for(let i=0;i<100;i++){if(await ev(expression))return;await sleep(50);}throw Error('Timed out: '+expression);};
 const click=async selector=>{await ev(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'center'})`);await sleep(100);const p=await ev(`(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);await mouse('mousePressed',p.x,p.y,{button:'left',buttons:1,clickCount:1});await mouse('mouseReleased',p.x,p.y,{button:'left',buttons:0,clickCount:1});};
 const key=async key=>{await cdp('Input.dispatchKeyEvent',{type:'keyDown',key});await cdp('Input.dispatchKeyEvent',{type:'keyUp',key});};
 const state=()=>ev('({yaw:walkYaw,pitch:lookPitch,rotation:camera.quaternion.toArray()})');
 const close=(a,b,message)=>assert(Math.abs(a-b)<1e-6,message+': '+a+' vs '+b);
 const rotate=async label=>{
  await mouse('mouseMoved',650,450,{buttons:0});await ev('lookPitch=0');await sleep(100);const a=await state();
  await mouse('mouseMoved',730,426,{buttons:0});await sleep(250);const b=await state();
  close(b.yaw-a.yaw,.2,label+' relative yaw counted once');close(b.pitch-a.pitch,.06,label+' relative pitch counted once');
  assert(b.rotation.some((v,i)=>Math.abs(v-a.rotation[i])>.001),label+' actual camera rotates');
 };
 await ev('B1_PLAYER.setMode("first")');await click('.immersive-button');
 await wait('document.pointerLockElement===canvas');assert(await ev('walking&&view.classList.contains("immersive")'));
 await rotate('Home first person');await shot('immersive-mouse-look');await ev('B1_PLAYER.setMode("third")');await rotate('Home third person');
 await key('Escape');await wait('!document.pointerLockElement');assert(await ev('walking'),'First Escape releases mouse without leaving tour');
 assert.equal(await ev('document.querySelector(".mouse-look-button").textContent'),'啟用滑鼠轉頭');
 await sleep(1500);await click('.mouse-look-button');await wait('document.pointerLockElement===canvas');await rotate('Resume button');
 await key('j');await wait('document.querySelector(".explore-journal").open&&!document.pointerLockElement');
 const modalYaw=await ev('walkYaw');await mouse('mouseMoved',810,400,{buttons:0});close(await ev('walkYaw'),modalYaw,'Journal does not rotate camera');
 await ev('document.querySelector(".explore-journal").close()');await sleep(250);
 // Browser denial must retain ordinary drag and pointer cleanup.
 await ev('canvas.savedRequestPointerLock=canvas.requestPointerLock;canvas.requestPointerLock=()=>Promise.reject(new DOMException("QA denied","NotAllowedError"));B1_PLAYER.setMode("first")');
 await mouse('mouseMoved',650,450);const fallback=await state();
 await mouse('mousePressed',650,450,{button:'left',buttons:1,clickCount:1});await mouse('mouseMoved',750,430,{buttons:1});await mouse('mouseReleased',750,430,{button:'left',buttons:0,clickCount:1});await sleep(200);
 const dragged=await state();close(dragged.yaw-fallback.yaw,.6,'Denied lock: drag yaw');close(dragged.pitch-fallback.pitch,.1,'Denied lock: drag pitch');
 assert(!await ev('Boolean(document.pointerLockElement)'));assert(await ev('document.querySelector(".explore-hint").textContent.includes("拖曳")'));
 await mouse('mouseMoved',800,400,{buttons:0});close(await ev('walkYaw'),dragged.yaw,'Released drag does not stick');
 await mouse('mousePressed',650,450,{button:'left',buttons:1,clickCount:1});await ev('canvas.dispatchEvent(new PointerEvent("pointercancel",{pointerId:1}))');await mouse('mouseMoved',700,450,{buttons:1});close(await ev('walkYaw'),dragged.yaw,'Cancelled drag does not stick');await mouse('mouseReleased',700,450,{button:'left',buttons:0,clickCount:1});
 // Touch always uses dragging rather than requesting mouse lock.
 await cdp('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:2});const touchStart=await state();
 await cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:650,y:450,id:1}]});await cdp('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:710,y:465,id:1}]});await cdp('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 const touchEnd=await state();close(touchEnd.yaw-touchStart.yaw,.36,'Touch yaw');close(touchEnd.pitch-touchStart.pitch,-.075,'Touch pitch');
 await cdp('Emulation.setTouchEmulationEnabled',{enabled:false});await ev('canvas.requestPointerLock=canvas.savedRequestPointerLock');console.log('PASS home mouse lock, Escape/resume, journal, denied-lock dragging, cancellation and touch');
 // Hall and street share input, but render through different camera implementations.
 await ev('B1_COMMUNITY.travel("hallB5")');await wait('B1_COMMUNITY.zone==="hallB5"&&!B1_COMMUNITY.inTransit');
 await sleep(1600);await click('.mouse-look-button');await wait('document.pointerLockElement===canvas');await rotate('Community hall');
 await ev('B1_CITY.start()');await wait('B1_COMMUNITY.zone==="city"');
 if(!await ev('document.pointerLockElement===canvas')){await sleep(1500);await click('.mouse-look-button');await wait('document.pointerLockElement===canvas');}await rotate('Street third person');
 await ev('B1_COMMUNITY.returnHome("living",false);B1_REVIEW.setTour(false)');await wait('!document.pointerLockElement');
 await click('.immersive-button');assert(!await ev('view.classList.contains("immersive")'));
 await ev('canvas.scrollIntoView({block:"center"})');await sleep(150);const p=await ev('(()=>{const r=canvas.getBoundingClientRect();return{x:r.x+r.width*.55,y:r.y+r.height*.6}})()');
 const orbit=await ev('({yaw,pitch,radius,walkYaw})');await mouse('mousePressed',p.x,p.y,{button:'left',buttons:1,clickCount:1});await mouse('mouseMoved',p.x+80,p.y+20,{buttons:1});await mouse('mouseReleased',p.x+80,p.y+20,{button:'left',buttons:0,clickCount:1});close(await ev('yaw'),orbit.yaw-.64,'Orbit drag remains available');close(await ev('walkYaw'),orbit.walkYaw,'Orbit does not change walk yaw');
 await shot('camera-input');console.log('PASS immersive automatic lock, relative rotation, first/third person, Escape/resume, journal, denied-lock drag, cancellation, touch, hall, city and orbit');
};
