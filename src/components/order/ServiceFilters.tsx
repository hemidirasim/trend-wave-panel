
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Instagram, Youtube, Facebook, Heart, Users, Eye, Share, MessageCircle, Repeat, Star, ChevronDown } from 'lucide-react';
import { Service } from '@/types/api';
import { useState } from 'react';
import OrderForm from '@/components/order/OrderForm';

interface ServiceFiltersProps {
  services: Service[];
  selectedPlatform: string;
  selectedServiceType: string;
  onPlatformChange: (platform: string) => void;
  onServiceTypeChange: (serviceType: string) => void;
  allowedPlatforms: string[];
  selectedService?: Service | null;
  formData?: any;
  errors?: Record<string, string>;
  onUpdateFormData?: (field: string, value: any) => void;
  onUpdateAdditionalParam?: (paramName: string, value: any) => void;
  onPlaceOrder?: (e: React.FormEvent) => void;
  placing?: boolean;
  calculatedPrice?: number;
  serviceFeePercentage?: number;
  baseFee?: number;
}

export function ServiceFilters({
  services,
  selectedPlatform,
  selectedServiceType,
  onPlatformChange,
  onServiceTypeChange,
  allowedPlatforms,
  selectedService,
  formData,
  errors,
  onUpdateFormData,
  onUpdateAdditionalParam,
  onPlaceOrder,
  placing,
  calculatedPrice,
  serviceFeePercentage,
  baseFee
}: ServiceFiltersProps) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, any> = {
      instagram: Instagram,
      youtube: Youtube,
      facebook: Facebook,
      tiktok: () => <div className="w-4 h-4 bg-current rounded-sm" />,
    };
    return icons[platform.toLowerCase()] || null;
  };

  const getServiceTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      'Like': Heart,
      'Likes': Heart,
      'Follow': Users,
      'Followers': Users,
      'View': Eye,
      'Views': Eye,
      'Share': Share,
      'Shares': Share,
      'Comment': MessageCircle,
      'Comments': MessageCircle,
      'Repost': Repeat,
      'Reposts': Repeat,
      'Other': Star,
    };
    return icons[type] || Star;
  };

  const getServiceTypeFromName = (serviceName: string): string => {
    const name = serviceName.toLowerCase();
    if (name.includes('like') || name.includes('bəyən')) return 'Likes';
    if (name.includes('follow') || name.includes('izləyici') || name.includes('subscriber')) return 'Followers';
    if (name.includes('view') || name.includes('baxış')) return 'Views';
    if (name.includes('share') || name.includes('paylaş')) return 'Shares';
    if (name.includes('comment') || name.includes('şərh')) return 'Comments';
    if (name.includes('repost') || name.includes('retweet')) return 'Reposts';
    return 'Other';
  };

  const getUniquePlatforms = () => {
    const platforms = services
      .map(service => service.platform.toLowerCase())
      .filter(platform => allowedPlatforms.includes(platform));
    return [...new Set(platforms)];
  };

  // Extract service base name (before first dash) for grouping
  const getServiceBaseName = (serviceName: string): string => {
    const dashIndex = serviceName.indexOf(' - ');
    if (dashIndex !== -1) {
      return serviceName.substring(0, dashIndex).trim();
    }
    return serviceName;
  };

  // Group services by their base names
  const getServiceGroups = (platform: string) => {
    const platformServices = services.filter(service => 
      service.platform.toLowerCase() === platform.toLowerCase()
    );
    
    const groups: Record<string, Service[]> = {};
    
    platformServices.forEach(service => {
      const baseName = getServiceBaseName(service.public_name);
      
      if (!groups[baseName]) {
        groups[baseName] = [];
      }
      groups[baseName].push(service);
    });
    
    return groups;
  };

  const handleServiceGroupSelect = (groupName: string, platform: string, groupServices: Service[]) => {
    // Sort by price and get the cheapest one
    const sortedServices = [...groupServices].sort((a, b) => {
      if (!a.prices || !b.prices || a.prices.length === 0 || b.prices.length === 0) {
        return 0;
      }
      const priceA = parseFloat(a.prices[0].price);
      const priceB = parseFloat(b.prices[0].price);
      return priceA - priceB;
    });
    
    if (sortedServices.length > 0) {
      const cheapestService = sortedServices[0];
      onServiceTypeChange(`${cheapestService.platform}-${cheapestService.id_service}`);
    }
  };

  const toggleGroup = (groupKey: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };


  return (
    <div className="space-y-4">
      <Tabs value={selectedPlatform} onValueChange={onPlatformChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6">
          {getUniquePlatforms().map((platform) => {
            const IconComponent = getPlatformIcon(platform);
            return (
              <TabsTrigger key={platform} value={platform} className="capitalize flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                {IconComponent && <IconComponent className="w-3 h-3 sm:w-4 sm:h-4" />}
                {platform}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {selectedPlatform && (
          <div className="mb-6">
            <Label className="text-base font-medium mb-3 block">Xidmət növünü seçin *</Label>
          </div>
        )}

        {getUniquePlatforms().map((platform) => (
          <TabsContent key={platform} value={platform} className="space-y-3">
            {Object.entries(getServiceGroups(platform))
              .sort(([, a], [, b]) => b.length - a.length) // Ən çox variantı olan üstdə
              .map(([groupName, groupServices]) => {
              const IconComponent = getServiceTypeIcon(groupName);
              const isSelected = selectedServiceType.includes(groupName);
              
              return (
                <div key={groupName} className="space-y-3">
                  <button
                    onClick={() => handleServiceGroupSelect(groupName, platform, groupServices)}
                    className={`w-full flex items-center justify-between p-4 bg-muted/50 hover:bg-muted/70 rounded-lg transition-colors border-2 ${
                      isSelected 
                        ? 'border-primary bg-primary/5' 
                        : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-5 h-5" />
                      <div className="text-left">
                        <span className="font-medium text-base">{groupName}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Ən ucuz qiymət</div>
                      {(() => {
                        const cheapestPrice = Math.min(
                          ...groupServices
                            .filter(s => s.prices && s.prices.length > 0)
                            .map(s => parseFloat(s.prices[0].price))
                        );
                        return (
                          <div className="font-bold text-primary">
                            ${cheapestPrice.toFixed(2)}/1000
                          </div>
                        );
                      })()}
                    </div>
                  </button>
                  
                  {/* OrderForm seçilən xidmətin altında göstər */}
                  {isSelected && selectedService && formData && onUpdateFormData && onUpdateAdditionalParam && onPlaceOrder && (
                    <div className="ml-4 p-4 bg-background rounded-lg border-l-4 border-primary">
                      <OrderForm
                        service={selectedService}
                        formData={formData}
                        errors={errors || {}}
                        onUpdateFormData={onUpdateFormData}
                        onUpdateAdditionalParam={onUpdateAdditionalParam}
                        onPlaceOrder={() => onPlaceOrder({} as React.FormEvent)}
                        placing={placing || false}
                        calculatedPrice={calculatedPrice || 0}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
