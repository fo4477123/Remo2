/* Original adult residents, in centimetres. All motion uses articulated joint pivots. */
(() => {
  function create({color='#435866',hero=false}={}){
    const root=new T.Group(),body=new T.Group();root.add(body);root.userData.style='adult-urban';root.userData.heightCm=175;
    const skin=mat('#c49a7f',.72),hair=mat('#25282b',.88),coat=mat(hero?'#3e4a53':color,.88),pants=mat('#293039',.93),white=mat('#c8cbc7',.86),ink=mat('#20252a',.7),trim=mat('#8a9293',.4,{metalness:.5});
    const add=(p,g,m,x=0,y=0,z=0)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;p.add(o);return o;};
    const ball=(p,m,x,y,z,r,sx=1,sy=1,sz=1)=>{const o=add(p,new T.SphereGeometry(r,16,12),m,x,y,z);o.scale.set(sx,sy,sz);return o;};
    const box=(p,m,x,y,z,w,h,d)=>add(p,new T.BoxGeometry(w,h,d),m,x,y,z);
    const pivot=(p,x,y,z)=>{const o=new T.Group();o.position.set(x,y,z);p.add(o);return o;};
    function tailored(parent,material,rings){const positions=[],indices=[],steps=20;for(const [y,rx,rz]of rings)for(let i=0;i<=steps;i++){const a=i/steps*Math.PI*2;positions.push(Math.cos(a)*rx,y,Math.sin(a)*rz);}for(let row=0;row<rings.length-1;row++)for(let i=0;i<steps;i++){const a=row*(steps+1)+i,b=a+steps+1;indices.push(a,b,a+1,a+1,b,b+1);}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();return add(parent,g,material);}
    const hips=pivot(body,0,91,0),torso=pivot(hips,0,9,0);tailored(hips,pants,[[-8,16,9],[0,17,10],[9,16,9]]);tailored(torso,coat,[[0,16.5,9],[8,17.5,10],[29,21,11],[42,21.5,10],[47,17,8],[48,8,6]]);
    box(torso,white,0,29,-10.8,13,32,1.2);box(torso,ink,0,23,-11.7,1,42,1);for(const s of [-1,1]){const lapel=box(torso,coat,s*7.8,40,-10.5,7,16,2);lapel.rotation.z=s*.28;box(torso,ink,s*12,11,-10.3,10,1,1);box(torso,ink,s*12,32,-11.2,8,.7,.7);}box(hips,ink,0,5,-9.2,29,3,2);box(hips,trim,0,5,-10.4,3.5,3,1);
    add(torso,new T.CylinderGeometry(5.3,6.3,11,14),skin,0,51,0);
    const head=pivot(torso,0,64,-.5);ball(head,skin,0,0,0,10,.79,1.08,.91);ball(head,skin,0,-5,-1.2,7.5,.87,.65,.86);ball(head,hair,0,4.7,1.1,9.5,.86,.63,.96);for(const s of [-1,1]){ball(head,skin,s*7.8,-.3,0,2,.5,1.45,.8);ball(head,white,s*3.1,.8,-8.1,1.4,1,.55,.3);ball(head,ink,s*3.1,.8,-8.55,.78,.65,.85,.3);const brow=box(head,hair,s*3.1,3.1,-8.2,3.4,.65,.65);brow.rotation.z=s*.055;const sideburn=box(head,hair,s*7.1,1.7,-.6,1.1,7,3);sideburn.rotation.z=-s*.1;}
    ball(head,skin,0,-1.7,-8.8,2.1,.5,1.05,.95);box(head,mat('#8c6359',.86),0,-5.1,-8.3,4,.5,.6);ball(head,hair,1.2,8,-.5,7,.9,.55,1.05);for(let i=0;i<4;i++)ball(head,hair,-4+i*2.6,8.7,-3.5,3.2,1,.6,1.2);
    const arms=[],elbows=[],hands=[],legs=[],knees=[],feet=[];
    for(const s of [-1,1]){
      const shoulder=pivot(torso,s*22,43,0);arms.push(shoulder);add(shoulder,new T.CapsuleGeometry(5.6,21,5,12),coat,0,-15,0);const elbow=pivot(shoulder,0,-32,0);elbows.push(elbow);add(elbow,new T.CapsuleGeometry(4.5,19,5,12),coat,0,-13,0);box(elbow,ink,0,-26,0,8.5,3,8);const hand=pivot(elbow,0,-32,-.3);hands.push(hand);ball(hand,skin,0,-2,0,1,3.7,6.2,2.3);ball(hand,skin,-s*3.4,-1,-1.2,1,1.3,3.8,1.4);for(let i=0;i<4;i++)ball(hand,skin,-2.1+i*1.4,-7,0,1,.6,2.3,.9);
      const hip=pivot(hips,s*9,0,0);legs.push(hip);add(hip,new T.CapsuleGeometry(7,28,5,12),pants,0,-21,0).scale.z=.85;const knee=pivot(hip,0,-42,0);knees.push(knee);add(knee,new T.CapsuleGeometry(5.5,29,5,12),pants,0,-20,0).scale.z=.88;const foot=pivot(knee,0,-40,-1);feet.push(foot);ball(foot,ink,0,-3,-4.5,1,5,5,12);box(foot,white,0,-7,-4.5,10.3,2,23);for(const z of [-7,-4,-1])box(foot,trim,0,.5,z,5,.6,.5);
    }
    const helmet=ball(head,mat('#445d61',.35),0,1.5,.5,11,.95,1.02,1.04);helmet.visible=false;
    for(let i=0;i<2;i++){ball(elbows[i],coat,0,0,0,4.7,1,1.15,1);ball(knees[i],pants,0,0,0,5.6,1,1.12,.92);}
    // Merge rigid pieces by material within each joint; animation keeps its joint groups.
    const groups=[];root.traverse(o=>{if(o.isGroup)groups.push(o);});for(const parent of groups){const buckets=new Map();for(const o of [...parent.children]){if(!o.isMesh||o===helmet)continue;if(!buckets.has(o.material))buckets.set(o.material,[]);buckets.get(o.material).push(o);}for(const [material,list]of buckets){if(list.length<2)continue;const positions=[],normals=[];for(const o of list){o.updateMatrix();const g=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();g.applyMatrix4(o.matrix);positions.push(...g.attributes.position.array);normals.push(...g.attributes.normal.array);g.dispose();o.geometry.dispose();parent.remove(o);}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('normal',new T.Float32BufferAttribute(normals,3));add(parent,g,material);}}
    const shadow=new T.Mesh(new T.CircleGeometry(24,24),new T.MeshBasicMaterial({color:'#26332e',transparent:true,opacity:.2,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.4;root.add(shadow);
    let phase=0,blend=0,clock=0,gesture=0,gestureKind='wave';
    function act(kind='wave'){gesture=1.6;gestureKind=kind;}
    function update(dt,{distance=0,speed=0,seated=false,cycle=false,wave=false}={}){
      clock+=dt;const moving=distance>.005&&distance<130;blend+=(Number(moving)-blend)*Math.min(1,dt*12);phase+=moving?distance/(speed>350?110:78)*Math.PI:dt*.2;
      const run=Math.min(1,Math.max(0,(speed-230)/270)),stride=(.5+run*.36)*blend;
      hips.position.y=91+(seated?-40:Math.abs(Math.sin(phase))*2*blend);body.position.y=Math.sin(clock*2)*.35*(1-blend);torso.rotation.x=seated?-.15:-run*.15*blend;torso.rotation.z=Math.sin(phase)*.025*blend;head.rotation.y=Math.sin(clock*.7)*.02*(1-blend);head.rotation.z=0;
      for(let i=0;i<2;i++){const p=phase+i*Math.PI,s=Math.sin(p),lift=Math.max(0,-s);legs[i].rotation.x=seated?.95+(cycle?Math.sin(p)*.45:0):s*stride;knees[i].rotation.x=seated?-1.4+(cycle?Math.cos(p)*.45:0):-(.06+lift*(.8+run*.45))*blend;feet[i].rotation.x=seated?.2:-legs[i].rotation.x*.28-knees[i].rotation.x*.25;arms[i].rotation.x=seated?1.05:-s*stride*.8;arms[i].rotation.z=i?.035:-.035;elbows[i].rotation.x=seated?.45:(.14+run*.9+Math.max(0,s)*.17)*blend;}
      gesture=Math.max(0,gesture-dt);if(wave||gesture>0){const a=wave?1:Math.min(1,gesture*5),reach=gestureKind==='reach'&&!wave;arms[1].rotation.z=a*(reach?-.3:1.7);arms[1].rotation.x=a*(reach?1.05:.2);elbows[1].rotation.x=a*(reach?.8:1.25+Math.sin(clock*12)*.22);head.rotation.z=Math.sin(clock*2)*.025;}
    }
    return {root,torso,head,hips,arms,elbows,hands,legs,knees,feet,helmet,act,update,snapshot:()=>({style:'adult-urban',heightCm:175,phase,blend,arms:arms.map(o=>o.rotation.x),knees:knees.map(o=>o.rotation.x),elbows:elbows.map(o=>o.rotation.x),feet:feet.map(o=>o.getWorldPosition(new T.Vector3()).toArray())})};
  }
  window.B1_CHARACTERS={create};
})();
