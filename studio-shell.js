/* Close construction seams without blocking the measured window/door openings. */
(() => {
  const shellMaterial=ceilingGroup.children[0]?.material||cream;
  const coverage=[...rooms,[769,510,490,55]].map(([x,y,w,d])=>[x-12,y-12,w+24,d+24]);
  const xs=[...new Set(coverage.flatMap(([x,y,w])=>[x,x+w]))].sort((a,b)=>a-b),ys=[...new Set(coverage.flatMap(([x,y,w,d])=>[y,y+d]))].sort((a,b)=>a-b);
  const inside=(x,y)=>coverage.some(([a,b,w,d])=>x>=a&&x<=a+w&&y>=b&&y<=b+d);
  const cells=new Set();for(let i=0;i<xs.length-1;i++)for(let j=0;j<ys.length-1;j++)if(inside((xs[i]+xs[i+1])/2,(ys[j]+ys[j+1])/2))cells.add(i+','+j);
  function slab(bottom,top){const positions=[],uv=[];const quad=(a,b,c,d)=>{for(const v of [a,b,c,a,c,d]){positions.push(...W(...v).toArray());uv.push(v[0]/120,v[1]/120);}};for(const key of cells){const [i,j]=key.split(',').map(Number),x=xs[i],xx=xs[i+1],y=ys[j],yy=ys[j+1];quad([x,y,bottom],[xx,y,bottom],[xx,yy,bottom],[x,yy,bottom]);quad([x,yy,top],[xx,yy,top],[xx,y,top],[x,y,top]);if(!cells.has((i-1)+','+j))quad([x,y,bottom],[x,yy,bottom],[x,yy,top],[x,y,top]);if(!cells.has((i+1)+','+j))quad([xx,yy,bottom],[xx,y,bottom],[xx,y,top],[xx,yy,top]);if(!cells.has(i+','+(j-1)))quad([xx,y,bottom],[x,y,bottom],[x,y,top],[xx,y,top]);if(!cells.has(i+','+(j+1)))quad([x,yy,bottom],[xx,yy,bottom],[xx,yy,top],[x,yy,top]);}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.computeVertexNormals();return g;}
  for(const m of [...ceilingGroup.children]){ceilingGroup.remove(m);m.geometry.dispose();}
  const ceiling=new T.Mesh(slab(ROOM_HEIGHT,ROOM_HEIGHT+8),shellMaterial);ceiling.name='continuous-sealed-ceiling';ceiling.castShadow=ceiling.receiveShadow=true;ceilingGroup.add(ceiling);
  const foundation=new T.Mesh(slab(-6,-.02),new T.MeshStandardMaterial({color:'#c8b79d',roughness:.85,side:T.DoubleSide}));foundation.name='continuous-floor-foundation';foundation.receiveShadow=true;floorGroup.add(foundation);
  // Permanent outer returns, with sill/head cuts from the same window schedule.
  // These CAD polylines are the two faces of a 10-cm wall, not separate wall centrelines.
  // Fill the band behind its inner face so cabinetry is not clipped by a false 1.5-cm protrusion.
  for(const m of wallGroup.children){const x=m.position.x+750,y=700-m.position.z,h=m.geometry.parameters?.height||0;if(h<200)continue;if((x>238&&x<614&&(Math.abs(y-729.697)<1||Math.abs(y-739.697)<1))||(y>654&&y<740&&(Math.abs(x-603.606)<1||Math.abs(x-613.606)<1)))m.visible=false;}
  for(const [x,y,w,d]of [[238.606,729.697,375,10],[603.606,654.697,10,85]]){const m=box(x,y,w,d,ROOM_HEIGHT,shellMaterial,0,wallGroup);m.userData.fullHeightY=m.position.y;}
  const boundary=[[[338,292],[1044,292]],[[1044,292],[1044,505]],[[1044,505],[1101,505]],[[1213,505],[1259,505]],[[1259,505],[1259,1002.2]],[[1259,1002.2],[949,1002.2]],[[949,1002.2],[949,1067.2]],[[949,1067.2],[391.1,1067.2]],[[391.1,1067.2],[391.1,990]],[[391.1,990],[231.1,990]],[[231.1,990],[231.1,550]]];
  for(const [a,b]of boundary){const start=wallGroup.children.length;addWallWithWindows(a,b);for(const m of wallGroup.children.slice(start)){const old=m.geometry,{width:w,height:h}=old.parameters;m.geometry=new T.BoxGeometry(w,h,8);old.dispose();m.material=shellMaterial;m.userData.fullHeightY=m.position.y;}}
  for(const [x,y,w,d]of [[626,548,90,16],[614,736,115,12],[729,758,90,12],[386,740,16,79],[239,546,145,14]]){const m=box(x,y,w,d,ROOM_HEIGHT-230,shellMaterial,230,wallGroup);m.userData.fullHeightY=m.position.y;}
  scene.traverse(o=>{if(!o.isMesh)return;for(const m of Array.isArray(o.material)?o.material:[o.material])if(!m.transparent&&m.side===T.FrontSide){m.side=T.DoubleSide;m.needsUpdate=true;}});
  B1_REVIEW.shell={height:ROOM_HEIGHT,continuousCeiling:true,continuousFoundation:true,closedReturns:boundary.length,doorHeaders:5};
})();
