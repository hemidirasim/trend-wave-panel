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

  const formatStartTime = (startTime?: string) => {
    if (!startTime) return '';
    
    const lowerTime = startTime.toLowerCase();
    
    // Instant/immediate start
    if (lowerTime.includes('instant') || lowerTime.includes('immediate') || lowerTime === '0') {
      return 'Dərhal başlanır';
    }
    
    // Hours
    if (lowerTime.includes('hour')) {
      const match = lowerTime.match(/(\d+)\s*hour/);
      if (match) {
        const hours = parseInt(match[1]);
        return `${hours} saat ərzində`;
      }
    }
    
    // Days
    if (lowerTime.includes('day')) {
      const match = lowerTime.match(/(\d+)\s*day/);
      if (match) {
        const days = parseInt(match[1]);
        return `${days} gün ərzində`;
      }
    }
    
    // Minutes
    if (lowerTime.includes('minute') || lowerTime.includes('min')) {
      const match = lowerTime.match(/(\d+)\s*(minute|min)/);
      if (match) {
        const minutes = parseInt(match[1]);
        return `${minutes} dəqiqə ərzində`;
      }
    }
    
    return startTime;
  };

  const formatSpeed = (speed?: string) => {
    if (!speed) return '';
    
    const lowerSpeed = speed.toLowerCase();
    
    // Per day
    if (lowerSpeed.includes('day')) {
      const match = lowerSpeed.match(/(\d+[,\s]*\d*)\s*(?:per\s*)?day/);
      if (match) {
        const amount = match[1].replace(/,/g, '');
        return `gündə ${parseInt(amount).toLocaleString()}`;
      }
    }
    
    // Per hour
    if (lowerSpeed.includes('hour')) {
      const match = lowerSpeed.match(/(\d+[,\s]*\d*)\s*(?:per\s*)?hour/);
      if (match) {
        const amount = match[1].replace(/,/g, '');
        return `saatda ${parseInt(amount).toLocaleString()}`;
      }
    }
    
    return speed;
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
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-base sm:text-lg">Xidmət seçin *</span>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            <Select value={priceFilter} onValueChange={onPriceFilterChange}>
              <SelectTrigger className="w-full sm:w-40 text-xs sm:text-sm">
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
          <SelectTrigger className="w-full min-h-[50px] sm:min-h-[60px]">
            <SelectValue placeholder="Xidmət seçin..." />
          </SelectTrigger>
          <SelectContent className="max-h-[70vh] sm:max-h-96 w-full">
            {sortedServices.map((service) => (
              <SelectItem 
                key={service.id_service} 
                value={service.id_service.toString()}
                className="py-4 sm:py-6 px-3 sm:px-4 min-h-[80px] sm:min-h-[100px] cursor-pointer hover:bg-muted/50"
              >
                <div className="flex flex-col w-full space-y-2 sm:space-y-3">
                  <div className="flex items-start justify-between w-full">
                    <div className="flex-1 pr-3 sm:pr-4">
                      <h3 className="font-semibold text-sm sm:text-base leading-tight mb-1 sm:mb-2 text-left">
                        {service.public_name}
                      </h3>
                      
                      <div className="flex flex-wrap gap-1 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                        <span className="bg-blue-50 text-blue-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs">
                          1000 ədəd üçün
                        </span>
                        {service.amount_minimum && (
                          <span className="bg-green-50 text-green-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs">
                            Min: {parseInt(service.amount_minimum).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg sm:text-2xl font-bold text-primary">
                        ${calculateDisplayPrice(service)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 sm:gap-2 text-xs text-muted-foreground">
                    {service.start_time && (
                      <span className="bg-orange-50 text-orange-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs">
                        🚀 {formatStartTime(service.start_time)}
                      </span>
                    )}
                    {service.speed && (
                      <span className="bg-purple-50 text-purple-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs">
                        ⚡ {formatSpeed(service.speed)}
                      </span>
                    )}
                  </div>
                  
                  {service.description && (
                    <div className="text-xs sm:text-sm text-muted-foreground bg-gray-50 p-2 sm:p-3 rounded-md mt-1 sm:mt-2">
                      <p className="line-clamp-2 sm:line-clamp-3 text-left">
                        {service.description}
                      </p>
                    </div>
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
