/* Individually traced current Taiwan-market face layouts. Fractions of width/height. */
(() => {
  const profiles={
    focus:{generation:'New Focus 五門・台灣現售款',source:'https://static.fordlioho.com.tw/assets/upload/Brochure/Focus/2025.10/New_Ford_Focus_Brochure.pdf',grille:[[-.59,.57],[.59,.57],[.64,.48],[.43,.30],[-.43,.30],[-.64,.48]],head:[[.45,.62],[.94,.66],[.88,.56],[.64,.54]],drl:[[.47,.612],[.88,.642],[.86,.596],[.68,.575]],projectors:[[.69,.584],[.80,.59]],lensStyle:'matrix',pattern:'honeycomb',badge:[0,.48],rim:'split-five',tailStyle:'fork',tailgateSeam:[[-.425,.635],[-.438,.58],[-.425,.405],[-.39,.355],[-.30,.34],[.30,.34],[.39,.355],[.425,.405],[.438,.58],[.425,.635]],frontH:.67,shoulder:8,rearH:.64},
    altis:{generation:'2026/10 Corolla Altis HEV 尊爵',source:'https://hotaicdn.azureedge.net/toyotaweb/CAR_2026100111133267457327.pdf',grille:[[-.53,.43],[.53,.43],[.68,.22],[.59,.16],[-.59,.16],[-.68,.22]],head:[[.27,.61],[.95,.66],[.86,.55],[.47,.50]],drl:[[.29,.605],[.46,.535],[.83,.57],[.91,.62]],projectors:[[.74,.575]],lensStyle:'matrix',pattern:'slats',badge:[0,.59],rim:'ten-spoke',tailStyle:'wing',tailgateSeam:[[-.43,.565],[-.418,.49],[-.388,.405],[-.35,.375],[.35,.375],[.388,.405],[.418,.49],[.43,.565]],frontH:.66,shoulder:7,rearH:.64},
    sentra:{generation:'2026 Sentra MOMIJI・台灣現售款',source:'https://event.nissan.com.tw/momiji_event/',grille:[[-.71,.60],[.71,.60],[.76,.47],[.65,.17],[-.65,.17],[-.76,.47]],head:[[.58,.65],[.96,.69],[.86,.55],[.72,.52]],drl:[[.60,.642],[.88,.66],[.82,.56],[.72,.54]],pattern:'horizontal-shield',badge:[0,.50],rim:'split-five',tailStyle:'boomerang',frontH:.69,shoulder:.64,rearH:.63},
    kicks:{generation:'2026 Kicks MOMIJI・台灣現售款',source:'https://event.nissan.com.tw/momiji_event/',grille:[[-.58,.59],[.58,.59],[.55,.44],[.33,.30],[-.33,.30],[-.55,.44]],head:[[.48,.64],[.97,.67],[.84,.57],[.64,.54]],drl:[[.50,.632],[.89,.65],[.84,.61]],pattern:'v-motion',badge:[0,.49],rim:'double-five',tailStyle:'boomerang',frontH:.68,shoulder:.66,rearH:.64},
    kuga:{generation:'The All-New Kuga Vignale・台灣現售款',source:'https://static.fordlioho.com.tw/assets/upload/Brochure/Kuga/The%20All-New%20Ford%20Kuga_Brochure.pdf',grille:[[-.54,.58],[.54,.58],[.66,.50],[.60,.36],[.37,.33],[-.37,.33],[-.60,.36],[-.66,.50]],head:[[.57,.64],[.96,.63],[.91,.53],[.67,.52]],drl:[[.59,.628],[.90,.617],[.86,.55],[.70,.55]],projectors:[[.75,.582],[.83,.575]],lensStyle:'matrix',pattern:'vertical-mesh',badge:[0,.48],rim:'ten-spoke',tailStyle:'split-wing',tailgateSeam:[[-.435,.69],[-.447,.625],[-.445,.435],[-.408,.38],[-.34,.357],[.34,.357],[.408,.38],[.445,.435],[.447,.625],[.435,.69]],frontH:.66,shoulder:10,rearH:.64},
    'corolla-cross':{generation:'2026/10 Corolla Cross HEV・台灣現售款',source:'https://hotaicdn.azureedge.net/toyotaweb/CAR_202610011031537C05D23G.pdf',grille:[[-.64,.54],[.64,.54],[.66,.43],[.51,.39],[-.51,.39],[-.66,.43]],head:[[.30,.64],[.97,.66],[.86,.56],[.47,.56]],drl:[[.32,.629],[.90,.64],[.82,.59]],pattern:'body-color-perforated',badge:[0,.57],rim:'sculpted-five',tailStyle:'horizontal-smoke',frontH:.68,shoulder:.68,rearH:.64}
  };
  // These lower apertures are separate openings in the ST front fascias, not
  // one tall generic grille. Keep them on the same curved bumper surface.
  Object.assign(profiles.focus,{grille:[[-.64,.56],[.64,.56],[.72,.48],[.55,.30],[-.55,.30],[-.72,.48]],lowerGrille:[[-.55,.285],[.55,.285],[.69,.245],[.62,.175],[-.62,.175],[-.69,.245]],lowerPattern:'honeycomb'});
  Object.assign(profiles.kuga,{grille:[[-.58,.57],[.58,.57],[.68,.49],[.62,.35],[.40,.32],[-.40,.32],[-.62,.35],[-.68,.49]],lowerGrille:[[-.63,.30],[.63,.30],[.69,.255],[.62,.175],[-.62,.175],[-.69,.255]],pattern:'honeycomb',lowerPattern:'honeycomb'});
  const inside=(p,poly)=>{let on=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++)if((poly[i][1]>p[1])!==(poly[j][1]>p[1])&&p[0]<(poly[j][0]-poly[i][0])*(p[1]-poly[i][1])/(poly[j][1]-poly[i][1])+poly[i][0])on=!on;return on;};
  function tailHeight(profile,y){const anchor=profile.tailHeightAnchor||0;return anchor+(y-anchor)*(profile.tailHeightScale||1)-(profile.tailPocketShift||0);}
  function build({s,root,mesh,box,tube,rod,poly,frontZ,rearZ,paint,trim,metal,darkMetal,red,led,lamps}){
    const p=profiles[s.id],W=s.width,H=s.height,L=s.length,scale=a=>[a[0]*W*.45,a[1]*H*(s.body==='sedan'||s.body==='hatch'?.90:1)],to3=(a,depth=1)=>{const [x,y]=scale(a);return[x,y,frontZ(x,y)+depth];},rect=(cx,cy,w,h)=>[[cx-w/2,cy+h/2],[cx+w/2,cy+h/2],[cx+w/2,cy-h/2],[cx-w/2,cy-h/2]];
    const front=(points,m,depth=1)=>poly(points.map(scale),m,(x,y)=>frontZ(x,y)+depth),line=(points,r,m,depth=2)=>tube(points.flatMap((a,i)=>i?Array.from({length:8},(_,k)=>{const b=points[i-1],t=(k+1)/8;return to3([b[0]+(a[0]-b[0])*t,b[1]+(a[1]-b[1])*t],depth);}):[to3(a,depth)]),r,m,root,true);
    const tailPoint=([x,y])=>[x*W*.45,tailHeight(p,y)*H],tailSurface=(x,y,depth)=>rearZ(x,y)+(p.tailOpticInset||0)-depth;
    const rearLampHousing=darkMetal;
    function splitTail(points){
      const split=W*(s.id==='fox-b'?.315:.335);
      const clip=(polygon,limit,less)=>{const result=[];for(let i=0;i<polygon.length;i++){const a=polygon[i],b=polygon[(i+1)%polygon.length],inside=q=>less?q[0]<=limit:q[0]>=limit,ia=inside(a),ib=inside(b);if(ia)result.push(a);if(ia!==ib){const t=(limit-a[0])/(b[0]-a[0]);result.push([limit,a[1]+(b[1]-a[1])*t]);}}return result;};
      return [clip(points,-split-.16,true),clip(clip(points,-split+.16,false),split-.16,true),clip(points,split+.16,false)].filter(p=>p.length>2);
    }
    const tailLayer=(points,m,depth,name='recessed-tail-optic')=>splitTail(points).map(part=>poly(part,m,(x,y)=>tailSurface(x,y,depth),name));
    const smallRearOptic=(points,m,depth)=>splitTail(points.map(tailPoint)).map(part=>{
      const xs=part.map(p=>p[0]),ys=part.map(p=>p[1]),cx=(Math.min(...xs)+Math.max(...xs))/2,cy=(Math.min(...ys)+Math.max(...ys))/2,rx=(Math.max(...xs)-Math.min(...xs))/2||1,ry=(Math.max(...ys)-Math.min(...ys))/2||1;
      const formed=(x,y)=>tailSurface(x,y,depth)+(m===red?-.06:.12)*Math.max(0,1-((x-cx)/rx)**2-((y-cy)/ry)**2);
      const optic=poly(part,m,formed,'formed-tail-optic'),walls=[];
      for(let i=0;i<part.length;i++){const a=part[i],b=part[(i+1)%part.length],at=q=>[q[0],q[1],formed(...q)],u=at(a),v=at(b),back=q=>[q[0],q[1],q[2]+.28];walls.push(...u,...v,...back(u),...v,...back(v),...back(u));}
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(walls,3));g.computeVertexNormals();mesh(g,darkMetal,[0,0,0],'tail-optic-return');return optic;
    });
    const formedGrille=s.id==='fox-b'||s.id==='fox-c';
    if(p.pattern!=='body-color-perforated'){const back=front(p.grille,trim,formedGrille?-8:1.2);if(formedGrille){back.name='formed-lower-grille-back';back.userData.keep=true;}}
    if(!['body-color-perforated','horizontal-shield'].includes(p.pattern)&&s.nose!=='ev')line([...p.grille,p.grille[0]],p.pattern==='v-motion'?2:1.1,p.pattern==='honeycomb'?darkMetal:metal);
    const grilleZ=(x,y)=>frontZ(x,y)-(formedGrille?6:0);
    const frontOpticZ=(x,y,depth)=>frontZ(x,y)+depth-(formedGrille?4.4:0);
    const gs=p.grille.map(scale),xs=gs.map(p=>p[0]),ys=gs.map(p=>p[1]);
    if(formedGrille){
      // Intersect each continuous strand / louvre with the actual aperture.
      const cross=(a,b)=>a[0]*b[1]-a[1]*b[0];
      const grilleLine=(origin,d)=>{const hits=[];for(let i=0;i<gs.length;i++){const a=gs[i],b=gs[(i+1)%gs.length],edge=[b[0]-a[0],b[1]-a[1]],q=[a[0]-origin[0],a[1]-origin[1]],den=cross(d,edge);if(Math.abs(den)<1e-8)continue;const t=cross(q,edge)/den,u=cross(q,d)/den;if(u>=0&&u<=1)hits.push(t);}return hits.length>1?[Math.min(...hits),Math.max(...hits)]:null;};
      const low=Math.min(...ys),high=Math.max(...ys);
      if(s.id==='fox-b'){
        for(const sign of [-1,1])for(let k=Math.min(...xs)-(high-low)/1.45;k<Math.max(...xs)+(high-low)/1.45;k+=4.4){const origin=[k,low],d=[1,sign*1.45],span=grilleLine(origin,d);if(!span||span[1]-span[0]<1)continue;const n=Math.max(2,Math.ceil((span[1]-span[0])/2)),points=Array.from({length:n+1},(_,i)=>{const t=span[0]+.25+(span[1]-span[0]-.5)*i/n,x=origin[0]+d[0]*t,y=origin[1]+d[1]*t;return[x,y,grilleZ(x,y)+2];});tube(points,.25,darkMetal,root,true);}
      }else{
        for(let y=low+2.5;y<high-1.5;y+=4.6){const a=grilleLine([0,y-.65],[1,0]),b=grilleLine([0,y+.65],[1,0]);if(!a||!b)continue;const left=Math.max(a[0],b[0])+.6,right=Math.min(a[1],b[1])-.6;
          poly([[left,y-.65],[right,y-.65],[right,y+.65],[left,y+.65]],trim,(x,y)=>grilleZ(x,y)+2,'continuous-grille-louvre');
          const top=[];for(let i=0;i<24;i++){const u=left+(right-left)*i/24,v=left+(right-left)*(i+1)/24,at=x=>[x,y+.65,grilleZ(x,y+.65)+2],back=q=>[q[0],q[1]+.25,q[2]-1.3],a=at(u),b=at(v);top.push(...a,...b,...back(a),...b,...back(b),...back(a));}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(top,3));g.computeVertexNormals();mesh(g,darkMetal,[0,0,0],'louvre-top-return');
        }
        line([[-.98,.160],[-.86,.154],[0,.154],[.86,.154],[.98,.160]],.35,metal,.7);
      }
    }else for(let y=Math.min(...ys)+4,row=0;y<Math.max(...ys)-3;y+=7.1,row++)for(let x=Math.min(...xs)+3;x<Math.max(...xs)-2;x+=10.2){const q=[x+(row%2?5.1:0),y];if(!inside(q,gs))continue;if(p.pattern==='body-color-perforated'){const w=s.id==='fox-d'?4.5:5.2,h=s.id==='fox-d'?1.8:2.5;poly([[q[0]-w/2,y-h/2],[q[0]+w/2,y-h/2],[q[0]+w/2,y+h/2],[q[0]-w/2,y+h/2]],trim,(x,y)=>grilleZ(x,y)+.85,'recessed-grille-perforation');}else if(p.pattern==='slats'||p.pattern==='horizontal-shield'){box([q[0],y,grilleZ(q[0],y)+2],[7.4,p.pattern==='slats'?1:2,1],darkMetal,.35);}else if(p.pattern==='vertical-mesh'){box([q[0],y,grilleZ(q[0],y)+2],[.7,5.2,1],metal,.25);box([q[0],y,grilleZ(q[0],y)+1.8],[7,.65,.8],darkMetal,.2);}else{const points=Array.from({length:6},(_,i)=>[q[0]+4.2*Math.sin(i*Math.PI/3),y+2.7*Math.cos(i*Math.PI/3),grilleZ(q[0],y)+2]);tube([...points,points[0]],.3,darkMetal,root,true);}}
    if(p.lowerGrille){
      front(p.lowerGrille,trim,1.35);
      if(p.lowerPattern==='honeycomb'){
        const xs=p.lowerGrille.map(v=>v[0]),ys=p.lowerGrille.map(v=>v[1]),left=Math.min(...xs),right=Math.max(...xs),low=Math.min(...ys),high=Math.max(...ys);
        for(let row=0,y=low+.014;y<high-.008;y+=.027,row++)for(let x=left+.018+(row%2?.018:0);x<right-.012;x+=.036){
          if(!inside([x,y],p.lowerGrille))continue;
          const aperture=Array.from({length:7},(_,i)=>[x+.016*Math.cos(i*Math.PI/3),y+.012*Math.sin(i*Math.PI/3)]);
          line([...aperture,aperture[0]],.34,darkMetal,2.0);
        }
      }
    }
    if(s.id==='kuga'){
      // Taiwan-market facelift: 920 mm signature strip integrated into a
      // shallow smoked bridge just above the main grille.
      front([[-.50,.615],[.50,.615],[.515,.594],[.50,.582],[-.50,.582],[-.515,.594]],darkMetal,.75);
      lamps.push(line([[-.49,.601],[-.30,.601],[0,.601],[.30,.601],[.49,.601]],.82,led,1.05));
    }
    if(p.pattern==='v-motion')line([[-.55,.59],[-.43,.41],[-.28,.32],[.28,.32],[.43,.41],[.55,.59]],2.5,metal);
    // A smoked optical bridge supports the light guide across the centre
    // inlet; the luminous ribbon must not appear suspended above the bonnet.
    if(s.id==='fox-b'||s.id==='fox-c')for(const sign of [-1,1]){
      const top=p.drl.map(([x,y])=>[sign*x,y+.006]),bottom=[...p.drl].reverse().map(([x,y])=>[sign*x,y-.011]),outline=[...top,...bottom];front(outline,trim,.1);
      const returns=[];for(let i=0;i<outline.length;i++){const a=to3(outline[i],.1),b=to3(outline[(i+1)%outline.length],.1),back=q=>[q[0],q[1],q[2]-.75];returns.push(...a,...b,...back(a),...b,...back(b),...back(a));}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(returns,3));g.computeVertexNormals();mesh(g,trim,[0,0,0],'optical-bridge-body-return');
    }
    if(s.id==='fox-b'||s.id==='fox-c'){
      const cy=p.drl[0][1];
      poly([[-5.6,cy*H+2.85],[5.6,cy*H+2.85],[4.8,cy*H-3.55],[-4.8,cy*H-3.55]],darkMetal,(x,y)=>frontZ(x,y)+.35,'front-emblem-surround');
      // Separate diamond chips traced from the vehicle close-up, rather than
      // enlarged pixels from the unrelated 48 px website favicon.
      // Reference: https://image.u-car.com.tw/7619/photo_159534.jpg
      const dots=[];for(let row=0;row<7;row++)for(let col=row<2?0:row<4?3:5;col<7;col++)dots.push([row-col,-row-col]);
      function vehicleEmblem(centreY,sign,name,rearOffset=.43){
        const positions=[],at=(x,y,back=0)=>{x*=sign;const yy=centreY+y,surface=sign>0?frontZ(x,yy)+.6:rearZ(x,yy)+rearOffset;return[x,yy,surface-sign*back];};
        const tri=(a,b,c)=>positions.push(...a,...b,...c);
        for(const [u,v]of dots){const x=((u+6)/7-.5)*3.94,y=((v+12)/12-.5)*4.74,corners=[[0,.23],[-.23,0],[0,-.23],[.23,0]],inner=corners.map(([dx,dy])=>at(x+dx*.82,y+dy*.82));tri(inner[0],inner[1],inner[2]);tri(inner[0],inner[2],inner[3]);
          for(let i=0;i<4;i++){const j=(i+1)%4,a=at(x+corners[i][0],y+corners[i][1],.05),b=at(x+corners[j][0],y+corners[j][1],.05);tri(a,b,inner[i]);tri(b,inner[j],inner[i]);const c=at(x+corners[i][0],y+corners[i][1],.14),d=at(x+corners[j][0],y+corners[j][1],.14);tri(a,c,b);tri(b,c,d);}
        }
        const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.computeVertexNormals();const badge=mesh(g,metal,[0,0,0],name);badge.userData.keep=true;badge.userData.source='vehicle-photo-diamond-grid';return badge;
      }
      vehicleEmblem(cy*H-.35,1,'official-dot-chevron-emblem');
      if(s.id==='fox-b'){
        const rearCy=H*tailHeight(p,.700);
        poly([[-3.5,rearCy+3.2],[3.5,rearCy+3.2],[3.1,rearCy-3.2],[-3.1,rearCy-3.2]],darkMetal,(x,y)=>rearZ(x,y)+.55,'tailgate-emblem-base');
        vehicleEmblem(rearCy,-1,'official-tailgate-emblem');
      }else vehicleEmblem(H*(tailHeight(p,.674)+tailHeight(p,.706))/2,-1,'official-tailgate-emblem',.73);
    }
    if(s.id==='fox-b')for(const sign of [-1,1])front([[.90,.508],[.97,.51],[.94,.18],[.85,.18],[.87,.36]].map(([x,y])=>[sign*x,y]),trim,.9);
    if(s.id==='focus')for(const side of [-1,1]){
      const vent=[[.755,.355],[.895,.386],[.914,.354],[.89,.286],[.79,.277],[.748,.307]].map(([x,y])=>[side*x,y]);
      front(vent,paint,.65);front([[side*.779,.348],[side*.881,.369],[side*.891,.347],[side*.873,.300],[side*.80,.294],[side*.775,.312]],darkMetal,1.45);
      line([[side*.786,.305],[side*.866,.323]],.48,metal,1.8);line([[side*.797,.291],[side*.86,.305]],.38,metal,1.8);
      const fog=mesh(new T.SphereGeometry(1,16,10),led,to3([side*.846,.335],2.05),'focus-bumper-corner-led');fog.scale.set(1.8,1.2,.45);
    }
    if(s.id==='kuga')for(const side of [-1,1]){
      const vent=[[.765,.330],[.895,.354],[.914,.326],[.892,.263],[.795,.258],[.755,.286]].map(([x,y])=>[side*x,y]);
      front(vent,paint,.65);front([[side*.786,.323],[side*.879,.340],[side*.887,.321],[side*.868,.275],[side*.807,.271],[side*.779,.291]],darkMetal,1.45);
      for(let row=0;row<2;row++)line([[side*(.798+row*.024),.285+row*.017],[side*(.864-row*.014),.298+row*.017]],.40,metal,1.8);
      const fog=mesh(new T.SphereGeometry(1,16,10),led,to3([side*.84,.319],2.0),'kuga-bumper-corner-led');fog.scale.set(1.7,1.0,.4);
    }
    if(s.id==='altis'){
      line([[-.69,.205],[-.52,.183],[0,.176],[.52,.183],[.69,.205]],1.15,metal,1.1);
      for(const side of [-1,1]){
        front([[side*.775,.337],[side*.895,.349],[side*.908,.324],[side*.85,.296],[side*.78,.307]],paint,.65);
        front([[side*.795,.330],[side*.875,.339],[side*.882,.322],[side*.844,.307],[side*.801,.313]],darkMetal,1.35);
        const fog=mesh(new T.SphereGeometry(1,16,10),led,to3([side*.84,.323],1.9),'altis-bumper-corner-led');fog.scale.set(1.35,.8,.35);
      }
    }
    // Individual lamp outlines and their light signature; no shared triple-round-eye face.
    for(const side of [-1,1]){const mirror=pts=>pts.map(([x,y])=>[side*x,y]),head=mirror(p.head);if(formedGrille)poly(head.map(scale),darkMetal,(x,y)=>frontOpticZ(x,y,2),'recessed-head-housing');else front(head,darkMetal,s.id==='model-3'?1.0:2);const housingTrim=['focus','altis','kuga'].includes(s.id)?darkMetal:(s.nose==='ev'?trim:metal);line([...head,head[0]],formedGrille?.12:['focus','altis','kuga'].includes(s.id)?.18:.38,housingTrim,formedGrille?-2:2.4);const path=mirror(p.drl);lamps.push(line(path,s.id==='model-3'||formedGrille?.55:1.1,led,formedGrille?.45:2.9));
      const centre=p.head.reduce((a,v)=>[a[0]+v[0]/p.head.length,a[1]+v[1]/p.head.length],[0,0]),lensCount=p.projectors?p.projectors.length:s.id==='fox-d'?0:s.id==='focus'?2:s.id==='kuga'?2:1;for(let i=0;i<lensCount;i++){const x=side*(p.projectors?.[i]?.[0]??(centre[0]+(i?-.08:.04)))*W*.45,y=scale([0,p.projectors?.[i]?.[1]??(centre[1]-.005)])[1];if(p.lensStyle==='foxtron-projector'){
          const w=s.id==='fox-b'?7.8:7.2,h=s.id==='fox-b'?3.5:3.2;
          const optic=(width,height,radius,m,depth)=>{const points=[];for(let corner=0;corner<4;corner++){const a0=corner*Math.PI/2,cx=x+(corner===0||corner===3?1:-1)*(width/2-radius),cy=y+(corner<2?1:-1)*(height/2-radius);for(let k=0;k<=5;k++){const a=a0+k/5*Math.PI/2;points.push([cx+radius*Math.cos(a),cy+radius*Math.sin(a)]);}}return poly(points,m,(px,py)=>frontOpticZ(px,py,depth),'surface-fitted-projector');};
          optic(w+1.4,h+1.2,.9,trim,2.3);optic(w,h,.8,metal,2.55);
          lamps.push(optic(w-1.2,h-.65,.7,led,2.8));
          for(const dx of [-1.6,1.6])poly([[x+dx-.12,y-h*.3],[x+dx+.12,y-h*.3],[x+dx+.12,y+h*.3],[x+dx-.12,y+h*.3]],metal,(px,py)=>frontOpticZ(px,py,2.95),'projector-optical-divider');
          continue;
        }if(p.lensStyle==='matrix'){const w=s.id==='model-3'?1.5:s.id==='altis'?3.3:2.7,h=s.id==='model-3'?.45:1.05;poly([[x-w,y-h],[x+w,y-h],[x+w,y+h],[x-w,y+h]],led,(x,y)=>frontZ(x,y)+2.55,'recessed-led-module');continue;}const lens=mesh(new T.SphereGeometry(1,20,14),metal,[x,y,frontZ(x,y)+2.2],'lamp-reflector');lens.scale.set(s.id==='altis'?4.5:3.7,2.8,1.2);const bulb=mesh(new T.SphereGeometry(1,18,12),led,[x,y,frontZ(x,y)+3.3],'projector-lens');bulb.scale.set(s.id==='altis'?3:2.5,2.1,.7);lamps.push(bulb);}
      if(s.id==='kicks'||s.id==='sentra'){const tall=s.id==='kicks',points=mirror([[.79,tall?.48:.42],[.91,tall?.49:.43],[.87,.22],[.75,.23]]);front(points,trim,2);for(let row=0;row<4;row++)line(mirror([[.79,.26+row*.037],[.86,.26+row*.037]]),.65,darkMetal);if(s.id!=='sentra')line(mirror([[.79,.30],[.84,.30]]),1.3,led);}
      else if(s.id==='corolla-cross'){front(mirror([[.78,.43],[.91,.43],[.89,.28],[.79,.31]]),trim,2);for(let row=0;row<5;row++)line(mirror([[.81,.32+row*.02],[.87,.32+row*.02]]),.65,darkMetal);}
    }
    if(s.id==='corolla-cross'){line([[-.35,.65],[0,.65],[.35,.65]],1.2,metal);front(rect(0,.27,1.56,.17),trim,2);for(let row=0;row<3;row++)line([[-.67,.23+row*.034],[.67,.23+row*.034]],1,darkMetal);}
    else if(s.id==='kicks')front(rect(0,.20,1.25,.10),trim,2);
    if(s.id==='model-3'){line([[-.045,.67],[0,.675],[.045,.67]],.65,metal,.8);line([[0,.675],[0,.62]],.7,metal,.8);}
    else if(!s.id.startsWith('fox-')){if(s.id==='altis'){for(const [rx,ry,rotation] of [[4.9,3.3,0],[2.6,1.25,0],[1.45,2.65,0]]){const badge=mesh(new T.TorusGeometry(1,.18,8,32),metal,to3(p.badge,3.1),'toyota-elliptical-emblem');badge.scale.set(rx,ry,1);badge.rotation.z=rotation;}}else{const badge=mesh(new T.SphereGeometry(1,24,16),metal,to3(p.badge,3),'brand-emblem');badge.scale.set(s.nose==='ford'?6:4.5,s.nose==='ford'?2.5:4.5,1);const centre=mesh(new T.SphereGeometry(1,20,12),s.nose==='ford'?mat('#244b73',.26,{metalness:.3}):trim,to3(p.badge,4),'emblem-inset');centre.scale.set(s.nose==='ford'?5.1:3.6,1.8,.5);}}
    if(s.nose==='ford'&&['focus','kuga'].includes(s.id)){
      const canvas=document.createElement('canvas');canvas.width=256;canvas.height=96;const ctx=canvas.getContext('2d');ctx.clearRect(0,0,256,96);ctx.fillStyle='#f5f5ef';ctx.font='italic bold 62px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('Ford',128,51);const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;
      const word=mesh(new T.PlaneGeometry(9.8,3.6),new T.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,side:T.DoubleSide}),to3(p.badge,4.65),'ford-script-emblem');word.castShadow=false;word.receiveShadow=false;
    }
    if(s.id.startsWith('fox-')&&!['fox-b','fox-c'].includes(s.id)){lamps.push(line([[-.94,p.bar||.65],[0,p.bar||.65],[.94,p.bar||.65]],1.15,led,1.9));}
    if(s.id==='fox-c')for(const side of [-1,1]){
      front([[side*.92,.54],[side*.95,.53],[side*.90,.20],[side*.87,.20]],trim,.8);
      line([[side*.93,.52],[side*.885,.22]],.55,darkMetal,1.0);
    }
    if(s.id==='fox-d'){for(const side of [-1,1]){front([[side*.77,.48],[side*.90,.48],[side*.90,.25],[side*.79,.25]],trim,1.5);for(const y of [.30,.40])line([[side*.85,y],[side*.85,y+.055]],1.5,led,2.3);}}
    if(['model-3','fox-b','fox-c'].includes(s.id)){
      const canvas=document.createElement('canvas');canvas.width=512;canvas.height=64;const ctx=canvas.getContext('2d');ctx.fillStyle='#b5bec4';ctx.font='38px sans-serif';ctx.textAlign='center';if(s.id==='model-3')ctx.fillText('T E S L A',256,46);else [...'FOXTRON'].forEach((letter,i)=>ctx.fillText(letter,256+(i-3)*58,46));const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;const m=new T.MeshStandardMaterial({map:texture,transparent:true,depthWrite:false,metalness:.65,roughness:.32,side:T.DoubleSide}),back=s.id==='model-3';
      if(back){const badge=mesh(new T.PlaneGeometry(48,7.25),m,[0,H*.53,rearZ(0,H*.53)-1.5],'rear-wordmark');badge.rotation.y=Math.PI;}
      else{
        // Project every vertex onto the actual inclined bumper ramp. A flat
        // vertical plane either floats in front of it or disappears into it.
        const g=new T.PlaneGeometry(62,6.4,32,6),v=g.attributes.position;
        for(let i=0;i<v.count;i++){const x=v.getX(i),y=v.getY(i)+H*(s.id==='fox-b'?.483:.495);v.setXYZ(i,x,y,frontZ(x,y)+.20);}
        g.computeVertexNormals();const badge=mesh(g,m,[0,0,0],'ramp-conforming-foxtron-wordmark');badge.userData.keep=true;
      }
      if(s.id==='fox-b'||s.id==='fox-c'){
        const rearCanvas=document.createElement('canvas');rearCanvas.width=512;rearCanvas.height=64;const rc=rearCanvas.getContext('2d');rc.fillStyle='#b5bec4';rc.font='38px sans-serif';rc.textAlign='center';[...'FOXTRON'].forEach((letter,i)=>rc.fillText(letter,256+(i-3)*64,46));const rearTexture=new T.CanvasTexture(rearCanvas);rearTexture.colorSpace=T.SRGBColorSpace;const rearMaterial=m.clone();rearMaterial.map=rearTexture;
        const g=new T.PlaneGeometry(86,6.8,40,6),v=g.attributes.position;
        for(let i=0;i<v.count;i++){const x=-v.getX(i),y=v.getY(i)+H*.61;v.setXYZ(i,x,y,rearZ(x,y)-.25);}
        g.computeVertexNormals();mesh(g,rearMaterial,[0,0,0],'surface-fitted-tailgate-wordmark');
      }
    }
    if(s.id==='fox-c'){
      const points=[[-.94,.19],[-.85,.245],[-.68,.32],[-.45,.365],[0,.365],[.45,.365],[.68,.32],[.85,.245],[.94,.19],[.88,.145],[-.88,.145]].map(([x,y])=>[x*W*.45,y*H]);
      poly(points,trim,(x,y)=>rearZ(x,y)-.8,'cavira-rear-valance');
      tube(Array.from({length:49},(_,i)=>{const a=i/48*2-1,x=a*W*.423,y=H*(.165+.025*Math.pow(Math.abs(a),3));return[x,y,rearZ(x,y)-1.7];}),.8,metal);
      for(const side of [-1,1])tube([[side*W*.32,H*.23,rearZ(side*W*.32,H*.23)-1.8],[side*W*.39,H*.218,rearZ(side*W*.39,H*.218)-1.8]],.9,red);
    }
    if(s.id==='fox-b'){
      const bumper=[[-.88,.25],[-.65,.285],[-.40,.33],[.40,.33],[.65,.285],[.88,.25],[.82,.17],[-.82,.17]].map(([x,y])=>[x*W*.45,y*H]);
      poly(bumper,trim,(x,y)=>rearZ(x,y)-.9,'bria-rear-diffuser');
      for(const x of [-W*.20,0,W*.20])box([x,27,rearZ(x,27)-1],[1.4,12,4],trim,.4);
      for(const side of [-1,1])tube([[side*W*.31,H*.245,rearZ(side*W*.31,H*.245)-2],[side*W*.40,H*.245,rearZ(side*W*.40,H*.245)-2]],.9,red);
    }
    // The name also acts as a testable vehicle identity when viewed from the front/rear.
    const plateNumber={focus:'BTV-5186',kuga:'BKU-2753',altis:'BTA-3986'}[s.id]||'B1-2026';
    const c=document.createElement('canvas');c.width=512;c.height=160;const ctx=c.getContext('2d');ctx.fillStyle='#f2f2ed';ctx.fillRect(0,0,512,160);ctx.fillStyle='#202326';ctx.textAlign='center';ctx.font='bold 76px Arial';ctx.fillText(plateNumber,256,111,480);const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;const material=new T.MeshStandardMaterial({map:texture,roughness:.68});for(const side of [-1,1]){const plateY=side>0?H*(s.id==='fox-c'?.325:.25):H*(s.id==='fox-b'?.26:s.id==='fox-c'?.275:.36);if(side>0&&formedGrille)box([0,plateY,frontZ(0,plateY)-1.8],[7,13,4.4],trim,.5);const o=mesh(new T.PlaneGeometry(34,12),material,[0,plateY,side>0?frontZ(0,plateY)+(formedGrille?1.2:4.4):rearZ(0,plateY)-2.5],'taiwan-style-license-plate');if(side<0)o.rotation.y=Math.PI;}
    const rearBand=p.tailOutline||{focus:[[.24,.63],[.68,.63],[.94,.68],[.90,.59],[.69,.54]],altis:[[.24,.64],[.70,.63],[.94,.67],[.88,.57],[.58,.54]],sentra:[[.23,.64],[.73,.63],[.93,.67],[.88,.55],[.61,.53]],kicks:[[.30,.75],[.66,.76],[.94,.79],[.91,.66],[.60,.62]],kuga:[[.23,.68],[.69,.68],[.94,.72],[.91,.61],[.59,.60]],'corolla-cross':[[.22,.71],[.67,.71],[.94,.74],[.92,.64],[.60,.63]]}[s.id];
    if(p.tailPocketContours)for(const contour of p.tailPocketContours)poly(contour.map(([x,y])=>[x*W*.45,y*H]),trim,(x,y)=>tailSurface(x,y,s.id==='fox-b'?1:.6),'tail-pocket-back');
    for(const side of [-1,1]){
      if(s.id==='fox-c'){
        const rp=(points,m,d)=>tailLayer(points.map(([x,y])=>tailPoint([side*x,y])),m,d,'cavira-optical-tail');
        rp([[0,.716],[.94,.716],[.95,.706],[0,.706]],red,1.2);
        rp([[.67,.701],[.73,.666],[.94,.666],[.94,.678],[.76,.678],[.71,.701]],red,1.4);
        for(const [x,w] of [[.22,.052],[.39,.045],[.79,.040],[.88,.035]]){
          const oval=Array.from({length:17},(_,i)=>{const a=i/16*Math.PI*2;return[x+Math.cos(a)*w,.689+Math.sin(a)*.007];});
          smallRearOptic(oval.map(([x,y])=>[side*x,y]),darkMetal,1.45);smallRearOptic(oval.map(([px,py])=>[side*(x+(px-x)*.88),.689+(py-.689)*.65]),red,1.7);
        }
        continue;
      }
      if(s.id==='fox-b'){
        const rearPoly=(points,m,depth)=>tailLayer(points.map(([x,y])=>tailPoint([side*x,y])),m,depth,'bria-matrix-tail');
        rearPoly([[.054,.710],[.92,.710],[.92,.695],[.054,.695]],red,1.6);
        for(let row=0;row<4;row++)for(let col=0;col<5-row;col++){
          const x=.75+col*.044+row*.018,y=.657-row*.017;
          const tile=[];for(let corner=0;corner<4;corner++){const angle=corner*Math.PI/2,cx=x+(corner===0||corner===3?.010:-.010),cy=y+(corner<2?.002:-.002);for(let k=0;k<=3;k++){const a=angle+k/3*Math.PI/2;tile.push([cx+Math.cos(a)*.003,cy+Math.sin(a)*.002]);}}
          smallRearOptic(tile.map(([x,y])=>[side*x,y]),red,1.8);
        }
        continue;
      }
      if(['focus','altis','kuga'].includes(s.id)){
        // Kuga's lamp wraps down the rear quarter. A horizontal hatchback
        // blade made the SUV read as the same generic rear as Focus/Altis.
        if(s.id==='kuga'){
          const outer=[[.868,.745],[.946,.742],[.955,.713],[.947,.666],[.936,.608],[.918,.555],[.891,.531],[.850,.545],[.861,.590],[.875,.652],[.878,.706]];
          tailLayer(outer.map(([x,y])=>tailPoint([side*x,y])),rearLampHousing,.48,'kuga-vertical-rear-lamp-housing');
          const redBlade=[[.875,.727],[.936,.724],[.941,.701],[.934,.661],[.920,.611],[.904,.568],[.891,.550],[.866,.559],[.876,.607],[.887,.659],[.889,.703]];
          tailLayer(redBlade.map(([x,y])=>tailPoint([side*x,y])),red,.86,'kuga-vertical-wraparound-tail-lamp');
          const clearOptic=[[.884,.650],[.914,.645],[.919,.623],[.904,.601],[.878,.609]];
          tailLayer(clearOptic.map(([x,y])=>tailPoint([side*x,y])),led,.96,'kuga-reverse-light');
          continue;
        }
        const housing={focus:[[.405,.702],[.916,.708],[.951,.689],[.941,.644],[.887,.615],[.66,.616],[.423,.625]],altis:[[.315,.682],[.891,.690],[.935,.668],[.905,.635],[.858,.611],[.64,.613],[.342,.624]],kuga:[[.325,.735],[.902,.741],[.941,.715],[.921,.682],[.866,.664],[.63,.669],[.365,.678]]}[s.id];
        const lamp=housing.map(([x,y])=>tailPoint([side*x,y]));tailLayer(lamp,rearLampHousing,.42,'model-specific-rear-lamp-housing');
        const blade={focus:[[.43,.671],[.89,.696],[.935,.680],[.93,.657],[.72,.626],[.48,.632]],altis:[[.34,.647],[.86,.675],[.916,.655],[.86,.632],[.64,.615],[.37,.624]],kuga:[[.36,.696],[.89,.728],[.927,.707],[.856,.684],[.62,.666],[.38,.672]]}[s.id].map(([x,y])=>[side*x,y]);
        tailLayer(blade.map(([x,y])=>tailPoint([x,y])),red,.78,'integrated-red-rear-light-blade');
        const inner={focus:[[.867,.667],[.938,.678],[.946,.598],[.896,.585]],altis:[[.835,.642],[.915,.658],[.918,.625],[.865,.606]],kuga:[[.865,.700],[.94,.714],[.944,.645],[.89,.632]]}[s.id].map(([x,y])=>[side*x,y]);
        tailLayer(inner.map(([x,y])=>tailPoint([x,y])),red,.86,'outer-wrap-red-tail-light');
        continue;
      }
      const contour=rearBand.map(([x,y])=>[side*x*W*.45,y*H]),tailZ=(x,y)=>rearZ(x,y)-.45;poly(contour,darkMetal,tailZ,'tail-smoke-housing');poly(contour.map(([x,y])=>[x,y-(s.id==='model-3'?.35:1)]),red,(x,y)=>tailZ(x,y)-.45,'tail-'+p.tailStyle);tube(contour.slice(0,3).map(([x,y])=>[x,y,tailZ(x,y)-1]),.75,red,root,true);}
    if(s.id==='fox-b'||s.id==='fox-c'){
      const lens=new T.MeshPhysicalMaterial({color:'#c7d5dd',roughness:.075,metalness:0,clearcoat:1,clearcoatRoughness:.04,transparent:true,opacity:.15,depthWrite:false,side:T.DoubleSide});
      const tailLens=lens.clone();tailLens.color.set('#742d35');tailLens.opacity=.18;
      function cover(points,sign,depth,material){
        const world=points.map(([x,y])=>[x*W*.45,y*H]),surface=sign>0?frontZ:rearZ;
        for(const boundary of sign<0?splitTail(world):[world]){
        const atSurface=(x,y)=>surface(x,y)+sign*depth+(sign<0?p.tailOpticInset:-4.4);
        const lens=poly(boundary,material,atSurface,sign<0?'integrated-tail-lens':'integrated-head-lens');lens.userData.keep=true;
        const pos=[];
        for(let i=0;i<boundary.length;i++){const a=boundary[i],b=boundary[(i+1)%boundary.length];for(let k=0;k<8;k++){const at=t=>{const x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t;return[x,y,atSurface(x,y)];},u=at(k/8),v=at((k+1)/8),inner=q=>[q[0],q[1],q[2]-sign*.65];pos.push(...u,...v,...inner(u),...v,...inner(v),...inner(u));}}
        const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.computeVertexNormals();mesh(g,material,[0,0,0],'optical-cover-return');
        }
      }
      for(const side of [-1,1]){
        cover(p.head.map(([x,y])=>[side*x,y]),1,3.35,lens);
      }
      for(const contour of p.tailPocketContours)cover(contour,-1,2.15,tailLens);
    }
    return {generation:p.generation,face:p.pattern,tail:p.tailStyle,source:p.source};
  }
  window.B1_VEHICLE_FACES={profiles,build,tailHeight};
})();
