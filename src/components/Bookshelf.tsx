import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Library, Star, ExternalLink, X, BookMarked, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Bookshelf = () => {
  const [selectedBook, setSelectedBook] = useState<any>(null);

  const books: any[] = [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Reading":
        return (
          <span className="absolute -top-3 -right-3 flex h-7 w-7 group">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent/40 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-7 w-7 glass items-center justify-center border-border/50 shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-colors group-hover:bg-accent/20 z-10">
              <BookMarked className="w-3.5 h-3.5 text-foreground/80" strokeWidth={1.5} />
            </span>
          </span>
        );
      case "Recommended":
        return (
          <span className="absolute -top-3 -right-3 flex h-7 w-7 relative inline-flex rounded-full glass items-center justify-center border-border/50 shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-colors hover:bg-yellow-500/10 z-10">
            <Star className="w-3.5 h-3.5 text-yellow-500/80" strokeWidth={1.5} />
          </span>
        );
      case "Completed":
        return (
          <span className="absolute -top-3 -right-3 flex h-7 w-7 relative inline-flex rounded-full glass items-center justify-center border-border/50 shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-colors hover:bg-blue-500/10 z-10">
            <Check className="w-3.5 h-3.5 text-blue-500/80" strokeWidth={1.5} />
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section id="books" className="min-h-screen flex items-center px-6 py-20 relative">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex p-3 glass-tag mb-4">
            <Library className="w-5 h-5 text-foreground/80" strokeWidth={1.5} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 display-heading">
            Bookshelf
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Books that have shaped my thinking, both technical and non-technical.
          </p>
        </motion.div>

        {/* Bookshelf Grid */}
        <div className="relative p-8 md:p-12 glass-card border-border/30 min-h-[300px] flex items-center justify-center">
          {books.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 relative z-10">
              {books.map((book, idx) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  whileHover={{ y: -20, rotateY: -15, scale: 1.05 }}
                  className="relative cursor-pointer group perspective-1000 mx-auto"
                  onClick={() => setSelectedBook(book)}
                >
                  {/* Status Badge */}
                  <div className="absolute -top-3 -right-3 z-20">
                    {getStatusBadge(book.status)}
                  </div>

                  {/* The Book */}
                  <div className={`w-32 md:w-40 h-48 md:h-56 rounded-r-md rounded-l-sm bg-gradient-to-br ${book.coverColor} shadow-[5px_5px_15px_rgba(0,0,0,0.3)] group-hover:shadow-[15px_15px_20px_rgba(0,0,0,0.4)] transition-all duration-300 relative flex flex-col justify-center items-center p-4 text-center border-l-[6px] border-black/20`}>
                    
                    {/* Book Pages Effect (Right edge) */}
                    <div className="absolute right-0 top-0 bottom-0 w-[4px] bg-white/80 rounded-r-md"></div>
                    
                    {/* Spine Crease */}
                    <div className="absolute left-2 top-0 bottom-0 w-[1px] bg-black/20"></div>

                    <h3 className="font-bold text-white text-sm md:text-base leading-tight mb-2 font-serif drop-shadow-md">
                      {book.title}
                    </h3>
                    <p className="text-white/70 text-[10px] md:text-xs font-medium">
                      {book.author}
                    </p>
                  </div>

                  {/* Shelf Shadow below book */}
                  <div className="absolute -bottom-2 left-0 right-0 h-2 bg-black/20 blur-sm rounded-full transform scale-90 group-hover:scale-75 transition-all"></div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <Library className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" strokeWidth={1} />
              <p className="text-muted-foreground font-medium">No books on the shelf yet.</p>
              <p className="text-muted-foreground/60 text-sm mt-1">Check back later for reading recommendations.</p>
            </div>
          )}

          {/* Minimal Glass Shelf Graphic */}
          <div className="absolute bottom-6 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-border/50 to-transparent z-0"></div>
        </div>
      </div>

      {/* Book Detail Dialog */}
      <Dialog open={!!selectedBook} onOpenChange={(open) => !open && setSelectedBook(null)}>
        <DialogContent macOSClose={true} className="sm:max-w-[600px] glass-elevated p-0 overflow-hidden border-border/30">
          {selectedBook && (
            <div className="flex flex-col md:flex-row h-full max-h-[80vh]">
              {/* Left: Cover representation */}
              <div className={`md:w-2/5 p-8 flex items-center justify-center bg-gradient-to-br ${selectedBook.coverColor} relative`}>
                <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
                <div className="w-32 h-48 bg-black/20 rounded shadow-2xl flex flex-col justify-center p-4 text-center border-l-4 border-black/30 transform -rotate-2 relative z-10">
                   <h3 className="font-bold text-white text-sm leading-tight mb-2 font-serif">{selectedBook.title}</h3>
                   <p className="text-white/70 text-[10px]">{selectedBook.author}</p>
                </div>
              </div>

              {/* Right: Content */}
              <div className="md:w-3/5 flex flex-col p-8">
                <DialogHeader className="mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <DialogTitle className="text-2xl font-bold mb-1.5 leading-tight tracking-tight">{selectedBook.title}</DialogTitle>
                      <DialogDescription className="text-base text-foreground/60">{selectedBook.author}</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <ScrollArea className="flex-grow pr-4">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 glass-tag text-xs font-medium text-foreground/70">{selectedBook.genre}</span>
                      <span className="px-3 py-1 glass-tag text-xs font-medium text-foreground/70">
                        {selectedBook.status}
                      </span>
                    </div>

                    {selectedBook.rating > 0 && (
                      <div className="flex items-center gap-1.5 text-foreground/80">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.floor(selectedBook.rating) ? 'fill-foreground text-foreground' : 'text-muted-foreground/30'}`} strokeWidth={1.5} />
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground/60">{selectedBook.rating}/5</span>
                      </div>
                    )}

                    <div className="pt-4">
                      <h4 className="text-xs font-semibold mb-3 flex items-center uppercase tracking-wider text-foreground/60">
                        <BookMarked className="w-3.5 h-3.5 mr-2" strokeWidth={1.5} />
                        My Thoughts
                      </h4>
                      <p className="text-sm text-muted-foreground/80 leading-relaxed">
                        {selectedBook.review}
                      </p>
                    </div>
                  </div>
                </ScrollArea>

                <div className="mt-8 pt-4">
                  <a 
                    href={selectedBook.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full py-3 glass rounded-xl hover:bg-secondary/20 transition-colors text-sm font-medium border-border/50 text-foreground/80"
                  >
                    View on Goodreads/Amazon <ExternalLink className="w-4 h-4 ml-2" strokeWidth={1.5} />
                  </a>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
