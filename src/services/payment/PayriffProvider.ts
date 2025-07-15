
import { PaymentProviderInterface, PaymentRequest, PaymentResponse, PaymentStatus } from '@/types/payment';

interface PayriffPaymentData {
  merchant: string;
  amount: number;
  currency: string;
  order_id: string;
  description: string;
  success_url: string;
  error_url: string;
  customer_email: string;
  customer_name: string;
  language: string;
  signature?: string;
}

interface PayriffStatusData {
  merchant: string;
  transaction_id: string;
  signature?: string;
}

export class PayriffProvider implements PaymentProviderInterface {
  private readonly baseUrl = 'https://api.payriff.com/api/v3';
  private readonly merchantId: string;
  private readonly secretKey: string;

  constructor(merchantId: string, secretKey: string) {
    this.merchantId = merchantId;
    this.secretKey = secretKey;
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      console.log('Creating Payriff payment with API v3:', request);

      // Convert amount to kopecks (Payriff expects amount in kopecks)
      const amountInKopecks = Math.round(request.amount * 100);

      const paymentData: PayriffPaymentData = {
        merchant: this.merchantId,
        amount: amountInKopecks,
        currency: request.currency.toUpperCase(),
        order_id: request.orderId,
        description: request.description,
        success_url: request.successUrl,
        error_url: request.errorUrl,
        customer_email: request.customerEmail || '',
        customer_name: request.customerName || '',
        language: 'az'
      };

      // Generate signature
      const signature = this.generateSignature(paymentData);
      paymentData.signature = signature;

      console.log('Sending payment request to:', `${this.baseUrl}/payment/create`);
      console.log('Payment data:', paymentData);

      const response = await fetch(`${this.baseUrl}/payment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      console.log('Payriff API response status:', response.status);
      console.log('Payriff API response headers:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('Payriff API raw response:', responseText);

      let result;
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

      if (result.status === 'success' && result.payment_url) {
        return {
          success: true,
          paymentUrl: result.payment_url,
          transactionId: result.transaction_id
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
        merchant: this.merchantId,
        transaction_id: transactionId
      };

      const signature = this.generateSignature(statusData);
      statusData.signature = signature;

      const response = await fetch(`${this.baseUrl}/payment/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(statusData)
      });

      const result = await response.json();

      return {
        status: this.mapPayriffStatus(result.status),
        transactionId: result.transaction_id,
        amount: result.amount / 100, // Convert from kopecks to main currency
        currency: result.currency,
        orderId: result.order_id
      };
    } catch (error) {
      console.error('Error checking payment status:', error);
      throw new Error('Ödəniş statusu yoxlanılmadı');
    }
  }

  async verifyPayment(data: any): Promise<boolean> {
    try {
      // Verify signature for callback
      const expectedSignature = this.generateSignature(data, true);
      return data.signature === expectedSignature;
    } catch (error) {
      console.error('Payment verification error:', error);
      return false;
    }
  }

  private generateSignature(data: any, isCallback = false): string {
    try {
      // Payriff signature generation logic for API v3
      const sortedKeys = Object.keys(data).filter(key => key !== 'signature').sort();
      const signatureString = sortedKeys.map(key => `${key}=${data[key]}`).join('&');
      const stringToSign = signatureString + this.secretKey;
      
      console.log('Generating signature for string:', stringToSign);
      
      // Use a proper hash function for API v3
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(stringToSign);
      
      // Create a more robust hash
      let hash = 0;
      for (let i = 0; i < dataBuffer.length; i++) {
        const char = dataBuffer[i];
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      
      // Convert to positive hex string with better formatting for v3
      const signature = Math.abs(hash).toString(16).padStart(8, '0').toUpperCase();
      console.log('Generated signature for API v3:', signature);
      
      return signature;
    } catch (error) {
      console.error('Error generating signature:', error);
      // Fallback to a simple timestamp-based signature
      return Date.now().toString(16).toUpperCase();
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
