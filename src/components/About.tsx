// src/components/About.tsx
import { motion } from "framer-motion";
import Cloudscape from "./ui/Cloudscape";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export const About = () => {
  const experience = [
    {
      role: "Full Stack Developer Intern",
      company: "Euphoria GenX",
      location: "Kolkata, West Bengal",
      period: "Jan 2026 – June 2026",
      project: "GovVision - Digital Decision & Governance Platform",
      projectLink: "/projects",
      techStack: "Node.js, Express, FastAPI, React, MongoDB, Redis, Python",
      points: [
        "Developed the Analytics, Reporting, and ML Monitoring module of GovVision, a microservices based observability layer",
        "Built and deployed an Isolation Forest anomaly detection pipeline trained on 31,509 governance records, serving real-time predictions through a FastAPI endpoint that flagged 146 anomalies (5.8%) across 2,500 live decisions.",
        "Trained a Random Forest classifier and Prophet forecasting pipeline for departmental risk scoring and delay prediction across departments, achieving a 12.03% org-level MAPE.",
        "Implemented an automated report generation engine scheduled through node-cron, and secured with JWT based RBAC restricting sensitive routes."
      ]
    }
  ];

  const education = [
    {
      degree: "Masters of Computer Applications",
      institution: "Sikkim Manipal Institute of Technology",
      location: "Majitar, Rangpo, Sikkim",
      period: "2024 - 2026",
      logo: "/edu/uni.png"
    },
    {
      degree: "Bachelor of Computer Applications",
      institution: "Sikkim Manipal Institute of Technology",
      location: "Majitar, Rangpo, Sikkim",
      period: "2021 - 2024",
      logo: "/edu/uni.png"
    },
    {
      degree: "Class XII",
      institution: "Greendale Senior Secondary School, CBSE",
      location: "Tadong, Gangtok, Sikkim",
      period: "2021",
      logo: "/edu/school.png"
    },
    {
      degree: "Class X",
      institution: "Greendale Senior Secondary School, CBSE",
      location: "Tadong, Gangtok, Sikkim",
      period: "2019",
      logo: "/edu/school.png"
    }
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
          <h2 className="text-3xl md:text-4xl font-bold mb-3 display-heading text-slate-900 uppercase text-center">
            About Me
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
            <div className="space-y-16 p-2 sm:p-4 w-full text-slate-900">
              {/* Professional Summary */}
              <div>
                <div className="text-slate-800 leading-relaxed space-y-4 text-lg font-medium">
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

              {/* Experience */}
              <div>
                <h3 className="text-[26px] font-bold text-slate-900 mb-4 flex items-center gap-2 uppercase">
                  Experience
                </h3>
                <div className="space-y-6">
                  {experience.map((exp, index) => (
                    <div key={index}>
                      <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-3 gap-2">
                        <div>
                          <h4 className="font-bold text-xl text-slate-900 leading-tight mb-1">
                            {exp.company} - {exp.role}
                          </h4>
                          <p className="text-slate-700 text-lg font-semibold">{exp.location}</p>
                        </div>
                        <span className="text-lg text-slate-600 font-bold whitespace-nowrap">{exp.period}</span>
                      </div>
                      
                      <div className="mb-4">
                        {exp.projectLink.startsWith('/') ? (
                          <Link to={exp.projectLink} className="inline-flex items-center text-lg font-bold text-slate-900 hover:text-blue-700 transition-colors">
                            {exp.project} <ExternalLink className="w-4 h-4 ml-1.5" />
                          </Link>
                        ) : (
                          <a href={exp.projectLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-lg font-bold text-slate-900 hover:text-blue-700 transition-colors">
                            {exp.project} <ExternalLink className="w-4 h-4 ml-1.5" />
                          </a>
                        )}
                        <p className="text-lg text-slate-700 font-semibold mt-2 font-mono block">
                          {exp.techStack}
                        </p>
                      </div>

                      <ul className="space-y-2">
                        {exp.points.map((point, i) => (
                          <li key={i} className="text-lg text-slate-800 font-medium flex items-start">
                            <span className="mr-2 text-slate-500 mt-0.5">•</span>
                            <span className="leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <h3 className="text-[26px] font-bold text-slate-900 mb-4 flex items-center gap-2 uppercase">
                  Education
                </h3>
                <div className="space-y-6">
                  {education.map((edu, index) => (
                    <div key={index} className="flex items-center gap-5 relative overflow-hidden w-full">
                      {edu.logo && (
                        <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center overflow-hidden relative z-10">
                          <img 
                            src={edu.logo} 
                            alt={edu.institution} 
                            className="w-full h-full object-contain p-2" 
                            onError={(e) => { 
                              e.currentTarget.style.display = 'none'; 
                              e.currentTarget.parentElement!.style.display = 'none';
                            }} 
                          />
                        </div>
                      )}
                      <div className="relative z-10 flex-1 flex justify-between items-baseline">
                        <div>
                          <h4 className="font-bold text-xl text-slate-900 leading-tight mb-1">{edu.degree}</h4>
                          <h4 className="font-bold text-xl text-slate-900 leading-tight">{edu.institution}</h4>
                          <p className="text-slate-700 text-lg font-semibold">{edu.location}</p>
                        </div>
                        <span className="text-lg text-slate-600 font-bold whitespace-nowrap ml-4 shrink-0">{edu.period}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <h3 className="text-[26px] font-bold text-slate-900 mb-4 uppercase">Certifications</h3>
                <div className="space-y-6">
                  {certifications.map((cert, index) => (
                    <div key={index}>
                    <h4 className="font-bold text-xl mb-1 text-slate-900">{cert.name}</h4>
                    <p className="text-slate-800 text-lg mb-1 font-medium">
                      {cert.issuer}
                    </p>
                    <p className="text-slate-700 text-lg mt-1.5 font-medium">
                      {cert.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

              {/* Interests */}
              <div>
                <h3 className="text-[26px] font-bold text-slate-900 mb-4 uppercase">Areas of Interest & Hobbies</h3>
                <div className="flex flex-wrap gap-2.5">
                  {interests.map((interest) => (
                    <motion.span
                      key={interest}
                      whileHover={{ scale: 1.05 }}
                      className="pr-4 pb-2 text-lg font-bold text-slate-800"
                    >
                      {interest}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
        </motion.div>
      </div>
    </section>
  );
};
