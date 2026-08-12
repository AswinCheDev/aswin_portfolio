import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTFWithKTX2 } from "../../utils/useGLTFWithKTX2";
import * as THREE from "three";

const coneVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const coneFragmentShader = `
  uniform float time;
  uniform vec3 color;
  varying vec2 vUv;
  varying vec3 vPosition;

  // Simple noise function
  float random (in vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  void main() {
    // Smooth fade out towards the top
    float alpha = smoothstep(1.0, 0.0, vUv.y);
    
    // Flickering scanlines moving upwards rapidly
    float scanline = sin(vUv.y * 100.0 - time * 15.0) * 0.5 + 0.5;
    float flicker = sin(time * 25.0) * 0.05 + 0.95;
    
    // Moving static noise for holographic interference
    float noise = random(vUv + time) * 0.15;
    
    // Crisp rim lighting (Fresnel-like edge glow)
    float rim = pow(1.0 - abs(vUv.x - 0.5) * 2.0, 3.0);
    
    // Base projection core that is highly transparent in the middle
    float core = 0.05 + scanline * 0.15 + noise;
    
    // Combine for a volumetric projection effect
    float finalAlpha = alpha * flicker * (core + rim * 0.8);

    gl_FragColor = vec4(color, finalAlpha);
  }
`;

export const HoloProjector = ({ position = [0, -5, 0] }: { position?: [number, number, number] }) => {
  const { scene } = useGLTFWithKTX2("/assests/Models/star_wars_holo_projector.glb");
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      color: { value: new THREE.Color("#06b6d4") }, // Cyan-500
    }),
    []
  );

  useEffect(() => {
    // Remove blinding white emissive glow from the base model
    scene.traverse((node: any) => {
      if (node.isMesh && node.material) {
        if (node.material.emissive) {
          // Keep a very slight cyan emissive instead of blown out white
          node.material.emissive = new THREE.Color("#0891b2");
          node.material.emissiveIntensity = 0.5;
        }
      }
    });
  }, [scene]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
    // Gentle hover effect for the projector base
    if (groupRef.current) {
       groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Projector Base Model */}
      <primitive object={scene} scale={2} position={[0, -0.5, 0]} />

      {/* Volumetric Light Cone */}
      <mesh position={[0, 2.5, 0]}>
        {/* radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded */}
        <cylinderGeometry args={[7.5, 0.2, 5, 32, 1, true]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={coneVertexShader}
          fragmentShader={coneFragmentShader}
          uniforms={uniforms}
          transparent={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

// Removed preload
