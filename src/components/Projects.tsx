// src/components/Projects.tsx
import { motion } from "framer-motion";
import { ExternalLink, Image as ImageIcon, ChevronLeft, ChevronRight, Github } from "lucide-react"; // Import Chevron and Github icons
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";


export const Projects = () => {
  const projects = [
    {
      title: "ValueScout - AI-Driven Smart Shopping",
      subtitle: "MCA Mini Project 2025",
      description:
        "AI-powered e-commerce platform for real-time price comparisons across major retailers with personalized recommendations, Price alerts, AI style builder.",
      tech: [
        "HTML5", "CSS3", "JavaScript", "React", "Bootstrap", "TailwindCSS",
        "Python", "Flask", "Django", "Node.js", "MySQL", "MongoDB", "Python 3.13",
        "Pandas", "NumPy", "TensorFlow", "PyTorch", "BeautifulSoup", "REST APIs",
        "VS Code", "Postman", "AWS", "Heroku"
    ],
      period: "Aug 2025 - Present",
      status: "In Progress",
      keyFeatures: ["Real-time Price Comparison", "AI Style Builder", "Price Alerts"],
      image: "/Images/ProjectSection/ValueScout/vs100.png",
      details: {
        introduction: "This project aims to develop a single, easy-to-use web platform where you can find and compare products from almost any online store in India. It works by searching through many different online shops at the same time, showing you all your choices and their current prices on one simple screen. The problem it solves is the frustration of visiting multiple websites to compare prices and products, which wastes time and makes it hard to be sure you've made the best choice. The platform's proposed solution is a single search engine for the Indian e-commerce market that aggregates real-time product listings, allowing users to easily compare products and prices.",
        problemSolved: "Online shopping is frustrating because the market is fragmented across many platforms. Consumers have to visit multiple websites to find a single product, which wastes time. E-commerce platforms focus on selling individual items rather than helping people create complete outfits, and online prices change often, leading to missed sales. This platform solves these issues by combining powerful price comparison with a clean, ad-free interface and AI-driven styling advice.",
        media: [
            "/Images/ProjectSection/ValueScout/vv1.mp4",
            "/Images/ProjectSection/ValueScout/vs1.png",
            "/Images/ProjectSection/ValueScout/vs2.png",
            "/Images/ProjectSection/ValueScout/vs3.png",
        ],
        stack: {
            Frontend: "HTML5, CSS3, JavaScript, React, Bootstrap / TailwindCSS",
            Backend: "Python (Flask/Django) or Node.js",
            Database: "MySQL / MongoDB",
            "AI/ML": "Python 3.13, Pandas, NumPy, TensorFlow / PyTorch, BeautifulSoup",
            "Tools & Deployment": "VS Code, Postman, Web server (AWS, Heroku, or similar)"
        },
        githubLink: "#", // Add your GitHub link here
        teamSize: 3,
        duration: "August 2025 - In Progress"
      }
    },
    {
      title: "Trails.in - Homestay Booking System",
      subtitle: "BCA Final Year Project 2024",
      description:
        "User-centric platform connecting travelers with local hosts in Sikkim, featuring secure booking and dual-dashboard system.",
      tech: ["HTML", "CSS", "JavaScript", "MySQL", "PHP", "XAMPP"],
      period: "Jan 2024 - May 2024",
      status: "Completed",
      keyFeatures: ["Secure Booking", "Dual-Dashboard System", "Local Host Discovery"],
      image: "/Images/ProjectSection/Homestay/hs11.png",
      details: {
        introduction: "This project is a user-centric platform designed to connect travelers with local homestay hosts in Sikkim, featuring a secure booking process and a dual-dashboard system for both guests and hosts. The problem it addresses is that homestay owners often manage reservations and guest interactions manually, which leads to inefficiencies, potential booking errors, and communication gaps that can harm the guest experience. The proposed solution is a comprehensive system that automates reservation management, simplifies guest communication, and provides a centralized platform for discovering and booking unique, authentic accommodations.",
        problemSolved: "Homestay owners face challenges in manually managing reservations, which is time-consuming and can lead to errors like double bookings. This inefficiency puts stress on owners and can negatively impact the guest experience. The system solves this by automating reservation management and streamlining guest communication through a dedicated host dashboard. For travelers, it solves the difficulty of finding and booking authentic local homestays by providing a single, reliable platform with detailed listings and user reviews.",
        media: [
             "/Images/ProjectSection/Homestay/hv1.mp4",
             "/Images/ProjectSection/Homestay/hs1.png",
             "/Images/ProjectSection/Homestay/hs2.png",
             "/Images/ProjectSection/Homestay/hs3.png",
             "/Images/ProjectSection/Homestay/hs4.png",
             "/Images/ProjectSection/Homestay/hs5.png",
             "/Images/ProjectSection/Homestay/hs6.png",
             "/Images/ProjectSection/Homestay/hs7.png",
             "/Images/ProjectSection/Homestay/hs8.png",
             "/Images/ProjectSection/Homestay/hs9.png",
             "/Images/ProjectSection/Homestay/hs10.png",
        ],
        stack: {
            Frontend: "HTML, CSS, JavaScript",
            Backend: "PHP",
            Database: "MySQL",
            Software: "Visual Studio 2022, Xampp"
        },
        githubLink: "#", // Add your GitHub link here
        teamSize: 3,
        duration: "January 2024 - May 2024"
      }
    },
  ];

  return (
    <section id="projects" className="min-h-screen flex items-center px-6 py-20">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 pixel-heading">
            Projects
          </h2>
          <p className="text-muted-foreground text-lg">
            Building innovative solutions with modern technologies
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <Dialog key={project.title}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="glass-card flex flex-col overflow-hidden glass-card-hover relative group"
              >
                {/* Project Image */}
                <div className="relative h-48 bg-secondary/30 overflow-hidden border-b border-border/50">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center border-b border-border">
                      <ImageIcon className="w-12 h-12 text-muted-foreground/30" strokeWidth={1.5} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex-grow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-2xl font-semibold tracking-tight">{project.title}</h3>
                          <span className="px-3 py-1 text-xs rounded-full font-medium glass border-border/50 text-foreground/80 flex items-center">
                            {project.status === 'In Progress' && <span className="inline-block w-1.5 h-1.5 mr-1.5 rounded-full bg-amber-500 animate-pulse"></span>}
                            {project.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {project.subtitle}
                        </p>
                      </div>
                    </div>

                    <p className="text-muted-foreground/80 mb-6 leading-relaxed flex-grow text-sm">
                      {project.description}
                    </p>

                    <div className="mb-6 space-y-1.5">
                      <p className="text-xs font-semibold text-foreground/60 mb-2 uppercase tracking-wider">Key Features</p>
                      {project.keyFeatures.map((feature, i) => (
                        <div key={i} className="flex items-start">
                          <span className="text-foreground/40 mr-2 text-sm">•</span>
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1.5 glass-tag text-[11px] font-medium text-foreground/70"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/30">
                    <span className="text-xs text-muted-foreground/60 font-medium tracking-wide">
                      {project.period}
                    </span>
                    <DialogTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2.5 rounded-full glass cursor-pointer hover:bg-secondary/20 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-foreground/80" strokeWidth={1.5} />
                      </motion.div>
                    </DialogTrigger>
                  </div>
                </div>
              </motion.div>
              <DialogContent macOSClose={true} className="sm:max-w-[960px] h-[84vh] flex flex-col"> {/* Increased max-width and height */}
                <DialogHeader className="flex-shrink-0">
                  <DialogTitle className="text-3xl font-bold mb-2">{project.title}</DialogTitle>
                  <DialogDescription>{project.subtitle}</DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-grow">
                  <div className="grid gap-6 py-4 pr-6">
                      <div>
                          <h4 className="font-semibold text-lg mb-2">Introduction</h4>
                          <p className="text-sm text-muted-foreground">{project.details.introduction}</p>
                      </div>
                      <div>
                          <h4 className="font-semibold text-lg mb-2">Problem Solved</h4>
                          <p className="text-sm text-muted-foreground">{project.details.problemSolved}</p>
                      </div>
                    <Carousel className="w-full relative"> {/* Added relative for positioning arrows */}
                      <CarouselContent>
                        {project.details.media.length > 0 && project.details.media[0] !== "" ? (
                          project.details.media.map((mediaUrl, i) => (
                            <CarouselItem key={i}>
                              <div className="p-1">
                                {mediaUrl.endsWith('.mp4') ? (
                                  <video
                                    src={mediaUrl}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-auto object-cover rounded-lg"
                                  />
                                ) : (
                                  <img 
                                    src={mediaUrl} 
                                    alt={`${project.title} screenshot ${i + 1}`} 
                                    className="w-full h-auto object-cover rounded-lg" 
                                  />
                                )}
                              </div>
                            </CarouselItem>
                          ))
                        ) : (
                          <CarouselItem>
                              <div className="p-1 flex items-center justify-center bg-secondary rounded-lg h-64">
                                  <ImageIcon className="w-16 h-16 text-muted-foreground/30" />
                              </div>
                          </CarouselItem>
                        )}
                      </CarouselContent>
                      {/* Custom macOS-style navigation */}
                      <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 backdrop-blur-sm border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer shadow-sm hover:bg-white transition-colors duration-200">
                         <ChevronLeft className="h-4 w-4 text-gray-700" />
                      </CarouselPrevious>
                      <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 backdrop-blur-sm border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer shadow-sm hover:bg-white transition-colors duration-200">
                         <ChevronRight className="h-4 w-4 text-gray-700" />
                      </CarouselNext>
                    </Carousel>
                    <div>
                        <h4 className="font-semibold text-lg mb-2">Tech Stack</h4>
                        {Object.entries(project.details.stack).map(([category, technologies]) => (
                            <div key={category} className="mb-2">
                                <h5 className="font-semibold text-sm">{category}</h5>
                                <p className="text-sm text-muted-foreground">{technologies}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <a href={project.details.githubLink} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline">
                                <Github className="mr-2 h-4 w-4" />
                                GitHub Repo
                            </Button>
                        </a>
                        <div className="text-sm text-muted-foreground">
                            <span>Team Size: {project.details.teamSize}</span> | <span>Duration: {project.details.duration}</span>
                        </div>
                    </div>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  );
};