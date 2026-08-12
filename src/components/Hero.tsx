import { motion } from "framer-motion";
import { Github, Linkedin, Mail, MapPin, FileText } from "lucide-react";
import { DailyDevIcon } from "@/components/ui/DailyDevIcon";
import { XIcon } from "@/components/ui/XIcon";
import { MediumIcon } from "@/components/ui/MediumIcon";
import { SubstackIcon } from "@/components/ui/SubstackIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Lanyard from "@/components/ui/Lanyard";
import Galaxy from "@/components/ui/Galaxy";

export const Hero = () => {
  const name = "Aswin Chettri";
  const title = "Software Developer";
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const socialLinks = [
    {
      icon: <FileText className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />,
      href: "https://drive.google.com/file/d/1hYD9Px6ltlxMZNOmIl3IcdgSe2zSriVB/view?usp=drive_link",
      label: "Resume",
      text: "Resume",
      hoverColor: "hover:text-blue-500",
    },
    {
      icon: <Mail className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />,
      href: "mailto:aswinkchettri@gmail.com",
      label: "Email",
      hoverColor: "hover:text-red-500",
    },
    {
      icon: <Github className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />,
      href: "https://github.com/AswinCheDev",
      label: "GitHub",
      hoverColor: "hover:text-gray-900 dark:hover:text-white",
    },
    {
      icon: <Linkedin className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />,
      href: "https://linkedin.com/in/aswinchettri",
      label: "LinkedIn",
      hoverColor: "hover:text-[#0a66c2]",
    },
    {
      icon: <XIcon className="w-[14px] h-[14px] md:w-[17px] md:h-[17px]" />,
      href: "https://x.com/",
      label: "X (Twitter)",
      hoverColor: "hover:text-black dark:hover:text-white",
    },
    {
      icon: <MediumIcon className="w-6 h-6 md:w-7 md:h-7" />,
      href: "https://medium.com/",
      label: "Medium",
      hoverColor: "hover:text-black dark:hover:text-white",
    },
    {
      icon: <SubstackIcon className="w-4 h-4 md:w-5 md:h-5" />,
      href: "https://substack.com/@aswinche",
      label: "Substack",
      hoverColor: "hover:text-[#ff6719]",
    },
    {
      icon: <DailyDevIcon className="w-4 h-4 md:w-[17px] md:h-[17px]" />,
      href: "https://app.daily.dev/aswinchettri",
      label: "Daily.dev",
      hoverColor: "hover:text-[#e05320]",
    },
  ];

  return (
    <section
      id="home"
      className="h-[100dvh] md:min-h-screen w-full relative flex flex-col md:flex-row items-center justify-end md:justify-center pt-20 md:pt-20 pb-4 md:pb-0 overflow-hidden"
    >
      <div className="absolute top-8 left-8 text-sm font-bold tracking-widest text-white/50 uppercase z-20 font-mono pointer-events-none">
        Docking Bay
      </div>

      {/* Galaxy Background Layer */}
      <div className="absolute inset-0 w-full h-full z-[-1]">
        <Galaxy
          density={1.4}
          glowIntensity={0.2}
          saturation={0}
          hueShift={140}
          twinkleIntensity={0.2}
          rotationSpeed={0.1}
          repulsionStrength={0}
          autoCenterRepulsion={0}
          starSpeed={0.4}
          speed={1}
        />
      </div>

      {/* Full width Lanyard Canvas Layer */}
      {/* We use z-0 so it's behind the text, allowing text to be clicked, but since Fiber pointer events are tied to the Canvas DOM element, you can drag the Lanyard over the text once grabbed! */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <div className="w-full h-full pointer-events-auto">
          <Lanyard
            position={[0, isMobile ? 0.5 : -1.2, isMobile ? 16.0 : 7.0]}
            gravity={[0, -40, 0]}
            frontImage="/assests/ID/id-card.png"
            lanyardImage="/assests/ID/lanyard-strap.png"
            lanyardRepeat={[-5, 1]}
            imageFit="cover"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-end gap-4 md:gap-12 relative z-10 pointer-events-none px-6 h-full md:h-auto pb-4 md:pb-0">
        {/* Right Side: Text (pointer-events-auto restores clickability for text/buttons) */}
        <div className="w-full md:w-min flex flex-col items-center md:items-start text-center md:text-left pointer-events-auto mt-auto md:-mt-24 pb-0">
          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-[24px] md:text-[57px] font-bold uppercase tracking-[0.1em] whitespace-nowrap"
          >
            {name}
          </motion.h1>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mb-4 mt-0"
          >
            <h2 className="text-[15px] md:text-[26px] font-medium text-primary tracking-widest">
              {title}
            </h2>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-0 text-muted-foreground text-base">
              <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Gangtok, Sikkim</span>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-xl text-muted-foreground mb-4 md:mb-6"
          >
            <p className="text-muted-foreground/80 leading-relaxed md:leading-relaxed w-full max-w-full text-justify text-[10px] md:text-[15px]">
              I'm a Software Developer who recently completed my Master of
              Computer Applications from Sikkim Manipal Institute of Technology,
              based out of the beautiful hills of Gangtok, Sikkim. I'm always
              building something, whether it's a personal project or an
              experiment, and always learning along the way.
            </p>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="flex flex-wrap items-center justify-start md:justify-start gap-2 md:gap-4 w-full"
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
                    className={`p-2 flex items-center gap-2 text-foreground/70 transition-all duration-300 ${social.hoverColor || "hover:text-foreground"}`}
                    aria-label={social.label}
                  >
                    {social.icon}
                    {social.text && (
                      <span
                        className={
                          social.textClass || "font-medium text-base md:text-[15px]"
                        }
                      >
                        {social.text}
                      </span>
                    )}
                  </motion.a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{social.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
