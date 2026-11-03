/* Independent EV silhouettes in normalised longitudinal coordinates. */
(() => {
  const source='https://www.foxtronev.com/s3/tw/esg/Management/01_Foxtron_2024永續報告書Year%20Report%20Full(CH)_202508.pdf';
  const defs={
    'fox-a':{cabin:[[-.475,.73,.435],[-.38,.99,.39],[-.12,1,.39],[.12,.98,.38],[.32,.66,.43]],belt:.68,head:[[0,.66],[.97,.66],[.90,.58],[0,.58]],drl:[[0,.646],[.95,.646]],tail:.69},
    'fox-b':{cabin:[[-.45,.73,.435],[-.28,.96,.35],[-.08,1,.35],[.055,.96,.355],[.26,.64,.43]],belt:.65,head:[[0,.66],[.97,.68],[.91,.49],[.70,.49],[.55,.58],[0,.58]],drl:[[.06,.65],[.92,.66]],tail:.68},
    'fox-c':{cabin:[[-.46,.73,.435],[-.32,.98,.37],[-.10,1,.37],[.07,.98,.365],[.29,.66,.43]],belt:.67,head:[[0,.66],[.97,.68],[.94,.55],[.70,.54],[.56,.58],[0,.58]],drl:[[.06,.65],[.93,.66]],tail:.69},
    'fox-d':{cabin:[[-.475,.78,.44],[-.385,.975,.405],[-.12,1,.405],[.13,.98,.39],[.335,.68,.43]],belt:.70,head:[[.06,.65],[.96,.65],[.96,.62],[.06,.62]],drl:[[.06,.638],[.95,.638]],tail:.73},
    'model-3':{cabin:[[-.355,.70,.43],[-.17,.96,.355],[-.04,1,.35],[.08,.93,.355],[.245,.69,.43]],belt:.68,head:[[.56,.55],[.95,.60],[.87,.53],[.62,.50]],drl:[[.58,.535],[.85,.56],[.92,.584]],tail:.66}
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
  p['fox-b'].source='https://api.sicar.com.tw/public/uploads/ori/editor/2025/04/20250423143422106924129.jpeg';
  p['fox-b'].grille=[[-.53,.39],[.53,.39],[.75,.22],[.61,.17],[-.61,.17],[-.75,.22]];
  p['fox-b'].pattern='honeycomb';p['fox-b'].projectors=[[.82,.55],[.82,.505]];
  p['fox-c'].source='https://image.u-car.com.tw/5277/photo_139627.jpg';
  p['fox-c'].grille=[[-.50,.39],[.50,.39],[.76,.21],[.68,.17],[-.68,.17],[-.76,.21]];
  p['fox-c'].projectors=[[.76,.59],[.88,.61]];
})();
