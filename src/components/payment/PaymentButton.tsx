
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
  userId?: string;
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
  userId,
  onSuccess,
  onError,
  disabled,
  className,
  children
}: PaymentButtonProps) {
  const { paymentDialogOpen, setPaymentDialogOpen, currentPaymentRequest, initiatePayment } = usePayment();

  const handlePaymentClick = () => {
    console.log('Payment button clicked with USD amount:', amount); // Debug log
    
    const paymentRequest: PaymentRequest = {
      amount,
      currency: 'USD', // Always USD as the base currency
      orderId,
      description,
      customerEmail,
      customerName,
      userId,
      successUrl: `${window.location.origin}/payment-success?order=${orderId}`,
      errorUrl: `${window.location.origin}/payment-error?order=${orderId}`
    };

    console.log('Initiating payment with USD request:', paymentRequest); // Debug log
    initiatePayment(paymentRequest);
  };

  console.log('PaymentButton rendered - dialogOpen:', paymentDialogOpen, 'currentRequest:', !!currentPaymentRequest); // Debug log

  return (
    <>
      <Button
        onClick={handlePaymentClick}
        disabled={disabled}
        className={className}
      >
        <CreditCard className="h-4 w-4 mr-2" />
        {children || `$${amount.toFixed(2)} USD ödə`}
      </Button>

      <PaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        paymentRequest={currentPaymentRequest}
        onSuccess={onSuccess}
        onError={onError}
      />
    </>
  );
}
