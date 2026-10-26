/* Owner-selected furniture, reconstructed from official dimensions and product photographs. */
(() => {
  const {rounded,rod}=B1_MODELS,deskName='160 cm 升降工作桌／對面實牆',chairName='高階網布人體工學椅';
  const black=mat('#222728',.65),nylon=mat('#161b1d',.72),white=mat('#e5e6e0',.5),steel=mat('#a3aaac',.25,{metalness:.8});
  const localBox=(g,x,y,z,w,h,d,m,r=.7)=>{const o=rounded(0,0,w,d,h,m,0,g,r);o.position.set(x,y,z);return o;};
  const curve=(g,points,r,m,closed=false)=>{const path=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)),closed,'centripetal'),o=new T.Mesh(new T.TubeGeometry(path,Math.max(36,points.length*8),r,8,closed),m);o.castShadow=true;g.add(o);return o;};
  const chair=B1_MODELS.groups[chairName];chair.clear();chair.position.copy(W(837,882));chair.name='ENJOY121-EJB2-AB-HAM';
  const meshCanvas=document.createElement('canvas');meshCanvas.width=meshCanvas.height=64;const p=meshCanvas.getContext('2d');p.fillStyle='#050505';p.fillRect(0,0,64,64);p.strokeStyle='#d7d7d7';p.lineWidth=2;for(let n=-64;n<128;n+=8){p.beginPath();p.moveTo(n,0);p.lineTo(n+24,64);p.moveTo(n,64);p.lineTo(n+24,0);p.stroke();}const weave=new T.CanvasTexture(meshCanvas);weave.wrapS=weave.wrapT=T.RepeatWrapping;weave.repeat.set(8,8);
  const mesh=mat('#343a3b',.92,{alphaMap:weave,alphaTest:.24,side:T.DoubleSide});
  const seatAssembly=new T.Group();chair.add(seatAssembly);
  localBox(seatAssembly,0,41,0,42,5,49,black,2);localBox(seatAssembly,0,45,0,43,4,50.5,mesh,2);
  curve(seatAssembly,[[-20,47,-23],[19,45,-24],[22,44,0],[19,45,24],[-20,47,23]],1.15,nylon,true);
  const back=new T.Group();seatAssembly.add(back);const geo=new T.PlaneGeometry(1,1,30,34),v=geo.attributes.position;
  for(let i=0;i<v.count;i++){const u=v.getX(i),t=v.getY(i)+.5,width=42+7*Math.sin(t*Math.PI*.7);v.setXYZ(i,-24-4*t+3*Math.sin(t*Math.PI*1.5),57+t*52,u*width);}geo.computeVertexNormals();const net=new T.Mesh(geo,mesh);net.castShadow=net.receiveShadow=true;back.add(net);
  curve(back,[[-24,59,-17],[-26,71,-24],[-29,100,-24],[-29,109,0],[-29,100,24],[-26,71,24],[-24,59,17],[-24,57,0]],1.4,nylon,true);
  curve(back,[[-27,54,0],[-32,77,0],[-34,94,0],[-33,107,0]],2,nylon);for(const side of [-1,1])curve(back,[[-32,79,0],[-33,85,side*12],[-31,97,side*22]],1.5,nylon);
  localBox(back,-30,118,0,4,12.5,32.5,mesh,2.5);curve(back,[[-30,112,-14],[-31,123,-14],[-31,125,0],[-31,123,14],[-30,112,14]],1.1,nylon,true);localBox(back,-32,111,0,3,12,3,nylon);
  const recline=new T.Group();recline.position.set(-22,52,0);seatAssembly.add(recline);chair.updateMatrixWorld(true);recline.attach(back);
  for(const side of [-1,1]){curve(seatAssembly,[[-5,40,side*24],[-8,47,side*28],[-4,65,side*29]],1.25,steel);localBox(seatAssembly,-3,60,side*29,4,13,4,nylon);localBox(seatAssembly,3,68,side*29,22,4.5,8,nylon,2);}
  const post=new T.Mesh(new T.CylinderGeometry(2.5,3.5,31,24),steel);post.position.set(0,24,0);chair.add(post);localBox(chair,0,39,0,25,6,20,nylon,2);
  for(const side of [-1,1])curve(chair,[[0,39,side*8],[8,38,side*21],[12,37,side*24]],.9,nylon);
  for(let i=0;i<5;i++){const a=i*Math.PI*2/5,x=Math.cos(a)*29.3,z=Math.sin(a)*29.3;curve(chair,[[0,11,0],[x*.45,9,z*.45],[x,6,z]],2.6,nylon);for(const offset of [-1.6,1.6]){const w=new T.Mesh(new T.CylinderGeometry(3.4,3.4,2.6,18),nylon);w.rotation.x=Math.PI/2;w.position.set(x,3.4,z+offset);chair.add(w);}}
  B1_MODELS.actors.push({id:'chair-recline',name:'ENJOY121 椅背',x:824,y:882,h:90,range:115,on:false,p:0,verbs:['後仰休息','回到工作坐姿'],apply:p=>recline.rotation.z=p*.21});
  designSpecs.chair={model:'ENJOY121 企業版 2.0 EJB2-AB-HAM',color:'black',width:66,baseDiameter:65.5,seatDepth:43,seatWidth:50.5,headrestWidth:32.5,heightRange:[110,132.5],source:'https://ergohuman.com.tw/ejb2-ab-ham/'};

  // Keep the existing monitor, keyboard and speakers attached to the moving desktop.
  const lift=new T.Group();lift.name='MITTZON-moving-desktop';scene.add(lift);
  for(const o of [...scene.children])if(o.userData.furnitureName===deskName){if(o.position.y>=77)lift.attach(o);else scene.remove(o);}
  const desk=new T.Group();desk.name='IKEA-MITTZON-49530343';scene.add(desk);const walnut=oak.clone();walnut.color.set('#7c5d43');walnut.roughness=.55;
  rounded(859,790,68,160,2.5,walnut,74.5,lift,1);rounded(927,790,12,160,2.5,white,74.5,lift,.8);
  for(const y of [802,875]){rounded(929,y,8,60,.5,nylon,77.02,lift,.3);rounded(929.5,y+1,7,58,.8,white,77.3,lift,.3);}
  rounded(891,807,22,126,6,white,66,lift,1);rounded(928,799,9,141,8,mat('#575b59',.95),64,lift,1);
  const upperColumns=[];for(const y of [808,928]){rounded(864,y-4,70,8,4,white,3,desk,1.5);rounded(896,y-4,8,8,38,white,7,desk,.5);const upper=rounded(897,y-3,6,6,30,white,43,desk,.4);upperColumns.push(upper);rounded(863,y-9,69,18,3,white,70,lift,.7);for(const x of [869,928]){const foot=new T.Mesh(new T.CylinderGeometry(2.8,2.8,2,16),nylon);foot.position.copy(W(x,y,2));desk.add(foot);}}
  rounded(858,918,2,21,3,nylon,71,lift,.4);for(const y of [922,927,932,936])rounded(857.8,y,.4,2,.8,white,72,lift,.1);
  const cable=rod([934,945,8],[934,945,70],.45,nylon,desk);
  function setDeskHeight(height){height=Math.max(62,Math.min(126,height));lift.position.y=height-77;for(const c of upperColumns){c.scale.y=(height-47)/30;c.position.y=43+(height-47)/2;}cable.scale.y=(height-12)/62;cable.position.y=8+(height-12)/2;return height;}
  setDeskHeight(74);designSpecs.mediaDesk={width:160,depth:80,model:'IKEA MITTZON 495.303.43',finish:'walnut/white',heightRange:[62,126],seatedHeight:74,standingHeight:112,wall:'opposite-solid',source:'https://www.ikea.com.tw/zh/products/office-workspace/office-desks-and-tables/mittzon-spr-49530343'};
  const deskCollider=furniture.find(f=>f.name===deskName);Object.assign(deskCollider,{x:859,y:790,w:80,d:160});
  const deskLabel=[...svg.querySelectorAll('text')].find(t=>t.textContent===deskName);if(deskLabel?.previousElementSibling?.tagName==='rect'){for(const [k,v]of Object.entries({x:859,y:150,width:80,height:160}))deskLabel.previousElementSibling.setAttribute(k,v);deskLabel.setAttribute('x',899);}
  if(configs.media)configs.media.text='IKEA MITTZON 胡桃木／白色升降桌 160 × 80 cm，搭配 ENJOY121 企業版2.0 黑網布人體工學椅；工作桌位於對面實牆，保留窗邊與臥榻動線。';

  // The second entrance-side TV cabinet is an upper/lower pair with a real open niche.
  const wallName='延伸電視牆／單扇玻璃門';for(const o of [...scene.children])if(o.userData.furnitureName===wallName&&o.geometry?.parameters.height===193&&Math.abs(700-o.position.z-589)<3)scene.remove(o);
  const display=new T.Group();display.name='tv-second-bay-souvenir-niche';scene.add(display);
  rounded(1220,561,36,56,2,walnut,108,display,.4);rounded(1220,561,36,56,2,walnut,154,display,.4);rounded(1252,563,2,52,44,walnut,110,display,.3);
  const nicheLight=new T.PointLight('#ffe0a6',600,160,2);nicheLight.position.copy(W(1228,589,146));display.add(nicheLight);rounded(1222,565,1,48,.8,mat('#ffe6ba',.4,{emissive:0xffd197,emissiveIntensity:1}),152.9,display,.1);
  for(const [y,h,col]of [[571,16,'#8e9e92'],[578,21,'#c3ac81'],[585,18,'#d7cbb4']])rounded(1230,y,12,4,h,mat(col,.8),110,display,.3);
  rounded(1227,598,15,14,2,white,110,display,.4);const keepsake=new T.Mesh(new T.IcosahedronGeometry(5,1),mat('#a7b8b3',.3,{metalness:.25}));keepsake.position.copy(W(1234,605,119));display.add(keepsake);
  const doors=[];for(const [z,h]of [[59,49],[156,97]]){const hinge=new T.Group();hinge.position.copy(W(1220,563,z));display.add(hinge);const door=rounded(1219,563,2,52,h,oak,z,display,.5);hinge.attach(door);doors.push(hinge);}
  B1_MODELS.actors.push({id:'tv-display-storage',name:'紀念品層上下櫃',x:1217,y:589,h:135,range:120,on:false,p:0,verbs:['打開上下櫃','關閉上下櫃'],apply:p=>doors.forEach(h=>h.rotation.y=p*1.25)});
  designSpecs.souvenirNiche={bay:2,fromDoor:true,span:[561,617],openHeight:[110,154],upper:[156,253],lower:[59,108]};

  // Rebuild the left robot cabinet as a closed shell, with a deliberate lower docking opening.
  const robotName='面向浴室右手側／掃地機器人';for(const o of [...scene.children])if(o.userData.furnitureName===robotName)scene.remove(o);
  const cabinet=new T.Group();cabinet.name='sealed-entry-robot-cabinet';cabinet.userData.furnitureName=robotName;scene.add(cabinet);
  for(const x of [769,826.5])rounded(x,520,2,35,280,oak,0,cabinet,.3);rounded(771,520,55.5,2,278,oak,0,cabinet,.3);rounded(771,522,55.5,31,2,oak,54,cabinet,.3);rounded(771,522,55.5,31,2,oak,278,cabinet,.3);
  for(const z of [105,160,215])rounded(771,522,55.5,31,2,oak,z,cabinet,.3);
  const robotDoor=new T.Group();robotDoor.position.copy(W(771,554,56));cabinet.add(robotDoor);const panel=rounded(771,553,55.5,2,221,oak,56,cabinet,.3);robotDoor.attach(panel);
  rounded(782,522,32,10,36,white,1,cabinet,1);const vacuum=new T.Mesh(new T.CylinderGeometry(15,15,9,40),white);vacuum.position.copy(W(799,540,5));vacuum.castShadow=true;cabinet.add(vacuum);
  B1_MODELS.actors.push({id:'entry-robot-storage',name:'掃地機上方收納櫃',x:796,y:556,h:140,range:110,on:false,p:0,verbs:['打開玄關收納','關閉玄關收納'],apply:p=>robotDoor.rotation.y=p*1.25});
  rounded(923,522,2,30,275,oak,3); // Full backing behind the right-hand shallow supply niche.
  window.B1_PERSONAL={chair,desk,lift,display,cabinet,setDeskHeight,deskHeight:()=>77+lift.position.y,snapshot:()=>({chair:designSpecs.chair,desk:designSpecs.mediaDesk,height:77+lift.position.y,niche:designSpecs.souvenirNiche,sealedCabinet:true})};
})();
