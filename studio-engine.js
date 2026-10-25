import * as GPU from 'three/webgpu';
import { WebGLRenderer, WebGLRenderTarget, PMREMGenerator as GLPMREM } from './vendor/three/build/three.module.js';

const version='20261026-world1',forced=new URLSearchParams(location.search).get('renderer');
let canvas=document.querySelector('#scene'),renderer,reason='',backend='webgl2',adapterInfo=null,gpuTier='standard';
const status=document.createElement('div');status.className='engine-status';status.setAttribute('role','status');status.textContent='正在啟動繪圖引擎…';document.querySelector('.toolbar').append(status);
try {
  if(forced==='webgl')throw new Error('使用者選用相容模式');
  if(!isSecureContext||!navigator.gpu)throw new Error('此瀏覽器未提供 WebGPU');
  const adapter=await navigator.gpu.requestAdapter({powerPreference:'low-power'});if(!adapter)throw new Error('找不到可用的 WebGPU adapter');const info=adapter.info||{},limits=adapter.limits||{};adapterInfo={vendor:info.vendor||'',architecture:info.architecture||'',device:info.device||'',description:info.description||'',powerPreference:'low-power',maxTextureDimension2D:limits.maxTextureDimension2D||0,maxStorageBufferBindingSize:limits.maxStorageBufferBindingSize||0,deviceMemory:navigator.deviceMemory||0,hardwareConcurrency:navigator.hardwareConcurrency||0};
  const gpuName=`${adapterInfo.vendor} ${adapterInfo.architecture} ${adapterInfo.device} ${adapterInfo.description}`;const discrete=/geforce|nvidia|radeon\s*rx|\brx\s*\d|intel\s*arc|arc\s*a\d|arc\s*b\d/i.test(gpuName),integrated=/intel|uhd|iris|radeon graphics|vega|apple/i.test(gpuName);const constrained=(navigator.deviceMemory>0&&navigator.deviceMemory<=8)||(navigator.hardwareConcurrency>0&&navigator.hardwareConcurrency<=6)||(limits.maxStorageBufferBindingSize>0&&limits.maxStorageBufferBindingSize<256*1024*1024);gpuTier=!discrete&&(integrated||constrained)?'integrated':'standard';
  renderer=new GPU.WebGPURenderer({canvas,antialias:true,alpha:false,powerPreference:'low-power'});await renderer.init();
  if(!renderer.backend.isWebGPUBackend)throw new Error('WebGPU 初始化未成功');backend='webgpu';
  renderer.capabilities={getMaxAnisotropy:()=>renderer.getMaxAnisotropy()};
} catch(error) {
  reason=error.message;renderer?.dispose();const fresh=canvas.cloneNode(false);canvas.replaceWith(fresh);canvas=fresh;
  renderer=new WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'low-power'});
}
const namespace={...GPU};namespace.PMREMGenerator=backend==='webgpu'?GPU.PMREMGenerator:GLPMREM;namespace.WebGLRenderTarget=backend==='webgpu'?GPU.RenderTarget:WebGLRenderTarget;
window.THREE=namespace;
window.B1_ENGINE={version,renderer,backend,webgpu:backend==='webgpu',reason,revision:GPU.REVISION,adapterInfo,gpuProfile:{tier:backend==='webgpu'?gpuTier:'compatibility',recommendedQuality:backend==='webgpu'&&gpuTier==='integrated'?'low':'high'},quality:'balanced',adapterVerified:backend==='webgpu',status,ready:false};
status.textContent=backend==='webgpu'?(gpuTier==='integrated'?'WebGPU · 整合 GPU 省電模式':'WebGPU · 啟動中'):'WebGL2 相容模式';status.title=backend==='webgpu'?`WebGPU 已啟動；優先使用低功耗 GPU（${adapterInfo.vendor||'GPU'}）`:reason;status.dataset.backend=backend;status.dataset.gpuTier=backend==='webgpu'?gpuTier:'compatibility';
if(backend==='webgpu')renderer.backend.device.lost.then(info=>{if(info.reason==='destroyed')return;B1_ENGINE.ready=false;status.textContent='GPU 連線中斷';const retry=document.createElement('button');retry.textContent='重新啟動畫面';retry.onclick=()=>location.reload();status.append(retry);});
const script=document.createElement('script');script.src='studio.js?v='+version;script.onerror=()=>{status.textContent='空間載入失敗，請重新整理';};document.body.append(script);
