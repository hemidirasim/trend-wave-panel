import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { apiService, OrderStatus } from '@/components/ApiService';
import { Loader2, Search, Package, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const Track = () => {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('order') || '');
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) {
      toast.error('Please enter an order ID');
      return;
    }

    try {
      setLoading(true);
      const status = await apiService.getOrderStatus(orderId);
      setOrderStatus(status);
    } catch (error) {
      toast.error('Order not found or invalid order ID');
      setOrderStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (statusId: string) => {
    switch (statusId) {
      case '1': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case '2':
      case '3': return <Clock className="h-5 w-5 text-blue-500" />;
      default: return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (statusId: string) => {
    switch (statusId) {
      case '1': return 'bg-green-500';
      case '2':
      case '3': return 'bg-blue-500';
      default: return 'bg-red-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Track Your Order</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Enter your order ID to check the status and progress
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Order Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTrack} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orderId">Order ID</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="orderId"
                      placeholder="Enter your order ID"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </form>

              {orderStatus && (
                <div className="mt-8 space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Order #{orderStatus.id_service_submission}</h3>
                      <Badge className={`${getStatusColor(orderStatus.status.id_status)} text-white`}>
                        {orderStatus.status.name}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">URL:</span>
                        <p className="font-medium break-all">{orderStatus.long_url}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Quantity Ordered:</span>
                        <p className="font-medium">{parseInt(orderStatus.wanted_count).toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Starting Count:</span>
                        <p className="font-medium">{parseInt(orderStatus.start_count).toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Current Count:</span>
                        <p className="font-medium">{parseInt(orderStatus.current_count).toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Cost:</span>
                        <p className="font-medium">${parseFloat(orderStatus.total_cost).toFixed(2)}</p>
                      </div>
                      {orderStatus.sent_count && (
                        <div>
                          <span className="text-muted-foreground">Delivered:</span>
                          <p className="font-medium">{parseInt(orderStatus.sent_count).toLocaleString()}</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(orderStatus.status.id_status)}
                        <span className="font-medium">{orderStatus.status.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {orderStatus.status.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Track;