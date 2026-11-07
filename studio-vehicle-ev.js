/* Independent EV silhouettes in normalised longitudinal coordinates. */
(() => {
  const source='https://www.foxtronev.com/s3/tw/esg/Management/01_Foxtron_2024永續報告書Year%20Report%20Full(CH)_202508.pdf';
  const defs={
    'fox-a':{cabin:[[-.475,.73,.435],[-.38,.99,.39],[-.12,1,.39],[.12,.98,.38],[.32,.66,.43]],belt:.68,head:[[0,.66],[.97,.66],[.90,.58],[0,.58]],drl:[[0,.646],[.95,.646]],tail:.69},
    'fox-b':{cabin:[[-.455,.73,.43],[-.315,.965,.365],[-.095,1,.355],[.045,.965,.355],[.26,.65,.43]],belt:.67,head:[[0,.665],[.97,.68],[.91,.50],[.71,.50],[.55,.59],[0,.59]],drl:[[.05,.65],[.94,.665]],tail:.70},
    'fox-c':{cabin:[[-.465,.73,.435],[-.335,.975,.373],[-.11,1,.37],[.065,.98,.37],[.255,.68,.44]],belt:.69,head:[[0,.68],[.97,.70],[.93,.56],[.73,.55],[.59,.60],[0,.60]],drl:[[.05,.665],[.94,.685]],tail:.72},
    'fox-d':{cabin:[[-.475,.78,.44],[-.385,.975,.405],[-.12,1,.405],[.13,.98,.39],[.335,.68,.43]],belt:.70,head:[[.06,.65],[.96,.65],[.96,.62],[.06,.62]],drl:[[.06,.638],[.95,.638]],tail:.73},
    'model-3':{cabin:[[-.35,.70,.43],[-.19,.945,.355],[-.055,1,.35],[.065,.955,.35],[.245,.69,.43]],belt:.68,head:[[.55,.565],[.96,.605],[.88,.535],[.65,.522]],drl:[[.58,.55],[.86,.572],[.93,.593]],tail:.66}
  };
  for(const [id,d]of Object.entries(defs)){
    B1_VEHICLE_SCULPT.shapes[id]={cabin:d.cabin,belt:[[-.5,d.belt-.05],[-.34,d.belt+.015],[0,d.belt],[.29,d.belt-.015],[.5,id==='model-3'?.45:d.belt-.08]],width:[[-.5,.90],[-.39,.975],[-.29,1],[-.07,.975],[.27,1],[.41,.96],[.5,.89]],crease:id==='model-3'?.55:1.2,spokes:10};
    B1_VEHICLE_SCULPT.looks[id]={spokes:10};
    B1_VEHICLE_FACES.profiles[id]={generation:id==='model-3'?'Highland / sculpted interpretation':id==='fox-d'?'Pininfarina LMUV / concept interpretation':'Foxtron / sculpted interpretation',source:id==='model-3'?'https://www.tesla.com/ownersmanual/model3/en_pr/GUID-56562137-FC31-4110-A13C-9A9FC6657BF0.html':source,grille:id==='fox-d'?[[-.66,.42],[.66,.42],[.69,.19],[-.69,.19]]:[[-.62,.27],[.62,.27],[.58,.20],[-.58,.20]],head:d.head,drl:d.drl,pattern:id==='fox-d'?'body-color-perforated':'slats',badge:[0,.50],bar:.638,rim:'aero-ten',tailStyle:id==='model-3'?'c-shaped':'light-bar',tailOutline:id==='model-3'?[[.42,.67],[.89,.69],[.86,.56],[.76,.56],[.78,.63],[.42,.64]]:[[.02,d.tail],[.91,d.tail],[.90,d.tail-.035],[.02,d.tail-.035]]};
  }
  // Model A's tall passenger pod and B/C split headlamps are independently traced,
  // not the Kicks / Corolla Cross aliases used in the previous traffic release.
  const p=B1_VEHICLE_FACES.profiles;
  p['fox-a'].projectors=[];
  p['fox-a'].source='https://api.sicar.com.tw/public/uploads/ori/editor/2025/11/20251121142822109200068.jpeg';
  p['fox-b'].generation='BRIA production exterior reference';
  p['fox-b'].source='https://autos.yahoo.com.tw/new-cars/trim/foxtron-bria-2026-pioneer/spec';
  p['fox-b'].grille=[[-.53,.39],[.53,.39],[.75,.22],[.61,.17],[-.61,.17],[-.75,.22]];
  p['fox-b'].pattern='honeycomb';p['fox-b'].projectors=[[.82,.555],[.82,.515]];p['fox-b'].bar=.65;p['fox-b'].lensStyle='matrix';
  p['fox-c'].generation='CAVIRA production exterior reference';
  p['fox-c'].source='https://www.foxtronev.com/news-center/cavira-official-launch';
  p['fox-c'].grille=[[-.50,.39],[.50,.39],[.76,.21],[.68,.17],[-.68,.17],[-.76,.21]];
  p['fox-c'].projectors=[[.76,.605],[.88,.62]];p['fox-c'].bar=.665;p['fox-c'].lensStyle='matrix';
  p['fox-b'].head=[[0,.665],[.97,.68],[.91,.50],[.73,.50],[.63,.61],[0,.632]];
  p['fox-c'].head=[[0,.68],[.97,.70],[.93,.56],[.73,.55],[.59,.645],[0,.65]];
  p['fox-b'].drl=[[0,.65],[.94,.665]];p['fox-c'].drl=[[0,.665],[.94,.685]];
  p['model-3'].lensStyle='matrix';p['model-3'].projectors=[[.72,.552],[.81,.563],[.88,.575]];
  p['model-3'].tailOutline=[[.43,.67],[.89,.70],[.88,.55],[.75,.55],[.76,.58],[.83,.59],[.83,.66],[.43,.64]];
  // Production-specific panel sections and wheel choices, not colour variants.
  const shapes=B1_VEHICLE_SCULPT.shapes;
  Object.assign(shapes['fox-b'],{wheelRadius:35.2,wheelStyle:'bria-geometric-five',panelDepth:3.8,shoulder:2.6});
  Object.assign(shapes['fox-c'],{wheelRadius:36.2,wheelStyle:'cavira-machined-ten',panelDepth:2.8,shoulder:2.0});
  Object.assign(shapes['model-3'],{wheelRadius:33.4,wheelStyle:'highland-photon',panelDepth:2.2,shoulder:1.1});
  shapes['model-3'].belt=[[-.5,.63],[-.34,.69],[-.16,.69],[.12,.67],[.29,.625],[.41,.54],[.5,.475]];
  shapes['model-3'].width=[[-.5,.89],[-.39,.98],[-.29,1],[-.08,.965],[.29,1],[.40,.975],[.5,.90]];
  shapes['fox-b'].width=[[-.5,.91],[-.36,.99],[-.30,1],[-.03,.96],[.32,1],[.43,.97],[.5,.91]];
  shapes['fox-c'].width=[[-.5,.93],[-.40,.98],[-.31,1],[-.06,.97],[.31,1],[.43,.97],[.5,.92]];
  // Cavira official side photograph: low bonnet nose, substantial black window
  // pillars, rising rear belt and two horizontal projector modules per side.
  shapes['fox-c'].belt=[[-.5,.66],[-.36,.725],[-.16,.715],[.12,.70],[.27,.68],[.39,.635],[.5,.595]];
  shapes['fox-c'].cabin=[[-.465,.73,.435],[-.335,.975,.373],[-.11,1,.37],[.065,.98,.37],[.255,.68,.44]];
  p['fox-c'].head=[[0,.606],[.97,.623],[.94,.554],[.77,.546],[.64,.576],[0,.578]];
  p['fox-c'].drl=[[.035,.599],[.92,.616]];
  p['fox-c'].projectors=[[.78,.571],[.89,.581]];
  p['fox-c'].source='https://www.foxtronev.com/models/explore/cavira';
  Object.assign(shapes['fox-c'],{productionPillars:true,bodyHandles:true,blackMirrors:true});
  Object.assign(shapes['fox-b'],{productionPillars:true,blackMirrors:true});
  p['fox-b'].source='https://www-assets.cloud.foxtronev.com/files/specifications/bria/en/FOXTRON-BRIA-Brochure-EN-2026-v2.pdf';
  for(const key of ['head','drl','projectors'])p['fox-b'][key]=p['fox-b'][key].map(([x,y])=>[x,y*.93]);
  // Photo-derived section controls in centimetres / fractions of body dimensions.
  // These are modelling controls, not manufacturer CAD measurements.
  Object.assign(shapes['fox-b'],{
    sectionedBody:true,duct:{rear:.433,front:.463,half:.77,depth:7.5},
    sideSection:[[0,.89],[.14,.94],[.32,.925],[.50,.955],[.73,1.012],[.88,1.015],[1,.975]],
    noseSection:[[0,6],[.18,0],[.36,3],[.57,12],[.76,7],[1,10]],
    tailSection:[[0,9],[.22,1],[.40,2],[.60,13],[.80,8],[1,14]],
    belt:[[-.5,.72],[-.35,.73],[-.15,.705],[.12,.69],[.27,.66],[.39,.615],[.5,.595]],
    panelDepth:6.8,shoulder:1.0
  });
  Object.assign(shapes['fox-c'],{
    sectionedBody:true,duct:{rear:.449,front:.466,half:.76,depth:6},
    sideSection:[[0,.895],[.14,.94],[.32,.93],[.53,.965],[.76,1.012],[.90,1.008],[1,.972]],
    noseSection:[[0,5],[.18,0],[.34,3],[.58,11],[.78,7],[1,10]],
    tailSection:[[0,7],[.22,0],[.42,3],[.61,11],[.80,7],[1,13]],
    belt:[[-.5,.715],[-.36,.725],[-.16,.715],[.12,.70],[.27,.665],[.39,.615],[.5,.600]],
    panelDepth:5.6,shoulder:1.0
  });
  // Individual bonnet and canopy stations, traced against the official side views.
  shapes['fox-b'].cabin=[[-.474,.73,.43],[-.35,.965,.364],[-.13,1,.355],[.045,.975,.355],[.23,.67,.43]];
  shapes['fox-c'].cabin=[[-.475,.73,.435],[-.355,.968,.373],[-.12,1,.37],[.055,.984,.37],[.225,.685,.44]];
  shapes['fox-b'].bonnet=[[.23,.693],[.30,.674],[.37,.642],[.44,.613],[.50,.596]];
  shapes['fox-c'].bonnet=[[.225,.697],[.30,.675],[.37,.645],[.44,.619],[.50,.600]];
  // Bumper sections blend depth across the width instead of extruding a wavy slab.
  shapes['fox-b'].noseSection=[[0,7],[.18,1],[.36,4],[.57,7],[.76,3],[1,6]];
  shapes['fox-c'].noseSection=[[0,6],[.18,1],[.34,4],[.58,6],[.78,3],[1,6]];
  // Separate the front S-Duct mouth from the two outboard lamp housings.
  p['fox-b'].ductInlet=[[-.67,.584],[.67,.584],[.61,.534],[-.61,.534]];
  p['fox-c'].ductInlet=[[-.66,.589],[.66,.589],[.60,.544],[-.60,.544]];
  p['fox-b'].head=[[.64,.613],[.97,.632],[.94,.515],[.76,.512],[.64,.548]];
  p['fox-b'].drl=[[.018,.606],[.92,.620]];
  p['fox-b'].projectors=[[.82,.575],[.82,.544]];
  p['fox-c'].head=[[.64,.606],[.97,.623],[.94,.551],[.77,.548],[.64,.576]];
  p['fox-c'].projectors=[[.78,.573],[.88,.582]];
  p['fox-b'].lensStyle=p['fox-c'].lensStyle='foxtron-projector';
  // Separate photo-traced rear sail panels: Bria has an opaque graphic panel;
  // Cavira has a small triangular quarter-light within its swept black surround.
  shapes['fox-b'].sail={top:-.292,bottom:-.322};
  shapes['fox-c'].sail={top:-.225,bottom:-.275,quarter:[[-.277,.25],[-.345,.79],[-.286,.79]]};
  shapes['fox-b'].duct={rear:.420,front:.469,half:.75,depth:0};
  shapes['fox-c'].duct={rear:.432,front:.470,half:.74,depth:0};
  p['fox-b'].ductInlet=[[-.65,.592],[.65,.592],[.55,.515],[-.55,.515]];
  p['fox-c'].ductInlet=[[-.64,.595],[.64,.595],[.54,.529],[-.54,.529]];
  // The badge-bearing ramp recedes towards the inlet, then the upper bridge
  // returns forward. This is a section of the body, not a floating flat badge.
  shapes['fox-b'].noseSection=[[0,7],[.18,1],[.36,4],[.57,3],[.70,11],[.84,22],[.94,9],[1,6]];
  shapes['fox-c'].noseSection=[[0,6],[.18,1],[.34,4],[.58,3],[.73,12],[.86,20],[.95,8],[1,6]];
  p['fox-b'].head=[[.60,.614],[.97,.628],[.96,.518],[.78,.513],[.65,.535]];
  p['fox-b'].projectors=[[.83,.572],[.83,.538]];
  p['fox-c'].head=[[.60,.609],[.97,.625],[.95,.548],[.78,.541],[.64,.563]];
  p['fox-c'].projectors=[[.77,.569],[.89,.574]];
  p['fox-c'].drl=[[.018,.605],[.71,.614],[.96,.626]];
  p['fox-b'].drl=[[.018,.606],[.71,.616],[.96,.628]];
  // Keep the optical strip underneath the leading bonnet bridge at the
  // outboard corners, instead of floating above the fender silhouette.
  for(const id of ['fox-b','fox-c']){
    for(const key of ['head','drl','projectors'])p[id][key]=p[id][key].map(([x,y])=>[x,y-.012]);
    p[id].ductInlet=p[id].ductInlet.map(([x,y],i)=>[x,y-(i<2?.012:0)]);
  }
  // The outboard signature follows the leading bonnet edge downward; the
  // previous rising ribbon protruded above the actual painted silhouette.
  p['fox-b'].drl=[[.012,.593],[.55,.592],[.82,.590],[.96,.587]];
  p['fox-c'].drl=[[.012,.597],[.55,.596],[.82,.594],[.96,.590]];
  p['fox-b'].head=[[.60,.599],[.97,.594],[.95,.504],[.78,.501],[.65,.523]];
  p['fox-c'].head=[[.60,.602],[.97,.598],[.95,.536],[.78,.529],[.64,.551]];
  // Gentle continuous shoulder sections. The old layered sine / crease /
  // hollow offsets compounded into an exaggerated inward bow of the doors.
  for(const id of ['fox-b','fox-c'])shapes[id].sideSection=[[0,.94],[.12,.96],[.28,.955],[.50,.975],[.73,1],[.88,.995],[.95,.982],[.985,.960],[1,.935]];
  shapes['fox-b'].hoodSection=[[0,3.6],[.30,3],[.56,-.8],[.76,2],[.90,1],[1,-1.5]];
  shapes['fox-c'].hoodSection=[[0,3],[.40,2.7],[.62,.4],[.80,1.3],[1,-1.3]];
  for(const id of ['fox-b','fox-c'])p[id].drl[0][0]=.052;
  shapes['fox-b'].tailSection=[[0,7],[.18,2],[.36,3],[.51,5],[.65,7],[.82,3],[1,7]];
  shapes['fox-c'].tailSection=[[0,6],[.18,1],[.37,2],[.53,5],[.68,8],[.83,4],[1,7]];
  // Pioneer standard specification: brochure BRIA p12 / CAVIRA p1.
  Object.assign(shapes['fox-b'],{trim:'Pioneer',wheelRadius:34.8,rimRadius:25.4,tyreWidth:23.5,frontTrack:163.9,rearTrack:163.8,panoramicRoof:true,tyreSpec:'235/40 R20'});
  Object.assign(shapes['fox-c'],{trim:'Pioneer',wheelRadius:35.155,rimRadius:24.13,tyreWidth:24.5,frontTrack:163.9,rearTrack:163.5,panoramicRoof:true,tyreSpec:'245/45 R19'});
  // Shallower badge ramp with a softer return beneath the optical bridge.
  shapes['fox-b'].noseSection=[[0,6],[.18,1],[.36,3],[.57,3],[.70,6],[.84,12],[.94,7],[1,5]];
  shapes['fox-c'].noseSection=[[0,5],[.18,1],[.34,3],[.58,3],[.73,6],[.86,11],[.95,6],[1,5]];
})();
