import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export const PlayerShip = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse, camera } = useThree();

  useFrame(() => {
    if (groupRef.current) {
      // Map mouse (-1 to 1) to 3D space in front of camera
      const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      
      // Position the ship 3 units in front of the camera
      const distance = 3; 
      const pos = camera.position.clone().add(dir.multiplyScalar(distance));
      
      // Smooth follow position
      groupRef.current.position.lerp(pos, 0.3);
      
      // Dynamic banking/rolling based on mouse position
      const targetRotationZ = -mouse.x * Math.PI * 0.4; // Roll left/right
      const targetRotationX = mouse.y * Math.PI * 0.2; // Pitch up/down
      
      // Interpolate rotation for smoothness
      groupRef.current.rotation.z += (targetRotationZ - groupRef.current.rotation.z) * 0.1;
      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.1;
      
      // Keep base Y rotation neutral, ship points into the screen
      groupRef.current.rotation.y = Math.PI;
    }
  });

  const hullColor = '#e0e0e0';
  const detailColor = '#cc0000'; // Red Squadron markings
  const engineGlow = '#FF6B00';

  return (
    <group ref={groupRef} scale={[0.7, 0.7, 0.7]}>
      {/* Fuselage / Nose */}
      <mesh position={[0, 0, 1]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.2, 2, 8]} />
        <meshStandardMaterial color={hullColor} metalness={0.5} roughness={0.5} />
      </mesh>
      
      {/* Main Body */}
      <mesh position={[0, 0, -0.2]}>
        <boxGeometry args={[0.4, 0.3, 1]} />
        <meshStandardMaterial color={hullColor} metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Cockpit Canopy */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.25, 0.15, 0.6]} />
        <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Astromech Droid (R2 Unit) */}
      <mesh position={[0, 0.2, -0.4]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#0055ff" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* S-Foils (Wings in X Attack Position) */}
      {/* Top Left Wing */}
      <group position={[-0.2, 0, -0.2]} rotation={[0, 0, Math.PI / 8]}>
        <mesh position={[-0.6, 0.05, 0]}>
          <boxGeometry args={[1.2, 0.05, 0.8]} />
          <meshStandardMaterial color={hullColor} metalness={0.5} roughness={0.5} />
        </mesh>
        {/* Red Marking */}
        <mesh position={[-1.0, 0.08, 0]}>
          <boxGeometry args={[0.2, 0.01, 0.8]} />
          <meshStandardMaterial color={detailColor} />
        </mesh>
        {/* Engine Cylinder */}
        <mesh position={[-0.2, 0.1, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
          <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Engine Glow */}
        <mesh position={[-0.2, 0.1, -0.62]}>
          <circleGeometry args={[0.12, 16]} />
          <meshBasicMaterial color={engineGlow} toneMapped={false} />
        </mesh>
        {/* Laser Cannon */}
        <mesh position={[-1.2, 0.05, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.04, 1.5, 8]} />
          <meshStandardMaterial color="#555555" />
        </mesh>
      </group>

      {/* Bottom Left Wing */}
      <group position={[-0.2, 0, -0.2]} rotation={[0, 0, -Math.PI / 8]}>
        <mesh position={[-0.6, -0.05, 0]}>
          <boxGeometry args={[1.2, 0.05, 0.8]} />
          <meshStandardMaterial color={hullColor} metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh position={[-0.2, -0.1, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
          <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[-0.2, -0.1, -0.62]}>
          <circleGeometry args={[0.12, 16]} />
          <meshBasicMaterial color={engineGlow} toneMapped={false} />
        </mesh>
        <mesh position={[-1.2, -0.05, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.04, 1.5, 8]} />
          <meshStandardMaterial color="#555555" />
        </mesh>
      </group>

      {/* Top Right Wing */}
      <group position={[0.2, 0, -0.2]} rotation={[0, 0, -Math.PI / 8]}>
        <mesh position={[0.6, 0.05, 0]}>
          <boxGeometry args={[1.2, 0.05, 0.8]} />
          <meshStandardMaterial color={hullColor} metalness={0.5} roughness={0.5} />
        </mesh>
        {/* Red Marking */}
        <mesh position={[1.0, 0.08, 0]}>
          <boxGeometry args={[0.2, 0.01, 0.8]} />
          <meshStandardMaterial color={detailColor} />
        </mesh>
        <mesh position={[0.2, 0.1, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
          <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0.2, 0.1, -0.62]}>
          <circleGeometry args={[0.12, 16]} />
          <meshBasicMaterial color={engineGlow} toneMapped={false} />
        </mesh>
        <mesh position={[1.2, 0.05, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.04, 1.5, 8]} />
          <meshStandardMaterial color="#555555" />
        </mesh>
      </group>

      {/* Bottom Right Wing */}
      <group position={[0.2, 0, -0.2]} rotation={[0, 0, Math.PI / 8]}>
        <mesh position={[0.6, -0.05, 0]}>
          <boxGeometry args={[1.2, 0.05, 0.8]} />
          <meshStandardMaterial color={hullColor} metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh position={[0.2, -0.1, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
          <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0.2, -0.1, -0.62]}>
          <circleGeometry args={[0.12, 16]} />
          <meshBasicMaterial color={engineGlow} toneMapped={false} />
        </mesh>
        <mesh position={[1.2, -0.05, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.04, 1.5, 8]} />
          <meshStandardMaterial color="#555555" />
        </mesh>
      </group>

    </group>
  );
};
