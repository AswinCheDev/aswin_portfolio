import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
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
    // Fade out towards the top (y is positive going up in standard cone, but let's use vUv.y)
    // vUv.y goes from 0 at bottom to 1 at top for a ConeGeometry.
    float alpha = 1.0 - vUv.y;
    
    // Add some scanlines/noise moving upwards
    float scanline = sin(vUv.y * 50.0 - time * 5.0) * 0.5 + 0.5;
    float noise = random(vUv * time) * 0.1;
    
    // Combine
    float finalAlpha = alpha * (0.3 + scanline * 0.2 + noise);
    
    // Increase alpha near the edges for a rim light effect
    float rim = pow(1.0 - abs(vUv.x - 0.5) * 2.0, 2.0);
    finalAlpha += rim * 0.2 * alpha;

    gl_FragColor = vec4(color, finalAlpha);
  }
`;

export const HoloProjector = ({ position = [0, -5, 0] }: { position?: [number, number, number] }) => {
  const { scene } = useGLTF("/assests/Models/star_wars_holo_projector_fixed.glb");
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
      {/* ConeGeometry args: [radiusBottom, radiusTop, height, radialSegments, heightSegments, openEnded] */}
      {/* Wait, standard ConeGeometry is radius, height, radialSegments. Let's use CylinderGeometry for better top/bottom control */}
      <mesh position={[0, 3, 0]}>
        {/* radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded */}
        <cylinderGeometry args={[4, 1.5, 6, 32, 1, true]} />
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

useGLTF.preload("/assests/Models/star_wars_holo_projector_fixed.glb");
