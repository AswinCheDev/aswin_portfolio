import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index"; // <-- Correctly imports your main page
import LandingScreen from "./components/LandingScreen"; // <-- Imports the new landing screen

const queryClient = new QueryClient();

const App = () => {
  const [loading, setLoading] = useState(true);

  // This logic now correctly shows the landing screen first,
  // and then your actual portfolio content.
  if (loading) {
    return <LandingScreen onFinish={() => setLoading(false)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* All your original providers are kept, and we render the Index page */}
        <Index />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
