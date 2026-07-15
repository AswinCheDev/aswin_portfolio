import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export const Crosshair = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse, viewport, camera } = useThree();

  useFrame((state) => {
    if (groupRef.current) {
      // Map mouse (-1 to 1) to 3D space at a specific Z depth (e.g., z = 0 where TIEs are)
      // Since camera is at Z=50 (we will set this in LandingScene), and we want crosshair at Z=0.
      const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const pos = camera.position.clone().add(dir.multiplyScalar(distance));
      
      // Smooth follow
      groupRef.current.position.lerp(pos, 0.5);
      
      // Animate rotation
      groupRef.current.rotation.z -= 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer Ring */}
      <mesh>
        <ringGeometry args={[1.5, 1.8, 32]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Inner Ticks */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} rotation={[0, 0, (i * Math.PI) / 2]}>
          <planeGeometry args={[0.2, 0.8]} />
          <meshBasicMaterial color="#00ffff" />
          <group position={[0, 1.2, 0]} />
        </mesh>
      ))}
      <mesh position={[0, 1.2, 0]}>
        <planeGeometry args={[0.2, 0.8]} />
        <meshBasicMaterial color="#00ffff" />
      </mesh>
      <mesh position={[0, -1.2, 0]}>
        <planeGeometry args={[0.2, 0.8]} />
        <meshBasicMaterial color="#00ffff" />
      </mesh>
      <mesh position={[1.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <planeGeometry args={[0.2, 0.8]} />
        <meshBasicMaterial color="#00ffff" />
      </mesh>
      <mesh position={[-1.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <planeGeometry args={[0.2, 0.8]} />
        <meshBasicMaterial color="#00ffff" />
      </mesh>

      {/* Center Dot */}
      <mesh>
        <circleGeometry args={[0.2, 16]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
    </group>
  );
};
