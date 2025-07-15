
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CreditCard } from 'lucide-react';
import { paymentService } from '@/services/payment/PaymentService';
import { PaymentRequest } from '@/types/payment';
import { toast } from 'sonner';

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentRequest: PaymentRequest;
  onSuccess?: (transactionId: string) => void;
  onError?: (error: string) => void;
}

export function PaymentDialog({
  open,
  onOpenChange,
  paymentRequest,
  onSuccess,
  onError
}: PaymentDialogProps) {
  const [selectedProvider, setSelectedProvider] = useState('payriff');
  const [loading, setLoading] = useState(false);

  const availableProviders = paymentService.getAvailableProviders();

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      const response = await paymentService.createPayment(paymentRequest, selectedProvider);
      
      if (response.success && response.paymentUrl) {
        // Open payment URL in new tab
        window.open(response.paymentUrl, '_blank');
        
        toast.success('Ödəniş səhifəsi açıldı');
        onSuccess?.(response.transactionId || '');
        onOpenChange(false);
      } else {
        toast.error(response.error || 'Ödəniş yaradılmadı');
        onError?.(response.error || 'Ödəniş yaradılmadı');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Ödəniş sistemində xəta baş verdi');
      onError?.('Ödəniş sistemində xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Ödəniş Et
          </DialogTitle>
          <DialogDescription>
            Sifarişinizi tamamlamaq üçün ödəniş edin
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Məbləğ:</span>
              <span className="font-semibold">${paymentRequest.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Sifariş ID:</span>
              <span className="text-sm">{paymentRequest.orderId}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Ödəniş sistemi seçin:</label>
            <Select value={selectedProvider} onValueChange={setSelectedProvider}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableProviders.map(provider => (
                  <SelectItem key={provider.id} value={provider.id} disabled={!provider.isActive}>
                    {provider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Ləğv et
            </Button>
            <Button
              className="flex-1"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Yüklənir...
                </>
              ) : (
                'Ödənişə keç'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
