import{c as j,E as n,aa as z,a0 as e,bl as S,f as g,bm as k,P as N,Z as w,bn as P,ae as y}from"./index-CZNxMUQ6.js";import{C as D}from"./StarField-CAC4WrqA.js";import{PageTransitionContext as M}from"./Index-B8xnF_eh.js";import{S as I}from"./SubstackIcon-B0QuqV8U.js";import{E as F}from"./external-link-CK83eJND.js";import{C as R}from"./clock-Cx8lOaI_.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T=j("Calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]),A=`
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

// 3D Noise for terrain
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main() {
  vUv = uv;
  
  // Speed of forward motion
  float speed = 25.0;
  float scroll = uTime * speed;
  
  // Calculate elevation using scrolled Y coordinate (which is world Z)
  float lowFreq = snoise(vec3(position.x * 0.015, (position.y + scroll) * 0.015, 0.0)) * 14.0;
  float highFreq = snoise(vec3(position.x * 0.1, (position.y + scroll) * 0.1, 0.0)) * 1.0;
  float elevation = lowFreq + highFreq; 
  
  vec3 newPosition = position;
  newPosition.z += elevation; 
  
  // Central Difference for extremely smooth and accurate normals
  float delta = 0.5;
  
  float n_right_low = snoise(vec3((position.x + delta) * 0.015, (position.y + scroll) * 0.015, 0.0)) * 14.0;
  float n_right_high = snoise(vec3((position.x + delta) * 0.1, (position.y + scroll) * 0.1, 0.0)) * 1.0;
  float n_right = n_right_low + n_right_high;
  
  float n_left_low = snoise(vec3((position.x - delta) * 0.015, (position.y + scroll) * 0.015, 0.0)) * 14.0;
  float n_left_high = snoise(vec3((position.x - delta) * 0.1, (position.y + scroll) * 0.1, 0.0)) * 1.0;
  float n_left = n_left_low + n_left_high;
  
  float n_up_low = snoise(vec3(position.x * 0.015, (position.y + delta + scroll) * 0.015, 0.0)) * 14.0;
  float n_up_high = snoise(vec3(position.x * 0.1, (position.y + delta + scroll) * 0.1, 0.0)) * 1.0;
  float n_up = n_up_low + n_up_high;
  
  float n_down_low = snoise(vec3(position.x * 0.015, (position.y - delta + scroll) * 0.015, 0.0)) * 14.0;
  float n_down_high = snoise(vec3(position.x * 0.1, (position.y - delta + scroll) * 0.1, 0.0)) * 1.0;
  float n_down = n_down_low + n_down_high;
  
  float dfdx = (n_right - n_left) / (2.0 * delta);
  float dfdy = (n_up - n_down) / (2.0 * delta);
  vNormal = normalize(vec3(-dfdx, -dfdy, 1.0));
  vNormal = normalize(normalMatrix * vNormal);

  vPosition = (modelMatrix * vec4(newPosition, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`,E=`
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  // Dusty, arid sand/rock color
  vec3 baseColor = vec3(0.7, 0.5, 0.3); 
  
  // Sun direction (Daytime lighting)
  vec3 lightDir = normalize(vec3(0.5, 1.0, -0.5));
  
  // Re-normalize the interpolated vertex normal
  vec3 normal = normalize(vNormal);
  float diff = max(dot(normal, lightDir), 0.0);
  
  // Add some shadowing in crevices
  vec3 shadowColor = vec3(0.3, 0.2, 0.1);
  vec3 finalColor = mix(shadowColor, baseColor, smoothstep(0.0, 1.0, diff));
  
  // Aggressive distance fog to hide pop-in and simulate dust kicked up by speed
  float distance = length(vPosition);
  float fogFactor = smoothstep(20.0, 150.0, distance);
  vec3 fogColor = vec3(0.8, 0.65, 0.45); // Dusty atmosphere color
  finalColor = mix(finalColor, fogColor, fogFactor);
  
  gl_FragColor = vec4(finalColor, 1.0);
}
`,L=()=>{const a=n.useRef(null),c=n.useRef(null),d=n.useRef(0),t=n.useMemo(()=>new N(400,400,256,256),[]);return w((s,l)=>{a.current&&(d.current+=l,a.current.uniforms.uTime.value=d.current)}),e.jsx("mesh",{ref:c,geometry:t,rotation:[-Math.PI/2,0,0],position:[0,-8,-50],children:e.jsx("shaderMaterial",{ref:a,vertexShader:A,fragmentShader:E,uniforms:{uTime:{value:0}}})})},G=`
varying vec3 vWorldPosition;
void main() {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,U=`
varying vec3 vWorldPosition;
uniform vec3 uSun1Pos;
uniform vec3 uSun2Pos;

void main() {
  vec3 viewDirection = normalize(vWorldPosition);
  
  // Daytime dusty sky
  float elevation = max(viewDirection.y, 0.0);
  vec3 zenithColor = vec3(0.3, 0.5, 0.7); // Bright blue
  vec3 horizonColor = vec3(0.8, 0.65, 0.45); // Dusty tan/orange at horizon
  
  vec3 skyColor = mix(horizonColor, zenithColor, pow(elevation, 0.6));
  
  vec3 finalColor = skyColor;
  
  // Sun 1 (Tatoo I - Large, Yellow-White)
  vec3 s1Dir = normalize(uSun1Pos);
  float s1Dist = distance(viewDirection, s1Dir);
  float s1Glow = smoothstep(0.4, 0.0, s1Dist);
  float s1Core = smoothstep(0.08, 0.07, s1Dist); 
  vec3 s1Color = vec3(1.0, 0.9, 0.7) * s1Glow * 1.5 + vec3(1.0, 1.0, 0.9) * s1Core * 2.0;
  
  // Sun 2 (Tatoo II - Smaller, Orange-Red)
  vec3 s2Dir = normalize(uSun2Pos);
  float s2Dist = distance(viewDirection, s2Dir);
  float s2Glow = smoothstep(0.3, 0.0, s2Dist);
  float s2Core = smoothstep(0.05, 0.04, s2Dist); 
  vec3 s2Color = vec3(1.0, 0.5, 0.2) * s2Glow * 1.5 + vec3(1.0, 0.8, 0.6) * s2Core * 2.0;
  
  finalColor += s1Color + s2Color;
  
  gl_FragColor = vec4(finalColor, 1.0);
}
`,W=()=>e.jsxs("mesh",{children:[e.jsx("sphereGeometry",{args:[300,32,32]}),e.jsx("shaderMaterial",{vertexShader:G,fragmentShader:U,side:k,uniforms:{uSun1Pos:{value:new g(40,30,-100)},uSun2Pos:{value:new g(10,25,-120)}},depthWrite:!1})]}),B=()=>{const a=n.useRef(null),c=2e3,d=n.useMemo(()=>{const t=new Float32Array(c*3);for(let s=0;s<c;s++)t[s*3]=(Math.random()-.5)*100,t[s*3+1]=(Math.random()-.5)*20+5,t[s*3+2]=(Math.random()-.5)*200-50;return t},[]);return w((t,s)=>{if(!a.current)return;const l=a.current.geometry.attributes.position.array,m=40;for(let o=0;o<c;o++){const r=o*3;l[r+2]+=m*s,l[r+2]>20&&(l[r+2]=-200+Math.random()*20,l[r]=(Math.random()-.5)*100,l[r+1]=(Math.random()-.5)*20+5)}a.current.geometry.attributes.position.needsUpdate=!0}),e.jsxs("points",{ref:a,children:[e.jsx("bufferGeometry",{children:e.jsx("bufferAttribute",{attach:"attributes-position",count:c,array:d,itemSize:3})}),e.jsx("pointsMaterial",{size:.2,color:"#ffffff",transparent:!0,opacity:.3,blending:P,depthWrite:!1,onBeforeCompile:t=>{t.fragmentShader=t.fragmentShader.replace("#include <clipping_planes_fragment>",`
            #include <clipping_planes_fragment>
            if (length(gl_PointCoord - vec2(0.5)) > 0.5) discard;
            `)}})]})},V=({isActive:a=!0})=>{const[c,d]=n.useState(0),t=n.useContext(z),s=n.useContext(M),l=t==="portfolio"&&!s;return e.jsxs("div",{className:"absolute inset-0 w-full h-full overflow-hidden bg-[#ccaa88] pointer-events-none",children:[l&&e.jsxs(D,{className:"absolute inset-0",camera:{position:[0,2,10],fov:60},frameloop:a?"always":"demand",gl:{antialias:!0,toneMapping:S,toneMappingExposure:1,powerPreference:"default"},onCreated:({gl:m})=>{const o=m.domElement;o.addEventListener("webglcontextlost",r=>{r.preventDefault(),console.warn("PodraceBackground: WebGL context lost. Attempting to restore...")},!1),o.addEventListener("webglcontextrestored",()=>{console.log("PodraceBackground: WebGL context restored."),d(r=>r+1)},!1)},children:[e.jsx(W,{}),e.jsx(L,{}),e.jsx(B,{})]},`podrace-canvas-${c}`),e.jsx("div",{className:"absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-[#050201] opacity-60 pointer-events-none"})]})},J=()=>{const[a,c]=n.useState([]),[d,t]=n.useState(!0),s=n.useRef(null),[l,m]=n.useState(!0);return n.useEffect(()=>{const o=new IntersectionObserver(x=>{m(x[0].isIntersecting)},{threshold:.05});return s.current&&o.observe(s.current),(async()=>{try{const f=await(await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent("https://aswinchettri.substack.com/feed")}`)).json();if(f.status==="ok"){const b=f.items.slice(0,6).map(i=>{var h,p;let v=i.thumbnail;if(!v&&i.enclosure&&i.enclosure.link&&(v=i.enclosure.link),!v){const u=((h=i.content)==null?void 0:h.match(/<img[^>]+src="([^">]+)"/))||((p=i.description)==null?void 0:p.match(/<img[^>]+src="([^">]+)"/));u&&(v=u[1])}const _=i.description.replace(/<[^>]+>/g,"").replace(/&nbsp;/g," ").substring(0,120)+"...",C=new Date(i.pubDate).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});return{id:i.guid,title:i.title,excerpt:_,date:C,readTime:"5 min read",link:i.link,image:v?`url(${v}) center/cover no-repeat`:"linear-gradient(to right, #ff7e5f, #feb47b)",source:"Substack",sourceColor:"from-[#ff6719] to-[#ff985c]",tags:i.categories&&i.categories.length>0?i.categories.slice(0,3):["Article"]}});c(b)}}catch(x){console.error("Failed to fetch Substack feed:",x)}finally{t(!1)}})(),()=>o.disconnect()},[]),e.jsxs("section",{ref:s,id:"blog",className:"min-h-screen flex px-6 pt-8 pb-20 relative",children:[e.jsx(V,{isActive:l}),e.jsx("div",{className:"absolute top-8 left-8 text-sm font-bold tracking-widest text-muted-foreground/50 uppercase z-20 font-mono pointer-events-none",children:"Tatooine"}),e.jsxs("div",{className:"w-full h-full z-10",children:[e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-16",children:d?Array.from({length:4}).map((o,r)=>e.jsx("div",{className:"blog-card flex flex-col bg-card/10 animate-pulse rounded-xl border border-white/5 overflow-hidden max-w-[252px]",children:e.jsx("div",{className:"h-[203px] w-full bg-white/5 relative",children:e.jsxs("div",{className:"absolute bottom-4 left-4 right-4 flex flex-col gap-3",children:[e.jsx("div",{className:"h-5 w-full bg-white/10 rounded"}),e.jsx("div",{className:"h-5 w-2/3 bg-white/10 rounded"}),e.jsxs("div",{className:"flex space-x-4 mt-2",children:[e.jsx("div",{className:"h-3 w-16 bg-white/10 rounded"}),e.jsx("div",{className:"h-3 w-16 bg-white/10 rounded"})]})]})})},r)):a.map((o,r)=>e.jsx(y.div,{initial:{opacity:0,y:30},whileInView:{opacity:1,y:0},viewport:{once:!0},transition:{delay:r*.1,duration:.5},whileHover:{y:-8},className:"blog-card flex flex-col overflow-hidden hover-glow transition-smooth group relative z-10 rounded-xl bg-card/5 backdrop-blur-sm border border-white/10 max-w-[252px]",children:e.jsxs("div",{className:"h-[203px] w-full relative overflow-hidden",style:{background:o.image},children:[e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 transition-opacity group-hover:opacity-100"}),e.jsx("div",{className:`absolute top-4 right-4 p-1.5 rounded-full bg-gradient-to-r ${o.sourceColor} shadow-lg flex items-center justify-center z-10 transition-transform hover:scale-110`,title:o.source,children:e.jsx(I,{className:"w-2.5 h-2.5 text-white"})}),e.jsxs("div",{className:"absolute bottom-4 left-4 right-4 flex flex-col z-10",children:[e.jsx("h3",{className:"text-base font-bold mb-3 group-hover:text-primary transition-colors leading-tight text-white shadow-sm line-clamp-3",children:e.jsxs("a",{href:o.link,target:"_blank",rel:"noopener noreferrer",className:"flex items-start",children:[o.title,e.jsx(F,{className:"w-4 h-4 ml-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-white/70"})]})}),e.jsxs("div",{className:"flex items-center text-xs text-white/80 space-x-4",children:[e.jsxs("span",{className:"flex items-center drop-shadow-md",children:[e.jsx(T,{className:"w-3 h-3 mr-1"})," ",o.date]}),e.jsxs("span",{className:"flex items-center drop-shadow-md",children:[e.jsx(R,{className:"w-3 h-3 mr-1"})," ",o.readTime]})]})]})]})},o.id))}),e.jsx(y.div,{initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:!0},transition:{duration:.6},className:"absolute bottom-4 left-0 w-full text-center pointer-events-none z-10",children:e.jsx("h2",{className:"text-lg md:text-xl font-bold display-heading text-white/50 max-w-4xl mx-auto leading-tight",children:"Some technical and non technical blogs I have written"})})]})]})};export{J as Blog};
