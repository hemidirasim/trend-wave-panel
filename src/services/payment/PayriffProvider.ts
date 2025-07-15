
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
  private readonly baseUrl = 'https://api.payriff.com';
  private readonly merchantId: string;
  private readonly secretKey: string;

  constructor(merchantId: string, secretKey: string) {
    this.merchantId = merchantId;
    this.secretKey = secretKey;
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      console.log('Creating Payriff payment:', request);

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

      const response = await fetch(`${this.baseUrl}/api/v2/payment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();
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

      const response = await fetch(`${this.baseUrl}/api/v2/payment/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
    // Payriff signature generation logic
    const sortedKeys = Object.keys(data).filter(key => key !== 'signature').sort();
    const signatureString = sortedKeys.map(key => `${key}=${data[key]}`).join('&');
    const stringToSign = signatureString + this.secretKey;
    
    // Use crypto to generate SHA-256 hash
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(stringToSign);
    
    // For now, return a mock signature - in real implementation, use proper crypto
    return btoa(stringToSign).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
  }

  private mapPayriffStatus(status: string): 'pending' | 'success' | 'failed' | 'cancelled' {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'completed':
        return 'success';
      case 'failed':
      case 'error':
        return 'failed';
      case 'cancelled':
      case 'canceled':
        return 'cancelled';
      default:
        return 'pending';
    }
  }
}
