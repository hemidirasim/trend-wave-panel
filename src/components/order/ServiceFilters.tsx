
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
    if (name.includes('like') || name.includes('bəyən')) return 'Like';
    if (name.includes('follow') || name.includes('izləyici')) return 'Followers';
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

  // Handle group click - if only one service, select it directly
  const handleGroupClick = (services: Service[], groupKey: string) => {
    if (services.length === 1) {
      // Directly select the single service
      handleServiceSelect(services[0]);
    } else {
      // Toggle the group as usual
      toggleGroup(groupKey);
    }
  };

  // Handle sub-group click - if only one service, select it directly
  const handleSubGroupClick = (subServices: Service[], subGroupKey: string) => {
    if (subServices.length === 1) {
      // Directly select the single service
      handleServiceSelect(subServices[0]);
    } else {
      // Toggle the sub-group as usual
      toggleGroup(subGroupKey);
    }
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
              const subGroups = getSubGroups(services);
              
              return (
                <Collapsible
                  key={groupKey}
                  open={openGroups[groupKey]}
                  onOpenChange={(isOpen) => {
                    if (services.length === 1) {
                      // If only one service, select it directly
                      handleServiceSelect(services[0]);
                    } else {
                      // Toggle the group
                      setOpenGroups(prev => ({
                        ...prev,
                        [groupKey]: isOpen
                      }));
                    }
                  }}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 hover:bg-muted/70 rounded-lg transition-colors">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4" />
                      <span className="font-medium">{mainType}</span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {services.length}
                      </span>
                    </div>
                    {services.length > 1 && (
                      <ChevronDown className={`w-4 h-4 transition-transform ${openGroups[groupKey] ? 'rotate-180' : ''}`} />
                    )}
                  </CollapsibleTrigger>
                  
                  {services.length > 1 && (
                    <CollapsibleContent className="space-y-2 mt-2 pl-4">
                      {Object.entries(subGroups).map(([subType, subServices]) => {
                        const subGroupKey = `${groupKey}-${subType}`;
                        
                        return (
                          <Collapsible
                            key={subGroupKey}
                            open={openGroups[subGroupKey]}
                            onOpenChange={(isOpen) => {
                              if (subServices.length === 1) {
                                // If only one service, select it directly
                                handleServiceSelect(subServices[0]);
                              } else {
                                // Toggle the sub-group
                                setOpenGroups(prev => ({
                                  ...prev,
                                  [subGroupKey]: isOpen
                                }));
                              }
                            }}
                          >
                            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 bg-background hover:bg-muted/30 rounded-md transition-colors border">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{subType}</span>
                                <span className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">
                                  {subServices.length}
                                </span>
                              </div>
                              {subServices.length > 1 && (
                                <ChevronDown className={`w-3 h-3 transition-transform ${openGroups[subGroupKey] ? 'rotate-180' : ''}`} />
                              )}
                            </CollapsibleTrigger>
                            
                            {subServices.length > 1 && (
                              <CollapsibleContent className="space-y-1 mt-1 pl-4">
                                {subServices.map((service) => (
                                  <button
                                    key={service.id_service}
                                    onClick={() => handleServiceSelect(service)}
                                    className={`w-full text-left p-2 text-sm rounded hover:bg-muted/50 transition-colors border-l-2 ${
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
                              </CollapsibleContent>
                            )}
                          </Collapsible>
                        );
                      })}
                    </CollapsibleContent>
                  )}
                </Collapsible>
              );
            })}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
