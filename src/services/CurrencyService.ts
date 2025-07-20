
import { supabase } from '@/integrations/supabase/client';

export interface ExchangeRate {
  id: string;
  from_currency: string;
  to_currency: string;
  rate: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class CurrencyService {
  private static instance: CurrencyService;
  private cachedRates: Map<string, ExchangeRate> = new Map();
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService();
    }
    return CurrencyService.instance;
  }

  async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
    const key = `${fromCurrency}_${toCurrency}`;
    const now = Date.now();

    // Check cache first
    if (this.cachedRates.has(key) && (now - this.lastFetch) < this.CACHE_DURATION) {
      return this.cachedRates.get(key)!.rate;
    }

    try {
      const { data, error } = await supabase
        .from('exchange_rates')
        .select('*')
        .eq('from_currency', fromCurrency)
        .eq('to_currency', toCurrency)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        console.error('Exchange rate not found:', error);
        return fromCurrency === toCurrency ? 1 : 1.7; // Default USD to AZN rate
      }

      // Update cache
      this.cachedRates.set(key, data);
      this.lastFetch = now;

      return data.rate;
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      return fromCurrency === toCurrency ? 1 : 1.7; // Default fallback
    }
  }

  async convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    const rate = await this.getExchangeRate(fromCurrency, toCurrency);
    return amount * rate;
  }

  async getAllExchangeRates(): Promise<ExchangeRate[]> {
    const { data, error } = await supabase
      .from('exchange_rates')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching exchange rates:', error);
      return [];
    }

    return data || [];
  }

  formatCurrency(amount: number, currency: string): string {
    if (currency === 'AZN') {
      return `${amount.toFixed(2)} ₼`;
    }
    return `$${amount.toFixed(2)}`;
  }

  clearCache(): void {
    this.cachedRates.clear();
    this.lastFetch = 0;
  }
}

export const currencyService = CurrencyService.getInstance();
