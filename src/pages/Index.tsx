import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { LightsaberCursor } from "@/components/LightsaberCursor";
import { SpaceBackground } from "@/components/ui/SpaceBackground";
import { PageTransition } from "@/components/PageTransition";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <SpaceBackground />
      <LightsaberCursor />
      <Navbar />
      <PageTransition />
      <Outlet />
    </div>
  );
};

export default Index;
