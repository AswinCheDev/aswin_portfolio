// src/components/About.tsx
import { motion } from "framer-motion";
import { GraduationCap, Trophy, Heart, Award, UserCheck } from "lucide-react";

export const About = () => {
  const education = [
    {
      degree: "Masters of Computer Applications",
      institution: "Sikkim Manipal Institute of Technology",
      period: "2024 - 2026",
    },
    {
      degree: "Bachelor of Computer Applications",
      institution: "Sikkim Manipal Institute of Technology",
      period: "2021 - 2024",
    },
  ];

  const certifications = [
    {
      name: "Complete Web Development Course - 2025",
      issuer: "by Hitesh Choudhary - Full-stack development with modern technologies",
      description: "Frontend: HTML, CSS, Tailwind, JavaScript, React, Next.js | Backend: Node.js, Express, Prisma, Drizzle | Databases: MongoDB, PostgreSQL, MySQL, NeonDB | State Management: Redux, Redux Toolkit, Zustand | AI/ML: TensorFlow.js, LangChain | Tools & Deployment: Git/GitHub, Docker, VPS/server deployment..",
    },
  ];


  const interests = [
    "Football",
    "Table Tennis",
    "Gaming",
    "Gym",
    "Movies",
    "New Technology",
    "Large Language Model",
    "Artificial Intelligence",
  ];

  return (
    <section id="about" className="min-h-screen flex items-center px-6 py-20">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 pixel-heading">
            About Me
          </h2>
          <p className="text-muted-foreground text-lg">
            My journey in software development and as a Human Being.
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Professional Summary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 glass-tag">
                <Trophy className="w-5 h-5 text-foreground/80" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-semibold">Get to Know me</h3>
            </div>
            <div className="text-muted-foreground leading-relaxed space-y-4">
              <p>
                Technology has had my attention since long before I knew what a semicolon was for, back when Python was just a snake to me. I'm an explorer of new technologies and an avid learner, deep into what's happening in the world of artificial intelligence and machine learning. I'm also very interested in UI/UX.
              </p>
              <p>
                My current tech stack that I'm hands-on with includes React, TypeScript, Python, JavaScript, MongoDB, SQL, and a few others. I'm always building something, whether it's a personal project or an experiment, and always learning along the way.
              </p>
              <p>
                Besides all the tech-related stuff, I'm a huge football fan; Glory Glory Man United!!! I'm also into Star Wars and Hip Hop, and I occasionally write about it all.
              </p>
            </div>
          </motion.div>

          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 glass-tag">
                <GraduationCap className="w-5 h-5 text-foreground/80" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-semibold">Education</h3>
            </div>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index} className="p-6 rounded-2xl glass">
                  <h4 className="font-semibold text-lg">{edu.degree}</h4>
                  <p className="text-muted-foreground text-sm">{edu.institution}</p>
                  <p className="text-xs text-muted-foreground mt-1">{edu.period}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-card p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 glass-tag">
                <Award className="w-5 h-5 text-foreground/80" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-semibold">Certifications</h3>
            </div>
            {certifications.map((cert, index) => (
              <div key={index} className="p-6 rounded-2xl glass">
                <h4 className="font-semibold text-lg mb-2">{cert.name}</h4>
                <p className="text-muted-foreground text-sm mb-1">
                  {cert.issuer}
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                  {cert.description}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Areas of Interest */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="glass-card p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 glass-tag">
                <Heart className="w-5 h-5 text-foreground/80" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-semibold">Areas of Interest & Hobbies</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {interests.map((interest) => (
                <motion.span
                  key={interest}
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 glass-tag text-sm font-medium text-foreground/80"
                >
                  {interest}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};