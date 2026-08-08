import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

interface Explosion3DProps {
  id: string;
  position: [number, number, number];
  skillText: string;
  onDespawn: (id: string) => void;
}

export const Explosion3D = ({ id, position, skillText, onDespawn }: Explosion3DProps) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const midRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particleCount = 60; // Sparks
  const [life, setLife] = useState(0);
  const maxLife = 1.5; // Slightly shorter max life for snappier feel

  const { positions, velocities, colors } = useMemo(() => {
    const pos = [];
    const vel = [];
    const col = new Float32Array(particleCount * 3);
    
    // Fire and spark colors
    const baseColors = [
      new THREE.Color('#ffffff'), // White hot core
      new THREE.Color('#ffaa00'), // Bright orange
      new THREE.Color('#ff3300'), // Deep red
    ];
    
    for (let i = 0; i < particleCount; i++) {
      pos.push(new THREE.Vector3(0, 0, 0)); // Start from center
      
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = Math.random() * 40 + 10; // Fast sparks
      
      vel.push(new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta) * speed,
        Math.sin(phi) * Math.sin(theta) * speed,
        Math.cos(phi) * speed
      ));

      const c = baseColors[Math.floor(Math.random() * baseColors.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    
    return { positions: pos, velocities: vel, colors: col };
  }, []);

  useFrame((_, delta) => {
    setLife((prev) => {
      const newLife = prev + delta;
      if (newLife >= maxLife) {
        onDespawn(id);
      }
      return newLife;
    });
    
    // Intense Fireball Expansion (Multiple Layers)
    const blastScale = life * 30 * Math.exp(-life * 4); // Spikes fast, then shrinks/holds
    const fade = Math.max(0, 1 - (life / 0.8)); // Fades out over 0.8s
    
    if (coreRef.current) {
      coreRef.current.scale.setScalar(Math.max(0.1, blastScale * 0.4)); // White core
      (coreRef.current.material as THREE.MeshBasicMaterial).opacity = fade * 1.0;
    }
    if (midRef.current) {
      midRef.current.scale.setScalar(Math.max(0.1, blastScale * 0.7)); // Yellow mid
      (midRef.current.material as THREE.MeshBasicMaterial).opacity = fade * 0.8;
    }
    if (outerRef.current) {
      outerRef.current.scale.setScalar(Math.max(0.1, blastScale * 1.0)); // Orange outer
      (outerRef.current.material as THREE.MeshBasicMaterial).opacity = fade * 0.6;
    }

    // Shockwave Ring Expansion
    if (ringRef.current) {
      const ringScale = 0.5 + life * 50;
      ringRef.current.scale.setScalar(ringScale);
      const ringMat = ringRef.current.material as THREE.MeshBasicMaterial;
      ringMat.opacity = Math.max(0, 1 - (life / 0.5));
    }

    // Sparks
    if (meshRef.current) {
      for (let i = 0; i < particleCount; i++) {
        // Move fragment
        positions[i].addScaledVector(velocities[i], delta);
        // Drag (sparks slow down quickly)
        velocities[i].multiplyScalar(0.90);
        
        // Shrink slightly as they cool off/fade
        const scale = Math.max(0, 1 - (life / maxLife));
        const baseScale = (i % 5 === 0) ? 0.3 : 0.15; 
        
        dummy.position.copy(positions[i]);
        dummy.scale.setScalar(scale * baseScale);
        dummy.updateMatrix();
        
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
      
      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = Math.max(0, 1 - (life / maxLife));
    }
    
    // Skill text floating up
    if (textRef.current) {
      textRef.current.position.y += delta * 3;
      textRef.current.lookAt(0, 0, 10);
    }
  });

  const textOpacity = Math.max(0, 1 - (life / maxLife));

  return (
    <group position={position}>
      {/* Layered Fireballs with Additive Blending */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial color="#ffffff" transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={midRef}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial color="#ffdd00" transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial color="#ff4400" transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>

      {/* Shockwave Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 1, 32]} />
        <meshBasicMaterial color="#ffffff" transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>

      {/* Flying Sparks */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]}>
        <icosahedronGeometry args={[1, 0]}>
          <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
        </icosahedronGeometry>
        <meshBasicMaterial 
          vertexColors 
          transparent 
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </instancedMesh>
      
      {skillText && (
        <group ref={textRef} position={[0, 2, 0]}>
          <Text
            color="#FFE81F"
            fontSize={2}
            maxWidth={200}
            lineHeight={1}
            letterSpacing={0.02}
            textAlign="center"
            fillOpacity={textOpacity}
          >
            {skillText}
          </Text>
        </group>
      )}
    </group>
  );
};
