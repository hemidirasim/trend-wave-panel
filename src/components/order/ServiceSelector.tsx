
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown, Clock, Zap, Users, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Service } from '@/types/api';
import { useServiceNames } from '@/hooks/useServiceNames';

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
  const { getCustomServiceName } = useServiceNames();

  console.log('🔥 ServiceSelector: Component rendered with services count:', services.length);

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
    if (!startTime) return 'N/A';
    
    const lowerTime = startTime.toLowerCase();
    
    if (lowerTime.includes('instant') || lowerTime.includes('immediate') || lowerTime === '0') {
      return 'Dərhal';
    }
    
    if (lowerTime.includes('hour')) {
      const match = lowerTime.match(/(\d+)\s*hour/);
      if (match) {
        const hours = parseInt(match[1]);
        return `${hours} saat`;
      }
    }
    
    if (lowerTime.includes('day')) {
      const match = lowerTime.match(/(\d+)\s*day/);
      if (match) {
        const days = parseInt(match[1]);
        return `${days} gün`;
      }
    }
    
    if (lowerTime.includes('minute') || lowerTime.includes('min')) {
      const match = lowerTime.match(/(\d+)\s*(minute|min)/);
      if (match) {
        const minutes = parseInt(match[1]);
        return `${minutes} dəqiqə`;
      }
    }
    
    return startTime;
  };

  const formatSpeed = (speed?: string) => {
    if (!speed) return 'N/A';
    
    const lowerSpeed = speed.toLowerCase();
    
    if (lowerSpeed.includes('day')) {
      const match = lowerSpeed.match(/(\d+[,\s]*\d*)\s*(?:per\s*)?day/);
      if (match) {
        const amount = match[1].replace(/,/g, '');
        return `${parseInt(amount).toLocaleString()}/gün`;
      }
    }
    
    if (lowerSpeed.includes('hour')) {
      const match = lowerSpeed.match(/(\d+[,\s]*\d*)\s*(?:per\s*)?hour/);
      if (match) {
        const amount = match[1].replace(/,/g, '');
        return `${parseInt(amount).toLocaleString()}/saat`;
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
          <span className="text-sm sm:text-lg">Xidmət seçin *</span>
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
        {/* Mobile View - Cards */}
        <div className="block sm:hidden space-y-4">
          {sortedServices.map((service) => {
            const displayName = getCustomServiceName(service.public_name);
            const isSelected = selectedServiceId === service.id_service.toString();
            
            return (
              <Card 
                key={service.id_service} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                }`}
                onClick={() => onServiceSelect(service.id_service.toString())}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-sm line-clamp-2">{displayName}</h3>
                    <div className="text-right ml-2">
                      <div className="text-lg font-bold text-primary">
                        ${calculateDisplayPrice(service)}
                      </div>
                      <div className="text-xs text-muted-foreground">1000 üçün</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatStartTime(service.start_time)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      <span>{formatSpeed(service.speed)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>Min: {parseInt(service.amount_minimum || '0').toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>Max: {parseInt(service.prices?.[0]?.maximum || '0').toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-3" 
                    size="sm"
                    variant={isSelected ? "default" : "outline"}
                  >
                    {isSelected ? 'Seçildi' : 'Seç'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden sm:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium text-sm">Xidmət</th>
                  <th className="text-center py-3 px-2 font-medium text-sm">
                    <div className="flex items-center justify-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      Qiymət
                    </div>
                  </th>
                  <th className="text-center py-3 px-2 font-medium text-sm">
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="h-4 w-4" />
                      Başlama
                    </div>
                  </th>
                  <th className="text-center py-3 px-2 font-medium text-sm">
                    <div className="flex items-center justify-center gap-1">
                      <Zap className="h-4 w-4" />
                      Sürət
                    </div>
                  </th>
                  <th className="text-center py-3 px-2 font-medium text-sm">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="h-4 w-4" />
                      Hədd
                    </div>
                  </th>
                  <th className="text-center py-3 px-2 font-medium text-sm">Əməliyyat</th>
                </tr>
              </thead>
              <tbody>
                {sortedServices.map((service) => {
                  const displayName = getCustomServiceName(service.public_name);
                  const isSelected = selectedServiceId === service.id_service.toString();
                  
                  return (
                    <tr 
                      key={service.id_service} 
                      className={`border-b hover:bg-muted/50 transition-colors ${
                        isSelected ? 'bg-primary/5 border-primary/20' : ''
                      }`}
                    >
                      <td className="py-4 px-2">
                        <div>
                          <div className="font-medium text-sm line-clamp-2 mb-1">{displayName}</div>
                          {service.description && (
                            <div className="text-xs text-muted-foreground line-clamp-1">
                              {service.description}
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="py-4 px-2 text-center">
                        <div className="font-bold text-lg text-primary">
                          ${calculateDisplayPrice(service)}
                        </div>
                        <div className="text-xs text-muted-foreground">1000 üçün</div>
                      </td>
                      
                      <td className="py-4 px-2 text-center">
                        <Badge variant="outline" className="text-xs">
                          {formatStartTime(service.start_time)}
                        </Badge>
                      </td>
                      
                      <td className="py-4 px-2 text-center">
                        <Badge variant="outline" className="text-xs">
                          {formatSpeed(service.speed)}
                        </Badge>
                      </td>
                      
                      <td className="py-4 px-2 text-center">
                        <div className="text-xs">
                          <div>Min: {parseInt(service.amount_minimum || '0').toLocaleString()}</div>
                          <div>Max: {parseInt(service.prices?.[0]?.maximum || '0').toLocaleString()}</div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-2 text-center">
                        <Button 
                          size="sm"
                          variant={isSelected ? "default" : "outline"}
                          onClick={() => onServiceSelect(service.id_service.toString())}
                        >
                          {isSelected ? 'Seçildi' : 'Seç'}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        {error && (
          <p className="text-sm text-red-500 mt-4">
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
