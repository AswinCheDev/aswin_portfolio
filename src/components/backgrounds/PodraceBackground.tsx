import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ----------------------------------------------------------------------
// Fast Scrolling Terrain Shaders
// ----------------------------------------------------------------------
const terrainVertexShader = `
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
`;

const terrainFragmentShader = `
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
`;

const FastTerrain = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  // Extend further back to allow fast scrolling without seeing the edge immediately. Increased resolution for smoother dunes.
  const planeGeometry = useMemo(() => new THREE.PlaneGeometry(400, 400, 256, 256), []);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      geometry={planeGeometry} 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -8, -50]} 
    >
      <shaderMaterial
        ref={materialRef}
        vertexShader={terrainVertexShader}
        fragmentShader={terrainFragmentShader}
        uniforms={{ uTime: { value: 0 } }}
      />
    </mesh>
  );
};

// ----------------------------------------------------------------------
// Skybox with 3 Moons
// ----------------------------------------------------------------------
const skyboxVertexShader = `
varying vec3 vWorldPosition;
void main() {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const skyboxFragmentShader = `
varying vec3 vWorldPosition;
uniform vec3 uMoon1Pos;
uniform vec3 uMoon2Pos;
uniform vec3 uMoon3Pos;

void main() {
  vec3 viewDirection = normalize(vWorldPosition);
  
  // Daytime dusty sky
  float elevation = max(viewDirection.y, 0.0);
  vec3 zenithColor = vec3(0.3, 0.5, 0.7); // Bright blue
  vec3 horizonColor = vec3(0.8, 0.65, 0.45); // Dusty tan/orange at horizon
  
  vec3 skyColor = mix(horizonColor, zenithColor, pow(elevation, 0.6));
  
  vec3 finalColor = skyColor;
  
  // Moon 1 (Ghomrassen - Large, Pale)
  vec3 m1Dir = normalize(uMoon1Pos);
  float m1Dist = distance(viewDirection, m1Dir);
  float m1Glow = smoothstep(0.3, 0.0, m1Dist);
  float m1Core = smoothstep(0.05, 0.045, m1Dist); 
  vec3 m1Color = vec3(0.9, 0.9, 0.7) * m1Glow * 1.5 + vec3(1.0, 1.0, 0.9) * m1Core * 1.5;
  
  // Moon 2 (Guermessa - Medium, Reddish)
  vec3 m2Dir = normalize(uMoon2Pos);
  float m2Dist = distance(viewDirection, m2Dir);
  float m2Glow = smoothstep(0.2, 0.0, m2Dist);
  float m2Core = smoothstep(0.022, 0.02, m2Dist); 
  vec3 m2Color = vec3(0.8, 0.3, 0.2) * m2Glow * 1.2 + vec3(1.0, 0.5, 0.4) * m2Core * 1.2;
  
  // Moon 3 (Chenini - Small, Distant White)
  vec3 m3Dir = normalize(uMoon3Pos);
  float m3Dist = distance(viewDirection, m3Dir);
  float m3Glow = smoothstep(0.1, 0.0, m3Dist);
  float m3Core = smoothstep(0.012, 0.01, m3Dist); 
  vec3 m3Color = vec3(0.7, 0.7, 0.9) * m3Glow * 1.0 + vec3(1.0, 1.0, 1.0) * m3Core * 1.5;
  
  finalColor += m1Color + m2Color + m3Color;
  
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

const ThreeMoonsSkybox = () => {
  return (
    <mesh>
      <sphereGeometry args={[300, 32, 32]} />
      <shaderMaterial
        vertexShader={skyboxVertexShader}
        fragmentShader={skyboxFragmentShader}
        side={THREE.BackSide}
        uniforms={{
          uMoon1Pos: { value: new THREE.Vector3(30, 40, -100) },
          uMoon2Pos: { value: new THREE.Vector3(-40, 20, -120) },
          uMoon3Pos: { value: new THREE.Vector3(10, 15, -150) }
        }}
        depthWrite={false}
      />
    </mesh>
  );
};

// ----------------------------------------------------------------------
// High-Speed Dust / Speed Lines
// ----------------------------------------------------------------------
const SpeedLines = () => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particleCount = 2000;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      // Distribute particles in a wide tunnel around the camera
      pos[i * 3] = (Math.random() - 0.5) * 100;     // x (wide spread)
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20 + 5; // y (height)
      pos[i * 3 + 2] = (Math.random() - 0.5) * 200 - 50; // z (depth)
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    // Slower speed to simulate a cruising motion
    const speed = 40.0;
    
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      
      // Move particles towards the camera on the Z axis
      posArray[idx + 2] += speed * delta;
      
      // If a particle passes behind the camera, reset it far in the distance
      if (posArray[idx + 2] > 20) {
        posArray[idx + 2] = -200 + Math.random() * 20; // reset far back
        posArray[idx] = (Math.random() - 0.5) * 100;   // new X
        posArray[idx + 1] = (Math.random() - 0.5) * 20 + 5; // new Y
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.2} 
        color="#ffffff" 
        transparent 
        opacity={0.3} 
        blending={THREE.AdditiveBlending} 
        depthWrite={false} 
        onBeforeCompile={(shader) => {
          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <clipping_planes_fragment>',
            `
            #include <clipping_planes_fragment>
            if (length(gl_PointCoord - vec2(0.5)) > 0.5) discard;
            `
          );
        }}
      />
    </points>
  );
};

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------
export const PodraceBackground = ({ isActive = true }: { isActive?: boolean }) => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#ccaa88] pointer-events-none">
      {isActive && (
        <Canvas 
          className="absolute inset-0" 
          camera={{ position: [0, 2, 10], fov: 60 }} 
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
        >
          <ThreeMoonsSkybox />
          <FastTerrain />
          <SpeedLines />
        </Canvas>
      )}
      
      {/* Vignette overlay for cinematic contrast */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-[#050201] opacity-60 pointer-events-none" />
    </div>
  );
};
