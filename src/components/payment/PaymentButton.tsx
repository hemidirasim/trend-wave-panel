
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { PaymentDialog } from './PaymentDialog';
import { usePayment } from '@/hooks/usePayment';
import { PaymentRequest } from '@/types/payment';

interface PaymentButtonProps {
  amount: number;
  orderId: string;
  description: string;
  customerEmail?: string;
  customerName?: string;
  onSuccess?: (transactionId: string) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function PaymentButton({
  amount,
  orderId,
  description,
  customerEmail,
  customerName,
  onSuccess,
  onError,
  disabled,
  className,
  children
}: PaymentButtonProps) {
  const { paymentDialogOpen, setPaymentDialogOpen, currentPaymentRequest, initiatePayment } = usePayment();

  const handlePaymentClick = () => {
    const paymentRequest: PaymentRequest = {
      amount,
      currency: 'AZN',
      orderId,
      description,
      customerEmail,
      customerName,
      successUrl: `${window.location.origin}/payment-success?order=${orderId}`,
      errorUrl: `${window.location.origin}/payment-error?order=${orderId}`
    };

    initiatePayment(paymentRequest);
  };

  return (
    <>
      <Button
        onClick={handlePaymentClick}
        disabled={disabled}
        className={className}
      >
        <CreditCard className="h-4 w-4 mr-2" />
        {children || `${amount.toFixed(2)} AZN ödə`}
      </Button>

      {currentPaymentRequest && (
        <PaymentDialog
          open={paymentDialogOpen}
          onOpenChange={setPaymentDialogOpen}
          paymentRequest={currentPaymentRequest}
          onSuccess={onSuccess}
          onError={onError}
        />
      )}
    </>
  );
}
