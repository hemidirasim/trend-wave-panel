
import React from 'react';
import { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/components/NotificationProvider';
import Index from '@/pages/Index';
import Order from '@/pages/Order';
import Dashboard from '@/pages/Dashboard';
import Auth from '@/pages/Auth';
import PaymentSuccess from '@/pages/PaymentSuccess';
import PaymentError from '@/pages/PaymentError';
import ResetPassword from '@/pages/ResetPassword';
import PasswordRecovery from '@/pages/PasswordRecovery';
import GuestPayment from '@/pages/GuestPayment';
import Admin from '@/pages/Admin';
import AdminSettings from '@/pages/AdminSettings';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <NotificationProvider>
          <AuthProvider>
            <BrowserRouter>
              <LanguageProvider>
                <SettingsProvider>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/:lang" element={<Index />} />
                    <Route path="/:lang/order" element={<Order />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/:lang/dashboard" element={<Dashboard />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/payment-success" element={<PaymentSuccess />} />
                    <Route path="/payment-error" element={<PaymentError />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/update-password" element={<PasswordRecovery />} />
                    <Route path="/en/guest-payment" element={<GuestPayment />} />
                    <Route path="/az/guest-payment" element={<GuestPayment />} />
                    <Route 
                      path="/admin" 
                      element={
                        <ProtectedAdminRoute>
                          <Admin />
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
                  </Routes>
                </SettingsProvider>
              </LanguageProvider>
            </BrowserRouter>
          </AuthProvider>
        </NotificationProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
