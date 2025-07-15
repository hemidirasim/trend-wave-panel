
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, ArrowUpDown, Star } from 'lucide-react';
import { Service } from '@/types/api';
import { calculatePrice } from '@/utils/priceCalculator';

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

export function ServiceSelector({
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
}: ServiceSelectorProps) {
  const [expandedService, setExpandedService] = useState<string | null>(null);

  // Filter services based on selected platform and service type
  const filteredServices = services.filter(service => {
    if (!selectedPlatform) return false;
    
    const platformMatch = service.platform.toLowerCase() === selectedPlatform.toLowerCase();
    
    if (!selectedServiceType) return platformMatch;
    
    const serviceTypeFromName = getServiceTypeFromName(service.public_name);
    const typeMatch = service.type_name 
      ? service.type_name === selectedServiceType
      : serviceTypeFromName === selectedServiceType;
    
    return platformMatch && typeMatch;
  });

  // Sort services based on price filter
  const sortedServices = [...filteredServices].sort((a, b) => {
    if (!a.prices || !b.prices || a.prices.length === 0 || b.prices.length === 0) {
      return 0;
    }
    
    // Calculate price with fees for sorting
    const priceA = calculatePrice(a, parseInt(a.amount_minimum), serviceFeePercentage, baseFee);
    const priceB = calculatePrice(b, parseInt(b.amount_minimum), serviceFeePercentage, baseFee);
    
    return priceFilter === 'low-to-high' ? priceA - priceB : priceB - priceA;
  });

  const getServiceTypeFromName = (serviceName: string): string => {
    const name = serviceName.toLowerCase();
    if (name.includes('like') || name.includes('bəyən')) return 'Likes';
    if (name.includes('follow') || name.includes('izləyici')) return 'Followers';
    if (name.includes('view') || name.includes('baxış')) return 'Views';
    if (name.includes('share') || name.includes('paylaş')) return 'Shares';
    if (name.includes('comment') || name.includes('şərh')) return 'Comments';
    return 'Other';
  };

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      youtube: 'bg-red-500',
      instagram: 'bg-pink-500',
      tiktok: 'bg-purple-500',
      facebook: 'bg-blue-500',
      twitter: 'bg-sky-500',
      telegram: 'bg-blue-400',
      vimeo: 'bg-blue-600',
    };
    return colors[platform.toLowerCase()] || 'bg-gray-500';
  };

  if (!selectedPlatform || !selectedServiceType) {
    return null;
  }

  if (sortedServices.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Bu kateqoriya üçün xidmət tapılmadı.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Xidmət Seçimi</CardTitle>
            <CardDescription>
              {selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)} - {selectedServiceType}
            </CardDescription>
          </div>
          
          <Select value={priceFilter} onValueChange={onPriceFilterChange}>
            <SelectTrigger className="w-48">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low-to-high">Qiymət: Aşağıdan Yuxarı</SelectItem>
              <SelectItem value="high-to-low">Qiymət: Yuxarıdan Aşağı</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {sortedServices.map((service) => {
            const isSelected = selectedServiceId === service.id_service.toString();
            const minAmount = parseInt(service.amount_minimum);
            
            // Calculate price with current fees
            const priceWithFees = calculatePrice(service, minAmount, serviceFeePercentage, baseFee);
            
            console.log('🔥 ServiceSelector: Displaying service with fees:', {
              serviceName: service.public_name,
              minAmount,
              serviceFee: serviceFeePercentage,
              baseFee,
              priceWithFees
            });
            
            return (
              <Card
                key={service.id_service}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => onServiceSelect(service.id_service.toString())}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`${getPlatformColor(service.platform)} text-white`}>
                          {service.platform}
                        </Badge>
                        {service.quality && (
                          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                            <Star className="h-3 w-3 mr-1" />
                            {service.quality}
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="font-medium text-sm mb-1">{service.public_name}</h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        Min: {minAmount.toLocaleString()} | 
                        Max: {service.prices && service.prices[0] ? parseInt(service.prices[0].maximum).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">
                        ${priceWithFees.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {minAmount.toLocaleString()} üçün
                      </div>
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t">
                      <Button className="w-full" size="sm">
                        Seçildi ✓
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {error && (
          <p className="text-sm text-red-500 flex items-center mt-4">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
