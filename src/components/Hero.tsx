// src/components/Hero.tsx
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";
import { DailyDevIcon } from "@/components/ui/DailyDevIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Hero = () => {
  const name = "Aswin Chettri";
  const title = "Software Developer";

  const socialLinks = [
    {
      icon: <Mail className="w-5 h-5" />,
      href: "mailto:aswinkchettri@gmail.com",
      label: "Email",
    },
    {
      icon: <Github className="w-5 h-5" />,
      href: "https://github.com/Skenlrd",
      label: "GitHub",
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      href: "https://linkedin.com/in/aswinchettri",
      label: "LinkedIn",
    },
    {
      icon: <DailyDevIcon className="w-5 h-5" />,
      href: "https://app.daily.dev/aswinchettri",
      label: "Daily.dev",
    },
  ];

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center px-6 pt-32 md:pt-20"
    >
      <div className="max-w-7xl mx-auto w-full text-center">
        {/* Profile Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 flex justify-center"
        >
          <div className="relative w-40 h-40 md:w-48 md:h-48">
            <div className="w-full h-full rounded-full border-2 border-primary/20 p-1">
              <div className="w-full h-full rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                <img
                  src="/Images/IMG_1602.jpg"
                  alt="Aswin Chettri"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-5xl md:text-7xl font-bold pixel-heading inline-block"
        >
          {name}
        </motion.h1>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-6 mt-4"
        >
          <h2 className="text-2xl md:text-3xl font-bold code-text">
            {title}
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2 text-muted-foreground code-text">
            <MapPin className="w-4 h-4" />
            <span>Gangtok, Sikkim</span>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8 code-text"
        >
          <h4 className="text-xl font-bold mb-2">Learning. Building. Evolving.</h4>
          <p className="text-muted-foreground leading-relaxed">
            Aspiring Software Developer and current Master's student with hands-on
            experience in full-stack web development and AI applications.
            Passionate about building innovative solutions that make a
            difference.
          </p>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="flex items-center justify-center gap-3"
        >
          {socialLinks.map((social) => (
            <Tooltip key={social.label}>
              <TooltipTrigger asChild>
                <motion.a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 border-2 border-secondary rounded-lg hover:bg-secondary transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              </TooltipTrigger>
              <TooltipContent>
                <p>{social.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </motion.div>
      </div>
    </section>
  );
};