module.exports=async({ev,cdp,sleep,assert})=>{
  await ev('B1_CITY.start("car");keys.clear()');await sleep(300);
  const id=await ev(`(()=>{const p=B1_CITY.pedestrians()[0],a=B1_CITY.avatarState().heading;p.x=walkX+Math.sin(a)*430;p.y=walkY+Math.cos(a)*430;p.pause=performance.now()+20000;p.rig.root.visible=true;return p.id;})()`);
  assert(!(await ev(`B1_FANTASY.isDown(${JSON.stringify(id)})`)),'A stationary vehicle does not injure a pedestrian');
  await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'w'});await sleep(1600);await cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'w'});
  assert(await ev(`B1_FANTASY.isDown(${JSON.stringify(id)})`),'Driving into a pedestrian knocks them down');
  const state=await ev(`B1_FANTASY.snapshot().wounds.find(w=>w.id===${JSON.stringify(id)})`);assert(state.down);console.log('Impact reaction',state);
};
