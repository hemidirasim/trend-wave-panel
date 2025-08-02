
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Calculator, DollarSign, Loader2, Mail, ShoppingCart, User, Wallet } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Service } from '@/types/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { BalanceTopUpDialog } from '@/components/payment/BalanceTopUpDialog';

interface ServiceFiltersProps {
  services: Service[];
  selectedPlatform: string;
  selectedServiceType: string;
  onPlatformChange: (platform: string) => void;
  onServiceTypeChange: (serviceType: string) => void;
  allowedPlatforms: string[];
  selectedService: Service | null;
  formData?: {
    serviceId: string;
    url: string;
    quantity: string;
    email: string;
    additionalParams: Record<string, any>;
  };
  errors?: Record<string, string>;
  onUpdateFormData?: (field: string, value: any) => void;
  onUpdateAdditionalParam?: (paramName: string, value: any) => void;
  onPlaceOrder?: () => void;
  placing?: boolean;
  calculatedPrice?: number;
  serviceFeePercentage?: number;
  baseFee?: number;
  user?: any;
  userBalance?: number;
  balanceLoading?: boolean;
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
  errors = {},
  onUpdateFormData,
  onUpdateAdditionalParam,
  onPlaceOrder,
  placing = false,
  calculatedPrice = 0,
  serviceFeePercentage = 0,
  baseFee = 0,
  user,
  userBalance = 0,
  balanceLoading = false
}: ServiceFiltersProps) {
  const { t } = useLanguage();

  // Get unique platforms for the dropdown
  const platforms = allowedPlatforms.map(platform => ({
    value: platform,
    label: platform.charAt(0).toUpperCase() + platform.slice(1)
  }));

  // Get service types for selected platform
  const serviceTypes = selectedPlatform ? 
    [...new Set(services
      .filter(service => service.platform.toLowerCase() === selectedPlatform)
      .map(service => service.type_name && service.type_name.trim() !== '' ? service.type_name : getServiceTypeFromName(service.public_name))
    )].filter(Boolean) : [];

  // Get services for selected platform and service type
  const availableServices = selectedPlatform && selectedServiceType ? 
    services.filter(service => {
      const servicePlatform = service.platform.toLowerCase() === selectedPlatform;
      const serviceType = service.type_name && service.type_name.trim() !== '' ? service.type_name : getServiceTypeFromName(service.public_name);
      return servicePlatform && serviceType === selectedServiceType;
    }) : [];

  function getServiceTypeFromName(serviceName: string): string {
    const name = serviceName.toLowerCase();
    if (name.includes('like') || name.includes('bəyən')) return 'Likes';
    if (name.includes('follow') || name.includes('izləyici')) return 'Followers';
    if (name.includes('view') || name.includes('baxış')) return 'Views';
    if (name.includes('share') || name.includes('paylaş')) return 'Shares';
    if (name.includes('comment') || name.includes('şərh')) return 'Comments';
    return 'Other';
  }

  const quantityNum = parseInt(formData?.quantity || '0') || 0;
  const totalPrice = calculatedPrice;
  const hasInsufficientBalance = user && userBalance < totalPrice && totalPrice > 0;

  // Validate quantity against service limits
  const minQuantity = parseInt(selectedService?.amount_minimum || '1') || 1;
  const maxQuantity = parseInt(selectedService?.prices?.[0]?.maximum || '10000') || 10000;
  const isQuantityInvalid = formData ? (parseInt(formData.quantity) || 0) < minQuantity || (parseInt(formData.quantity) || 0) > maxQuantity : false;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Platform Selection */}
        <div className="space-y-2">
          <Label htmlFor="platform">{t('order.platform')}</Label>
          <Select value={selectedPlatform} onValueChange={onPlatformChange}>
            <SelectTrigger>
              <SelectValue placeholder={t('order.selectPlatform')} />
            </SelectTrigger>
            <SelectContent>
              {platforms.map((platform) => (
                <SelectItem key={platform.value} value={platform.value}>
                  {platform.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Service Type Selection */}
        {selectedPlatform && (
          <div className="space-y-2">
            <Label htmlFor="serviceType">{t('order.serviceType')}</Label>
            <Select value={selectedServiceType} onValueChange={onServiceTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder={t('order.selectServiceType')} />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Service Selection */}
        {selectedPlatform && selectedServiceType && (
          <div className="space-y-2">
            <Label htmlFor="service">{t('order.service')}</Label>
            <Select value={formData?.serviceId || ''} onValueChange={(value) => onUpdateFormData?.('serviceId', value)}>
              <SelectTrigger className={errors.serviceId ? 'border-red-500' : ''}>
                <SelectValue placeholder={t('order.selectService')} />
              </SelectTrigger>
              <SelectContent>
                {availableServices.map((service) => (
                  <SelectItem key={service.id_service} value={service.id_service.toString()}>
                    <div className="flex flex-col">
                      <span>{service.public_name}</span>
                      <span className="text-xs text-muted-foreground">
                        ${service.prices?.[0]?.price || 'N/A'} / {service.prices?.[0]?.per || '1000'}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Order Details Section */}
      {selectedService && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Order Form */}
          <div className="space-y-6">
            {/* Balance Card - Yalnız qeydiyyatlı istifadəçilər üçün */}
            {user && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Wallet className="h-5 w-5 mr-2" />
                    Balans
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Mövcud balans:</span>
                      <div className="flex items-center space-x-2">
                        {balanceLoading ? (
                          <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                        ) : (
                          <Badge variant={userBalance > 0 ? "default" : "secondary"} className="text-lg font-semibold">
                            ${userBalance.toFixed(2)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {userBalance === 0 && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2 text-orange-700">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-sm font-medium">Balansınız 0-dır</span>
                        </div>
                        <p className="text-xs text-orange-600 mt-1">
                          Sifariş vermək üçün balansınızı artırın
                        </p>
                      </div>
                    )}

                    {hasInsufficientBalance && userBalance > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2 text-red-700">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-sm font-medium">Kifayət qədər balans yoxdur</span>
                        </div>
                        <p className="text-xs text-red-600 mt-1">
                          ${(totalPrice - userBalance).toFixed(2)} çatışmır
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Email Input - Yalnız qeydiyyatsız istifadəçilər üçün */}
            {!user && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Mail className="h-5 w-5 mr-2" />
                    Əlaqə məlumatları
                  </CardTitle>
                  <CardDescription>
                    Sifarişinizin təfərrüatları bu email ünvanına göndəriləcək
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email ünvanı *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData?.email || ''}
                      onChange={(e) => onUpdateFormData?.('email', e.target.value)}
                      placeholder="example@email.com"
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Sifarişinizə dair məlumatlar və hesab məlumatları bu emailə göndəriləcək
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Sifariş Məlumatları
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* URL Input */}
                <div className="space-y-2">
                  <Label htmlFor="url">URL *</Label>
                  <Input
                    id="url"
                    value={formData?.url || ''}
                    onChange={(e) => onUpdateFormData?.('url', e.target.value)}
                    placeholder={selectedService?.example || "https://example.com"}
                    className={errors.url ? 'border-red-500' : ''}
                  />
                  {errors.url && (
                    <p className="text-sm text-red-500">{errors.url}</p>
                  )}
                </div>

                {/* Quantity Input */}
                <div className="space-y-2">
                  <Label htmlFor="quantity">Miqdar *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData?.quantity || ''}
                    onChange={(e) => onUpdateFormData?.('quantity', e.target.value)}
                    min={minQuantity}
                    max={maxQuantity}
                    step={parseInt(selectedService?.amount_increment || '1') || 1}
                    className={`${errors.quantity ? 'border-red-500' : ''} ${isQuantityInvalid ? 'border-red-500' : ''}`}
                  />
                  {errors.quantity && (
                    <p className="text-sm text-red-500">{errors.quantity}</p>
                  )}
                  {isQuantityInvalid && formData?.quantity && (
                    <p className="text-sm text-red-500">
                      Miqdar {minQuantity} - {maxQuantity.toLocaleString()} aralığında olmalıdır
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    Min: {minQuantity.toLocaleString()}, Max: {maxQuantity.toLocaleString()}
                  </p>
                </div>

                {/* Additional Parameters */}
                {selectedService?.params?.map((param) => (
                  <div key={param.field_name} className="space-y-2">
                    <Label htmlFor={param.field_name}>
                      {param.field_label} {param.field_validators?.includes('required') && '*'}
                    </Label>
                    
                    {param.field_type === 'dropdown' && param.options ? (
                      <Select
                        value={formData?.additionalParams[param.field_name] || ''}
                        onValueChange={(value) => onUpdateAdditionalParam?.(param.field_name, value)}
                      >
                        <SelectTrigger className={errors[param.field_name] ? 'border-red-500' : ''}>
                          <SelectValue placeholder={param.field_placeholder || 'Seçin'} />
                        </SelectTrigger>
                        <SelectContent>
                          {param.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : param.field_type === 'textarea' ? (
                      <textarea
                        id={param.field_name}
                        value={formData?.additionalParams[param.field_name] || ''}
                        onChange={(e) => onUpdateAdditionalParam?.(param.field_name, e.target.value)}
                        placeholder={param.field_placeholder}
                        className={`w-full min-h-[80px] px-3 py-2 border rounded-md ${errors[param.field_name] ? 'border-red-500' : 'border-input'}`}
                      />
                    ) : (
                      <Input
                        id={param.field_name}
                        value={formData?.additionalParams[param.field_name] || ''}
                        onChange={(e) => onUpdateAdditionalParam?.(param.field_name, e.target.value)}
                        placeholder={param.field_placeholder}
                        className={errors[param.field_name] ? 'border-red-500' : ''}
                      />
                    )}
                    
                    {param.field_descr && (
                      <p className="text-sm text-gray-500">{param.field_descr}</p>
                    )}
                    {errors[param.field_name] && (
                      <p className="text-sm text-red-500">{errors[param.field_name]}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Calculator className="h-5 w-5 mr-2" />
                  Sifariş Xülasəsi
                </CardTitle>
                <CardDescription>Qiymət hesablaması</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedService && quantityNum > 0 ? (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Xidmət:</span>
                        <span className="font-medium">{selectedService.public_name}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Miqdar:</span>
                        <span className="font-medium">{quantityNum.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Cəmi:</span>
                      <Badge variant="default" className="text-lg font-bold px-3 py-1">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {totalPrice.toFixed(2)}
                      </Badge>
                    </div>
                    
                    {selectedService.amount_minimum && (
                      <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                        <strong>Minimum:</strong> {parseInt(selectedService.amount_minimum).toLocaleString()}
                        {selectedService.prices?.[0]?.maximum && (
                          <span className="ml-2">
                            <strong>Maksimum:</strong> {parseInt(selectedService.prices[0].maximum).toLocaleString()}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Order Button */}
                    <Button 
                      onClick={onPlaceOrder}
                      disabled={
                        placing || 
                        (user && hasInsufficientBalance) || 
                        (!user && !formData?.email) ||
                        !formData?.url || 
                        !formData?.quantity ||
                        isQuantityInvalid ||
                        Object.keys(errors).length > 0
                      }
                      className="w-full"
                    >
                      {placing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sifariş verilir...
                        </>
                      ) : (
                        `Sifariş ver - $${totalPrice.toFixed(2)}`
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calculator className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Xidmət və miqdar seçin</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
