
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2, Receipt, CheckCircle, XCircle, Clock } from 'lucide-react';

interface PaymentTransaction {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  transaction_id: string | null;
  created_at: string;
  completed_at: string | null;
}

export function PaymentHistory() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPaymentHistory();
    }
  }, [user]);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching payment history:', error);
        toast.error('Ödəniş tarixçəsi yüklənərkən xəta baş verdi');
      } else {
        setTransactions(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Ödəniş tarixçəsi yüklənərkən xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="outline" className="text-green-600 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Tamamlandı
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Gözlənir
          </Badge>
        );
      case 'failed':
      case 'cancelled':
        return (
          <Badge variant="outline" className="text-red-600 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            {status === 'failed' ? 'Uğursuz' : 'Ləğv edildi'}
          </Badge>
        );
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

  const getOrderType = (orderId: string) => {
    if (orderId.startsWith('balance-')) {
      return 'Balans Artırma';
    }
    return 'Sifariş Ödənişi';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Ödəniş tarixçəsi yüklənir...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Receipt className="h-5 w-5 mr-2" />
          Ödəniş Tarixçəsi
        </CardTitle>
        <CardDescription>
          Son ödənişlərinizin siyahısı və statusu
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarix</TableHead>
                <TableHead>Növ</TableHead>
                <TableHead>Məbləğ</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ödəniş Sistemi</TableHead>
                <TableHead>Tranzaksiya ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {formatDate(transaction.created_at)}
                  </TableCell>
                  <TableCell>
                    {getOrderType(transaction.order_id)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.amount.toFixed(2)} {transaction.currency}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(transaction.status)}
                  </TableCell>
                  <TableCell className="capitalize">
                    {transaction.provider}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {transaction.transaction_id || '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Hələ ödəniş yoxdur</h3>
            <p className="text-muted-foreground">
              İlk ödənişinizi etdikdən sonra burada görünəcək
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
