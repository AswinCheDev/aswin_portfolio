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

  void main() {
    // Basic glowing border
    float borderThickness = 0.02;
    float edgeGlowX = smoothstep(0.0, borderThickness, vUv.x) * smoothstep(1.0, 1.0 - borderThickness, vUv.x);
    float edgeGlowY = smoothstep(0.0, borderThickness, vUv.y) * smoothstep(1.0, 1.0 - borderThickness, vUv.y);
    float border = 1.0 - (edgeGlowX * edgeGlowY);

    // Scanlines
    float scanline = sin(vUv.y * 100.0 - time * 10.0) * 0.05;
    
    // Base translucent background
    float alpha = 0.15 + border * 0.8 + scanline;

    // Add some brighter corners (chamfer effect approximation)
    float cornerDist = length(vec2(0.5, 0.5) - vUv);
    if (cornerDist > 0.65) {
      alpha += 0.5;
    }

    gl_FragColor = vec4(color, alpha);
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
      {/* Background Holographic Plane */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[12, 8]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={panelVertexShader}
          fragmentShader={panelFragmentShader}
          uniforms={uniforms}
          transparent={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Projected HTML Form */}
      <Html
        transform
        occlude="blending"
        position={[0, 0, 0]}
        style={{ 
          width: '600px', // Fixed width to match the 3D plane aspect ratio
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
