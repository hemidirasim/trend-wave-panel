
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard } from 'lucide-react';
import { PaymentButton } from './PaymentButton';

interface BalanceTopUpDialogProps {
  customerEmail?: string;
  customerName?: string;
  userId?: string;
  onSuccess?: (transactionId: string) => void;
  onError?: (error: string) => void;
}

export function BalanceTopUpDialog({
  customerEmail,
  customerName,
  userId,
  onSuccess,
  onError
}: BalanceTopUpDialogProps) {
  const [amount, setAmount] = useState<number>(20);
  const [isOpen, setIsOpen] = useState(false);

  const predefinedAmounts = [20, 50, 100, 200, 500];

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 20) {
      setAmount(value);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
          <CreditCard className="h-4 w-4 mr-1" />
          Artır
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Balans Artır
          </DialogTitle>
          <DialogDescription>
            Hesabınıza artırmaq istədiyiniz məbləği seçin (minimum $20 USD)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Tez seçim:</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {predefinedAmounts.map((presetAmount) => (
                <Button
                  key={presetAmount}
                  variant={amount === presetAmount ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleAmountSelect(presetAmount)}
                  className="text-sm"
                >
                  ${presetAmount} USD
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="custom-amount" className="text-sm font-medium">
              Və ya özünüz yazın:
            </Label>
            <Input
              id="custom-amount"
              type="number"
              min="20"
              step="1"
              value={amount}
              onChange={handleCustomAmountChange}
              placeholder="Məbləği daxil edin (min $20 USD)"
              className="mt-1"
            />
            {amount < 20 && (
              <p className="text-sm text-red-600 mt-1">
                Minimum məbləğ $20 USD olmalıdır
              </p>
            )}
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Artırılacaq məbləğ:</span>
              <span className="font-semibold text-lg">${amount.toFixed(2)} USD</span>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              Ləğv et
            </Button>
            <PaymentButton
              amount={amount}
              orderId={`balance-${Date.now()}`}
              description={`Balans artırma - $${amount.toFixed(2)} USD`}
              customerEmail={customerEmail}
              customerName={customerName}
              userId={userId}
              onSuccess={(transactionId) => {
                onSuccess?.(transactionId);
                setIsOpen(false);
              }}
              onError={onError}
              className="flex-1"
              disabled={amount < 20}
            >
              Ödənişə keç
            </PaymentButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
