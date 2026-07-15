// src/components/Contact.tsx
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Github, Linkedin } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ContactForm } from "./ContactForm";

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
      value: "Gangtok, Sikkim 737102",
      href: null,
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com/Skenlrd",
      color: "from-gray-600 to-gray-800",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://linkedin.com/in/aswinchettri",
      color: "from-blue-600 to-blue-800",
    },
  ];

  return (
    <section 
      id="contact" 
      className="relative min-h-screen flex items-center px-6 py-20"
    >
      <div className="max-w-5xl mx-auto w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 pixel-heading">
            Get In Touch
          </h2>
          <p className="text-muted-foreground text-lg">
            Let's build something amazing together
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact info and social links */}
          <div className="space-y-6 md:space-y-8">
            {contactInfo.map((info, index) => (
              <motion.a
                key={info.label}
                href={info.href || "#"}
                target={info.href?.startsWith("http") ? "_blank" : undefined}
                rel={info.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex items-center gap-4 md:gap-6 p-4 md:p-6 glass-card glass-card-hover group"
              >
                <div className="p-3 md:p-4 glass-tag">
                  <info.icon className="w-5 h-5 md:w-6 md:h-6 text-foreground/80" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-lg md:text-xl font-semibold mb-1 text-foreground/90">{info.label}</h4>
                  <p className="text-sm md:text-base text-muted-foreground group-hover:text-primary transition-colors">
                    {info.value}
                  </p>
                </div>
              </motion.a>
            ))}

            {/* Social Links Mini-Grid */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex gap-4 pt-4"
            >
              {socialLinks.map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 glass-card glass-card-hover text-foreground/80 hover:text-foreground"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Right Side: CTA and Dialog */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8 flex flex-col justify-center"
          >
            <div>
              <h3 className="text-2xl font-bold mb-4">Connect with me</h3>
              <p className="text-muted-foreground mb-8">
                Follow my journey, stay updated with my latest projects, or drop me a message if you want to collaborate!
              </p>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 glass rounded-xl font-medium text-center text-foreground/90 border border-border hover:bg-secondary/20 transition-colors cursor-pointer"
                >
                  Send a Message
                </motion.div>
              </DialogTrigger>
              <DialogContent macOSClose={true} className="sm:max-w-[425px]">
                <ContactForm />
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12 text-muted-foreground"
        >
          <p>© 2025 Aswin Chettri</p>
        </motion.div>
      </div>
    </section>
  );
};