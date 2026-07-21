import React, { useState, useEffect } from 'react';
import { loadXWingClipPaths, PieceClipData } from '../../utils/xwingClipPathExtractor';

interface XWingPieceThumbnailProps {
  moduleId: string;
  allModuleIds: string[];
  isEquipped: boolean;
  isAnimating: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

// ── Hook: loads clip paths once, caches globally ───────────────────
function useXWingClipPaths(moduleIds: string[]) {
  const [data, setData] = useState<Map<string, PieceClipData> | null>(null);

  useEffect(() => {
    loadXWingClipPaths(moduleIds).then(setData);
  }, []);

  return data;
}

// ── Base size for the largest piece ────────────────────────────────
const MAX_SIZE = 110; // px
const MIN_SIZE = 50;

export function XWingPieceThumbnail(props: XWingPieceThumbnailProps) {
  const clipPaths = useXWingClipPaths(props.allModuleIds);

  if (props.isAnimating) {
    return <div style={{ width: 80, height: 80 }} />;
  }

  // While loading, show a faint placeholder
  if (!clipPaths) {
    return (
      <div
        className="rounded-lg bg-white/10 animate-pulse"
        style={{ width: 80, height: 80 }}
      />
    );
  }

  const piece = clipPaths.get(props.moduleId);
  if (!piece) return null;

  // Scale by relative size
  const baseSize = MIN_SIZE + (MAX_SIZE - MIN_SIZE) * piece.relativeSize;
  const width = piece.aspectRatio >= 1
    ? baseSize
    : baseSize * piece.aspectRatio;
  const height = piece.aspectRatio >= 1
    ? baseSize / piece.aspectRatio
    : baseSize;

  return (
    <div
      className={`relative cursor-pointer transition-all duration-500 lego-block-wrapper
        ${props.isEquipped
          ? ''
          : 'hover:-translate-y-2 hover:drop-shadow-[0_10px_20px_rgba(204,255,0,0.5)]'
        }`}
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        opacity: props.isEquipped ? 0 : 1,
        pointerEvents: props.isEquipped ? 'none' : 'auto',
        transform: props.isEquipped ? 'scale(0.5)' : 'scale(1)'
      }}
      onClick={props.onClick}
    >
      {/* Layer 1: Bottom shadow (depth) */}
      <div
        className="absolute w-full h-full"
        style={{
          clipPath: piece.clipPath,
          backgroundColor: piece.sideColor,
          transform: 'translateY(5px) scale(0.97)',
          filter: 'blur(1px)',
          opacity: 0.6,
        }}
      />

      {/* Layer 2: Side / edge thickness */}
      <div
        className="absolute w-full h-full"
        style={{
          clipPath: piece.clipPath,
          backgroundColor: piece.sideColor,
          transform: 'translateY(3px)',
        }}
      />

      {/* Layer 3: Main face */}
      <div
        className="absolute w-full h-full flex items-center justify-center"
        style={{
          clipPath: piece.clipPath,
          background: `linear-gradient(145deg, ${piece.topColor} 0%, ${piece.primaryColor} 60%, ${piece.sideColor} 100%)`,
        }}
      >
        {/* Plastic sheen / reflection */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: piece.clipPath,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 40%, transparent 60%)',
          }}
        />

        {/* Single centred LEGO stud */}
        <div
          className="relative z-10 rounded-full"
          style={{
            width: `${Math.max(10, Math.min(width, height) * 0.18)}px`,
            height: `${Math.max(10, Math.min(width, height) * 0.18)}px`,
            backgroundColor: piece.topColor,
            boxShadow: `
              inset 0 -2px 3px rgba(0,0,0,0.2),
              inset 0 1px 2px rgba(255,255,255,0.4),
              0 1px 2px rgba(0,0,0,0.15)
            `,
          }}
        >
          <div
            className="absolute top-[15%] left-[15%] w-[70%] h-[70%] rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, transparent 60%)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
