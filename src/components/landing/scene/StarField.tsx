import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StarFieldProps {
  count?: number;
  isHyperspace?: boolean;
}

export const StarField = ({ count = 2000, isHyperspace = false }: StarFieldProps) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const currentSpeed = useRef(80);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Store base positions for each star
  const starData = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = Math.random() * 50 + 10;
      data.push({
        x: Math.cos(theta) * radius,
        y: Math.sin(theta) * radius,
        z: (Math.random() - 0.5) * 200
      });
    }
    return data;
  }, [count]);

  useFrame((_, delta) => {
    if (isHyperspace) {
      currentSpeed.current += delta * 2000; // Rapidly accelerate
    }
    
    if (meshRef.current) {
      // Calculate how much to stretch the stars based on speed
      const stretch = isHyperspace ? Math.min(Math.max(1, currentSpeed.current * 0.05), 100) : 1;
      
      for (let i = 0; i < count; i++) {
        const star = starData[i];
        
        // Move star forward
        star.z += delta * currentSpeed.current;
        if (star.z > 100) {
          star.z -= 200; // Loop back
        }
        
        // Apply position and stretch scale
        dummy.position.set(star.x, star.y, star.z);
        // Base size is very small, but stretches on Z when in hyperspace
        dummy.scale.set(0.02, 0.02, 0.02 + stretch); 
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial 
        color="#ffffff" 
        transparent 
        opacity={0.8} 
        blending={THREE.AdditiveBlending} 
      />
    </instancedMesh>
  );
};
