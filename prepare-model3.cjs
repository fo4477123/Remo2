// Offline preparation of the credited CC BY model. No network access.
// node prepare-model3.cjs <directory containing @gltf-transform and meshoptimizer>
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const modules=path.resolve(process.argv[2]||'node_modules');
const {NodeIO}=require(path.join(modules,'@gltf-transform/core'));
const {ALL_EXTENSIONS}=require(path.join(modules,'@gltf-transform/extensions'));
const {weld,simplify,prune,dedup}=require(path.join(modules,'@gltf-transform/functions'));
const {MeshoptDecoder,MeshoptSimplifier}=require(path.join(modules,'meshoptimizer'));
(async()=>{
  const T=await import('./vendor/three/build/three.module.js');
  await Promise.all([MeshoptDecoder.ready,MeshoptSimplifier.ready]);
  const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.decoder':MeshoptDecoder});
  const doc=await io.read('qa-output/model3-2018-source.glb'),root=doc.getRoot();
  const originalNodes=root.listNodes(),originalScenes=root.listScenes(),records=[],bounds=new T.Box3();
  const turn=new T.Matrix4().makeRotationY(Math.PI),p=new T.Vector3(),n=new T.Vector3();
  for(const node of originalNodes){
    if(!node.getMesh())continue;
    const world=turn.clone().multiply(new T.Matrix4().fromArray(node.getWorldMatrix())),normalMatrix=new T.Matrix3().getNormalMatrix(world);
    for(const primitive of node.getMesh().listPrimitives()){
      const pos=primitive.getAttribute('POSITION'),normal=primitive.getAttribute('NORMAL'),uv=primitive.getAttribute('TEXCOORD_0');
      const positions=[],normals=[],uvs=[];
      for(let i=0;i<pos.getCount();i++){
        p.fromArray(pos.getElement(i,[])).applyMatrix4(world);positions.push(p.x,p.y,p.z);bounds.expandByPoint(p);
        n.fromArray(normal?normal.getElement(i,[]):[0,1,0]).applyNormalMatrix(normalMatrix);normals.push(n.x,n.y,n.z);uvs.push(...(uv?uv.getElement(i,[]):[0,0]));
      }
      records.push({name:node.getName(),material:primitive.getMaterial(),positions,normals,uvs,indices:primitive.getIndices()?.getArray()||Uint32Array.from({length:pos.getCount()},(_,i)=>i)});
    }
  }
  // Body excluding mirrors is 218.37 source units; longitudinal size includes both bumpers.
  const scale=new T.Vector3(184.9/218.3742,144.3/(bounds.max.y-bounds.min.y),469.4/(bounds.max.z-bounds.min.z));
  const origin=new T.Vector3((bounds.min.x+bounds.max.x)/2,bounds.min.y,(bounds.min.z+bounds.max.z)/2);
  const wheelBounds=Array.from({length:4},()=>new T.Box3());
  for(const r of records)for(let i=0;i<r.positions.length;i+=3){
    p.fromArray(r.positions,i).sub(origin).multiply(scale);p.toArray(r.positions,i);
    n.fromArray(r.normals,i).divide(scale).normalize().toArray(r.normals,i);
    if(/^wheels/.test(r.name))wheelBounds[(p.z>0?0:2)+(p.x>0?1:0)].expandByPoint(p);
  }
  const centres=wheelBounds.map(b=>b.getCenter(new T.Vector3()));
  assert(centres.every(p=>p.toArray().every(Number.isFinite)),'Four real wheel bounds');
  const scene=doc.createScene('Game Model 3 2018'),body=doc.createNode('model-3-import-body'),buffer=doc.createBuffer('Model3');scene.addChild(body);
  const pivots=centres.map((p,i)=>{const node=doc.createNode('model-3-import-wheel-'+i).setTranslation(p.toArray());scene.addChild(node);return node;});
  const buckets=new Map(),headMaterials=new Map();
  for(const r of records){
    const rolling=/^wheels/.test(r.name),headlight=/chrome_Lights_head/.test(r.name);
    let material=r.material;
    if(headlight){if(!headMaterials.has(material))headMaterials.set(material,material.clone().setName('model-3-headlight-'+headMaterials.size).setEmissiveFactor([.35,.4,.45]));material=headMaterials.get(material);}
    for(let k=0;k<r.indices.length;k+=3){
      const ids=[r.indices[k],r.indices[k+1],r.indices[k+2]],x=ids.reduce((v,i)=>v+r.positions[i*3],0)/3,z=ids.reduce((v,i)=>v+r.positions[i*3+2],0)/3;
      const wheel=rolling?(z>0?0:2)+(x>0?1:0):-1,key=wheel+'|'+root.listMaterials().indexOf(material);
      if(!buckets.has(key))buckets.set(key,{wheel,material,headlight,position:[],normal:[],uv:[]});
      const out=buckets.get(key);
      for(const i of ids){p.fromArray(r.positions,i*3);if(wheel>=0)p.sub(centres[wheel]);out.position.push(p.x,p.y,p.z);out.normal.push(...r.normals.slice(i*3,i*3+3));out.uv.push(...r.uvs.slice(i*2,i*2+2));}
    }
  }
  for(const b of buckets.values()){
    const accessor=(array,type)=>doc.createAccessor().setType(type).setArray(new Float32Array(array)).setBuffer(buffer);
    const primitive=doc.createPrimitive().setAttribute('POSITION',accessor(b.position,'VEC3')).setAttribute('NORMAL',accessor(b.normal,'VEC3')).setAttribute('TEXCOORD_0',accessor(b.uv,'VEC2')).setMaterial(b.material);
    const mesh=doc.createMesh().addPrimitive(primitive),node=doc.createNode(b.headlight?'model-3-headlight':'model-3-'+b.material.getName()).setMesh(mesh);
    (b.wheel<0?body:pivots[b.wheel]).addChild(node);
  }
  root.setDefaultScene(scene);for(const s of originalScenes)s.dispose();for(const node of originalNodes)node.dispose();
  for(const ext of root.listExtensionsUsed())if(['EXT_meshopt_compression','KHR_mesh_quantization'].includes(ext.extensionName))ext.dispose();
  await doc.transform(prune(),weld(),simplify({simplifier:MeshoptSimplifier,ratio:.45,error:.0004}),dedup(),prune());
  const destination='assets/models/vehicles/model-3-2018.glb';await io.write(destination,doc);
  const triangles=root.listMeshes().reduce((sum,m)=>sum+m.listPrimitives().reduce((v,p)=>v+(p.getIndices()?.getCount()||p.getAttribute('POSITION').getCount())/3,0),0);
  const report={destination,bytes:fs.statSync(destination).size,triangles,meshBatches:buckets.size,wheelCentres:centres.map(p=>p.toArray()),scale:scale.toArray(),source:'Ameer Studio / Tesla 2018 Model 3 / CC BY 4.0'};
  fs.writeFileSync('qa-output/model3-preparation.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
})().catch(error=>{console.error(error);process.exitCode=1;});
