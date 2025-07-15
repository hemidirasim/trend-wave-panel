
import { PaymentProviderInterface, PaymentRequest, PaymentResponse, PaymentStatus, PaymentProvider } from '@/types/payment';
import { PayriffProvider } from './PayriffProvider';

export class PaymentService {
  private providers: Map<string, PaymentProviderInterface> = new Map();
  private defaultProvider: string = 'payriff';

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    // Initialize Payriff provider
    const payriffProvider = new PayriffProvider(
      'ES1092268', // Merchant ID
      'B2FD40D66C644251AF8C007857A13B6F' // Secret Key
    );
    this.providers.set('payriff', payriffProvider);
  }

  getAvailableProviders(): PaymentProvider[] {
    return [
      {
        id: 'payriff',
        name: 'Payriff',
        isActive: true
      }
      // Future providers can be added here
    ];
  }

  async createPayment(
    request: PaymentRequest, 
    providerId: string = this.defaultProvider
  ): Promise<PaymentResponse> {
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new Error(`Payment provider ${providerId} not found`);
    }

    return provider.createPayment(request);
  }

  async checkPaymentStatus(
    transactionId: string, 
    providerId: string = this.defaultProvider
  ): Promise<PaymentStatus> {
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new Error(`Payment provider ${providerId} not found`);
    }

    return provider.checkPaymentStatus(transactionId);
  }

  async verifyPayment(
    data: any, 
    providerId: string = this.defaultProvider
  ): Promise<boolean> {
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new Error(`Payment provider ${providerId} not found`);
    }

    return provider.verifyPayment(data);
  }

  addProvider(id: string, provider: PaymentProviderInterface) {
    this.providers.set(id, provider);
  }

  setDefaultProvider(providerId: string) {
    if (!this.providers.has(providerId)) {
      throw new Error(`Payment provider ${providerId} not found`);
    }
    this.defaultProvider = providerId;
  }
}

// Singleton instance
export const paymentService = new PaymentService();
