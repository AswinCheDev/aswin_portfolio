import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { Coruscant3D } from "./backgrounds/Coruscant3D";

export const Contact = () => {
  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "aswinkchettri@gmail.com",
      href: "https://mail.google.com/mail/?view=cm&fs=1&to=aswinkchettri@gmail.com",
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
      value: "Gangtok, Sikkim",
      href: "https://www.google.com/maps/place/Gangtok,+Sikkim",
    },
  ];

  return (
    <section 
      id="contact" 
      className="relative h-screen max-h-screen flex flex-col items-center justify-end pb-4 pt-16 overflow-hidden"
    >
      <div className="absolute top-8 left-8 text-sm font-bold tracking-widest text-white/60 uppercase z-20 font-mono pointer-events-none">
        Coruscant
      </div>

      {/* Fully 3D WebGL Background + Projector + Form */}
      <Coruscant3D />
      
      {/* Spacer to push cards to the bottom */}
      <div className="flex-1 pointer-events-none"></div>

      {/* Side Contact Cards (Vertical Layout on top left) */}
      <div className="absolute top-24 left-4 md:left-8 z-30 pointer-events-auto">
        <div className="flex flex-col gap-3 md:gap-4">
          {contactInfo.map((info, index) => (
            <motion.a
              key={info.label}
              href={info.href || "#"}
              target={info.href?.startsWith("http") ? "_blank" : undefined}
              rel={info.href?.startsWith("http") ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                opacity: { duration: 0.5, delay: index * 0.1 },
                x: { type: "spring", stiffness: 100, delay: index * 0.1 }
              }}
              whileHover={{ x: 5, scale: 1.02 }}
              className="flex items-center gap-3 p-3 md:p-4 bg-cyan-950/[0.35] hover:bg-cyan-950/70 backdrop-blur-[2px] hover:backdrop-blur-md border border-cyan-400/20 hover:border-cyan-400/40 rounded-2xl transition-all duration-500 w-full min-w-[200px] group shadow-[0_0_15px_rgba(6,182,212,0.1),inset_0_0_15px_rgba(6,182,212,0.1)] hover:shadow-[0_0_30px_rgba(6,182,212,0.2),inset_0_0_30px_rgba(6,182,212,0.15)]"
            >
              <div className="text-cyan-500/50 group-hover:text-cyan-300 transition-colors bg-cyan-900/20 group-hover:bg-cyan-800/40 border border-cyan-500/20 group-hover:border-cyan-400/50 p-2 rounded-lg">
                <info.icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] md:text-xs text-cyan-300 font-mono uppercase tracking-wider">{info.label}</span>
                <span className="text-xs md:text-sm text-cyan-50 font-medium">{info.value}</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
