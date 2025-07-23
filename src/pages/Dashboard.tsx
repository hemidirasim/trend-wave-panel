
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Package, Clock, CheckCircle, XCircle, Wallet, LifeBuoy, Settings, ShoppingCart, DollarSign } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Support from '@/components/Support';
import AccountSettings from '@/components/AccountSettings';
import { BalanceTopUpDialog } from '@/components/payment/BalanceTopUpDialog';
import { PaymentHistory } from '@/components/payment/PaymentHistory';
import OrdersTable from '@/components/dashboard/OrdersTable';

interface Order {
  id: string;
  service_name: string;
  platform: string;
  service_type: string;
  quantity: number;
  price: number;
  link: string;
  status: string;
  created_at: string;
  comment?: string;
  external_order_id?: string;
}

interface Profile {
  id: string;
  email: string;
  full_name: string;
  balance: number;
  created_at: string;
}

const Dashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { t, language } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasShownLoginNotification = useRef(false);
  const [balanceTopUpOpen, setBalanceTopUpOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const fetchUserData = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
      } else {
        setProfile(profileData);
        console.log('Profile loaded with balance:', profileData?.balance);
      }

      // Fetch user orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        toast.error(t('dashboard.ordersLoadError'));
      } else {
        setOrders(ordersData || []);
        console.log('Orders loaded:', ordersData?.length || 0);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(t('dashboard.dataLoadError'));
    } finally {
      setLoading(false);
    }
  }, [user?.id, t]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user, fetchUserData]);

  // Real-time balance updates
  useEffect(() => {
    if (!user?.id) return;

    console.log('Setting up real-time balance updates for user:', user.id);

    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Real-time profile update received:', payload);
          
          if (payload.eventType === 'UPDATE' && payload.new) {
            const updatedProfile = payload.new as Profile;
            setProfile(updatedProfile);
            console.log('Balance updated in real-time:', updatedProfile.balance);
            
            // Show notification for balance updates
            if (payload.old && payload.new.balance !== payload.old.balance) {
              const oldBalance = parseFloat(payload.old.balance || '0');
              const newBalance = parseFloat(payload.new.balance || '0');
              const difference = newBalance - oldBalance;
              
              if (difference > 0) {
                toast.success(t('dashboard.balanceUpdated', { amount: difference.toFixed(2) }));
              }
            }
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [user?.id, t]);

  // Check for payment success/error on component mount
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    
    if (paymentStatus === 'success') {
      toast.success(t('dashboard.paymentSuccess'));
      // Force refresh profile after 3 seconds
      setTimeout(() => {
        fetchUserData();
      }, 3000);
    } else if (paymentStatus === 'error') {
      toast.error(t('dashboard.paymentError'));
    }
  }, [searchParams, fetchUserData, t]);

  // Prevent duplicate login notifications when returning to the site
  useEffect(() => {
    if (user && !hasShownLoginNotification.current && !searchParams.get('payment')) {
      const hasJustLoggedIn = sessionStorage.getItem('just_logged_in');
      if (hasJustLoggedIn) {
        toast.success(t('dashboard.loginSuccess'));
        sessionStorage.removeItem('just_logged_in');
        hasShownLoginNotification.current = true;
      }
    }
  }, [user, searchParams, t]);

  const handlePaymentSuccess = async () => {
    toast.success(t('dashboard.paymentProcessing'));
    // Force refresh after 2 seconds
    setTimeout(() => {
      fetchUserData();
    }, 2000);
  };

  const handlePaymentError = (error: string) => {
    toast.error(`${t('dashboard.paymentError')}: ${error}`);
  };

  const handleSignOut = async () => {
    if (isSigningOut) return; // Prevent multiple clicks
    
    try {
      setIsSigningOut(true);
      console.log('Dashboard sign out button clicked');
      await signOut();
      
      // Clear any URL parameters that might trigger auth dialog
      window.history.replaceState({}, '', window.location.pathname);
      
      // Navigate to home page with explicit replace to avoid auth dialog
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error signing out from dashboard:', error);
      toast.error(t('dashboard.signOutError'));
    } finally {
      setIsSigningOut(false);
    }
  };

  // Filter orders by status
  const completedOrders = orders.filter(order => order.status === 'completed');
  const activeOrders = orders.filter(order => 
    ['pending', 'processing', 'in_progress', 'active', 'running'].includes(order.status)
  );
  const errorOrders = orders.filter(order => 
    ['error', 'stopped', 'refunded', 'cancelled'].includes(order.status)
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">{t('dashboard.loading')}</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header with Balance prominently displayed */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
            <p className="text-muted-foreground">
              {t('dashboard.welcome')}, {profile?.full_name || user?.email}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Prominent Balance Display */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Wallet className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-green-600 font-medium">{t('dashboard.balance')}</p>
                    <p className="text-2xl font-bold text-green-700">
                      ${profile?.balance?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <Button
                    onClick={() => setBalanceTopUpOpen(true)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <DollarSign className="h-4 w-4 mr-1" />
                    {t('dashboard.topUp')}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              {isSigningOut ? t('dashboard.signingOut') : t('nav.signOut')}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.totalOrders')}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.activeOrders')}</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeOrders.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.completedOrders')}</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedOrders.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.errorOrders')}</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{errorOrders.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              {t('dashboard.allOrders')}
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              {t('dashboard.completed')}
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              {t('dashboard.paymentHistory')}
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center gap-2">
              <LifeBuoy className="h-4 w-4" />
              {t('dashboard.support')}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              {t('dashboard.settings')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{t('dashboard.allOrders')}</CardTitle>
                    <CardDescription>
                      {t('dashboard.allOrdersDesc')}
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={() => navigate(`/${language}/order`)} 
                    className="bg-primary hover:bg-primary/90"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {t('dashboard.placeOrder')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <OrdersTable orders={orders} onOrdersUpdate={fetchUserData} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.completedOrders')}</CardTitle>
                <CardDescription>
                  {t('dashboard.completedDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OrdersTable orders={completedOrders} onOrdersUpdate={fetchUserData} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <PaymentHistory />
          </TabsContent>

          <TabsContent value="support">
            <Support />
          </TabsContent>

          <TabsContent value="settings">
            <AccountSettings profile={profile} onProfileUpdate={fetchUserData} />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />

      <BalanceTopUpDialog
        open={balanceTopUpOpen}
        onOpenChange={setBalanceTopUpOpen}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Dashboard;
