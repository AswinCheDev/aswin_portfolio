import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { Coruscant3D } from "./backgrounds/Coruscant3D";

export const Contact = () => {
  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "aswinkchettri@gmail.com",
      href: "mailto:aswinkchettri@gmail.com",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+91 8768943377",
      href: "tel:+918768943377",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Coruscant, Road",
      href: null,
    },
  ];

  return (
    <section 
      id="contact" 
      className="relative h-screen max-h-screen flex flex-col items-center justify-end pb-4 pt-16 overflow-hidden"
    >
      {/* Fully 3D WebGL Background + Projector + Form */}
      <Coruscant3D />
      
      {/* Spacer to push cards to the bottom */}
      <div className="flex-1 pointer-events-none"></div>

      {/* Bottom Contact Cards (Horizontal Layout with floating animation) */}
      <div className="relative z-30 w-full max-w-5xl px-4 mt-2 mb-2">
        <div className="flex flex-row justify-center items-center gap-2 md:gap-4 flex-wrap">
          {contactInfo.map((info, index) => (
            <motion.a
              key={info.label}
              href={info.href || "#"}
              target={info.href?.startsWith("http") ? "_blank" : undefined}
              rel={info.href?.startsWith("http") ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: [0, -6, 0] }}
              transition={{ 
                opacity: { duration: 0.5, delay: index * 0.1 },
                y: { repeat: Infinity, duration: 4, delay: index * 0.5, ease: "easeInOut" }
              }}
              className="flex items-center gap-2 p-2 md:p-3 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 hover:border-cyan-500/50 rounded-xl transition-colors w-auto min-w-[160px] group"
            >
              <div className="text-slate-400 group-hover:text-cyan-400 transition-colors">
                <info.icon className="w-4 h-4 md:w-5 md:h-5" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] md:text-xs text-slate-400 font-mono uppercase tracking-wider">{info.label}</span>
                <span className="text-xs md:text-sm text-slate-200 font-medium">{info.value}</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
