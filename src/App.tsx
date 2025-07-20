
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import {
  Home,
  About,
  Order,
  Pricing,
  Contact,
  FAQ,
  TermsOfService,
  PrivacyPolicy,
  Dashboard,
  Profile,
  Orders,
  Support,
  AdminDashboard,
  AdminServices,
  AdminCreateService,
  AdminEditService,
  AdminOrders,
  AdminUsers,
  AdminProfile,
  AdminSupport,
  NotFound,
  PaymentSuccess,
  PaymentError,
  AdminSettings,
  Blog,
  BlogPost,
  AdminBlog,
  AdminCreateBlogPost,
  AdminEditBlogPost,
} from "@/pages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { queryClient } from "@/utils/queryClient";
import { PublicLayout } from "@/components/PublicLayout";
import { CurrencyProvider } from '@/contexts/CurrencyContext';

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <NotificationProvider>
            <AuthProvider>
              <LanguageProvider>
                <SettingsProvider>
                  <CurrencyProvider>
                    <div className="min-h-screen bg-background">
                      <Routes>
                        {/* Public Routes */}
                        <Route element={<PublicLayout />}>
                          <Route path="/" element={<Home />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/services" element={<Pricing />} />
                          <Route path="/order" element={<Order />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/faq" element={<FAQ />} />
                          <Route path="/terms" element={<TermsOfService />} />
                          <Route path="/privacy" element={<PrivacyPolicy />} />
                          <Route path="/blog" element={<Blog />} />
                          <Route path="/blog/:slug" element={<BlogPost />} />
                          <Route path="/support" element={<Support />} />
                        </Route>

                        {/* Payment Status Routes */}
                        <Route path="/payment-success" element={<PaymentSuccess />} />
                        <Route path="/payment-error" element={<PaymentError />} />

                        {/* User Dashboard Routes */}
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/support" element={<Support />} />

                        {/* Admin Routes */}
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/admin/services" element={<AdminServices />} />
                        <Route path="/admin/services/create" element={<AdminCreateService />} />
                        <Route path="/admin/services/edit/:id" element={<AdminEditService />} />
                        <Route path="/admin/orders" element={<AdminOrders />} />
                        <Route path="/admin/users" element={<AdminUsers />} />
                        <Route path="/admin/profile" element={<AdminProfile />} />
                        <Route path="/admin/support" element={<AdminSupport />} />
                        <Route path="/admin/settings" element={<AdminSettings />} />
                        <Route path="/admin/blog" element={<AdminBlog />} />
                        <Route path="/admin/blog/create" element={<AdminCreateBlogPost />} />
                        <Route path="/admin/blog/edit/:id" element={<AdminEditBlogPost />} />

                        {/* Not Found Route */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </div>
                  </CurrencyProvider>
                </SettingsProvider>
              </LanguageProvider>
            </AuthProvider>
          </NotificationProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
