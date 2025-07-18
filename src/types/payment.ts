
export interface PaymentProvider {
  id: string;
  name: string;
  isActive: boolean;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  orderId: string;
  description: string;
  customerEmail?: string;
  customerName?: string;
  userId?: string;
  successUrl: string;
  errorUrl: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  transactionId?: string;
  error?: string;
}

export interface PaymentStatus {
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  transactionId: string;
  amount: number;
  currency: string;
  orderId: string;
}

export interface PaymentProviderInterface {
  createPayment(request: PaymentRequest): Promise<PaymentResponse>;
  checkPaymentStatus(transactionId: string): Promise<PaymentStatus>;
  verifyPayment(data: any): Promise<boolean>;
}
