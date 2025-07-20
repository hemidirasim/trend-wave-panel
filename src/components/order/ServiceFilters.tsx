
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

  const getUniquePlatforms = () => {
    const platforms = services
      .map(service => service.platform.toLowerCase())
      .filter(platform => allowedPlatforms.includes(platform));
    return [...new Set(platforms)];
  };

  const getServiceGroups = (platform: string) => {
    const platformServices = services.filter(service => 
      service.platform.toLowerCase() === platform.toLowerCase()
    );
    
    const groups: Record<string, Service[]> = {};
    
    platformServices.forEach(service => {
      let groupName = 'Other';
      const serviceName = service.public_name.toLowerCase();
      
      if (serviceName.includes('like') || serviceName.includes('bəyən')) {
        groupName = 'Likes';
      } else if (serviceName.includes('follow') || serviceName.includes('izləyici')) {
        groupName = 'Followers';
      } else if (serviceName.includes('view') || serviceName.includes('baxış')) {
        groupName = 'Views';
      } else if (serviceName.includes('share') || serviceName.includes('paylaş')) {
        groupName = 'Shares';
      } else if (serviceName.includes('comment') || serviceName.includes('şərh')) {
        groupName = 'Comments';
      }
      
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(service);
    });
    
    return groups;
  };

  const toggleGroup = (groupKey: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  const handleServiceSelect = (service: Service) => {
    onServiceTypeChange(`${service.platform}-${service.id_service}`);
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
            {Object.entries(getServiceGroups(platform)).map(([groupName, groupServices]) => {
              const groupKey = `${platform}-${groupName}`;
              const IconComponent = getServiceTypeIcon(groupName);
              const isOpen = openGroups[groupKey];
              
              return (
                <div key={groupKey} className="border rounded-lg overflow-hidden">
                  <button
                    type="button"
                    className="flex items-center justify-between w-full p-3 bg-muted/50 hover:bg-muted/70 transition-colors text-left"
                    onClick={() => toggleGroup(groupKey)}
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4" />
                      <span className="font-medium">{groupName}</span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {groupServices.length}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isOpen && (
                    <div className="border-t bg-background">
                      {groupServices.map((service) => (
                        <button
                          key={service.id_service}
                          type="button"
                          onClick={() => handleServiceSelect(service)}
                          className={`w-full text-left p-3 text-sm hover:bg-muted/50 transition-colors border-l-2 ${
                            selectedServiceType === `${service.platform}-${service.id_service}` 
                              ? 'border-l-primary bg-primary/5 text-primary font-medium' 
                              : 'border-l-transparent'
                          }`}
                        >
                          <div className="truncate">
                            {service.public_name}
                          </div>
                          {service.prices && service.prices[0] && (
                            <div className="text-xs text-muted-foreground mt-1">
                              ${service.prices[0].price}/1000
                            </div>
                          )}
                        </button>
                      ))}
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
