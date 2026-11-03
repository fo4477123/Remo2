/* Original close-range vehicle coachwork. Curved panels, real apertures and a complete cabin. */
(() => {
  const cache=new Map(),rubber=mat('#181c20',.9),trim=mat('#20272c',.66),metal=mat('#a4adb4',.25,{metalness:.9}),darkMetal=mat('#454f58',.33,{metalness:.8}),leather=mat('#313a40',.82),glass=new T.MeshPhysicalMaterial({color:'#6e828c',roughness:.075,metalness:.08,transparent:true,opacity:.64,depthWrite:false,side:T.DoubleSide,forceSinglePass:true}),red=mat('#a51f26',.22,{emissive:0xc62921,emissiveIntensity:.45}),led=mat('#e3eff4',.23,{emissive:0xc3e6ff,emissiveIntensity:.5});
  const roofGlass=new T.MeshPhysicalMaterial({color:'#18252c',roughness:.09,metalness:.25,clearcoat:1,transparent:true,opacity:.92,depthWrite:false,side:T.DoubleSide});
  led.userData.vehicleHeadlight=true;
  function cloneLights(group){const lamps=[],materials=new Map();group.traverse(o=>{if(o.isMesh&&o.material.userData.vehicleHeadlight){if(!materials.has(o.material))materials.set(o.material,o.material.clone());o.material=materials.get(o.material);lamps.push(o);}});return lamps;}
  const shapes={
    focus:{cabin:[[-.465,.685,.435],[-.344,.963,.354],[-.13,1,.351],[.047,.982,.36],[.245,.652,.438]],belt:[[-.5,.628],[-.35,.665],[-.15,.657],[.15,.638],[.32,.627],[.5,.594]],width:[[-.5,.946],[-.42,.995],[-.30,1],[-.1,.981],[.22,1],[.37,.99],[.5,.948]],crease:1.7,spokes:5},
    altis:{cabin:[[-.332,.656,.425],[-.179,.957,.355],[-.068,1,.35],[.039,.978,.354],[.248,.653,.438]],belt:[[-.5,.63],[-.34,.672],[-.12,.66],[.20,.644],[.35,.624],[.5,.595]],width:[[-.5,.922],[-.4,.982],[-.29,1],[-.08,.968],[.25,.998],[.39,.975],[.5,.93]],crease:.75,spokes:10},
    sentra:{cabin:[[-.341,.654,.423],[-.185,.949,.361],[-.067,1,.354],[.030,.981,.355],[.258,.656,.439]],belt:[[-.5,.632],[-.35,.685],[-.18,.668],[.14,.646],[.32,.626],[.5,.612]],width:[[-.5,.94],[-.42,.994],[-.29,1],[-.04,.973],[.24,1],[.37,.987],[.5,.947]],crease:1.9,spokes:5},
    kicks:{cabin:[[-.479,.763,.430],[-.349,.975,.356],[-.12,1,.348],[.027,.978,.354],[.233,.662,.430]],belt:[[-.5,.72],[-.36,.755],[-.22,.717],[0,.687],[.23,.661],[.38,.646],[.5,.628]],width:[[-.5,.925],[-.40,.984],[-.30,1],[-.08,.968],[.21,1],[.38,.975],[.5,.932]],crease:2.4,spokes:10},
    kuga:{cabin:[[-.474,.716,.427],[-.335,.958,.365],[-.1,1,.362],[.045,.981,.363],[.262,.651,.443]],belt:[[-.5,.677],[-.35,.708],[-.15,.687],[.15,.657],[.32,.635],[.5,.615]],width:[[-.5,.93],[-.41,.988],[-.29,1],[-.09,.976],[.23,1],[.38,.978],[.5,.941]],crease:1.35,spokes:10},
    'corolla-cross':{cabin:[[-.482,.755,.435],[-.364,.968,.371],[-.12,1,.363],[.045,.982,.366],[.252,.684,.443]],belt:[[-.5,.716],[-.35,.743],[-.15,.725],[.14,.704],[.31,.688],[.5,.655]],width:[[-.5,.939],[-.42,.989],[-.295,1],[-.05,.977],[.22,1],[.38,.986],[.5,.947]],crease:2.0,spokes:5}
  };
  // Shape-preserving Hermite interpolation keeps each photographed silhouette independent.
  function sample(points,z,column=1){let i=1;while(i<points.length-1&&points[i][0]<z)i++;const a=points[i-1],b=points[i],t=Math.max(0,Math.min(1,(z-a[0])/(b[0]-a[0]))),prev=points[Math.max(0,i-2)],next=points[Math.min(points.length-1,i+1)],d=(b[column]-a[column])/(b[0]-a[0]),slope=(u,v)=>((v[column]-u[column])/(v[0]-u[0]||1)),m0=i===1?d:slope(prev,b),m1=i===points.length-1?d:slope(a,next),safe=m=>m*d<=0?0:Math.sign(m)*Math.min(Math.abs(m),3*Math.abs(d));return (2*t*t*t-3*t*t+1)*a[column]+(t*t*t-2*t*t+t)*safe(m0)*(b[0]-a[0])+(-2*t*t*t+3*t*t)*b[column]+(t*t*t-t*t)*safe(m1)*(b[0]-a[0]);}
  const looks={focus:{rear:-.43,roofRear:-.27,roofFront:.06,front:.26,roofWidth:.38,spokes:5,grille:.57,grilleH:29,hood:.96},altis:{rear:-.31,roofRear:-.18,roofFront:.06,front:.28,roofWidth:.37,spokes:10,grille:.67,grilleH:30,hood:.91},sentra:{rear:-.32,roofRear:-.19,roofFront:.045,front:.28,roofWidth:.38,spokes:5,grille:.55,grilleH:32,hood:.96},kicks:{rear:-.43,roofRear:-.30,roofFront:.04,front:.26,roofWidth:.38,spokes:5,grille:.56,grilleH:38,hood:1.03},kuga:{rear:-.43,roofRear:-.28,roofFront:.055,front:.28,roofWidth:.37,spokes:10,grille:.56,grilleH:33,hood:1.01},'corolla-cross':{rear:-.43,roofRear:-.29,roofFront:.06,front:.28,roofWidth:.38,spokes:5,grille:.60,grilleH:40,hood:1.02}};
  function batch(parent){const buckets=new Map();for(const o of [...parent.children])if(o.isMesh&&!o.userData.keep){if(!buckets.has(o.material))buckets.set(o.material,[]);buckets.get(o.material).push(o);}for(const [material,list]of buckets){if(list.length<2)continue;const p=[],n=[],uv=[];for(const o of list){o.updateMatrix();const g=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();g.applyMatrix4(o.matrix);const v=g.attributes.position,no=g.attributes.normal,u=g.attributes.uv;for(let i=0;i<v.count;i++){p.push(v.getX(i),v.getY(i),v.getZ(i));n.push(no.getX(i),no.getY(i),no.getZ(i));uv.push(u?u.getX(i):0,u?u.getY(i):0);}g.dispose();o.removeFromParent();o.geometry.dispose();}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(p,3));geo.setAttribute('normal',new T.Float32BufferAttribute(n,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.computeBoundingSphere();const o=new T.Mesh(geo,material);o.castShadow=o.receiveShadow=true;parent.add(o);}}
  function build(s,color){
    const root=new T.Group(),wheels=[],lamps=[],cfg={...looks[s.id],...B1_VEHICLE_FACES.profiles[s.id]},shape=shapes[s.id],L=s.length,W=s.width,H=s.height,A=s.axle/2,suv=['suv','crossover'].includes(s.body),R=s.id==='fox-d'?39:suv?35:33,paint=new T.MeshPhysicalMaterial({color,roughness:.25,metalness:.52,clearcoat:1,clearcoatRoughness:.12,envMapIntensity:1.1}),roofPaint=['sentra','kicks','fox-a','fox-b','fox-d'].includes(s.id)?trim:paint;
    root.name='sculpted-'+s.id;const parts={body:0,lamps:0,cabin:0,wheel:0};
    function mesh(g,m,p=[0,0,0],name='',parent=root){const o=new T.Mesh(g,m);o.position.set(...p);o.name=name;o.castShadow=m!==glass;o.receiveShadow=true;parent.add(o);return o;}
    const box=(p,sz,m=paint,r=1,parent=root)=>{const g=new T.BoxGeometry(sz[0],sz[1],sz[2],3,3,3),v=g.attributes.position,q=new T.Vector3(),c=new T.Vector3(),radius=Math.min(r,...sz.map(n=>n*.32));for(let i=0;i<v.count;i++){q.fromBufferAttribute(v,i);c.set(...sz.map((n,k)=>Math.max(-n/2+radius,Math.min(n/2-radius,q.getComponent(k)))));q.sub(c).normalize().multiplyScalar(radius).add(c);v.setXYZ(i,q.x,q.y,q.z);}g.computeVertexNormals();return mesh(g,m,p,'bevelled-detail',parent);};
    function tube(points,r,m=trim,parent=root,angular=false){const path=new T.CurvePath();if(angular)for(let i=1;i<points.length;i++)path.add(new T.LineCurve3(new T.Vector3(...points[i-1]),new T.Vector3(...points[i])));else path.add(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)),false,'centripetal'));return mesh(new T.TubeGeometry(path,angular?Math.max(2,(points.length-1)*2):Math.max(10,points.length*3),r,5,false),m,[0,0,0],'panel-seam',parent);}
    function rod(a,b,r,m=metal,parent=root){const p=new T.Vector3(...a),q=new T.Vector3(...b),d=q.clone().sub(p),o=mesh(new T.CylinderGeometry(r,r,d.length(),8),m,p.add(q).multiplyScalar(.5).toArray(),'',parent);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());return o;}
    function patch(rows,cols,fn,m,name,cut=null){const p=[],idx=[],uv=[];for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){p.push(...fn(i/rows,j/cols));uv.push(j/cols,i/rows);}for(let i=0;i<rows;i++)for(let j=0;j<cols;j++){if(cut?.((i+.5)/rows,(j+.5)/cols))continue;const a=i*(cols+1)+j;idx.push(a,a+cols+1,a+1,a+1,a+cols+1,a+cols+2);}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();const o=mesh(g,m,[0,0,0],name);o.material.side=T.DoubleSide;return o;}

    const profile=B1_VEHICLE_FACES.profiles[s.id],faceScale=['sedan','hatch'].includes(s.body)?.90:1,frontTop=H*Math.max(...profile.head.map(p=>p[1]))*faceScale+5,rearTop=H*(profile.tailOutline?Math.max(...profile.tailOutline.map(p=>p[1])):profile.rearH||.66)+5;
    const belt=z=>{const base=H*sample(shape.belt,z/L),t=Math.max(0,Math.min(1,(Math.abs(z/L)-.28)/.22)),blend=t*t*(3-2*t);return base+Math.max(0,(z>0?(s.id==='model-3'?0:frontTop):rearTop)-H*sample(shape.belt,z>0?.5:-.5))*blend;},width=z=>W/2*sample(shape.width,z/L),edge=z=>belt(z)-5+(s.id==='model-3'?12*Math.max(0,(z/L-.28)/.22):0);
    // Both lights and coachwork project onto the same rounded end surface.
    const endInset=(x,y,sign=1)=>{const top=topY(sign*L/2,Math.min(1,Math.abs(x)/(width(sign*L/2)*.96))),v=Math.max(0,Math.min(1,(y-19)/(top-19))),corner=(s.id==='model-3'?34:28)*Math.pow(Math.abs(x)/(W/2),4);return corner+(s.id==='model-3'?20:12)*Math.pow((v-.46)/.54,2);};
    const noseZ=(x,z,y=45)=>z-Math.sign(z)*Math.pow(Math.abs(z)/(L/2),12)*endInset(x,y,Math.sign(z));
    const sideX=(z,v)=>width(z)*(.91+.09*Math.sin(v*Math.PI*.79))-shape.crease*Math.pow(Math.sin(v*Math.PI),2)+3.3*Math.max(...[-A,A].map(a=>Math.exp(-Math.pow((z-a)/46,2))))*Math.sin(v*Math.PI);
    const topY=(z,u)=>belt(z)+3.5*(1-u*u)-5*Math.pow(Math.abs(u),5)+(s.id==='model-3'?Math.max(0,(z/L-.28)/.22)*(-8*(1-u*u)+12*Math.pow(Math.abs(u),4)):0);
    // Continuous curved body skin, separately formed wheel shoulders, recessed sill and hood crown.
    const archBase=z=>Math.max(19,...[-A,A].map(a=>Math.abs(z-a)<R+4?R+Math.sqrt((R+4)**2-(z-a)**2):19));
    for(const side of [-1,1])patch(176,18,(t,v)=>{const z=-L/2+t*L,bottom=archBase(z),y=bottom+(edge(z)-bottom)*v,sv=(y-19)/(edge(z)-19),x=side*sideX(z,sv);return[x,y,noseZ(x,z,y)];},paint,'continuous-wheel-opening-'+s.id);
    const c=shape.cabin.map(p=>[...p]),rear=c[0][0]*L,roofRear=c[1][0]*L,roofFront=c[3][0]*L,front=c[4][0]*L;c[0][1]=(belt(rear)+5)/H;c[4][1]=(belt(front)+5)/H;
    for(const [start,end]of [[-L/2,rear],[front,L/2]])patch(32,32,(t,u)=>{const z=start+(end-start)*t,a=u*2-1,x=sideX(z,1)*a;return[x,topY(z,a),noseZ(x,z,topY(z,a))];},paint,'formed-hood-deck-'+s.id);
    for(const sign of [-1,1])patch(20,42,(t,u)=>{const z=sign*L/2,a=u*2-1,y=19+(topY(z,a)-19)*t,x=a*sideX(z,(y-19)/(edge(z)-19));return[x,y,noseZ(x,z,y)];},paint,sign>0?'formed-front-bumper':'formed-rear-bumper');
    patch(36,18,(t,u)=>{const z=rear+(front-rear)*t,a=u*2-1;return[a*width(z)*.94,belt(z)-3,z];},trim,'cabin-waist-cover');
    box([0,21,0],[W*.83,7,L*.91],trim,3);
    const cabin=(z)=>({z,w:W*sample(c,z/L,2),h:H*sample(c,z/L,1)});
    function roofAt(z,a){const p=cabin(z);return[a*p.w,p.h-4.5*a*a,z];}
    function glassSide(z,v,side){const p=cabin(z),base=belt(z)+1;return[side*(p.w+(width(z)*.916-p.w)*v),p.h-4.5+(base-p.h+4.5)*v,z];}
    for(const z of [rear,front])patch(3,32,(t,u)=>{const a=u*2-1,top=roofAt(z,a),x=sideX(z,1)*a,y=topY(z,a),end=[x,y,noseZ(x,z,y)];return top.map((v,i)=>v*(1-t)+end[i]*t);},paint,'sealed-glazing-cowl');
    patch(18,32,(t,u)=>roofAt(rear+(roofRear-rear)*t,u*2-1),glass,'rear-glass-'+s.id);
    patch(32,32,(t,u)=>roofAt(roofRear+(roofFront-roofRear)*t,u*2-1),s.id==='model-3'?roofGlass:roofPaint,'roof-crown-'+s.id);
    patch(22,32,(t,u)=>roofAt(roofFront+(front-roofFront)*t,u*2-1),glass,'windscreen-'+s.id);
    for(const side of [-1,1]){
      patch(64,10,(t,v)=>glassSide(rear+(front-rear)*t,v,side),glass,'window-outline-'+s.id);
      patch(64,8,(t,v)=>{const z=rear+(front-rear)*t,q=glassSide(z,1,side);return[side*sideX(z,1)*(1-v)+q[0]*v,edge(z)*(1-v)+q[1]*v,z];},paint,'closed-window-sill-'+s.id);
      // Painted C pillar, black B pillar and the individual rear quarter window.
      patch(12,10,(t,v)=>{const q=glassSide(rear+(roofRear-rear)*t*(s.id==='model-3'?.30:s.id==='fox-d'?.32:.55),v,side);q[0]+=side*.35;return q;},roofPaint,'rear-pillar-'+s.id);
      const bZ=s.id==='kicks'?-L*.075:-L*.055;
      for(const [z,r,m]of [[bZ,2.8,trim],[rear+(roofRear-rear)*.79,2,roofPaint],[front-3,2.2,paint]])tube([glassSide(z,0,side),glassSide(z,1,side)],r,m);
      tube(Array.from({length:40},(_,i)=>glassSide(rear+(front-rear)*i/39,0,side)),1.5,roofPaint);
      tube(Array.from({length:40},(_,i)=>glassSide(rear+(front-rear)*i/39,1,side)),1.1,['altis','kuga'].includes(s.id)?metal:trim);
      // Body creases follow the real rising belt line, with long lower-door concavity.
      tube(Array.from({length:30},(_,i)=>{const z=-L*.39+L*.77*i/29;return[side*(sideX(z,.80)+.25),19+(edge(z)-19)*.80,z];}),.25,paint);
      tube(Array.from({length:22},(_,i)=>{const z=-L*.30+L*.59*i/21;return[side*(sideX(z,.18)+.3),19+(edge(z)-19)*.18,z];}),suv?2:1.2,suv?trim:paint);
      for(const z of [-L*.255,bZ,L*.216]){const pts=Array.from({length:16},(_,i)=>{const v=.08+.9*i/15;return[side*(sideX(z,v)+.25),19+(edge(z)-19)*v,z];}).filter(p=>![-A,A].some(a=>Math.hypot(p[2]-a,p[1]-R)<R+4));if(pts.length>1)tube(pts,.25,trim);}
      for(const z of [-L*.175,L*.12])box([side*(sideX(z,.90)+.7),19+(edge(z)-19)*.90,z],[1.8,2.7,15],s.id==='kicks'||s.id==='altis'?metal:paint,1);
      for(const axle of [-A,A]){
        const arch=Array.from({length:37},(_,i)=>{const a=i/36*Math.PI,y=R+Math.sin(a)*(R+4.2),z=axle+Math.cos(a)*(R+4.2);const sv=(y-19)/(edge(z)-19),x=side*(sideX(z,sv)+.25);return[x,y,noseZ(x,z,y)];});tube(arch,suv?3:1.05,suv?trim:paint);
        // Wheel-well backing closes the cut edge without an opaque cylinder through the tyre.
        patch(24,5,(t,v)=>{const a=t*Math.PI,z=axle+Math.cos(a)*(R+4.3),y=R+Math.sin(a)*(R+4.3);const sv=(y-19)/(edge(z)-19),x=side*(sideX(z,sv)-v*14);return[x,y,noseZ(x,z,y)];},trim,'inner-arch');
      }
      const mz=front-12,mh=belt(mz)+9;rod([side*W*.435,mh,mz],[side*(W/2+7),mh+1,mz],1.8,trim);const mirror=mesh(new T.SphereGeometry(1,22,14),paint,[side*(W/2+7),mh+3,mz],'mirror');mirror.scale.set(8,4.8,9);box([side*(W/2+7),mh+3,mz-6],[11,6,.6],darkMetal,1);box([side*(W/2+7),mh+2,mz+8],[10,1,1],led,.3);
    }
    if(s.body!=='sedan'){const z=roofRear-4,h=cabin(z).h;box([0,h-.2,z],[W*.73,3.5,16],roofPaint,2);box([0,h-1,z-8],[W*.40,1.5,1.3],red,.4);}
    if(suv&&!s.id.startsWith('fox-'))for(const side of [-1,1])tube(Array.from({length:15},(_,i)=>{const z=roofRear+8+(roofFront-roofRear-18)*i/14;return[side*W*.30,cabin(z).h+1,z];}),1.4,s.id==='kicks'?trim:metal);
    // Two shallow hood pressings and realistic wipers lie on the bonnet, not above the lights.
    for(const side of [-1,1]){tube(Array.from({length:16},(_,i)=>{const z=front+9+(L/2-front-25)*i/15,a=side*(.52+.18*i/15),x=sideX(z,1)*a;return[x,topY(z,a)+.1,noseZ(x,z,topY(z,a))];}),.22,paint);tube([[side*W*.05,belt(front)+3,front+2],[side*W*.29,belt(front)+3,front-3]],.65,trim);}
    const frontZ=(x,y=45)=>{if(s.id==='model-3'&&y>topY(L/2,x/sideX(L/2,1))){let a=L*.25,b=L/2;for(let i=0;i<18;i++){const z=(a+b)/2;if(topY(z,x/sideX(z,1))>y)a=z;else b=z;}return noseZ(x,(a+b)/2,y)+.65;}return noseZ(x,L/2,y)+.65;},rearZ=(x,y=45)=>noseZ(x,-L/2,y)-.65;
    function frontPolygon(poly,m,zfunc=frontZ,name='face-panel'){
      const pos=[],vertices=poly.map(p=>new T.Vector2(...p)),triangles=T.ShapeUtils.triangulateShape(vertices,[]);
      // Ear clipping respects concave lamp apertures; centroid fans filled C-shaped lamps.
      for(const ids of triangles){const [a,b,d]=ids.map(i=>poly[i]),point=(i,j)=>{const x=a[0]+(b[0]-a[0])*i/8+(d[0]-a[0])*j/8,y=a[1]+(b[1]-a[1])*i/8+(d[1]-a[1])*j/8;return[x,y,zfunc(x,y)];};for(let i=0;i<8;i++)for(let j=0;j<8-i;j++){pos.push(...point(i,j),...point(i+1,j),...point(i,j+1));if(i+j<7)pos.push(...point(i+1,j),...point(i+1,j+1),...point(i,j+1));}}
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.computeVertexNormals();const o=mesh(g,m,[0,0,0],name);o.material.side=T.DoubleSide;return o;
    }
    const face=B1_VEHICLE_FACES.build({s,root,mesh,box,tube,rod,poly:frontPolygon,frontZ,rearZ,paint,trim,metal,darkMetal,red,led,lamps});
    // Sculpted bumper volumes, lower intakes and tailgate shut-lines anchor the fascia in the body.
    for(const sign of [-1,1]){
      const at=sign*L/2;
      tube(Array.from({length:35},(_,i)=>{const x=(i/34*2-1)*W*.438;return[x,23+(suv?2:0),noseZ(x,at,23)-sign*.2];}),suv?4:2.3,trim);
      if(sign<0){const contour=[[-.42,.58],[-.37,.37],[.37,.37],[.42,.58]].map(([x,y])=>[x*W,y*H,rearZ(x*W,y*H)]);tube(contour,.32,trim,root,true);box([0,H*.36,rearZ(0,H*.36)+1],[38,14,1],trim,2);box([0,H*.54,rearZ(0,H*.54)-.6],[s.nose==='ford'?11:8,4,.8],metal,1);for(const side of [-1,1])tube(Array.from({length:9},(_,i)=>{const x=side*(W*.27+i*2);return[x,29,rearZ(x,29)-.6];}),.9,red);}
    }
    if(suv&&!s.id.startsWith('fox-'))for(const sign of [-1,1])tube(Array.from({length:25},(_,i)=>{const x=(i/24-.5)*W*.60;return[x,22,noseZ(x,sign*L/2,22)+sign];}),1.4,metal);
    // Seats, dashboard, console, instrument cluster, steering and door cards are actual geometry.
    box([0,31,0],[W*.86,5,L*.60],trim,3);for(const side of [-1,1]){const x=side*W*.23;box([x,53,-L*.015],[46,13,52],leather,6);const seat=box([x,88,-L*.075],[45,64,12],leather,6);seat.rotation.x=-.11;box([x,Math.min(119,cabin(-L*.09).h-14),-L*.09],[25,18,13],leather,4);for(const dx of [-17,17])box([x+dx,57,-L*.015],[7,12,44],leather,3);for(const z of [-L*.12,L*.12])tube([[side*W*.437,50,z-25],[side*W*.435,80,z],[side*W*.434,90,z+25]],2,leather);parts.cabin+=6;}
    box([0,52,-L*.225],[W*.78,14,46],leather,5);box([0,76,-L*.25],[W*.78,48,12],leather,6);for(const x of [-W*.22,0,W*.22])box([x,Math.min(110,cabin(-L*.25).h-13),-L*.25],[22,15,10],leather,4);box([0,belt(L*.24)-12,L*.22],[W*.84,22,28],leather,4);box([0,62,L*.055],[20,20,60],leather,3);box([0,78,L*.095],[8,12,8],darkMetal,2);box([0,64,-L*.045],[18,9,22],leather,3);const display=box([0,belt(L*.24)-3,L*.19],[25,17,2],trim,1);box([0,belt(L*.24)-3,L*.188],[22,14,.5],mat('#4b7582',.4,{emissive:0x274b5b,emissiveIntensity:.25}),.5);const steering=mesh(new T.TorusGeometry(15.5,1.5,10,40),trim,[-W*.235,belt(L*.22)-5,L*.135],'steering-wheel');steering.rotation.x=-.35;for(const a of [0,2.1,4.2])rod([-W*.235,belt(L*.22)-5,L*.135],[-W*.235+Math.sin(a)*13,belt(L*.22)-5+Math.cos(a)*13,L*.135],1.5,trim);
    if(s.id==='fox-d'){for(const x of [-W*.23,W*.23]){box([x,50,-L*.34],[40,12,36],leather,5);box([x,78,-L*.38],[40,44,10],leather,5);box([x,107,-L*.38],[23,15,10],leather,4);}}
    // Four articulated wheels with rounded tyre shoulders, grooves, split spokes, rotors and calipers.
    for(const side of [-1,1])for(const z of [-A,A]){const wheel=new T.Group();wheel.name='sculpt-wheel-'+wheels.length;wheel.position.set(side*(W/2-10.5),R,z);root.add(wheel);
      const tire=mesh(new T.TorusGeometry(R-6.5,6.5,16,72),rubber,[0,0,0],'rounded-tyre',wheel);tire.rotation.y=Math.PI/2;tire.scale.z=1.8;for(const offset of [-5,0,5]){const groove=mesh(new T.TorusGeometry(R-.25,.40,5,72),trim,[offset,0,0],'tyre-groove',wheel);groove.rotation.y=Math.PI/2;}
      const rim=mesh(new T.CylinderGeometry(R*.70,R*.70,20.6,64),darkMetal,[0,0,0],'alloy-barrel',wheel);rim.rotation.z=Math.PI/2;const disc=mesh(new T.CylinderGeometry(R*.57,R*.57,1.0,48),metal,[side*8.0,0,0],'brake-rotor',wheel);disc.rotation.z=Math.PI/2;
      const designs={focus:[5,2,.12,2.7],altis:[10,1,.08,1.5],sentra:[5,2,.20,2.0],kicks:[10,1,.16,1.5],kuga:[10,1,.31,2.1],'corolla-cross':[5,2,.09,3.1]},[count,split,sweep,spokeWidth]=designs[s.id]||(s.id==='model-3'?[5,2,.28,3]:s.id==='fox-d'?[6,2,.32,3]:[10,1,.12,2]);
      for(let i=0;i<count;i++)for(let fork=0;fork<split;fork++){const a=i*Math.PI*2/count+(fork?-.07:.07),inner=a+(fork?-.05:.05),outer=a+sweep+(fork?-.055:.055);rod([side*11,Math.sin(inner)*5,Math.cos(inner)*5],[side*11,Math.sin(outer)*R*.68,Math.cos(outer)*R*.68],spokeWidth,metal,wheel);}
      if(s.id==='model-3'||s.id==='fox-d'||s.id==='fox-b')for(let i=0;i<count;i++){const a=i*Math.PI*2/count,blade=box([side*10,Math.sin(a)*R*.41,Math.cos(a)*R*.41],[2,R*.43,R*.57],darkMetal,2,wheel);blade.rotation.x=-a+.27;}
      const lip=mesh(new T.TorusGeometry(R*.705,.8,5,48),metal,[side*10.8,0,0],'diamond-cut-rim-lip',wheel);lip.rotation.y=Math.PI/2;
      box([side*9,6,R*.43],[4,13,7],darkMetal,2,wheel);for(let i=0;i<5;i++){const a=i*Math.PI*.4;const lug=mesh(new T.CylinderGeometry(.9,.9,1.1,8),metal,[side*12,Math.sin(a)*4,Math.cos(a)*4],'wheel-lug',wheel);lug.rotation.z=Math.PI/2;}const cap=mesh(new T.CylinderGeometry(3,3,24.8,24),trim,[0,0,0],'hub-cap',wheel);cap.rotation.z=Math.PI/2;batch(wheel);wheels.push(wheel);parts.wheel+=cfg.spokes;
    }
    const rider=new T.Group();rider.visible=false;root.add(rider);batch(root);let triangles=0;root.traverse(o=>{if(o.isMesh)triangles+=(o.geometry.index?.count||o.geometry.attributes.position.count)/3;});root.userData.features=['curved-independent-panels','open-wheel-arches','wheel-well-liners','curved-transparent-glazing','projector-headlamps','model-specific-grille','detailed-alloy-wheels','tyre-grooves','brake-rotors-calipers',s.id==='fox-d'?'seven-seat-cabin':'five-seat-cabin','steering-dashboard','door-seams-wipers','taiwan-plates'];root.userData.triangles=triangles;return{group:root,wheels,lamps,rider,type:'car',features:root.userData.features,spec:{...s,...face,color,detail:'coachwork-v4',triangles,interpretation:true}};
  }
  function create(s,color){const key=[s.id,s.length,s.width,s.height,s.axle,color].join(':');let template=cache.get(key);if(!template){template=build(s,color);cache.set(key,template);}const group=template.group.clone(true),wheels=Array.from({length:4},(_,i)=>group.getObjectByName('sculpt-wheel-'+i));return{...template,group,wheels,lamps:cloneLights(group),rider:group.children.find(o=>o.isGroup&&!o.children.length)};}
  window.B1_VEHICLE_SCULPT={create,looks,shapes,batch,cloneLights};
})();
