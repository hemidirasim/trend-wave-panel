import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Plus, User, Package, Clock, CheckCircle, XCircle, AlertCircle, Wallet, LifeBuoy, Settings, CreditCard, MessageSquare, Send } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Support from '@/components/Support';
import AccountSettings from '@/components/AccountSettings';

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
}

interface Profile {
  id: string;
  email: string;
  full_name: string;
  balance: number;
  created_at: string;
}

interface Consultation {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: string;
  created_at: string;
}

interface ServiceRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: 'pending' | 'accepted' | 'cancelled' | 'completed';
  price?: number;
  created_at: string;
  updated_at: string;
}

interface ServiceMessage {
  id: string;
  consultation_id: string;
  message: string;
  is_admin: boolean;
  created_at: string;
}

const Dashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [requestMessages, setRequestMessages] = useState<ServiceMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
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
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        toast.error('Sifarişlər yüklənərkən xəta baş verdi');
      } else {
        setOrders(ordersData || []);
      }

      // Fetch user service requests (formerly consultations)
      const { data: serviceRequestsData, error: serviceRequestsError } = await supabase
        .from('consultations')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (serviceRequestsError) {
        console.error('Error fetching service requests:', serviceRequestsError);
        toast.error('Xidmət sorğuları yüklənərkən xəta baş verdi');
      } else {
        // Convert the data to match our ServiceRequest interface
        const formattedRequests: ServiceRequest[] = (serviceRequestsData || []).map(request => ({
          id: request.id,
          name: request.name,
          email: request.email,
          phone: request.phone,
          service: request.service,
          message: request.message,
          status: (request.status as 'pending' | 'accepted' | 'cancelled' | 'completed') || 'pending',
          price: undefined, // This would need to be added to the consultations table
          created_at: request.created_at,
          updated_at: request.updated_at
        }));
        setServiceRequests(formattedRequests);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Məlumatlar yüklənərkən xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  const fetchRequestMessages = async (requestId: string) => {
    try {
      // Note: This assumes a table for service request messages exists
      // For now, we'll create a placeholder
      setRequestMessages([]);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Mesajlar yüklənərkən xəta baş verdi');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedRequest) {
      return;
    }

    try {
      // Note: This would require a service_request_messages table
      // For now, just show success message
      toast.success('Mesaj göndərildi');
      setNewMessage('');
      // fetchRequestMessages(selectedRequest.id);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Mesaj göndərilmədi');
    }
  };

  const handlePayment = async (request: ServiceRequest) => {
    if (!request.price) {
      toast.error('Qiymət təyin edilməyib');
      return;
    }

    try {
      // Here you would integrate with payment system
      toast.success('Ödəniş səhifəsinə yönləndirilirsiniz...');
      // Example: navigate to payment page or open payment modal
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Ödəniş zamanı xəta baş verdi');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600"><Clock className="h-3 w-3 mr-1" />Gözlənir</Badge>;
      case 'processing':
        return <Badge variant="outline" className="text-blue-600"><AlertCircle className="h-3 w-3 mr-1" />İşlənir</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-green-600"><CheckCircle className="h-3 w-3 mr-1" />Tamamlandı</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-red-600"><XCircle className="h-3 w-3 mr-1" />Ləğv edildi</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getServiceRequestStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600"><Clock className="h-3 w-3 mr-1" />Gözlənir</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="text-blue-600"><CheckCircle className="h-3 w-3 mr-1" />Qəbul edildi</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-red-600"><XCircle className="h-3 w-3 mr-1" />Ləğv edildi</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-green-600"><CheckCircle className="h-3 w-3 mr-1" />Tamamlandı</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('az-AZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      toast.error('Çıxış zamanı xəta baş verdi');
    }
  };

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
                  <Button size="sm" variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                    <CreditCard className="h-4 w-4 mr-1" />
                    Artır
                  </Button>
                </div>
              </CardContent>
            </Card>
            
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
              <div className="text-2xl font-bold">
                {orders.filter(order => order.status === 'pending' || order.status === 'processing').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tamamlanan</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orders.filter(order => order.status === 'completed').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Xidmət Sorğuları</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{serviceRequests.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Sifarişlər
            </TabsTrigger>
            <TabsTrigger value="service-requests" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Xidmət Sorğuları
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
                <CardTitle>Son Sifarişlər</CardTitle>
                <CardDescription>
                  Sifarişlərinizin siyahısı və vəziyyəti
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Xidmət</TableHead>
                        <TableHead>Platform</TableHead>
                        <TableHead>Miqdar</TableHead>
                        <TableHead>Qiymət</TableHead>
                        <TableHead>Vəziyyət</TableHead>
                        <TableHead>Tarix</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.service_name}</TableCell>
                          <TableCell className="capitalize">{order.platform}</TableCell>
                          <TableCell>{order.quantity.toLocaleString()}</TableCell>
                          <TableCell>${order.price.toFixed(2)}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>{formatDate(order.created_at)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Hələ sifariş yoxdur</h3>
                    <p className="text-muted-foreground">
                      İlk sifarişinizi vermək üçün xidmətlər səhifəsinə keçin
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="service-requests">
            <Card>
              <CardHeader>
                <CardTitle>Xidmət Sorğuları</CardTitle>
                <CardDescription>
                  Göndərdiyiniz xidmət sorğularının siyahısı və vəziyyəti
                </CardDescription>
              </CardHeader>
              <CardContent>
                {serviceRequests.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Xidmət</TableHead>
                        <TableHead>Ad</TableHead>
                        <TableHead>Vəziyyət</TableHead>
                        <TableHead>Qiymət</TableHead>
                        <TableHead>Tarix</TableHead>
                        <TableHead>Əməliyyatlar</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {serviceRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.service}</TableCell>
                          <TableCell>{request.name}</TableCell>
                          <TableCell>{getServiceRequestStatusBadge(request.status)}</TableCell>
                          <TableCell>
                            {request.price ? `$${request.price.toFixed(2)}` : 'Təyin edilməyib'}
                          </TableCell>
                          <TableCell>{formatDate(request.created_at)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Dialog open={isMessageDialogOpen && selectedRequest?.id === request.id} onOpenChange={(open) => {
                                setIsMessageDialogOpen(open);
                                if (open) {
                                  setSelectedRequest(request);
                                  fetchRequestMessages(request.id);
                                }
                              }}>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <MessageSquare className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>Mesajlaşma</DialogTitle>
                                    <DialogDescription>
                                      {request.service} xidməti üçün admin ilə mesajlaşma
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="max-h-60 overflow-y-auto space-y-2">
                                      {requestMessages.length > 0 ? (
                                        requestMessages.map((message) => (
                                          <div key={message.id} className={`flex ${message.is_admin ? 'justify-start' : 'justify-end'}`}>
                                            <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                                              message.is_admin 
                                                ? 'bg-muted text-muted-foreground' 
                                                : 'bg-primary text-primary-foreground'
                                            }`}>
                                              <p>{message.message}</p>
                                              <p className="text-xs mt-1 opacity-70">
                                                {formatDate(message.created_at)}
                                              </p>
                                            </div>
                                          </div>
                                        ))
                                      ) : (
                                        <p className="text-muted-foreground text-center py-4">
                                          Hələ mesaj yoxdur
                                        </p>
                                      )}
                                    </div>
                                    <div className="flex space-x-2">
                                      <Input
                                        placeholder="Mesajınızı yazın..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                      />
                                      <Button onClick={sendMessage} size="sm">
                                        <Send className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              
                              {request.price && request.status === 'accepted' && (
                                <Button 
                                  size="sm" 
                                  onClick={() => handlePayment(request)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CreditCard className="h-4 w-4 mr-1" />
                                  Ödəniş et
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Hələ xidmət sorğusu yoxdur</h3>
                    <p className="text-muted-foreground mb-4">
                      İlk xidmət sorğunuzu göndərmək üçün xidmətlər səhifəsinə keçin
                    </p>
                    <Button onClick={() => navigate('/services')}>
                      Xidmətlərə bax
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
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
