import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGLTFWithKTX2 } from '../../../utils/useGLTFWithKTX2';

interface PlayerShipProps {
  isHyperspace?: boolean;
}

export const playerShipState = {
  position: new THREE.Vector3(),
  rotation: new THREE.Euler(),
};

export const PlayerShip = ({ isHyperspace = false }: PlayerShipProps = {}) => {
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
      
      if (isHyperspace) {
        // Add camera shake effect for hyperspace
        pos.x += (Math.random() - 0.5) * 0.08;
        pos.y += (Math.random() - 0.5) * 0.08;
      }
      
      // Interpolate rotation for smoothness
      groupRef.current.rotation.z += (targetRotationZ - groupRef.current.rotation.z) * 0.1;
      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.1;
      
      // Keep base Y rotation neutral, ship points into the screen
      groupRef.current.rotation.y = Math.PI;

      // Update shared state for other components to read
      playerShipState.position.copy(groupRef.current.position);
      playerShipState.rotation.copy(groupRef.current.rotation);
    }
  });

  const { scene } = useGLTFWithKTX2('/assests/Models/x-wing-t-65.glb');
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  return (
    <group ref={groupRef} scale={[0.15, 0.15, 0.15]} name="player-ship">
      {/* 
        The ship model natively faces +Z. 
        Since the groupRef has rotation.y = Math.PI, the group faces -Z.
        So we don't need additional rotation here.
      */}
      <primitive object={clonedScene} />
    </group>
  );
};

// Removed preload
