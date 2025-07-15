
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Mövcud Xidmətlər</h3>
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedServices.map((service) => (
          <Card
            key={service.id_service}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedServiceId === service.id_service.toString()
                ? 'ring-2 ring-primary border-primary'
                : 'hover:border-primary/50'
            }`}
            onClick={() => onServiceSelect(service.id_service.toString())}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base line-clamp-2">
                  {service.public_name}
                </CardTitle>
                {service.platform && (
                  <Badge variant="secondary" className="ml-2 shrink-0 capitalize">
                    {service.platform}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {service.description && (
                <CardDescription className="text-sm mb-3 line-clamp-2">
                  {service.description}
                </CardDescription>
              )}
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-primary">
                    ${calculateDisplayPrice(service)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    1000 ədəd üçün
                  </span>
                  {service.amount_minimum && (
                    <span className="text-xs text-muted-foreground mt-1">
                      Min: {parseInt(service.amount_minimum).toLocaleString()}
                    </span>
                  )}
                </div>
                <Button
                  variant={selectedServiceId === service.id_service.toString() ? "default" : "outline"}
                  size="sm"
                >
                  {selectedServiceId === service.id_service.toString() ? 'Seçilib' : 'Seç'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
