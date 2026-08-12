import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { SpaceBackground } from "@/components/ui/SpaceBackground";
import { PageTransition } from "@/components/PageTransition";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <SpaceBackground />
      <Navbar />
      <PageTransition />
      <Outlet />
    </div>
  );
};

export default Index;
