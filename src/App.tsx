
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/components/NotificationProvider";
import { SettingsProvider } from "@/contexts/SettingsContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Order from "./pages/Order";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Track from "./pages/Track";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import PasswordRecovery from "./pages/PasswordRecovery";
import ResetPassword from "./pages/ResetPassword";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentError from "./pages/PaymentError";
import Admin from "./pages/Admin";
import AdminUsers from "./pages/AdminUsers";
import AdminServices from "./pages/AdminServices";
import AdminServiceNames from "./pages/AdminServiceNames";
import AdminBlog from "./pages/AdminBlog";
import AdminContactMessages from "./pages/AdminContactMessages";
import AdminSettings from "./pages/AdminSettings";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import { RobotsRoute } from "./components/RobotsRoute";
import { SitemapRoute } from "./components/SitemapRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <NotificationProvider>
          <LanguageProvider>
            <AuthProvider>
              <SettingsProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/password-recovery" element={<PasswordRecovery />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/payment-success" element={<PaymentSuccess />} />
                    <Route path="/payment-error" element={<PaymentError />} />
                    <Route path="/robots.txt" element={<RobotsRoute />} />
                    <Route path="/sitemap.xml" element={<SitemapRoute />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/track" element={<Track />} />
                    
                    {/* Language-specific routes */}
                    <Route path="/:lang" element={<Index />} />
                    <Route path="/:lang/about" element={<About />} />
                    <Route path="/:lang/services" element={<Services />} />
                    <Route path="/:lang/services/:platform" element={<ServiceDetail />} />
                    <Route path="/:lang/contact" element={<Contact />} />
                    <Route path="/:lang/blog" element={<Blog />} />
                    <Route path="/:lang/blog/:slug" element={<BlogPost />} />
                    <Route path="/:lang/order" element={<Order />} />
                    <Route path="/:lang/dashboard" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    
                    {/* Admin routes */}
                    <Route path="/admin" element={
                      <ProtectedAdminRoute>
                        <Admin />
                      </ProtectedAdminRoute>
                    } />
                    <Route path="/admin/users" element={
                      <ProtectedAdminRoute>
                        <AdminUsers />
                      </ProtectedAdminRoute>
                    } />
                    <Route path="/admin/services" element={
                      <ProtectedAdminRoute>
                        <AdminServices />
                      </ProtectedAdminRoute>
                    } />
                    <Route path="/admin/service-names" element={
                      <ProtectedAdminRoute>
                        <AdminServiceNames />
                      </ProtectedAdminRoute>
                    } />
                    <Route path="/admin/blog" element={
                      <ProtectedAdminRoute>
                        <AdminBlog />
                      </ProtectedAdminRoute>
                    } />
                    <Route path="/admin/contact-messages" element={
                      <ProtectedAdminRoute>
                        <AdminContactMessages />
                      </ProtectedAdminRoute>
                    } />
                    <Route path="/admin/settings" element={
                      <ProtectedAdminRoute>
                        <AdminSettings />
                      </ProtectedAdminRoute>
                    } />
                    
                    {/* 404 route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </SettingsProvider>
            </AuthProvider>
          </LanguageProvider>
        </NotificationProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
