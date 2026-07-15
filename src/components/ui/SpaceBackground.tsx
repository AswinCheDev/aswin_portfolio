// src/components/ui/SpaceBackground.tsx
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const SpaceBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollYProgress } = useScroll();

  // Pure Space Top to Bottom
  const background = useTransform(
    scrollYProgress,
    [0, 1],
    [
      "linear-gradient(to bottom, #000000, #050608)", // Top: Pure space
      "linear-gradient(to bottom, #050608, #000000)"  // Bottom: Still pure space
    ]
  );

  // Keep stars fully visible all the way down
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 1]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let stars: { x: number; y: number; radius: number; vx: number; vy: number; alpha: number; dAlpha: number }[] = [];
    let shootingStars: { x: number; y: number; length: number; speed: number; opacity: number; vx: number; vy: number }[] = [];

    const initStars = () => {
      stars = [];
      const numStars = Math.floor((window.innerWidth * window.innerHeight) / 2500);
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5,
          vx: (Math.random() - 0.5) * 0.1,
          vy: (Math.random() - 0.5) * 0.1,
          alpha: Math.random(),
          dAlpha: (Math.random() - 0.5) * 0.02
        });
      }
    };

    const spawnShootingStar = () => {
      const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.8; // Random angle roughly pointing down-left
      const speed = 3 + Math.random() * 4; // Slower, more realistic speed
      shootingStars.push({
        x: Math.random() * canvas.width * 1.5,
        y: -100 - Math.random() * 100,
        length: 40 + Math.random() * 80,
        speed: speed,
        opacity: Math.random() * 0.5 + 0.5,
        vx: -Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed
      });
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };
    
    window.addEventListener("resize", resize);
    resize();

      const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      stars.forEach(star => {
        star.x += star.vx;
        star.y += star.vy;
        
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        star.alpha += star.dAlpha;
        if (star.alpha <= 0.1 || star.alpha >= 1) {
          star.dAlpha = -star.dAlpha;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();
      });

      // Randomly spawn shooting stars (less frequently)
      if (Math.random() < 0.005) {
        spawnShootingStar();
      }

      // Update and draw shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        star.x += star.vx;
        star.y += star.vy;

        // Calculate tail position based on velocity vector
        const dirX = star.vx / star.speed;
        const dirY = star.vy / star.speed;
        const tailX = star.x - dirX * star.length;
        const tailY = star.y - dirY * star.length;

        const gradient = ctx.createLinearGradient(star.x, star.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (star.x < -star.length || star.x > canvas.width + star.length || star.y > canvas.height + star.length) {
          shootingStars.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <motion.div
      style={{ background }}
      className="fixed inset-0 z-[-2] pointer-events-none transition-colors duration-1000 overflow-hidden"
    >
      <motion.canvas
        ref={canvasRef}
        style={{ opacity }}
        className="w-full h-full relative z-10"
      />
    </motion.div>
  );
};
