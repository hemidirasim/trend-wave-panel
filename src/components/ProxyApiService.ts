
import { apiClient } from "@/utils/apiClient";
import { calculatePrice, formatPrice } from "@/utils/priceCalculator";
import { validateUrl } from "@/utils/urlValidator";

// Re-export types for backward compatibility
export type { Service, OrderResponse, OrderStatus, Submission } from "@/types/api";

// Re-export the main API functions and utilities
export class ProxyApiService {
  async getServices() {
    return apiClient.getServices();
  }

  async getServiceDetails(serviceId: string) {
    return apiClient.getServiceDetails(serviceId);
  }

  async placeOrder(
    serviceId: string,
    url: string,
    quantity: number,
    additionalParams: Record<string, any> = {}
  ) {
    return apiClient.placeOrder(serviceId, url, quantity, additionalParams);
  }

  async getOrderStatus(orderId: string) {
    return apiClient.getOrderStatus(orderId);
  }

  async getAllSubmissions(limit = 100) {
    return apiClient.getAllSubmissions(limit);
  }

  async getFunds() {
    return apiClient.getFunds();
  }

  calculatePrice = calculatePrice;
  formatPrice = formatPrice;
  validateUrl = validateUrl;
}

export const proxyApiService = new ProxyApiService();
