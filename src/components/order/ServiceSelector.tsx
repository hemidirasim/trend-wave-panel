
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';
import { Service } from '@/types/api';

interface ServiceSelectorProps {
  services: Service[];
  selectedPlatform: string;
  selectedServiceType: string;
  selectedServiceId: string;
  priceFilter: 'low-to-high' | 'high-to-low';
  serviceFeePercentage: number;
  baseFee: number;
  onServiceSelect: (serviceId: string) => void;
  onPriceFilterChange: (filter: 'low-to-high' | 'high-to-low') => void;
  error?: string;
}

export const ServiceSelector = ({ 
  services, 
  selectedPlatform, 
  selectedServiceType, 
  selectedServiceId,
  priceFilter,
  serviceFeePercentage,
  baseFee,
  onServiceSelect, 
  onPriceFilterChange,
  error 
}: ServiceSelectorProps) => {
  // Filter services based on platform and service type
  const filteredServices = services.filter(service => {
    const platformMatch = selectedPlatform ? service.platform?.toLowerCase() === selectedPlatform.toLowerCase() : true;
    const typeMatch = selectedServiceType ? 
      (service.type_name && service.type_name.toLowerCase().includes(selectedServiceType.toLowerCase())) ||
      service.public_name.toLowerCase().includes(selectedServiceType.toLowerCase()) : true;
    return platformMatch && typeMatch;
  });

  // Sort services by price
  const sortedServices = [...filteredServices].sort((a, b) => {
    if (!a.prices || !b.prices || a.prices.length === 0 || b.prices.length === 0) {
      return 0;
    }
    
    const priceA = parseFloat(a.prices[0].price);
    const priceB = parseFloat(b.prices[0].price);
    
    return priceFilter === 'low-to-high' ? priceA - priceB : priceB - priceA;
  });

  const calculateDisplayPrice = (service: Service, quantity: number = 1000) => {
    if (!service.prices || service.prices.length === 0) {
      return '0.00';
    }

    const basePrice = parseFloat(service.prices[0].price);
    const totalCost = (basePrice / 1000) * quantity;
    const serviceFee = (totalCost * serviceFeePercentage) / 100;
    const finalPrice = totalCost + serviceFee + baseFee;
    
    return finalPrice.toFixed(2);
  };

  const formatServiceOption = (service: Service) => {
    const price = calculateDisplayPrice(service);
    const minAmount = service.amount_minimum ? parseInt(service.amount_minimum).toLocaleString() : '';
    return `${service.public_name} - $${price} (1000 ədəd üçün)${minAmount ? ` - Minimum sifariş: ${minAmount}` : ''}`;
  };

  if (!selectedPlatform) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Platform seçin
      </div>
    );
  }

  if (!selectedServiceType) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Xidmət növünü seçin
      </div>
    );
  }

  if (sortedServices.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Seçilmiş kriterlərə uyğun xidmət tapılmadı
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Xidmət seçin *</span>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            <Select value={priceFilter} onValueChange={onPriceFilterChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low-to-high">Qiymət: Azdan Çoxa</SelectItem>
                <SelectItem value="high-to-low">Qiymət: Çoxdan Aza</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedServiceId} onValueChange={onServiceSelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Xidmət seçin..." />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            {sortedServices.map((service) => (
              <SelectItem 
                key={service.id_service} 
                value={service.id_service.toString()}
                className="py-3"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{service.public_name}</span>
                  <span className="text-sm text-muted-foreground">
                    ${calculateDisplayPrice(service)} (1000 ədəd üçün)
                    {service.amount_minimum && (
                      <span className="ml-2">
                        • Minimum sifariş: {parseInt(service.amount_minimum).toLocaleString()}
                      </span>
                    )}
                  </span>
                  {service.description && (
                    <span className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {service.description}
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {error && (
          <p className="text-sm text-red-500 mt-2">
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
