import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { HoloProjector } from "./HoloProjector";
import { HoloFormPanel } from "./HoloFormPanel";

// Traffic curve component
const TrafficCurve = ({ points, color, speed, count }: { points: THREE.Vector3[], color: string, speed: number, count: number }) => {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const vehicles = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      progress: Math.random(),
      speed: (Math.random() * 0.5 + 0.5) * speed,
    }));
  }, [count, speed]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    vehicles.forEach((vehicle, i) => {
      vehicle.progress += delta * vehicle.speed;
      if (vehicle.progress > 1) vehicle.progress = 0;
      
      const pos = curve.getPointAt(vehicle.progress);
      dummy.position.copy(pos);
      dummy.scale.set(0.2, 0.05, 0.6);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <boxGeometry />
        <meshBasicMaterial color={color} toneMapped={false} />
      </instancedMesh>
      <mesh>
        <tubeGeometry args={[curve, 64, 0.05, 8, false]} />
        <meshBasicMaterial color={color} transparent opacity={0.05} blending={THREE.AdditiveBlending} />
      </mesh>
    </>
  );
};

// Photorealistic Background Plane
const BackgroundPlane = () => {
  const texture = useTexture("/images/coruscant_bg.png");
  // Using a very large plane placed far back to cover the camera's FOV
  return (
    <mesh position={[0, 0, -40]} scale={[1.2, 1.2, 1]}>
      <planeGeometry args={[160, 90]} />
      {/* We use meshBasicMaterial so it doesn't get affected by the dim scene lights */}
      <meshBasicMaterial map={texture} toneMapped={false} transparent opacity={1.0} fog={false} />
    </mesh>
  );
};

const Scene = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    // Subtle mouse parallax for the whole background, but NOT the hologram
    if (groupRef.current) {
      const targetX = (state.pointer.x * Math.PI) / 20;
      const targetY = (state.pointer.y * Math.PI) / 20;
      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * 0.05;
    }
  });

  const curve1 = useMemo(() => [
    new THREE.Vector3(-30, -5, 10),
    new THREE.Vector3(-10, -2, -5),
    new THREE.Vector3(10, 2, -15),
    new THREE.Vector3(30, 5, -30),
  ], []);

  const curve2 = useMemo(() => [
    new THREE.Vector3(30, -10, 15),
    new THREE.Vector3(10, -5, 0),
    new THREE.Vector3(-10, 0, -10),
    new THREE.Vector3(-30, 5, -25),
  ], []);

  const curve3 = useMemo(() => [
    new THREE.Vector3(-20, 10, 5),
    new THREE.Vector3(0, 5, -5),
    new THREE.Vector3(20, -2, -15),
    new THREE.Vector3(40, -10, -35),
  ], []);

  return (
    <>
      <group ref={groupRef}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 20, 10]} intensity={1.5} color="#e2e8f0" />
        <directionalLight position={[-10, 10, -10]} intensity={1.0} color="#22d3ee" />
        <fog attach="fog" args={["#020617", 15, 60]} />
        
        <BackgroundPlane />
        
        <TrafficCurve points={curve1} color="#ff2a2a" speed={0.15} count={80} />
        <TrafficCurve points={curve3} color="#ff2a2a" speed={0.2} count={60} />
        <TrafficCurve points={curve2} color="#22d3ee" speed={0.18} count={100} />
      </group>

      {/* Hologram System */}
      <group position={[0, -2, -5]}>
         <HoloProjector position={[0, -6, 0]} />
         {/* The panel is above the projector */}
         <HoloFormPanel position={[0, 2, 0]} />
      </group>
    </>
  );
};

export const Coruscant3D = () => {
  return (
    <div className="absolute inset-0 w-full h-full z-0 bg-[#020617]">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <Scene />
        <EffectComposer disableNormalPass={false}>
          <Bloom luminanceThreshold={0.1} mipmapBlur intensity={1.5} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
