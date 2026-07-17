import { motion } from "framer-motion";
import { PenTool, ExternalLink, Clock, Calendar } from "lucide-react";

export const Blog = () => {
  const posts: any[] = [];

  return (
    <section id="blog" className="min-h-screen flex items-center px-6 py-20 relative">
      <div className="absolute top-8 left-8 text-sm font-bold tracking-widest text-muted-foreground/50 uppercase z-20 font-mono pointer-events-none">
        Alderaan
      </div>
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex p-3 glass-tag mb-4">
            <PenTool className="w-5 h-5 text-foreground/80" strokeWidth={1.5} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 display-heading">
            Writing & Thoughts
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Articles, tutorials, and reflections on software engineering.
          </p>
        </motion.div>

        {posts.length === 0 ? (
          <div className="w-full text-center py-24 text-muted-foreground/80 glass-card border border-border/30 rounded-2xl">
            No writing or articles available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="glass-card flex flex-col overflow-hidden hover-glow transition-smooth group"
              >
                {/* Cover Image Placeholder */}
                <div 
                  className="h-48 w-full relative overflow-hidden"
                  style={{ background: post.image }}
                >
                  {/* Source Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r ${post.sourceColor} text-white text-xs font-bold shadow-lg flex items-center`}>
                    {post.source}
                  </div>
                  
                  {/* Overlay gradient for text readability if we had actual images */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-50"></div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center text-xs text-muted-foreground mb-3 space-x-4">
                    <span className="flex items-center"><Calendar className="w-3 h-3 mr-1"/> {post.date}</span>
                    <span className="flex items-center"><Clock className="w-3 h-3 mr-1"/> {post.readTime}</span>
                  </div>

                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
                    <a href={post.link} target="_blank" rel="noopener noreferrer" className="flex items-start">
                      {post.title}
                      <ExternalLink className="w-4 h-4 ml-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-muted-foreground" />
                    </a>
                  </h3>

                  <p className="text-muted-foreground text-sm mb-6 flex-grow leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    {post.tags.map((tag: any) => (
                      <span key={tag} className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
