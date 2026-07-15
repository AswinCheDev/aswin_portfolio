import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LaserBoltProps {
  id: string;
  start: THREE.Vector3;
  target: THREE.Vector3;
  onDespawn: (id: string) => void;
}

export const LaserBolt = ({ id, start, target, onDespawn }: LaserBoltProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const speed = 150; // units per second
  
  // Calculate direction
  const direction = target.clone().sub(start).normalize();

  // Point the group at the target on mount
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.lookAt(target);
    }
  }, [target]);

  useFrame((_, delta) => {
    if (meshRef.current && groupRef.current) {
      groupRef.current.position.addScaledVector(direction, speed * delta);
      
      // Despawn if it goes too far
      if (groupRef.current.position.distanceTo(start) > 200) {
        onDespawn(id);
      }
    }
  });

  return (
    <group ref={groupRef} position={start}>
      <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 8, 8]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ff0000" 
          emissiveIntensity={3} 
          toneMapped={false} 
        />
      </mesh>
    </group>
  );
};
