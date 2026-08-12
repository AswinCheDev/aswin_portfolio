import{j as g,w as e,E as H,x as N,L as O}from"./index-Doj5qgXu.js";import{E as U}from"./external-link-CYE2DVGx.js";const V=`
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,W=`
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_colorBottom;
uniform vec3 u_colorMid;
uniform vec3 u_colorTop;
uniform float u_speed;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p, float t) {
  float v = 0.0;
  float a = 0.5;
  float fi = 0.0;
  mat2 rot = mat2(0.86, 0.51, -0.51, 0.86);
  
  for (int i = 0; i < 6; i++) {
    vec2 morph = vec2(sin(t * 0.5 + fi), cos(t * 0.3 - fi)) * 0.05;
    v += a * noise(p + morph);
    p = rot * p * 2.0;
    a *= 0.5;
    fi += 1.0;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float t = u_time * u_speed;
  vec2 aspect = vec2(u_resolution.x / max(u_resolution.y, 1.0), 1.0);
  vec2 p = (uv - 0.5) * aspect;

  vec2 wind = vec2(t * 0.1, t * 0.02);

  float pattern = fbm(p * 2.2 - wind, t);

  float bandLow = smoothstep(0.3, 0.65, pattern);
  float bandHigh = smoothstep(0.7, 0.95, pattern); 
  
  vec3 color = mix(u_colorBottom, u_colorMid, bandLow);
  color = mix(color, u_colorTop, bandHigh);

  gl_FragColor = vec4(color, 1.0);
}
`,X="#0d1117",J=/^#?[0-9a-fA-F]{6}$/;function Q(r,s){const i=r.trim();return J.test(i)?i.startsWith("#")?i:`#${i}`:s}function L(r){const s=Q(r,X).replace("#",""),i=parseInt(s.slice(0,2),16)/255,d=parseInt(s.slice(2,4),16)/255,o=parseInt(s.slice(4,6),16)/255;return[i,d,o]}const q=({colorBottom:r="#87ceeb",colorMid:s="#f8f8f8",colorTop:i="#ffffff",speed:d=1,height:o="100vh",className:c,style:m,children:v,...D})=>{const k=g.useRef(null),T=g.useRef(null),f=g.useMemo(()=>({colorBottom:r,colorMid:s,colorTop:i,speed:d}),[r,s,i,d]);return g.useEffect(()=>{const l=k.current,b=T.current;if(!l||!b)return;const t=l.getContext("webgl",{antialias:!0,alpha:!0});if(!t){console.error("WebGL not supported");return}const A=(h,x)=>{const a=t.createShader(h);return a?(t.shaderSource(a,x),t.compileShader(a),t.getShaderParameter(a,t.COMPILE_STATUS)?a:(console.error("Shader compile error:",t.getShaderInfoLog(a)),t.deleteShader(a),null)):null},p=A(t.VERTEX_SHADER,V),u=A(t.FRAGMENT_SHADER,W);if(!p||!u)return;const n=t.createProgram();if(!n)return;if(t.attachShader(n,p),t.attachShader(n,u),t.linkProgram(n),!t.getProgramParameter(n,t.LINK_STATUS)){console.error("Program link error:",t.getProgramInfoLog(n)),t.deleteProgram(n),t.deleteShader(p),t.deleteShader(u);return}t.useProgram(n);const R=t.getAttribLocation(n,"position"),j=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,j),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),t.STATIC_DRAW),t.enableVertexAttribArray(R),t.vertexAttribPointer(R,2,t.FLOAT,!1,0,0);const I=t.getUniformLocation(n,"u_resolution"),_=t.getUniformLocation(n,"u_time"),M=t.getUniformLocation(n,"u_colorBottom"),P=t.getUniformLocation(n,"u_colorMid"),E=t.getUniformLocation(n,"u_colorTop"),B=t.getUniformLocation(n,"u_speed");if(!I||!_||!M||!P||!E||!B){t.deleteBuffer(j),t.deleteProgram(n),t.deleteShader(p),t.deleteShader(u);return}const F=()=>{const h=Math.min(window.devicePixelRatio||1,2),{width:x,height:a}=b.getBoundingClientRect();l.width=Math.max(1,Math.floor(x*h)),l.height=Math.max(1,Math.floor(a*h)),t.viewport(0,0,l.width,l.height),t.uniform2f(I,l.width,l.height)};F();const C=new ResizeObserver(F);C.observe(b);let w=0;const z=performance.now(),G=h=>{const x=(h-z)/1e3,a=L(f.colorBottom),y=L(f.colorMid),S=L(f.colorTop);t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),t.uniform1f(_,x),t.uniform3f(M,a[0],a[1],a[2]),t.uniform3f(P,y[0],y[1],y[2]),t.uniform3f(E,S[0],S[1],S[2]),t.uniform1f(B,f.speed),t.drawArrays(t.TRIANGLE_STRIP,0,4),w=requestAnimationFrame(G)};return w=requestAnimationFrame(G),()=>{cancelAnimationFrame(w),C.disconnect(),t.deleteBuffer(j),t.deleteProgram(n),t.deleteShader(p),t.deleteShader(u)}},[f]),e.jsxs("div",{ref:T,className:H("absolute inset-0 z-[-1] overflow-hidden",c),style:{...m},...D,children:[e.jsx("canvas",{ref:k,"aria-hidden":"true",className:"pointer-events-none absolute inset-0 h-full w-full",style:{width:"100%",height:"100%",display:"block"}}),v]})},$=()=>{const r=[{role:"Full Stack Developer Intern",company:"Euphoria GenX",location:"Kolkata, West Bengal",period:"Jan 2026 – June 2026",project:"GovVision - Digital Decision & Governance Platform",projectLink:"/projects",techStack:"Node.js, Express, FastAPI, React, MongoDB, Redis, Python",points:["Developed the Analytics, Reporting, and ML Monitoring module of GovVision, a microservices based observability layer","Built and deployed an Isolation Forest anomaly detection pipeline trained on 31,509 governance records, serving real-time predictions through a FastAPI endpoint that flagged 146 anomalies (5.8%) across 2,500 live decisions.","Trained a Random Forest classifier and Prophet forecasting pipeline for departmental risk scoring and delay prediction across departments, achieving a 12.03% org-level MAPE.","Implemented an automated report generation engine scheduled through node-cron, and secured with JWT based RBAC restricting sensitive routes."]}],s=[{degree:"Masters of Computer Applications",institution:"Sikkim Manipal Institute of Technology",location:"Majitar, Rangpo, Sikkim",period:"2024 - 2026",logo:"/edu/uni.png"},{degree:"Bachelor of Computer Applications",institution:"Sikkim Manipal Institute of Technology",location:"Majitar, Rangpo, Sikkim",period:"2021 - 2024",logo:"/edu/uni.png"},{degree:"Class XII",institution:"Greendale Senior Secondary School, CBSE",location:"Tadong, Gangtok, Sikkim",period:"2021",logo:"/edu/school.png"},{degree:"Class X",institution:"Greendale Senior Secondary School, CBSE",location:"Tadong, Gangtok, Sikkim",period:"2019",logo:"/edu/school.png"}],i=[{name:"Complete Web Development Course - 2025",issuer:"by Hitesh Choudhary - Full-stack development with modern technologies",description:"Frontend: HTML, CSS, Tailwind, JavaScript, React, Next.js | Backend: Node.js, Express, Prisma, Drizzle | Databases: MongoDB, PostgreSQL, MySQL, NeonDB | State Management: Redux, Redux Toolkit, Zustand | AI/ML: TensorFlow.js, LangChain | Tools & Deployment: Git/GitHub, Docker, VPS/server deployment.."}],d=["Football","Table Tennis","Gaming","Gym","Movies","New Technology","Large Language Model","Artificial Intelligence"];return e.jsxs("section",{id:"about",className:"min-h-screen flex items-center px-6 py-20 relative overflow-hidden text-slate-900",children:[e.jsx("div",{className:"absolute top-8 left-8 text-sm font-bold tracking-widest text-slate-800/50 uppercase z-20 font-mono pointer-events-none",children:"Naboo"}),e.jsx("div",{className:"absolute inset-0 z-[-1]",children:e.jsx(q,{})}),e.jsxs("div",{className:"max-w-[70rem] mx-auto w-full relative z-10",children:[e.jsx(N.div,{initial:{opacity:0,y:-20},whileInView:{opacity:1,y:0},viewport:{once:!0},transition:{duration:.6},className:"w-full flex flex-col items-center justify-center text-center mb-10",children:e.jsx("h2",{className:"text-3xl md:text-4xl font-bold mb-3 display-heading text-slate-900 uppercase text-center",children:"About Me"})}),e.jsx(N.div,{initial:{opacity:0,y:30},whileInView:{opacity:1,y:0},viewport:{once:!0},transition:{duration:.6},children:e.jsxs("div",{className:"space-y-16 p-2 sm:p-4 w-full text-slate-900",children:[e.jsx("div",{children:e.jsxs("div",{className:"text-slate-800 leading-relaxed space-y-4 text-lg font-medium",children:[e.jsx("p",{children:"I'm a Full Stack Developer who recently completed my Master of Computer Applications at Sikkim Manipal Institute of Technology, based out of the beautiful hills of Gangtok, Sikkim. My current tech stack that I'm hands-on with includes React, TypeScript, Python, JavaScript, MongoDB, SQL, and a few others."}),e.jsx("p",{children:"Technology has had my attention since long before I knew what a semicolon was for, back when Python was just a snake to me. I'm an explorer of new technologies and an avid learner, deep into what's happening in the world of artificial intelligence and machine learning. I'm also very interested in UI/UX. I'm always building something, whether it's a personal project or an experiment, and always learning along the way."}),e.jsx("p",{children:"Besides all the tech-related stuff, I'm a huge football fan; Glory Glory Man United!!! I'm also into Star Wars and Hip Hop, and I occasionally write about it all."})]})}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-[20px] font-bold text-slate-900 mb-4 flex items-center gap-2 uppercase",children:"Experience"}),e.jsx("div",{className:"space-y-6",children:r.map((o,c)=>e.jsxs("div",{children:[e.jsxs("div",{className:"flex flex-col md:flex-row md:items-baseline justify-between mb-3 gap-2",children:[e.jsxs("div",{children:[e.jsxs("h4",{className:"font-bold text-xl text-slate-900 leading-tight mb-1",children:[o.company," - ",o.role]}),e.jsx("p",{className:"text-slate-700 text-lg font-semibold",children:o.location})]}),e.jsx("span",{className:"text-lg text-slate-600 font-bold whitespace-nowrap",children:o.period})]}),e.jsxs("div",{className:"mb-4",children:[o.projectLink.startsWith("/")?e.jsxs(O,{to:o.projectLink,className:"inline-flex items-center text-lg font-bold text-slate-900 hover:text-blue-700 transition-colors",children:[o.project," ",e.jsx(U,{className:"w-4 h-4 ml-1.5"})]}):e.jsxs("a",{href:o.projectLink,target:"_blank",rel:"noopener noreferrer",className:"inline-flex items-center text-lg font-bold text-slate-900 hover:text-blue-700 transition-colors",children:[o.project," ",e.jsx(U,{className:"w-4 h-4 ml-1.5"})]}),e.jsx("p",{className:"text-lg text-slate-700 font-semibold mt-2 font-mono block",children:o.techStack})]}),e.jsx("ul",{className:"space-y-2",children:o.points.map((m,v)=>e.jsxs("li",{className:"text-lg text-slate-800 font-medium flex items-start",children:[e.jsx("span",{className:"mr-2 text-slate-500 mt-0.5",children:"•"}),e.jsx("span",{className:"leading-relaxed",children:m})]},v))})]},c))})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-[20px] font-bold text-slate-900 mb-4 flex items-center gap-2 uppercase",children:"Education"}),e.jsx("div",{className:"space-y-6",children:s.map((o,c)=>e.jsxs("div",{className:"flex items-center gap-5 relative overflow-hidden w-full",children:[o.logo&&e.jsx("div",{className:"shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center overflow-hidden relative z-10",children:e.jsx("img",{src:o.logo,alt:o.institution,className:"w-full h-full object-contain p-2",onError:m=>{m.currentTarget.style.display="none",m.currentTarget.parentElement.style.display="none"}})}),e.jsxs("div",{className:"relative z-10 flex-1 flex justify-between items-baseline",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"font-bold text-xl text-slate-900 leading-tight mb-1",children:o.degree}),e.jsx("h4",{className:"font-bold text-xl text-slate-900 leading-tight",children:o.institution}),e.jsx("p",{className:"text-slate-700 text-lg font-semibold",children:o.location})]}),e.jsx("span",{className:"text-lg text-slate-600 font-bold whitespace-nowrap ml-4 shrink-0",children:o.period})]})]},c))})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-[20px] font-bold text-slate-900 mb-4 uppercase",children:"Certifications"}),e.jsx("div",{className:"space-y-6",children:i.map((o,c)=>e.jsxs("div",{children:[e.jsx("h4",{className:"font-bold text-xl mb-1 text-slate-900",children:o.name}),e.jsx("p",{className:"text-slate-800 text-lg mb-1 font-medium",children:o.issuer}),e.jsx("p",{className:"text-slate-700 text-lg mt-1.5 font-medium",children:o.description})]},c))})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-[20px] font-bold text-slate-900 mb-4 uppercase",children:"Areas of Interest & Hobbies"}),e.jsx("div",{className:"flex flex-wrap gap-2.5",children:d.map(o=>e.jsx(N.span,{whileHover:{scale:1.05},className:"pr-4 pb-2 text-lg font-bold text-slate-800",children:o},o))})]})]})})]})]})};export{$ as About};
