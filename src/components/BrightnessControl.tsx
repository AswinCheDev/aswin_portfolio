import { motion, AnimatePresence } from "framer-motion";
import { Sun, SunDim } from "lucide-react";
import { useState, useEffect } from "react";

export const BrightnessControl = () => {
  const [brightness, setBrightness] = useState(100);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.filter = `brightness(${brightness}%)`;
  }, [brightness]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-6 mb-4 w-64"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold">Brightness</span>
              <span className="text-sm text-muted-foreground">{brightness}%</span>
            </div>

            <div className="flex items-center gap-3">
              <SunDim className="w-4 h-4 text-muted-foreground" />
              <input
                type="range"
                min="30"
                max="100"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${brightness}%, hsl(var(--secondary)) ${brightness}%, hsl(var(--secondary)) 100%)`,
                }}
              />
              <Sun className="w-5 h-5 text-primary" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="glass-card p-4 rounded-full hover-glow transition-smooth"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Sun className="w-6 h-6" />
        </motion.div>
      </motion.button>
    </div>
  );
};
