
import React, { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, CheckCircle, XCircle, ExternalLink, AlertTriangle, StopCircle, RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

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

interface OrdersTableProps {
  orders: Order[];
  onOrdersUpdate: () => void;
}

const OrdersTable = ({ orders, onOrdersUpdate }: OrdersTableProps) => {
  const { t } = useLanguage();
  useEffect(() => {
    // Set up real-time subscription for order status updates
    const channel = supabase
      .channel('order-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Real-time order update received:', payload);
          onOrdersUpdate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onOrdersUpdate]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600"><Clock className="h-3 w-3 mr-1" />{t('orders.pending')}</Badge>;
      case 'processing':
      case 'in_progress':
      case 'active':
      case 'running':
        return <Badge variant="outline" className="text-blue-600"><Clock className="h-3 w-3 mr-1" />{t('orders.processing')}</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-green-600"><CheckCircle className="h-3 w-3 mr-1" />{t('orders.completed')}</Badge>;
      case 'error':
        return <Badge variant="outline" className="text-red-600"><XCircle className="h-3 w-3 mr-1" />{t('orders.error')}</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="text-purple-600"><RotateCcw className="h-3 w-3 mr-1" />{t('orders.refunded')}</Badge>;
      case 'stopped':
        return <Badge variant="outline" className="text-orange-600"><StopCircle className="h-3 w-3 mr-1" />{t('orders.stopped')}</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-red-600"><XCircle className="h-3 w-3 mr-1" />{t('orders.cancelled')}</Badge>;
      default:
        return <Badge variant="outline"><AlertTriangle className="h-3 w-3 mr-1" />{status}</Badge>;
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

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">{t('dashboard.noOrders')}</h3>
        <p className="text-muted-foreground">
          {t('dashboard.noOrdersDesc')}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Xidmət</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Miqdar</TableHead>
            <TableHead>Qiymət</TableHead>
            <TableHead>Vəziyyət</TableHead>
            <TableHead>Tarix</TableHead>
            <TableHead>External ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.service_name}</TableCell>
              <TableCell className="capitalize">{order.platform}</TableCell>
              <TableCell className="max-w-xs">
                <div className="flex items-center space-x-2">
                  <span className="truncate text-sm text-muted-foreground" title={order.link}>
                    {order.link}
                  </span>
                  <a 
                    href={order.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-shrink-0 hover:text-primary"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </TableCell>
              <TableCell>{order.quantity.toLocaleString()}</TableCell>
              <TableCell>${order.price.toFixed(2)}</TableCell>
              <TableCell>{getStatusBadge(order.status)}</TableCell>
              <TableCell>{formatDate(order.created_at)}</TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {order.external_order_id || '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrdersTable;
