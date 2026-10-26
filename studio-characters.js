/* Original articulated residents: all limb motion comes from explicit joint pivots. */
(() => {
  function create({color='#527b74',hero=false}={}){
    const root=new T.Group(),body=new T.Group();root.add(body);const shadow=new T.Mesh(new T.CircleGeometry(26,28),new T.MeshBasicMaterial({color:'#263934',transparent:true,opacity:.17,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.3;root.add(shadow);
    const skin=mat('#d7af91',.75),hair=mat('#30383b',.8),coat=mat(color,.85),pants=mat('#36464a',.8),white=mat('#e8e4d7',.75),ink=mat('#26363d',.6),trim=mat('#bba276',.45,{metalness:.25});
    const add=(parent,g,m,x=0,y=0,z=0)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;parent.add(o);return o;};
    const ball=(p,m,x,y,z,r,sx=1,sy=1,sz=1)=>{const o=add(p,new T.SphereGeometry(r,20,14),m,x,y,z);o.scale.set(sx,sy,sz);return o;};
    const box=(p,m,x,y,z,w,h,d)=>add(p,new T.BoxGeometry(w,h,d),m,x,y,z);
    const pivot=(p,x,y,z)=>{const o=new T.Group();o.position.set(x,y,z);p.add(o);return o;};
    const hips=pivot(body,0,62,0),torso=pivot(hips,0,11,0);add(torso,new T.CapsuleGeometry(20,24,6,18),coat,0,19,0).scale.z=.68;box(torso,white,0,18,-14,18,39,2);box(torso,trim,0,18,-15.5,2,39,1);
    for(const s of [-1,1]){const collar=box(torso,coat,s*11,40,-13,13,8,3);collar.rotation.z=s*.32;box(torso,ink,s*13,12,-15,10,1.5,1);}
    const head=pivot(torso,0,52,-1);ball(head,skin,0,0,0,24,1,1.05,.92);ball(head,hair,0,9,3,24.7,1,.73,.98);
    for(const s of [-1,1]){ball(head,skin,s*23,0,0,5,.6,1,.7);ball(head,white,s*8.4,1.5,-21,4.2,1,.75,.22);ball(head,ink,s*8.4,1.5,-21.8,2.9,.65,1,.23);const brow=box(head,hair,s*8.5,9,-21,11,2,1);brow.rotation.z=s*.08;}
    ball(head,skin,0,-3.5,-22,3,.6,.8,.7);const smile=add(head,new T.TorusGeometry(5,.65,6,16,Math.PI*.7),ink,0,-8,-21);smile.rotation.z=Math.PI*1.15;
    for(let i=0;i<7;i++){const tuft=add(head,new T.ConeGeometry(5.5,18,6),hair,-17+i*5.5,22,-8+(i%2)*3);tuft.rotation.z=-.5;tuft.rotation.x=-.2;}
    const bag=box(torso,ink,16,13,15,22,26,9);bag.rotation.z=.08;const strap=box(torso,ink,0,24,-16,4,54,2);strap.rotation.z=-.58;box(torso,trim,9,25,-17.5,7,6,1);
    const arms=[],elbows=[],hands=[],legs=[],knees=[],feet=[];
    for(const s of [-1,1]){
      const shoulder=pivot(torso,s*24,36,0);arms.push(shoulder);add(shoulder,new T.CapsuleGeometry(6.5,17,5,12),coat,0,-12,0);const elbow=pivot(shoulder,0,-25,0);elbows.push(elbow);add(elbow,new T.CapsuleGeometry(5.5,14,5,12),coat,0,-10,0);hands.push(ball(elbow,skin,0,-23,-1,6));
      const hip=pivot(hips,s*11,0,0);legs.push(hip);add(hip,new T.CapsuleGeometry(8,14,5,14),pants,0,-12,0);const knee=pivot(hip,0,-26,0);knees.push(knee);add(knee,new T.CapsuleGeometry(6.5,14,5,12),pants,0,-11,0);const foot=pivot(knee,0,-27,-2);feet.push(foot);ball(foot,white,0,-2,-7,1,9,6,15);box(foot,ink,0,-6,-6,18,2,28);for(const z of [-8,-3,2])box(foot,trim,0,2,z,10,1,1);
    }
    const helmet=ball(head,mat('#718b82',.38),0,6,1,26,1,.9,1);helmet.visible=false;
    if(!hero){root.scale.setScalar(1.03);bag.visible=strap.visible=false;}
    let phase=0,blend=0,clock=0,gesture=0,gestureKind='wave';
    function act(kind='wave'){gesture=1.6;gestureKind=kind;}
    function update(dt,{distance=0,speed=0,seated=false,cycle=false,wave=false}={}){
      clock+=dt;const moving=distance>0.005&&distance<90;blend+=(Number(moving)-blend)*Math.min(1,dt*12);phase+=moving?distance/(speed>450?90:62)*Math.PI:dt*.2;
      const run=Math.min(1,Math.max(0,(speed-250)/350)),stride=(.62+run*.28)*blend;
      hips.position.y=62+(seated?-20:Math.abs(Math.sin(phase))*2.5*blend);body.position.y=Math.sin(clock*2)*.5*(1-blend);torso.rotation.x=seated?-.23:-run*.1*blend;torso.rotation.z=Math.sin(phase)*.045*blend;head.rotation.y=Math.sin(clock*.7)*.025*(1-blend);head.rotation.z=0;
      for(let i=0;i<2;i++){const p=phase+i*Math.PI,s=Math.sin(p),lift=Math.max(0,-s);legs[i].rotation.x=seated?.95+(cycle?Math.sin(p)*.45:0):s*stride;knees[i].rotation.x=seated?-1.4+(cycle?Math.cos(p)*.45:0):-(.09+lift*(.85+run*.4))*blend;feet[i].rotation.x=seated?.2:-legs[i].rotation.x*.28-knees[i].rotation.x*.25;arms[i].rotation.x=seated?1.05:-s*stride*.85;arms[i].rotation.z=i?.08:-.08;elbows[i].rotation.x=seated?.45:(.18+run*.5+Math.max(0,s)*.23)*blend;}
      gesture=Math.max(0,gesture-dt);if(wave||gesture>0){const a=wave?1:Math.min(1,gesture*5),reach=gestureKind==='reach'&&!wave;arms[1].rotation.z=a*(reach?-.3:1.7);arms[1].rotation.x=a*(reach?1.05:.2);elbows[1].rotation.x=a*(reach?.8:1.25+Math.sin(clock*12)*.22);head.rotation.z=Math.sin(clock*2)*.04;}
    }
    return {root,torso,head,hips,arms,elbows,hands,legs,knees,feet,helmet,act,update,snapshot:()=>({phase,blend,arms:arms.map(o=>o.rotation.x),knees:knees.map(o=>o.rotation.x),elbows:elbows.map(o=>o.rotation.x),feet:feet.map(o=>o.getWorldPosition(new T.Vector3()).toArray())})};
  }
  window.B1_CHARACTERS={create};
})();
