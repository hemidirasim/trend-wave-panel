
import { PaymentProviderInterface, PaymentRequest, PaymentResponse, PaymentStatus } from '@/types/payment';
import { supabase } from '@/integrations/supabase/client';

export class PayriffProvider implements PaymentProviderInterface {
  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      console.log('Creating Payriff payment via Edge Function:', request);

      const { data, error } = await supabase.functions.invoke('payriff-payment', {
        body: {
          action: 'createPayment',
          amount: request.amount,
          currency: request.currency || 'USD', // Default to USD if not specified
          orderId: request.orderId,
          description: request.description,
          customerEmail: request.customerEmail,
          customerName: request.customerName,
          successUrl: request.successUrl,
          errorUrl: request.errorUrl
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        return {
          success: false,
          error: 'Ödəniş sistemində xəta baş verdi'
        };
      }

      console.log('Edge function response:', data);

      if (data.success && data.paymentUrl) {
        return {
          success: true,
          paymentUrl: data.paymentUrl,
          transactionId: data.transactionId
        };
      } else {
        return {
          success: false,
          error: data.error || 'Ödəniş yaradılmadı'
        };
      }
    } catch (error) {
      console.error('Payriff payment error:', error);
      return {
        success: false,
        error: 'Ödəniş sistemində xəta baş verdi'
      };
    }
  }

  async checkPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    try {
      const { data, error } = await supabase.functions.invoke('payriff-payment', {
        body: {
          action: 'checkStatus',
          transactionId: transactionId
        }
      });

      if (error) {
        console.error('Status check error:', error);
        throw new Error('Ödəniş statusu yoxlanılmadı');
      }

      return data;
    } catch (error) {
      console.error('Error checking payment status:', error);
      throw new Error('Ödəniş statusu yoxlanılmadı');
    }
  }

  async verifyPayment(data: any): Promise<boolean> {
    try {
      // For API v3, verification might work differently
      // This would need to be implemented based on Payriff's callback verification
      return true;
    } catch (error) {
      console.error('Payment verification error:', error);
      return false;
    }
  }
}
