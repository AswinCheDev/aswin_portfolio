import React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

// --- A function to create a low-poly "bug" ---
const createBug = (): THREE.Group => {
  const bugGroup = new THREE.Group();

  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x9370DB, // Static purple color
    wireframe: true,
  });

  const bodyGeometry = new THREE.BoxGeometry(0.6, 0.2, 1);
  const body = new THREE.Mesh(bodyGeometry, wireframeMaterial);
  bugGroup.add(body);

  const wingGeometry = new THREE.PlaneGeometry(0.8, 0.8);
  const leftWing = new THREE.Mesh(wingGeometry, wireframeMaterial);
  leftWing.position.set(-0.5, 0.1, 0);
  leftWing.name = 'leftWing';
  bugGroup.add(leftWing);

  const rightWing = new THREE.Mesh(wingGeometry, wireframeMaterial);
  rightWing.position.set(0.5, 0.1, 0);
  rightWing.name = 'rightWing';
  bugGroup.add(rightWing);

  return bugGroup;
};

// --- Three.js Scene Component for multiple bugs ---
const BugScene = ({ numBugs, onBugKilled, cursorPos }: { numBugs: number, onBugKilled: () => void, cursorPos: { x: number, y: number } }) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const cursorPosRef = useRef(cursorPos);
    const animationFrameId = useRef<number>();

    // Keep the ref updated with the latest cursor position
    useEffect(() => {
        cursorPosRef.current = cursorPos;
    }, [cursorPos]);

    useEffect(() => {
        if (!mountRef.current) return;
        const currentMount = mountRef.current;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.domElement.style.pointerEvents = 'none';
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        currentMount.appendChild(renderer.domElement);
        
        camera.position.z = 10;

        const bugs: THREE.Group[] = [];
        for (let i = 0; i < numBugs; i++) {
          const bug = createBug();
          bug.position.set((Math.random() - 0.5) * 15, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5);
          bug.userData = {
            isAlive: true,
            timeOffset: Math.random() * 100,
            speedFactor: 0.24 + Math.random() * 0.24,
          };
          scene.add(bug);
          bugs.push(bug);
        }

        const clock = new THREE.Clock();
        const worldCursorPos = new THREE.Vector3();

        const animate = () => {
            animationFrameId.current = requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            const vec = new THREE.Vector3(
              (cursorPosRef.current.x / window.innerWidth) * 2 - 1,
              -(cursorPosRef.current.y / window.innerHeight) * 2 + 1,
              0.5
            );
            vec.unproject(camera);
            const dir = vec.sub(camera.position).normalize();
            const distance = -camera.position.z / dir.z;
            worldCursorPos.copy(camera.position).add(dir.multiplyScalar(distance));

            bugs.forEach(bug => {
                if (bug.userData.isAlive) {
                    const { timeOffset, speedFactor } = bug.userData;
                    const time = elapsedTime * speedFactor + timeOffset;
                    bug.position.x = Math.sin(time * 0.7) * 7;
                    bug.position.y = Math.cos(time * 0.5) * 5;
                    bug.rotation.z += 0.005 * speedFactor;

                    const leftWing = bug.getObjectByName("leftWing") as THREE.Mesh;
                    const rightWing = bug.getObjectByName("rightWing") as THREE.Mesh;
                    if (leftWing && rightWing) {
                      const wingTime = elapsedTime * 30 * speedFactor;
                      leftWing.rotation.y = Math.sin(wingTime) * 0.5;
                      rightWing.rotation.y = -Math.sin(wingTime) * 0.5;
                    }

                    const distanceToCursor = bug.position.distanceTo(worldCursorPos);
                    if (distanceToCursor < 1.2) {
                        bug.userData.isAlive = false;
                        bug.visible = false;
                        onBugKilled();
                    }
                }
            });

            renderer.render(scene, camera);
        };
        
        const handleResize = () => {
            if (currentMount) {
                renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
                camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
                camera.updateProjectionMatrix();
            }
        };
        
        window.addEventListener('resize', handleResize);
        animate();

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
            window.removeEventListener('resize', handleResize);
            if (currentMount && renderer.domElement) {
                currentMount.removeChild(renderer.domElement);
            }
        };
    }, [numBugs, onBugKilled]);

    return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />;
};

// --- Main Landing Screen Component ---
const LandingScreen = ({ onFinish }: { onFinish: () => void }) => {
    const [typingFinished, setTypingFinished] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
    const [bugsKilled, setBugsKilled] = useState(0);
    const numBugs = 5;

    const handleSkip = () => {
      setFadeOut(true);
      setTimeout(onFinish, 1000);
    };

    // Win Condition Effect: Enters portfolio when ALL bugs are killed
    useEffect(() => {
        if (bugsKilled === numBugs) {
            setTimeout(() => {
                handleSkip();
            }, 500); // Short delay for satisfaction
        }
    }, [bugsKilled]);
    
    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            setCursorPos({ x: event.clientX, y: event.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);
    
    const onBugKilled = useCallback(() => {
        setBugsKilled(prev => prev + 1);
    }, []);

    const line1 = "HELLO WORLD !!";
    const line2 = "ASWIN CHETTRI HERE";
    const sentence = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.5, staggerChildren: 0.08 }}};
    const letter = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }};

    return (
      <AnimatePresence>
        {!fadeOut && (
            <motion.div 
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="fixed inset-0 bg-background flex items-center justify-center z-50 cursor-none"
            >
                <style>{`@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'); .font-pixel-code { font-family: 'Press Start 2P', cursive; }`}</style>
                
                <BugScene numBugs={numBugs} onBugKilled={onBugKilled} cursorPos={cursorPos} />

                {/* UI elements container */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                  <motion.div className="absolute w-24 h-24 border-2 border-dashed border-gray-500 rounded-full z-40" animate={{ x: cursorPos.x - 48, y: cursorPos.y - 48 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />

                  <div className="absolute top-5 right-5 font-pixel-code text-gray-400 text-lg z-50">
                    BUGS REMAINING: {numBugs - bugsKilled}
                  </div>

                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                      <motion.h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-pixel-code mb-10 text-yellow-400" variants={sentence} initial="hidden" animate="visible">
                          {line1.split("").map((char, index) => <motion.span key={char + "-" + index} variants={letter}>{char}</motion.span>)}
                      </motion.h1>
                      <motion.h2 className="text-2xl md:text-3xl lg:text-4xl font-pixel-code text-gray-400 uppercase" variants={sentence} initial="hidden" animate="visible" transition={{ delay: 0.8 }} onAnimationComplete={() => setTypingFinished(true)}>
                          {line2.split("").map((char, index) => <motion.span key={char + "-" + index} variants={letter}>{char}</motion.span>)}
                      </motion.h2>
                  </div>

                  <motion.button 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: 1.5, duration: 1 }} 
                    onClick={handleSkip} 
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 font-pixel-code text-black font-bold text-lg py-2 px-6 bg-lime-400 rounded-lg shadow-lg hover:bg-lime-500 transition-colors z-50 pointer-events-auto cursor-pointer"
                  >
                    [ VIEW PORTFOLIO ]
                  </motion.button>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    );
};

export default LandingScreen;

