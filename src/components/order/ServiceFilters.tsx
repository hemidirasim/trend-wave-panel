import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Instagram, Youtube, Facebook, Heart, Users, Eye, Share, MessageCircle, Repeat, Star } from 'lucide-react';
import { Service } from '@/types/api';

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
      'Likes': Heart,
      'Followers': Users,
      'Views': Eye,
      'Shares': Share,
      'Comments': MessageCircle,
      'Reposts': Repeat,
      'Other': Star,
    };
    return icons[type] || Star;
  };

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

  const getUniquePlatforms = () => {
    const platforms = services
      .map(service => service.platform.toLowerCase())
      .filter(platform => allowedPlatforms.includes(platform));
    return [...new Set(platforms)];
  };

  const getUniqueServiceTypes = (platform: string) => {
    const platformServices = services.filter(service => 
      service.platform.toLowerCase() === platform.toLowerCase()
    );
    
    const types = platformServices.map(service => {
      return service.type_name && service.type_name.trim() !== '' 
        ? service.type_name 
        : getServiceTypeFromName(service.public_name);
    });
    
    return [...new Set(types)];
  };

  return (
    <div className="space-y-4">
      <Label>Platform Seçin *</Label>
      
      <Tabs value={selectedPlatform} onValueChange={onPlatformChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          {getUniquePlatforms().map((platform) => {
            const IconComponent = getPlatformIcon(platform);
            return (
              <TabsTrigger key={platform} value={platform} className="capitalize flex items-center gap-2">
                {IconComponent && <IconComponent className="w-4 h-4" />}
                {platform}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {getUniquePlatforms().map((platform) => (
          <TabsContent key={platform} value={platform}>
            {/* Xidmət növü seçimi */}
            {selectedPlatform && (
              <div className="mb-6">
                <Label className="text-base font-medium mb-3 block">Xidmət növünü seçin *</Label>
                <ToggleGroup 
                  type="single" 
                  value={selectedServiceType} 
                  onValueChange={(value) => onServiceTypeChange(value || '')}
                  className="flex flex-wrap gap-2 justify-start"
                >
                  {getUniqueServiceTypes(selectedPlatform).map((type) => {
                    const IconComponent = getServiceTypeIcon(type);
                    return (
                      <ToggleGroupItem 
                        key={type} 
                        value={type}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all"
                        variant="outline"
                      >
                        <IconComponent className="w-4 h-4" />
                        {type}
                      </ToggleGroupItem>
                    );
                  })}
                </ToggleGroup>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}