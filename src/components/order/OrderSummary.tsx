
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, CheckCircle } from 'lucide-react';
import { Service } from '@/types/api';
import { proxyApiService } from '@/components/ProxyApiService';

interface OrderSummaryProps {
  selectedService: Service | null;
  quantity: string;
  calculatedPrice: number;
  serviceFee: number;
}

export function OrderSummary({ selectedService, quantity, calculatedPrice, serviceFee }: OrderSummaryProps) {
  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      youtube: 'bg-red-500',
      instagram: 'bg-pink-500',
      tiktok: 'bg-purple-500',
      facebook: 'bg-blue-500',
      twitter: 'bg-sky-500',
      telegram: 'bg-blue-400',
    };
    return colors[platform.toLowerCase()] || 'bg-gray-500';
  };

  const getServicePriceWithFee = (service: Service) => {
    const basePricePer = parseInt(service.prices[0]?.pricing_per || '1000');
    const priceWithFee = proxyApiService.calculatePrice(service, basePricePer, serviceFee);
    const pricePerUnit = priceWithFee / basePricePer;
    
    console.log('🔥 Xidmətin vahid qiyməti (xidmət haqqı ilə):', {
      serviceName: service.public_name,
      basePricePer,
      appliedServiceFee: serviceFee,
      priceWithFee,
      pricePerUnit
    });
    
    return pricePerUnit;
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="h-5 w-5 mr-2" />
          Sifariş Xülasəsi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedService ? (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Xidmət:</span>
                <Badge className={`${getPlatformColor(selectedService.platform)} text-white`}>
                  {selectedService.platform}
                </Badge>
              </div>
              <h3 className="font-medium text-sm">{selectedService.public_name}</h3>
              <p className="text-xs text-muted-foreground">{selectedService.type_name || 'Xidmət'}</p>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Miqdar:</span>
                <span>{quantity || '0'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>{selectedService.prices[0]?.pricing_per || '1000'} üçün qiymət:</span>
                <span>${proxyApiService.formatPrice(getServicePriceWithFee(selectedService).toString())}</span>
              </div>
              {serviceFee > 0 && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Xidmət haqqı (+${serviceFee}):</span>
                  <span>Daxildir</span>
                </div>
              )}
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Cəmi:</span>
                <span>${proxyApiService.formatPrice(calculatedPrice.toFixed(2))}</span>
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Təhlükəsiz</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-blue-600">
                <CheckCircle className="h-4 w-4" />
                <span>Sürətli Çatdırılma</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-purple-600">
                <CheckCircle className="h-4 w-4" />
                <span>24/7 Dəstək</span>
              </div>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground text-center py-8 text-sm">
            Sifariş xülasəsini görmək üçün xidmət seçin
          </p>
        )}
      </CardContent>
    </Card>
  );
}
