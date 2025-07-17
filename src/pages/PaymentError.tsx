
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, AlertTriangle } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const PaymentError = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get('order');
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-red-600">
                Ödəniş Uğursuz Oldu
              </CardTitle>
              <CardDescription>
                Ödənişiniz zamanı problem yaşandı. Yenidən cəhd edin və ya bizimlə əlaqə saxlayın.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderId && (
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">Sifariş Nömrəsi</div>
                  <div className="font-mono text-lg">{orderId}</div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <div className="text-sm text-red-600 font-medium">Xəta məlumatı:</div>
                  </div>
                  <div className="text-sm text-red-700 mt-1">{error}</div>
                </div>
              )}

              <div className="space-y-2 pt-4">
                <Button onClick={() => navigate('/dashboard')} className="w-full">
                  Dashboard-a Qayıt
                </Button>
                <Button variant="outline" onClick={() => navigate('/contact')} className="w-full">
                  Dəstək ilə Əlaqə
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

export default PaymentError;
