import { QueryClient } from 'react-query';
import { QueryClientProvider } from 'react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/components/NotificationProvider';
import Home from './pages/Home';
import Order from './pages/Order';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentError from './pages/PaymentError';
import ResetPassword from './pages/ResetPassword';
import UpdatePassword from './pages/UpdatePassword';
import GuestPayment from './pages/GuestPayment';

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <NotificationProvider>
        <AuthProvider>
          <LanguageProvider>
            <SettingsProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/:lang" element={<Home />} />
                  <Route path="/:lang/order" element={<Order />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/:lang/dashboard" element={<Dashboard />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="/payment-error" element={<PaymentError />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/update-password" element={<UpdatePassword />} />
                  <Route path="/en/guest-payment" element={<GuestPayment />} />
                  <Route path="/az/guest-payment" element={<GuestPayment />} />
                </Routes>
              </BrowserRouter>
            </SettingsProvider>
          </LanguageProvider>
        </AuthProvider>
      </NotificationProvider>
    </QueryClientProvider>
  );
}

export default App;
