
import { supabase } from "@/integrations/supabase/client";
import { Service, OrderResponse, OrderStatus, Submission } from "@/types/api";

class ApiClient {
  private async makeRequest(requestData: any): Promise<any> {
    try {
      console.log('Making request via Social Media API:', requestData);
      
      const { data, error } = await supabase.functions.invoke('social-media-api', {
        body: requestData,
      });

      if (error) {
        console.error('Social Media API Error:', error);
        throw new Error(`API error: ${error.message}`);
      }

      console.log('Social Media API Response:', data);
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
      
      // First try to get from all services list
      const allServices = await this.getServices();
      const serviceFromList = allServices.find(s => s.id_service.toString() === serviceId);
      
      if (serviceFromList) {
        console.log('Service found in services list:', {
          id: serviceFromList.id_service,
          name: serviceFromList.public_name,
          price: serviceFromList.prices?.[0]?.price
        });
        return serviceFromList;
      }
      
      // If not found, try the individual service API
      const data = await this.makeRequest({ 
        action: 'service',
        id_service: serviceId
      });
      
      console.log('Service details API response:', data);
      
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
      
      // Store the external order ID for status tracking
      if (data && data.id_service_submission) {
        console.log('Order placed successfully with external ID:', data.id_service_submission);
      }
      
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
}

export const apiClient = new ApiClient();
