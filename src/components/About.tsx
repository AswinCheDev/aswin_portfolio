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

  const leadership = [
    {
      role: "Vice President - Computer Application Student Society (CASS), SMIT - 2025",
      description: "Led 10 members CASS to execute 8+ major technical & non-technical events for Computer Applicaiton Department,SMIT consisting of 250+ students",
    },
    {
      role: "School Vice-Captain - Greendale Senior Secondary School - 2021",
      description: "Responsbile for conducing assembly and other student leadership related work",
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
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Get to Know me</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Hailing from Gangtok, Sikkim, I have always been captivated by technology and its potential to shape the 
              future. This passion has driven my academic journey through both school and college, leading me to pursue 
              a Master's degree in Computer Applications. I am an aspiring Software Developer with hands-on experience in 
              full-stack web development and AI applications, and I am currently channeling my skills into developing 'ValueScout,'
               an innovative AI-driven e-commerce platform. I am a lifelong learner, constantly exploring futuristic technologies 
               and eager to make a meaningful impact by building valuable and innovative solutions that solve real-world problems
            </p>
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
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-teal-500">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Education</h3>
            </div>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index} className="p-6 rounded-xl bg-secondary">
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
              <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Certifications</h3>
            </div>
            {certifications.map((cert, index) => (
              <div key={index} className="p-6 rounded-xl bg-secondary">
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

          {/* Leadership */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Leadership</h3>
            </div>
            <div className="space-y-6">
              {leadership.map((lead, index) => (
                <div key={index} className="p-6 rounded-xl bg-secondary">
                  <h4 className="font-semibold text-lg mb-2">{lead.role}</h4>
                  <p className="text-muted-foreground text-sm mb-1">
                    {lead.description}
                  </p>
                </div>
              ))}
            </div>
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
              <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-red-500">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Areas of Interest & Hobbies</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <motion.span
                  key={interest}
                  whileHover={{ scale: 1.05 }}
                  className="px-3 py-1 rounded-lg bg-secondary text-sm font-medium"
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