import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Center, useGLTF } from '@react-three/drei';

export const HyperspaceGLTFXWing = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { camera, mouse } = useThree();
  const { scene, materials } = useGLTF('/assests/Models/xfighter1.glb') as any;

  useEffect(() => {
    // Modify the built-in engine glows to match the classic red/orange/yellow look
    if (materials) {
      if (materials.xwingEngineGlow) {
        materials.xwingEngineGlow.color.set('#ffff00');
        materials.xwingEngineGlow.emissive = new THREE.Color('#ffff00');
        materials.xwingEngineGlow.emissiveIntensity = 2;
        materials.xwingEngineGlow.toneMapped = false;
      }
      if (materials.xwingEngineGlowTrans) {
        materials.xwingEngineGlowTrans.color.set('#ff2200');
        materials.xwingEngineGlowTrans.emissive = new THREE.Color('#ff2200');
        materials.xwingEngineGlowTrans.emissiveIntensity = 2;
        materials.xwingEngineGlowTrans.transparent = true;
        materials.xwingEngineGlowTrans.opacity = 0.8;
        materials.xwingEngineGlowTrans.toneMapped = false;
      }
    }
  }, [materials]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Hyperspace shake effect
      const shakeX = (Math.random() - 0.5) * 0.1;
      const shakeY = (Math.random() - 0.5) * 0.1;
      
      // Position the ship in front of camera
      const pos = camera.position.clone();
      pos.z -= 4; // 4 units in front of camera
      pos.y -= 0.5; // Slightly lowered
      
      // Apply position and shake
      groupRef.current.position.set(pos.x + shakeX, pos.y + shakeY, pos.z);
      
      // Calculate target rotation based on mouse position
      const targetRotationY = (mouse.x * Math.PI) / 6;
      const targetRotationX = Math.PI * 0.05 - (mouse.y * Math.PI) / 10;
      
      // Interpolate for smooth rotation tracking the mouse
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.1);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.1);
      
      // Slight bank based on time and mouse horizontal movement
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 8) * 0.05 - mouse.x * 0.2;
    }
  });

  const engineGlow = '#b000ff';

  return (
    <group ref={groupRef}>
      <Center>
        <group rotation={[0, Math.PI, 0]}>
          <primitive object={scene} scale={[0.3, 0.3, 0.3]} />
        </group>
      </Center>
    </group>
  );
};

useGLTF.preload('/assests/Models/xfighter1.glb');
