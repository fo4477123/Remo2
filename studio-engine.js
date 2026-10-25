import * as GPU from 'three/webgpu';
import { WebGLRenderer, WebGLRenderTarget, PMREMGenerator as GLPMREM } from './vendor/three/build/three.module.js';

const version='20261025-shower1',forced=new URLSearchParams(location.search).get('renderer');
let canvas=document.querySelector('#scene'),renderer,reason='',backend='webgl2',adapterInfo=null;
const status=document.createElement('div');status.className='engine-status';status.setAttribute('role','status');status.textContent='正在啟動繪圖引擎…';document.querySelector('.toolbar').append(status);
try {
  if(forced==='webgl')throw new Error('使用者選用相容模式');
  if(!isSecureContext||!navigator.gpu)throw new Error('此瀏覽器未提供 WebGPU');
  const adapter=await navigator.gpu.requestAdapter({powerPreference:'high-performance'});if(!adapter)throw new Error('找不到可用的 WebGPU adapter');adapterInfo={vendor:adapter.info.vendor,architecture:adapter.info.architecture};
  renderer=new GPU.WebGPURenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});await renderer.init();
  if(!renderer.backend.isWebGPUBackend)throw new Error('WebGPU 初始化未成功');backend='webgpu';
  renderer.capabilities={getMaxAnisotropy:()=>renderer.getMaxAnisotropy()};
} catch(error) {
  reason=error.message;renderer?.dispose();const fresh=canvas.cloneNode(false);canvas.replaceWith(fresh);canvas=fresh;
  renderer=new WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
}
const namespace={...GPU};namespace.PMREMGenerator=backend==='webgpu'?GPU.PMREMGenerator:GLPMREM;namespace.WebGLRenderTarget=backend==='webgpu'?GPU.RenderTarget:WebGLRenderTarget;
window.THREE=namespace;
window.B1_ENGINE={version,renderer,backend,webgpu:backend==='webgpu',reason,revision:GPU.REVISION,adapterInfo,adapterVerified:backend==='webgpu',status,ready:false};
status.textContent=backend==='webgpu'?'WebGPU · 啟動中':'WebGL2 相容模式';status.title=reason||'已初始化真正的 WebGPU 裝置';status.dataset.backend=backend;
if(backend==='webgpu')renderer.backend.device.lost.then(info=>{if(info.reason==='destroyed')return;B1_ENGINE.ready=false;status.textContent='GPU 連線中斷';const retry=document.createElement('button');retry.textContent='重新啟動畫面';retry.onclick=()=>location.reload();status.append(retry);});
const script=document.createElement('script');script.src='studio.js?v='+version;script.onerror=()=>{status.textContent='空間載入失敗，請重新整理';};document.body.append(script);
