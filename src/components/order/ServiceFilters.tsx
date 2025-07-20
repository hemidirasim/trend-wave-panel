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

  // Extract service base name (before first dash)
  const getServiceBaseName = (serviceName: string): string => {
    const dashIndex = serviceName.indexOf(' - ');
    if (dashIndex !== -1) {
      return serviceName.substring(0, dashIndex).trim();
    }
    return serviceName;
  };

  const getServiceGroups = (platform: string) => {
    const platformServices = services.filter(service => 
      service.platform.toLowerCase() === platform.toLowerCase()
    );
    
    const groups: Record<string, Service[]> = {};
    
    platformServices.forEach(service => {
      // Use base name (before first dash) as the group key
      const baseName = getServiceBaseName(service.public_name);
      
      if (!groups[baseName]) {
        groups[baseName] = [];
      }
      groups[baseName].push(service);
    });
    
    return groups;
  };

  const getSubGroups = (services: Service[]) => {
    const subGroups: Record<string, Service[]> = {};
    
    services.forEach(service => {
      const name = service.public_name.toLowerCase();
      let subType = 'Other';
      
      // Extract the part after the dash as sub-type
      const dashIndex = service.public_name.indexOf(' - ');
      if (dashIndex !== -1) {
        subType = service.public_name.substring(dashIndex + 3).trim();
        // Clean up common patterns
        subType = subType.replace(/^\[|\]$/g, ''); // Remove brackets
      } else {
        // Fallback to old logic if no dash
        if (service.platform.toLowerCase() === 'instagram') {
          if (name.includes('post') && name.includes('like')) subType = 'Post Likes';
          else if (name.includes('comment') && name.includes('like')) subType = 'Comment Likes';
          else if (name.includes('story') && name.includes('like')) subType = 'Story Likes';
          else if (name.includes('reel') && name.includes('like')) subType = 'Reel Likes';
          else if (name.includes('video') && name.includes('like')) subType = 'Video Likes';
          else if (name.includes('like')) subType = 'General Likes';
          else if (name.includes('follow')) subType = 'Followers';
          else if (name.includes('view')) subType = 'Views';
          else if (name.includes('comment') && !name.includes('like')) subType = 'Comments';
        }
        else if (service.platform.toLowerCase() === 'youtube') {
          if (name.includes('subscribe')) subType = 'Subscribers';
          else if (name.includes('like')) subType = 'Likes';
          else if (name.includes('view')) subType = 'Views';
          else if (name.includes('comment')) subType = 'Comments';
          else if (name.includes('share')) subType = 'Shares';
        }
      }
      
      if (!subGroups[subType]) {
        subGroups[subType] = [];
      }
      subGroups[subType].push(service);
    });
    
    return subGroups;
  };

  const toggleGroup = (groupKey: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  const handleServiceSelect = (service: Service) => {
    // Set the service type to the specific service ID or name for filtering
    onServiceTypeChange(`${service.platform}-${service.id_service}`);
  };

  const handleGroupClick = (mainType: string, services: Service[], platform: string) => {
    // Check if we have only one service - if so, select it directly
    if (services.length === 1) {
      handleServiceSelect(services[0]);
      return;
    }

    // Check if we have multiple services - analyze subgroups
    const subGroups = getSubGroups(services);
    const subGroupKeys = Object.keys(subGroups);
    
    // If there's only one sub-group with one service, select directly
    if (subGroupKeys.length === 1 && subGroups[subGroupKeys[0]].length === 1) {
      const singleService = subGroups[subGroupKeys[0]][0];
      handleServiceSelect(singleService);
      return;
    }
    
    // Otherwise toggle the group
    const groupKey = `${platform}-${mainType}`;
    toggleGroup(groupKey);
  };

  const handleSubGroupClick = (mainType: string, subType: string, subServices: Service[], platform: string) => {
    // If only one service, select it directly
    if (subServices.length === 1) {
      handleServiceSelect(subServices[0]);
      return;
    }
    
    // Otherwise toggle the sub-group
    const subGroupKey = `${platform}-${mainType}-${subType}`;
    toggleGroup(subGroupKey);
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
            {Object.entries(getServiceGroups(platform)).map(([mainType, services]) => {
              const groupKey = `${platform}-${mainType}`;
              const IconComponent = getServiceTypeIcon(mainType);
              const isGroupOpen = openGroups[groupKey];
              
              return (
                <div key={groupKey} className="border rounded-lg overflow-hidden">
                  <button
                    type="button"
                    className="flex items-center justify-between w-full p-3 bg-muted/50 hover:bg-muted/70 rounded-t-lg transition-colors text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                    onClick={() => handleGroupClick(mainType, services, platform)}
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4" />
                      <span className="font-medium">{mainType}</span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {services.length}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isGroupOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isGroupOpen && (
                    <div className="border-t bg-background">
                      {(() => {
                        const subGroups = getSubGroups(services);
                        return Object.entries(subGroups).map(([subType, subServices]) => {
                          const subGroupKey = `${groupKey}-${subType}`;
                          const isSubGroupOpen = openGroups[subGroupKey];
                          
                          return (
                            <div key={subGroupKey} className="border-b last:border-b-0">
                              <button
                                type="button"
                                className="flex items-center justify-between w-full p-3 hover:bg-muted/30 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                                onClick={() => handleSubGroupClick(mainType, subType, subServices, platform)}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{subType}</span>
                                  <span className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">
                                    {subServices.length}
                                  </span>
                                </div>
                                {subServices.length > 1 && (
                                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isSubGroupOpen ? 'rotate-180' : ''}`} />
                                )}
                              </button>
                              
                              {subServices.length > 1 && isSubGroupOpen && (
                                <div className="bg-muted/20">
                                  {subServices.map((service) => (
                                    <button
                                      key={service.id_service}
                                      type="button"
                                      onClick={() => handleServiceSelect(service)}
                                      className={`w-full text-left p-3 text-sm hover:bg-muted/50 transition-colors border-l-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset ${
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
                        })
                      })()}
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
