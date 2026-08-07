import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { ContactForm } from "../ContactForm";

const panelVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const panelFragmentShader = `
  uniform float time;
  uniform vec3 color;
  varying vec2 vUv;

  // Simple noise function
  float random (in vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  void main() {
    // Basic glowing border
    float borderThickness = 0.015;
    float edgeGlowX = smoothstep(0.0, borderThickness, vUv.x) * smoothstep(1.0, 1.0 - borderThickness, vUv.x);
    float edgeGlowY = smoothstep(0.0, borderThickness, vUv.y) * smoothstep(1.0, 1.0 - borderThickness, vUv.y);
    float border = 1.0 - (edgeGlowX * edgeGlowY);

    // Scanlines moving upwards
    float scanline = sin(vUv.y * 150.0 - time * 12.0) * 0.08;
    
    // Hexagonal / Grid pattern approximation
    float gridX = smoothstep(0.95, 1.0, fract(vUv.x * 40.0));
    float gridY = smoothstep(0.95, 1.0, fract(vUv.y * 30.0));
    float grid = max(gridX, gridY) * 0.1;
    
    // Static noise and slight flicker
    float noise = random(vUv + time) * 0.05;
    float flicker = sin(time * 25.0) * 0.05 + 0.95;
    
    // Base translucent background
    float alpha = (0.03 + border * 0.25 + scanline + grid + noise) * flicker;

    // Add some brighter corners (chamfer effect approximation)
    float cornerDist = length(vec2(0.5, 0.5) - vUv);
    if (cornerDist > 0.65) {
      alpha += 0.1 * flicker;
    }

    // Chromatic hologram color shifting
    vec3 cyan = color;
    vec3 pink = vec3(0.9, 0.2, 0.6);
    vec3 finalColor = mix(cyan, pink, scanline * 5.0 + noise * 2.0);

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

export const HoloFormPanel = ({ position = [0, 0, 0] }: { position?: [number, number, number] }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      color: { value: new THREE.Color("#06b6d4") }, // Cyan-500
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
    // Antigravity floating effect
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={position}>


      {/* Projected HTML Form */}
      <Html
        transform
        position={[0, 0, 0]}
        style={{ 
          width: '800px', // Fixed width to match the 3D plane aspect ratio
          // Remove pointer-events from parent container to allow clicking inside
        }}
      >
        {/* We use a specific div wrapper to handle scaling if needed */}
        <div className="w-full h-full pointer-events-auto">
           <ContactForm />
        </div>
      </Html>
    </group>
  );
};
