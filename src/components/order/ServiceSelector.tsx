
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';
import { Service } from '@/types/api';
import { proxyApiService } from '@/components/ProxyApiService';

interface ServiceSelectorProps {
  services: Service[];
  selectedPlatform: string;
  selectedServiceType: string;
  selectedServiceId: string;
  priceFilter: 'low-to-high' | 'high-to-low';
  serviceFee: number;
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
  serviceFee,
  onServiceSelect,
  onPriceFilterChange,
  error
}: ServiceSelectorProps) {
  const getServiceTypeFromName = (serviceName: string): string => {
    const name = serviceName.toLowerCase();
    if (name.includes('like') || name.includes('bəyən')) return 'Likes';
    if (name.includes('follow') || name.includes('izləyici')) return 'Followers';
    if (name.includes('view') || name.includes('baxış')) return 'Views';
    if (name.includes('share') || name.includes('paylaş')) return 'Shares';
    if (name.includes('comment') || name.includes('şərh')) return 'Comments';
    if (name.includes('repost') || name.includes('retweet')) return 'Reposts';
    return 'Other';
  };

  const getFilteredServices = () => {
    let filtered = services.filter(service => {
      if (!service.platform || service.platform.toLowerCase() !== selectedPlatform) {
        return false;
      }
      
      const serviceType = service.type_name && service.type_name.trim() !== '' 
        ? service.type_name 
        : getServiceTypeFromName(service.public_name);
      return serviceType === selectedServiceType;
    });

    // Apply price filter - including service fee in the calculation
    const sortedServices = [...filtered].sort((a, b) => {
      const priceA = proxyApiService.calculatePrice(a, 1000, serviceFee);
      const priceB = proxyApiService.calculatePrice(b, 1000, serviceFee);
      
      console.log('🔥 Filtered services price sorting:', {
        serviceA: a.public_name,
        priceA,
        serviceB: b.public_name,
        priceB,
        appliedServiceFee: serviceFee,
        filter: priceFilter
      });
      
      return priceFilter === 'low-to-high' ? priceA - priceB : priceB - priceA;
    });

    return sortedServices;
  };

  const getDisplayPrice = (service: Service) => {
    const basePricePer = parseInt(service.prices[0]?.pricing_per || '1000');
    // Calculate price with service fee included
    const finalPriceForBase = proxyApiService.calculatePrice(service, basePricePer, serviceFee);
    const pricePerUnit = finalPriceForBase / basePricePer;
    
    console.log('🔥 Display price calculation (with service fee included):', {
      serviceName: service.public_name,
      basePricePer,
      serviceFee,
      finalPriceForBase,
      pricePerUnit: pricePerUnit
    });
    
    return pricePerUnit;
  };

  if (!selectedPlatform || !selectedServiceType) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Price filter */}
      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Label className="text-sm font-medium">Qiymətə görə sırala:</Label>
        <Select value={priceFilter} onValueChange={onPriceFilterChange}>
          <SelectTrigger className="w-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low-to-high">Ucuzdan bahaya</SelectItem>
            <SelectItem value="high-to-low">Bahadan ucuza</SelectItem>
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onPriceFilterChange('low-to-high')}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Service selection */}
      <div className="space-y-2">
        <Label>Xidmət seçin *</Label>
        <Select value={selectedServiceId} onValueChange={onServiceSelect}>
          <SelectTrigger className={error ? 'border-red-500' : ''}>
            <SelectValue placeholder="Xidmət seçin" />
          </SelectTrigger>
          <SelectContent>
            {getFilteredServices().map(service => (
              <SelectItem key={service.id_service} value={service.id_service.toString()}>
                <div className="flex items-center space-x-2">
                  <span>{service.public_name}</span>
                  <Badge variant="secondary" className="ml-2">
                    ${proxyApiService.formatPrice(getDisplayPrice(service).toString())}/{service.prices[0]?.pricing_per || '1K'}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {getFilteredServices().length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          Bu növə uyğun xidmət tapılmadı
        </div>
      )}
    </div>
  );
}
