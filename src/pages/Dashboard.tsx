
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Package, Clock, CheckCircle, XCircle, Wallet, LifeBuoy, Settings, ShoppingCart } from 'lucide-react';
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasShownLoginNotification = useRef(false);

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
      }

      // Fetch user orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        toast.error('Sifarişlər yüklənərkən xəta baş verdi');
      } else {
        setOrders(ordersData || []);
        console.log('Orders loaded:', ordersData?.length || 0);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Məlumatlar yüklənərkən xəta baş verdi');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user, fetchUserData]);

  // Check for payment success/error on component mount
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    
    if (paymentStatus === 'success') {
      toast.success('Ödəniş uğurla tamamlandı! Balansınız yenilənəcək.');
      setTimeout(() => {
        fetchUserData();
      }, 3000);
    } else if (paymentStatus === 'error') {
      toast.error('Ödəniş zamanı xəta baş verdi.');
    }
  }, [searchParams, fetchUserData]);

  // Prevent duplicate login notifications when returning to the site
  useEffect(() => {
    if (user && !hasShownLoginNotification.current && !searchParams.get('payment')) {
      const hasJustLoggedIn = sessionStorage.getItem('just_logged_in');
      if (hasJustLoggedIn) {
        toast.success('Uğurla daxil oldunuz!');
        sessionStorage.removeItem('just_logged_in');
        hasShownLoginNotification.current = true;
      }
    }
  }, [user, searchParams]);

  const handlePaymentSuccess = async (transactionId: string) => {
    toast.success('Ödəniş prosesi başladı. Balansınız tezliklə yenilənəcək.');
    setTimeout(() => {
      fetchUserData();
    }, 5000);
  };

  const handlePaymentError = (error: string) => {
    toast.error(`Ödəniş xətası: ${error}`);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      toast.error('Çıxış zamanı xəta baş verdi');
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
            <span className="ml-2">Yüklənir...</span>
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
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Xoş gəlmisiniz, {profile?.full_name || user?.email}
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
                    <p className="text-sm text-green-600 font-medium">Balans</p>
                    <p className="text-2xl font-bold text-green-700">
                      ${profile?.balance?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <BalanceTopUpDialog
                    customerEmail={user?.email}
                    customerName={profile?.full_name}
                    userId={user?.id}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Order Button */}
            <Button 
              onClick={() => navigate('/order')} 
              className="bg-primary hover:bg-primary/90"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Sifariş Et
            </Button>
            
            <Button variant="outline" onClick={handleSignOut}>
              Çıxış
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ümumi Sifarişlər</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktiv Sifarişlər</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeOrders.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tamamlanan</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedOrders.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Xətalı Sifarişlər</CardTitle>
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
              Bütün Sifarişlər
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Tamamlananlar
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Ödənişlər
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center gap-2">
              <LifeBuoy className="h-4 w-4" />
              Dəstək
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Hesab Ayarları
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Bütün Sifarişlər</CardTitle>
                <CardDescription>
                  Bütün sifarişlərinizin siyahısı və vəziyyəti (Real-time yenilənmə aktiv)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OrdersTable orders={orders} onOrdersUpdate={fetchUserData} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Tamamlanan Sifarişlər</CardTitle>
                <CardDescription>
                  Uğurla tamamlanan sifarişləriniz
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
    </div>
  );
};

export default Dashboard;
