/* Screen-space contact shading and antialiasing; all geometry remains interactive. */
(() => {
  const hdr=renderer.capabilities.isWebGL2&&renderer.extensions.has('EXT_color_buffer_float');
  const depth=new T.DepthTexture(1,1,T.UnsignedIntType);
  const targetBuffer=new T.WebGLRenderTarget(1,1,{type:hdr?T.HalfFloatType:T.UnsignedByteType,depthTexture:depth,minFilter:T.LinearFilter,magFilter:T.LinearFilter});
  targetBuffer.samples=renderer.capabilities.isWebGL2?2:0;
  const postScene=new T.Scene(),postCamera=new T.OrthographicCamera(-1,1,1,-1,0,1);
  const material=new T.ShaderMaterial({
    uniforms:{colorBuffer:{value:targetBuffer.texture},depthBuffer:{value:depth},resolution:{value:new T.Vector2(1,1)},inverseProjection:{value:camera.projectionMatrixInverse},projection:{value:camera.projectionMatrix},aoStrength:{value:.35}},
    vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',
    fragmentShader:`
      varying vec2 vUv;
      uniform sampler2D colorBuffer,depthBuffer;
      uniform vec2 resolution;
      uniform mat4 inverseProjection,projection;
      uniform float aoStrength;
      vec3 positionAt(vec2 uv){float d=texture2D(depthBuffer,uv).x;vec4 p=inverseProjection*vec4(uv*2.-1.,d*2.-1.,1.);return p.xyz/p.w;}
      float luma(vec3 c){return dot(c,vec3(.299,.587,.114));}
      void main(){
        vec2 px=1./resolution;
        vec3 color=texture2D(colorBuffer,vUv).rgb;
        vec3 n=texture2D(colorBuffer,vUv+vec2(0.,px.y)).rgb;
        vec3 s=texture2D(colorBuffer,vUv-vec2(0.,px.y)).rgb;
        vec3 e=texture2D(colorBuffer,vUv+vec2(px.x,0.)).rgb;
        vec3 w=texture2D(colorBuffer,vUv-vec2(px.x,0.)).rgb;
        float contrast=max(max(luma(n),luma(s)),max(luma(e),luma(w)))-min(min(luma(n),luma(s)),min(luma(e),luma(w)));
        color=mix(color,(n+s+e+w+color*4.)/8.,smoothstep(.12,.6,contrast)*.45);
        vec3 p=positionAt(vUv);
        // Choose the shorter depth neighbour to avoid turning silhouettes into dark halos.
        vec3 dx1=positionAt(vUv+vec2(px.x,0.))-p,dx2=p-positionAt(vUv-vec2(px.x,0.));
        vec3 dy1=positionAt(vUv+vec2(0.,px.y))-p,dy2=p-positionAt(vUv-vec2(0.,px.y));
        vec3 norm=normalize(cross(length(dx1)<length(dx2)?dx1:dx2,length(dy1)<length(dy2)?dy1:dy2));
        if(norm.z<0.)norm=-norm;
        float occlusion=0.;
        vec2 screenRadius=vec2(projection[0][0],projection[1][1])*6./max(20.,-p.z);
        for(int i=0;i<24;i++){
          float angle=float(i)*2.39996323;
          float radius=sqrt((float(i)+.5)/24.);
          vec2 uv=clamp(vUv+vec2(cos(angle),sin(angle))*radius*screenRadius,px,1.-px);
          vec3 delta=positionAt(uv)-p;float dist=length(delta);
          occlusion+=max(0.,dot(norm,delta/max(.01,dist))-.16)*(1.-smoothstep(2.,14.,dist));
        }
        color*=1.-clamp(occlusion/24.*aoStrength*2.6,0.,.28);
        gl_FragColor=vec4(color,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    depthTest:false,depthWrite:false
  });
  postScene.add(new T.Mesh(new T.PlaneGeometry(2,2),material));
  const renderOriginal=renderer.render.bind(renderer),size=new T.Vector2();
  renderer.render=(world,cam)=>{
    if(world!==scene)return renderOriginal(world,cam);
    renderer.getDrawingBufferSize(size);
    if(targetBuffer.width!==size.x||targetBuffer.height!==size.y){targetBuffer.setSize(size.x,size.y);material.uniforms.resolution.value.copy(size);}
    renderer.setRenderTarget(targetBuffer);renderOriginal(world,cam);
    B1_REVIEW.sceneCalls=renderer.info.render.calls;B1_REVIEW.sceneTriangles=renderer.info.render.triangles;
    renderer.setRenderTarget(null);renderOriginal(postScene,postCamera);
  };
  const shadeControl=document.createElement('label');shadeControl.textContent='細緻接觸陰影 ';
  const shadeToggle=document.createElement('input');shadeToggle.type='checkbox';shadeToggle.checked=true;shadeToggle.onchange=()=>material.uniforms.aoStrength.value=shadeToggle.checked?.35:0;shadeControl.prepend(shadeToggle);document.querySelector('.toolbar').append(shadeControl);
  B1_REVIEW.rendering='HDR + screen-space contact shading';
})();
