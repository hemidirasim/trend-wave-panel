import { PaymentProviderInterface, PaymentRequest, PaymentResponse, PaymentStatus } from '@/types/payment';
import { supabase } from '@/integrations/supabase/client';

export class EpointProvider implements PaymentProviderInterface {
  // Simple USD to AZN conversion rate - in production this should come from a live API
  private readonly USD_TO_AZN_RATE = 1.7; // Approximate rate

  private convertUsdToAzn(usdAmount: number): number {
    return parseFloat((usdAmount * this.USD_TO_AZN_RATE).toFixed(2));
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      console.log('Creating Epoint payment via Edge Function:', request);

      // Convert USD amount to AZN for Epoint
      const aznAmount = request.currency === 'USD' ? this.convertUsdToAzn(request.amount) : request.amount;
      console.log(`Converting ${request.amount} USD to ${aznAmount} AZN for Epoint`);

      const { data, error } = await supabase.functions.invoke('epoint-payment', {
        body: {
          action: 'createPayment',
          amount: aznAmount, // Send converted AZN amount
          currency: 'AZN', // Always AZN for Epoint
          orderId: request.orderId,
          description: `${request.description} (${request.amount} USD = ${aznAmount} AZN)`,
          customerEmail: request.customerEmail,
          customerName: request.customerName,
          userId: request.userId, // Pass the user ID
          successUrl: request.successUrl,
          errorUrl: request.errorUrl,
          originalAmount: request.amount, // Keep original USD amount for reference
          originalCurrency: request.currency
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
      console.error('Epoint payment error:', error);
      return {
        success: false,
        error: 'Ödəniş sistemində xəta baş verdi'
      };
    }
  }

  async checkPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    try {
      const { data, error } = await supabase.functions.invoke('epoint-payment', {
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
      // Epoint verification would need to be implemented based on their callback system
      return true;
    } catch (error) {
      console.error('Payment verification error:', error);
      return false;
    }
  }
}
