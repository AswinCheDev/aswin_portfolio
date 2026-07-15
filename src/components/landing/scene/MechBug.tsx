import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MechBugProps {
  id: string;
  position: [number, number, number];
  color: string;
  isLast: boolean;
  onDestroy: (id: string) => void;
}

export const MechBug = ({ id, position, color, isLast }: MechBugProps) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Random movement offsets
  const timeOffset = useMemo(() => Math.random() * 100, []);
  const speed = isLast ? 2.5 : 1.2;
  
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime() + timeOffset;
      // Scuttling/wandering motion
      groupRef.current.position.x = position[0] + Math.sin(t * speed) * 4 + Math.cos(t * speed * 2) * 1.5;
      groupRef.current.position.y = position[1] + Math.cos(t * speed * 0.8) * 3 + Math.sin(t * speed * 1.5) * 1;
      groupRef.current.position.z = position[2]; // Keep original Z depth
      
      // Look roughly towards the player but add some chaotic twitching
      const twitchX = Math.sin(t * 10) * 0.1;
      const twitchY = Math.cos(t * 12) * 0.1;
      groupRef.current.lookAt(twitchX, twitchY, 10);
    }
  });

  const materialColor = isLast ? '#FF6B00' : color;
  const emissiveIntensity = isLast ? 2.5 : 1.5;

  return (
    <group ref={groupRef} position={position} userData={{ id }} scale={[1.2, 1.2, 1.2]}>
      {/* Core Body (Faceted) */}
      <mesh>
        <octahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial 
          color="#111520" 
          metalness={0.8}
          roughness={0.2}
          wireframe={false} 
        />
        <lineSegments>
          <edgesGeometry args={[new THREE.OctahedronGeometry(0.6, 1)]} />
          <lineBasicMaterial color={materialColor} transparent opacity={0.5} />
        </lineSegments>
      </mesh>
      
      {/* Glowing Neon Eyes */}
      <mesh position={[-0.25, 0.2, 0.45]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshBasicMaterial color={isLast ? '#ff0000' : '#FF6B00'} />
      </mesh>
      <mesh position={[0.25, 0.2, 0.45]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshBasicMaterial color={isLast ? '#ff0000' : '#FF6B00'} />
      </mesh>

      {/* Wings / Carapace */}
      {/* Left Wing */}
      <mesh position={[-0.7, 0.1, -0.2]} rotation={[0, -Math.PI / 6, Math.PI / 4]}>
        <boxGeometry args={[1, 0.1, 0.8]} />
        <meshStandardMaterial 
          color="#0A192F" 
          emissive={materialColor}
          emissiveIntensity={emissiveIntensity * 0.3}
          metalness={0.9}
        />
      </mesh>
      {/* Right Wing */}
      <mesh position={[0.7, 0.1, -0.2]} rotation={[0, Math.PI / 6, -Math.PI / 4]}>
        <boxGeometry args={[1, 0.1, 0.8]} />
        <meshStandardMaterial 
          color="#0A192F" 
          emissive={materialColor}
          emissiveIntensity={emissiveIntensity * 0.3}
          metalness={0.9}
        />
      </mesh>

      {/* Thorax / Tail */}
      <mesh position={[0, -0.5, -0.4]}>
        <coneGeometry args={[0.3, 0.8, 4]} />
        <meshStandardMaterial color="#111111" />
        <lineSegments>
          <edgesGeometry args={[new THREE.ConeGeometry(0.3, 0.8, 4)]} />
          <lineBasicMaterial color={materialColor} transparent opacity={0.3} />
        </lineSegments>
      </mesh>
    </group>
  );
};
