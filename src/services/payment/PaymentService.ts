
import { PaymentProviderInterface, PaymentRequest, PaymentResponse, PaymentStatus, PaymentProvider } from '@/types/payment';
import { PayriffProvider } from './PayriffProvider';
import { EpointProvider } from './EpointProvider';

export class PaymentService {
  private providers: Map<string, PaymentProviderInterface> = new Map();
  private defaultProvider: string = 'payriff';

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    // Initialize Payriff provider (credentials are now in Edge Function)
    const payriffProvider = new PayriffProvider();
    this.providers.set('payriff', payriffProvider);

    // Initialize Epoint provider
    const epointProvider = new EpointProvider();
    this.providers.set('epoint', epointProvider);
  }

  getAvailableProviders(): PaymentProvider[] {
    return [
      {
        id: 'payriff',
        name: 'Payriff',
        isActive: true
      },
      {
        id: 'epoint',
        name: 'Epoint',
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
