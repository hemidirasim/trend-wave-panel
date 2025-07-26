import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';
import { Service } from '@/types/api';
import { useServiceNames } from '@/hooks/useServiceNames';
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
  const { getCustomServiceName, loading: namesLoading } = useServiceNames();
  const { t } = useLanguage();

  console.log('🔥 ServiceSelector: Component rendered with services count:', services.length);

  // Helper function to determine if a service is a comment service
  const isCommentService = (serviceName: string): boolean => {
    const name = serviceName.toLowerCase();
    return name.includes('comment') || name.includes('şərh');
  };

  // Filter services based on hierarchical selection
  const getFilteredServices = () => {
    if (!selectedServiceType) return [];
    
    // Check if it's a specific service selection (format: platform-serviceId)
    if (selectedServiceType.includes('-') && selectedServiceType.split('-').length === 2) {
      const [platform, serviceId] = selectedServiceType.split('-');
      return services.filter(service => 
        service.platform.toLowerCase() === platform.toLowerCase() && 
        service.id_service === serviceId
      );
    }
    
    // Fallback to general filtering (for backward compatibility)
    const platformMatch = selectedPlatform ? 
      services.filter(service => service.platform?.toLowerCase() === selectedPlatform.toLowerCase()) : 
      services;
    
    return platformMatch.filter(service => {
      const typeMatch = selectedServiceType ? 
        (service.type_name && service.type_name.toLowerCase().includes(selectedServiceType.toLowerCase())) ||
        service.public_name.toLowerCase().includes(selectedServiceType.toLowerCase()) : true;
      return typeMatch;
    });
  };

  const filteredServices = getFilteredServices();

  // Sort services by price
  const sortedServices = [...filteredServices].sort((a, b) => {
    if (!a.prices || !b.prices || a.prices.length === 0 || b.prices.length === 0) {
      return 0;
    }
    
    const priceA = parseFloat(a.prices[0].price);
    const priceB = parseFloat(b.prices[0].price);
    
    return priceFilter === 'low-to-high' ? priceA - priceB : priceB - priceA;
  });

  const calculateDisplayPrice = (service: Service): { price: string; unit: string } => {
    if (!service.prices || service.prices.length === 0) {
      return { price: '0.00', unit: '1000' };
    }

    const basePrice = parseFloat(service.prices[0].price);
    const pricingPer = parseFloat(service.prices[0].pricing_per);
    
    // For comment services, use appropriate quantity that fits their range
    const isComment = isCommentService(service.public_name);
    let displayQuantity = 1000;
    let displayUnit = '1000';
    
    if (isComment) {
      const minAmount = parseInt(service.amount_minimum);
      const maxAmount = service.prices[0].maximum ? parseInt(service.prices[0].maximum) : 1000;
      displayQuantity = Math.min(Math.max(minAmount, 10), maxAmount);
      displayUnit = displayQuantity.toString();
    }
    
    const totalCost = (basePrice / pricingPer) * displayQuantity;
    const serviceFee = (totalCost * serviceFeePercentage) / 100;
    const finalPrice = totalCost + serviceFee + baseFee;
    
    return {
      price: finalPrice.toFixed(2),
      unit: displayUnit
    };
  };

  const formatStartTime = (startTime?: string) => {
    if (!startTime) return '';
    
    const lowerTime = startTime.toLowerCase();
    
    // Instant/immediate start
    if (lowerTime.includes('instant') || lowerTime.includes('immediate') || lowerTime === '0') {
      return t('order.instantly');
    }
    
    // Hours
    if (lowerTime.includes('hour')) {
      const match = lowerTime.match(/(\d+)\s*hour/);
      if (match) {
        const hours = parseInt(match[1]);
        return `${hours} ${t('order.withinHours')}`;
      }
    }
    
    // Days
    if (lowerTime.includes('day')) {
      const match = lowerTime.match(/(\d+)\s*day/);
      if (match) {
        const days = parseInt(match[1]);
        return `${days} ${t('order.withinDays')}`;
      }
    }
    
    // Minutes
    if (lowerTime.includes('minute') || lowerTime.includes('min')) {
      const match = lowerTime.match(/(\d+)\s*(minute|min)/);
      if (match) {
        const minutes = parseInt(match[1]);
        return `${minutes} ${t('order.withinMinutes')}`;
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
        return `${t('order.perDay')} ${parseInt(amount).toLocaleString()}`;
      }
    }
    
    // Per hour
    if (lowerSpeed.includes('hour')) {
      const match = lowerSpeed.match(/(\d+[,\s]*\d*)\s*(?:per\s*)?hour/);
      if (match) {
        const amount = match[1].replace(/,/g, '');
        return `${t('order.perHour')} ${parseInt(amount).toLocaleString()}`;
      }
    }
    
    return speed;
  };

  if (!selectedPlatform) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t('order.platformSelect')}
      </div>
    );
  }

  if (!selectedServiceType) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t('order.serviceTypeSelect')}
      </div>
    );
  }

  if (sortedServices.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t('order.noServicesFound')}
      </div>
    );
  }

  // Always auto-select the cheapest service (first in sorted array)
  if (sortedServices.length > 0 && !selectedServiceId) {
    onServiceSelect(sortedServices[0].id_service.toString());
  }

  // Always show only the cheapest service as a single card
  const cheapestService = sortedServices[0];

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-sm sm:text-lg">
            {t('order.selectedService')}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg p-4 bg-primary/5 border-primary/20">
          {(() => {
            const service = cheapestService;
            const displayName = getCustomServiceName(service.public_name);
            const { price, unit } = calculateDisplayPrice(service);
            
            return (
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base leading-tight mb-2">
                      {displayName}
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs">
                        {unit} {t('order.perUnit')}
                      </span>
                      {service.amount_minimum && (
                        <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs">
                          {t('order.minimum')}: {parseInt(service.amount_minimum).toLocaleString()}
                        </span>
                      )}
                      <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-md text-xs">
                        {t('order.cheapestOption')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      ${price}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {service.start_time && (
                    <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded-md text-xs">
                      {t('order.startTime')} {formatStartTime(service.start_time)}
                    </span>
                  )}
                  {service.speed && (
                    <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-xs">
                      {t('order.speed')} {formatSpeed(service.speed)}
                    </span>
                  )}
                </div>
                
                {service.description && (
                  <div className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md">
                    <p className="line-clamp-3">
                      {service.description}
                    </p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
        
        {error && (
          <p className="text-sm text-red-500 mt-2">
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
