
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Instagram, Youtube, Facebook, Heart, Users, Eye, Share, MessageCircle, Repeat, Star, ChevronDown } from 'lucide-react';
import { Service } from '@/types/api';
import { useState } from 'react';

interface ServiceFiltersProps {
  services: Service[];
  selectedPlatform: string;
  selectedServiceType: string;
  onPlatformChange: (platform: string) => void;
  onServiceTypeChange: (serviceType: string) => void;
  allowedPlatforms: string[];
}

export function ServiceFilters({
  services,
  selectedPlatform,
  selectedServiceType,
  onPlatformChange,
  onServiceTypeChange,
  allowedPlatforms
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

  // Group services by type (Likes, Followers, Views, etc.)
  const getServiceTypeGroups = (platform: string) => {
    const platformServices = services.filter(service => 
      service.platform.toLowerCase() === platform.toLowerCase()
    );
    
    const groups: Record<string, Service[]> = {};
    
    platformServices.forEach(service => {
      const serviceType = getServiceTypeFromName(service.public_name);
      
      if (!groups[serviceType]) {
        groups[serviceType] = [];
      }
      groups[serviceType].push(service);
    });
    
    return groups;
  };

  const handleServiceTypeSelect = (serviceType: string, platform: string) => {
    // Find all services of this type for this platform
    const typeServices = services.filter(service => 
      service.platform.toLowerCase() === platform.toLowerCase() && 
      getServiceTypeFromName(service.public_name) === serviceType
    );
    
    // Sort by price and get the cheapest one
    const sortedServices = [...typeServices].sort((a, b) => {
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
            {Object.entries(getServiceTypeGroups(platform)).map(([serviceType, typeServices]) => {
              const IconComponent = getServiceTypeIcon(serviceType);
              
              return (
                <button
                  key={serviceType}
                  onClick={() => handleServiceTypeSelect(serviceType, platform)}
                  className={`w-full flex items-center justify-between p-4 bg-muted/50 hover:bg-muted/70 rounded-lg transition-colors border-2 ${
                    selectedServiceType.includes(serviceType) 
                      ? 'border-primary bg-primary/5' 
                      : 'border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className="w-5 h-5" />
                    <div className="text-left">
                      <span className="font-medium text-base">{serviceType}</span>
                      <div className="text-sm text-muted-foreground">
                        {typeServices.length} variant mövcuddur
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Ən ucuz qiymət</div>
                    {(() => {
                      const cheapestPrice = Math.min(
                        ...typeServices
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
              );
            })}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
