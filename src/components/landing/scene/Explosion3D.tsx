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
  const textRef = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particleCount = 40; // Solid fragment chunks
  const [life, setLife] = useState(0);
  const maxLife = 2.0;

  const { positions, velocities, colors, rotations, spinSpeed } = useMemo(() => {
    const pos = [];
    const vel = [];
    const col = new Float32Array(particleCount * 3);
    const rot = [];
    const spin = [];
    
    // Mix of TIE Fighter hull colors and explosion fire
    const baseColors = [
      new THREE.Color('#e2e8f0'), // Hull silver
      new THREE.Color('#0a0a0a'), // Panel black
      new THREE.Color('#ff3333'), // Fire red
      new THREE.Color('#ffb700'), // Fire amber
    ];
    
    for (let i = 0; i < particleCount; i++) {
      pos.push(new THREE.Vector3((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2));
      
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = Math.random() * 15 + 5;
      
      vel.push(new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta) * speed,
        Math.sin(phi) * Math.sin(theta) * speed,
        Math.cos(phi) * speed
      ));

      rot.push(new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI));
      spin.push(new THREE.Vector3((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10));
      
      const c = baseColors[Math.floor(Math.random() * baseColors.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    
    return { positions: pos, velocities: vel, colors: col, rotations: rot, spinSpeed: spin };
  }, []);

  useFrame((_, delta) => {
    setLife((prev) => {
      const newLife = prev + delta;
      if (newLife >= maxLife) {
        onDespawn(id);
      }
      return newLife;
    });
    
    if (meshRef.current) {
      for (let i = 0; i < particleCount; i++) {
        // Move fragment
        positions[i].addScaledVector(velocities[i], delta);
        // Drag
        velocities[i].multiplyScalar(0.95);
        
        // Spin fragment
        rotations[i].x += spinSpeed[i].x * delta;
        rotations[i].y += spinSpeed[i].y * delta;
        rotations[i].z += spinSpeed[i].z * delta;
        
        // Shrink slightly as they cool off/fade
        const scale = Math.max(0, 1 - (life / maxLife));
        const baseScale = (i % 4 === 0) ? 0.6 : 0.3; // Some larger panels, some small shrapnel
        
        dummy.position.copy(positions[i]);
        dummy.rotation.copy(rotations[i]);
        dummy.scale.setScalar(scale * baseScale);
        dummy.updateMatrix();
        
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
      
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.opacity = Math.max(0, 1 - (life / maxLife));
    }
    
    if (textRef.current) {
      textRef.current.position.y += delta * 2;
      textRef.current.lookAt(0, 0, 10);
    }
  });

  const textOpacity = Math.max(0, 1 - (life / maxLife));

  return (
    <group position={position}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]}>
        <boxGeometry args={[1, 1, 1]}>
          <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
        </boxGeometry>
        <meshStandardMaterial 
          vertexColors 
          transparent 
          roughness={0.8}
          metalness={0.5}
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
