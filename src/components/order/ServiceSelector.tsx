import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';
import { Service } from '@/types/api';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { t } = useLanguage();

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
      return t('service.instant');
    }
    
    // Hours
    if (lowerTime.includes('hour')) {
      const match = lowerTime.match(/(\d+)\s*hour/);
      if (match) {
        const hours = parseInt(match[1]);
        return `${hours} ${t('service.hours')} ərzində`;
      }
    }
    
    // Days
    if (lowerTime.includes('day')) {
      const match = lowerTime.match(/(\d+)\s*day/);
      if (match) {
        const days = parseInt(match[1]);
        return `${days} ${t('service.days')} ərzində`;
      }
    }
    
    // Minutes
    if (lowerTime.includes('minute') || lowerTime.includes('min')) {
      const match = lowerTime.match(/(\d+)\s*(minute|min)/);
      if (match) {
        const minutes = parseInt(match[1]);
        return `${minutes} ${t('service.minutes')} ərzində`;
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
        return `${parseInt(amount).toLocaleString()} ${t('service.perDay')}`;
      }
    }
    
    // Per hour
    if (lowerSpeed.includes('hour')) {
      const match = lowerSpeed.match(/(\d+[,\s]*\d*)\s*(?:per\s*)?hour/);
      if (match) {
        const amount = match[1].replace(/,/g, '');
        return `${parseInt(amount).toLocaleString()} ${t('service.perHour')}`;
      }
    }
    
    return speed;
  };

  if (!selectedPlatform) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t('service.selectPlatform')}
      </div>
    );
  }

  if (!selectedServiceType) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t('service.selectServiceType')}
      </div>
    );
  }

  if (sortedServices.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t('service.noServicesFound')}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{t('service.selectService')} *</span>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            <Select value={priceFilter} onValueChange={onPriceFilterChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low-to-high">{t('service.sortLowToHigh')}</SelectItem>
                <SelectItem value="high-to-low">{t('service.sortHighToLow')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedServiceId} onValueChange={onServiceSelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('service.selectServicePlaceholder')} />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            {sortedServices.map((service) => (
              <SelectItem 
                key={service.id_service} 
                value={service.id_service.toString()}
                className="py-4"
              >
                <div className="flex flex-col w-full">
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="font-medium text-sm">{service.public_name}</span>
                    <div className="text-right ml-4">
                      <div className="font-bold text-primary text-lg">
                        ${calculateDisplayPrice(service)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        1000 {t('service.units')} {t('service.priceFor')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {service.amount_minimum && (
                      <span>• {t('service.minimumOrder')}: {parseInt(service.amount_minimum).toLocaleString()} {t('service.units')}</span>
                    )}
                    {service.start_time && (
                      <span>• {formatStartTime(service.start_time)}</span>
                    )}
                    {service.speed && (
                      <span>• {t('service.speed')}: {formatSpeed(service.speed)}</span>
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
