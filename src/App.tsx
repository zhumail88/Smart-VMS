import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import VisitorPassPage from "./pages/VisitorPassPage";
import CheckOut from "./pages/CheckOut";
import VisitorLog from "./pages/VisitorLog";
import Analytics from "./pages/Analytics";
import PreApproval from "./pages/PreApproval";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pass/:id" element={<VisitorPassPage />} />
            <Route path="/checkout" element={<CheckOut />} />
            <Route path="/visitors" element={<VisitorLog />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/pre-approval" element={<PreApproval />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
