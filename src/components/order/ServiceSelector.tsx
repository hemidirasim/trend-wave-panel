import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';
import { Service } from '@/types/api';
import { useCurrency } from '@/contexts/CurrencyContext';

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
  const { currency, convertAmount, formatAmount, loading: currencyLoading } = useCurrency();
  const [convertedPrices, setConvertedPrices] = useState<Map<string, number>>(new Map());

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

  useEffect(() => {
    const convertServicePrices = async () => {
      const priceMap = new Map<string, number>();
      
      for (const service of filteredServices) {
        if (service.prices && service.prices.length > 0) {
          const basePrice = parseFloat(service.prices[0].price);
          const totalCost = (basePrice / 1000) * 1000;
          const serviceFee = (totalCost * serviceFeePercentage) / 100;
          const finalPriceUSD = totalCost + serviceFee + baseFee;
          
          const convertedPrice = await convertAmount(finalPriceUSD, 'USD');
          priceMap.set(service.id_service.toString(), convertedPrice);
        }
      }
      
      setConvertedPrices(priceMap);
    };

    if (filteredServices.length > 0) {
      convertServicePrices();
    }
  }, [filteredServices, currency, serviceFeePercentage, baseFee, convertAmount]);

  const getDisplayPrice = (service: Service): string => {
    const serviceId = service.id_service.toString();
    const convertedPrice = convertedPrices.get(serviceId);
    
    if (currencyLoading || convertedPrice === undefined) {
      return '...';
    }
    
    return formatAmount(convertedPrice);
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
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Xidmət seçin *</span>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            <Select value={priceFilter} onValueChange={onPriceFilterChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-50 bg-background border shadow-lg pointer-events-auto">
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
          <SelectContent className="max-h-80 z-50 bg-background border shadow-lg pointer-events-auto">
            {sortedServices.map((service) => (
              <SelectItem 
                key={service.id_service} 
                value={service.id_service.toString()}
                className="py-4"
              >
                <div className="flex flex-col w-full">
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-medium text-sm">{service.public_name}</span>
                    <span className="font-bold text-primary text-lg ml-4">
                      {getDisplayPrice(service)}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span>1000 ədəd üçün</span>
                    {service.amount_minimum && (
                      <span>• Minimum sifariş: {parseInt(service.amount_minimum).toLocaleString()}</span>
                    )}
                    {service.start_time && (
                      <span>• {formatStartTime(service.start_time)}</span>
                    )}
                    {service.speed && (
                      <span>• Sürət: {formatSpeed(service.speed)}</span>
                    )}
                  </div>
                  
                  {service.description && (
                    <span className="text-xs text-muted-foreground mt-1 line-clamp-2 max-w-full">
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
