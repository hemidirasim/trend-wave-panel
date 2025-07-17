
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { usePayment } from '@/hooks/usePayment';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { checkPaymentStatus } = usePayment();
  const [verifying, setVerifying] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [verificationAttempts, setVerificationAttempts] = useState(0);

  const orderId = searchParams.get('order');
  const transactionId = searchParams.get('transaction_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (transactionId && verificationAttempts < 3) {
        try {
          console.log(`🔍 Verifying payment attempt ${verificationAttempts + 1}`);
          const status = await checkPaymentStatus(transactionId);
          if (status && status.status === 'success') {
            setPaymentVerified(true);
            console.log('✅ Payment verified successfully');
          } else {
            console.log('⏳ Payment not yet verified, will retry...');
            setVerificationAttempts(prev => prev + 1);
            // Retry after 3 seconds
            setTimeout(() => {
              verifyPayment();
            }, 3000);
            return; // Don't set verifying to false yet
          }
        } catch (error) {
          console.error('❌ Payment verification failed:', error);
          setVerificationAttempts(prev => prev + 1);
          if (verificationAttempts < 2) {
            setTimeout(() => {
              verifyPayment();
            }, 3000);
            return;
          }
        }
      }
      setVerifying(false);
    };

    verifyPayment();
  }, [transactionId, checkPaymentStatus, verificationAttempts]);

  if (verifying) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md text-center">
              <CardContent className="pt-6">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                <h3 className="text-lg font-semibold mb-2">Ödəniş yoxlanılır...</h3>
                <p className="text-muted-foreground text-sm">
                  Zəhmət olmasa bir neçə saniyə gözləyin
                </p>
                {verificationAttempts > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Cəhd {verificationAttempts + 1}/3
                  </p>
                )}
              </CardContent>
            </Card>
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
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                paymentVerified ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                {paymentVerified ? (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                ) : (
                  <AlertCircle className="h-8 w-8 text-yellow-600" />
                )}
              </div>
              <CardTitle className="text-2xl">
                {paymentVerified ? 'Ödəniş Uğurla Tamamlandı!' : 'Ödəniş Qəbul Edildi'}
              </CardTitle>
              <CardDescription>
                {paymentVerified 
                  ? 'Sifarişiniz uğurla ödənildi və balansınız yeniləndi.'
                  : 'Ödənişiniz qəbul edildi və emal edilir. Balansınız tezliklə yenilənəcək.'
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

              {!paymentVerified && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Ödənişiniz uğurla qəbul edildi. Balansınız 1-2 dəqiqə ərzində yenilənəcək.
                  </p>
                </div>
              )}

              <div className="space-y-2 pt-4">
                <Button onClick={() => navigate('/dashboard')} className="w-full">
                  Dashboard-a Qayıt
                </Button>
                {orderId && !orderId.startsWith('balance-') && (
                  <Button variant="outline" onClick={() => navigate('/track')} className="w-full">
                    Sifarişi İzlə
                  </Button>
                )}
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
