/* Detailed local furniture assets, preserving the approved collision footprints. */
(() => {
  const groups={},actors=[];
  function group(name){const g=new T.Group();g.name=name;scene.add(g);return g;}
  function rounded(x,y,w,d,h,material,z=0,parent=scene,r=2){
    const g=new T.BoxGeometry(w,h,d,6,4,6),p=g.attributes.position,v=new T.Vector3(),q=new T.Vector3(),radius=Math.min(r,w/3,h/3,d/3);
    for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);q.set(Math.max(-w/2+radius,Math.min(w/2-radius,v.x)),Math.max(-h/2+radius,Math.min(h/2-radius,v.y)),Math.max(-d/2+radius,Math.min(d/2-radius,v.z)));v.sub(q).normalize().multiplyScalar(radius).add(q);p.setXYZ(i,v.x,v.y,v.z);}g.computeVertexNormals();
    g.userData.modernRounded=true;const m=new T.Mesh(g,material);m.position.copy(W(x+w/2,y+d/2,z+h/2));m.castShadow=m.receiveShadow=true;parent.add(m);return m;
  }
  function rod(a,b,r,material,parent=scene){const from=W(...a),to=W(...b),delta=to.clone().sub(from),m=new T.Mesh(new T.CylinderGeometry(r,r,delta.length(),12),material);m.position.copy(from).add(to).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());m.castShadow=true;parent.add(m);return m;}
  function tube(points,r,material,parent=scene){const m=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>W(...p))),Math.max(16,points.length*4),r,5,false),material);parent.add(m);return m;}
  function replace(name){for(const o of [...scene.children])if(o.userData.furnitureName===name){scene.remove(o);}const g=group(`modern-${name}`);g.userData.furnitureName=name;groups[name]=g;return g;}
  const upholstery=linen.clone();upholstery.color.set('#e1dacf');upholstery.roughness=.94;upholstery.bumpScale=.035;
  const graphite=mat('#38413e',.38,{metalness:.4}),seam=mat('#b7ad9d',.9),bronze=mat('#7d7160',.26,{metalness:.78});
  for(const o of [...scene.children])if(o.isMesh&&!o.userData.furnitureName&&o.position.x+750>970&&o.position.x+750<1060&&700-o.position.z>750&&700-o.position.z<960&&o.position.y>45&&o.position.y<100)scene.remove(o);
  const sofa=replace('奶油弧背模組沙發');
  rounded(975,755,80,200,10,graphite,13,sofa,3);
  rounded(971,759,17,192,57,upholstery,25,sofa,7);
  for(const y of [751,950])rounded(974,y,82,9,48,upholstery,20,sofa,4);
  for(let i=0;i<3;i++){
    const y=764+i*62;
    rounded(985,y,68,60,16,upholstery,34,sofa,6);rounded(981,y+2,15,56,37,upholstery,49,sofa,5);
    tube([[990,y+2,48],[1045,y+2,48],[1050,y+8,48],[1050,y+53,48],[1045,y+58,48],[990,y+58,48]],.18,seam,sofa);
  }
  for(const y of [765,943])for(const x of [983,1045])rod([x,y,0],[x,y,16],1.3,bronze,sofa);
  rounded(1001,775,31,30,10,mat('#bab8a5',.94),48,sofa,5);rounded(989,915,14,27,28,mat('#939c89',.95),52,sofa,5);

  const chair=replace('高階網布人體工學椅'),seat=mat('#68736b',.91),frame=mat('#303936',.35,{metalness:.35});
  rounded(812,856,52,51,9,seat,43,chair,5);rounded(815,859,46,45,3,frame,40,chair,2);
  rod([837,882,7],[837,882,43],2.9,chrome,chair);
  for(let i=0;i<5;i++){const a=i*Math.PI*2/5,x=837+Math.cos(a)*29,y=882+Math.sin(a)*29;rod([837,882,8],[x,y,4],1.7,frame,chair);const wheel=new T.Mesh(new T.CylinderGeometry(3.7,3.7,4,16),frame);wheel.rotation.x=Math.PI/2;wheel.position.copy(W(x,y,3.7));chair.add(wheel);}
  const meshCanvas=document.createElement('canvas');meshCanvas.width=meshCanvas.height=32;const mc=meshCanvas.getContext('2d');mc.fillStyle='#fff';mc.fillRect(0,0,32,32);mc.fillStyle='#222';for(let x=2;x<32;x+=8)for(let y=2;y<32;y+=8)mc.fillRect(x,y,4,5);const alpha=new T.CanvasTexture(meshCanvas);alpha.wrapS=alpha.wrapT=T.RepeatWrapping;alpha.repeat.set(12,15);
  const meshMat=mat('#6b786f',.88,{alphaMap:alpha,transparent:true,alphaTest:.3,side:T.DoubleSide});
  const backGeometry=new T.PlaneGeometry(49,58,20,24),bp=backGeometry.attributes.position;
  for(let i=0;i<bp.count;i++){const u=bp.getX(i),v=bp.getY(i);bp.setXYZ(i,-5*Math.cos(v/28)+u*u*.004,v,u);}backGeometry.computeVertexNormals();
  const back=new T.Mesh(backGeometry,meshMat);back.position.copy(W(814,882,99));chair.add(back);
  for(const side of [-1,1])tube([[814,882+side*24,70],[810,882+side*25,90],[814,882+side*24,126]],1.3,frame,chair);
  tube([[814,858,126],[813,882,129],[814,906,126]],1.3,frame,chair);rounded(809,865,7,34,12,seat,132,chair,4);rod([813,882,123],[813,882,136],1.4,frame,chair);
  for(const y of [854,908]){rod([833,y,47],[833,y,67],1.4,frame,chair);rounded(823,y-2,24,5,4,frame,66,chair,2);}
  rounded(808,864,6,36,10,seat,78,chair,3);

  const bedding=linen.clone();bedding.color.set('#eee9dd');bedding.roughness=.96;bedding.bumpScale=.025;
  for(const o of [...scene.children])if(o.geometry?.type==='PlaneGeometry'&&o.geometry.parameters.width===66&&o.geometry.parameters.height===149)scene.remove(o);
  function bed(name,x,y,w,d,side){const g=replace(name);rounded(x,y,w,d,14,oak,12,g,3);rounded(x+2,y+2,w-4,d-4,21,bedding,26,g,5);
    if(side==='x'){rounded(x-8,y,10,d,84,upholstery,15,g,4);for(const yy of [y+14,y+82])rounded(x+14,yy,42,52,12,bedding,47,g,5);}
    else{rounded(x,y+d,w,10,82,upholstery,15,g,4);for(const xx of [x+10,x+78])rounded(xx,y+d-45,60,31,12,bedding,47,g,5);}
    const quilt=new T.PlaneGeometry(w-10,d-10,28,28),p=quilt.attributes.position;for(let i=0;i<p.count;i++)p.setZ(i,Math.sin(p.getX(i)*.11+p.getY(i)*.07)*.65+Math.sin(p.getY(i)*.25)*.25);quilt.computeVertexNormals();const cover=new T.Mesh(quilt,bedding);cover.rotation.x=-Math.PI/2;cover.position.copy(W(x+w/2,y+d/2,49));cover.receiveShadow=true;g.add(cover);
    tube([[x+5,y+5,45],[x+w-5,y+5,45],[x+w-5,y+d-5,45],[x+5,y+d-5,45],[x+5,y+5,45]],.16,seam,g);
    if(side==='x')rounded(x+w-58,y+3,48,d-6,1.5,mat('#9da891',.98),50,g,.6);else rounded(x+3,y+20,w-6,44,1.5,mat('#a9b1a5',.98),50,g,.6);
    for(const xx of [x+12,x+w-12])for(const yy of [y+12,y+d-12])rod([xx,yy,0],[xx,yy,14],1.5,bronze,g);return g;
  }
  bed('主臥飯店級軟包雙人床／轉向90度',408,890,188,150,'x');bed('次臥飯店級客床 150×188',415,320,150,188,'y');

  const coffee=replace('暖嶼家居島語升降茶几'),top=group('isle-whisper-lift-top');coffee.add(top);
  const isleOak=oak.clone();isleOak.color.set('#c5a77c');isleOak.roughness=.64;isleOak.bumpScale=.018;
  const innerOak=oak.clone();innerOak.color.set('#d4bb91');innerOak.roughness=.72;
  const darkPull=mat('#544a3d',.32,{metalness:.52}),liftMetal=mat('#77766d',.3,{metalness:.7});
  // 72 × 110 cm pale-oak lift top, sized to the existing approved living-room fit.
  rounded(1097,785,72,110,4,isleOak,55,top,1.8);
  rounded(1099,787,68,106,1.2,innerOak,52.9,top,.6);
  // Cabinet shell, open cubby, and two broad drawers face the sofa on the west side.
  rounded(1101,787,64,106,4,isleOak,29,coffee,1.3);
  rounded(1100,787,2,106,38,isleOak,8,coffee,.6);rounded(1164,787,2,106,38,isleOak,8,coffee,.6);
  rounded(1102,787,62,2,38,isleOak,8,coffee,.5);rounded(1102,787,62,2,38,isleOak,44,coffee,.5);
  rounded(1102,787,2,106,8,innerOak,8,coffee,.4);
  // Two drawer fronts and a recessed open shelf above them.
  for(const y of [790,840]){
    rounded(1099.5,y,1.5,47,14,innerOak,11,coffee,.35);
    rounded(1098.5,y+22,1,8,1.4,darkPull,18,coffee,.25);
  }
  rounded(1100,817,3,40,1.5,isleOak,32,coffee,.3);
  // Four compact swivel casters; wheel and bracket details stay tucked within the footprint.
  for(const x of [1105,1160])for(const y of [791,889]){
    const swivel=new T.Mesh(new T.CylinderGeometry(1.5,1.5,1.5,16),liftMetal);swivel.position.copy(W(x,y,6));coffee.add(swivel);
    const wheel=new T.Mesh(new T.CylinderGeometry(3.1,3.1,2.2,20),graphite);wheel.rotation.z=Math.PI/2;wheel.position.copy(W(x,y,3.8));wheel.castShadow=true;coffee.add(wheel);
  }
  // Twin crossed lift arms rise with the top, echoing the real lift-up mechanism.
  const liftArms=[];for(const y of [800,880])for(const direction of [1,-1])liftArms.push({y,direction,mesh:rod([1110,y,35],[1156,y,51],1.25,liftMetal,coffee)});
  const placeLiftArms=p=>{for(const a of liftArms){const low=a.direction>0?1110:1156,high=a.direction>0?1156:1110;const z1=34,z2=48+p*19;const from=W(low,a.y,z1),to=W(high,a.y,z2),delta=to.clone().sub(from);a.mesh.position.copy(from).add(to).multiplyScalar(.5);a.mesh.scale.y=delta.length()/Math.max(1,a.mesh.geometry.parameters.height);a.mesh.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());}};
  const accessories=scene.children.filter(o=>o.isMesh&&o.position.x+750>1097&&o.position.x+750<1169&&700-o.position.z>785&&700-o.position.z<895&&o.position.y>=70).map(mesh=>({mesh,y:mesh.position.y}));
  actors.push({id:'coffee-lift',name:'暖嶼家居・島語升降茶几',x:1168,y:842,h:54,range:130,on:false,p:0,verbs:['升起島語茶几桌板','收合島語茶几桌板'],apply:p=>{top.position.y=p*19;for(const a of accessories)a.mesh.position.y=a.y+p*19;placeLiftArms(p);}});
  const deskScreens=[];scene.traverse(o=>{if(o.isMesh&&o.userData.furnitureName==='160 cm 升降工作桌／對面實牆'&&o.geometry.parameters?.height===30)deskScreens.push(o);});
  const screenCanvas=document.createElement('canvas');screenCanvas.width=512;screenCanvas.height=320;const dc=screenCanvas.getContext('2d');dc.fillStyle='#30483e';dc.fillRect(0,0,512,320);dc.fillStyle='#bdd0b0';dc.font='28px sans-serif';dc.fillText('QINGPU / STUDIO',34,57);dc.fillStyle='#f4efe4';for(let i=0;i<7;i++)dc.fillRect(34,93+i*24,220+(i%3)*58,7);dc.fillStyle='#8dada0';dc.fillRect(360,95,110,175);const screenMap=new T.CanvasTexture(screenCanvas);screenMap.colorSpace=T.SRGBColorSpace;const screenOn=new T.MeshBasicMaterial({map:screenMap}),screenOff=black;
  actors.push({id:'desk-screen',name:'工作螢幕',x:930,y:856,h:100,range:125,on:false,p:0,verbs:['開啟工作螢幕','關閉工作螢幕'],apply:p=>deskScreens.forEach(m=>m.material=p>.5?screenOn:screenOff)});
  // Fine keys and monitor arms are parented to the desk so the lift carries them.
  for(const yy of [822,880])rod([925,yy+24,77],[929,yy+24,93],.9,graphite).userData.furnitureName='160 cm \u5347\u964d\u5de5\u4f5c\u684c\uff0f\u5c0d\u9762\u5be6\u7246';
  for(let row=0;row<4;row++)for(let k=0;k<12;k++){const m=rounded(895+row*2.5,837+k*2.1,2,1.7,.35,graphite,77.4,scene,.15);m.userData.furnitureName='160 cm 升降工作桌／對面實牆';}
  window.B1_MODELS={rounded,rod,tube,groups,actors,profile:'modern-detailed-local-v2'};B1_REVIEW.modelProfile=B1_MODELS.profile;
})();
