import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

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

  // Imperial / Stormtrooper colors
  const hullColor = '#e2e8f0'; // Sleek Silver/White
  const panelColor = '#0a0a0a'; // Deep black solar panels
  const frameColor = '#94a3b8'; // Lighter grey framing
  const engineColor = isLast ? '#ff0000' : '#39FF14'; // Green engine

  return (
    <group ref={groupRef} position={position} userData={{ id }} scale={[0.8, 0.8, 0.8]}>
      {/* Central Cockpit Sphere */}
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color={hullColor} metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Cockpit Window */}
      <mesh position={[0, 0, 0.45]}>
        <circleGeometry args={[0.25, 16]} />
        <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.1} />
        <lineSegments>
          <edgesGeometry args={[new THREE.CircleGeometry(0.25, 8)]} />
          <lineBasicMaterial color={frameColor} />
        </lineSegments>
      </mesh>

      {/* Twin Engines (Back) */}
      <mesh position={[-0.15, 0, -0.48]}>
        <circleGeometry args={[0.08, 8]} />
        <meshBasicMaterial color={engineColor} toneMapped={false} />
      </mesh>
      <mesh position={[0.15, 0, -0.48]}>
        <circleGeometry args={[0.08, 8]} />
        <meshBasicMaterial color={engineColor} toneMapped={false} />
      </mesh>

      {/* Wing Struts */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 1.4, 8]} />
        <meshStandardMaterial color={hullColor} metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Left Wing */}
      <group position={[-0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        {/* Solar Panel */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1, 1, 0.05, 6]} />
          <meshStandardMaterial color={panelColor} metalness={0.4} roughness={0.8} />
        </mesh>
        {/* Wing Frame */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.05, 1.05, 0.06, 6]} />
          <meshStandardMaterial color={frameColor} metalness={0.8} roughness={0.3} wireframe />
        </mesh>
        {/* Center Hub */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 12]} />
          <meshStandardMaterial color={hullColor} metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* Right Wing */}
      <group position={[0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        {/* Solar Panel */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1, 1, 0.05, 6]} />
          <meshStandardMaterial color={panelColor} metalness={0.4} roughness={0.8} />
        </mesh>
        {/* Wing Frame */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.05, 1.05, 0.06, 6]} />
          <meshStandardMaterial color={frameColor} metalness={0.8} roughness={0.3} wireframe />
        </mesh>
        {/* Center Hub */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 12]} />
          <meshStandardMaterial color={hullColor} metalness={0.8} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
};
