
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Service } from '@/types/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { ServiceItem } from './ServiceItem';
import { ServiceSortDropdown } from './ServiceSortDropdown';

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

  if (!selectedPlatform) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="pt-6">
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-4xl mb-4">📱</div>
            <p className="text-base font-medium">{t('service.selectPlatform')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!selectedServiceType) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="pt-6">
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-4xl mb-4">⚙️</div>
            <p className="text-base font-medium">{t('service.selectServiceType')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (sortedServices.length === 0) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="pt-6">
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-base font-medium">{t('service.noServicesFound')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="text-lg font-semibold text-card-foreground">
            {t('service.selectService')} *
          </span>
          <ServiceSortDropdown 
            priceFilter={priceFilter}
            onPriceFilterChange={onPriceFilterChange}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Select value={selectedServiceId} onValueChange={onServiceSelect}>
          <SelectTrigger className="w-full h-16 bg-background border-input hover:bg-accent/5 transition-colors text-left">
            <SelectValue 
              placeholder={t('service.selectServicePlaceholder')}
              className="text-sm text-muted-foreground"
            />
          </SelectTrigger>
          <SelectContent className="max-h-[28rem] bg-popover border-border shadow-xl z-50">
            <div className="max-h-96 overflow-y-auto">
              {sortedServices.map((service) => (
                <ServiceItem
                  key={service.id_service}
                  service={service}
                  calculateDisplayPrice={calculateDisplayPrice}
                />
              ))}
            </div>
          </SelectContent>
        </Select>
        
        {error && (
          <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive flex items-center">
              <span className="mr-2">⚠</span>
              {error}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
