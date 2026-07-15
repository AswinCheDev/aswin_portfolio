import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GalaxyIntroProps {
  onFinish: () => void;
}

export const GalaxyIntro = ({ onFinish }: GalaxyIntroProps) => {
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const text = "A long time ago, in a galaxy far, far away....";

  // Handle skip / early exit
  useEffect(() => {
    const handleSkip = () => {
      if (!isExiting) {
        setIsExiting(true);
      }
    };

    window.addEventListener('click', handleSkip);
    window.addEventListener('keydown', handleSkip);

    return () => {
      window.removeEventListener('click', handleSkip);
      window.removeEventListener('keydown', handleSkip);
    };
  }, [isExiting]);

  // Handle transition out
  useEffect(() => {
    if (isExiting) {
      // Fade out audio if playing
      if (audioRef.current) {
        const audio = audioRef.current;
        let volume = audio.volume;
        const fadeAudio = setInterval(() => {
          if (volume > 0.05) {
            volume -= 0.05;
            audio.volume = volume;
          } else {
            clearInterval(fadeAudio);
            audio.pause();
          }
        }, 50);
      }

      const timer = setTimeout(() => {
        onFinish();
      }, 1000); // 1s fade out duration
      return () => clearTimeout(timer);
    }
  }, [isExiting, onFinish]);

  // Handle normal completion
  useEffect(() => {
    if (isTypingComplete && !isExiting) {
      const timer = setTimeout(() => {
        setIsExiting(true);
      }, 2000); // Hold for 2 seconds after typing completes
      return () => clearTimeout(timer);
    }
  }, [isTypingComplete, isExiting]);

  const letterVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          exit={{ opacity: 0, backgroundColor: '#0B1020' }}
          transition={{ duration: 1 }}
          className="fixed inset-0 bg-black flex items-center justify-center z-50 cursor-pointer overflow-hidden"
        >
          {/* Audio player */}
          <audio ref={audioRef} src="/assests/sound/StarWars.mp3" autoPlay />

          <div className="w-full max-w-3xl px-6">
            <motion.p
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.08, // Typing speed
                    delayChildren: 0.5, // Initial delay
                  },
                },
              }}
              onAnimationComplete={() => setIsTypingComplete(true)}
              className="text-2xl md:text-3xl lg:text-4xl text-[#00E5FF] font-medium tracking-wider"
              style={{
                fontFamily: "'Courier New', Courier, monospace",
                textShadow: "0 0 10px rgba(0, 229, 255, 0.5)"
              }}
            >
              {text.split('').map((char, index) => (
                <motion.span key={index} variants={letterVariants}>
                  {char}
                </motion.span>
              ))}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
