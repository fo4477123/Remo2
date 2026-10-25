/* Actual WebGPU render pipeline; the compatibility backend stays explicit. */
(() => {
  const engine=B1_ENGINE,nativeRender=renderer.render.bind(renderer),pipelines=new WeakMap();let nested=false,nodes;
  const setup=engine.webgpu?Promise.all([import('three/tsl'),import('three/addons/tsl/display/SSGINode.js'),import('three/addons/tsl/display/TRAANode.js')]).then(([tsl,gi,aa])=>{nodes={...tsl,...gi,...aa};}):Promise.resolve();
  function pipelineFor(world){
    if(pipelines.has(world))return pipelines.get(world);
    const {pass,mrt,output,diffuseColor,normalView,velocity,packNormalToRGB,unpackRGBToNormal,sample,vec4,add,ssgi,traa}=nodes;
    const renderPipeline=new T.RenderPipeline(renderer),scenePass=pass(world,camera,{samples:0});
    scenePass.setMRT(mrt({output,diffuseColor,normal:packNormalToRGB(normalView),velocity}));
    scenePass.getTexture('diffuseColor').type=T.UnsignedByteType;scenePass.getTexture('normal').type=T.UnsignedByteType;
    const color=scenePass.getTextureNode('output'),depth=scenePass.getTextureNode('depth'),normal=sample(uv=>unpackRGBToNormal(scenePass.getTextureNode('normal').sample(uv)));
    const gi=ssgi(color,depth,normal,camera);gi.sliceCount.value=2;gi.stepCount.value=8;gi.radius.value=45;gi.thickness.value=2;gi.aoIntensity.value=.75;gi.giIntensity.value=1.4;
    const composite=vec4(add(color.rgb.mul(gi.getAONode()),scenePass.getTextureNode('diffuseColor').rgb.mul(gi.getGINode().rgb)),color.a);
    const temporal=traa(composite,depth,scenePass.getTextureNode('velocity'),camera);renderPipeline.outputNode=temporal;
    const value={pipeline:renderPipeline,gi,temporal};pipelines.set(world,value);return value;
  }
  renderer.render=(world,cam)=>{
    if(nested||!engine.ready||!engine.webgpu||!nodes||cam!==camera||renderer.getRenderTarget()||document.querySelector('select[aria-label="畫質"]')?.value!=='high')return nativeRender(world,cam);
    nested=true;try{pipelineFor(world).pipeline.render();}finally{nested=false;}
    B1_REVIEW.sceneCalls=renderer.info.render.drawCalls||renderer.info.render.calls;B1_REVIEW.sceneTriangles=renderer.info.render.triangles;
  };
  engine.prepare=async()=>{window.B1_MUSIC?.attachGame();await setup;await window.B1_REMAKE?.ready;await B1_MODELS.pbrReady;renderer.setSize(view.clientWidth,view.clientHeight,false);camera.aspect=view.clientWidth/view.clientHeight;camera.updateProjectionMatrix();
    if(engine.webgpu){loading.textContent='正在編譯 WebGPU 材質與柔光…';await renderer.compileAsync(scene,camera);}
    engine.ready=true;engine.status.textContent=engine.webgpu?(document.querySelector('select[aria-label="畫質"]').value==='high'?'WebGPU · 電影光影':'WebGPU · 流暢模式'):'WebGL2 · 相容模式';
    engine.status.title=engine.webgpu?'原生 WebGPU · SSGI 間接光 · 接觸陰影 · 時間抗鋸齒':engine.reason;
  };
  B1_REVIEW.rendering=engine.webgpu?'WebGPU · PBR / SSGI / temporal AA':'WebGL2 · PBR compatibility';B1_REVIEW.renderProfile=engine.webgpu?'webgpu-remake':'webgl2-compatible';B1_REVIEW.backend=engine.backend;
})();
