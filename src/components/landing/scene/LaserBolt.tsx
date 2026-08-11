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
  const speed = 120; // Slightly slower so they are visible on screen longer
  
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
      {/* Shift cylinder forward by half its length so the tail is exactly at 'start' */}
      <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -2]}>
        <cylinderGeometry args={[0.04, 0.04, 4, 8]} />
        <meshStandardMaterial 
          color="#ff0000" 
          emissive="#ff0000" 
          emissiveIntensity={8} 
          toneMapped={false} 
        />
      </mesh>
    </group>
  );
};
