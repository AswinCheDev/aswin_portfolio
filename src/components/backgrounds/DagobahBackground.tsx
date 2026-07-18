import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import Galaxy from "../ui/Galaxy";

// Preload the X-Wing
useGLTF.preload("/assests/Models/x-wing_t-65.glb");

// ----------------------------------------------------------------------
// Dagobah Planet Shader (Refined to match reference image)
// ----------------------------------------------------------------------
const planetVertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const planetFragmentShader = `
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

// 3D Noise
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

float fbm(vec3 p) {
  float f = 0.0;
  f += 0.5000 * snoise(p); p = p * 2.01;
  f += 0.2500 * snoise(p); p = p * 2.02;
  f += 0.1250 * snoise(p); p = p * 2.03;
  f += 0.0625 * snoise(p);
  return f;
}

void main() {
  vec3 p = normalize(vPosition) * 1.5;
  
  // Land and water colors matched exactly to the image
  float n = fbm(p + uTime * 0.005);
  vec3 water = vec3(0.2, 0.25, 0.22); // Dusty dark grey/green
  vec3 land = vec3(0.25, 0.45, 0.25); // Richer dusty green continents
  float landMask = smoothstep(0.3, 0.7, n);
  vec3 baseColor = mix(water, land, landMask);
  
  // Clouds - very bright white, dense, sharp, covering more of the planet
  float c = fbm(p * 4.0 - uTime * 0.01);
  float cloudAlpha = smoothstep(0.25, 0.75, c); // Increased cloud coverage
  vec3 cloudColor = vec3(0.85, 0.9, 0.9); 
  
  vec3 finalColor = mix(baseColor, cloudColor, cloudAlpha);
  
  // Lighting: Strong light from TOP RIGHT to match image
  vec3 lightDir = normalize(vec3(1.0, 1.0, 0.5));
  float diff = max(dot(vNormal, lightDir), 0.0);
  
  // Deep black shadow on the left and bottom
  float shadowEdge = smoothstep(0.0, 0.6, diff); 
  
  // Very thin, subtle atmospheric rim light
  float rim = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
  rim = smoothstep(0.7, 1.0, rim) * shadowEdge;
  vec3 atmosphere = vec3(0.6, 0.7, 0.8) * rim * 1.0;
  
  // Final composition: Deep shadows, high contrast clouds
  gl_FragColor = vec4((finalColor * shadowEdge) + atmosphere, 1.0);
}
`;

const DagobahPlanet = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
    if (meshRef.current) {
      // Rotate on Y, but keep the initial tilt on Z
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.02; 
    }
  });

  return (
    // Tucked into the bottom-right corner to form a perfect semi-circle curve
    <mesh ref={meshRef} position={[8, -6, -10]} rotation={[0, 0, 0.5]}>
      <sphereGeometry args={[6.3, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={planetVertexShader}
        fragmentShader={planetFragmentShader}
        uniforms={{ uTime: { value: 0 } }}
      />
    </mesh>
  );
};

// ----------------------------------------------------------------------
// Infinite Flight X-Wing
// ----------------------------------------------------------------------
const FlightXWing = () => {
  const { scene } = useGLTF("/assests/Models/x-wing_t-65.glb");
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    
    // Illusion of flying endlessly towards the planet
    const bobX = Math.sin(t * 1.5) * 0.15;
    const bobY = Math.cos(t * 1.2) * 0.15;
    const bankZ = Math.sin(t * 0.8) * 0.1;
    
    // Positioned in the FAR UPPER LEFT, pointing towards the bottom right planet
    groupRef.current.position.set(-4.5 + bobX, 3.2 + bobY, -4);
    
    // Look towards bottom right planet
    groupRef.current.lookAt(new THREE.Vector3(8, -6, -10));
    
    // Rotate 180 degrees if the model is loaded backwards
    groupRef.current.rotateY(Math.PI);
    
    // Add banking roll
    groupRef.current.rotateZ(bankZ);
  });

  return (
    // Decreased size by an additional 20% (was 0.24, now 0.19)
    <group ref={groupRef} scale={[0.19, 0.19, 0.19]}>
      <primitive object={scene} />
      {/* Engine glow */}
      <pointLight color="#ffaa00" intensity={3} distance={10} position={[0, 0, -3]} />
      {/* Thrusters */}
      <mesh position={[0.7, 0.2, -1.8]}><sphereGeometry args={[0.1, 8, 8]} /><meshBasicMaterial color="#ff5555" /></mesh>
      <mesh position={[-0.7, 0.2, -1.8]}><sphereGeometry args={[0.1, 8, 8]} /><meshBasicMaterial color="#ff5555" /></mesh>
      <mesh position={[0.7, -0.2, -1.8]}><sphereGeometry args={[0.1, 8, 8]} /><meshBasicMaterial color="#ff5555" /></mesh>
      <mesh position={[-0.7, -0.2, -1.8]}><sphereGeometry args={[0.1, 8, 8]} /><meshBasicMaterial color="#ff5555" /></mesh>
    </group>
  );
};

// ----------------------------------------------------------------------
// Main 3D Scene
// ----------------------------------------------------------------------
const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.1} color="#ffffff" />
      <directionalLight position={[10, 5, 5]} intensity={1.5} color="#ffffff" />
      
      <Suspense fallback={null}>
        <DagobahPlanet />
        <FlightXWing />
      </Suspense>
    </>
  );
};

export const DagobahBackground = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#000000]">
      {/* Custom interactive Galaxy component in the background */}
      <div className="absolute inset-0 z-0">
        <Galaxy 
          mouseRepulsion={false}
          mouseInteraction={false}
          density={1}
          glowIntensity={0.15}
          saturation={0}
          hueShift={140}
          twinkleIntensity={0.3}
          rotationSpeed={0.1}
          repulsionStrength={2}
          autoCenterRepulsion={0}
          starSpeed={0.5}
          speed={1}
        />
      </div>

      {/* R3F Canvas containing the Planet and X-Wing in the foreground */}
      <Canvas className="absolute inset-0 z-10" camera={{ position: [0, 0, 5], fov: 60 }} gl={{ alpha: true, antialias: true }}>
        <Scene />
      </Canvas>
    </div>
  );
};
