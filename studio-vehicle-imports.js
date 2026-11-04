/* Licensed street-car assets, prepared in centimetres with +Z forward. */
(() => {
  let template=null;
  const status={loaded:false,error:null};
  const ready=(async()=>{
    let timer;
    try{
      const {GLTFLoader}=await import('./vendor/three/examples/jsm/loaders/GLTFLoader.js');
      const gltf=await Promise.race([
        new GLTFLoader().loadAsync('assets/models/vehicles/model-3-2018.glb'),
        new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Model 3 loading timed out')),20000);})
      ]);
      const source=gltf.scene;
      for(let i=0;i<4;i++)if(!source.getObjectByName('model-3-import-wheel-'+i))throw Error('Missing Model 3 wheel pivot '+i);
      source.traverse(o=>{if(!o.isMesh)return;o.castShadow=!o.material.transparent;o.receiveShadow=o.material.name!=='primary';if(o.material.transparent)o.material.depthWrite=false;});
      template=source;status.loaded=true;return true;
    }catch(error){status.error=error.message;console.warn('Model 3 asset unavailable; using procedural fallback:',error.message);return false;}
    finally{clearTimeout(timer);}
  })();
  function create(s,color){
    if(s.id!=='model-3'||!template)return null;
    const group=template.clone(true),wheels=Array.from({length:4},(_,i)=>group.getObjectByName('model-3-import-wheel-'+i)),lamps=[],materials=new Map();
    group.name='licensed-model-3-2018';
    group.traverse(o=>{
      if(!o.isMesh)return;
      const source=o.material,isPaint=source.name==='primary',isLamp=o.name.startsWith('model-3-headlight');
      if(isPaint||isLamp){
        if(!materials.has(source)){
          let m=source.clone();
          if(isPaint)m=new T.MeshPhysicalMaterial({name:'model-3-paint',color,roughness:.24,metalness:.35,clearcoat:1,clearcoatRoughness:.12});
          if(isLamp){m.emissive.set('#d7eaff');m.emissiveIntensity=.4;m.userData.vehicleHeadlight=true;}
          materials.set(source,m);
        }
        o.material=materials.get(source);
      }
      if(isLamp)lamps.push(o);
    });
    const rider=new T.Group();rider.visible=false;group.add(rider);
    const features=['licensed-2018-model','textured-interior','four-separated-wheel-pivots','original-body-panels','independent-headlights'];
    group.userData.features=features;
    return{group,wheels,lamps,rider,type:'car',features,spec:{...s,color,detail:'licensed-2018-model',interpretation:false,source:'https://sketchfab.com/3d-models/tesla-2018-model-3-5ef9b845aaf44203b6d04e2c677e444f'}};
  }
  window.B1_VEHICLE_IMPORTS={ready,create,status};
})();
