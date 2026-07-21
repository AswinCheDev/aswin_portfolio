export interface XWingPieceStyle {
  clipPath: string;
  primaryColor: string; // Used for front face
  topColor: string;     // Used for top face
  sideColor: string;    // Used for side depth
  shadowColor: string;
}

// X-Wing color palette
const COLORS = {
  WHITE: { primaryColor: "#e8e8e8", topColor: "#ffffff", sideColor: "#c0c0c0", shadowColor: "rgba(0,0,0,0.1)" },
  LIGHT_GRAY: { primaryColor: "#a0a5a9", topColor: "#c0c5c9", sideColor: "#808589", shadowColor: "rgba(0,0,0,0.2)" },
  DARK_GRAY: { primaryColor: "#474c50", topColor: "#575c60", sideColor: "#272c30", shadowColor: "rgba(0,0,0,0.3)" },
  RED: { primaryColor: "#8b1a1a", topColor: "#ab3a3a", sideColor: "#6b0a0a", shadowColor: "rgba(139,26,26,0.3)" },
  BLACK: { primaryColor: "#1a1a1a", topColor: "#2a2a2a", sideColor: "#0a0a0a", shadowColor: "rgba(0,0,0,0.5)" },
  TRANS_BROWN: { primaryColor: "#7b5b3a", topColor: "#9b7b5a", sideColor: "#5b3b1a", shadowColor: "rgba(123,91,58,0.4)" }
};

export const XWING_PIECE_STYLES: XWingPieceStyle[] = [
  // 1. Nose cone (pointed)
  { clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)", ...COLORS.WHITE },
  // 2. Front fuselage (trapezoid)
  { clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)", ...COLORS.WHITE },
  // 3. Middle fuselage 
  { clipPath: "polygon(0% 10%, 100% 0%, 100% 90%, 0% 100%)", ...COLORS.LIGHT_GRAY },
  // 4. Cockpit window
  { clipPath: "polygon(10% 20%, 90% 0%, 100% 100%, 0% 100%)", ...COLORS.TRANS_BROWN },
  // 5. Back fuselage top
  { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", ...COLORS.WHITE },
  // 6. Back fuselage engine mount
  { clipPath: "polygon(0% 20%, 100% 20%, 100% 100%, 0% 100%)", ...COLORS.DARK_GRAY },
  // 7. Red stripe piece
  { clipPath: "polygon(0% 0%, 100% 0%, 100% 30%, 0% 30%)", ...COLORS.RED },
  // 8. R2 unit block
  { clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)", ...COLORS.LIGHT_GRAY },
  // 9. Top Left Engine
  { clipPath: "polygon(0% 10%, 100% 0%, 100% 90%, 0% 100%)", ...COLORS.WHITE },
  // 10. Top Right Engine
  { clipPath: "polygon(0% 0%, 100% 10%, 100% 100%, 0% 90%)", ...COLORS.WHITE },
  // 11. Bottom Left Engine
  { clipPath: "polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)", ...COLORS.LIGHT_GRAY },
  // 12. Bottom Right Engine
  { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", ...COLORS.LIGHT_GRAY },
  // 13. Top Left Wing (S-foil)
  { clipPath: "polygon(100% 0%, 100% 100%, 0% 80%, 0% 20%)", ...COLORS.WHITE },
  // 14. Top Right Wing
  { clipPath: "polygon(0% 0%, 0% 100%, 100% 80%, 100% 20%)", ...COLORS.WHITE },
  // 15. Bottom Left Wing
  { clipPath: "polygon(100% 0%, 100% 100%, 0% 60%, 0% 40%)", ...COLORS.WHITE },
  // 16. Bottom Right Wing
  { clipPath: "polygon(0% 0%, 0% 100%, 100% 60%, 100% 40%)", ...COLORS.WHITE },
  // 17. Left Cannon
  { clipPath: "polygon(40% 0%, 60% 0%, 60% 100%, 40% 100%)", ...COLORS.BLACK },
  // 18. Right Cannon
  { clipPath: "polygon(40% 0%, 60% 0%, 60% 100%, 40% 100%)", ...COLORS.BLACK },
  // 19. Red wing marking left
  { clipPath: "polygon(0% 0%, 100% 20%, 100% 100%, 0% 80%)", ...COLORS.RED },
  // 20. Red wing marking right
  { clipPath: "polygon(0% 20%, 100% 0%, 100% 80%, 0% 100%)", ...COLORS.RED },
  // 21. Thruster glow plate
  { clipPath: "polygon(10% 10%, 90% 10%, 90% 90%, 10% 90%)", ...COLORS.DARK_GRAY }
];
