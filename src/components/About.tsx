// src/components/About.tsx
import { motion } from "framer-motion";
import Cloudscape from "./ui/Cloudscape";

import { GlassCard } from 'react-glass-ui';

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
    <section id="about" className="min-h-screen flex items-center px-6 py-20 relative overflow-hidden text-slate-900">
      <div className="absolute top-8 left-8 text-sm font-bold tracking-widest text-slate-800/50 uppercase z-20 font-mono pointer-events-none">
        Naboo
      </div>

      <div className="absolute inset-0 z-[-1]">
        <Cloudscape />
      </div>
      
      <div className="max-w-[70rem] mx-auto w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full flex flex-col items-center justify-center text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 display-heading text-slate-900">
            About Me
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard
            className="w-full text-slate-900 p-2 sm:p-4"
            blur={8}
            distortion={4}
            backgroundColor="rgba(255, 255, 255, 0.4)"
            backgroundOpacity={0.6}
            borderRadius={24}
            borderOpacity={0.3}
            borderColor="#ffffff"
            flexibility={1}
            chromaticAberration={0}
          >
            <div className="space-y-10 p-4 sm:p-6">
              {/* Professional Summary */}
              <div>
                <div className="text-slate-800 leading-relaxed space-y-4 text-base font-medium">
                  <p>
                    I'm a Full Stack Developer who recently completed my Master of Computer Applications at Sikkim Manipal Institute of Technology, based out of the beautiful hills of Gangtok, Sikkim. My current tech stack that I'm hands-on with includes React, TypeScript, Python, JavaScript, MongoDB, SQL, and a few others.
                  </p>
                  <p>
                    Technology has had my attention since long before I knew what a semicolon was for, back when Python was just a snake to me. I'm an explorer of new technologies and an avid learner, deep into what's happening in the world of artificial intelligence and machine learning. I'm also very interested in UI/UX. I'm always building something, whether it's a personal project or an experiment, and always learning along the way.
                  </p>
                  <p>
                    Besides all the tech-related stuff, I'm a huge football fan; Glory Glory Man United!!! I'm also into Star Wars and Hip Hop, and I occasionally write about it all.
                  </p>
                </div>
              </div>

              {/* Education */}
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-5">Education</h3>
                <div className="space-y-4">
                  {education.map((edu, index) => (
                    <div key={index} className="p-5 rounded-2xl bg-white/30 backdrop-blur-sm border border-white/40">
                      <h4 className="font-bold text-lg text-slate-900">{edu.degree}</h4>
                      <p className="text-slate-800 text-sm font-medium">{edu.institution}</p>
                      <p className="text-xs text-slate-600 mt-1 font-semibold">{edu.period}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-5">Certifications</h3>
                {certifications.map((cert, index) => (
                  <div key={index} className="p-5 rounded-2xl bg-white/30 backdrop-blur-sm border border-white/40">
                    <h4 className="font-bold text-lg mb-1 text-slate-900">{cert.name}</h4>
                    <p className="text-slate-800 text-sm mb-1 font-medium">
                      {cert.issuer}
                    </p>
                    <p className="text-slate-700 text-sm mt-1.5 font-medium">
                      {cert.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Areas of Interest */}
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-5">Areas of Interest & Hobbies</h3>
                <div className="flex flex-wrap gap-2.5">
                  {interests.map((interest) => (
                    <motion.span
                      key={interest}
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 bg-white/40 backdrop-blur-md rounded-xl text-sm font-bold text-slate-800 border border-white/50 shadow-sm"
                    >
                      {interest}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};
