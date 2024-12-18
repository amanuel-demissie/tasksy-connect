import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import Appointments from "./pages/Appointments";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-secondary">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/messages" element={<Messages />} />
          </Routes>
          <Navigation />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;