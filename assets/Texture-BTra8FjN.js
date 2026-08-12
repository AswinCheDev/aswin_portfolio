import{H as x,C as p,ap as f,a_ as n,j as o,ac as u}from"./index-C2fMKLn-.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=x("MapPin",[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]),i=e=>e===Object(e)&&!Array.isArray(e)&&typeof e!="function";function l(e,s){const c=p(t=>t.gl),r=f(n,i(e)?Object.values(e):e);return o.useLayoutEffect(()=>{s==null||s(r)},[s]),o.useEffect(()=>{if("initTexture"in c){let t=[];Array.isArray(r)?t=r:r instanceof u?t=[r]:i(r)&&(t=Object.values(r)),t.forEach(a=>{a instanceof u&&c.initTexture(a)})}},[c,r]),o.useMemo(()=>{if(i(e)){const t={};let a=0;for(const y in e)t[y]=r[a++];return t}else return r},[e,r])}l.preload=e=>f.preload(n,e);l.clear=e=>f.clear(n,e);export{j as M,l as u};
