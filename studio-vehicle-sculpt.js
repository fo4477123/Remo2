/* Original close-range vehicle coachwork. Curved panels, real apertures and a complete cabin. */
(() => {
  const cache=new Map(),rubber=mat('#181c20',.9),trim=mat('#20272c',.66),metal=mat('#a4adb4',.25,{metalness:.9}),darkMetal=mat('#454f58',.33,{metalness:.8}),leather=mat('#313a40',.82),glass=new T.MeshPhysicalMaterial({color:'#35464e',roughness:.055,metalness:.12,clearcoat:1,clearcoatRoughness:.04,transparent:true,opacity:.79,depthWrite:false,side:T.DoubleSide,forceSinglePass:true}),red=mat('#a51f26',.22,{emissive:0xc62921,emissiveIntensity:.45}),led=mat('#e3eff4',.23,{emissive:0xc3e6ff,emissiveIntensity:.5});
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
  function batch(parent){const buckets=new Map();for(const o of [...parent.children])if(o.isMesh&&!o.userData.keep){if(!buckets.has(o.material))buckets.set(o.material,[]);buckets.get(o.material).push(o);}for(const [material,list]of buckets){if(list.length<2)continue;const p=[],n=[],uv=[];for(const o of list){o.updateMatrix();const g=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();g.applyMatrix4(o.matrix);const v=g.attributes.position,no=g.attributes.normal,u=g.attributes.uv;for(let i=0;i<v.count;i++){p.push(v.getX(i),v.getY(i),v.getZ(i));n.push(no.getX(i),no.getY(i),no.getZ(i));uv.push(u?u.getX(i):0,u?u.getY(i):0);}g.dispose();o.removeFromParent();o.geometry.dispose();}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(p,3));geo.setAttribute('normal',new T.Float32BufferAttribute(n,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.computeBoundingSphere();const o=new T.Mesh(geo,material);o.castShadow=!material.transparent;o.receiveShadow=!material.userData.noSelfShadow;parent.add(o);}}
  function smoothNormals(g){const p=g.attributes.position,n=g.attributes.normal,buckets=new Map();for(let i=0;i<p.count;i++){const key=[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*1000)).join(',');if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(i);}for(const ids of buckets.values()){if(ids.length<2)continue;const normal=new T.Vector3();for(const i of ids)normal.add(new T.Vector3(n.getX(i),n.getY(i),n.getZ(i)));normal.normalize();for(const i of ids)n.setXYZ(i,normal.x,normal.y,normal.z);}n.needsUpdate=true;}
  function build(s,color){
    const leather=['fox-b','fox-c'].includes(s.id)?mat('#d5d2c7',.78):mat('#313a40',.82);
    const root=new T.Group(),wheels=[],lamps=[],cfg={...looks[s.id],...B1_VEHICLE_FACES.profiles[s.id]},shape=shapes[s.id],L=s.length,W=s.width,H=s.height,A=s.axle/2,suv=['suv','crossover'].includes(s.body),R=shape.wheelRadius||(s.id==='fox-d'?39:suv?35:33),paint=new T.MeshPhysicalMaterial({color,roughness:shape.sectionedBody?.27:.21,metalness:shape.sectionedBody?.48:.72,clearcoat:1,clearcoatRoughness:.08,envMapIntensity:1.25}),roofPaint=['sentra','kicks','fox-a','fox-b','fox-c','fox-d'].includes(s.id)?(shape.sectionedBody?new T.MeshPhysicalMaterial({color:'#151b20',roughness:.26,metalness:.25,clearcoat:1}):trim):paint;
    paint.userData.noSelfShadow=true;root.name='sculpted-'+s.id;const parts={body:0,lamps:0,cabin:0,wheel:0};
    function mesh(g,m,p=[0,0,0],name='',parent=root){const o=new T.Mesh(g,m);o.position.set(...p);o.name=name;o.castShadow=!m.transparent;o.receiveShadow=!m.userData.noSelfShadow;parent.add(o);return o;}
    const box=(p,sz,m=paint,r=1,parent=root)=>{const g=new T.BoxGeometry(sz[0],sz[1],sz[2],r<.2?1:3,r<.2?1:3,r<.2?1:3),v=g.attributes.position,q=new T.Vector3(),c=new T.Vector3(),radius=Math.min(r,...sz.map(n=>n*.32));for(let i=0;i<v.count;i++){q.fromBufferAttribute(v,i);c.set(...sz.map((n,k)=>Math.max(-n/2+radius,Math.min(n/2-radius,q.getComponent(k)))));q.sub(c).normalize().multiplyScalar(radius).add(c);v.setXYZ(i,q.x,q.y,q.z);}g.computeVertexNormals();smoothNormals(g);return mesh(g,m,p,'bevelled-detail',parent);};
    function tube(points,r,m=trim,parent=root,angular=false){const path=new T.CurvePath();if(angular)for(let i=1;i<points.length;i++)path.add(new T.LineCurve3(new T.Vector3(...points[i-1]),new T.Vector3(...points[i])));else path.add(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)),false,'centripetal'));return mesh(new T.TubeGeometry(path,angular?Math.max(2,(points.length-1)*2):Math.max(10,points.length*3),r,5,false),m,[0,0,0],'panel-seam',parent);}
    function rod(a,b,r,m=metal,parent=root){const p=new T.Vector3(...a),q=new T.Vector3(...b),d=q.clone().sub(p),o=mesh(new T.CylinderGeometry(r,r,d.length(),8),m,p.add(q).multiplyScalar(.5).toArray(),'',parent);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());return o;}
    function patch(rows,cols,fn,m,name,cut=null){const p=[],idx=[],uv=[];for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){p.push(...fn(i/rows,j/cols));uv.push(j/cols,i/rows);}for(let i=0;i<rows;i++)for(let j=0;j<cols;j++){if(cut?.((i+.5)/rows,(j+.5)/cols))continue;const a=i*(cols+1)+j;idx.push(a,a+cols+1,a+1,a+1,a+cols+1,a+cols+2);}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
      // Match the tangent at bonnet/shoulder and bumper joins. Separate patch
      // boundaries must not make a continuous painted surface look folded.
      if((!shape.sectionedBody&&name.startsWith('continuous-wheel'))||(name.startsWith('formed-hood')&&!shape.sectionedBody)||name.startsWith('formed-front')||name.startsWith('formed-rear')){
        const normals=g.attributes.normal,positions=g.attributes.position;
        for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
          const k=i*(cols+1)+j,x=positions.getX(k),z=positions.getZ(k),n=new T.Vector3(normals.getX(k),normals.getY(k),normals.getZ(k));
          if(name.startsWith('continuous-wheel')){const sign=Math.sign(x),weight=Math.max(0,(j/cols-.80)/.20);if(n.x*sign<0)n.negate();n.lerp(new T.Vector3(sign*.40,.916,0),weight*.8);}
          if(name.startsWith('formed-hood')){const a=j/cols*2-1,weight=Math.max(0,(Math.abs(a)-.80)/.20);if(n.y<0)n.negate();n.lerp(new T.Vector3(Math.sign(a)*.40,.916,0),weight*.8);}
          if(name.startsWith('formed-front')||name.startsWith('formed-rear')){const sign=name.startsWith('formed-front')?1:-1;if(n.z*sign<0)n.negate();const top=Math.max(0,(i/rows-.80)/.20);n.lerp(new T.Vector3(0,.75,sign*.66),top*.75);}
          n.normalize();if(name.startsWith('continuous-wheel')&&x>0)n.negate();if(name.startsWith('formed-front'))n.negate();normals.setXYZ(k,n.x,n.y,n.z);
        }
      }
      const o=mesh(g,m,[0,0,0],name);o.material.side=T.DoubleSide;return o;}

    const profile=B1_VEHICLE_FACES.profiles[s.id],faceScale=['sedan','hatch'].includes(s.body)?.90:1,frontTop=H*Math.max(...profile.head.map(p=>p[1]))*faceScale+5,rearTop=H*(profile.tailOutline?Math.max(...profile.tailOutline.map(p=>p[1])):profile.rearH||.66)+5;
    const belt=z=>{const base=H*sample(shape.belt,z/L),t=Math.max(0,Math.min(1,(Math.abs(z/L)-.28)/.22)),blend=t*t*(3-2*t);return base+(shape.sectionedBody?0:Math.max(0,(z>0?(s.id==='model-3'?0:frontTop):rearTop)-H*sample(shape.belt,z>0?.5:-.5))*blend);},width=z=>W/2*sample(shape.width,z/L),edge=z=>shape.sectionedBody?topY(z,1):belt(z)-5+(s.id==='model-3'?12*Math.max(0,(z/L-.28)/.22):0);
    // Both lights and coachwork project onto the same rounded end surface.
    const endInset=(x,y,sign=1)=>{const top=topY(sign*L/2,Math.min(1,Math.abs(x)/(width(sign*L/2)*.96))),v=Math.max(0,Math.min(1,(y-19)/(top-19)));
      if(shape.sectionedBody){
        const a=Math.min(1,Math.abs(x)/(W/2)),section=sample(sign>0?shape.noseSection:shape.tailSection,v);
        // The S-duct recess belongs to the centre of the nose. Applying it
        // across the entire bumper pulled the lamp pockets behind the fenders.
        const t=Math.max(0,Math.min(1,(a-.47)/.36)),blend=t*t*(3-2*t),outer=3+3*Math.pow((v-.54)/.54,2);
        return 22*Math.pow(a,4)+(sign>0?section*(1-blend)+outer*blend:section*(1-.38*a*a));
      }
      const corner=(s.id==='model-3'?34:28)*Math.pow(Math.abs(x)/(W/2),4);return corner+(s.id==='model-3'?10:12)*Math.pow((v-.46)/.54,2);};
    const noseZ=(x,z,y=45)=>z-Math.sign(z)*Math.pow(Math.abs(z)/(L/2),12)*endInset(x,y,Math.sign(z));
    const sideX=(z,v)=>shape.sectionedBody?
      width(z)*sample(shape.sideSection,Math.max(0,Math.min(1,v)))
      +1.4*Math.max(...[-A,A].map(a=>Math.exp(-Math.pow((z-a)/48,2))))*Math.exp(-Math.pow((v-.63)/.32,2))
      -(s.id==='fox-b'?4:3.5)*Math.exp(-Math.pow((v-(.29+.10*Math.exp(-Math.pow((z+A*.7)/70,2))))/.24,2))*Math.exp(-Math.pow(z/(A*.92),4)):
      width(z)*(.91+.09*Math.sin(v*Math.PI*.79))-(shape.crease+2.4)*Math.pow(Math.sin(v*Math.PI),2)+3.3*Math.max(...[-A,A].map(a=>Math.exp(-Math.pow((z-a)/46,2))))*Math.sin(v*Math.PI)
      -(shape.panelDepth||0)*Math.exp(-Math.pow((v-(shape.sectionedBody?.29+.13*Math.exp(-Math.pow((z+A*.7)/60,2)):.34))/.20,2))*Math.exp(-Math.pow(z/(A*.83),6))
      +(shape.shoulder||0)*Math.exp(-Math.pow((v-(shape.sectionedBody?.76-.12*z/L:.80))/.105,2))*Math.exp(-Math.pow(z/(L*.46),6));
    const hoodCrown=(z,u)=>{const a=Math.min(1,Math.abs(u)),t=Math.max(0,Math.min(1,(z/L-.39)/.11)),section=sample(shape.hoodSection||[[0,2.5],[.78,4],[1,-1.5]],a);return section*(1-t)+(1.3*(1-u*u)-1.5*Math.pow(u,4))*t;};
    const topY=(z,u)=>(shape.bonnet&&z/L>=shape.bonnet[0][0]?H*sample(shape.bonnet,z/L):belt(z))+(shape.sectionedBody?(z<0?1.5*(1-u*u)-1.5*Math.pow(u,4):hoodCrown(z,u)):3.5*(1-u*u)-5*Math.pow(Math.abs(u),5))+(s.id==='model-3'?Math.max(0,(z/L-.28)/.22)*(-8*(1-u*u)+12*Math.pow(Math.abs(u),4)):0);
    // Continuous curved body skin, separately formed wheel shoulders, recessed sill and hood crown.
    const archBase=z=>Math.max(19,...[-A,A].map(a=>Math.abs(z-a)<R+4?R+Math.sqrt((R+4)**2-(z-a)**2):19));
    const fenderVents=shape.sectionedBody?[{z:A+R+9,w:s.id==='fox-b'?5.5:4.5,lo:.23,hi:.57},{z:-A-R-9,w:s.id==='fox-b'?4.5:4,lo:.23,hi:.52}]:[];
    const zNodes=[...new Set([...Array.from({length:177},(_,i)=>-L/2+i/176*L),...fenderVents.flatMap(v=>[v.z-v.w/2,v.z+v.w/2])])].sort((a,b)=>a-b),vNodes=[...new Set([...Array.from({length:shape.sectionedBody?25:19},(_,i)=>i/(shape.sectionedBody?24:18)),...fenderVents.flatMap(v=>[v.lo,v.hi])])].sort((a,b)=>a-b);
    const nodeAt=(nodes,t)=>{const n=t*(nodes.length-1),i=Math.min(nodes.length-2,Math.floor(n));return nodes[i]+(nodes[i+1]-nodes[i])*(n-i);};
    const sideSurface=(z,v,side,depth=0)=>{const bottom=archBase(z),y=bottom+(edge(z)-bottom)*v,sv=(y-19)/(edge(z)-19),x=side*(sideX(z,sv)-depth);return[x,y,noseZ(x,z,y)];};
    for(const side of [-1,1]){
      patch(zNodes.length-1,vNodes.length-1,(t,u)=>sideSurface(nodeAt(zNodes,t),nodeAt(vNodes,u),side),paint,'continuous-wheel-opening-'+s.id,(t,u)=>{const z=nodeAt(zNodes,t),v=nodeAt(vNodes,u);return fenderVents.some(p=>Math.abs(z-p.z)<p.w/2&&v>p.lo&&v<p.hi);});
      for(const vent of fenderVents){
        const z0=vent.z-vent.w/2,z1=vent.z+vent.w/2;
        patch(12,8,(t,u)=>sideSurface(z0+(z1-z0)*t,vent.lo+(vent.hi-vent.lo)*u,side,4.5),trim,'recessed-fender-vent');
        const corners=[[z0,vent.lo],[z1,vent.lo],[z1,vent.hi],[z0,vent.hi]];
        for(let i=0;i<4;i++){const a=corners[i],b=corners[(i+1)%4];patch(12,4,(t,u)=>sideSurface(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,side,4.5*u),trim,'fender-vent-return');}
      }
    }
    const c=shape.cabin.map(p=>[...p]),rear=c[0][0]*L,roofRear=c[1][0]*L,roofFront=c[3][0]*L,front=c[4][0]*L;c[0][1]=(belt(rear)+5)/H;c[4][1]=(belt(front)+5)/H;
    const duct=shape.duct;
    const ductBounds=a=>{const q=Math.min(1,Math.abs(a)/(duct?.half||1)),mid=(duct.rear+duct.front)/2,span=(duct.front-duct.rear)/2*Math.sqrt(Math.max(0,1-q*q));return [L*(mid-span),L*(mid+span)];};
    for(const [start,end]of [[-L/2,rear],[front,L/2]]){
      if(!duct||start!==front){patch(shape.sectionedBody?48:32,shape.sectionedBody?48:32,(t,u)=>{const z=start+(end-start)*t,a=u*2-1,x=sideX(z,1)*a;return[x,topY(z,a),noseZ(x,z,topY(z,a))];},paint,'formed-hood-deck-'+s.id);continue;}
      // Exact shared boundaries create a curved aperture, with no overlaid black decal.
      for(const band of [0,1,2,3])patch(40,64,(t,u)=>{
        const a=band<2?(u*2-1)*duct.half:band===2?-1+u*(1-duct.half):duct.half+u*(1-duct.half),[back,lip]=ductBounds(a),z0=band===0?start:band===1?lip:start,z1=band===0?back:end,z=z0+(z1-z0)*t,x=sideX(z,1)*a;
        return[x,topY(z,a),noseZ(x,z,topY(z,a))];
      },paint,'formed-hood-deck-'+s.id);
    }
    for(const sign of [-1,1]){
      if(sign<0||!shape.sectionedBody){patch(20,42,(t,u)=>{const z=sign*L/2,a=u*2-1,y=19+(topY(z,a)-19)*t,x=a*sideX(z,(y-19)/(edge(z)-19));return[x,y,noseZ(x,z,y)];},paint,sign>0?'formed-front-bumper':'formed-rear-bumper');continue;}
      // Triangulate a genuine lower intake aperture in the painted bumper skin.
      const z=L/2,outline=[];
      for(let i=0;i<=48;i++){const a=-1+2*i/48;outline.push(new T.Vector2(a*sideX(z,0),19));}
      for(let i=1;i<=32;i++){const v=i/32,y=19+(topY(z,1)-19)*v;outline.push(new T.Vector2(sideX(z,v),y));}
      for(let i=1;i<=48;i++){const a=1-2*i/48;outline.push(new T.Vector2(a*sideX(z,1),topY(z,a)));}
      for(let i=31;i>0;i--){const v=i/32,y=19+(topY(z,-1)-19)*v;outline.push(new T.Vector2(-sideX(z,v),y));}
      const hole=profile.grille.map(([x,y])=>new T.Vector2(x*W*.45,y*H)),mouth=profile.ductInlet.map(([x,y])=>new T.Vector2(x*W*.45,y*H)),all=[...outline,...hole,...mouth],tri=T.ShapeUtils.triangulateShape(outline,[hole,mouth]),pos=[];
      // Bound edge lengths in centimetres rather than subdividing every
      // ear-clipped triangle equally: long narrow triangles caused creases.
      function refine(a,b,c,depth=0){
        const ab=a.distanceToSquared(b),bc=b.distanceToSquared(c),ca=c.distanceToSquared(a);
        if(Math.max(ab,bc,ca)<=6.25||depth>=16){for(const q of [a,b,c])pos.push(q.x,q.y,noseZ(q.x,z,q.y));return;}
        if(ab>=bc&&ab>=ca){const m=a.clone().add(b).multiplyScalar(.5);refine(a,m,c,depth+1);refine(m,b,c,depth+1);}
        else if(bc>=ca){const m=b.clone().add(c).multiplyScalar(.5);refine(a,b,m,depth+1);refine(a,m,c,depth+1);}
        else{const m=c.clone().add(a).multiplyScalar(.5);refine(a,b,m,depth+1);refine(m,b,c,depth+1);}
      }
      for(const ids of tri)refine(...ids.map(i=>all[i]));
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.computeVertexNormals();
      // Analytic surface normals avoid visible fans where the triangulated
      // inlet border meets the concave badge ramp.
      const gp=g.attributes.position,gn=g.attributes.normal;
      for(let i=0;i<gp.count;i++){const x=gp.getX(i),y=gp.getY(i),e=.04,n=new T.Vector3(-(noseZ(x+e,z,y)-noseZ(x-e,z,y))/(2*e),-(noseZ(x,z,y+e)-noseZ(x,z,y-e))/(2*e),1).normalize();gn.setXYZ(i,n.x,n.y,n.z);}
      mesh(g,paint,[0,0,0],'perforated-front-bumper');
      for(let i=0;i<hole.length;i++){const a=hole[i],b=hole[(i+1)%hole.length];patch(4,20,(t,u)=>{const x=a.x+(b.x-a.x)*u,y=a.y+(b.y-a.y)*u;return[x,y,noseZ(x,z,y)-5*t];},trim,'recessed-intake-wall');}
    }

    // The cabin must remain open above the floor; a waist-height cap hid the interior.
    patch(36,18,(t,u)=>{const z=rear+(front-rear)*t,a=u*2-1;return[a*width(z)*.90,33,z];},trim,'cabin-floor');
    box([0,21,0],[W*.83,7,L*.91],trim,3);
    const cabin=(z)=>({z,w:W*sample(c,z/L,2),h:H*sample(c,z/L,1)});
    const privacyGlass=glass.clone();privacyGlass.color.set('#202c33');privacyGlass.opacity=.94;
    const glassCrown=z=>shape.sectionedBody?8-6*Math.max(Math.exp(-Math.pow((z-rear)/22,2)),Math.exp(-Math.pow((z-front)/22,2))):8;
    const rearBlend=z=>shape.sectionedBody?Math.pow(Math.max(0,Math.min(1,(roofRear-z)/(roofRear-rear))),3):0;
    function roofAt(z,a){const p=cabin(z),x=a*p.w,b=rearBlend(z),end=cabin(rear),target=topY(rear,a*end.w/sideX(rear,1))+.25,y=p.h-glassCrown(z)*a*a+b*(target-(end.h-glassCrown(rear)*a*a));return[x,y,z+b*(noseZ(x,z,y)-z)];}
    function glassSide(z,v,side){const p=cabin(z),x=side*(p.w+(width(z)*.916-p.w)*v+2.4*Math.sin(v*Math.PI)),b=rearBlend(z),base=(belt(z)+1)*(1-b)+(topY(z,x/sideX(z,1))+.25)*b,top=roofAt(z,side),y=top[1]+(base-top[1])*v;return[x,y,z+b*(noseZ(x,z,y)-z)];}
    for(const z of [rear,front])patch(3,32,(t,u)=>{const a=u*2-1,top=roofAt(z,a),x=sideX(z,1)*a,y=topY(z,a),end=[x,y,noseZ(x,z,y)];return top.map((v,i)=>v*(1-t)+end[i]*t);},shape.sectionedBody&&z===rear?trim:paint,'sealed-glazing-cowl');
    patch(18,32,(t,u)=>roofAt(rear+(roofRear-rear)*t,u*2-1),shape.sectionedBody?privacyGlass:glass,'rear-glass-'+s.id);
    if(shape.sectionedBody){
      const rearWindow=(t,a)=>{const q=roofAt(rear+(roofRear-rear)*t,a);q[1]+=.08;q[2]-=.12;return q;};
      // Ceramic perimeter and rubber edge share the exact glazing surface.
      for(const side of [-1,1])patch(40,4,(t,u)=>rearWindow(t,side*(.958+.042*u)),trim,'rear-window-ceramic-edge');
      for(const end of [0,1])patch(4,48,(t,u)=>rearWindow(end?1-t*.045:t*.045,u*2-1),trim,'rear-window-ceramic-band');
      const heater=mat('#56483a',.75,{transparent:true,opacity:.42,depthWrite:false});
      for(let row=0;row<7;row++)tube(Array.from({length:33},(_,i)=>rearWindow(.13+row*.105,(i/32*2-1)*.91)),.055,heater);
      tube(Array.from({length:49},(_,i)=>rearWindow(0,i/48*2-1)),.32,trim);
    }
    patch(32,32,(t,u)=>roofAt(roofRear+(roofFront-roofRear)*t,u*2-1),s.id==='model-3'?roofGlass:roofPaint,'roof-crown-'+s.id);
    patch(22,32,(t,u)=>roofAt(roofFront+(front-roofFront)*t,u*2-1),glass,'windscreen-'+s.id);
    for(const side of [-1,1]){
      if(shape.sectionedBody){
        const split=-L*.055;
        patch(40,16,(t,v)=>glassSide(rear+(split-rear)*t,v,side),privacyGlass,'rear-privacy-glazing');
        patch(40,16,(t,v)=>glassSide(split+(front-split)*t,v,side),glass,'front-door-glazing');
      }else patch(64,10,(t,v)=>glassSide(rear+(front-rear)*t,v,side),glass,'window-outline-'+s.id);
      patch(64,8,(t,v)=>{const z=rear+(front-rear)*t,q=glassSide(z,1,side),x=side*sideX(z,1),body=[x,edge(z),shape.sectionedBody?noseZ(x,z,edge(z)):z];return body.map((n,i)=>n*(1-v)+q[i]*v);},paint,'closed-window-sill-'+s.id);
      // Painted C pillar, black B pillar and the individual rear quarter window.
      if(shape.sail){
        const sail=shape.sail,outline=[[rear/L,0],[sail.top,0],[sail.bottom,1],[rear/L,1]].map(p=>new T.Vector2(...p)),hole=(sail.quarter||[]).map(p=>new T.Vector2(...p)),vertices=[...outline,...hole],tri=T.ShapeUtils.triangulateShape(outline,hole.length?[hole]:[]),pos=[];
        // Tessellate in the glazing surface coordinates so the pillar is flush
        // with the curved roof and waist, including the quarter-light aperture.
        for(const ids of tri){const [a,b,c]=ids.map(i=>vertices[i]),at=(i,j)=>{const z=(a.x+(b.x-a.x)*i/16+(c.x-a.x)*j/16)*L,v=a.y+(b.y-a.y)*i/16+(c.y-a.y)*j/16,q=glassSide(z,v,side);q[0]+=side*.45;return q;};for(let i=0;i<16;i++)for(let j=0;j<16-i;j++){pos.push(...at(i,j),...at(i+1,j),...at(i,j+1));if(i+j<15)pos.push(...at(i+1,j),...at(i+1,j+1),...at(i,j+1));}}
        const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.computeVertexNormals();smoothNormals(g);mesh(g,roofPaint,[0,0,0],'formed-sail-panel');
        if(hole.length)tube([...sail.quarter,sail.quarter[0]].map(([z,v])=>{const q=glassSide(z*L,v,side);q[0]+=side*.55;return q;}),.6,trim,root,true);
      }else patch(12,10,(t,v)=>{const q=glassSide(rear+(roofRear-rear)*t*(s.id==='model-3'?.30:s.id==='fox-d'?.32:.55),v,side);q[0]+=side*.35;return q;},roofPaint,'rear-pillar-'+s.id);
      const bZ=s.id==='kicks'?-L*.075:-L*.055;
      if(shape.productionPillars){
        for(const [centre,span]of (shape.sail?[[bZ,9]]:[[bZ,9],[rear+(roofRear-rear)*.76,12]]))patch(8,8,(t,v)=>{const q=glassSide(centre+(t-.5)*span,v,side);q[0]+=side*.65;return q;},trim,'production-window-pillar');
      }
      for(const [z,r,m]of (shape.sail?[[front-3,1.5,paint]]:[[bZ,2.4,trim],[rear+(roofRear-rear)*.79,1.5,roofPaint],[front-3,1.5,paint]]))tube([glassSide(z,0,side),glassSide(z,1,side)],r,m);
      tube(Array.from({length:40},(_,i)=>glassSide(rear+(front-rear)*i/39,0,side)),1.05,roofPaint);
      tube(Array.from({length:40},(_,i)=>glassSide(rear+(front-rear)*i/39,1,side)),.7,['altis','kuga'].includes(s.id)?metal:trim);
      // Body creases follow the real rising belt line, with long lower-door concavity.
      if(!shape.sectionedBody){
        tube(Array.from({length:30},(_,i)=>{const z=-L*.39+L*.77*i/29,v=.80;return[side*(sideX(z,v)+.25),19+(edge(z)-19)*v,z];}),.25,paint);
        tube(Array.from({length:22},(_,i)=>{const z=-L*.30+L*.59*i/21;return[side*(sideX(z,.18)+.3),19+(edge(z)-19)*.18,z];}),suv?2:1.2,suv?trim:paint);
      }else{
        patch(48,6,(t,u)=>{const z=-A+R+4+t*(2*A-2*R-8),v=u*.095;return[side*(sideX(z,v)+.45),19+(edge(z)-19)*v,z];},trim,'formed-rocker-cladding');
      }
      for(const seamZ of [-L*.255,bZ,L*.216]){const pts=Array.from({length:30},(_,i)=>{const v=.08+.9*i/29,z=seamZ+(shape.wheelStyle?(seamZ<-.2*L?12*Math.pow(1-v,2):seamZ>.2*L?-7*Math.pow(1-v,3):2*Math.sin(v*Math.PI)):0);return[side*(sideX(z,v)+.16),19+(edge(z)-19)*v,z];}).filter(p=>![-A,A].some(a=>Math.hypot(p[2]-a,p[1]-R)<R+4));if(pts.length>1)tube(pts,shape.wheelStyle?.16:.25,trim);}
      for(const z of [-L*.175,L*.12]){
        const x=side*(sideX(z,.90)+.7),y=19+(edge(z)-19)*.90;
        if(shape.bodyHandles){const recess=mesh(new T.SphereGeometry(1,24,12),trim,[x,y,z],'handle-recess');recess.scale.set(.7,2.4,8);const handle=mesh(new T.SphereGeometry(1,24,12),paint,[x+side*1.1,y+.3,z],'body-color-pull-handle');handle.scale.set(1.4,1.4,7.5);}
        else box([x,y,z],[1.8,2.7,15],s.id==='model-3'?trim:s.id==='kicks'||s.id==='altis'?metal:paint,1);
      }
      for(const axle of [-A,A]){
        if(shape.sectionedBody){
          // Close the inside of the wheel house behind the articulated wheel.
          // The old upper strip left the opposite sky visible around the tyre.
          const radius=R+8,angle=Math.asin((R-19)/radius),pos=[],x=side*(W/2-27);
          for(let i=0;i<72;i++){const a=-angle+(Math.PI+2*angle)*i/72,b=-angle+(Math.PI+2*angle)*(i+1)/72;pos.push(x,R,axle,x,R+radius*Math.sin(a),axle+radius*Math.cos(a),x,R+radius*Math.sin(b),axle+radius*Math.cos(b));}
          const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.computeVertexNormals();mesh(g,trim,[0,0,0],'closed-wheel-house');
        }
        const arch=Array.from({length:37},(_,i)=>{const a=i/36*Math.PI,y=R+Math.sin(a)*(R+4.2),z=axle+Math.cos(a)*(R+4.2);const sv=(y-19)/(edge(z)-19),x=side*(sideX(z,sv)+.25);return[x,y,noseZ(x,z,y)];});
        if(shape.sectionedBody)patch(64,8,(t,u)=>{const a=t*Math.PI,r=R+4.1+3.6*u,y=R+Math.sin(a)*r,z=axle+Math.cos(a)*r,sv=(y-19)/(edge(z)-19),x=side*(sideX(z,sv)+.4+Math.sin(u*Math.PI)*.65);return[x,y,noseZ(x,z,y)];},trim,'flat-wheel-arch-cladding');
        else tube(arch,suv?3:1.05,suv?trim:paint);
        // Wheel-well backing closes the cut edge without an opaque cylinder through the tyre.
        patch(24,5,(t,v)=>{const a=t*Math.PI,z=axle+Math.cos(a)*(R+4.3),y=R+Math.sin(a)*(R+4.3);const sv=(y-19)/(edge(z)-19),x=side*(sideX(z,sv)-v*14);return[x,y,noseZ(x,z,y)];},trim,'inner-arch');
      }
      const mz=front-12,mh=belt(mz)+9;rod([side*W*.435,mh,mz],[side*(W/2+7),mh+1,mz],1.8,trim);const mirror=mesh(new T.SphereGeometry(1,32,20),shape.blackMirrors?trim:paint,[side*(W/2+7),mh+3,mz],'mirror');mirror.scale.set(8,4.8,9);box([side*(W/2+7),mh+3,mz-6],[11,6,.6],darkMetal,1);box([side*(W/2+7),mh+2,mz+8],[10,1,1],led,.3);
      if(s.id==='fox-c'){
        const tailPoints=Array.from({length:20},(_,i)=>{const z=-L*.49+i/19*L*.085,v=.96,x=side*(sideX(z,v)+.8),y=19+(edge(z)-19)*v;return[x,y,noseZ(x,z,y)];});
        tube(tailPoints,2.1,trim);tube(tailPoints.map(p=>[p[0]+side*.7,p[1]+.3,p[2]]),.8,red);
        tube(Array.from({length:24},(_,i)=>{const z=-A+R+6+i/23*(2*A-2*R-12);return[side*(sideX(z,.12)+.6),24,z];}),.6,metal);
      }
    }
    if(s.body!=='sedan'){
      if(shape.sectionedBody){
        const foilPaint=roofPaint.clone();foilPaint.userData.noSelfShadow=true;
        patch(12,48,(t,u)=>{const a=u*2-1,z=roofRear+5-23*t,p=cabin(roofRear+5);return[a*W*.395,p.h-6*a*a+1.4+.6*Math.sin(t*Math.PI)-4*t,z+3*a*a];},foilPaint,'contoured-roof-spoiler');
        patch(12,48,(t,u)=>{const a=u*2-1,z=roofRear+5-23*t,p=cabin(roofRear+5);return[a*W*.395,p.h-6*a*a-.6+.6*Math.sin(t*Math.PI)-4*t,z+3*a*a];},trim,'spoiler-underside');
        for(const t of [0,1])patch(2,48,(v,u)=>{const a=u*2-1,z=roofRear+5-23*t,p=cabin(roofRear+5);return[a*W*.395,p.h-6*a*a+1.4+.6*Math.sin(t*Math.PI)-4*t-2*v,z+3*a*a];},foilPaint,'spoiler-edge');
        for(const side of [-1,1])patch(12,2,(t,v)=>{const a=side,z=roofRear+5-23*t,p=cabin(roofRear+5);return[a*W*.395,p.h-6+1.4+.6*Math.sin(t*Math.PI)-4*t-2*v,z+3];},foilPaint,'spoiler-end-cap');
        for(const side of [-1,1])patch(12,6,(t,v)=>{const z=roofRear-18+(s.id==='fox-c'?18:40)*t,q=glassSide(z,v*.42,side);q[0]+=side*.7;return q;},trim,'rear-aero-blade');
        tube(Array.from({length:30},(_,i)=>{const a=i/29*2-1;return[a*W*.22,cabin(roofRear+5).h-6*a*a-2.5,roofRear-17+3*a*a];}),.65,red);
      }else{const z=roofRear-4,h=cabin(z).h;box([0,h-.2,z],[W*.73,3.5,16],roofPaint,2);box([0,h-1,z-8],[W*.40,1.5,1.3],red,.4);}
    }
    if(shape.sectionedBody){
      const z=rear+(roofRear-rear)*.18,at=a=>{const q=roofAt(z,a);q[1]+=.6;q[2]-=.9;return q;};
      const pivot=at(0);box(pivot,[3.2,2.2,4],trim,.6);
      tube(Array.from({length:13},(_,i)=>at(.04+i/12*.42)),.65,trim);
      tube(Array.from({length:17},(_,i)=>{const q=roofAt(z+1,(i/16)*.57-.02);q[1]+=.8;q[2]-=1;return q;}),.38,rubber);
    }
    if(suv&&!s.id.startsWith('fox-'))for(const side of [-1,1])tube(Array.from({length:15},(_,i)=>{const z=roofRear+8+(roofFront-roofRear-18)*i/14;return[side*W*.30,cabin(z).h+1,z];}),1.4,s.id==='kicks'?trim:metal);
    // Two shallow hood pressings and realistic wipers lie on the bonnet, not above the lights.
    for(const side of [-1,1]){
      if(shape.sectionedBody){
        tube(Array.from({length:49},(_,i)=>{const t=i/48,z=front+3+(L*.483-front-3)*t,a=side*((s.id==='fox-b'?.80:.78)+.10*t),x=sideX(z,1)*a,y=topY(z,a);return[x,y+.06,noseZ(x,z,y)];}),.10,trim);
      }else tube(Array.from({length:16},(_,i)=>{const z=front+9+(L/2-front-25)*i/15,a=side*(.52+.18*i/15),x=sideX(z,1)*a;return[x,topY(z,a)+.1,noseZ(x,z,topY(z,a))];}),.22,paint);
      tube([[side*W*.05,belt(front)+3,front+2],[side*W*.29,belt(front)+3,front-3]],.65,trim);
    }
    if(shape.sectionedBody)tube(Array.from({length:65},(_,i)=>{const a=(i/64*2-1)*.90,z=L*(.483+.008*a*a),x=sideX(z,1)*a,y=topY(z,a);return[x,y+.06,noseZ(x,z,y)];}),.10,trim);
    const frontZ=(x,y=45)=>{if(s.id==='model-3'&&y>topY(L/2,x/sideX(L/2,1))){let a=L*.25,b=L/2;for(let i=0;i<18;i++){const z=(a+b)/2;if(topY(z,x/sideX(z,1))>y)a=z;else b=z;}return noseZ(x,(a+b)/2,y)+.65;}return noseZ(x,L/2,y)+.65;},rearZ=(x,y=45)=>noseZ(x,-L/2,y)-.65;
    function frontPolygon(poly,m,zfunc=frontZ,name='face-panel'){
      const pos=[],vertices=poly.map(p=>new T.Vector2(...p)),triangles=T.ShapeUtils.triangulateShape(vertices,[]);
      // Ear clipping respects concave lamp apertures; centroid fans filled C-shaped lamps.
      for(const ids of triangles){const [a,b,d]=ids.map(i=>poly[i]),point=(i,j)=>{const x=a[0]+(b[0]-a[0])*i/8+(d[0]-a[0])*j/8,y=a[1]+(b[1]-a[1])*i/8+(d[1]-a[1])*j/8;return[x,y,zfunc(x,y)];};for(let i=0;i<8;i++)for(let j=0;j<8-i;j++){pos.push(...point(i,j),...point(i+1,j),...point(i,j+1));if(i+j<7)pos.push(...point(i+1,j),...point(i+1,j+1),...point(i,j+1));}}
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.computeVertexNormals();const o=mesh(g,m,[0,0,0],name);o.material.side=T.DoubleSide;return o;
    }
    if(s.id==='fox-b'||s.id==='fox-c'){
      // Dark S-duct aperture on the bonnet, behind its painted leading lip.
      // Connect the forward-facing mouth to the bonnet outlet. No front cap or
      // shallow pocket closes the channel between the two openings.
      const mouth=profile.ductInlet,entryTop=mouth[0][1]*H,entryBottom=mouth[2][1]*H;
      const passage=(t,u,upper)=>{const a=(u*2-1)*duct.half,[back,lip]=ductBounds(a),outZ=upper?lip:back,outX=sideX(outZ,1)*a,outY=topY(outZ,a)-duct.depth,inX=(u*2-1)*(upper?mouth[1][0]:mouth[2][0])*W*.45,inY=upper?entryTop:entryBottom,inZ=noseZ(inX,L/2,inY),x=inX+(outX-inX)*t,y=inY+(outY-inY)*(upper?t:t*t),z=inZ+(noseZ(outX,outZ,topY(outZ,a))-inZ)*t;return[x,y,z];};
      const ductPaint=paint.clone();ductPaint.userData.noSelfShadow=true;ductPaint.color.multiplyScalar(.35);ductPaint.roughness=.58;ductPaint.metalness=.25;ductPaint.clearcoat=.15;ductPaint.envMapIntensity=.15;
      for(const upper of [false,true])patch(32,64,(t,u)=>passage(t,u,upper),upper?trim:ductPaint,'s-duct-connected-'+(upper?'roof':'floor'));
      for(const side of [0,1])patch(32,8,(t,v)=>{const a=passage(t,side,false),b=passage(t,side,true);return a.map((n,i)=>n+(b[i]-n)*v);},trim,'s-duct-connected-side');
      const amber=mat('#c87627',.4);for(const side of [-1,1]){const z=A+R*.73,v=.63,x=side*(sideX(z,v)+.9),y=19+(edge(z)-19)*v;box([x,y,z],[1.2,12,2.4],amber,.4);}
    }
    if(shape.wheelStyle){
      // Charge flap, repeater/camera and fine glass seals lie on the body surfaces.
      const flapZ=s.id==='model-3'?-L*.42:L*.24;
      const side=-1,flap=Array.from({length:33},(_,i)=>{const a=i/32*Math.PI*2,z=flapZ+8*Math.sign(Math.cos(a))*Math.pow(Math.abs(Math.cos(a)),.4),v=.77+.075*Math.sign(Math.sin(a))*Math.pow(Math.abs(Math.sin(a)),.4);return[side*(sideX(z,v)+.17),19+(edge(z)-19)*v,z];});tube(flap,.13,trim);
      for(const sign of [-1,1]){
        const z=front-8,v=.89,y=19+(edge(z)-19)*v,x=sign*(sideX(z,v)+.5);
        const camera=mesh(new T.SphereGeometry(1,14,10),trim,[x,y,z],'fender-camera');camera.scale.set(.65,1.6,3.9);
        if(s.id==='model-3'){
          const z0=front-5;patch(12,4,(t,v)=>{const z=z0-13*t,q=glassSide(z,v*.13+.86,sign);q[0]+=sign*.3;return q;},trim,'mirror-sail-panel');
        }
        if(s.id==='fox-b')for(let i=0;i<9;i++)for(let j=0;j<5;j++){
          const v=.18+i*.068,z=L*(shape.sail.top+(shape.sail.bottom-shape.sail.top)*v-.016-j*.009),q=glassSide(z,v,sign),size=.55+i*.10;
          box([q[0]+sign*.9,q[1],q[2]],[.3,size,size],darkMetal,.1);
        }
      }
    }
    const face=B1_VEHICLE_FACES.build({s,root,mesh,box,tube,rod,poly:frontPolygon,frontZ,rearZ,paint,trim,metal,darkMetal,red,led,lamps});
    // Sculpted bumper volumes, lower intakes and tailgate shut-lines anchor the fascia in the body.
    for(const sign of [-1,1]){
      const at=sign*L/2;
      tube(Array.from({length:35},(_,i)=>{const x=(i/34*2-1)*W*.438;return[x,23+(suv?2:0),noseZ(x,at,23)-sign*.2];}),suv?4:2.3,trim);
      if(sign<0){const contour=(s.id==='fox-c'?[[-.32,.65],[-.31,.43],[-.27,.38],[.27,.38],[.31,.43],[.32,.65]]:s.id==='fox-b'?[[-.37,.63],[-.32,.46],[.32,.46],[.37,.63]]:[[-.42,.58],[-.37,.37],[.37,.37],[.42,.58]]).map(([x,y])=>[x*W,y*H,rearZ(x*W,y*H)]);tube(contour,.32,trim,root,true);if(s.id!=='fox-c')box([0,H*.36,rearZ(0,H*.36)+1],[38,14,1],trim,2);if(!shape.sectionedBody)box([0,H*.54,rearZ(0,H*.54)-.6],[s.nose==='ford'?11:8,4,.8],metal,1);for(const side of [-1,1])tube(Array.from({length:9},(_,i)=>{const x=side*(W*.27+i*2);return[x,29,rearZ(x,29)-.6];}),.9,red);}
    }
    if(suv&&!s.id.startsWith('fox-'))for(const sign of [-1,1])tube(Array.from({length:25},(_,i)=>{const x=(i/24-.5)*W*.60;return[x,22,noseZ(x,sign*L/2,22)+sign];}),1.4,metal);
    // Seats, dashboard, console, instrument cluster, steering and door cards are actual geometry.
    box([0,31,0],[W*.86,5,L*.60],trim,3);for(const side of [-1,1]){const x=side*W*.23;box([x,53,-L*.015],[46,13,52],leather,6);const seat=box([x,88,-L*.075],[45,64,12],leather,6);seat.rotation.x=-.11;box([x,Math.min(119,cabin(-L*.09).h-14),-L*.09],[25,18,13],leather,4);for(const dx of [-17,17])box([x+dx,57,-L*.015],[7,12,44],leather,3);if(!shape.sectionedBody)for(const z of [-L*.12,L*.12])tube([[side*W*.437,50,z-25],[side*W*.435,80,z],[side*W*.434,90,z+25]],2,leather);parts.cabin+=6;}
    box([0,52,-L*.225],[W*.78,14,46],leather,5);box([0,76,-L*.25],[W*.78,48,12],leather,6);for(const x of [-W*.22,0,W*.22])box([x,Math.min(110,cabin(-L*.25).h-13),-L*.25],[22,15,10],leather,4);
    const dashY=belt(L*.24)-12,fox=s.id==='fox-b'||s.id==='fox-c',cavira=s.id==='fox-c';
    if(fox){
      const thread=mat('#8d8b85',.9);
      for(const side of [-1,1]){
        const x=side*W*.23;
        for(const dx of [-17,17])tube([[x+dx,64,-L*.075+5],[x+dx,86,-L*.075+7],[x+dx*.75,108,-L*.075+9]],.16,thread);
        if(s.id==='fox-b'){
          const beltMat=mat('#9e2535',.88);
          const strap=box([side*W*.365,84,-L*.08],[3.5,63,.8],beltMat,.1);strap.rotation.z=side*-.10;
          box([side*W*.13,59,-L*.02],[2,6,3],trim,.5);box([side*W*.13,62,-L*.02],[2,1,2],beltMat,.2);
        }
      }
      if(s.id==='fox-b'){
        const ambient=mat('#ae3346',.5,{emissive:0xc42e3e,emissiveIntensity:.55});
        tube([[-W*.40,dashY+10,L*.20],[0,dashY+11,L*.235],[W*.40,dashY+10,L*.20]],.35,ambient);
        for(const side of [-1,1])tube([[side*W*.418,91,-L*.15],[side*W*.418,91,L*.13]],.3,ambient);
      }
    }
    // Firewall and inner door cards hide the wheel wells from the passenger compartment.
    box([0,60,L*.235],[W*.87,62,5],trim,1);
    box([0,dashY,L*.22],[W*.84,18,28],trim,4);
    for(const side of [-1,1]){
      box([side*W*.37,66,-L*.015],[3,58,L*.36],leather,1);
      box([side*W*.35,70,L*.025],[8,7,46],trim,2);
      tube([[side*W*.36,84,-L*.13],[side*W*.36,84,L*.12]],.65,metal);
    }
    box([0,dashY-10,L*.186],[W*.80,8,5],s.id==='fox-b'?trim:leather,2);
    box([0,dashY+1,L*.185],[W*.76,3.5,2],trim,.5);
    for(let x=-W*.35;x<W*.36;x+=3.2)box([x,dashY+1,L*.181],[.35,2.5,.5],darkMetal,.1);
    box([0,60,L*.025],[25,22,65],trim,3);
    box([0,73,-L*.04],[24,8,26],leather,3);
    for(const z of [L*.035,L*.08]){
      const cup=mesh(new T.CylinderGeometry(4.7,4.7,1,24),trim,[0,72,z]);
      const rim=mesh(new T.TorusGeometry(4.9,.55,6,32),metal,[0,72.6,z]);rim.rotation.x=Math.PI/2;
    }
    const screenMat=mat('#73929e',.4,{emissive:0x274b5b,emissiveIntensity:.3});
    const sw=cavira?22:fox?34:25,sh=cavira?38:fox?20:17,sy=cavira?dashY-1:dashY+9;
    box([0,sy,L*.169],[sw+2,sh+2,2],trim,1);
    box([0,sy,L*.166],[sw,sh,.5],screenMat,.4);
    // Original geometric interface, no copied manufacturer screen texture.
    for(let row=0;row<3;row++)for(let col=0;col<3;col++)box([(col-1)*sw*.27,sy+(row-1)*sh*.24,L*.165],[sw*.19,sh*.14,.2],metal,.3);
    const sx=W*.235,wy=dashY+7,wz=L*.13;
    box([sx,dashY+10,L*.19],[25,12,2],trim,1);
    box([sx,dashY+10,L*.187],[22,9,.5],screenMat,.4);
    const steering=mesh(new T.TorusGeometry(15.5,1.6,12,56),trim,[sx,wy,wz],'steering-wheel');steering.rotation.x=-.25;
    box([sx,wy,wz-1],[15,8,5],trim,2);
    for(const side of [-1,1])rod([sx+side*5,wy,wz],[sx+side*13,wy-2,wz],2,metal);
    rod([sx,wy-3,wz],[sx,wy-13,wz],1.8,trim);
    for(let i=0;i<7;i++)box([(i-3)*3,sy-sh/2-2,L*.166],[2.6,1.4,.6],metal,.2);

    if(s.id==='fox-d'){for(const x of [-W*.23,W*.23]){box([x,50,-L*.34],[40,12,36],leather,5);box([x,78,-L*.38],[40,44,10],leather,5);box([x,107,-L*.38],[23,15,10],leather,4);}}
    // Closed revolved tyre sections and open alloy barrels expose the brake hardware.
    // These three production references have genuinely different wheel topology.
    function productionWheel(side,z){
      const wheel=new T.Group();wheel.name='sculpt-wheel-'+wheels.length;wheel.position.set(side*(W/2-10.5),R,z);root.add(wheel);
      const style=shape.wheelStyle,rr=R*(style==='highland-photon'?.715:.735);
      const section=[[rr,-10],[R-4,-11.4],[R-1.4,-9.3],[R,-6.7],[R,6.7],[R-1.4,9.3],[R-4,11.4],[rr,10],[rr,-10]].map(p=>new T.Vector2(...p));
      const tyre=mesh(new T.LatheGeometry(section,96),rubber,[0,0,0],'production-tyre',wheel);tyre.rotation.z=Math.PI/2;
      for(const x of [-4.8,-1.6,1.6,4.8]){const groove=mesh(new T.TorusGeometry(R+.025,.19,4,96),trim,[x,0,0],'recessed-tread-channel',wheel);groove.rotation.y=Math.PI/2;}
      for(let i=0;i<72;i++)for(const flank of [-1,1]){const a=i*Math.PI/36;const pts=[0,1,2].map(k=>{const x=flank*(6.2+k*2.2),radius=R-.2-k*.7,theta=a+k*.013;return[x,Math.sin(theta)*radius,Math.cos(theta)*radius];});tube(pts,.16,trim,wheel);}
      const barrel=mesh(new T.CylinderGeometry(rr,rr,20,72,1,true),darkMetal,[0,0,0],'open-alloy-barrel',wheel);barrel.rotation.z=Math.PI/2;
      const rotorMaterial=mat('#686c70',.48,{metalness:.75});
      const rotor=mesh(new T.CylinderGeometry(rr*.79,rr*.79,.8,64),rotorMaterial,[side*5.5,0,0],'machined-brake-disc',wheel);rotor.rotation.z=Math.PI/2;
      for(const radius of [rr*.54,rr*.72]){const track=mesh(new T.TorusGeometry(radius,.18,4,64),darkMetal,[side*6,0,0],'rotor-wear-track',wheel);track.rotation.y=Math.PI/2;}
      box([side*7.6,3,rr*.66],[5,14,8],darkMetal,2,wheel);
      function blade(points,material=darkMetal){
        const outline=points.map(([a,r])=>new T.Vector2(Math.sin(a)*r,Math.cos(a)*r));
        const tris=T.ShapeUtils.triangulateShape(outline,[]),pos=[],indices=[];
        // Machined faces sit above the black casting, never coplanar with it.
        // The spokes dish into the hub instead of forming a flat wheel disc.
        for(const back of [true,false])for(const p of outline){const crown=9+1.65*Math.pow(p.length()/rr,.7),depth=material===metal?crown+(back?.10:.32):crown-(back?2.55:0);pos.push(side*depth,p.x,p.y);}
        const n=outline.length;for(const [a,b,c]of tris)indices.push(a,c,b,a+n,b+n,c+n);
        for(let i=0;i<n;i++){const j=(i+1)%n;indices.push(i,j,j+n,i,j+n,i+n);}
        const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setIndex(indices);geo.computeVertexNormals();material.side=T.DoubleSide;mesh(geo,material,[0,0,0],'production-wheel-blade',wheel);
      }
      const count=style==='bria-geometric-five'?5:style==='cavira-machined-ten'?10:7;
      for(let i=0;i<count;i++){
        const a=i*Math.PI*2/count;
        if(style==='bria-geometric-five'){
          blade([[a-.17,5],[a+.14,5],[a+.39,rr*.94],[a-.13,rr*.94]]);
          blade([[a-.14,rr*.31],[a-.075,rr*.31],[a-.08,rr*.92],[a-.15,rr*.92]],metal);
          blade([[a-.10,rr*.31],[a-.04,rr*.31],[a+.39,rr*.94],[a+.33,rr*.94]],metal);
          blade([[a-.13,rr*.94],[a+.39,rr*.94],[a+.35,rr*.88],[a-.11,rr*.88]],metal);
          for(let line=0;line<4;line++){const r=rr*(.50+line*.08);rod([side*10.9,Math.sin(a+.03)*r,Math.cos(a+.03)*r],[side*10.9,Math.sin(a+.26)*r,Math.cos(a+.26)*r],.22,trim,wheel);}
        }else if(style==='cavira-machined-ten'){
          blade([[a-.11,5],[a+.11,5],[a+.20,rr*.95],[a-.055,rr*.95]]);
          blade([[a-.045,6],[a+.01,6],[a+.14,rr*.94],[a+.07,rr*.94]],metal);
          blade([[a+.09,rr*.48],[a+.12,rr*.48],[a+.30,rr*.94],[a+.26,rr*.94]],metal);
        }else{
          blade([[a-.17,4],[a+.17,4],[a+.48,rr*.93],[a+.09,rr*.97],[a-.10,rr*.78]],trim);
          blade([[a+.12,rr*.30],[a+.16,rr*.31],[a+.46,rr*.92],[a+.41,rr*.93]],darkMetal);
        }
      }
      const lip=mesh(new T.TorusGeometry(rr,.60,8,80),style==='highland-photon'?darkMetal:metal,[side*10.4,0,0],'alloy-machined-lip',wheel);lip.rotation.y=Math.PI/2;
      const cap=mesh(new T.CylinderGeometry(4.5,4.5,1,32),trim,[side*11.3,0,0],'recessed-centre-cap',wheel);cap.rotation.z=Math.PI/2;
      for(let i=0;i<5;i++){const a=i*Math.PI*.4,lug=mesh(new T.CylinderGeometry(.85,.85,1,8),metal,[side*11.2,Math.sin(a)*6,Math.cos(a)*6],'wheel-lug',wheel);lug.rotation.z=Math.PI/2;}
      wheel.userData.design=style;batch(wheel);wheels.push(wheel);
    }
    // Four articulated wheels with rounded tyre shoulders, grooves, split spokes, rotors and calipers.
    for(const side of [-1,1])for(const z of [-A,A]){const wheel=new T.Group();wheel.name='sculpt-wheel-'+wheels.length;wheel.position.set(side*(W/2-10.5),R,z);root.add(wheel);
      if(shape.wheelStyle){wheel.removeFromParent();productionWheel(side,z);continue;}
      const tire=mesh(new T.TorusGeometry(R-6.5,6.5,16,72),rubber,[0,0,0],'rounded-tyre',wheel);tire.rotation.y=Math.PI/2;tire.scale.z=1.8;for(const offset of [-5,0,5]){const groove=mesh(new T.TorusGeometry(R-.25,.40,5,72),trim,[offset,0,0],'tyre-groove',wheel);groove.rotation.y=Math.PI/2;}
      for(let i=0;i<64;i++)for(const offset of [-6,6]){const a=i*Math.PI/32,tread=box([offset,Math.sin(a)*(R-.15),Math.cos(a)*(R-.15)],[3.4,.55,1.6],trim,.12,wheel);tread.rotation.x=-a+.20*Math.sign(offset);}
      const rim=mesh(new T.CylinderGeometry(R*.70,R*.70,20.6,64),darkMetal,[0,0,0],'alloy-barrel',wheel);rim.rotation.z=Math.PI/2;const disc=mesh(new T.CylinderGeometry(R*.57,R*.57,1.0,48),metal,[side*8.0,0,0],'brake-rotor',wheel);disc.rotation.z=Math.PI/2;
      const designs={focus:[5,2,.12,2.7],altis:[10,1,.08,1.5],sentra:[5,2,.20,2.0],kicks:[10,1,.16,1.5],kuga:[10,1,.31,2.1],'corolla-cross':[5,2,.09,3.1]},[count,split,sweep,spokeWidth]=designs[s.id]||(s.id==='model-3'?[5,2,.28,3]:s.id==='fox-d'?[6,2,.32,3]:[10,1,.12,2]);
      for(let i=0;i<count;i++)for(let fork=0;fork<split;fork++){
        const a=i*Math.PI*2/count+(fork?-.07:.07),inner=a+(fork?-.04:.04),outer=a+sweep+(fork?-.05:.05),wide=s.id==='model-3'||s.id==='fox-d'||s.id==='fox-b',w=wide?.095:spokeWidth/R;
        const outline=[[inner-w*.8,5],[inner+w*.8,5],[outer+w,R*.68],[outer-w,R*.68]],positions=[];
        for(const depth of [8.5,11.1])for(const [angle,radius]of outline)positions.push(side*depth,Math.sin(angle)*radius,Math.cos(angle)*radius);
        const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setIndex([0,2,1,0,3,2,4,5,6,4,6,7,0,1,5,0,5,4,1,2,6,1,6,5,2,3,7,2,7,6,3,0,4,3,4,7]);geometry.computeVertexNormals();mesh(geometry,wide?darkMetal:metal,[0,0,0],'forged-spoke',wheel);
        if(wide)rod([side*11.25,Math.sin(inner-w*.8)*6,Math.cos(inner-w*.8)*6],[side*11.25,Math.sin(outer-w)*R*.67,Math.cos(outer-w)*R*.67],.65,metal,wheel);
      }
      for(let i=0;i<20;i++){const a=i*Math.PI/10,drill=mesh(new T.CylinderGeometry(.75,.75,.6,6),trim,[side*8.6,Math.sin(a)*R*.50,Math.cos(a)*R*.50],'vented-brake-disc',wheel);drill.rotation.z=Math.PI/2;}
      const lip=mesh(new T.TorusGeometry(R*.705,.8,5,48),metal,[side*10.8,0,0],'diamond-cut-rim-lip',wheel);lip.rotation.y=Math.PI/2;
      box([side*9,6,R*.43],[4,13,7],darkMetal,2,wheel);for(let i=0;i<5;i++){const a=i*Math.PI*.4;const lug=mesh(new T.CylinderGeometry(.9,.9,1.1,8),metal,[side*12,Math.sin(a)*4,Math.cos(a)*4],'wheel-lug',wheel);lug.rotation.z=Math.PI/2;}const cap=mesh(new T.CylinderGeometry(3,3,24.8,24),trim,[0,0,0],'hub-cap',wheel);cap.rotation.z=Math.PI/2;batch(wheel);wheels.push(wheel);parts.wheel+=cfg.spokes;
    }
    const rider=new T.Group();rider.visible=false;root.add(rider);batch(root);let triangles=0;root.traverse(o=>{if(o.isMesh)triangles+=(o.geometry.index?.count||o.geometry.attributes.position.count)/3;});root.userData.features=['curved-independent-panels','open-wheel-arches','wheel-well-liners','curved-transparent-glazing','projector-headlamps','model-specific-grille','detailed-alloy-wheels','tyre-grooves','brake-rotors-calipers',s.id==='fox-d'?'seven-seat-cabin':'five-seat-cabin','steering-dashboard','door-seams-wipers','taiwan-plates'];root.userData.triangles=triangles;return{group:root,wheels,lamps,rider,type:'car',features:root.userData.features,spec:{...s,...face,color,detail:'coachwork-v5',triangles,interpretation:true}};
  }
  function create(s,color){const key=[s.id,s.length,s.width,s.height,s.axle,color].join(':');let template=cache.get(key);if(!template){template=build(s,color);cache.set(key,template);}const group=template.group.clone(true),wheels=Array.from({length:4},(_,i)=>group.getObjectByName('sculpt-wheel-'+i));return{...template,group,wheels,lamps:cloneLights(group),rider:group.children.find(o=>o.isGroup&&!o.children.length)};}
  window.B1_VEHICLE_SCULPT={create,looks,shapes,batch,cloneLights};
})();
