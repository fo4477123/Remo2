/* Centimetre-scale open-face scooter helmet. The face aperture is geometry, not a painted ball. */
(() => {
  function create(){
    const group=new T.Group();group.name='fitted-open-face-helmet';
    const shell=mat('#52636d',.27,{metalness:.24}),rim=mat('#222b30',.83),visor=mat('#b6d2d9',.15,{transparent:true,opacity:.18,metalness:.12,depthWrite:false,side:T.DoubleSide}),strap=mat('#303638',.95);
    function patch(theta0,theta1,phi0,phi1,rx,ry,rz,material,name){const p=[],idx=[],rows=16,cols=36;for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){const a=theta0+(theta1-theta0)*i/rows,b=phi0+(phi1-phi0)*j/cols;p.push(Math.sin(b)*Math.sin(a)*rx,Math.cos(a)*ry,Math.cos(b)*Math.sin(a)*rz);}for(let i=0;i<rows;i++)for(let j=0;j<cols;j++){const a=i*(cols+1)+j;idx.push(a,a+cols+1,a+1,a+1,a+cols+1,a+cols+2);}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(idx);g.computeVertexNormals();const o=new T.Mesh(g,material);o.name=name;o.castShadow=material!==visor;group.add(o);return o;}
    patch(0,1.12,0,Math.PI*2,13.2,15,14.4,shell,'helmet-crown');
    patch(1.1,2.05,-1.08,1.08,13.2,15,14.4,shell,'helmet-back');
    patch(1.1,2.05,1.08,2.15,13.2,15,14.4,shell,'helmet-left-cheek');
    patch(1.1,2.05,4.13,Math.PI*2-1.08,13.2,15,14.4,shell,'helmet-right-cheek');
    patch(.98,1.79,2.10,4.18,13.9,15.6,15.6,visor,'clear-curved-visor');
    for(const side of [-1,1]){const pivot=new T.Mesh(new T.CylinderGeometry(2,2,.9,12),rim);pivot.rotation.z=Math.PI/2;pivot.position.set(side*12.8,-1,-5);group.add(pivot);const pts=[[side*11,-6,-4],[side*8,-17,-3],[0,-19,-7]],curve=new T.CatmullRomCurve3(pts.map(p=>new T.Vector3(...p)));group.add(new T.Mesh(new T.TubeGeometry(curve,12,.65,5,false),strap));const vent=new T.Mesh(new T.BoxGeometry(2.2,.6,5),rim);vent.position.set(side*5,14,-3);vent.rotation.x=-.22;group.add(vent);}
    const buckle=new T.Mesh(new T.BoxGeometry(3.2,1.6,1.6),rim);buckle.position.set(0,-19,-7);group.add(buckle);group.visible=false;group.userData.faceOpening=true;return group;
  }
  window.B1_HELMET={create};
})();
