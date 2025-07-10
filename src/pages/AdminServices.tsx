import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit, Plus, RefreshCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AdminLayout } from '@/components/AdminLayout';

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  category: 'standard' | 'social_media';
  platform: string | null;
  icon: string | null;
  active: boolean;
  order_index: number;
}

interface ApiService {
  id_service: number;
  public_name: string;
  amount_minimum: number;
  amount_increment: number;
  platform: string;
  example: string;
  prices: Array<{
    price: string;
    minimum: number;
    maximum: number;
    pricing_per: number;
  }>;
}

export default function AdminServices() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [apiServices, setApiServices] = useState<ApiService[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'standard' as 'standard' | 'social_media',
    platform: '',
    icon: '',
    active: true,
    order_index: 0
  });

  useEffect(() => {
    if (user) {
      fetchServices();
    }
  }, [user]);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('category', { ascending: true })
        .order('order_index', { ascending: true });

      if (error) throw error;
      setServices((data || []) as Service[]);
    } catch (error) {
      toast({
        title: "Xəta",
        description: "Xidmətlər yüklənmədi",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchApiServices = async () => {
    setApiLoading(true);
    try {
      const response = await fetch('/functions/v1/qqtube-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'services'
        })
      });

      if (!response.ok) throw new Error('API xətası');
      
      const data = await response.json();
      setApiServices(data || []);
      
      toast({
        title: "Uğurlu",
        description: "API xidmətləri yeniləndi"
      });
    } catch (error) {
      toast({
        title: "Xəta",
        description: "API xidmətləri yüklənmədi",
        variant: "destructive"
      });
    } finally {
      setApiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const serviceData = {
        name: formData.name,
        description: formData.description || null,
        price: formData.price ? parseFloat(formData.price) : null,
        category: formData.category,
        platform: formData.platform || null,
        icon: formData.icon || null,
        active: formData.active,
        order_index: formData.order_index
      };

      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id);
        
        if (error) throw error;
        
        toast({
          title: "Uğurlu",
          description: "Xidmət yeniləndi"
        });
      } else {
        const { error } = await supabase
          .from('services')
          .insert([serviceData]);
        
        if (error) throw error;
        
        toast({
          title: "Uğurlu",
          description: "Xidmət əlavə edildi"
        });
      }

      resetForm();
      setDialogOpen(false);
      fetchServices();
    } catch (error) {
      toast({
        title: "Xəta",
        description: "Əməliyyat uğursuz oldu",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu xidməti silmək istədiyinizə əminsiniz?')) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Uğurlu",
        description: "Xidmət silindi"
      });
      
      fetchServices();
    } catch (error) {
      toast({
        title: "Xəta",
        description: "Xidmət silinmədi",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      price: service.price?.toString() || '',
      category: service.category,
      platform: service.platform || '',
      icon: service.icon || '',
      active: service.active,
      order_index: service.order_index
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'standard',
      platform: '',
      icon: '',
      active: true,
      order_index: 0
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Xidmətlər</h1>
            <p className="text-muted-foreground">Bütün xidmətləri idarə edin</p>
          </div>
        </div>

        <Tabs defaultValue="local" className="w-full">
          <TabsList>
            <TabsTrigger value="local">Yerli Xidmətlər</TabsTrigger>
            <TabsTrigger value="api">API Xidmətləri</TabsTrigger>
          </TabsList>
          
          <TabsContent value="local" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Yerli Xidmətlər</h2>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Xidmət
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingService ? 'Xidməti Redaktə Et' : 'Yeni Xidmət Əlavə Et'}
                    </DialogTitle>
                    <DialogDescription>
                      Xidmət məlumatlarını daxil edin
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Ad</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Təsvir</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Kateqoriya</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value: 'standard' | 'social_media') => 
                          setFormData({ ...formData, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standart Xidmətlər</SelectItem>
                          <SelectItem value="social_media">Sosial Media</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="price">Qiymət</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="platform">Platform</Label>
                      <Input
                        id="platform"
                        value={formData.platform}
                        onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="icon">İkon</Label>
                      <Input
                        id="icon"
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        placeholder="Users, Heart, Search..."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="order_index">Sıralama</Label>
                      <Input
                        id="order_index"
                        type="number"
                        value={formData.order_index}
                        onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="active"
                        checked={formData.active}
                        onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                      />
                      <Label htmlFor="active">Aktiv</Label>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                        Ləğv Et
                      </Button>
                      <Button type="submit">
                        {editingService ? 'Yenilə' : 'Əlavə Et'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <div className="text-center">Yüklənir...</div>
            ) : (
              <div className="space-y-8">
                {/* Standard Services */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Standart Xidmətlər</h3>
                  <div className="grid gap-4">
                    {services
                      .filter(service => service.category === 'standard')
                      .map((service) => (
                        <Card key={service.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-semibold">{service.name}</h4>
                                <p className="text-sm text-muted-foreground">{service.description}</p>
                                <div className="flex gap-2 mt-2">
                                  <span className="text-xs bg-muted px-2 py-1 rounded">
                                    {service.platform || 'Ümumi'}
                                  </span>
                                  <span className="text-xs bg-muted px-2 py-1 rounded">
                                    Sıra: {service.order_index}
                                  </span>
                                  {service.price && (
                                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                      {service.price} AZN
                                    </span>
                                  )}
                                  <span className={`text-xs px-2 py-1 rounded ${
                                    service.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {service.active ? 'Aktiv' : 'Deaktiv'}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(service)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDelete(service.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>

                {/* Social Media Services */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Sosial Media Xidmətləri</h3>
                  <div className="grid gap-4">
                    {services
                      .filter(service => service.category === 'social_media')
                      .map((service) => (
                        <Card key={service.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-semibold">{service.name}</h4>
                                <p className="text-sm text-muted-foreground">{service.description}</p>
                                <div className="flex gap-2 mt-2">
                                  <span className="text-xs bg-muted px-2 py-1 rounded">
                                    {service.platform || 'Ümumi'}
                                  </span>
                                  <span className="text-xs bg-muted px-2 py-1 rounded">
                                    Sıra: {service.order_index}
                                  </span>
                                  {service.price && (
                                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                      {service.price} AZN
                                    </span>
                                  )}
                                  <span className={`text-xs px-2 py-1 rounded ${
                                    service.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {service.active ? 'Aktiv' : 'Deaktiv'}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(service)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDelete(service.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="api" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">API Xidmətləri</h2>
              <Button onClick={fetchApiServices} disabled={apiLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${apiLoading ? 'animate-spin' : ''}`} />
                Yenilə
              </Button>
            </div>
            
            {apiLoading ? (
              <div className="text-center">API xidmətləri yüklənir...</div>
            ) : (
              <div className="grid gap-4">
                {apiServices.map((service) => (
                  <Card key={service.id_service}>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold">{service.public_name}</h4>
                        <div className="flex gap-2 flex-wrap">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Platform: {service.platform}
                          </span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Min: {service.amount_minimum}
                          </span>
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            Artım: {service.amount_increment}
                          </span>
                          {service.prices?.[0] && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              Qiymət: ${service.prices[0].price}/1000
                            </span>
                          )}
                        </div>
                        {service.example && (
                          <p className="text-xs text-muted-foreground">
                            Nümunə: {service.example}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}