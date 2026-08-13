import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { SpaceBackground } from "@/components/ui/SpaceBackground";
import { PageTransition } from "@/components/PageTransition";
import { LightsaberCursor } from "@/components/LightsaberCursor";
import { useState, useEffect, useRef, createContext } from "react";

export const PageTransitionContext = createContext<boolean>(false);

const Index = () => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setIsTransitioning(true);
    
    // Keep hyperspace effect for 2.5 seconds
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Derive isCanvasSafe from isTransitioning, but with a delay when it ends to wait for the exit animation (300ms)
  const [isCanvasSafe, setIsCanvasSafe] = useState(true);
  useEffect(() => {
    if (isTransitioning) {
      setIsCanvasSafe(false);
    } else {
      const timer = setTimeout(() => setIsCanvasSafe(true), 400);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  return (
    <PageTransitionContext.Provider value={!isCanvasSafe}>
      <div className="min-h-screen relative">
        <SpaceBackground />
        <Navbar />
        <PageTransition isTransitioning={isTransitioning} />
        <LightsaberCursor hidden={isTransitioning} />
        <Outlet />
      </div>
    </PageTransitionContext.Provider>
  );
};

export default Index;
