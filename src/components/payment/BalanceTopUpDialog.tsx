
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, CreditCard } from 'lucide-react';
import { PaymentDialog } from './PaymentDialog';
import { PaymentRequest } from '@/types/payment';

interface BalanceTopUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentSuccess?: () => void;
}

export function BalanceTopUpDialog({
  open,
  onOpenChange,
  onPaymentSuccess
}: BalanceTopUpDialogProps) {
  const [amount, setAmount] = useState('');
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);

  // Predefined packages in USD
  const packages = [
    { amount: 1, label: 'Test Paketi', description: 'Test üçün' },
    { amount: 10, label: 'Başlanğıc Paket', description: 'Kiçik sifarişlər üçün' },
    { amount: 25, label: 'Standart Paket', description: 'Orta sifarişlər üçün' },
    { amount: 50, label: 'Premium Paket', description: 'Böyük sifarişlər üçün' },
    { amount: 100, label: 'Pro Paket', description: 'Peşəkar istifadə üçün' },
    { amount: 250, label: 'Biznes Paket', description: 'Biznes hesabları üçün' }
  ];

  const handlePackageSelect = (packageAmount: number) => {
    const request: PaymentRequest = {
      amount: packageAmount,
      currency: 'USD',
      orderId: `balance-topup-${Date.now()}`,
      description: `Balans artırılması - $${packageAmount}`,
      customerEmail: '',
      successUrl: window.location.origin + '/dashboard',
      errorUrl: window.location.origin + '/dashboard'
    };
    
    setPaymentRequest(request);
    setPaymentDialogOpen(true);
  };

  const handleCustomAmount = () => {
    const customAmount = parseFloat(amount);
    if (customAmount && customAmount >= 1) {
      const request: PaymentRequest = {
        amount: customAmount,
        currency: 'USD',
        orderId: `balance-topup-${Date.now()}`,
        description: `Balans artırılması - $${customAmount}`,
        customerEmail: '',
        successUrl: window.location.origin + '/dashboard',
        errorUrl: window.location.origin + '/dashboard'
      };
      
      setPaymentRequest(request);
      setPaymentDialogOpen(true);
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentDialogOpen(false);
    onOpenChange(false);
    setAmount('');
    onPaymentSuccess?.();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Balans Artır
            </DialogTitle>
            <DialogDescription>
              Balansınızı artırmaq üçün paket seçin və ya məbləğ daxil edin
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-3">Hazır Paketlər (USD)</h4>
              <div className="grid grid-cols-2 gap-2">
                {packages.map((pkg) => (
                  <Card key={pkg.amount} className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardContent 
                      className="p-3 text-center"
                      onClick={() => handlePackageSelect(pkg.amount)}
                    >
                      <div className="font-semibold text-lg">${pkg.amount}</div>
                      <div className="text-xs text-muted-foreground">{pkg.label}</div>
                      <div className="text-xs text-muted-foreground">{pkg.description}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-amount">Və ya fərdi məbləğ (USD)</Label>
              <div className="flex space-x-2">
                <Input
                  id="custom-amount"
                  type="number"
                  placeholder="Məbləğ daxil edin"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  step="0.01"
                />
                <Button 
                  onClick={handleCustomAmount}
                  disabled={!amount || parseFloat(amount) < 1}
                  className="flex-shrink-0"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Ödə
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum məbləğ: $1.00 USD
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        paymentRequest={paymentRequest}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
}
