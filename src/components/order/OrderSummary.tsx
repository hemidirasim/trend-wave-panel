import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calculator, DollarSign, Wallet, AlertTriangle } from 'lucide-react';
import { Service } from '@/types/api';
interface OrderSummaryProps {
  selectedService: Service | null;
  quantity: string;
  calculatedPrice: number;
  serviceFeePercentage: number;
  baseFee: number;
  userBalance?: number;
  balanceLoading?: boolean;
  onBalanceTopUp?: () => void;
  showBalanceTopUp?: boolean;
  BalanceTopUpComponent?: React.ReactNode;
}
export function OrderSummary({
  selectedService,
  quantity,
  calculatedPrice,
  serviceFeePercentage,
  baseFee,
  userBalance = 0,
  balanceLoading = false,
  onBalanceTopUp,
  showBalanceTopUp = false,
  BalanceTopUpComponent
}: OrderSummaryProps) {
  const quantityNum = parseInt(quantity) || 0;
  const basePrice = selectedService && quantityNum > 0 ? parseFloat(selectedService.prices?.[0]?.price || '0') * quantityNum / 1000 : 0;
  const serviceFee = basePrice * (serviceFeePercentage / 100);
  const totalPrice = calculatedPrice;
  const hasInsufficientBalance = userBalance < totalPrice && totalPrice > 0;
  return <div className="space-y-6">
      {/* Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Wallet className="h-5 w-5 mr-2" />
            Balans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Mövcud balans:</span>
              <div className="flex items-center space-x-2">
                {balanceLoading ? <div className="h-4 w-16 bg-muted animate-pulse rounded" /> : <Badge variant={userBalance > 0 ? "default" : "secondary"} className="text-lg font-semibold">
                    ${userBalance.toFixed(2)}
                  </Badge>}
              </div>
            </div>
            
            {userBalance === 0 && <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-orange-700">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">Balansınız 0-dır</span>
                </div>
                <p className="text-xs text-orange-600 mt-1">
                  Sifariş vermək üçün balansınızı artırın
                </p>
                <div className="mt-2">
                  {BalanceTopUpComponent}
                </div>
              </div>}

            {hasInsufficientBalance && userBalance > 0 && <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-red-700">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">Kifayət qədər balans yoxdur</span>
                </div>
                <p className="text-xs text-red-600 mt-1">
                  ${(totalPrice - userBalance).toFixed(2)} çatışmır
                </p>
                <div className="mt-2">
                  {BalanceTopUpComponent}
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>

      {/* Order Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Calculator className="h-5 w-5 mr-2" />
            Sifariş Xülasəsi
          </CardTitle>
          <CardDescription>Qiymət hesablaması</CardDescription>
        </CardHeader>
        <CardContent>
          {selectedService && quantityNum > 0 ? <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Xidmət:</span>
                  <span className="font-medium">{selectedService.public_name}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Miqdar:</span>
                  <span className="font-medium">{quantityNum.toLocaleString()}</span>
                </div>
                
                
                
                
                
                
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span className="font-semibold">Cəmi:</span>
                <Badge variant="default" className="text-lg font-bold px-3 py-1">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {totalPrice.toFixed(2)}
                </Badge>
              </div>
              
              {selectedService.amount_minimum && <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                  <strong>Minimum:</strong> {parseInt(selectedService.amount_minimum).toLocaleString()}
                  {selectedService.prices?.[0]?.maximum && <span className="ml-2">
                      <strong>Maksimum:</strong> {parseInt(selectedService.prices[0].maximum).toLocaleString()}
                    </span>}
                </div>}
            </div> : <div className="text-center py-8 text-muted-foreground">
              <Calculator className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Xidmət və miqdar seçin</p>
            </div>}
        </CardContent>
      </Card>
    </div>;
}