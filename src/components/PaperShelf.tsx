import { motion } from "framer-motion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { BookOpen, ExternalLink, Calendar, Tag } from "lucide-react";

export const PaperShelf = () => {
  // Placeholder data for papers
  const papers: any[] = [];

  return (
    <section id="papers" className="min-h-screen flex items-center px-6 py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex p-3 glass-tag mb-4">
            <BookOpen className="w-5 h-5 text-foreground/80" strokeWidth={1.5} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 pixel-heading">
            Recent Papers
          </h2>
          <p className="text-muted-foreground text-lg">
            Research papers I've read recently to stay ahead of the curve.
          </p>
        </motion.div>

        {papers.length === 0 ? (
          <div className="w-full text-center py-24 text-muted-foreground/80 glass-card border border-border/30 rounded-2xl mt-8">
            No papers have been added yet.
          </div>
        ) : (
          <div className="relative">
            {/* The Shelf Container */}
            {/* Wood shelf background effect */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-stone-800 via-stone-700 to-stone-800 rounded-lg shadow-xl translate-y-2 z-0 hidden md:block"></div>
            <div className="absolute bottom-4 left-4 right-4 h-1 bg-black/40 blur-sm z-0 hidden md:block"></div>

            <ScrollArea className="w-full pb-8 z-10">
              <div className="flex w-max space-x-6 p-4">
                {papers.map((paper, idx) => (
                  <motion.div
                    key={paper.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    whileHover={{ y: -15, scale: 1.02 }}
                    className="w-[320px] md:w-[380px] shrink-0 relative group perspective-1000"
                  >
                    <div className="h-full bg-card border border-border/50 rounded-xl p-6 shadow-lg transition-all duration-300 group-hover:shadow-blue-500/20 group-hover:border-blue-500/50 flex flex-col relative overflow-hidden">
                      {/* Decorative side binding */}
                      <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-blue-500 to-purple-600 opacity-80"></div>
                      
                      <div className="flex-grow">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-bold line-clamp-2 leading-tight">{paper.title}</h3>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4 italic line-clamp-2">
                          {paper.authors}
                        </p>
                        
                        <div className="mb-4">
                          <p className="text-sm font-medium mb-1">My Takeaway:</p>
                          <p className="text-sm text-foreground/80 line-clamp-3 leading-relaxed">
                            "{paper.takeaway}"
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-auto pt-4 border-t border-border/50 space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {paper.tags.map((tag: any) => (
                            <span key={tag} className="inline-flex items-center text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-xs text-muted-foreground flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {paper.dateRead}
                          </span>
                          
                          <a 
                            href={paper.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            Read Paper
                            <ExternalLink className="w-4 h-4 ml-1" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="bg-secondary/50" />
            </ScrollArea>
          </div>
        )}
      </div>
    </section>
  );
};
