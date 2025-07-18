
import { useState } from 'react';
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
  const [amount, setAmount] = useState<number>(0.10);
  const [isOpen, setIsOpen] = useState(false);

  const predefinedAmounts = [0.10, 1, 5, 10, 25, 50];

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
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
            Hesabınıza artırmaq istədiyiniz məbləği seçin
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
                  {presetAmount === 0.10 ? '0.10 AZN (Test)' : `${presetAmount} AZN`}
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
              min="0.01"
              step="0.01"
              value={amount}
              onChange={handleCustomAmountChange}
              placeholder="Məbləği daxil edin"
              className="mt-1"
            />
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Artırılacaq məbləğ:</span>
              <span className="font-semibold text-lg">{amount.toFixed(2)} AZN</span>
            </div>
            {amount === 0.10 && (
              <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded">
                💡 Test məbləği - ödəniş sistemini yoxlamaq üçün
              </div>
            )}
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
              description={`Balans artırma - ${amount.toFixed(2)} AZN`}
              customerEmail={customerEmail}
              customerName={customerName}
              userId={userId}
              onSuccess={(transactionId) => {
                onSuccess?.(transactionId);
                setIsOpen(false);
              }}
              onError={onError}
              className="flex-1"
            >
              Ödənişə keç
            </PaymentButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
