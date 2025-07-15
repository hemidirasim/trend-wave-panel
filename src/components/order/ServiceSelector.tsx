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
  serviceFeePercentage: number;
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

    // Sort services by calculated final price (including percentage fee and base fee)
    const sortedServices = [...filtered].sort((a, b) => {
      const priceA = proxyApiService.calculatePrice(a, 1000, serviceFeePercentage, 0); // Base fee will be added in context
      const priceB = proxyApiService.calculatePrice(b, 1000, serviceFeePercentage, 0);
      
      return priceFilter === 'low-to-high' ? priceA - priceB : priceB - priceA;
    });

    return sortedServices;
  };

  const formatPriceDisplay = (service: Service) => {
    // Check if service has valid price data
    if (!service.prices || service.prices.length === 0) {
      return 'Qiymət yoxdur';
    }

    // Use a standard quantity of 1000 for price comparison
    const totalPrice = proxyApiService.calculatePrice(service, 1000, serviceFeePercentage, 0); // Base fee handled in context
    const pricingPer = service.prices[0]?.pricing_per || '1000';

    if (totalPrice === 0) {
      // Fallback to showing the raw price if calculation fails
      const rawPrice = parseFloat(service.prices[0]?.price || '0');
      if (rawPrice > 0) {
        const fallbackPrice = rawPrice + (rawPrice * serviceFeePercentage / 100);
        return `$${fallbackPrice.toFixed(2)}/${pricingPer}`;
      }
      return 'Qiymət hesablanmadı';
    }
    
    return `$${totalPrice.toFixed(2)}/${pricingPer}`;
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
                <div className="flex items-center justify-between w-full">
                  <span className="flex-1">{service.public_name}</span>
                  <Badge variant="secondary" className="ml-2 shrink-0">
                    {formatPriceDisplay(service)}
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
