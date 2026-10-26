/* Shared realistic templates and textures; only nearby street residents use full geometry. */
(() => {
  const residents=[];
  function create(options){const rig=B1_CHARACTERS.create(options);rig.root.userData.crowd=true;residents.push(rig);return rig;}
  function tick(){const active=window.B1_COMMUNITY?.zone==='city',quality=B1_ENGINE.quality,max=quality==='low'?2:quality==='balanced'?5:8,detail=quality==='low'?3500:quality==='balanced'?6500:10000,range=quality==='low'?14000:quality==='balanced'?22000:35000;const sorted=residents.map(r=>({r,d:Math.hypot(r.root.position.x+750-walkX,700-r.root.position.z-walkY)})).sort((a,b)=>a.d-b.d);let full=0;for(const {r,d}of sorted){r.root.visible=active&&d<range;const detailed=r.root.visible&&d<detail&&full<max;if(detailed)full++;r.setDetail(detailed);r.shadow.visible=d<5500;}for(const n of B1_NEIGHBORHOOD.npcs)if(n.a18&&n.zone==='city')n.badge.visible=n.root.visible&&Math.hypot(n.x-walkX,n.y-walkY)<1800;}
  window.B1_CROWD={create,tick,snapshot:()=>({residents:residents.length,visible:residents.filter(r=>r.root.visible).length,detailed:residents.filter(r=>r.root.visible&&r.full[0].visible).length,drawsPerBody:3,highTriangles:residents[0]?.snapshot().triangles,lowTriangles:residents[0]?.snapshot().coarseTriangles})};
})();
