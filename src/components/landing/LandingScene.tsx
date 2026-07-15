import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { StarField } from './scene/StarField';
import { EnemyShip } from './scene/EnemyShip';
import { LaserBolt } from './scene/LaserBolt';
import { Explosion3D } from './scene/Explosion3D';
import { PlayerShip } from './scene/PlayerShip';
import { AudioManager } from './managers/AudioManager';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

// Controller that handles shooting and hit detection using the live scene graph
const ShootController = ({ enemies, setEnemies, setExplosions, onKill, lasers, setLasers, totalBugs }: any) => {
  const { camera, mouse, scene } = useThree();
  const raycasterRef = useRef(new THREE.Raycaster());
  
  const skills = useRef(['TypeScript +1', 'React +1', 'Python +1', 'AI/ML +1', 'System Design +1', 'Node.js +1', 'AWS +1', 'Docker +1', 'GraphQL +1', 'SQL +1']);

  const handleFire = useCallback(() => {
    if (lasers.length >= 3) return;
    
    // Spawn lasers from the X-Wing's approximate wing positions
    const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const target = camera.position.clone().add(dir.multiplyScalar(distance));
    
    // Spawn from the bottom corners of the screen (approximate wing positions)
    const leftStart = new THREE.Vector3(-2, -2, 7);
    const rightStart = new THREE.Vector3(2, -2, 7);
    
    // Fire twin lasers
    const newLaser1 = {
      id: Math.random().toString(36).substring(7) + 'L',
      start: leftStart,
      target: target
    };
    const newLaser2 = {
      id: Math.random().toString(36).substring(7) + 'R',
      start: rightStart,
      target: target
    };
    setLasers((prev: any) => [...prev, newLaser1, newLaser2]);
    AudioManager.playShoot();

    // Set up raycaster from camera through mouse
    raycasterRef.current.setFromCamera(mouse, camera);
    
    // Find all TIE Fighter groups in the scene by looking for userData.id
    const hitRadius = 5.0; // Generous hit radius in world units
    let hitEnemyId: string | null = null;
    let hitPos: THREE.Vector3 | null = null;
    
    // Walk the scene to find groups with userData.id matching an enemy
    const enemyIds = new Set(enemies.map((e: any) => e.id));
    
    scene.traverse((child) => {
      if (hitEnemyId) return; // Already found a hit
      if (child.userData && child.userData.id && enemyIds.has(child.userData.id)) {
        // Get the ACTUAL world position of this TIE Fighter
        const worldPos = new THREE.Vector3();
        child.getWorldPosition(worldPos);
        
        // Check distance from the ray to this world position
        const distSq = raycasterRef.current.ray.distanceSqToPoint(worldPos);
        
        if (distSq < hitRadius * hitRadius) {
          hitEnemyId = child.userData.id;
          hitPos = worldPos.clone();
        }
      }
    });

    if (hitEnemyId && hitPos) {
      // Remove enemy from state
      setEnemies((prev: any) => prev.filter((e: any) => e.id !== hitEnemyId));
      
      const remaining = enemies.length - 1;
      const skillIndex = (totalBugs - remaining - 1) % skills.current.length;
      
      // Spawn explosion at the ACTUAL hit position
      const newExplosion = {
        id: Math.random().toString(36).substring(7),
        position: [hitPos.x, hitPos.y, hitPos.z] as [number, number, number],
        skillText: skills.current[skillIndex]
      };
      setExplosions((prev: any) => [...prev, newExplosion]);
      
      AudioManager.playExplosion();
      onKill(remaining);
    }

  }, [camera, mouse, scene, lasers, setLasers, enemies, setEnemies, setExplosions, onKill, totalBugs]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      // Don't fire if clicking a UI button (pointer-events-auto elements)
      if ((e.target as HTMLElement).tagName === 'BUTTON') return;
      handleFire();
    };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [handleFire]);

  return null;
};

interface LandingSceneProps {
  onFinish: () => void;
}

export const LandingScene = ({ onFinish }: LandingSceneProps) => {
  const totalBugs = 25;
  const [bugsRemaining, setBugsRemaining] = useState(totalBugs);
  const [isComplete, setIsComplete] = useState(false);
  const [transitionState, setTransitionState] = useState(0); 

  const [enemies, setEnemies] = useState<any[]>([]);
  const [lasers, setLasers] = useState<any[]>([]);
  const [explosions, setExplosions] = useState<any[]>([]);
  const [mousePos, setMousePos] = useState({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 });

  // Track mouse for reticle
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Initialize enemies
  useEffect(() => {
    AudioManager.init();
    AudioManager.playBoot();

    const colors = ['#64FFDA', '#FF6B00']; // Teal and Orange
    const initialEnemies = Array.from({ length: totalBugs }).map((_, i) => ({
      id: `enemy-${i}`,
      position: [
        (Math.random() - 0.5) * 40, // x spread
        (Math.random() - 0.5) * 20, // y spread
        (Math.random() - 0.5) * 10 - 15 // z spread (in front of camera)
      ],
      color: colors[i % colors.length]
    }));
    setEnemies(initialEnemies);
  }, [totalBugs]);

  // Handle last bug warning
  useEffect(() => {
    if (bugsRemaining === 1 && !isComplete) {
      AudioManager.playWarning();
    }
  }, [bugsRemaining, isComplete]);

  const handleKill = (remaining: number) => {
    setBugsRemaining(remaining);
    if (remaining === 0) {
      setIsComplete(true);
      AudioManager.playJingle();
    }
  };

  // Transitions
  useEffect(() => {
    if (isComplete) {
      setTimeout(() => setTransitionState(1), 500); 
      setTimeout(() => setTransitionState(2), 1500); 
      setTimeout(() => setTransitionState(3), 2500); 
      setTimeout(() => {
        setTransitionState(4);
        setTimeout(onFinish, 1000); 
      }, 3500);
    }
  }, [isComplete, onFinish]);

  const progressChars = Math.floor(((totalBugs - bugsRemaining) / totalBugs) * 10);
  const progressStr = '█'.repeat(progressChars) + '□'.repeat(10 - progressChars);
  const isWarning = bugsRemaining === 1;

  const handleSkip = () => {
    // Clear remaining enemies as we jump away
    setEnemies([]);
    // Trigger the cinematic hyperspace sequence
    setIsComplete(true);
    AudioManager.playJingle();
  };

  return (
    <AnimatePresence>
      {transitionState < 4 && (
        <motion.div 
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 bg-[#0A192F] z-50 cursor-none overflow-hidden"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Share+Tech+Mono&display=swap');
            
            .sci-fi-title {
              font-family: 'Orbitron', sans-serif;
              letter-spacing: 0.15em;
            }
            
            .targeting-text {
              font-family: 'Share Tech Mono', monospace;
              color: #ff3333; /* Targeting Computer Red */
              text-shadow: 0 0 8px rgba(255, 51, 51, 0.6);
            }

            .targeting-amber {
              color: #ffb700;
              text-shadow: 0 0 8px rgba(255, 183, 0, 0.6);
            }
            
            /* Scanline overlay */
            .scanlines {
              background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1));
              background-size: 100% 4px;
              pointer-events: none;
            }
            
            .targeting-brackets {
              position: relative;
              border: 1px solid rgba(255, 51, 51, 0.2);
            }
            .targeting-brackets::before, .targeting-brackets::after {
              content: '';
              position: absolute;
              width: 30px;
              height: 30px;
              border: 3px solid #ff3333;
              pointer-events: none;
            }
            .targeting-brackets::before { top: -2px; left: -2px; border-right: none; border-bottom: none; }
            .targeting-brackets::after { bottom: -2px; right: -2px; border-left: none; border-top: none; }
          `}</style>
          
          <div className="absolute inset-0 z-0 scanlines opacity-50"></div>
          
          <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[10, 20, 20]} intensity={2.5} castShadow />
              <pointLight position={[-10, -10, 10]} intensity={1} color="#64FFDA" />
              
              <StarField count={3000} isHyperspace={transitionState >= 2} />
              
              {enemies.map((e) => (
                <EnemyShip 
                  key={e.id} 
                  id={e.id} 
                  position={e.position as [number, number, number]} 
                  color={e.color} 
                  isLast={enemies.length === 1}
                  onDestroy={() => {}} 
                />
              ))}
              
              {lasers.map((l) => (
                <LaserBolt 
                  key={l.id} 
                  id={l.id} 
                  start={l.start} 
                  target={l.target} 
                  onDespawn={(id) => setLasers(prev => prev.filter(x => x.id !== id))} 
                />
              ))}
              
              {explosions.map((e) => (
                <Explosion3D 
                  key={e.id} 
                  id={e.id} 
                  position={e.position as [number, number, number]} 
                  skillText={e.skillText}
                  onDespawn={(id) => setExplosions(prev => prev.filter(x => x.id !== id))} 
                />
              ))}
              
              <PlayerShip />
              
              <ShootController 
                enemies={enemies} 
                setEnemies={setEnemies}
                setExplosions={setExplosions}
                lasers={lasers}
                setLasers={setLasers}
                onKill={handleKill}
                totalBugs={totalBugs}
              />


            </Canvas>
          </div>

          {/* Moving Targeting Reticle */}
          <div 
            className="fixed flex items-center justify-center pointer-events-none z-10 opacity-60"
            style={{ 
              left: mousePos.x, 
              top: mousePos.y,
              transform: 'translate(-50%, -50%)',
              width: '256px',
              height: '256px'
            }}
          >
            <div className="absolute inset-0 border border-[#ff3333] rounded-full animate-[spin_10s_linear_infinite]">
              <div className="absolute top-0 left-1/2 w-4 h-4 border-l-2 border-[#ff3333] -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-1/2 w-4 h-4 border-r-2 border-[#ff3333] -translate-x-1/2 translate-y-1/2" />
              <div className="absolute left-0 top-1/2 w-4 h-4 border-b-2 border-[#ff3333] -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute right-0 top-1/2 w-4 h-4 border-t-2 border-[#ff3333] translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="absolute w-32 h-32 border-2 border-[#ff3333] rounded-full opacity-50" />
            <div className="absolute w-2 h-2 bg-[#ff3333] rounded-full animate-pulse" />
          </div>

          {/* Top Right Pilot Identity HUD */}
          <div className="fixed top-8 right-8 flex flex-col items-end pointer-events-none z-20 select-none">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="border-r-4 border-[#ffb700] pr-4 py-1 text-right"
            >
              <h1 className="text-xl md:text-3xl text-white font-bold sci-fi-title mb-1 uppercase" style={{ textShadow: "0 0 15px rgba(255,255,255,0.4)" }}>
                ASWIN CHETTRI
              </h1>
              <h2 className="text-xs md:text-sm text-[#ff3333] font-mono tracking-[0.3em] uppercase opacity-90">
                SOFTWARE DEVELOPER // RED LEADER
              </h2>
            </motion.div>
          </div>

          {/* HUD Overlay */}
          <div className="fixed inset-0 z-20 pointer-events-none">
            {/* Top Left HUD (Targeting Computer) */}
            <div className={`absolute top-8 left-8 w-72 md:w-80 p-6 bg-[#000000]/60 backdrop-blur-sm targeting-brackets
              ${isWarning ? 'shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'shadow-[0_0_15px_rgba(255,51,51,0.1)]'}`}>
              
              <div className="flex flex-col space-y-4 targeting-text text-sm tracking-widest">
                <div className="flex justify-between items-end border-b border-[#ff3333]/30 pb-2">
                  <span className="opacity-80">TARGET LOCK</span>
                  <span className={`text-2xl font-bold ${isWarning ? 'animate-pulse' : ''}`}>
                    [ {bugsRemaining.toString().padStart(2, '0')} ]
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs opacity-80">
                    <span>DISTANCE</span>
                    <span className="targeting-amber">{Math.floor(((totalBugs - bugsRemaining) / totalBugs) * 1000)}m</span>
                  </div>
                  <div className="w-48 h-3 bg-black border border-[#ff3333]/50 relative overflow-hidden">
                    <motion.div 
                      className="absolute top-0 left-0 h-full bg-[#ff3333]"
                      initial={{ width: 0 }}
                      animate={{ width: `${((totalBugs - bugsRemaining) / totalBugs) * 100}%` }}
                      style={{ boxShadow: '0 0 10px #ff3333' }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {isWarning && !isComplete && (
                  <div className="mt-2 text-center text-sm font-bold animate-pulse tracking-[0.2em]">
                    STAY ON TARGET...
                  </div>
                )}
              </div>
            </div>

            {/* Skip Button (X-Wing style) */}
            {!isComplete && (
              <motion.button 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                onClick={handleSkip}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 group pointer-events-auto cursor-pointer"
              >
                <div className="relative px-12 py-3 bg-black/60 backdrop-blur-sm border-2 border-[#ffb700]/70 overflow-hidden transition-all duration-300 hover:bg-[#ffb700]/20 hover:border-[#ffe81f] hover:shadow-[0_0_20px_rgba(255,183,0,0.5)]">
                  <span className="relative z-10 targeting-amber font-bold text-lg tracking-[0.2em] transition-colors group-hover:text-[#ffe81f]">
                    JUMP TO HYPERSPACE
                  </span>
                </div>
              </motion.button>
            )}

          {/* Completion Transitions */}
            <AnimatePresence>
              {isComplete && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center z-30"
                >
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative px-16 py-8 border-2 border-[#ff3333] bg-[#000000]/80 backdrop-blur-sm shadow-[0_0_50px_rgba(255,51,51,0.4)]"
                  >
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#ffb700]" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#ffb700]" />
                    
                    <h1 className="text-3xl md:text-5xl text-[#ffb700] mb-8 font-bold text-center uppercase sci-fi-title" style={{ textShadow: "0 0 20px rgba(255, 183, 0, 0.4)" }}>
                      THE FORCE IS STRONG
                    </h1>
                    
                    <div className="flex flex-col items-center justify-center space-y-4 targeting-text text-sm md:text-base font-mono tracking-widest uppercase">
                    {transitionState >= 1 && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        &gt; TIE Fighters Neutralized.
                      </motion.div>
                    )}
                    {transitionState >= 2 && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        &gt; Jumping to Hyperspace...
                      </motion.div>
                    )}
                    {transitionState >= 3 && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="animate-pulse targeting-amber font-bold">
                        &gt; Arriving at Destination
                      </motion.div>
                    )}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
