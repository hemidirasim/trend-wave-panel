
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { usePayment } from '@/hooks/usePayment';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { checkPaymentStatus } = usePayment();
  const [verifying, setVerifying] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);

  const orderId = searchParams.get('order');
  const transactionId = searchParams.get('transaction_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (transactionId) {
        try {
          const status = await checkPaymentStatus(transactionId);
          if (status && status.status === 'success') {
            setPaymentVerified(true);
          }
        } catch (error) {
          console.error('Payment verification failed:', error);
        }
      }
      setVerifying(false);
    };

    verifyPayment();
  }, [transactionId, checkPaymentStatus]);

  if (verifying) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <span className="text-lg">Ödəniş yoxlanılır...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">
                {paymentVerified ? 'Ödəniş Uğurla Tamamlandı!' : 'Ödəniş Alındı'}
              </CardTitle>
              <CardDescription>
                {paymentVerified 
                  ? 'Sifarişiniz uğurla ödənildi və emal edilir.'
                  : 'Ödənişiniz qəbul edildi və yoxlanılır.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderId && (
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">Sifariş Nömrəsi</div>
                  <div className="font-mono text-lg">{orderId}</div>
                </div>
              )}

              {transactionId && (
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">Əməliyyat ID</div>
                  <div className="font-mono">{transactionId}</div>
                </div>
              )}

              <div className="space-y-2 pt-4">
                <Button onClick={() => navigate('/track')} className="w-full">
                  Sifarişi İzlə
                </Button>
                <Button variant="outline" onClick={() => navigate('/dashboard')} className="w-full">
                  Dashboard-a Qayıt
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;
