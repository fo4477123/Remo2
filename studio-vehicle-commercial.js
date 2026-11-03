/* Dedicated Model T / K construction. Original game meshes, centimetres, +Z front. */
(() => {
  const templates=new Map();
  function build(s,color){
    const group=new T.Group(),details=new T.Group(),wheels=[],lamps=[],L=s.length,W=s.width,H=s.height,bus=s.body==='bus',R=bus?48:28,A=s.axle/2;
    group.name='coachwork-'+s.id;details.name='commercial-interior';group.add(details);
    const paint=new T.MeshPhysicalMaterial({color,metalness:.5,roughness:.28,clearcoat:1,clearcoatRoughness:.16}),black=mat('#11191e',.48),rubber=mat('#171c20',.91),alloy=mat('#89969e',.24,{metalness:.85}),seat=mat(bus?'#354e68':'#b7b8af',.82),glass=new T.MeshPhysicalMaterial({color:'#42616c',roughness:.07,metalness:.1,transparent:true,opacity:.55,depthWrite:false,side:T.DoubleSide}),led=mat('#e3f5ff',.25,{emissive:0xb5dbef,emissiveIntensity:.45}),red=mat('#9e2429',.32,{emissive:0xdb2725,emissiveIntensity:.4}),amber=mat('#de7f28',.38,{emissive:0xab4512,emissiveIntensity:.2});
    led.userData.vehicleHeadlight=true;
    function mesh(g,m,p=[0,0,0],parent=group,name=''){const o=new T.Mesh(g,m);o.position.set(...p);o.castShadow=m!==glass;o.receiveShadow=true;o.name=name;parent.add(o);return o;}
    function box(p,size,m=paint,r=2,parent=group){const g=new T.BoxGeometry(...size,4,4,4),v=g.attributes.position,a=new T.Vector3(),b=new T.Vector3();r=Math.min(r,...size.map(n=>n*.45));for(let i=0;i<v.count;i++){a.fromBufferAttribute(v,i);b.set(...size.map((n,k)=>Math.max(-n/2+r,Math.min(n/2-r,a.getComponent(k)))));a.sub(b).normalize().multiplyScalar(r).add(b);v.setXYZ(i,a.x,a.y,a.z);}g.computeVertexNormals();return mesh(g,m,p,parent);}
    function rod(a,b,r,m=alloy,parent=details){const start=new T.Vector3(...a),end=new T.Vector3(...b),d=end.clone().sub(start),o=mesh(new T.CylinderGeometry(r,r,d.length(),10),m,start.add(end).multiplyScalar(.5).toArray(),parent);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());return o;}
    function panel(points,m,parent=group){const shape=new T.Shape();shape.moveTo(points[0][0],points[0][1]);for(const p of points.slice(1))shape.lineTo(p[0],p[1]);shape.closePath();const geo=new T.ShapeGeometry(shape),v=geo.attributes.position;for(let i=0;i<v.count;i++){const q=points.find(p=>p[0]===v.getX(i)&&p[1]===v.getY(i));v.setZ(i,q?.[2]||0);}geo.computeVertexNormals();m.side=T.DoubleSide;return mesh(geo,m,[0,0,0],parent);}
    function sidePanel(side,outline,m,parent=group){const shape=new T.Shape();shape.moveTo(outline[0][0],outline[0][1]);for(const p of outline.slice(1))shape.lineTo(...p);shape.closePath();const geo=new T.ShapeGeometry(shape),v=geo.attributes.position;for(let i=0;i<v.count;i++){const z=v.getX(i),y=v.getY(i);v.setXYZ(i,side*(W*.5+(m===paint?.12:m===glass?.24:0)),y,z);}geo.computeVertexNormals();m.side=T.DoubleSide;return mesh(geo,m,[0,0,0],parent);}
    function label(text,p,w,h,rotation=0,parent=details){const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=128;const c=canvas.getContext('2d');c.fillStyle='#d6e9eb';c.font='bold 68px sans-serif';c.textAlign='center';c.fillText(text,512,90,1000);const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;const o=mesh(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map:texture,transparent:true,depthWrite:false,roughness:.5}),p,parent);o.rotation.y=rotation;return o;}
    function seatAt(x,z,y){box([x,y,z],[bus?38:43,9,40],seat,4,details);box([x,y+28,z-18],[bus?37:42,49,9],seat,4,details);box([x,y+60,z-20],[22,13,9],seat,3,details);rod([x,y-5,z],[x,32,z],2.3,black);}
    // Wheel cut-outs are analytic arcs; no tyre buried inside a solid rectangular shell.
    function lowerSide(side,start,end,top){const outline=[[start,top],[end,top],[end,19]];for(const axle of [A,-A])if(axle+R+4<end&&axle-R-4>start){outline.push([axle+R+4,19],[axle+R+4,R]);for(let i=0;i<=32;i++){const t=i*Math.PI/32;outline.push([axle+Math.cos(t)*(R+4),R+Math.sin(t)*(R+4)]);}outline.push([axle-R-4,19]);}outline.push([start,19]);sidePanel(side,outline,paint);}
    box([0,24,0],[W*.89,10,L*.94],black,4);
    if(bus){
      for(const side of [-1,1]){
        lowerSide(side,-L/2+12,L/2-12,H*.40);
        box([side*(W/2-4),H*.65,0],[6,H*.50,L-35],glass,2);
        box([side*(W/2-3),H*.915,0],[8,H*.13,L-35],black,3);
        for(let z=-L*.42;z<L*.44;z+=105){box([side*W*.503,H*.64,z],[2.2,H*.48,3.4],black,1);box([side*W*.504,H*.405,z],[1.2,3.4,99],alloy,.7);box([side*W*.505,H*.39,z],[1.1,3,9],amber,.6);}
        for(const z of [-L*.28,L*.14]){box([side*W*.504,65,z],[1,64,94],black,.5);box([side*W*.508,65,z],[1,62,92],paint,.5);box([side*W*.51,87,z+28],[2,3,12],black,.7);}
        label('F O X T R O N',[side*W*.507,H*.92,0],205,22,side*Math.PI/2);
        for(let z=-L*.30;z<L*.33;z+=80){seatAt(side*W*.28,z,67);rod([side*W*.31,100,z-16],[side*W*.31,H*.84,z-16],1.6,alloy);}
        rod([side*W*.30,H*.84,-L*.35],[side*W*.30,H*.84,L*.34],1.7,alloy);
      }
      box([0,H-9,0],[W-4,18,L-26],paint,8);
      box([0,H+8,-L*.10],[W*.56,25,L*.43],paint,6,details);
      for(let i=0;i<22;i++)box([0,H+21,-L*.30+i*20],[W*.47,1.2,2],black,.3,details);
      box([0,H*.39,L/2-8],[W-10,H*.1,24],paint,10);
      box([0,H*.68,L/2-8],[W-18,H*.49,8],glass,4);
      box([0,H*.92,L/2-9],[W-16,H*.12,10],black,4);
      label('A18  青埔生活圈',[0,H*.92,L/2-2],W*.69,21);
      for(const sign of [-1,1]){box([0,59,sign*(L/2-9)],[W-4,108,20],paint,8);box([0,22,sign*(L/2-8)],[W-5,12,25],black,4);for(const side of [-1,1]){box([side*W*.35,52,sign*(L/2+1)],[43,12,2],black,2);lamps.push(box([side*W*.35,53,sign*(L/2+2.2)],[38,5,1],sign>0?led:red,1));}label('F O X T R O N',[0,88,sign*(L/2+2)],84,10,sign<0?Math.PI:0);}
      box([0,H*.68,-L/2+8],[W-18,H*.49,8],glass,4);
      // Right-side boarding doors, each with two framed leaves and a low entry step.
      for(const z of [L*.38,-L*.08]){box([W/2+1,H*.45,z],[4,H*.72,90],black,2);for(const dz of [-22,22]){box([W/2+3,H*.51,z+dz],[2,H*.55,40],glass,1);box([W/2+4,H*.18,z+dz],[3,44,40],paint,1);}box([W/2+6,19,z],[14,6,86],black,1);}
      seatAt(-W*.26,L*.38,70);
      box([0,H*.43,L*.41],[W*.82,18,35],black,4,details);
      for(const side of [-1,1]){rod([side*W*.26,H*.47,L/2+1],[side*W*.05,H*.55,L/2+2],1.1,black);rod([side*W*.46,H*.75,L*.44],[side*W*.57,H*.74,L*.44],2,black,group);box([side*W*.57,H*.70,L*.44],[10,32,17],black,4);}
    }else{
      // Compact forward-control cab and exposed modular load bed, not an SUV/pickup alias.
      for(const side of [-1,1]){
        lowerSide(side,-L/2+7,L/2-8,70);
        sidePanel(side,[[L*.08,70],[L*.08,H*.97],[L*.40,H*.97],[L*.48,H*.90],[L*.48,70]],black);
        sidePanel(side,[[L*.095,76],[L*.095,H*.67],[L*.43,H*.43],[L*.48,70]],paint);
        sidePanel(side,[[L*.105,H*.70],[L*.105,H*.91],[L*.385,H*.91],[L*.44,H*.86],[L*.44,H*.49]],glass);
        box([side*W*.50,101,L*.14],[3,3,12],black,1);
        box([side*W*.47,72,-L*.23],[6,40,L*.50],paint,2);
        for(const z of [-L*.44,-L*.22,L*.02]){box([side*W*.496,55,z],[3,7,9],alloy,1);box([side*W*.496,82,z],[3,4,8],black,.7);}
        box([side*W*.51,39,L*.05],[6,8,30],black,1);
        rod([side*W*.46,H*.67,L*.43],[side*W*.57,H*.65,L*.43],1.4,black,group);box([side*W*.57,H*.64,L*.43],[8,18,14],black,2);
        seatAt(side*W*.24,L*.24,69);
      }
      box([0,53,-L*.23],[W*.91,7,L*.50],paint,2);
      for(let x=-W*.40;x<W*.42;x+=12)box([x,57,-L*.23],[2,1.5,L*.47],alloy,.6,details);
      box([0,73,-L/2+7],[W*.96,40,6],paint,2);
      box([0,H*.54,L*.085],[W*.94,H*.85,6],paint,3);
      box([0,H*.76,L*.08],[W*.67,37,7],glass,2);
      box([0,H-4,L*.28],[W*.96,9,L*.39],paint,4);
      box([0,H*.33,L/2-7],[W,H*.44,14],black,5);for(const side of [-1,1])box([side*(W/2-3),H*.75,L/2-10],[7,H*.43,9],black,2);box([0,H*.97,L/2-15],[W,7,12],black,2);
      const wind=box([0,H*.76,L*.485],[W*.87,H*.34,3],glass,3);wind.rotation.x=-.08;
      box([0,H*.94,L*.447],[W*.70,9,2],glass,2);
      box([0,24,L/2-4],[W*.93,16,15],black,3);
      for(const side of [-1,1]){box([side*W*.33,43,L/2+1],[W*.26,12,2],alloy,2);for(let i=0;i<4;i++)lamps.push(box([side*(W*.22+i*7),44,L/2+2.5],[4,4,2],led,.8));box([side*W*.35,36,-L/2+2],[24,9,3],red,1.5);}
      rod([-W*.34,H*.55,L/2+1],[W*.31,H*.58,L/2+1],1.2,black,group);
      label('FOXCONN',[0,H*.63,L/2+1],W*.38,9);
      box([0,103,L*.39],[W*.84,12,22],black,3,details);
    }
    // Separate rolling assemblies, recessed steel/alloy hubs, lug nuts and tyre shoulders.
    for(const side of [-1,1])for(const z of [-A,A]){
      const wheel=new T.Group();wheel.name='commercial-wheel-'+wheels.length;wheel.position.set(side*(W/2-9),R,z);group.add(wheel);
      const tire=mesh(new T.TorusGeometry(R-6,6,12,56),rubber,[0,0,0],wheel);tire.rotation.y=Math.PI/2;tire.scale.z=1.8;
      const rim=mesh(new T.CylinderGeometry(R*.62,R*.62,22,48),alloy,[0,0,0],wheel);rim.rotation.z=Math.PI/2;
      const hub=mesh(new T.CylinderGeometry(bus?12:14,bus?12:14,23,32),black,[0,0,0],wheel);hub.rotation.z=Math.PI/2;
      for(let i=0;i<(bus?10:5);i++){const a=i*Math.PI*2/(bus?10:5),lug=mesh(new T.SphereGeometry(bus?2:1.1,8,6),alloy,[side*12,Math.sin(a)*R*.31,Math.cos(a)*R*.31],wheel);lug.scale.x=.5;if(bus){const vent=mesh(new T.CylinderGeometry(3.5,3.5,.5,12),black,[side*11.3,Math.sin(a)*R*.49,Math.cos(a)*R*.49],wheel);vent.rotation.z=Math.PI/2;}else{const blade=box([side*12,Math.sin(a)*R*.44,Math.cos(a)*R*.44],[1.8,8,14],alloy,1,wheel);blade.rotation.x=-a+.3;}}
      B1_VEHICLE_SCULPT.batch(wheel);wheels.push(wheel);
    }
    B1_VEHICLE_SCULPT.batch(details);B1_VEHICLE_SCULPT.batch(group);
    const rider=new T.Group();rider.name='commercial-rider';rider.visible=false;group.add(rider);
    return {group,wheels,rider,lamps,type:'car',spec:{...s,color,interpretation:true,generation:bus?'Model T / low-floor electric bus':'Model K / concept interpretation',detail:'commercial-v2'},features:['dedicated-commercial-body','open-wheel-arches',bus?'boarding-doors':'modular-load-bed','interior-seats','articulated-wheels','model-specific-lights'],details};
  }
  function create(s,color){const key=s.id+color;let t=templates.get(key);if(!t){t=build(s,color);templates.set(key,t);}const group=t.group.clone(true),details=group.getObjectByName('commercial-interior'),wheels=Array.from({length:4},(_,i)=>group.getObjectByName('commercial-wheel-'+i));let detailed=true;return {...t,group,wheels,lamps:B1_VEHICLE_SCULPT.cloneLights(group),rider:group.getObjectByName('commercial-rider'),details,setDetail(v){detailed=!!v;details.visible=detailed;},detail:()=>detailed,animateWheels(angle){for(const wheel of wheels)wheel.rotation.x+=angle;}};}
  window.B1_VEHICLE_COMMERCIAL={create};
})();
