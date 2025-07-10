import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Users, ShoppingCart, DollarSign, TrendingUp, Package } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';

export default function Admin() {
  const [stats, setStats] = useState({
    total_users: 0,
    total_orders: 0,
    total_revenue: 0,
    active_services: 0,
    pending_orders: 0,
    completed_orders: 0
  });
  
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch user count
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch order count and revenue
      const { data: orders } = await supabase
        .from('orders')
        .select('price, status, created_at, service_name, user_id')
        .order('created_at', { ascending: false });

      // Fetch active services count
      const { count: servicesCount } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true })
        .eq('active', true);

      const totalRevenue = orders?.reduce((sum, order) => sum + (order.price || 0), 0) || 0;
      const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;
      const completedOrders = orders?.filter(order => order.status === 'completed').length || 0;

      setStats({
        total_users: userCount || 0,
        total_orders: orders?.length || 0,
        total_revenue: totalRevenue,
        active_services: servicesCount || 0,
        pending_orders: pendingOrders,
        completed_orders: completedOrders
      });

      // Set recent orders (last 5)
      setRecentOrders(orders?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center">Yüklənir...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">HitLoyal admin paneli</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ümumi İstifadəçilər</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_users}</div>
              <p className="text-xs text-muted-foreground">
                Qeydiyyatlı istifadəçilər
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ümumi Sifarişlər</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_orders}</div>
              <p className="text-xs text-muted-foreground">
                Bütün sifarişlər
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ümumi Gəlir</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_revenue.toFixed(2)} AZN</div>
              <p className="text-xs text-muted-foreground">
                Bütün sifarişlərdən gəlir
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktiv Xidmətlər</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active_services}</div>
              <p className="text-xs text-muted-foreground">
                Mövcud xidmətlər
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gözləyən Sifarişlər</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending_orders}</div>
              <p className="text-xs text-muted-foreground">
                Emal edilməkdə
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tamamlanan Sifarişlər</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed_orders}</div>
              <p className="text-xs text-muted-foreground">
                Uğurla tamamlanan
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Son Sifarişlər</CardTitle>
            <CardDescription>Ən son verilən sifarişlər</CardDescription>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{order.service_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('az-AZ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{order.price} AZN</p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        order.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {order.status === 'completed' ? 'Tamamlandı' : 
                         order.status === 'pending' ? 'Gözləyir' : 'Xəta'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">Hələ sifariş yoxdur</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
