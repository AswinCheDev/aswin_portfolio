import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

function R2D2Model({ isFullScore }: { isFullScore?: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/assests/Models/r2-d2_animated.glb');
  const { actions } = useAnimations(animations, group);
  const { viewport } = useThree();

  // We'll store an internal reference to his walking time so we can pause it smoothly
  const walkTime = useRef(0);

  const stoppedX = useRef<number | null>(null);

  useEffect(() => {
    // Initial light setup
    scene.traverse((node: any) => {
      if (node.isMesh && node.name.includes('Projector')) {
        if (!node.userData.originalMaterial) {
          node.userData.originalMaterial = node.material.clone();
        }
        node.material = node.userData.originalMaterial.clone();
        const isRed = node.name.includes('1') || node.name.includes('2');
        node.material.emissive = new THREE.Color(isRed ? '#ff2222' : '#0088ff');
        node.material.emissiveIntensity = 5;
        node.material.toneMapped = false;
      }
    });
  }, [scene]);

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const firstActionName = Object.keys(actions)[0];
      if (isFullScore) {
        actions[firstActionName]?.reset().play();
      } else {
        actions[firstActionName]?.play();
      }
    }
  }, [actions, isFullScore]);

  useFrame((state) => {
    if (isFullScore) {
      // Make lights flicker wildly
      const time = state.clock.getElapsedTime();
      scene.traverse((node: any) => {
        if (node.isMesh && node.name.includes('Projector')) {
          // Add some randomness to the flicker
          const randomFactor = Math.random();
          const flickerSpeed = 20; // Fast flicker
          const baseIntensity = 2;
          const peakIntensity = 15;
          
          // Sine wave mixed with noise for a sporadic flickering effect
          const intensity = baseIntensity + 
            Math.max(0, Math.sin(time * flickerSpeed + node.id) * peakIntensity * (randomFactor > 0.3 ? 1 : 0));
          
          node.material.emissiveIntensity = intensity;

          // Occasionally swap colors for disco effect!
          if (randomFactor > 0.95) {
             const colors = ['#ff2222', '#0088ff', '#ffffff', '#00ff00', '#ff00ff'];
             const randomColor = colors[Math.floor(Math.random() * colors.length)];
             node.material.emissive.set(randomColor);
          }
        }
      });
    } else {
      // Reset to normal steady glow
      scene.traverse((node: any) => {
        if (node.isMesh && node.name.includes('Projector')) {
          node.material.emissiveIntensity = 5;
           const isRed = node.name.includes('1') || node.name.includes('2');
           node.material.emissive.set(isRed ? '#ff2222' : '#0088ff');
        }
      });
    }
  });

  useFrame((state, delta) => {
    if (group.current) {
      const bottomY = -viewport.height / 2;
      
      if (isFullScore) {
        // Latch the current X position so he stays exactly where he was
        if (stoppedX.current === null) {
          stoppedX.current = group.current.position.x;
        }
        
        group.current.position.x = stoppedX.current;
        
        // Turn to face the user
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, 0, 0.05);
        
        // Ensure no bouncing
        group.current.position.y = bottomY;
        group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, 0, 0.1);
        
      } else {
        stoppedX.current = null;
        walkTime.current += delta;
        const time = walkTime.current;
        const speed = 0.2; // Slower pace
        
        // Tighter right bound so he doesn't cross the lego block
        const leftBound = Math.max(-viewport.width * 0.4, -6); 
        const rightBound = Math.min(viewport.width * 0.15, 3.5); 
        
        const mid = (leftBound + rightBound) / 2;
        const amplitude = (rightBound - leftBound) / 2;
        
        const x = mid + Math.sin(time * speed) * amplitude;
        group.current.position.x = x;
        
        const velocity = speed * amplitude * Math.cos(time * speed);
        const targetRotation = velocity > 0 ? Math.PI / 2 : -Math.PI / 2;
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotation, 0.1);
        
        group.current.position.y = bottomY;
        group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, 0, 0.1);
      }
    }
  });

  const defaultBottomY = -viewport.height / 2;

  return (
    <group ref={group} dispose={null} position={[0, defaultBottomY, 0]} scale={[0.72, 0.72, 0.72]}>
      <primitive object={scene} />
    </group>
  );
}
export default function R2D2({ isFullScore }: { isFullScore?: boolean }) {
  return (
    <div className="absolute bottom-0 left-0 w-full h-full z-40 pointer-events-none">
      <Canvas style={{ pointerEvents: 'none' }} camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} />
        <directionalLight position={[-10, 10, -10]} intensity={0.5} />
        <R2D2Model isFullScore={isFullScore} />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/assests/Models/r2-d2_animated.glb');
