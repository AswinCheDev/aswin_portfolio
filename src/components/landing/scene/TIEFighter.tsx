import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TIEFighterProps {
  id: string;
  position: [number, number, number];
  color: string;
  isLast: boolean;
  onDestroy: (id: string) => void;
}

export const TIEFighter = ({ id, position, color, isLast }: TIEFighterProps) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Random movement offsets
  const timeOffset = useMemo(() => Math.random() * 100, []);
  const speed = isLast ? 2.0 : 1.0;
  
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime() + timeOffset;
      // Gentle bobbing and wandering
      groupRef.current.position.x = position[0] + Math.sin(t * speed) * 5;
      groupRef.current.position.y = position[1] + Math.cos(t * speed * 0.8) * 3;
      groupRef.current.position.z = position[2]; // Keep original Z depth
      
      // Slight rotation to look alive
      groupRef.current.rotation.z = Math.sin(t * speed) * 0.2;
      groupRef.current.rotation.y = Math.sin(t * speed * 0.5) * 0.3;
    }
  });

  const materialColor = isLast ? '#ff0000' : color;
  const emissiveIntensity = isLast ? 2.0 : 1.0;

  return (
    <group ref={groupRef} position={position} userData={{ id }}>
      {/* Center Cockpit */}
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial 
          color="#222222" 
          wireframe 
          emissive={materialColor}
          emissiveIntensity={emissiveIntensity * 0.5} 
        />
      </mesh>
      
      {/* Left Strut */}
      <mesh position={[-0.75, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      
      {/* Right Strut */}
      <mesh position={[0.75, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      
      {/* Left Wing */}
      <mesh position={[-1.0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.1, 6]} />
        <meshStandardMaterial 
          color="#111111" 
          wireframe 
          emissive={materialColor}
          emissiveIntensity={emissiveIntensity} 
        />
      </mesh>
      
      {/* Right Wing */}
      <mesh position={[1.0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.1, 6]} />
        <meshStandardMaterial 
          color="#111111" 
          wireframe 
          emissive={materialColor}
          emissiveIntensity={emissiveIntensity} 
        />
      </mesh>
    </group>
  );
};
