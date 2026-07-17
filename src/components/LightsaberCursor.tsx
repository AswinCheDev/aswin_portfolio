import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useTheme } from "next-themes";

export const LightsaberCursor = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const { resolvedTheme } = useTheme();
  
  const isLight = resolvedTheme === "light";

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Very snappy spring for the cursor to follow mouse closely
  const springConfig = { damping: 30, stiffness: 800, mass: 0.05 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Mobile detection: don't override cursor on touch devices
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    // Hide default cursor globally when this component mounts
    document.documentElement.style.cursor = 'none';
    
    // Add a style tag to override all cursors to none
    const style = document.createElement('style');
    style.id = 'lightsaber-cursor-style';
    style.innerHTML = `
      * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    const updatePosition = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
      
      const target = e.target as HTMLElement;
      
      // Because we override cursor: none, we check tags or common classes
      const isClickable = 
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') !== null ||
        target.closest('button') !== null ||
        target.onclick !== null ||
        target.getAttribute('role') === 'button';
        
      setIsPointer(isClickable);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", updatePosition);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      
      document.documentElement.style.cursor = '';
      const styleEl = document.getElementById('lightsaber-cursor-style');
      if (styleEl) styleEl.remove();
    };
  }, [isVisible, cursorX, cursorY]);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  const bladeColor = isLight ? "rgba(239, 68, 68" : "rgba(168, 85, 247"; // Red for light, Purple for dark

  const boxShadow = isClicked 
    ? `0 0 20px 8px ${bladeColor}, 0.9), 0 0 40px 16px ${bladeColor}, 0.6)`
    : (isPointer 
       ? `0 0 15px 6px ${bladeColor}, 0.8), 0 0 30px 12px ${bladeColor}, 0.5)`
       : `0 0 10px 4px ${bladeColor}, 0.7), 0 0 20px 8px ${bladeColor}, 0.4)`);

  const cursorContent = (
    <motion.div
      className={`pointer-events-none fixed top-0 left-0 z-[9999] ${isLight ? 'mix-blend-normal' : 'mix-blend-screen'}`}
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: "-50%",
        translateY: "-2px",
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div 
        className="relative flex flex-col items-center origin-top"
        style={{ transform: "rotate(-35deg)" }}
      >
        {/* Lightsaber Blade */}
        <motion.div
          animate={{
            height: isClicked ? 70 : (isPointer ? 60 : 45),
            boxShadow: boxShadow,
          }}
          className={`w-1.5 rounded-t-full relative origin-bottom ${isLight ? "bg-red-100" : "bg-white"}`}
          transition={{ duration: 0.15 }}
        >
        </motion.div>
        
        {/* Hilt */}
        <div className={`w-2.5 h-7 rounded-sm border shadow-sm relative z-10 flex flex-col items-center pt-1 ${
          isLight 
            ? "bg-gradient-to-b from-gray-700 via-gray-900 to-black border-gray-800" 
            : "bg-gradient-to-b from-gray-300 via-gray-400 to-gray-600 border-gray-500"
        }`}>
            <div className={`w-full h-0.5 mb-0.5 ${isLight ? "bg-gray-600/60" : "bg-black/60"}`}></div>
            <div className={`w-full h-0.5 mb-1 ${isLight ? "bg-gray-600/60" : "bg-black/60"}`}></div>
            <div className={`w-1.5 h-2 rounded-sm mt-0.5 border ${
              isLight 
                ? "bg-red-500 border-red-700 shadow-[0_0_2px_rgba(239,68,68,0.8)]" 
                : "bg-purple-500 border-purple-700 shadow-[0_0_2px_rgba(168,85,247,0.8)]"
            }`}></div>
        </div>
      </div>
    </motion.div>
  );

  // Portal the cursor to the body so it sits perfectly on top of any portals like Dialogs
  if (typeof document === 'undefined') return null;
  return createPortal(cursorContent, document.body);
};
