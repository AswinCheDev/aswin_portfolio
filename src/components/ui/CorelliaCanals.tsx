import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
varying vec2 vUv;

// Classic Perlin 3D Noise by Stefan Gustavson
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}

float fbm(vec3 p) {
    float f = 0.0;
    float w = 0.5;
    for (int i = 0; i < 5; i++) {
        f += w * cnoise(p);
        p *= 2.0;
        w *= 0.5;
    }
    return f;
}

void main() {
    vec2 p = vUv * 2.0 - 1.0;
    p.x *= uResolution.x / uResolution.y;

    float horizon = 0.45; // Horizon at 45% from the bottom (vUv.y ranges from 0 to 1)
    float y = vUv.y;
    
    vec3 color = vec3(0.0);
    
    // Stormy / Steel Colors
    vec3 skyColor = vec3(0.45, 0.5, 0.55); // Steel grey
    vec3 stormColor = vec3(0.15, 0.2, 0.25); // Darker storm clouds
    
    // Water Colors
    vec3 waterDeep = vec3(0.07, 0.1, 0.15); // A bit brighter than pitch dark
    vec3 waterHighlight = vec3(0.3, 0.35, 0.45); // Brighter reflections
    vec3 waveCrest = vec3(0.65, 0.75, 0.85); // Brighter peaks for visibility
    
    // Global Time for animations
    float t = uTime * 1.0;

    // --- LIGHTNING EFFECT ---
    // A sudden sharp flash based on time and high frequency noise
    float flashNoise = fbm(vec3(uTime * 5.0, 0.0, 0.0));
    float lightning = step(0.98, flashNoise) * (flashNoise - 0.98) * 50.0;
    // Diminish lightning effect near the camera for realism
    
    if (y > horizon) {
        // --- SKY & CLOUDS ---
        // Multiple layers of clouds for depth
        float cloudBase = fbm(vec3(p.x * 1.5, p.y * 1.5 - t * 0.05, t * 0.04));
        float cloudDetail = fbm(vec3(p.x * 4.0 + t * 0.02, p.y * 3.0, t * 0.08));
        float highClouds = fbm(vec3(p.x * 8.0, p.y * 8.0 - t * 0.1, t * 0.02));
        
        float finalClouds = cloudBase * 0.6 + cloudDetail * 0.3 + highClouds * 0.1;
        
        // Add turbulent stormy look
        color = mix(stormColor, skyColor, smoothstep(-0.4, 0.7, finalClouds));
        
        // Apply lightning flash to clouds (scattered light in the storm)
        color += vec3(0.8, 0.85, 0.9) * lightning * smoothstep(-0.2, 0.8, cloudBase) * 1.5;
        
        // Add thick fog bank near horizon
        float fogAmount = smoothstep(1.0, horizon, y);
        color = mix(color, mix(vec3(0.35, 0.4, 0.45), vec3(0.8, 0.85, 0.9), lightning * 0.5), fogAmount * 0.9);
        
        // Heavy rain shafts
        float rain = fbm(vec3(p.x * 80.0 + p.y * 30.0 + t * 15.0, p.y * 60.0, 0.0));
        float rainMask = smoothstep(0.4, 0.8, cloudBase); // Rain only falls from thick clouds
        color += vec3(0.15, 0.2, 0.25) * smoothstep(0.6, 1.0, rain) * rainMask * 0.2;

    } else {
        // --- DEEP OCEAN WATER ---
        float depth = 1.0 / (horizon - y + 0.05); // Smoother perspective for larger ocean
        // Extremely fast forward panning motion (using + instead of - to fly forwards)
        vec2 waterUv = vec2(p.x * depth, depth + t * 4.0); 
        
        // Complex water ripples (3 layers) with scaled coordinates for speed
        float swell = fbm(vec3(waterUv * 0.6, t * 0.5));
        float ripples = fbm(vec3(waterUv * 2.0 - vec2(t * 1.0, 0.0), t * 1.0));
        float microRipples = fbm(vec3(waterUv * 6.0, t * 1.5));
        
        float combinedWater = swell * 0.5 + ripples * 0.35 + microRipples * 0.15;
        
        // Calculate normal-like slope for specular highlights
        float slope = fbm(vec3(waterUv * 2.0 + vec2(0.01, 0.0), t * 1.0)) - ripples;
        
        // Base water color is brighter now
        color = waterDeep;
        
        // Reflect ambient sky strongly
        float waveHighlightAmount = smoothstep(0.1, 0.9, combinedWater);
        color = mix(color, waterHighlight, waveHighlightAmount * 0.8);
        
        // Sharp specular crests catching ambient light and lightning
        float crestHighlight = smoothstep(0.6, 1.0, combinedWater + slope * 0.5);
        color = mix(color, waveCrest, crestHighlight);
        
        // Add lightning reflection on the water
        color += waveCrest * lightning * crestHighlight * 2.0 * smoothstep(-1.0, 4.0, depth);
        
        // Removed the vignette/darkening effect completely so the ocean is fully visible everywhere
        
        // Fade to thick storm fog at horizon to seamlessly blend sky and sea
        float fogFade = smoothstep(horizon - 0.08, horizon, y);
        color = mix(color, mix(vec3(0.35, 0.4, 0.45), vec3(0.8, 0.85, 0.9), lightning * 0.5), fogFade);
    }
    
    // Removed overall darkening so it is brighter
    // color *= 0.85;

    gl_FragColor = vec4(color, 1.0);
}
`;

export default function CorelliaCanals() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const renderer = new Renderer({ alpha: true });
    const gl = renderer.gl;
    containerRef.current.appendChild(gl.canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [gl.canvas.width, gl.canvas.height] },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      if (!containerRef.current) return;
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
    }
    window.addEventListener('resize', resize);
    resize();

    let animationId: number;
    function update(t: number) {
      animationId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;
      renderer.render({ scene: mesh });
    }
    animationId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
      if (containerRef.current && gl.canvas.parentNode === containerRef.current) {
        containerRef.current.removeChild(gl.canvas);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none bg-[#0a0d14]">
      {/* OGL Canal Layer */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full opacity-90" />
    </div>
  );
}
