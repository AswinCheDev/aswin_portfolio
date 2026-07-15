import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const JediCompassIcon = () => (
  <svg viewBox="0 0 100 100" className="w-14 h-14 relative z-10 drop-shadow-lg">
    {/* Constellation web (faint dark etchings) */}
    <g stroke="rgba(0,0,0,0.4)" strokeWidth="0.5" fill="none">
      <path d="M 20 30 L 40 20 L 70 30 L 80 50 L 60 70 L 30 80 Z" />
      <path d="M 40 20 L 50 50 L 70 30" />
      <path d="M 30 80 L 50 50 L 80 50" />
      <path d="M 20 30 L 50 50" />
      <path d="M 60 70 L 50 50" />
      <circle cx="20" cy="30" r="1.5" fill="rgba(0,0,0,0.6)" />
      <circle cx="40" cy="20" r="2" fill="rgba(0,0,0,0.6)" />
      <circle cx="70" cy="30" r="1.5" fill="rgba(0,0,0,0.6)" />
      <circle cx="80" cy="50" r="2" fill="rgba(0,0,0,0.6)" />
      <circle cx="60" cy="70" r="1.5" fill="rgba(0,0,0,0.6)" />
      <circle cx="30" cy="80" r="2" fill="rgba(0,0,0,0.6)" />
      <circle cx="50" cy="50" r="1.5" fill="rgba(0,0,0,0.6)" />
    </g>

    {/* 3 Metallic Prongs */}
    <g stroke="#1f2937" strokeWidth="4" strokeLinecap="round">
      {/* Top Leftish (10 o'clock) */}
      <line x1="50" y1="50" x2="25" y2="30" />
      <circle cx="25" cy="30" r="3.5" fill="#1f2937" stroke="none" />
      
      {/* Top Rightish (2 o'clock) */}
      <line x1="50" y1="50" x2="80" y2="40" />
      <circle cx="80" cy="40" r="3.5" fill="#1f2937" stroke="none" />
      
      {/* Bottom (7 o'clock) */}
      <line x1="50" y1="50" x2="40" y2="80" />
      <circle cx="40" cy="80" r="3.5" fill="#1f2937" stroke="none" />
    </g>

    {/* Center Blue Orb */}
    <defs>
      <radialGradient id="blueOrb" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#93c5fd" />
        <stop offset="40%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#1e3a8a" />
      </radialGradient>
      <filter id="orbGlow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <circle cx="50" cy="50" r="12" fill="url(#blueOrb)" filter="url(#orbGlow)" />
  </svg>
);

export const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const navRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { id: "home", label: "HOME", color: "#ffffff" },
    { id: "about", label: "ABOUT", color: "#93c5fd" }, // Soft Blue
    { id: "projects", label: "PROJECTS", color: "#f97316" }, // Orange
    { id: "skills", label: "SKILLS", color: "#86efac" }, // Light Green
    { id: "blog", label: "BLOG", color: "#f59e0b" }, // Amber
    { id: "archives", label: "ARCHIVES", color: "#9ca3af" }, // Grey
    { id: "contact", label: "CONTACT", color: "#7e22ce" }, // Deep Purple
  ];

  const handleScroll = () => {
    const sections = navItems.map((item) => document.getElementById(item.id));
    const scrollPosition = window.scrollY;
    const offset = 100;

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      if (section && scrollPosition + offset >= section.offsetTop) {
        setActiveSection(navItems[i].id);
        break;
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
      setIsExpanded(false);
    }
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const baseRadius = 120; // Base distance of planets from the center
  const startAngle = 180; // Left
  const endAngle = 260; // Wide 80-degree sweep for a very round circle
  const angleStep = (endAngle - startAngle) / (navItems.length - 1);

  return (
    <div 
      ref={navRef}
      className="fixed bottom-8 right-8 z-50 flex items-center justify-center"
    >
      {/* Orbital Planets */}
      <AnimatePresence>
        {isExpanded && navItems.map((item, index) => {
          const isActive = activeSection === item.id;
          
          // Calculate angle and position
          const angle = startAngle + index * angleStep;
          // Spiral factor gives the exact vertical clearance needed for the labels near the top
          const currentRadius = baseRadius + index * 10; 
          const radian = (angle * Math.PI) / 180;
          const x = Math.cos(radian) * currentRadius;
          const y = Math.sin(radian) * currentRadius;

          return (
            <motion.div
              key={item.id}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
              animate={{ x, y, opacity: 1, scale: 1 }}
              exit={{ x: 0, y: 0, opacity: 0, scale: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20, 
                delay: index * 0.03 
              }}
              className="absolute z-10"
            >
              <div className="relative flex items-center justify-center group w-3.5 h-3.5">
                {/* The "Planet" (Dot) */}
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                    isActive 
                      ? "scale-150" 
                      : "opacity-60 hover:opacity-100 hover:scale-150"
                  }`}
                  style={{
                    backgroundColor: item.color,
                    boxShadow: `0 0 12px ${item.color}80`
                  }}
                  aria-label={item.label}
                />

                {/* Floating Label (Always Visible) */}
                <div 
                  className={`absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 ${
                    isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"
                  }`}
                  style={{ right: 'calc(100% + 8px)' }}
                >
                  <div className="text-[10px] font-bold tracking-widest text-white whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {item.label}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Central Radar Button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative z-20 w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] border-2 border-gray-300"
        style={{
          background: "radial-gradient(circle at 30% 30%, #f3f4f6, #9ca3af, #4b5563)"
        }}
        aria-label="Toggle Navigation"
      >
        {/* Pulsing rings */}
        <motion.div
          animate={{
            scale: [1, 1.5, 2],
            opacity: [0.5, 0.2, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className="absolute inset-0 rounded-full border border-white/30"
        />
        
        {/* Radar sweeping line */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full overflow-hidden"
        >
          <div 
            className="absolute inset-0"
            style={{
              background: "conic-gradient(from 0deg, transparent 75%, rgba(255,255,255,0.3) 100%)",
            }}
          />
        </motion.div>

        <JediCompassIcon />
      </motion.button>
    </div>
  );
};