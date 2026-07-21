import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { getChunkMapping } from '../../utils/xwingChunks';

interface XWingAssemblerProps {
  equippedIds: string[];
  modules: any[];
  animatingBlocks: Record<string, DOMRect>;
  onAnimationComplete: (id: string) => void;
  onToggleEquip: (id: string, e?: any) => void;
  mouseX: any;
  mouseY: any;
}

// 21 modules total. We'll group meshes into 21 chunks.
export function XWingAssembler({ equippedIds, modules, animatingBlocks, onAnimationComplete, onToggleEquip, mouseX, mouseY }: XWingAssemblerProps) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/assests/Models/30654_-_x-wing_starfighter.glb');
  const { camera, viewport } = useThree();

  const isMobile = viewport.width < viewport.height;
  const groupX = isMobile ? 0 : (viewport.width / 4) * 0.85;
  const groupY = isMobile ? -(viewport.height / 4) : -2;

  // Extract all meshes and assign original materials so we can swap them for the glow effect
  const allMeshes = useMemo(() => {
    const meshes: THREE.Mesh[] = [];
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (!mesh.userData.originalMaterial) {
          mesh.userData.originalMaterial = mesh.material;
          
          // Create the "glow" material mimicking the hover effect of the lego block
          const glowMat = new THREE.MeshStandardMaterial({
            color: '#ccff00',
            emissive: '#ccff00',
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.9,
            roughness: 0.1,
            metalness: 0.8,
          });
          mesh.userData.glowMaterial = glowMat;
        }
        meshes.push(mesh);
      }
    });
    return meshes;
  }, [scene]);

  // Map each module to a chunk of meshes
  const chunkMapping = useMemo(() => {
    return getChunkMapping(allMeshes, modules.map(m => m.id));
  }, [allMeshes, modules]);

  // Keep track of animation states
  // We'll mutate these directly in useFrame for performance
  const animationState = useRef<Record<string, {
    progress: number;
    startPos: THREE.Vector3;
    startRot: THREE.Euler;
    isEquipping: boolean;
  }>>({});

  // When animatingBlocks changes, initialize animations
  useEffect(() => {
    Object.entries(animatingBlocks).forEach(([id, rect]) => {
      if (!animationState.current[id]) {
        // Convert screen coordinates to 3D world coordinates
        // Center of the clicked DOM element
        const x = (rect.left + rect.width / 2);
        const y = (rect.top + rect.height / 2);

        // Map to normalized device coordinates (-1 to +1)
        const ndcX = (x / window.innerWidth) * 2 - 1;
        const ndcY = -(y / window.innerHeight) * 2 + 1;

        // Unproject to get world position (assuming z = 0 is our plane)
        const vec = new THREE.Vector3(ndcX, ndcY, 0.5);
        vec.unproject(camera);
        vec.sub(camera.position).normalize();
        
        // Find intersection with z=0 plane
        const distance = -camera.position.z / vec.z;
        const pos = new THREE.Vector3().copy(camera.position).add(vec.multiplyScalar(distance));
        
        const isEquipped = equippedIds.includes(id);
        
        animationState.current[id] = {
          progress: 0,
          startPos: pos,
          startRot: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
          isEquipping: isEquipped // If it's in equippedIds now, it means we just clicked to equip it
        };
      }
    });
  }, [animatingBlocks, camera, equippedIds]);

  useFrame((state, delta) => {
    const speed = 2.0; // Animation speed

    // Rotate the whole X-Wing based on mouse position to mimic the parallax effect
    if (group.current) {
      const mx = (mouseX.get() / 100) * 2 - 1; // -1 to 1
      const my = (mouseY.get() / 100) * 2 - 1; // -1 to 1
      
      const targetRotY = mx * 0.5;
      const targetRotX = my * -0.5;
      
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotY, 0.1);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotX, 0.1);
    }

    modules.forEach((module) => {
      const meshes = chunkMapping[module.id];
      const isEquipped = equippedIds.includes(module.id);
      const anim = animationState.current[module.id];

      meshes.forEach((mesh) => {
        if (!mesh.userData.originalPosition) {
          mesh.userData.originalPosition = mesh.position.clone();
          mesh.userData.originalRotation = mesh.rotation.clone();
          mesh.userData.originalScale = mesh.scale.clone();
        }

        // Default state if not animating
        if (!anim) {
          if (isEquipped) {
            mesh.position.copy(mesh.userData.originalPosition);
            mesh.rotation.copy(mesh.userData.originalRotation);
            
            // Hover effect on equipped pieces
            if (mesh.userData.isHovered) {
              mesh.scale.copy(mesh.userData.originalScale).multiplyScalar(1.05);
              mesh.material = mesh.userData.glowMaterial;
            } else {
              mesh.scale.copy(mesh.userData.originalScale);
              mesh.material = mesh.userData.originalMaterial;
            }
            mesh.visible = true;
          } else {
            mesh.visible = false;
          }
        } else {
          // It's animating
          anim.progress += delta * speed;
          mesh.visible = true;
          mesh.material = mesh.userData.glowMaterial; // Apply hover-like glow during flight

          if (anim.progress >= 1) {
            anim.progress = 1;
            // Finish animation
            if (anim.isEquipping) {
              mesh.position.copy(mesh.userData.originalPosition);
              mesh.rotation.copy(mesh.userData.originalRotation);
              mesh.scale.copy(mesh.userData.originalScale);
              mesh.material = mesh.userData.originalMaterial;
            } else {
              mesh.visible = false;
            }
            // Trigger complete only once per module (we just check the first mesh)
            if (mesh === meshes[0]) {
              onAnimationComplete(module.id);
              delete animationState.current[module.id];
            }
          } else {
            // Lerp based on progress
            // Easing function: cubic out
            const t = 1 - Math.pow(1 - anim.progress, 3);
            
            // Note: Since we rotate the parent group for parallax, we need to convert world startPos to local startPos
            const localStart = anim.startPos.clone();
            if (group.current) {
              group.current.worldToLocal(localStart);
            }

            if (anim.isEquipping) {
              // Fly in from startPos to originalPosition
              mesh.position.lerpVectors(localStart, mesh.userData.originalPosition, t);
              
              // Slerp rotation
              const qStart = new THREE.Quaternion().setFromEuler(anim.startRot);
              const qEnd = new THREE.Quaternion().setFromEuler(mesh.userData.originalRotation);
              mesh.quaternion.slerpQuaternions(qStart, qEnd, t);
              
              mesh.scale.lerpVectors(new THREE.Vector3(0,0,0), mesh.userData.originalScale, t);
            } else {
              // Fly out from originalPosition to startPos
              mesh.position.lerpVectors(mesh.userData.originalPosition, localStart, t);
              
              const qStart = new THREE.Quaternion().setFromEuler(mesh.userData.originalRotation);
              const qEnd = new THREE.Quaternion().setFromEuler(anim.startRot);
              mesh.quaternion.slerpQuaternions(qStart, qEnd, t);
              
              mesh.scale.lerpVectors(mesh.userData.originalScale, new THREE.Vector3(0,0,0), t);
            }
          }
        }
      });
    });
  });

  return (
    <group ref={group} scale={[0.035, 0.035, 0.035]} position={[groupX, groupY, 0]}>
      <primitive 
        object={scene} 
        onPointerDown={(e: any) => {
          e.stopPropagation();
          const mesh = e.object;
          // Find which module this mesh belongs to
          const moduleId = Object.keys(chunkMapping).find(key => chunkMapping[key].includes(mesh));
          if (moduleId) {
            const isEquipped = equippedIds.includes(moduleId);
            const isAnimating = !!animationState.current[moduleId];
            if (isEquipped && !isAnimating) {
              onToggleEquip(moduleId);
            }
          }
        }}
        onPointerMove={(e: any) => {
          e.stopPropagation();
          const mesh = e.object;
          const moduleId = Object.keys(chunkMapping).find(key => chunkMapping[key].includes(mesh));
          
          // Clear all first
          Object.keys(chunkMapping).forEach(key => {
            chunkMapping[key].forEach(m => m.userData.isHovered = false);
          });

          if (moduleId) {
            const isEquipped = equippedIds.includes(moduleId);
            const isAnimating = !!animationState.current[moduleId];
            if (isEquipped && !isAnimating) {
              document.body.style.cursor = 'pointer';
              chunkMapping[moduleId].forEach(m => m.userData.isHovered = true);
              return;
            }
          }
          
          document.body.style.cursor = 'auto';
        }}
        onPointerOut={(e: any) => {
          e.stopPropagation();
          document.body.style.cursor = 'auto';
          Object.keys(chunkMapping).forEach(key => {
            chunkMapping[key].forEach(m => m.userData.isHovered = false);
          });
        }}
      />
    </group>
  );
}

useGLTF.preload('/assests/Models/30654_-_x-wing_starfighter.glb');
