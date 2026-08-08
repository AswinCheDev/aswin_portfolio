import { useState, useEffect, useRef, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { StarField } from './landing/scene/StarField';
import { HyperspaceGLTFXWing } from './landing/scene/HyperspaceGLTFXWing';

export const PageTransition = () => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setIsTransitioning(true);
    
    // Keep hyperspace effect for 2.5 seconds, acting as a load balancer/transition
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-[#0A192F]"
          >
          <Canvas camera={{ position: [0, 0, 10], fov: 75 }} gl={{ preserveDrawingBuffer: true, powerPreference: "high-performance" }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 20, 20]} intensity={2.5} />
            <StarField count={500} isHyperspace={true} />
            <Suspense fallback={null}>
              <HyperspaceGLTFXWing />
            </Suspense>
          </Canvas>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
