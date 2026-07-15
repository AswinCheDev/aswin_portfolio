import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import { LandingScene } from "./components/landing/LandingScene";
import { GalaxyIntro } from "./components/landing/GalaxyIntro";
import { motion, AnimatePresence } from "framer-motion";
const queryClient = new QueryClient();

const App = () => {
  const [stage, setStage] = useState<'galaxy' | 'arcade' | 'portfolio'>('portfolio');

  // Preload audio and images for smoother transitions
  useEffect(() => {
    const audio = new Audio('/assests/sound/StarWars.mp3');
    audio.load();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* Black background wrapper to prevent white flashes during transitions */}
        <div className="bg-black min-h-screen w-full">
          <AnimatePresence mode="wait">
            {stage === 'galaxy' && (
              <motion.div key="galaxy" className="absolute inset-0">
                <GalaxyIntro onFinish={() => setStage('arcade')} />
              </motion.div>
            )}
            
            {stage === 'arcade' && (
              <motion.div key="arcade" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                <LandingScene onFinish={() => setStage('portfolio')} />
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
                <Index />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
