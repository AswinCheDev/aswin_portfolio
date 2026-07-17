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
import { GlassCard } from 'react-glass-ui';
import CorelliaCanals from "./ui/CorelliaCanals";


export const Projects = () => {
  const projects = [
    {
      title: "Stem Player Online",
      subtitle: "Personal Project",
      description: "A cross-platform web and mobile application for AI-powered audio stem separation, featuring an interactive 4-channel 3D mixing interface.",
      tech: ["React Native", "TypeScript", "Python", "FastAPI", "Demucs ML", "Tone.js"],
      period: "June 2026 - Present",
      status: "In Progress",
      keyFeatures: ["Demucs ML Stem Separation", "YouTube Audio Extraction", "Tone.js WebAudio DSP", "Progressive Audio Streaming"],
      image: [
        "/assests/ProjectSection/4StemPlayer/1home.png",
        "/assests/ProjectSection/4StemPlayer/2player.png",
        "/assests/ProjectSection/4StemPlayer/3library.png"
      ],
      details: {
        overview: "StemPlayer (marketed as StemPlay Online) is a cross-platform web and mobile application that emulates the physical YEEZY TECH × KANO Stem Player hardware device. It accepts audio files (MP3, WAV, FLAC, M4A) or YouTube URLs, separates them into four stems using the Demucs ML model, and provides an interactive 'puck' UI for real-time per-stem volume control and mixing.",
        problemStatement: "Music producers, DJs, and fans often want to isolate vocals, drums, or bass from existing tracks for remixes, karaoke, or study. The official Stem Player hardware is expensive and physically limited, while existing software alternatives lack an intuitive, interactive interface designed for live mixing.",
        aimAndObjective: "To democratize audio stem separation by building an accessible, high-performance web and mobile application that delivers professional-grade Demucs ML processing with a tactile, zero-latency mixing experience.",
        solutionStrategy: "I implemented a client-server architecture where a Python/FastAPI backend handles heavy ML workloads asynchronously via subprocesses, while a React Native frontend provides a 60fps interactive UI. A hidden WebView runs Tone.js to bypass React Native's Web Audio API limitations. The frontend uses a progressive streaming pattern, initially playing the original track while loading stems in the background, then crossfading seamlessly to the WebAudio nodes for per-stem manipulation.",
        features: [
            "AI Stem Separation (Vocals, Drums, Bass, Other) using Meta's Demucs model",
            "Direct YouTube URL audio extraction and processing",
            "Interactive 3D 'Puck' UI with 4-channel real-time volume sliders",
            "Solo mode (long-press to mute other stems) and Master Volume control",
            "Progressive streaming with seamless crossfading",
            "Pre-split library serving with cover art and search"
        ],
        media: [
            "/assests/ProjectSection/4StemPlayer/1home.png",
            "/assests/ProjectSection/4StemPlayer/2player.png",
            "/assests/ProjectSection/4StemPlayer/3library.png"
        ],
        stack: {
            "Frontend": "React Native, Expo, TailwindCSS, Zustand, Tone.js",
            "Backend": "Python, FastAPI, Uvicorn, yt-dlp",
            "Machine Learning": "Demucs (Meta AI), FFmpeg"
        },
        githubLink: "#",
        teamSize: "1",
        duration: "June 2026 - Present"
      }
    },
    {
      title: "GovVision",
      subtitle: "Internship at Euporia GenX",
      description: "Enterprise analytics platform featuring real-time event tracking, AI anomaly detection, and predictive forecasting for data-driven decisions.",
      tech: ["React", "TypeScript", "Node.js", "Python", "Scikit-Learn", "Redis"],
      period: "Jan 2026 - June 2026",
      status: "Completed",
      keyFeatures: ["Isolation Forest Anomaly Detection", "Prophet Time-Series Forecasting", "Real-time WebSockets", "Automated PDF Reporting", "Random Forest Risk Scoring", "Role-Based Access Control"],
      image: "/assests/ProjectSection/3GovVision/1. Dashboard.png",
      details: {
        overview: "Gov Vision is a comprehensive enterprise and government analytics platform that provides real-time event tracking, automated background reporting, and AI-powered insights for risk scoring and predictive forecasting.",
        problemStatement: "Government departments and large enterprises struggle with fragmented, unstructured data. Traditional dashboards only show historical data, lacking the predictive intelligence required to identify anomalies, forecast bottlenecks, and make proactive, data-driven decisions.",
        aimAndObjective: "To deliver a unified, highly responsive analytics portal that not only aggregates departmental KPIs but also applies advanced machine learning models to predict future trends and flag operational anomalies in real-time.",
        solutionStrategy: "Designed a robust three-tier microservice architecture. A Node.js/Express backend handles business logic, authentication, and high-speed aggregation (cached in Redis). A dedicated Python FastAPI service executes computationally heavy Scikit-Learn and Prophet models. The frontend is built with React and Vite, utilizing ECharts for complex data visualization. The AI microservice interfaces directly with MongoDB for batch training and exposes REST endpoints for real-time inference.",
        features: [
            "Real-time Organization and Department-level KPI Dashboards",
            "AI Anomaly Detection using Scikit-Learn Isolation Forest",
            "Time-Series Forecasting using Prophet (volume, delay, approval rates)",
            "Risk Heatmaps categorizing data into actionable risk bands",
            "Automated PDF/CSV Report Generation and Email Delivery via Node-cron",
            "Role-Based Access Control (RBAC) with JWT authentication"
        ],
        media: [
            "/assests/ProjectSection/3GovVision/1. Dashboard.png",
            "/assests/ProjectSection/3GovVision/2. Decision analytics.png",
            "/assests/ProjectSection/3GovVision/3. Decision.png",
            "/assests/ProjectSection/3GovVision/4. compliance.png",
            "/assests/ProjectSection/3GovVision/5. DEPARTMENT PERFORMANCE.png",
            "/assests/ProjectSection/3GovVision/6. Anomaly detection.png",
            "/assests/ProjectSection/3GovVision/7. Anomaly detection.png",
            "/assests/ProjectSection/3GovVision/8. Anomaly detection.png",
            "/assests/ProjectSection/3GovVision/9. Forecast.png",
            "/assests/ProjectSection/3GovVision/10. delay forecast.png",
            "/assests/ProjectSection/3GovVision/11. risk scoring.png",
            "/assests/ProjectSection/3GovVision/12. risk feature.png",
            "/assests/ProjectSection/3GovVision/13 report builder 1.png",
            "/assests/ProjectSection/3GovVision/14 report builder 2.png",
            "/assests/ProjectSection/3GovVision/15 report builder 3.png",
            "/assests/ProjectSection/3GovVision/16 report builder 4.png.png",
            "/assests/ProjectSection/3GovVision/17 .png",
            "/assests/ProjectSection/3GovVision/18.png"
        ],
        stack: {
            "Frontend": "React, TypeScript, Vite, Tailwind CSS, ECharts",
            "Backend": "Node.js, Express, Mongoose, Redis (ioredis)",
            "Machine Learning Microservice": "Python, FastAPI, Scikit-Learn, Prophet, Pandas"
        },
        githubLink: "#",
        teamSize: "1",
        duration: "May 2026 - June 2026"
      }
    },
    {
      title: "ValueScout - AI-Driven Smart Shopping",
      subtitle: "MCA Mini Project 2025",
      description:
        "AI-powered e-commerce platform for real-time price comparisons across major retailers with personalized recommendations, Price alerts, AI style builder.",
      tech: [
        "React", "TailwindCSS", "Python", "Flask", "MongoDB", "PyTorch"
      ],
      period: "Aug 2025 - Dec 2025",
      status: "Completed",
      keyFeatures: [
        "SerpAPI Price Aggregation", 
        "CLIP Vision Embeddings", 
        "Cosine Similarity Matching", 
        "Playwright Automation", 
        "Node-cron Price Tracking", 
        "React Query Caching"
      ],
      image: "/assests/ProjectSection/2ValueScout/homepage.png",
      details: {
        overview: "ValueScout is a smart shopping comparison tool tailored for the Indian fashion market. It aggregates product data from multiple e-commerce sites, compares prices across Amazon, Flipkart, and Nike, and features an AI-driven outfit styling assistant.",
        problemStatement: "The Indian e-commerce landscape is highly fragmented. Consumers waste significant time jumping between platforms (Myntra, Amazon, brand sites) to find the best deals or assemble matching outfits. Additionally, prices fluctuate frequently, leading to missed opportunities.",
        aimAndObjective: "To create a centralized, user-centric shopping assistant that automates price comparison, alerts users to price drops, and uses AI vision models to intelligently recommend outfit combinations from diverse catalogs.",
        solutionStrategy: "I migrated the core backend from Flask to Node.js/Express for better MongoDB performance, while maintaining a dedicated Python AI microservice that uses a CLIP vision model (PyTorch) to generate cosmetic similarity embeddings from scraped product data. I utilized Playwright for offline catalog scraping and SerpAPI for real-time price fetching.",
        features: [
            "Real-time Price Comparison via SerpAPI (Amazon, Google Shopping)",
            "AI Style Builder recommending outfits using CLIP embeddings",
            "Automated Price Drop Alerts via Nodemailer",
            "Centralized Wishlist and Price Tracking",
            "Playwright-powered offline scrapers for Myntra, SuperKicks, and VegNonVeg",
            "Google OAuth Integration for seamless login"
        ],
        media: [
            "/assests/ProjectSection/2ValueScout/vv1.mp4",
            "/assests/ProjectSection/2ValueScout/homepage.png",
            "/assests/ProjectSection/2ValueScout/homepage search.png",
            "/assests/ProjectSection/2ValueScout/ai style builder.png",
            "/assests/ProjectSection/2ValueScout/recommendation.png",
            "/assests/ProjectSection/2ValueScout/wishlist page.png",
            "/assests/ProjectSection/2ValueScout/price alert.png",
            "/assests/ProjectSection/2ValueScout/email for price alert.png",
            "/assests/ProjectSection/2ValueScout/LOGIN.png",
            "/assests/ProjectSection/2ValueScout/quick login with google.png",
            "/assests/ProjectSection/2ValueScout/register.png",
            "/assests/ProjectSection/2ValueScout/verification mail.png",
        ],
        stack: {
            "Frontend": "React, TypeScript, TailwindCSS, Vite",
            "Backend": "Node.js, Express, MongoDB, Nodemailer",
            "Machine Learning & Scraping": "Python, Flask, PyTorch, HuggingFace, Playwright",
            "APIs": "SerpAPI (Google Shopping), Google OAuth"
        },
        githubLink: "#",
        teamSize: "3",
        duration: "Aug 2025 - Dec 2025"
      }
    },
    {
      title: "Trails.in - Homestay Booking System",
      subtitle: "BCA Final Year Project 2024",
      description:
        "User-centric platform connecting travelers with local hosts in Sikkim, featuring secure booking and dual-dashboard system.",
      tech: ["JavaScript", "MySQL", "PHP", "HTML/CSS"],
      period: "Jan 2024 - May 2024",
      status: "Completed",
      keyFeatures: ["Secure Booking", "Dual-Dashboard System", "Local Host Discovery"],
      image: "/assests/ProjectSection/1Homestay/hs11.png",
      details: {
        overview: "This project is a user-centric platform designed to connect travelers with local homestay hosts in Sikkim, featuring a secure booking process and a dual-dashboard system for both guests and hosts. The proposed solution is a comprehensive system that automates reservation management, simplifies guest communication, and provides a centralized platform for discovering and booking unique, authentic accommodations.",
        problemStatement: "Homestay owners face challenges in manually managing reservations, which is time-consuming and can lead to errors like double bookings. This inefficiency puts stress on owners and can negatively impact the guest experience. For travelers, it solves the difficulty of finding and booking authentic local homestays by providing a single, reliable platform with detailed listings and user reviews.",
        aimAndObjective: "To streamline homestay operations and improve user experience by digitizing reservations, thus preventing double-booking errors and simplifying communication between hosts and travelers.",
        solutionStrategy: "Developed a dual-dashboard system utilizing a PHP backend and MySQL database for robust user and booking management. The frontend employs vanilla JavaScript, HTML, and CSS to deliver a clean, accessible booking interface for both hosts and guests.",
        features: [
            "Secure Dual-Dashboard System (Host & Guest)",
            "Real-time Booking and Reservation Management",
            "Local Host Discovery and Listing Directory",
            "User Reviews and Rating System"
        ],
        media: [
             "/assests/ProjectSection/1Homestay/hv1.mp4",
             "/assests/ProjectSection/1Homestay/hs1.png",
             "/assests/ProjectSection/1Homestay/hs2.png",
             "/assests/ProjectSection/1Homestay/hs3.png",
             "/assests/ProjectSection/1Homestay/hs4.png",
             "/assests/ProjectSection/1Homestay/hs5.png",
             "/assests/ProjectSection/1Homestay/hs6.png",
             "/assests/ProjectSection/1Homestay/hs7.png",
             "/assests/ProjectSection/1Homestay/hs8.png",
             "/assests/ProjectSection/1Homestay/hs9.png",
             "/assests/ProjectSection/1Homestay/hs10.png",
             "/assests/ProjectSection/1Homestay/hs11.png",
        ],
        stack: {
            Frontend: "HTML, CSS, JavaScript",
            Backend: "PHP",
            Database: "MySQL",
            Software: "Visual Studio 2022, Xampp"
        },
        githubLink: "#",
        teamSize: 3,
        duration: "January 2024 - May 2024"
      }
    },
  ];

  return (
    <section id="projects" className="min-h-screen flex items-center px-6 py-20 relative">
      <CorelliaCanals />
      <div className="absolute top-8 left-8 text-sm font-bold tracking-widest text-muted-foreground/50 uppercase z-20 font-mono pointer-events-none">
        Corellia
      </div>
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 display-heading">
            Projects
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <Dialog key={project.title}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="h-full"
              >
                <div className="flex flex-col h-full overflow-hidden relative group p-0 bg-white/[0.02] backdrop-blur-md border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-3xl transition-all duration-300 hover:bg-white/5 cursor-pointer">
                  {/* Project Image */}
                <div className="relative h-64 sm:h-[280px] bg-secondary/30 overflow-hidden border-b border-border/50 shrink-0">
                  {Array.isArray(project.image) ? (
                    <div className="flex w-full h-full gap-5 p-5 justify-center items-center bg-[#E2DFD3]">
                       {project.image.map((img, i) => (
                           <img 
                             key={i} 
                             src={img} 
                             alt={`${project.title} screenshot ${i+1}`} 
                             className="h-full object-contain rounded-[1.25rem] shadow-[0_10px_40px_rgba(0,0,0,0.4)] border-[3px] border-black/10 transition-transform duration-700 group-hover:scale-105 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:-translate-y-2" 
                           />
                       ))}
                    </div>
                  ) : project.image ? (
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
                  {/* Overlay Title inside Image */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex justify-between items-end">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-white drop-shadow-md">{project.title}</h3>
                      <p className="text-sm text-white/80 drop-shadow-sm font-medium mt-1">{project.subtitle}</p>
                    </div>
                    {project.status && (
                      <span className="px-2.5 py-1 text-[10px] rounded-full font-bold bg-black/60 border border-white/20 text-white/90 flex items-center backdrop-blur-md shadow-lg whitespace-nowrap ml-4">
                        {project.status === 'In Progress' && <span className="inline-block w-1.5 h-1.5 mr-1.5 rounded-full bg-amber-500 animate-pulse"></span>}
                        {project.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div>
                    {project.description && (
                      <p className="text-muted-foreground/90 mb-6 leading-relaxed text-sm">
                        {project.description}
                      </p>
                    )}

                    {project.keyFeatures && project.keyFeatures.length > 0 && (
                      <div className="mb-4 space-y-2">
                        <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Key Features</p>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                          {project.keyFeatures.map((feature, i) => (
                            <div key={i} className="flex items-start">
                              <span className="text-foreground/40 mr-1.5 text-sm">•</span>
                              <span className="text-sm text-muted-foreground leading-tight">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

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

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/30">
                    <span className="text-xs text-muted-foreground/60 font-medium tracking-wide">
                      {project.period}
                    </span>
                    <DialogTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 cursor-pointer hover:bg-secondary/20 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-foreground/80" strokeWidth={1.5} />
                      </motion.div>
                    </DialogTrigger>
                  </div>
                </div>
                </div>
              </motion.div>
              <DialogContent macOSClose={true} className="sm:max-w-[960px] max-h-[90vh] overflow-y-auto flex flex-col border-none bg-background/98 shadow-2xl">
                <DialogHeader className="flex-shrink-0">
                  <DialogTitle className="text-3xl font-bold mb-2">{project.title}</DialogTitle>
                  <DialogDescription>{project.subtitle}</DialogDescription>
                </DialogHeader>
                <div className="flex-grow overflow-y-auto overflow-x-hidden pr-2">
                  <div className="grid gap-6 py-4">
                    {/* Media Carousel First */}
                    <Carousel className="w-full relative">
                      <CarouselContent>
                        {project.details.media.length > 0 && project.details.media[0] !== "" ? (
                          project.details.media.map((mediaUrl, i) => (
                            <CarouselItem key={i} className={project.title === "Stem Player Online" ? "basis-1/3" : ""}>
                              <div className="p-2 flex h-full justify-center items-center">
                                {mediaUrl.endsWith('.mp4') ? (
                                  <video
                                    src={mediaUrl}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-auto max-h-[75vh] object-contain rounded-[1.5rem] bg-transparent"
                                  />
                                ) : (
                                  <img 
                                    src={mediaUrl} 
                                    alt={`${project.title} screenshot ${i + 1}`} 
                                    className="w-full h-auto max-h-[75vh] object-contain rounded-[1.5rem] bg-transparent"
                                  />
                                )}
                              </div>
                            </CarouselItem>
                          ))
                        ) : (
                          <CarouselItem>
                            <div className="p-1">
                              <div className="w-full max-h-[60vh] aspect-video flex flex-col items-center justify-center bg-secondary/20 border border-border/50 rounded-lg">
                                <ImageIcon className="w-12 h-12 text-muted-foreground/30 mb-2" strokeWidth={1.5} />
                                <span className="text-sm font-medium text-muted-foreground/50">No media available</span>
                              </div>
                            </div>
                          </CarouselItem>
                        )}
                      </CarouselContent>
                      {project.details.media.length > 1 && (
                        <>
                          <CarouselPrevious className="absolute left-0 sm:left-4 top-1/2 -translate-y-1/2 bg-transparent text-foreground border-0 hover:bg-black/10" />
                          <CarouselNext className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 bg-transparent text-foreground border-0 hover:bg-black/10" />
                        </>
                      )}
                    </Carousel>

                    {/* Text Details */}
                    <div>
                        <h4 className="font-semibold text-lg mb-2 text-foreground/90">Overview</h4>
                        {/* @ts-ignore */}
                        <p className="text-sm text-muted-foreground leading-relaxed">{project.details.overview}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg mb-2 text-foreground/90">Problem Statement</h4>
                        {/* @ts-ignore */}
                        <p className="text-sm text-muted-foreground leading-relaxed">{project.details.problemStatement}</p>
                    </div>
                    
                    {/* @ts-ignore */}
                    {project.details.aimAndObjective && (
                      <div>
                          <h4 className="font-semibold text-lg mb-2 text-foreground/90">Aim and Objective</h4>
                          {/* @ts-ignore */}
                          <p className="text-sm text-muted-foreground leading-relaxed">{project.details.aimAndObjective}</p>
                      </div>
                    )}

                    {/* @ts-ignore */}
                    {project.details.solutionStrategy && (
                      <div>
                          <h4 className="font-semibold text-lg mb-2 text-foreground/90">Solution Strategy & Implementation</h4>
                          {/* @ts-ignore */}
                          <p className="text-sm text-muted-foreground leading-relaxed">{project.details.solutionStrategy}</p>
                      </div>
                    )}

                    {/* @ts-ignore */}
                    {project.details.features && project.details.features.length > 0 && (
                      <div>
                          <h4 className="font-semibold text-lg mb-2 text-foreground/90">Features</h4>
                          <ul className="list-disc pl-5 space-y-1.5">
                            {/* @ts-ignore */}
                            {project.details.features.map((feature, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground leading-relaxed">{feature}</li>
                            ))}
                          </ul>
                      </div>
                    )}

                    <div className="pt-4 mt-2 border-t border-border/20">
                        <h4 className="font-semibold text-lg mb-2 text-foreground/90">Tech Stack Used</h4>
                        {Object.entries(project.details.stack).map(([category, technologies]) => (
                            <div key={category} className="mb-3">
                                <h5 className="font-semibold text-sm text-foreground/80 mb-1">{category}</h5>
                                <p className="text-sm text-muted-foreground">{/* @ts-ignore */}{technologies}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2 pt-4 border-t border-border/50">
                        <a href={project.details.githubLink} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="w-full sm:w-auto">
                                <Github className="mr-2 h-4 w-4" />
                                View Source Code
                            </Button>
                        </a>
                        <div className="text-sm text-muted-foreground font-medium flex gap-4">
                            <span>Team: {project.details.teamSize}</span>
                            <span className="text-border">|</span>
                            <span>Duration: {project.details.duration}</span>
                        </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  );
};
