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

class ApiService {
  async getServices(): Promise<Service[]> {
    const formData = new FormData();
    formData.append('api_key', API_KEY);
    formData.append('action', 'services');

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching services:', error);
      throw new Error('Failed to fetch services');
    }
  }

  async placeOrder(
    serviceId: string,
    url: string,
    quantity: number,
    additionalParams: Record<string, any> = {}
  ): Promise<OrderResponse> {
    const formData = new FormData();
    formData.append('api_key', API_KEY);
    formData.append('action', 'add');
    formData.append('id_service', serviceId);
    formData.append('url', url);
    formData.append('quantity', quantity.toString());

    // Add any additional parameters
    Object.entries(additionalParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error placing order:', error);
      throw new Error('Failed to place order');
    }
  }

  async getOrderStatus(orderId: string): Promise<OrderStatus> {
    const params = new URLSearchParams({
      api_key: API_KEY,
      action: 'stats',
      id_service_submission: orderId,
    });

    try {
      const response = await fetch(`${API_BASE_URL}?${params}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching order status:', error);
      throw new Error('Failed to fetch order status');
    }
  }

  async getAllSubmissions(limit = 100): Promise<Submission[]> {
    const params = new URLSearchParams({
      api_key: API_KEY,
      action: 'submissions',
      limit: limit.toString(),
    });

    try {
      const response = await fetch(`${API_BASE_URL}?${params}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching submissions:', error);
      throw new Error('Failed to fetch submissions');
    }
  }

  async getFunds(): Promise<number> {
    const params = new URLSearchParams({
      api_key: API_KEY,
      action: 'funds',
    });

    try {
      const response = await fetch(`${API_BASE_URL}?${params}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return parseFloat(data.funds || '0');
    } catch (error) {
      console.error('Error fetching funds:', error);
      throw new Error('Failed to fetch funds');
    }
  }

  calculatePrice(service: Service, quantity: number): number {
    const priceRange = service.prices.find(
      (price) =>
        quantity >= parseInt(price.minimum) && quantity <= parseInt(price.maximum)
    );

    if (!priceRange) {
      return 0;
    }

    const pricePer = parseInt(priceRange.pricing_per);
    const price = parseFloat(priceRange.price);
    return (quantity / pricePer) * price;
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
    return pattern ? pattern.test(url) : true; // Default to true for unknown platforms
  }
}

export const apiService = new ApiService();