import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Service } from '@/types/api';
import { useLanguage } from '@/contexts/LanguageContext';

interface ServiceFiltersProps {
  services: Service[];
  selectedPlatform: string;
  selectedServiceType: string;
  onPlatformChange: (platform: string) => void;
  onServiceTypeChange: (serviceType: string) => void;
  allowedPlatforms: string[];
  selectedService: Service | null;
  formData: any;
  errors: any;
  onUpdateFormData: (field: string, value: any) => void;
  onUpdateAdditionalParam: (paramName: string, value: any) => void;
  onPlaceOrder: () => void;
  placing: boolean;
  calculatedPrice: number;
  serviceFeePercentage: number;
  baseFee: number;
  showOnlyFilters?: boolean;
}

export const ServiceFilters = ({ 
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
  showOnlyFilters = false
}: ServiceFiltersProps) => {
  const { t } = useLanguage();

  const getServiceTypeFromName = (serviceName: string): string => {
    const name = serviceName.toLowerCase();
    if (name.includes('like') || name.includes('bəyən')) return 'Likes';
    if (name.includes('follow') || name.includes('izləyici')) return 'Followers';
    if (name.includes('view') || name.includes('baxış')) return 'Views';
    if (name.includes('share') || name.includes('paylaş')) return 'Shares';
    if (name.includes('comment') || name.includes('şərh')) return 'Comments';
    return 'Other';
  };

  const getServiceTypes = () => {
    if (!selectedPlatform) return [];
    
    const platformServices = services.filter(service => 
      service.platform.toLowerCase() === selectedPlatform.toLowerCase()
    );
    
    const types = [...new Set(platformServices.map(service => {
      return service.type_name && service.type_name.trim() !== '' 
        ? service.type_name 
        : getServiceTypeFromName(service.public_name);
    }))];
    
    return types.filter(type => type);
  };

  if (showOnlyFilters) {
    return (
      <>
        {/* Platform Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Platform</label>
          <Select value={selectedPlatform} onValueChange={onPlatformChange}>
            <SelectTrigger>
              <SelectValue placeholder="Platform seçin" />
            </SelectTrigger>
            <SelectContent>
              {allowedPlatforms.map((platform) => (
                <SelectItem key={platform} value={platform}>
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Service Type Selection */}
        {selectedPlatform && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Xidmət Növü</label>
            <Select value={selectedServiceType} onValueChange={onServiceTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Xidmət növünü seçin" />
              </SelectTrigger>
              <SelectContent>
                {getServiceTypes().map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="space-y-6">
      {/* Platform Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t('order.platform')}</label>
        <Select value={selectedPlatform} onValueChange={onPlatformChange}>
          <SelectTrigger>
            <SelectValue placeholder={t('order.selectPlatform')} />
          </SelectTrigger>
          <SelectContent>
            {allowedPlatforms.map((platform) => (
              <SelectItem key={platform} value={platform}>
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Service Type Selection */}
      {selectedPlatform && (
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('order.serviceType')}</label>
          <Select value={selectedServiceType} onValueChange={onServiceTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder={t('order.selectServiceType')} />
            </SelectTrigger>
            <SelectContent>
              {getServiceTypes().map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* URL Input */}
      {selectedService && (
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="url">{t('order.url')}</label>
          <input
            type="url"
            id="url"
            className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-primary/30"
            placeholder={t('order.urlPlaceholder')}
            value={formData.url}
            onChange={(e) => onUpdateFormData('url', e.target.value)}
          />
          {errors.url && <p className="text-sm text-red-500">{errors.url}</p>}
        </div>
      )}

      {/* Quantity Input */}
      {selectedService && (
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="quantity">{t('order.quantity')}</label>
          <input
            type="number"
            id="quantity"
            className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-primary/30"
            placeholder={t('order.quantityPlaceholder')}
            value={formData.quantity}
            onChange={(e) => onUpdateFormData('quantity', e.target.value)}
          />
          {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
        </div>
      )}

      {/* Additional Parameters */}
      {selectedService && selectedService.params && selectedService.params.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t('order.additionalParams')}</h3>
          {selectedService.params.map((param) => (
            <div key={param.name} className="space-y-2">
              <label className="text-sm font-medium" htmlFor={param.name}>{param.name}</label>
              <input
                type="text"
                id={param.name}
                className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-primary/30"
                placeholder={param.placeholder || param.name}
                value={formData.additionalParams[param.name] || ''}
                onChange={(e) => onUpdateAdditionalParam(param.name, e.target.value)}
              />
              {errors[param.name] && <p className="text-sm text-red-500">{errors[param.name]}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
