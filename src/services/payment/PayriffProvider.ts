
import { PaymentProviderInterface, PaymentRequest, PaymentResponse, PaymentStatus } from '@/types/payment';

interface PayriffPaymentData {
  amount: number;
  language: string;
  currency: string;
  description: string;
  callbackUrl: string;
  cardSave: boolean;
  operation: string;
  metadata?: { [key: string]: string };
}

interface PayriffApiResponse {
  code: string;
  message: string;
  route: string;
  internalMessage: string | null;
  responseId: string;
  payload: {
    orderId: string;
    paymentUrl: string;
    transactionId: number;
  };
}

interface PayriffStatusData {
  orderId: string;
}

export class PayriffProvider implements PaymentProviderInterface {
  private readonly baseUrl = 'https://api.payriff.com';
  private readonly merchantId: string;
  private readonly secretKey: string;

  constructor(merchantId: string, secretKey: string) {
    this.merchantId = merchantId;
    this.secretKey = secretKey;
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      console.log('Creating Payriff payment with credentials:', {
        merchantId: this.merchantId,
        secretKeyLength: this.secretKey.length
      });

      const paymentData: PayriffPaymentData = {
        amount: request.amount,
        language: 'EN',
        currency: request.currency.toUpperCase(),
        description: request.description,
        callbackUrl: request.successUrl,
        cardSave: false,
        operation: 'PURCHASE',
        metadata: {
          orderId: request.orderId,
          customerEmail: request.customerEmail || '',
          customerName: request.customerName || ''
        }
      };

      console.log('Sending payment request to:', `${this.baseUrl}/api/v3/orders`);
      console.log('Payment data:', paymentData);

      const response = await fetch(`${this.baseUrl}/api/v3/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'MerchantId': this.merchantId,
          'Authorization': `Bearer ${this.secretKey}`
        },
        body: JSON.stringify(paymentData)
      });

      console.log('Payriff API response status:', response.status);
      console.log('Payriff API response headers:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('Payriff API raw response:', responseText);

      let result: PayriffApiResponse;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        console.error('Response text:', responseText);
        return {
          success: false,
          error: 'API cavab formatı düzgün deyil'
        };
      }

      console.log('Payriff payment response:', result);

      if (result.code === '00000' && result.payload?.paymentUrl) {
        return {
          success: true,
          paymentUrl: result.payload.paymentUrl,
          transactionId: result.payload.transactionId.toString()
        };
      } else {
        return {
          success: false,
          error: result.message || 'Ödəniş yaradılmadı'
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
      const statusData: PayriffStatusData = {
        orderId: transactionId
      };

      const response = await fetch(`${this.baseUrl}/api/v3/orders/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'MerchantId': this.merchantId,
          'Authorization': `Bearer ${this.secretKey}`
        },
        body: JSON.stringify(statusData)
      });

      const result = await response.json();

      return {
        status: this.mapPayriffStatus(result.status),
        transactionId: result.transactionId,
        amount: result.amount,
        currency: result.currency,
        orderId: result.orderId
      };
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

  private mapPayriffStatus(status: string): 'pending' | 'success' | 'failed' | 'cancelled' {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'completed':
      case 'paid':
        return 'success';
      case 'failed':
      case 'error':
      case 'declined':
        return 'failed';
      case 'cancelled':
      case 'canceled':
        return 'cancelled';
      default:
        return 'pending';
    }
  }
}
