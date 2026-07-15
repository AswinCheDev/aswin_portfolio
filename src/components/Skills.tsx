// src/components/Skills.tsx
import { motion } from "framer-motion";
import { Code2, Database, Wrench, BookOpen, TrendingUp, BookCopy } from "lucide-react";

export const Skills = () => {
  const skillCategories = [
    {
      title: "Languages",
      icon: Code2,
      skills: ["Python", "JavaScript", "Java", "C++", "PHP", "SQL", "HTML", "CSS"],
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Frameworks",
      icon: Wrench,
      skills: ["React.js", "Flask", "Django", "TensorFlow", "BeautifulSoup"],
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Databases",
      icon: Database,
      skills: ["MongoDB", "MySQL", "PostgreSQL"],
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Tools & More",
      icon: BookOpen,
      skills: ["Git", "VS Code", "Linux", "Windows", "Cisco Packet Tracer"],
      color: "from-orange-500 to-red-500",
    },
     {
      title: "Course Work",
      icon: BookCopy,
      skills: ["Data Science","Data Structures", "Algorithms", "Operating Systems", "DBMS", "Machine Learning", "Computer Network"],
      color: "from-rose-500 to-fuchsia-500",
    },
    {
      title: "Currently Learning",
      icon: TrendingUp,
      skills: ["Next.js", "Docker", "Three.js"],
      color: "from-yellow-500 to-amber-500",
    },
   
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="skills" className="min-h-screen flex items-center px-6 py-20">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 pixel-heading">
            Technical Skills
          </h2>
          <p className="text-muted-foreground text-lg">
            Technologies and tools I work with
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-6"
        >
          {skillCategories.map((category) => (
            <motion.div
              key={category.title}
              variants={itemVariants}
              whileHover={{
                scale: 1.02,
                rotateY: 5,
                rotateX: 5,
              }}
              className="glass-card p-8 glass-card-hover relative overflow-hidden group"
            >
              {/* Icon */}
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="inline-flex p-3 glass-tag mb-4"
              >
                <category.icon className="w-5 h-5 text-foreground/80" strokeWidth={1.5} />
              </motion.div>

              {/* Title */}
              <h3 className="text-xl font-semibold mb-4">{category.title}</h3>

              {/* Skills */}
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill) => (
                  <motion.span
                    key={skill}
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 glass-tag text-sm font-medium text-foreground/80"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};