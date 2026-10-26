const assert=require('node:assert/strict'),fs=require('node:fs');
const geometry=require('./studio-city-layout.js'),data=require('./assets/city/qingpu-map.json'),layout=geometry.build(data);
// Independently intersect rendered road rectangles with building edges, including sidewalks.
let checked=0;for(const s of layout.segments){const dx=s.b[0]-s.a[0],dy=s.b[1]-s.a[1],length=Math.hypot(dx,dy),nx=-dy/length*s.pavingWidth/2,ny=dx/length*s.pavingWidth/2,poly=[[s.a[0]+nx,s.a[1]+ny],[s.b[0]+nx,s.b[1]+ny],[s.b[0]-nx,s.b[1]-ny],[s.a[0]-nx,s.a[1]-ny]];
 for(const b of layout.nearby(s.a,s.b,20)){assert(!poly.some(p=>geometry.inside(p,b.points)),`Road ${s.id} enters building ${b.id}`);assert(!b.points.some(p=>geometry.inside(p,poly)),`Road ${s.id} covers building ${b.id}`);for(let i=0;i<4;i++)for(let j=0;j<b.points.length;j++)assert(geometry.segmentDistance(poly[i],poly[(i+1)%4],b.points[j],b.points[(j+1)%b.points.length])>.01,`Road ${s.id} edge crosses ${b.id}`);}checked++;
}
assert(layout.report.narrowed>0&&layout.report.blocked>0);assert(layout.segments.filter(s=>s.name==='青埔八街').length>5);
const synthetic={home:[1000,1000],buildings:[{id:'wall',area:100,box:[4,0,10,10],points:[[4,0],[14,0],[14,10],[4,10]]}],roads:[{id:'beside',layer:0,type:'residential',points:[[0,-10],[0,20]]},{id:'through',layer:0,type:'service',points:[[-10,5],[20,5]]},{id:'bridge',layer:1,bridge:'yes',type:'secondary',points:[[-10,0],[20,0]]}]};
synthetic.roads[0].width=10;const test=geometry.build(synthetic);assert(test.report.narrowed>0&&test.report.blocked>0);assert(!test.segments.some(s=>s.id==='bridge'));assert(!test.segments.some(s=>s.id==='through'));
for(const id of ['479042997','776406726','776406725'])assert(data.rails.find(r=>r.id===id&&r.bridge&&r.type==='subway'));
fs.mkdirSync('qa-output',{recursive:true});fs.writeFileSync('qa-output/layout-report.json',JSON.stringify({checked,...layout.report},null,2));console.log('PASS footprint/road/pavement intersection audit',JSON.stringify({checked,...layout.report}));
