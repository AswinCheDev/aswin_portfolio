// src/components/Navbar.tsx
import { motion } from "framer-motion";
import { Moon, Sun, FileSignature } from "lucide-react";
import { useState, useEffect } from "react";

export const Navbar = () => {
  const [isDark, setIsDark] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ];

  const handleScroll = () => {
    const sections = navItems.map((item) => document.getElementById(item.id));
    const scrollPosition = window.scrollY;
    const offset = 100; // Adjust this offset as needed

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

  const toggleTheme = () => setIsDark(!isDark);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto glass-card px-6 py-3 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex-1 flex justify-start">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-xl font-bold text-gradient pixel-heading cursor-pointer"
            onClick={() => scrollToSection("home")}
          >
            AC
          </motion.div>
        </div>

        {/* Center Section */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1.5 rounded-md transition-smooth font-medium text-base ${ // Increased font size
                activeSection === item.id
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </motion.button>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex-1 flex justify-end items-center gap-3">
          <a
            href="/Chettri_Aswin_2026.pdf"
            download
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-base text-muted-foreground hover:text-foreground hover:bg-secondary/80 border border-transparent hover:border-border transition-smooth" // Increased font size
            aria-label="Download Resume"
          >
            <FileSignature className="w-4 h-4" />
            <span>Resume</span>
          </a>
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2.5 rounded-lg glass hover:bg-secondary/50 transition-smooth"
          >
            <motion.div
              initial={false}
              animate={{ rotate: isDark ? 180 : 0 }}
              transition={{ duration: 0.4 }}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.div>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};