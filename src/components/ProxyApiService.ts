import { supabase } from "@/integrations/supabase/client";

const API_BASE_URL = 'https://www.qqtube.com/v1-api';
const API_KEY = '2246aa33bc7050be3469cc0dd4a0065831e3148f';

export interface Service {
  id_service: string;
  public_name: string;
  platform: string;
  amount_minimum: string;
  amount_increment: string;
  is_geo: string;
  is_retention: string;
  is_drip: string;
  drip_cost: string;
  example: string;
  type_name: string;
  description?: string;
  prices: Array<{
    minimum: string;
    maximum: string;
    pricing_per: string;
    price: string;
  }>;
  params?: Array<{
    field_label: string;
    field_descr: string;
    field_placeholder: string;
    field_name: string;
    field_validators: string;
    is_price_modifier: string;
    options?: Array<{
      name: string;
      value: string;
      error_selection: string;
    }>;
  }>;
}

export interface OrderResponse {
  status: string;
  id_service_submission?: string;
  short_url?: string;
  long_url?: string;
  start_count?: number;
  wanted_count?: number;
  current_count?: number;
  message?: Array<{
    id: number;
    message: string;
  }>;
}

export interface OrderStatus {
  id_service_submission: string;
  short_url: string;
  long_url: string;
  start_count: string;
  wanted_count: string;
  current_count: string;
  sent_count?: string;
  total_cost: string;
  status: {
    id_status: string;
    name: string;
    type: string;
    description: string;
  };
  refund_total?: string;
  refund_time?: string;
}

export interface Submission {
  id_service_submission: string;
  short_url: string;
  id_status: string;
  id_service: string;
  start_count: string;
  wanted_count: string;
  current_count: string;
  total_cost: string;
  date_added: string;
}

class ProxyApiService {
  private async makeRequest(requestData: any): Promise<any> {
    try {
      console.log('Making request via Edge Function:', requestData);
      
      const { data, error } = await supabase.functions.invoke('qqtube-api', {
        body: requestData,
      });

      if (error) {
        console.error('Edge Function Error:', error);
        throw new Error(`Edge Function error: ${error.message}`);
      }

      console.log('Edge Function Response:', data);
      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  async getServices(): Promise<Service[]> {
    try {
      const data = await this.makeRequest({ action: 'services' });
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching services:', error);
      throw new Error('Failed to fetch services');
    }
  }

  async getServiceDetails(serviceId: string): Promise<Service | null> {
    try {
      console.log('Fetching service details for ID:', serviceId);
      const data = await this.makeRequest({ 
        action: 'service',
        id_service: serviceId
      });
      
      console.log('Service details API response:', data);
      
      // The API returns the service object directly
      if (data && typeof data === 'object') {
        console.log('Service details found:', {
          id: data.id_service,
          name: data.public_name,
          description: data.description || 'No description available',
          hasDescription: !!data.description
        });
        return data;
      }
      
      console.log('No service details found or invalid response format');
      return null;
    } catch (error) {
      console.error('Error fetching service details:', error);
      throw new Error('Failed to fetch service details');
    }
  }

  async placeOrder(
    serviceId: string,
    url: string,
    quantity: number,
    additionalParams: Record<string, any> = {}
  ): Promise<OrderResponse> {
    try {
      const requestData = {
        action: 'add',
        id_service: serviceId,
        url: url,
        quantity: quantity,
        ...additionalParams
      };

      const data = await this.makeRequest(requestData);
      return data;
    } catch (error) {
      console.error('Error placing order:', error);
      throw new Error('Failed to place order');
    }
  }

  async getOrderStatus(orderId: string): Promise<OrderStatus> {
    try {
      const data = await this.makeRequest({
        action: 'stats',
        id_service_submission: orderId
      });

      return data;
    } catch (error) {
      console.error('Error fetching order status:', error);
      throw new Error('Failed to fetch order status');
    }
  }

  async getAllSubmissions(limit = 100): Promise<Submission[]> {
    try {
      const data = await this.makeRequest({
        action: 'submissions',
        limit: limit
      });

      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching submissions:', error);
      throw new Error('Failed to fetch submissions');
    }
  }

  async getFunds(): Promise<number> {
    try {
      const data = await this.makeRequest({ action: 'funds' });
      return parseFloat(data.funds || '0');
    } catch (error) {
      console.error('Error fetching funds:', error);
      throw new Error('Failed to fetch funds');
    }
  }

  calculatePrice(service: Service, quantity: number, serviceFee: number = 0): number {
    const priceRange = service.prices.find(
      (price) =>
        quantity >= parseInt(price.minimum) && quantity <= parseInt(price.maximum)
    );

    if (!priceRange) {
      return 0;
    }

    const pricePer = parseInt(priceRange.pricing_per);
    const basePrice = parseFloat(priceRange.price);
    const baseCost = (quantity / pricePer) * basePrice;
    
    // Apply fixed service fee instead of percentage
    return baseCost + serviceFee;
  }

  // New method to format prices properly
  formatPrice(price: string | number): string {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    // If it's a whole number, return without decimal
    if (numPrice % 1 === 0) {
      return numPrice.toString();
    }
    
    // Remove trailing zeros after decimal point
    return numPrice.toFixed(10).replace(/\.?0+$/, '');
  }

  validateUrl(platform: string, url: string): boolean {
    const patterns: Record<string, RegExp> = {
      youtube: /^https?:\/\/(www\.)?(youtube\.com\/(watch\?v=|channel\/|user\/)|youtu\.be\/)/i,
      instagram: /^https?:\/\/(www\.)?instagram\.com\//i,
      tiktok: /^https?:\/\/(www\.)?tiktok\.com\//i,
      facebook: /^https?:\/\/(www\.)?facebook\.com\//i,
      twitter: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\//i,
      telegram: /^https?:\/\/(www\.)?t\.me\//i,
    };

    const pattern = patterns[platform.toLowerCase()];
    return pattern ? pattern.test(url) : true;
  }
}

export const proxyApiService = new ProxyApiService();
