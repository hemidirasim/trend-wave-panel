
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { PaymentDialog } from './PaymentDialog';
import { usePayment } from '@/hooks/usePayment';
import { PaymentRequest } from '@/types/payment';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
  // New props for guest orders
  serviceData?: any;
  orderDetails?: any;
  isGuestOrder?: boolean;
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
  children,
  serviceData,
  orderDetails,
  isGuestOrder = false
}: PaymentButtonProps) {
  const { user } = useAuth();
  const { paymentDialogOpen, setPaymentDialogOpen, currentPaymentRequest, initiatePayment } = usePayment();

  const handlePaymentClick = () => {
    console.log('Payment button clicked with USD amount:', amount);
    
    const paymentRequest: PaymentRequest = {
      amount,
      currency: 'USD',
      orderId,
      description,
      customerEmail,
      customerName,
      userId,
      successUrl: `${window.location.origin}/payment-success?order=${orderId}`,
      errorUrl: `${window.location.origin}/payment-error?order=${orderId}`
    };

    console.log('Initiating payment with USD request:', paymentRequest);
    initiatePayment(paymentRequest);
  };

  const handlePaymentSuccess = async (transactionId: string) => {
    // Handle guest orders
    if (isGuestOrder && customerEmail && serviceData && orderDetails) {
      try {
        const { data, error } = await supabase.functions.invoke('guest-order', {
          body: {
            email: customerEmail,
            serviceData: serviceData,
            orderDetails: orderDetails,
            transactionId: transactionId
          }
        });

        if (error) {
          console.error('Guest order creation failed:', error);
          onError?.('Failed to create order record');
          return;
        }

        console.log('Guest order created:', data);
      } catch (error) {
        console.error('Error creating guest order:', error);
        onError?.('Failed to process order');
        return;
      }
    }

    onSuccess?.(transactionId);
  };

  console.log('PaymentButton rendered - dialogOpen:', paymentDialogOpen, 'currentRequest:', !!currentPaymentRequest);

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
        onSuccess={handlePaymentSuccess}
        onError={onError}
      />
    </>
  );
}
