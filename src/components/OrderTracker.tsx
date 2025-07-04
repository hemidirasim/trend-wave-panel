
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Package, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

const OrderTracker = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  const searchOrder = async () => {
    if (!orderId.trim()) {
      toast.error('Sifariş ID-sini daxil edin');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId.trim())
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          toast.error('Sifariş tapılmadı');
        } else {
          toast.error('Axtarış zamanı xəta baş verdi');
        }
        setOrder(null);
      } else {
        setOrder(data);
      }
    } catch (error) {
      toast.error('Axtarış zamanı xəta baş verdi');
      setOrder(null);
    } finally {
      setLoading(false);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('az-AZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Package className="h-5 w-5 mr-2" />
          Sifariş İzlə
        </CardTitle>
        <CardDescription>
          Sifariş ID-sini daxil edərək sifarişinizi izləyin
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Sifariş ID-sini daxil edin"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchOrder()}
          />
          <Button onClick={searchOrder} disabled={loading}>
            <Search className="h-4 w-4 mr-2" />
            Axtar
          </Button>
        </div>

        {order && (
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{order.service_name}</h3>
                <p className="text-sm text-muted-foreground">
                  {order.platform} • {order.service_type}
                </p>
              </div>
              {getStatusBadge(order.status)}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Miqdar:</span>
                <p className="font-medium">{order.quantity.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Qiymət:</span>
                <p className="font-medium">${order.price.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Tarix:</span>
                <p className="font-medium">{formatDate(order.created_at)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">ID:</span>
                <p className="font-medium text-xs">{order.id}</p>
              </div>
            </div>

            <div>
              <span className="text-muted-foreground text-sm">Link:</span>
              <p className="font-medium text-sm break-all">{order.link}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderTracker;
