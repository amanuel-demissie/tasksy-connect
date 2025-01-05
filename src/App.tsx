import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import AppRoutes from "@/components/AppRoutes";
import Navigation from "@/components/Navigation";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <main className="pb-24">
              <AppRoutes />
            </main>
            <Navigation />
            <Toaster />
          </div>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;