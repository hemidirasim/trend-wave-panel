
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { NotificationProvider } from '@/components/NotificationProvider';

import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import ResetPassword from '@/pages/ResetPassword';
import PasswordRecovery from '@/pages/PasswordRecovery';
import Dashboard from '@/pages/Dashboard';
import Services from '@/pages/Services';
import ServiceDetail from '@/pages/ServiceDetail';
import Order from '@/pages/Order';
import Track from '@/pages/Track';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import NotFound from '@/pages/NotFound';

// Admin pages
import Admin from '@/pages/Admin';
import AdminUsers from '@/pages/AdminUsers';
import AdminServices from '@/pages/AdminServices';
import AdminSettings from '@/pages/AdminSettings';
import AdminBlog from '@/pages/AdminBlog';

import ProtectedRoute from '@/components/ProtectedRoute';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <AuthProvider>
          <LanguageProvider>
            <SettingsProvider>
              <Router>
                <div className="min-h-screen bg-background text-foreground">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/password-recovery" element={<PasswordRecovery />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/service/:id" element={<ServiceDetail />} />
                    <Route path="/order" element={<Order />} />
                    <Route path="/track" element={<Track />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Admin Routes */}
                    <Route 
                      path="/admin" 
                      element={
                        <ProtectedAdminRoute>
                          <Admin />
                        </ProtectedAdminRoute>
                      } 
                    />
                    <Route 
                      path="/admin/users" 
                      element={
                        <ProtectedAdminRoute>
                          <AdminUsers />
                        </ProtectedAdminRoute>
                      } 
                    />
                    <Route 
                      path="/admin/services" 
                      element={
                        <ProtectedAdminRoute>
                          <AdminServices />
                        </ProtectedAdminRoute>
                      } 
                    />
                    <Route 
                      path="/admin/settings" 
                      element={
                        <ProtectedAdminRoute>
                          <AdminSettings />
                        </ProtectedAdminRoute>
                      } 
                    />
                    <Route 
                      path="/admin/blog" 
                      element={
                        <ProtectedAdminRoute>
                          <AdminBlog />
                        </ProtectedAdminRoute>
                      } 
                    />
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  
                  <Toaster />
                </div>
              </Router>
            </SettingsProvider>
          </LanguageProvider>
        </AuthProvider>
      </NotificationProvider>
    </QueryClientProvider>
  );
}

export default App;
