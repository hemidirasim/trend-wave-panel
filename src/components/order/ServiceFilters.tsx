import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Instagram, Youtube, Facebook, Heart, Users, Eye, Share, MessageCircle, Repeat, Star, Globe } from 'lucide-react';
import { Service } from '@/types/api';
import { useState } from 'react';
import OrderForm from '@/components/order/OrderForm';
import { useSettings } from '@/contexts/SettingsContext';
import { calculatePrice } from '@/utils/priceCalculator';
import { useLanguage } from '@/contexts/LanguageContext';

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
  onBuyClick?: (service: Service) => void;
  showOnlyFilters?: boolean;
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
  baseFee,
  onBuyClick,
  showOnlyFilters = false
}: ServiceFiltersProps) {
  const [selectedGroupName, setSelectedGroupName] = useState<string>('');
  const { settings } = useSettings();
  const { t } = useLanguage();

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, any> = {
      instagram: Instagram,
      youtube: Youtube,
      facebook: Facebook,
      tiktok: () => <div className="w-4 h-4 bg-current rounded-sm" />,
    };
    return icons[platform.toLowerCase()] || Globe;
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

  // Helper function to determine if a service is a comment service
  const isCommentService = (serviceName: string): boolean => {
    const name = serviceName.toLowerCase();
    return name.includes('comment') || name.includes('şərh');
  };

  // Calculate price with admin fees included - use appropriate default quantity
  const calculatePriceWithFees = (service: Service): number => {
    // Use service-specific default quantity
    let defaultQuantity = 1000;
    
    // For comment services, use a smaller default quantity that fits their range
    if (isCommentService(service.public_name) && service.prices && service.prices.length > 0) {
      const minAmount = parseInt(service.prices[0].minimum);
      const maxAmount = parseInt(service.prices[0].maximum);
      // Use a quantity that's within the service's range
      defaultQuantity = Math.min(Math.max(minAmount, 10), maxAmount);
    }
    
    return calculatePrice(service, defaultQuantity, settings.service_fee, settings.base_fee);
  };

  const handleServiceGroupSelect = (groupName: string, platform: string, groupServices: Service[]) => {
    console.log('Service group selected:', groupName, 'Platform:', platform);
    
    const groupKey = `${platform}-${groupName}`;
    
    // For showOnlyFilters mode, don't toggle - just set selection
    if (showOnlyFilters) {
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
      return;
    }

    // Toggle functionality for full mode - if already selected, close it
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

  // Modified handleOrderSubmit to NOT trigger auth dialog here
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
    <div className="space-y-6">
      {/* Platform Selection */}
      <div className="space-y-3">
        <Label className="text-base font-medium">{t('order.selectPlatform')}</Label>
        <Select value={selectedPlatform} onValueChange={onPlatformChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('order.platformPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {getUniquePlatforms().map((platform) => {
              const IconComponent = getPlatformIcon(platform);
              return (
                <SelectItem key={platform} value={platform} className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4" />
                    <span className="capitalize">{platform}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Service Types */}
      {selectedPlatform && (
        <div className="space-y-4">
          <Label className="text-base font-medium">{t('order.selectService')}</Label>
          
          <div className="space-y-3">
            {Object.entries(getServiceGroups(selectedPlatform))
              .sort(([, a], [, b]) => b.length - a.length)
              .map(([groupName, groupServices]) => {
              const IconComponent = getServiceTypeIcon(groupName);
              const groupKey = `${selectedPlatform}-${groupName}`;
              const isSelected = selectedGroupName === groupKey;
              
              return (
                <div key={groupName} className="space-y-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleServiceGroupSelect(groupName, selectedPlatform, groupServices);
                    }}
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
                    <div className="flex items-center gap-3">
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
                          const finalPrice = calculatePriceWithFees(cheapestService);
                          
                          // Show appropriate unit based on service type
                          const isComment = isCommentService(cheapestService.public_name);
                          const unit = isComment ? '10' : '1000';
                          
                          return (
                            <>
                              <div className="text-right mr-3">
                                <div className="font-bold text-primary">
                                  ${finalPrice.toFixed(2)}/{unit}
                                </div>
                              </div>
                              {showOnlyFilters && onBuyClick && (
                                <Button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onBuyClick(cheapestService);
                                  }}
                                  className="bg-primary hover:bg-primary/90"
                                  size="sm"
                                >
                                  Buy Now
                                </Button>
                              )}
                            </>
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
                  
                  {/* OrderForm - only show in full mode, not in showOnlyFilters mode */}
                  {!showOnlyFilters && isSelected && selectedService && formData && onUpdateFormData && onUpdateAdditionalParam && (
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
          </div>
        </div>
      )}
    </div>
  );
}
