/* Native PBR rendering avoids unused offscreen/depth GPU allocations. */
(() => {
 const nativeRender=renderer.render.bind(renderer);
 renderer.render=(world,cam)=>{nativeRender(world,cam);if(world===scene){B1_REVIEW.sceneCalls=renderer.info.render.calls;B1_REVIEW.sceneTriangles=renderer.info.render.triangles;}};
 B1_REVIEW.rendering='ACES PBR + native anti-aliasing';
 B1_REVIEW.renderProfile='cinematic-webgl-safe';
})();
