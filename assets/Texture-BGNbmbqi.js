import{c as x,A as T,G as f,az as n,E as o,T as u}from"./index-C_LCn-lF.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=x("MapPin",[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]),i=e=>e===Object(e)&&!Array.isArray(e)&&typeof e!="function";function l(e,a){const c=T(t=>t.gl),r=f(n,i(e)?Object.values(e):e);return o.useLayoutEffect(()=>{a==null||a(r)},[a]),o.useEffect(()=>{if("initTexture"in c){let t=[];Array.isArray(r)?t=r:r instanceof u?t=[r]:i(r)&&(t=Object.values(r)),t.forEach(s=>{s instanceof u&&c.initTexture(s)})}},[c,r]),o.useMemo(()=>{if(i(e)){const t={};let s=0;for(const y in e)t[y]=r[s++];return t}else return r},[e,r])}l.preload=e=>f.preload(n,e);l.clear=e=>f.clear(n,e);export{A as M,l as u};
