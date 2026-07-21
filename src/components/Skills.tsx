"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, useAnimation, AnimatePresence, useMotionValue, useMotionTemplate, MotionValue } from "framer-motion";
import DotField from "./backgrounds/DotField";
import R2D2 from "./R2D2";
import { XWingPieceThumbnail } from './scene/XWingPieceThumbnail';
import StackIcon from "tech-stack-icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  SiPython, SiJavascript, SiTypescript, SiCplusplus, SiPostgresql, 
  SiReact, SiExpo, SiHtml5, SiCss, SiTailwindcss, SiWebgl,
  SiNodedotjs, SiExpress, SiFastapi, SiFlask, SiDjango, SiMongodb, SiJsonwebtokens,
  SiMysql, SiRedis, SiPytorch, SiScikitlearn, SiPandas, SiNumpy,
  SiGit, SiGithub, SiLinux, SiPostman
} from "react-icons/si";
import { Canvas } from '@react-three/fiber';
import { XWingAssembler } from './scene/XWingAssembler';
import { FaJava } from "react-icons/fa";
import { Search, Clock, Mail, Music, Network, Zap, Brain, BarChart, Cloud, Shield, Bot, TestTube } from "lucide-react";

const TECH_CATEGORIES = [
  {
    property: "Languages",
    items: [
      { name: "Python", icon: SiPython, color: "#3776AB" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "Java", icon: FaJava, color: "#007396" },
      { name: "C++", icon: SiCplusplus, color: "#00599C" },
      { name: "SQL", icon: SiPostgresql, color: "#4169E1" }
    ]
  },
  {
    property: "Frontend & Mobile",
    items: [
      { name: "React", icon: SiReact, color: "#61DAFB" },
      { name: "React Native", icon: SiReact, color: "#61DAFB" },
      { name: "Expo", icon: SiExpo, color: "#000000" },
      { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
      { name: "CSS3", icon: SiCss, color: "#1572B6" },
      { name: "TailwindCSS", icon: SiTailwindcss, color: "#06B6D4" },
      { name: "WebGL", icon: SiWebgl, color: "#990000" }
    ]
  },
  {
    property: "Backend",
    items: [
      { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
      { name: "Express.js", icon: SiExpress, color: "#000000" },
      { name: "FastAPI", icon: SiFastapi, color: "#009688" },
      { name: "Flask", icon: SiFlask, color: "#000000" },
      { name: "Django", icon: SiDjango, color: "#092E20" },
      { name: "Mongoose", icon: SiMongodb, color: "#47A248" },
      { name: "JWT", icon: SiJsonwebtokens, color: "#000000" }
    ]
  },
  {
    property: "Data & Caching",
    items: [
      { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
      { name: "MySQL", icon: SiMysql, color: "#4479A1" },
      { name: "Redis", icon: SiRedis, color: "#DC382D" },
      { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" }
    ]
  },
  {
    property: "AI & ML",
    items: [
      { name: "PyTorch", icon: SiPytorch, color: "#EE4C2C" },
      { name: "scikit-learn", icon: SiScikitlearn, color: "#F7931E" },
      { name: "OpenAI CLIP", icon: Bot, color: "#412991" },
      { name: "Prophet", icon: BarChart, color: "#333333" },
      { name: "Pandas", icon: SiPandas, color: "#150458" },
      { name: "NumPy", icon: SiNumpy, color: "#013243" }
    ]
  },
  {
    property: "Automation & Integrations",
    items: [
      { name: "Playwright", icon: TestTube, color: "#2EAD33" },
      { name: "SerpAPI", icon: Search, color: "#F47D20" },
      { name: "node-cron", icon: Clock, color: "#316CE6" },
      { name: "Nodemailer", icon: Mail, color: "#22B573" },
      { name: "Demucs", icon: Music, color: "#6B7280" },
      { name: "WebSocket", icon: Network, color: "#000000" }
    ]
  },
  {
    property: "Tools & CI",
    items: [
      { name: "Git", icon: SiGit, color: "#F05032" },
      { name: "GitHub", icon: SiGithub, color: "#181717" },
      { name: "Linux", icon: SiLinux, color: "#FCC624" },
      { name: "Postman", icon: SiPostman, color: "#FF6C37" },
      { name: "Thunder Client", icon: Zap, color: "#505050" }
    ]
  },
  {
    property: "Domain Knowledge",
    items: [
      { name: "Machine Learning", icon: Brain, color: "#2563EB" },
      { name: "Data Science", icon: BarChart, color: "#EF4444" },
      { name: "Cloud Technology", icon: Cloud, color: "#10B981" },
      { name: "Network Security", icon: Shield, color: "#374151" }
    ]
  }
];

const MODULES = [
  { id: "react", name: "React", iconName: "react" },
  { id: "nextjs", name: "Next.js", iconName: "nextjs" },
  { id: "typescript", name: "TypeScript", iconName: "typescript" },
  { id: "python", name: "Python", iconName: "python" },
  { id: "nodejs", name: "Node.js", iconName: "nodejs" },
  { id: "tailwind", name: "Tailwind", iconName: "tailwindcss" },
  { id: "docker", name: "Docker", iconName: "docker" },
  { id: "mongodb", name: "MongoDB", iconName: "mongodb" },
  { id: "postgresql", name: "PostgreSQL", iconName: "postgresql" },
  { id: "git", name: "Git", iconName: "git" },
  { id: "figma", name: "Figma", iconName: "figma" },
  { id: "linux", name: "Linux", iconName: "linux" },
  { id: "java", name: "Java", iconName: "java" },
  { id: "cplusplus", name: "C++", iconName: "c++" },
  { id: "html5", name: "HTML5", iconName: "html5" },
  { id: "css3", name: "CSS3", iconName: "css3" },
  { id: "javascript", name: "JavaScript", iconName: "js" },
  { id: "expo", name: "Expo", iconName: "expo" },
  { id: "flutter", name: "Flutter", iconName: "flutter" },
  { id: "aws", name: "AWS", iconName: "aws" },
  { id: "redis", name: "Redis", iconName: "redis" }
];

const IconUser = ({ className, size }: { className?: string, size?: number | string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);

export const Skills = () => {
  const [equippedIds, setEquippedIds] = useState<string[]>([]);
  const [animatingBlocks, setAnimatingBlocks] = useState<Record<string, DOMRect>>({});
  const [popups, setPopups] = useState<{ id: string; text: string; type: 'gain' | 'loss' }[]>([]);
  
  const triggerXpPop = (text: string, type: 'gain' | 'loss' = 'gain') => {
    const id = Math.random().toString(36).substring(2, 9);
    setPopups(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setPopups(prev => prev.filter(p => p.id !== id));
    }, 1200);
  };
  
  const controls = useAnimation();
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  const handlePointerMove = (e: React.PointerEvent) => {
    mouseX.set((e.clientX / window.innerWidth) * 100);
    mouseY.set((e.clientY / window.innerHeight) * 100);
  };

  const handleToggleEquip = (id: string, e?: React.MouseEvent | any) => {
    if (animatingBlocks[id]) return;

    let startRect: DOMRect | null = null;
    if (e && e.currentTarget && (e.currentTarget as HTMLElement).closest) {
      const el = (e.currentTarget as HTMLElement).closest('.lego-block-wrapper');
      if (el) startRect = el.getBoundingClientRect();
    }
    
    // Fallback if triggered from 3D model without a valid DOM target
    if (!startRect) {
      const el = document.getElementById(`module-${id}`);
      if (el) startRect = el.getBoundingClientRect();
      else startRect = new DOMRect(window.innerWidth / 2, window.innerHeight / 2, 0, 0);
    }
    
    setAnimatingBlocks(prev => ({ ...prev, [id]: startRect! }));
    
    setEquippedIds(prev => {
      const isEquipped = prev.includes(id);
      const module = MODULES.find(m => m.id === id);
      if (module) {
        if (isEquipped) {
          triggerXpPop(`-10 ${module.name}`, 'loss');
        } else {
          triggerXpPop(`+10 ${module.name}`, 'gain');
        }
      }
      if (isEquipped) {
        return prev.filter(x => x !== id);
      }
      return [...prev, id];
    });

    setTimeout(() => {
      controls.start({ y: [0, 10, -3, 0], transition: { duration: 0.4, times: [0, 0.4, 0.7, 1], ease: "easeInOut" } });
    }, 1080);
  };

  const handleReset = () => {
    // Trigger the unequip animation for all equipped pieces with a slight stagger
    equippedIds.forEach((id, index) => {
      setTimeout(() => {
        handleToggleEquip(id);
      }, index * 80); 
    });
  };

  const equippedModules = equippedIds.map(id => MODULES.find(m => m.id === id)!);
  const unequippedModules = MODULES.filter(m => !equippedIds.includes(m.id));

  return (
    <section id="skills" className="h-screen relative overflow-hidden bg-[#15803d]">
      <div className="absolute inset-0 z-0 opacity-80 mix-blend-screen">
        <DotField
          dotRadius={1.5}
          dotSpacing={14}
          bulgeStrength={67}
          glowRadius={160}
          sparkle={false}
          waveAmplitude={0}
          cursorRadius={500}
          cursorForce={0.1}
          bulgeOnly
          gradientFrom="#ffffff"
          glowColor="#10B981"
        />
      </div>
      <R2D2 isFullScore={equippedModules.length === MODULES.length} />

      <div className="absolute top-8 left-8 text-sm font-bold tracking-widest text-white/60 uppercase z-20 font-mono pointer-events-none">
        Dagobah
      </div>

      <div 
        onPointerMove={handlePointerMove}
        className="w-full h-full relative select-none font-sans flex flex-col z-10 overflow-hidden"
      >
        {/* Absolute Full-Screen Canvas behind the content */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto">
          <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
            <ambientLight intensity={1.5} />
            <directionalLight position={[10, 10, 10]} intensity={1.5} />
            <directionalLight position={[-10, 10, -10]} intensity={0.5} />
            <XWingAssembler 
              equippedIds={equippedIds} 
              modules={MODULES}
              animatingBlocks={animatingBlocks}
              onAnimationComplete={(id) => {
                setAnimatingBlocks(prev => {
                  const next = { ...prev };
                  delete next[id];
                  return next;
                });
              }}
              mouseX={mouseX}
              mouseY={mouseY}
              onToggleEquip={handleToggleEquip}
            />
          </Canvas>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 relative pt-28 lg:pt-10 pb-8 px-8 w-full h-full max-w-[1400px] mx-auto z-10 pointer-events-none">
          
          <div className="flex-1 w-full max-w-[580px] flex flex-col justify-center pointer-events-auto">
            
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row items-center lg:items-end gap-4 lg:gap-6 justify-center lg:justify-start mb-2">
                <h2 className="text-4xl md:text-5xl font-bold display-heading text-white">
                  Tech Stack
                </h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-2 px-4 py-2 mb-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 backdrop-blur-sm group">
                      <span className="text-white text-xs font-bold tracking-widest uppercase">View All</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white group-hover:translate-x-1 transition-transform">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </button>
                  </DialogTrigger>
                  <DialogContent macOSClose={true} style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.035'/%3E%3C/svg%3E")`, backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)' }} className="sm:max-w-[1000px] max-h-[85vh] overflow-y-auto flex flex-col border border-black/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)] p-0">
                    <DialogHeader className="flex-shrink-0 p-6 lg:p-8 pb-0 lg:pb-0">
                      <DialogTitle className="text-3xl font-bold text-gray-900 drop-shadow-sm">Technologies I've Worked With</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 p-6 lg:p-8 pt-0 lg:pt-0 overflow-y-auto">
                      <div className="flex flex-col gap-10 mt-2">
                        {TECH_CATEGORIES.map((category) => (
                        <div key={category.property} className="flex flex-col gap-5">
                          <h4 className="text-xl font-bold text-gray-800 tracking-wide border-b border-black/5 pb-3">
                            {category.property}
                          </h4>
                          <div className="flex flex-wrap gap-5">
                            {category.items.map((item) => {
                              const Icon = item.icon;
                              return (
                                <div 
                                  key={item.name} 
                                  className="flex flex-col items-center gap-2.5 group w-[70px]"
                                >
                                  {Icon ? (
                                    <Icon className="w-10 h-10 opacity-90 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300" color={item.color} />
                                  ) : (
                                    <span className="text-gray-400 text-xs h-10 flex items-center">—</span>
                                  )}
                                  <span className="text-gray-600 text-[11px] font-semibold tracking-wide text-center leading-tight group-hover:text-gray-900 transition-colors">
                                    {item.name}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              </div>
              <p className="text-white/60 text-center lg:text-left mt-2 lg:mt-0">
                Click to equip technologies and build my profile stack.
              </p>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 relative z-20 min-h-[300px] content-start pt-12">
              {MODULES.map((module, i) => {
                const isEquipped = equippedIds.includes(module.id);
                const startRect = animatingBlocks[module.id];
                
                // Subtle scatter — just enough to feel organic, not chaotic
                const rotations = [-5, 8, -3, 12, -10, 4, -7, 6, -2, 10, -8, 3];
                const marginsX = [3, -8, 12, -5, 8, -12, 5, -3, 10, 0, -6, 7];
                const marginsY = [2, 8, -5, 10, -3, 6, -10, 12, -8, 4, 5, -6];
                
                const r = rotations[i % rotations.length];
                const tx = marginsX[i % marginsX.length];
                const ty = marginsY[i % marginsY.length];

                return (
                  <div 
                    key={module.id} 
                    id={`module-${module.id}`} 
                    className="lego-block-wrapper transition-transform duration-500"
                    style={{
                      transform: `translate(${tx}px, ${ty}px) rotate(${r}deg)`,
                      zIndex: isEquipped ? 0 : 10
                    }}
                  >
                    <XWingPieceThumbnail 
                      moduleId={module.id}
                      allModuleIds={MODULES.map(m => m.id)}
                      isEquipped={isEquipped}
                      isAnimating={!!startRect}
                      onClick={(e) => handleToggleEquip(module.id, e)}
                    />
                  </div>
                )
              })}
            </div>
          </div>
          
          {/* Right column placeholder to reserve space for the 3D X-Wing, holding the XP card */}
          <div className="flex flex-col items-center justify-end w-full lg:w-1/2 h-[500px] lg:h-full mt-16 lg:mt-0 relative pointer-events-none pb-0 lg:pb-0">
            {/* XP Popups Container */}
            <div className="absolute bottom-[80px] left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-30">
              <AnimatePresence>
                {popups.map(popup => (
                  <motion.div
                    key={popup.id}
                    initial={{ y: 0, opacity: 0, scale: 0.8 }}
                    animate={{ y: -30, opacity: 1, scale: 1.1 }}
                    exit={{ y: -60, opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`font-mono font-bold text-xs tracking-wider whitespace-nowrap mb-1 drop-shadow-md ${
                      popup.type === 'gain' 
                        ? 'text-[#ccff00] drop-shadow-[0_2px_8px_rgba(204,255,0,0.6)]' 
                        : 'text-red-500 drop-shadow-[0_2px_8px_rgba(239,68,68,0.6)]'
                    }`}
                  >
                    {popup.text}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Display XP Score over the canvas */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 flex items-center gap-4 shadow-[0_8px_32px_rgba(255,255,255,0.05)] z-20 transition-all pointer-events-auto">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
                <IconUser className="w-6 h-6 text-white/90 drop-shadow-md" />
              </div>
              <div className="flex-1 min-w-[120px]">
                <h3 className="font-sans font-bold text-white/90 text-[16px] tracking-wide whitespace-nowrap drop-shadow-md">Aswin Chettri</h3>
                <p className="font-mono text-[11px] font-bold text-[#ccff00] tracking-[0.2em] uppercase mt-1 whitespace-nowrap drop-shadow-md opacity-90">
                  {equippedModules.length === 0 ? "Select technologies" : `Level: ${equippedModules.length * 10}XP`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
