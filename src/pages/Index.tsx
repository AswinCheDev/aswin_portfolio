import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { PaperShelf } from "@/components/PaperShelf";
import { Bookshelf } from "@/components/Bookshelf";
import { Blog } from "@/components/Blog";
import { Contact } from "@/components/Contact";
import { LightsaberCursor } from "@/components/LightsaberCursor";

import { SpaceBackground } from "@/components/ui/SpaceBackground";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <SpaceBackground />
      <LightsaberCursor />
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Blog />
      {/* Archives Section */}
      <div id="archives">
        <PaperShelf />
        <Bookshelf />
      </div>
      <Contact />
    </div>
  );
};

export default Index;
