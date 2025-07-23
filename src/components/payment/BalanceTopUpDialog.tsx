
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PaymentButton } from './PaymentButton';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { DollarSign } from 'lucide-react';

interface BalanceTopUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentSuccess?: () => void;
}

export function BalanceTopUpDialog({ open, onOpenChange, onPaymentSuccess }: BalanceTopUpDialogProps) {
  const [amount, setAmount] = useState<number>(1);
  const { user } = useAuth();
  const { t } = useLanguage();

  const predefinedAmounts: number[] = [1, 5, 10, 25, 50, 100];

  const handlePaymentSuccess = (transactionId: string) => {
    console.log('Balance top-up payment successful:', transactionId);
    onPaymentSuccess?.();
    onOpenChange(false);
  };

  const handlePaymentError = (error: string) => {
    console.error('Balance top-up payment error:', error);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {t('balance.topUp')}
          </DialogTitle>
          <DialogDescription>
            {t('balance.topUpDesc')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Predefined Amount Buttons */}
          <div>
            <Label className="text-sm font-medium">{t('balance.quickSelection')}</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {predefinedAmounts.map((preAmount) => (
                <Button
                  key={preAmount}
                  variant={amount === preAmount ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAmount(preAmount)}
                  className="text-sm"
                >
                  ${preAmount}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">{t('balance.amount')}</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(Math.max(1, parseFloat(e.target.value) || 1))}
              placeholder={t('balance.enterAmount')}
            />
          </div>

          {/* Conversion Info */}
          <div className="bg-muted p-3 rounded-lg text-sm">
            <p className="text-muted-foreground">
              ${amount.toFixed(2)} USD ≈ {(amount * 1.7).toFixed(2)} AZN
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              ({t('balance.conversionRate')})
            </p>
          </div>

          {/* Payment Button */}
          <PaymentButton
            amount={amount}
            orderId={`balance-topup-${Date.now()}`}
            description={t('balance.topUpDescription')}
            customerEmail={user?.email || ''}
            customerName={user?.user_metadata?.full_name || user?.email || ''}
            userId={user?.id}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            className="w-full"
          >
            ${amount.toFixed(2)} USD {t('balance.payAmount')}
          </PaymentButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
