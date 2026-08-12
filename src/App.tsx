import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { lazy, Suspense } from "react";

const Index = lazy(() => import("./pages/Index"));
const Hero = lazy(() => import("@/components/Hero").then(m => ({ default: m.Hero })));
const About = lazy(() => import("@/components/About").then(m => ({ default: m.About })));
const Skills = lazy(() => import("@/components/Skills").then(m => ({ default: m.Skills })));
const Projects = lazy(() => import("@/components/Projects").then(m => ({ default: m.Projects })));
const Blog = lazy(() => import("@/components/Blog").then(m => ({ default: m.Blog })));
const Contact = lazy(() => import("@/components/Contact").then(m => ({ default: m.Contact })));

const LandingScene = lazy(() => import("./components/landing/LandingScene").then(m => ({ default: m.LandingScene })));
const GalaxyIntro = lazy(() => import("./components/landing/GalaxyIntro").then(m => ({ default: m.GalaxyIntro })));
import { motion, AnimatePresence } from "framer-motion";
import { Loader } from "@react-three/drei";
import { useGLTFWithKTX2 } from "./utils/useGLTFWithKTX2";
const queryClient = new QueryClient();

// Preload heavy models immediately in the background
useGLTFWithKTX2.preload('/assests/Models/30654_-_x-wing_starfighter.glb');
useGLTFWithKTX2.preload('/assests/Models/x-wing-t-65.glb');
useGLTFWithKTX2.preload('/assests/Models/r2-d2-animated.glb');

const App = () => {
  const [stage, setStage] = useState<'galaxy' | 'arcade' | 'arcade-transition' | 'portfolio'>('galaxy');

  const handleHyperspaceStart = () => {
    setStage('arcade-transition');
    // Preload JS chunks during hyperspace without mounting WebGL contexts
    import("./pages/Index");
    import("@/components/Hero");
    import("@/components/About");
    import("@/components/Skills");
    import("@/components/Projects");
    import("@/components/Blog");
    import("@/components/Contact");
  };

  // Preload audio and images for smoother transitions
  useEffect(() => {
    const audio = new Audio('/assests/sound/StarWars.mp3');
    audio.load();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Loader 
          containerStyles={{ zIndex: 9999, backgroundColor: '#0b0c10' }} 
          innerStyles={{ width: '300px' }} 
          barStyles={{ backgroundColor: '#22d3ee' }} 
          dataInterpolation={(p) => `Loading hyperspace routing... ${p.toFixed(0)}%`}
        />
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          {/* Black background wrapper to prevent white flashes during transitions */}
          <div className="bg-black min-h-screen w-full">
            <AnimatePresence>
              {stage === 'galaxy' && (
                <motion.div key="galaxy" className="absolute inset-0 z-50">
                  <Suspense fallback={null}>
                    <GalaxyIntro onFinish={() => setStage('arcade')} />
                  </Suspense>
                </motion.div>
              )}
              
              {(stage === 'arcade' || stage === 'arcade-transition') && (
                <motion.div key="arcade" className="absolute inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                  <Suspense fallback={null}>
                    <LandingScene 
                      onHyperspaceStart={handleHyperspaceStart}
                      onFinish={() => setStage('portfolio')} 
                    />
                  </Suspense>
                </motion.div>
              )}

              {stage === 'portfolio' && (
                <motion.div 
                  key="portfolio" 
                  className="relative z-10 bg-background min-h-screen"
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ duration: 2, ease: "easeInOut" }}
                >
                  <Suspense fallback={null}>
                    <Routes>
                      <Route path="/" element={<Index />}>
                        <Route index element={<Hero />} />
                        <Route path="about" element={<About />} />
                        <Route path="projects" element={<Projects />} />
                        <Route path="skills" element={<Skills />} />
                        <Route path="blog" element={<Blog />} />
                        <Route path="contact" element={<Contact />} />
                      </Route>
                    </Routes>
                  </Suspense>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
