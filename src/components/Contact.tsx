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
    <section id="contact" className="min-h-screen flex items-center px-6 py-20">
      <div className="max-w-5xl mx-auto w-full">
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

        <div className="grid md:grid-cols-2 gap-6">
          {/* Contact info cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {contactInfo.map((item) => (
              <motion.div
                key={item.label}
                whileHover={{ scale: 1.02, x: 4 }}
                className="glass-card p-6 hover-lift transition-smooth"
              >
                {item.href ? (
                  <a
                    href={item.href}
                    className="flex items-center gap-4 group"
                  >
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent">
                      <item.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="font-medium group-hover:text-primary transition-smooth">
                        {item.value}
                      </p>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent">
                      <item.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="font-medium">{item.value}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Social links and CTA */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-2xl font-bold mb-4">Connect with me</h3>
              <p className="text-muted-foreground mb-6">
                Follow my journey and stay updated with my latest projects and
                achievements.
              </p>

              <div className="space-y-3 mb-8">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-smooth group"
                  >
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-br ${social.color}`}
                    >
                      <social.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium group-hover:text-primary transition-smooth">
                      {social.label}
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-center hover-glow transition-smooth cursor-pointer"
                >
                  Send a Message
                </motion.div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
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