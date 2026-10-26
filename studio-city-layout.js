/* Shared, deterministic metre-scale layout. Used by the renderer and Node geometry QA. */
(() => {
  const widths={primary:18,secondary:14,tertiary:10,residential:7,unclassified:6,service:4,living_street:5,cycleway:3,footway:2,path:2,pedestrian:4,track:3,primary_link:6,secondary_link:5,tertiary_link:4,busway:7};
  const inside=(p,poly)=>{let yes=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])yes=!yes;}return yes;};
  function pointSegment(p,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy||1)));return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy);}
  function segmentDistance(a,b,c,d){const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);if(cross(a,b,c)*cross(a,b,d)<0&&cross(c,d,a)*cross(c,d,b)<0)return 0;return Math.min(pointSegment(a,c,d),pointSegment(b,c,d),pointSegment(c,a,b),pointSegment(d,a,b));}
  function community(data){const [x,y]=data.home;return [[x+9,y+15,29,17],[x+53,y+15,29,17],[x+38,y+17,15,12]].map((box,i)=>({id:'community-'+i,box,points:[[box[0],box[1]],[box[0]+box[2],box[1]],[box[0]+box[2],box[1]+box[3]],[box[0],box[1]+box[3]]]}));}
  function build(data){
    const custom=community(data),buildings=data.buildings.filter(b=>b.area>=8&&!custom.some(c=>inside([b.box[0]+b.box[2]/2,b.box[1]+b.box[3]/2],c.points))),blockers=[...buildings,...custom],grid=new Map();
    for(const b of blockers){const [x,y,w,d]=b.box;for(let ix=Math.floor(x/80);ix<=Math.floor((x+w)/80);ix++)for(let iy=Math.floor(y/80);iy<=Math.floor((y+d)/80);iy++){const key=ix+','+iy;if(!grid.has(key))grid.set(key,[]);grid.get(key).push(b);}}
    function nearby(a,b=a,pad=25){const found=new Set();for(let x=Math.floor((Math.min(a[0],b[0])-pad)/80);x<=Math.floor((Math.max(a[0],b[0])+pad)/80);x++)for(let y=Math.floor((Math.min(a[1],b[1])-pad)/80);y<=Math.floor((Math.max(a[1],b[1])+pad)/80);y++)for(const item of grid.get(x+','+y)||[])found.add(item);return [...found];}
    function clearance(a,b=a,pad=25){let distance=pad;for(const item of nearby(a,b,pad)){const poly=item.points;if(inside(a,poly)||inside(b,poly))return 0;for(let i=0;i<poly.length;i++)distance=Math.min(distance,segmentDistance(a,b,poly[i],poly[(i+1)%poly.length]));}return distance;}
    const segments=[],report={narrowed:0,blocked:0,gradeSeparated:0,sourceWidths:0};
    for(const road of data.roads){if(road.tunnel&&road.tunnel!=='no'||road.bridge&&road.bridge!=='no'||road.layer!==0){report.gradeSeparated++;continue;}
      const drivable=!['footway','path','pedestrian','cycleway','steps','track'].includes(road.type),base=road.width>0?Math.min(30,road.width):road.lanes>0?Math.min(24,road.lanes*3.1):widths[road.type]||6;if(road.width>0)report.sourceWidths++;
      for(let i=1;i<road.points.length;i++){const a=road.points[i-1],b=road.points[i],length=Math.hypot(b[0]-a[0],b[1]-a[1]);if(length<.2||length>1600)continue;const count=Math.ceil(length/18);for(let j=0;j<count;j++){const p=[a[0]+(b[0]-a[0])*j/count,a[1]+(b[1]-a[1])*j/count],q=[a[0]+(b[0]-a[0])*(j+1)/count,a[1]+(b[1]-a[1])*(j+1)/count],gap=clearance(p,q),width=Math.min(base,Math.max(0,(gap-.45)*2));if(width<(drivable?2.8:1.2)){report.blocked++;continue;}if(width<base-.01)report.narrowed++;segments.push({a:p,b:q,width,pavingWidth:Math.min(base+(drivable?3:0),Math.max(width,(gap-.25)*2)),name:road.name,type:road.type,id:road.id,drivable,oneway:road.oneway,clearance:gap});}}
    }
    return {segments,buildings,blockers,custom,clearance,nearby,report};
  }
  const api={build,inside,pointSegment,segmentDistance,community,widths};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else window.B1_CITY_LAYOUT=api;
})();
