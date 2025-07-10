
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Save, Database, Settings, Globe } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';
import { useSettings } from '@/contexts/SettingsContext';

interface Settings {
  site_name: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  maintenance_mode: boolean;
  allow_registration: boolean;
  default_balance: number;
  notification_email: string;
  commission_rate: number;
}

export default function AdminSettings() {
  const { toast } = useToast();
  const { updateSettings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [settings, setSettings] = useState<Settings>({
    site_name: 'HitLoyal',
    site_description: 'Sosial media büyütmə xidmətləri',
    contact_email: 'info@hitloyal.com',
    contact_phone: '+994 XX XXX XX XX',
    maintenance_mode: false,
    allow_registration: true,
    default_balance: 0,
    notification_email: 'admin@hitloyal.com',
    commission_rate: 0
  });

  const [stats, setStats] = useState({
    total_users: 0,
    total_orders: 0,
    total_revenue: 0,
    active_services: 0
  });

  useEffect(() => {
    fetchStats();
    loadSettings();
  }, []);

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('admin_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      // Fetch user count
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch order count and revenue
      const { data: orders } = await supabase
        .from('orders')
        .select('price');

      // Fetch active services count
      const { count: servicesCount } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true })
        .eq('active', true);

      const totalRevenue = orders?.reduce((sum, order) => sum + (order.price || 0), 0) || 0;

      setStats({
        total_users: userCount || 0,
        total_orders: orders?.length || 0,
        total_revenue: totalRevenue,
        active_services: servicesCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save settings to localStorage and context
      localStorage.setItem('admin_settings', JSON.stringify(settings));
      updateSettings({ commission_rate: settings.commission_rate });
      
      toast({
        title: "Uğurlu",
        description: "Parametrlər yadda saxlanıldı"
      });
    } catch (error) {
      toast({
        title: "Xəta",
        description: "Parametrlər yadda saxlanılmadı",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof Settings, value: string | boolean | number) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Parametrlər</h1>
            <p className="text-muted-foreground">Sistem parametrlərini idarə edin</p>
          </div>
          
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Yadda saxlanılır...' : 'Yadda Saxla'}
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ümumi İstifadəçilər</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_users}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ümumi Sifarişlər</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_orders}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ümumi Gəlir</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_revenue.toFixed(2)} AZN</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktiv Xidmətlər</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active_services}</div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Forms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Site Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Sayt Parametrləri</CardTitle>
              <CardDescription>Ümumi sayt parametrlərini dəyişin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="site_name">Sayt Adı</Label>
                <Input
                  id="site_name"
                  value={settings.site_name}
                  onChange={(e) => handleInputChange('site_name', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="site_description">Sayt Təsviri</Label>
                <Textarea
                  id="site_description"
                  value={settings.site_description}
                  onChange={(e) => handleInputChange('site_description', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="contact_email">Əlaqə Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="contact_phone">Əlaqə Telefonu</Label>
                <Input
                  id="contact_phone"
                  value={settings.contact_phone}
                  onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Sistem Parametrləri</CardTitle>
              <CardDescription>Sistem funksiyalarını konfiqurasiya edin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Texniki Xidmət Rejimi</Label>
                  <p className="text-sm text-muted-foreground">
                    Saytı müvəqqəti olaraq bağlamaq üçün
                  </p>
                </div>
                <Switch
                  checked={settings.maintenance_mode}
                  onCheckedChange={(checked) => handleInputChange('maintenance_mode', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Qeydiyyata İcazə</Label>
                  <p className="text-sm text-muted-foreground">
                    Yeni istifadəçilərin qeydiyyatına icazə ver
                  </p>
                </div>
                <Switch
                  checked={settings.allow_registration}
                  onCheckedChange={(checked) => handleInputChange('allow_registration', checked)}
                />
              </div>
              
              <div>
                <Label htmlFor="default_balance">Standart Balans</Label>
                <Input
                  id="default_balance"
                  type="number"
                  step="0.01"
                  value={settings.default_balance}
                  onChange={(e) => handleInputChange('default_balance', parseFloat(e.target.value) || 0)}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Yeni istifadəçilər üçün başlanğıc balans
                </p>
              </div>
              
              <div>
                <Label htmlFor="notification_email">Bildiriş Email</Label>
                <Input
                  id="notification_email"
                  type="email"
                  value={settings.notification_email}
                  onChange={(e) => handleInputChange('notification_email', e.target.value)}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Sistem bildirişləri üçün email ünvanı
                </p>
              </div>

              <div>
                <Label htmlFor="commission_rate">Komissiya Faizi (%)</Label>
                <Input
                  id="commission_rate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={settings.commission_rate}
                  onChange={(e) => handleInputChange('commission_rate', parseFloat(e.target.value) || 0)}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Xidmət qiymətlərinə əlavə olunacaq komissiya faizi
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
