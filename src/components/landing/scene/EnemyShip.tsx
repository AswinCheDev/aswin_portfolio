import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGLTFWithKTX2 } from '../../../utils/useGLTFWithKTX2';

interface EnemyShipProps {
  id: string;
  position: [number, number, number];
  color: string;
  isLast: boolean;
  onDestroy: (id: string) => void;
}

export const EnemyShip = ({ id, position, color, isLast }: EnemyShipProps) => {
  const groupRef = useRef<THREE.Group>(null);
  
  const timeOffset = useMemo(() => Math.random() * 100, []);
  const speed = isLast ? 3.0 : 1.5;
  
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime() + timeOffset;
      // Evasive swarming motion
      groupRef.current.position.x = position[0] + Math.sin(t * speed) * 5 + Math.cos(t * speed * 1.5) * 2;
      groupRef.current.position.y = position[1] + Math.cos(t * speed * 0.8) * 4 + Math.sin(t * speed * 2) * 1.5;
      groupRef.current.position.z = position[2] + Math.sin(t * speed * 0.5) * 2;
      
      // Look at player with banking
      const targetX = Math.sin(t * speed) * 2;
      const targetY = Math.cos(t * speed * 0.8) * 2;
      groupRef.current.lookAt(targetX, targetY, 15);
      
      // Add heavy banking to turns
      groupRef.current.rotation.z = Math.sin(t * speed) * 0.5;
    }
  });

  const { scene } = useGLTFWithKTX2('/assests/Models/star_wars_tie_fighter.glb');
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  return (
    <group ref={groupRef} position={position} userData={{ id }} scale={[0.3, 0.3, 0.3]}>
      {/* 
        The TIE Fighter model might need rotation to face properly.
        We'll wrap it in a group to adjust orientation.
        Usually models face +Z, but lookAt makes +Z point to target.
      */}
      <group>
        <primitive object={clonedScene} />
      </group>
    </group>
  );
};

// Removed preload to prevent network saturation
