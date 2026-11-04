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
})();
