"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, useAnimation, AnimatePresence, useMotionValue, useMotionTemplate, MotionValue } from "framer-motion";
import DotField from "./backgrounds/DotField";
import StackIcon from "tech-stack-icons";

const IconUser = ({ className, size }: { className?: string, size?: number | string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);

const GRID_CONSTANTS = {
  STUD_WIDTH: 52,
  ROW_HEIGHT: 64,
  MAX_ROWS: 20,
  COLS: 6,
  APEX_HEIGHT: 120
};

const STUD_THEMES = {
  green: {
    wall: "linear-gradient(90deg, #087028 0%, #10923b 20%, #1ab84d 38%, #20cc55 50%, #1ab84d 62%, #10923b 80%, #087028 100%)",
    cap: "linear-gradient(135deg, #42f585 0%, #25dd62 40%, #18c04e 70%, #10a040 100%)",
    shadow: "radial-gradient(ellipse, rgba(0,40,0,0.6) 0%, transparent 70%)",
    rim: "rgba(255,255,255,0.7)",
  },
  dark: {
    wall: "linear-gradient(90deg, #09090b 0%, #18181b 20%, #27272a 38%, #3f3f46 50%, #27272a 62%, #18181b 80%, #09090b 100%)",
    cap: "linear-gradient(135deg, #52525b 0%, #3f3f46 40%, #27272a 70%, #18181b 100%)",
    shadow: "radial-gradient(ellipse, rgba(0,0,0,0.8) 0%, transparent 70%)",
    rim: "rgba(255,255,255,0.2)",
  },
  yellow: {
    wall: "linear-gradient(90deg, #a16207 0%, #ca8a04 20%, #eab308 38%, #facc15 50%, #eab308 62%, #ca8a04 80%, #a16207 100%)",
    cap: "linear-gradient(135deg, #fef08a 0%, #fde047 40%, #facc15 70%, #eab308 100%)",
    shadow: "radial-gradient(ellipse, rgba(60,40,0,0.6) 0%, transparent 70%)",
    rim: "rgba(255,255,255,0.8)",
  },
  blue: {
    wall: "linear-gradient(90deg, #1e3a8a 0%, #1d4ed8 20%, #2563eb 38%, #3b82f6 50%, #2563eb 62%, #1d4ed8 80%, #1e3a8a 100%)",
    cap: "linear-gradient(135deg, #93c5fd 0%, #60a5fa 40%, #3b82f6 70%, #2563eb 100%)",
    shadow: "radial-gradient(ellipse, rgba(0,0,60,0.6) 0%, transparent 70%)",
    rim: "rgba(255,255,255,0.7)",
  },
  red: {
    wall: "linear-gradient(90deg, #7f1d1d 0%, #991b1b 20%, #b91c1c 38%, #dc2626 50%, #b91c1c 62%, #991b1b 80%, #7f1d1d 100%)",
    cap: "linear-gradient(135deg, #fca5a5 0%, #f87171 40%, #ef4444 70%, #dc2626 100%)",
    shadow: "radial-gradient(ellipse, rgba(60,0,0,0.6) 0%, transparent 70%)",
    rim: "rgba(255,255,255,0.7)",
  },
};

type StudColor = keyof typeof STUD_THEMES;

const LegoStud = ({ color = "green", yOffset = 0 }: { color?: StudColor, yOffset?: number }) => {
  const t = STUD_THEMES[color];
  const studHeight = 13;
  const studWidth = 72; 
  const studCapHeight = 13;
  
  return (
    <div className="flex-1 flex items-end justify-center relative" style={{ transform: `translateY(${yOffset}px)` }}>
      <div
        className="absolute bottom-[-3px] left-1/2 -translate-x-1/2 w-[75%] rounded-[50%] z-0"
        style={{ height: "10px", background: t.shadow }}
      />
      
      <div className="relative z-10" style={{ width: `${studWidth}%`, maxWidth: "42px", marginBottom: "-1px" }}>
        <div
          className="w-full relative overflow-hidden"
          style={{ height: `${studHeight}px`, borderRadius: "50% / 20%", background: t.wall }}
        >
          <div
            className="absolute top-0 h-full w-[25%] left-[20%]"
            style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.25), transparent)" }}
          />
        </div>
        
        <div
          className="absolute left-0 w-full rounded-[50%] flex items-center justify-center overflow-hidden"
          style={{
            top: `-${studCapHeight / 2}px`, 
            height: `${studCapHeight}px`, 
            background: t.cap,
            boxShadow: `inset 0px 2px 4px rgba(255,255,255,0.6), inset 0px -2px 4px rgba(0,0,0,0.2), 0px 1px 1px rgba(0,0,0,0.4)`,
            borderTop: `1px solid ${t.rim}`,
          }}
        >
          <span className="text-[8px] font-black tracking-widest select-none pointer-events-none opacity-80" style={{
            color: "rgba(0,0,0,0.15)",
            textShadow: "0px 1px 0px rgba(255,255,255,0.6)",
            transform: "scaleY(0.45) translateY(-1px)", 
          }}>
            UI
          </span>
        </div>
      </div>
    </div>
  );
};

interface LegoBlockProps {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  topColor: string;
  faceGradient: string;
  bottomColor: string;
  topHeight?: number;
  bottomHeight?: number;
  roundedTop?: boolean;
  roundedBottom?: boolean;
  className?: string;
  children: React.ReactNode;
  studs?: number;
  studColor?: StudColor;
  hideStuds?: boolean | number[];
  studYOffset?: number;
}

const LegoBlock = ({
  mouseX, mouseY,
  topColor, faceGradient, bottomColor,
  topHeight = 15, bottomHeight = 12,
  roundedTop = false, roundedBottom = false,
  className = "",
  children, studs = 0, studColor = "green", hideStuds = false,
  studYOffset = 10,
}: LegoBlockProps) => {
  const topDarkenEnd = 100;
  const topShadow = "inset 0px 0px 4px rgba(0,0,0,0.28)";
  const faceShadow = "inset 0px 2px 6px rgba(255,255,255,0.47)";

  const highlightBg = useMotionTemplate`radial-gradient(circle 120px at ${mouseX}% ${mouseY}%, rgba(255,255,255,0.25), transparent)`;

  return (
    <div className={`relative w-full ${className}`}>
      <div
        className="relative w-full"
        style={{
          height: `${topHeight}px`,
          background: `linear-gradient(to bottom, ${topColor}, color-mix(in srgb, ${topColor} ${topDarkenEnd}%, black))`,
          boxShadow: topShadow,
          borderRadius: roundedTop ? "4px 4px 0 0" : "0",
        }}
      >
        {studs > 0 && (
          <div className="absolute bottom-full left-0 w-full flex">
            {[...Array(studs)].map((_, i) => {
              const isHidden = Array.isArray(hideStuds) ? hideStuds.includes(i) : hideStuds;
              return isHidden ? (
                <div key={i} className="flex-1" />
              ) : (
                <LegoStud key={i} color={studColor} yOffset={studYOffset} />
              );
            })}
          </div>
        )}
      </div>
      <div
        className="relative w-full border-x border-black/20 overflow-hidden"
        style={{
          background: faceGradient,
          boxShadow: faceShadow,
        }}
      >
        {/* Shiny plastic reflection */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-[inherit] z-20"
          style={{
            background: "linear-gradient(110deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0) 40%)"
          }}
        />
        <motion.div 
          className="absolute inset-0 z-20 pointer-events-none opacity-60 mix-blend-overlay"
          style={{
            background: highlightBg
          }}
        />
        <div className="relative z-30">{children}</div>
      </div>
      <div
        className="relative w-full"
        style={{
          height: `${bottomHeight}px`,
          background: bottomColor,
          boxShadow: "inset 0px 2px 4px rgba(0,0,0,0.15)",
          borderRadius: roundedBottom ? "0 0 4px 4px" : "0",
        }}
      />
    </div>
  );
};

const MODULES = [
  {
    id: "react",
    name: "React",
    iconName: "react",
    studs: 4,
    colors: {
      topColor: "#38bdf8",
      faceGradient: "linear-gradient(180deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)",
      bottomColor: "#075985",
      studColor: "blue" as StudColor,
      iconBg: "bg-black/20 shadow-inner",
    }
  },
  {
    id: "nextjs",
    name: "Next.js",
    iconName: "nextjs",
    studs: 4,
    colors: {
      topColor: "#3f3f46",
      faceGradient: "linear-gradient(180deg, #27272a 0%, #18181b 50%, #09090b 100%)",
      bottomColor: "#000000",
      studColor: "dark" as StudColor,
      iconBg: "bg-white/10 shadow-inner",
    }
  },
  {
    id: "typescript",
    name: "TypeScript",
    iconName: "typescript",
    studs: 4,
    colors: {
      topColor: "#60a5fa",
      faceGradient: "linear-gradient(180deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)",
      bottomColor: "#1e3a8a",
      studColor: "blue" as StudColor,
      iconBg: "bg-black/20 shadow-inner",
    }
  },
  {
    id: "python",
    name: "Python",
    iconName: "python",
    studs: 2,
    colors: {
      topColor: "#facc15",
      faceGradient: "linear-gradient(180deg, #eab308 0%, #ca8a04 50%, #a16207 100%)",
      bottomColor: "#713f12",
      studColor: "yellow" as StudColor,
      iconBg: "bg-black/20 shadow-inner",
    }
  },
  {
    id: "nodejs",
    name: "Node.js",
    iconName: "nodejs",
    studs: 2,
    colors: {
      topColor: "#4ade80",
      faceGradient: "linear-gradient(180deg, #22c55e 0%, #16a34a 50%, #15803d 100%)",
      bottomColor: "#14532d",
      studColor: "green" as StudColor,
      iconBg: "bg-black/20 shadow-inner",
    }
  },
  {
    id: "tailwind",
    name: "Tailwind",
    iconName: "tailwindcss",
    studs: 2,
    colors: {
      topColor: "#38bdf8",
      faceGradient: "linear-gradient(180deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)",
      bottomColor: "#075985",
      studColor: "blue" as StudColor,
      iconBg: "bg-black/20 shadow-inner",
    }
  },
  {
    id: "docker",
    name: "Docker",
    iconName: "docker",
    studs: 4,
    colors: {
      topColor: "#38bdf8",
      faceGradient: "linear-gradient(180deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)",
      bottomColor: "#075985",
      studColor: "blue" as StudColor,
      iconBg: "bg-black/20 shadow-inner",
    }
  },
  {
    id: "mongodb",
    name: "MongoDB",
    iconName: "mongodb",
    studs: 4,
    colors: {
      topColor: "#4ade80",
      faceGradient: "linear-gradient(180deg, #22c55e 0%, #16a34a 50%, #15803d 100%)",
      bottomColor: "#14532d",
      studColor: "green" as StudColor,
      iconBg: "bg-black/20 shadow-inner",
    }
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    iconName: "postgresql",
    studs: 4,
    colors: {
      topColor: "#60a5fa",
      faceGradient: "linear-gradient(180deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)",
      bottomColor: "#1e3a8a",
      studColor: "blue" as StudColor,
      iconBg: "bg-black/20 shadow-inner",
    }
  },
  {
    id: "git",
    name: "Git",
    iconName: "git",
    studs: 2,
    colors: {
      topColor: "#f87171",
      faceGradient: "linear-gradient(180deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)",
      bottomColor: "#7f1d1d",
      studColor: "red" as StudColor,
      iconBg: "bg-black/20 shadow-inner",
    }
  },
  {
    id: "figma",
    name: "Figma",
    iconName: "figma",
    studs: 2,
    colors: {
      topColor: "#3f3f46",
      faceGradient: "linear-gradient(180deg, #27272a 0%, #18181b 50%, #09090b 100%)",
      bottomColor: "#000000",
      studColor: "dark" as StudColor,
      iconBg: "bg-white/10 shadow-inner",
    }
  },
  {
    id: "linux",
    name: "Linux",
    iconName: "linux",
    studs: 2,
    colors: {
      topColor: "#facc15",
      faceGradient: "linear-gradient(180deg, #eab308 0%, #ca8a04 50%, #a16207 100%)",
      bottomColor: "#713f12",
      studColor: "yellow" as StudColor,
      iconBg: "bg-black/20 shadow-inner",
    }
  },
  {
    id: "java",
    name: "Java",
    iconName: "java",
    studs: 2,
    colors: {
      topColor: "#f87171",
      faceGradient: "linear-gradient(180deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)",
      bottomColor: "#7f1d1d",
      studColor: "red" as StudColor,
      iconBg: "bg-black/20 shadow-inner",
    }
  },
  {
    id: "cplusplus",
    name: "C++",
    iconName: "c++",
    studs: 2,
    colors: {
      topColor: "#60a5fa",
      faceGradient: "linear-gradient(180deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)",
      bottomColor: "#1e3a8a",
      studColor: "blue" as StudColor,
      iconBg: "bg-black/20 shadow-inner",
    }
  },
  {
    id: "html5",
    name: "HTML5",
    iconName: "html5",
    studs: 2,
    colors: {
      topColor: "#f87171",
      faceGradient: "linear-gradient(180deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)",
      bottomColor: "#7f1d1d",
      studColor: "red" as StudColor,
      iconBg: "bg-black/20 shadow-inner",
    }
  },
  {
    id: "css3",
    name: "CSS3",
    iconName: "css3",
    studs: 2,
    colors: {
      topColor: "#60a5fa",
      faceGradient: "linear-gradient(180deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)",
      bottomColor: "#1e3a8a",
      studColor: "blue" as StudColor,
      iconBg: "bg-black/20 shadow-inner",
    }
  },
  {
    id: "javascript",
    name: "JavaScript",
    iconName: "js",
    studs: 4,
    colors: {
      topColor: "#facc15",
      faceGradient: "linear-gradient(180deg, #eab308 0%, #ca8a04 50%, #a16207 100%)",
      bottomColor: "#713f12",
      studColor: "yellow" as StudColor,
      iconBg: "bg-black/20 shadow-inner",
    }
  },
  {
    id: "expo",
    name: "Expo",
    iconName: "expo",
    studs: 2,
    colors: {
      topColor: "#3f3f46",
      faceGradient: "linear-gradient(180deg, #27272a 0%, #18181b 50%, #09090b 100%)",
      bottomColor: "#000000",
      studColor: "dark" as StudColor,
      iconBg: "bg-white/10 shadow-inner",
    }
  },
  {
    id: "flutter",
    name: "Flutter",
    iconName: "flutter",
    studs: 4,
    colors: {
      topColor: "#60a5fa",
      faceGradient: "linear-gradient(180deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)",
      bottomColor: "#1e3a8a",
      studColor: "blue" as StudColor,
      iconBg: "bg-black/20 shadow-inner",
    }
  },
  {
    id: "aws",
    name: "AWS",
    iconName: "aws",
    studs: 4,
    colors: {
      topColor: "#facc15",
      faceGradient: "linear-gradient(180deg, #eab308 0%, #ca8a04 50%, #a16207 100%)",
      bottomColor: "#713f12",
      studColor: "yellow" as StudColor,
      iconBg: "bg-black/20 shadow-inner",
    }
  },
  {
    id: "redis",
    name: "Redis",
    iconName: "redis",
    studs: 2,
    colors: {
      topColor: "#f87171",
      faceGradient: "linear-gradient(180deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)",
      bottomColor: "#7f1d1d",
      studColor: "red" as StudColor,
      iconBg: "bg-black/20 shadow-inner",
    }
  }
];

const ModuleBlock = ({ 
  module, 
  hiddenStuds = [], 
  onClick, 
  isAnimating,
  startRect,
  mouseX,
  mouseY,
  onAnimationComplete
}: { 
  module: typeof MODULES[0], 
  hiddenStuds?: number[], 
  onClick: (e: React.MouseEvent) => void,
  isAnimating?: boolean,
  startRect?: DOMRect | null,
  mouseX: MotionValue<number>,
  mouseY: MotionValue<number>,
  onAnimationComplete?: () => void
}) => {
  const widthPx = module.studs * GRID_CONSTANTS.STUD_WIDTH;
  const isCompact = module.studs <= 2;
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAnimating && startRect && wrapperRef.current) {
      const endRect = wrapperRef.current.getBoundingClientRect();
      const dx = startRect.left - endRect.left;
      const dy = startRect.top - endRect.top;

      const apexY = Math.min(dy, 0) - GRID_CONSTANTS.APEX_HEIGHT;

      const animation = wrapperRef.current.animate([
        { transform: `translate(${dx}px, ${dy}px) scale(1, 1)`, filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.2))', offset: 0 },
        { transform: `translate(${dx}px, ${dy}px) scale(1.1, 0.85)`, filter: 'drop-shadow(0px 5px 5px rgba(0,0,0,0.3))', offset: 0.15 },
        { transform: `translate(${dx * 0.75}px, ${dy + (apexY - dy) * 0.5}px) scale(0.9, 1.15)`, filter: 'drop-shadow(0px 30px 20px rgba(0,0,0,0.05))', offset: 0.35 },
        { transform: `translate(${dx * 0.5}px, ${apexY}px) scale(1, 1)`, filter: 'drop-shadow(0px 40px 20px rgba(0,0,0,0))', offset: 0.55 },
        { transform: `translate(${dx * 0.25}px, ${apexY * 0.5}px) scale(0.9, 1.15)`, filter: 'drop-shadow(0px 30px 20px rgba(0,0,0,0.05))', offset: 0.75 },
        { transform: `translate(0px, 0px) scale(1.15, 0.85)`, filter: 'drop-shadow(0px 5px 5px rgba(0,0,0,0.3))', offset: 0.9 },
        { transform: `translate(0px, 0px) scale(1, 1)`, filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.2))', offset: 1 }
      ], {
        duration: 1200,
        easing: "cubic-bezier(0.25, 1, 0.5, 1)", 
        fill: "both"
      });

      animation.onfinish = () => onAnimationComplete?.();
      
      return () => animation.cancel();
    }
  }, [isAnimating, startRect]);

  return (
    <div ref={wrapperRef} className="z-50 relative lego-block-wrapper" style={{ width: widthPx }}>
      <button
        type="button"
        onClick={onClick}
        aria-label={`Equip ${module.name}`}
        className="cursor-pointer w-full shrink-0 touch-none group relative focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ccff00] rounded-lg hover:-translate-y-1.5 active:scale-95 transition-all duration-200 text-left"
      >
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors z-30 rounded-lg pointer-events-none" />
        <LegoBlock
          mouseX={mouseX}
          mouseY={mouseY}
          topColor={module.colors.topColor}
          faceGradient={module.colors.faceGradient}
          bottomColor={module.colors.bottomColor}
          roundedTop roundedBottom
          studs={module.studs}
          studColor={module.colors.studColor as StudColor}
          hideStuds={hiddenStuds}
        >
          <div className={`flex items-center w-full h-[48px] ${isCompact ? 'px-2 gap-2' : 'px-3 gap-2.5'}`}>
            {isCompact ? (
              <>
                <div className={`w-6 h-6 rounded-md ${module.colors.iconBg} flex items-center justify-center shrink-0`}>
                  <StackIcon name={module.iconName as any} className="w-4 h-4 opacity-90" />
                </div>
                <h4 className="font-sans font-bold text-white text-[12px] tracking-wide truncate drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                  {module.name}
                </h4>
              </>
            ) : (
              <>
                <div className={`w-7 h-7 rounded-lg ${module.colors.iconBg} flex items-center justify-center shrink-0`}>
                  <StackIcon name={module.iconName as any} className="w-5 h-5 opacity-90" />
                </div>
                <h4 className="font-sans font-bold text-white text-[14px] tracking-wide truncate drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                  {module.name}
                </h4>
              </>
            )}
          </div>
        </LegoBlock>
      </button>
    </div>
  );
};

export const Skills = () => {
  const [equippedIds, setEquippedIds] = useState<string[]>([]);
  const [animatingBlocks, setAnimatingBlocks] = useState<Record<string, DOMRect>>({});
  
  const controls = useAnimation();
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  const handlePointerMove = (e: React.PointerEvent) => {
    mouseX.set((e.clientX / window.innerWidth) * 100);
    mouseY.set((e.clientY / window.innerHeight) * 100);
  };

  const handleToggleEquip = (id: string, e: React.MouseEvent) => {
    if (animatingBlocks[id]) return;

    const el = (e.currentTarget as HTMLElement).closest('.lego-block-wrapper');
    if (!el) return;
    const startRect = el.getBoundingClientRect();
    
    setAnimatingBlocks(prev => ({ ...prev, [id]: startRect }));
    
    setEquippedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      }
      return [...prev, id];
    });

    setTimeout(() => {
      controls.start({ y: [0, 10, -3, 0], transition: { duration: 0.4, times: [0, 0.4, 0.7, 1], ease: "easeInOut" } });
    }, 1080);
  };

  const equippedModules = equippedIds.map(id => MODULES.find(m => m.id === id)!);
  const unequippedModules = MODULES.filter(m => !equippedIds.includes(m.id));

  const { grid, positionedModules } = useMemo(() => {
    const calculatedGrid: (string | null)[][] = [];
    const positioned = equippedModules.map(m => {
      let placedRow = -1;
      let placedCol = -1;
      for (let r = 0; r < GRID_CONSTANTS.MAX_ROWS; r++) {
        if (!calculatedGrid[r]) calculatedGrid[r] = Array(GRID_CONSTANTS.COLS).fill(null);
        let contiguous = 0;
        for (let c = 0; c < GRID_CONSTANTS.COLS; c++) {
          if (!calculatedGrid[r][c]) {
            contiguous++;
            if (contiguous === m.studs) {
              placedRow = r;
              placedCol = c - m.studs + 1;
              break;
            }
          } else {
            contiguous = 0;
          }
        }
        if (placedRow !== -1) break;
      }
      if (placedRow !== -1) {
        for (let i = 0; i < m.studs; i++) {
          calculatedGrid[placedRow][placedCol + i] = m.id;
        }
      } else {
        placedRow = 0;
        placedCol = 0;
      }
      return { module: m, rowIndex: placedRow, colIndex: placedCol };
    });
    return { grid: calculatedGrid, positionedModules: positioned };
  }, [equippedModules]);

  const hiddenServerStuds: number[] = [];
  if (grid[0]) {
    grid[0].forEach((occupantId, idx) => {
      if (occupantId && !animatingBlocks[occupantId]) hiddenServerStuds.push(idx);
    });
  }

  const towerHeight = equippedModules.length > 0 
    ? (Math.max(...positionedModules.map(m => m.rowIndex)) + 1) * GRID_CONSTANTS.ROW_HEIGHT 
    : 0;

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
          gradientTo="#ffffff"
          glowColor="#10B981"
        />
      </div>

      <div className="absolute top-8 left-8 text-sm font-bold tracking-widest text-white/60 uppercase z-20 font-mono pointer-events-none">
        Dagobah
      </div>

      <div 
        onPointerMove={handlePointerMove}
        className="w-full h-full relative select-none font-sans flex flex-col z-10 overflow-hidden"
      >
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 relative pt-28 lg:pt-10 pb-8 px-8 w-full h-full max-w-[1400px] mx-auto">
          
          <div className="flex-1 w-full max-w-[800px] flex flex-col justify-center">
            
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 display-heading text-white">
                Tech Stack
              </h2>
              <p className="text-white/60">
                Click to equip technologies and build my profile stack.
              </p>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-3 relative z-20 min-h-[200px]">
              {unequippedModules.map((module) => {
                const startRect = animatingBlocks[module.id];
                return (
                  <ModuleBlock 
                    key={module.id}
                    module={module}
                    mouseX={mouseX}
                    mouseY={mouseY}
                    isAnimating={!!startRect}
                    startRect={startRect || null}
                    onAnimationComplete={() => {
                      setAnimatingBlocks(prev => {
                        const next = { ...prev };
                        delete next[module.id];
                        return next;
                      });
                    }}
                    onClick={(e) => handleToggleEquip(module.id, e)} 
                  />
                )
              })}
            </div>
          </div>

          <div className="flex flex-col items-center gap-12 w-full lg:w-auto mt-16 lg:mt-0">
            <div className="scale-[0.75] sm:scale-[0.8] lg:scale-100 origin-bottom shrink-0 flex flex-col items-center">
              <motion.div 
                animate={controls}
                className="relative w-[312px] shadow-[0_15px_35px_rgba(0,0,0,0.25)] rounded-xl transition-all duration-700 ease-out"
                style={{ marginTop: `${towerHeight}px` }}
              >
              
              <div className="absolute left-0 w-full h-0 z-20" style={{ bottom: "calc(100% - 14px)" }}>
                  {positionedModules.map(({ module, rowIndex, colIndex }) => {
                    const hiddenLocalStuds: number[] = [];
                    if (grid[rowIndex + 1]) {
                      for (let i = 0; i < module.studs; i++) {
                        const occupantId = grid[rowIndex + 1][colIndex + i];
                        if (occupantId && !animatingBlocks[occupantId]) {
                          hiddenLocalStuds.push(i);
                        }
                      }
                    }

                    const startRect = animatingBlocks[module.id];

                    return (
                      <div 
                        key={module.id}
                        className="absolute"
                        style={{ 
                          bottom: rowIndex * GRID_CONSTANTS.ROW_HEIGHT, 
                          left: colIndex * GRID_CONSTANTS.STUD_WIDTH,
                          zIndex: rowIndex * 10
                        }}
                      >
                        <ModuleBlock 
                          module={module} 
                          hiddenStuds={hiddenLocalStuds}
                          mouseX={mouseX}
                          mouseY={mouseY}
                          isAnimating={!!startRect}
                          startRect={startRect || null}
                          onAnimationComplete={() => {
                            setAnimatingBlocks(prev => {
                              const next = { ...prev };
                              delete next[module.id];
                              return next;
                            });
                          }}
                          onClick={(e) => handleToggleEquip(module.id, e)} 
                        />
                      </div>
                    );
                  })}
              </div>

              <LegoBlock
                mouseX={mouseX}
                mouseY={mouseY}
                topColor="#f87171"
                faceGradient="linear-gradient(180deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)"
                bottomColor="#7f1d1d"
                roundedTop roundedBottom
                studs={6} 
                studColor="red"
                hideStuds={hiddenServerStuds}
                className="relative z-10"
              >
                <div className="px-4 py-3 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-black/20 flex items-center justify-center shadow-inner shrink-0">
                      <IconUser className="w-5 h-5 text-white drop-shadow-md" size={20} />
                    </div>
                    <div className="text-white drop-shadow-md">
                      <h3 className="font-sans font-bold text-[14px] tracking-wide truncate drop-shadow-md">Aswin Chettri</h3>
                      <p className="font-mono text-[9px] font-bold text-white/80 tracking-[0.2em] uppercase mt-1 drop-shadow-sm">
                        {equippedModules.length === 0 ? "Select technologies" : `Level: ${equippedModules.length * 10}XP`}
                      </p>
                    </div>
                  </div>
                </div>
              </LegoBlock>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
