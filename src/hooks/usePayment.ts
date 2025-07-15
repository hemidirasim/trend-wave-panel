
import { useState } from 'react';
import { paymentService } from '@/services/payment/PaymentService';
import { PaymentRequest, PaymentStatus } from '@/types/payment';
import { toast } from 'sonner';

export function usePayment() {
  const [loading, setLoading] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [currentPaymentRequest, setCurrentPaymentRequest] = useState<PaymentRequest | null>(null);

  const initiatePayment = async (request: PaymentRequest) => {
    setCurrentPaymentRequest(request);
    setPaymentDialogOpen(true);
  };

  const checkPaymentStatus = async (transactionId: string, providerId?: string): Promise<PaymentStatus | null> => {
    try {
      setLoading(true);
      const status = await paymentService.checkPaymentStatus(transactionId, providerId);
      return status;
    } catch (error) {
      console.error('Error checking payment status:', error);
      toast.error('Ödəniş statusu yoxlanılmadı');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (data: any, providerId?: string): Promise<boolean> => {
    try {
      return await paymentService.verifyPayment(data, providerId);
    } catch (error) {
      console.error('Error verifying payment:', error);
      return false;
    }
  };

  const getAvailableProviders = () => {
    return paymentService.getAvailableProviders();
  };

  return {
    loading,
    paymentDialogOpen,
    setPaymentDialogOpen,
    currentPaymentRequest,
    initiatePayment,
    checkPaymentStatus,
    verifyPayment,
    getAvailableProviders
  };
}
