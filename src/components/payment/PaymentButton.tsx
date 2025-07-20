
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { PaymentDialog } from './PaymentDialog';
import { usePayment } from '@/hooks/usePayment';
import { PaymentRequest } from '@/types/payment';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useEffect, useState } from 'react';

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
  const { convertAmount, formatAmount, currency } = useCurrency();
  const [aznAmount, setAznAmount] = useState<number>(amount);

  useEffect(() => {
    const convertToAZN = async () => {
      // Payment systems work with AZN, so convert from current currency to AZN
      if (currency === 'AZN') {
        setAznAmount(amount);
      } else {
        const converted = await convertAmount(amount, 'USD');
        setAznAmount(converted);
      }
    };

    convertToAZN();
  }, [amount, currency, convertAmount]);

  const handlePaymentClick = () => {
    console.log('Payment button clicked'); // Debug log
    
    const paymentRequest: PaymentRequest = {
      amount: aznAmount, // Always send AZN amount to payment systems
      currency: 'AZN',
      orderId,
      description,
      customerEmail,
      customerName,
      userId,
      successUrl: `${window.location.origin}/payment-success?order=${orderId}`,
      errorUrl: `${window.location.origin}/payment-error?order=${orderId}`
    };

    console.log('Initiating payment with request:', paymentRequest); // Debug log
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
        {children || `${formatAmount(aznAmount, 'AZN')} ödə`}
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
