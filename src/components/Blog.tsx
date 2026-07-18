import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { PenTool, ExternalLink, Clock, Calendar } from "lucide-react";
import { PodraceBackground } from "./backgrounds/PodraceBackground";
import { SubstackIcon } from "@/components/ui/SubstackIcon";

export const Blog = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setIsActive(entries[0].isIntersecting);
      },
      { threshold: 0.05 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Fetch Substack RSS feed
    const fetchSubstack = async () => {
      try {
        // Fetch from the user's Substack RSS feed
        const rssUrl = "https://aswinchettri.substack.com/feed"; 
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
        const data = await res.json();

        if (data.status === "ok") {
          const formattedPosts = data.items.slice(0, 6).map((item: any) => {
            // Try to find an image in the description if thumbnail is empty
            let imageUrl = item.thumbnail;
            if (!imageUrl) {
              const imgMatch = item.description.match(/<img[^>]+src="([^">]+)"/);
              if (imgMatch) imageUrl = imgMatch[1];
            }
            
            // Create a clean excerpt
            const cleanExcerpt = item.description.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').substring(0, 120) + "...";
            
            // Format date
            const date = new Date(item.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            return {
              id: item.guid,
              title: item.title,
              excerpt: cleanExcerpt,
              date: date,
              readTime: "5 min read", // RSS doesn't provide read time natively
              link: item.link,
              image: imageUrl ? `url(${imageUrl}) center/cover no-repeat` : "linear-gradient(to right, #ff7e5f, #feb47b)",
              source: "Substack",
              sourceColor: "from-[#ff6719] to-[#ff985c]", // Substack brand colors
              tags: item.categories && item.categories.length > 0 ? item.categories.slice(0, 3) : ["Article"]
            };
          });
          setPosts(formattedPosts);
        }
      } catch (error) {
        console.error("Failed to fetch Substack feed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubstack();

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="blog"
      className="min-h-screen flex px-6 pt-8 pb-20 relative"
    >
      <PodraceBackground isActive={isActive} />
      <div className="absolute top-8 left-8 text-sm font-bold tracking-widest text-muted-foreground/50 uppercase z-20 font-mono pointer-events-none">
        Tatooine
      </div>

      <div className="w-full h-full z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-16">
          {isLoading ? (
            // Loading Skeletons
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="blog-card flex flex-col bg-card/10 animate-pulse rounded-xl border border-white/5 overflow-hidden max-w-[280px]">
                <div className="h-56 w-full bg-white/5 relative">
                  <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-3">
                    <div className="h-5 w-full bg-white/10 rounded"></div>
                    <div className="h-5 w-2/3 bg-white/10 rounded"></div>
                    <div className="flex space-x-4 mt-2">
                      <div className="h-3 w-16 bg-white/10 rounded"></div>
                      <div className="h-3 w-16 bg-white/10 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            posts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="blog-card flex flex-col overflow-hidden hover-glow transition-smooth group relative z-10 rounded-xl bg-card/5 backdrop-blur-sm border border-white/10 max-w-[280px]"
              >
                {/* Cover Image Placeholder */}
                <div
                  className="h-56 w-full relative overflow-hidden"
                  style={{ background: post.image }}
                >
                  {/* Overlay gradient for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 transition-opacity group-hover:opacity-100"></div>

                  {/* Source Badge */}
                  <div
                    className={`absolute top-4 right-4 p-1.5 rounded-full bg-gradient-to-r ${post.sourceColor} shadow-lg flex items-center justify-center z-10 transition-transform hover:scale-110`}
                    title={post.source}
                  >
                    <SubstackIcon className="w-2.5 h-2.5 text-white" />
                  </div>

                  {/* Title and Date inside image */}
                  <div className="absolute bottom-4 left-4 right-4 flex flex-col z-10">
                    <h3 className="text-base font-bold mb-3 group-hover:text-primary transition-colors leading-tight text-white shadow-sm line-clamp-3">
                      <a
                        href={post.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start"
                      >
                        {post.title}
                        <ExternalLink className="w-4 h-4 ml-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-white/70" />
                      </a>
                    </h3>
                    
                    <div className="flex items-center text-xs text-white/80 space-x-4">
                      <span className="flex items-center drop-shadow-md">
                        <Calendar className="w-3 h-3 mr-1" /> {post.date}
                      </span>
                      <span className="flex items-center drop-shadow-md">
                        <Clock className="w-3 h-3 mr-1" /> {post.readTime}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="absolute bottom-4 left-0 w-full text-center pointer-events-none z-10"
        >
          <h2 className="text-lg md:text-xl font-bold display-heading text-white/50 max-w-4xl mx-auto leading-tight">
            Some technical and non technical blogs I have written
          </h2>
        </motion.div>
      </div>
    </section>
  );
};
