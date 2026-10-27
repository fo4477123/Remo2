/* Local pedestrian approach routing around mapped footprints; all coordinates are metres. */
(() => {
  function connect(from,to,clear,options={}){
    const line=(a,b)=>{const n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.65));for(let i=0;i<=n;i++){const t=i/n;if(!clear([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]))return false;}return true;};
    if(line(from,to))return [from,to];
    for(const margin of [30,90]){const step=options.coarse&&Math.hypot(to[0]-from[0],to[1]-from[1])>400?5:2,x0=Math.floor((Math.min(from[0],to[0])-margin)/step)*step,y0=Math.floor((Math.min(from[1],to[1])-margin)/step)*step,cols=Math.ceil((Math.abs(from[0]-to[0])+2*margin)/step)+1,rows=Math.ceil((Math.abs(from[1]-to[1])+2*margin)/step)+1;if(cols*rows>160000)continue;
      const points=new Map(),cost=new Map(),previous=new Map(),heap=[],closed=new Set(),freeCache=new Map(),xy=id=>[x0+(id%cols)*step,y0+Math.floor(id/cols)*step],available=id=>{if(!freeCache.has(id))freeCache.set(id,clear(xy(id)));return freeCache.get(id);};
      const push=value=>{heap.push(value);let i=heap.length-1;while(i){const p=(i-1)>>1;if(heap[p].f<=value.f)break;heap[i]=heap[p];i=p;}heap[i]=value;},pop=()=>{const first=heap[0],last=heap.pop();if(heap.length){let i=0;while(true){let c=i*2+1;if(c>=heap.length)break;if(c+1<heap.length&&heap[c+1].f<heap[c].f)c++;if(heap[c].f>=last.f)break;heap[i]=heap[c];i=c;}heap[i]=last;}return first;};
      const sx=Math.round((from[0]-x0)/step),sy=Math.round((from[1]-y0)/step);for(let dx=-2;dx<=2;dx++)for(let dy=-2;dy<=2;dy++){const x=sx+dx,y=sy+dy;if(x<0||x>=cols||y<0||y>=rows)continue;const id=y*cols+x,p=xy(id);if(available(id)&&line(from,p)){const g=Math.hypot(p[0]-from[0],p[1]-from[1]);cost.set(id,g);previous.set(id,null);push({id,f:g+Math.hypot(p[0]-to[0],p[1]-to[1])});}}
      let end=null;for(let guard=0;heap.length&&guard<120000;guard++){const current=pop().id;if(closed.has(current))continue;closed.add(current);const p=xy(current);if(Math.hypot(p[0]-to[0],p[1]-to[1])<=step*2&&line(p,to)){end=current;break;}const x=current%cols,y=Math.floor(current/cols);for(const [dx,dy]of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=cols||ny>=rows)continue;const next=ny*cols+nx;if(closed.has(next)||!available(next)||!line(p,xy(next)))continue;const g=cost.get(current)+step*Math.hypot(dx,dy);if(g>=(cost.get(next)??Infinity))continue;cost.set(next,g);previous.set(next,current);const q=xy(next);push({id:next,f:g+Math.hypot(q[0]-to[0],q[1]-to[1])});}}
      if(end!==null){const path=[to];for(let id=end;id!==null;id=previous.get(id))path.unshift(xy(id));path.unshift(from);const smooth=[path[0]];for(let i=0;i<path.length-1;){let j=path.length-1;while(j>i+1&&!line(path[i],path[j]))j--;smooth.push(path[j]);i=j;}return smooth;}
    }
    return null;
  }
  const api={connect};if(typeof module!=='undefined'&&module.exports)module.exports=api;else window.B1_A18_ROUTING=api;
})();
