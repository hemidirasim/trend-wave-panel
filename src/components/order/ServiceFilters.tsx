
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Instagram, Youtube, Facebook, Heart, Users, Eye, Share, MessageCircle, Repeat, Star } from 'lucide-react';
import { Service } from '@/types/api';
import { useState } from 'react';
import OrderForm from '@/components/order/OrderForm';
import { useSettings } from '@/contexts/SettingsContext';
import { calculatePrice } from '@/utils/priceCalculator';

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
  const [selectedGroupName, setSelectedGroupName] = useState<string>('');
  const { settings } = useSettings();

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

  // Calculate price with admin fees included
  const calculatePriceWithFees = (service: Service, quantity: number = 1000): number => {
    return calculatePrice(service, quantity, settings.service_fee, settings.base_fee);
  };

  const handleServiceGroupSelect = (groupName: string, platform: string, groupServices: Service[]) => {
    console.log('Service group selected:', groupName, 'Platform:', platform);
    
    const groupKey = `${platform}-${groupName}`;
    
    // Toggle functionality - if already selected, close it
    if (selectedGroupName === groupKey) {
      setSelectedGroupName('');
      return;
    }
    
    // Set selected group name for showing the form
    setSelectedGroupName(groupKey);
    
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
      console.log('Cheapest service selected:', cheapestService.public_name);
      onServiceTypeChange(`${cheapestService.platform}-${cheapestService.id_service}`);
    }
  };

  const handleOrderSubmit = () => {
    if (onPlaceOrder) {
      // Create a mock event for the parent handler
      const mockEvent = {
        preventDefault: () => {},
        stopPropagation: () => {},
      } as React.FormEvent;
      onPlaceOrder(mockEvent);
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
            {Object.entries(getServiceGroups(platform))
              .sort(([, a], [, b]) => b.length - a.length)
              .map(([groupName, groupServices]) => {
              const IconComponent = getServiceTypeIcon(groupName);
              const groupKey = `${platform}-${groupName}`;
              const isSelected = selectedGroupName === groupKey;
              
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
                        // Find the cheapest service in the group
                        const cheapestService = groupServices
                          .filter(s => s.prices && s.prices.length > 0)
                          .sort((a, b) => {
                            const priceA = parseFloat(a.prices[0].price);
                            const priceB = parseFloat(b.prices[0].price);
                            return priceA - priceB;
                          })[0];
                        
                        if (cheapestService) {
                          // Calculate price with admin fees included
                          const finalPrice = calculatePriceWithFees(cheapestService, 1000);
                          return (
                            <div className="font-bold text-primary">
                              ${finalPrice.toFixed(2)}/1000
                            </div>
                          );
                        }
                        
                        return (
                          <div className="font-bold text-primary">
                            N/A
                          </div>
                        );
                      })()}
                    </div>
                  </button>
                  
                  {/* OrderForm seçilən xidmətin düz altında göstər */}
                  {isSelected && selectedService && formData && onUpdateFormData && onUpdateAdditionalParam && (
                    <div className="ml-4 p-4 bg-background rounded-lg border-l-4 border-primary">
                      <OrderForm
                        service={selectedService}
                        formData={formData}
                        errors={errors || {}}
                        onUpdateFormData={onUpdateFormData}
                        onUpdateAdditionalParam={onUpdateAdditionalParam}
                        onPlaceOrder={handleOrderSubmit}
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
