import { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { StarField } from './landing/scene/StarField';
import { HyperspaceGLTFXWing } from './landing/scene/HyperspaceGLTFXWing';

interface PageTransitionProps {
  isTransitioning?: boolean;
}

export const PageTransition = ({ isTransitioning = false }: PageTransitionProps) => {

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isTransitioning ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed inset-0 z-50 bg-[#0A192F] ${isTransitioning ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      {isTransitioning && (
        <Canvas 
          camera={{ position: [0, 0, 10], fov: 75 }} 
          gl={{ preserveDrawingBuffer: true, powerPreference: "high-performance" }}
          frameloop="always"
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 20, 20]} intensity={2.5} />
          <StarField count={500} isHyperspace={true} />
          <Suspense fallback={null}>
            <HyperspaceGLTFXWing />
          </Suspense>
        </Canvas>
      )}
    </motion.div>
  );
};
