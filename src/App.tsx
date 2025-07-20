
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { NotificationProvider } from "@/components/NotificationProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";

// Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Order from "./pages/Order";
import Track from "./pages/Track";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import PasswordRecovery from "./pages/PasswordRecovery";
import ResetPassword from "./pages/ResetPassword";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentError from "./pages/PaymentError";

// Admin Pages
import Admin from "./pages/Admin";
import AdminServices from "./pages/AdminServices";
import AdminBlog from "./pages/AdminBlog";
import AdminUsers from "./pages/AdminUsers";
import AdminSettings from "./pages/AdminSettings";
import AdminContactMessages from "./pages/AdminContactMessages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <SettingsProvider>
              <NotificationProvider>
                <Routes>
                  {/* Language-aware routes */}
                  <Route path="/:lang" element={<LanguageRedirect />}>
                    <Route index element={<Index />} />
                    <Route path="about" element={<About />} />
                    <Route path="services" element={<Services />} />
                    <Route path="services/:slug" element={<ServiceDetail />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="blog" element={<Blog />} />
                    <Route path="blog/:slug" element={<BlogPost />} />
                    <Route path="auth" element={<Auth />} />
                    <Route path="terms" element={<Terms />} />
                    <Route path="privacy" element={<Privacy />} />
                    <Route path="password-recovery" element={<PasswordRecovery />} />
                    <Route path="reset-password" element={<ResetPassword />} />
                  </Route>

                  {/* Default routes (redirect to language-specific) */}
                  <Route path="/" element={<Navigate to="/az" replace />} />
                  <Route path="/about" element={<Navigate to="/az/about" replace />} />
                  <Route path="/services" element={<Navigate to="/az/services" replace />} />
                  <Route path="/contact" element={<Navigate to="/az/contact" replace />} />
                  <Route path="/blog" element={<Navigate to="/az/blog" replace />} />
                  <Route path="/auth" element={<Navigate to="/az/auth" replace />} />
                  <Route path="/terms" element={<Navigate to="/az/terms" replace />} />
                  <Route path="/privacy" element={<Navigate to="/az/privacy" replace />} />

                  {/* Protected routes (no language prefix needed) */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/order" element={
                    <ProtectedRoute>
                      <Order />
                    </ProtectedRoute>
                  } />
                  <Route path="/track" element={
                    <ProtectedRoute>
                      <Track />
                    </ProtectedRoute>
                  } />
                  <Route path="/payment/success" element={
                    <ProtectedRoute>
                      <PaymentSuccess />
                    </ProtectedRoute>
                  } />
                  <Route path="/payment/error" element={
                    <ProtectedRoute>
                      <PaymentError />
                    </ProtectedRoute>
                  } />

                  {/* Admin routes */}
                  <Route path="/admin" element={
                    <ProtectedAdminRoute>
                      <Admin />
                    </ProtectedAdminRoute>
                  } />
                  <Route path="/admin/services" element={
                    <ProtectedAdminRoute>
                      <AdminServices />
                    </ProtectedAdminRoute>
                  } />
                  <Route path="/admin/blog" element={
                    <ProtectedAdminRoute>
                      <AdminBlog />
                    </ProtectedAdminRoute>
                  } />
                  <Route path="/admin/users" element={
                    <ProtectedAdminRoute>
                      <AdminUsers />
                    </ProtectedAdminRoute>
                  } />
                  <Route path="/admin/settings" element={
                    <ProtectedAdminRoute>
                      <AdminSettings />
                    </ProtectedAdminRoute>
                  } />
                  <Route path="/admin/contact-messages" element={
                    <ProtectedAdminRoute>
                      <AdminContactMessages />
                    </ProtectedAdminRoute>
                  } />

                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </NotificationProvider>
            </SettingsProvider>
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Component to handle language parameter
const LanguageRedirect = ({ children }: { children?: React.ReactNode }) => {
  // This component can be expanded to handle language logic
  return <>{children}</>;
};

export default App;
