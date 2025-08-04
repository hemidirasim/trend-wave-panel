
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Service } from '@/types/api';
import { apiClient } from '@/utils/apiClient';
import { calculatePrice } from '@/utils/priceCalculator';
import { validateUrl } from '@/utils/urlValidator';
import { proxyApiService } from '@/components/ProxyApiService';

interface DashboardOrderFormProps {
  preSelectedService?: string | null;
  preSelectedPlatform?: string | null;
  onOrderSuccess: () => void;
  onCancel: () => void;
  userBalance: number;
  onBalanceUpdate: () => void;
}

const DashboardOrderForm = ({
  preSelectedService,
  preSelectedPlatform,
  onOrderSuccess,
  onCancel,
  userBalance,
  onBalanceUpdate
}: DashboardOrderFormProps) => {
  const { user } = useAuth();
  const { settings } = useSettings();
  const { t } = useLanguage();

  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    serviceId: preSelectedService || '',
    url: '',
    quantity: '',
    additionalParams: {} as Record<string, any>
  });

  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load services
  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const data = await proxyApiService.getServices();
        setServices(data);

        // Pre-select service if provided
        if (preSelectedService) {
          const service = data.find(s => s.id_service.toString() === preSelectedService);
          if (service) {
            setSelectedService(service);
          }
        }
      } catch (error) {
        console.error('Error loading services:', error);
        toast.error('Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, [preSelectedService]);

  // Calculate price when quantity or service changes
  useEffect(() => {
    if (selectedService && formData.quantity && !isNaN(parseInt(formData.quantity))) {
      const quantity = parseInt(formData.quantity);
      if (quantity > 0) {
        const price = calculatePrice(selectedService, quantity, settings.service_fee, settings.base_fee);
        setCalculatedPrice(price);
      } else {
        setCalculatedPrice(0);
      }
    } else {
      setCalculatedPrice(0);
    }
  }, [selectedService, formData.quantity, settings.service_fee, settings.base_fee]);

  const handleServiceChange = (serviceId: string) => {
    const service = services.find(s => s.id_service.toString() === serviceId);
    setSelectedService(service || null);
    setFormData(prev => ({ ...prev, serviceId, additionalParams: {} }));
    setErrors({});
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateAdditionalParam = (paramName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      additionalParams: { ...prev.additionalParams, [paramName]: value }
    }));
    if (errors[paramName]) {
      setErrors(prev => ({ ...prev, [paramName]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.serviceId) {
      newErrors.serviceId = 'Service is required';
    }

    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else if (selectedService && !validateUrl(selectedService.platform.toLowerCase(), formData.url)) {
      newErrors.url = 'Invalid URL format for this platform';
    }

    if (!formData.quantity.trim()) {
      newErrors.quantity = 'Quantity is required';
    } else {
      const quantity = parseInt(formData.quantity);
      if (isNaN(quantity) || quantity <= 0) {
        newErrors.quantity = 'Quantity must be a positive number';
      } else if (selectedService) {
        const minAmount = parseInt(selectedService.amount_minimum);
        const maxAmount = parseInt(selectedService.prices?.[0]?.maximum || '10000');
        
        if (quantity < minAmount) {
          newErrors.quantity = `Minimum quantity: ${minAmount}`;
        }
        if (quantity > maxAmount) {
          newErrors.quantity = `Maximum quantity: ${maxAmount.toLocaleString()}`;
        }
      }
    }

    if (selectedService?.params) {
      selectedService.params.forEach(param => {
        if (param.field_validators.includes('required')) {
          const value = formData.additionalParams[param.field_name];
          if (!value || value.toString().trim() === '') {
            newErrors[param.field_name] = `${param.field_label} is required`;
          }
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (calculatedPrice > userBalance) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      setPlacing(true);

      // Place order via API
      const orderResponse = await apiClient.placeOrder(
        formData.serviceId,
        formData.url,
        parseInt(formData.quantity),
        formData.additionalParams
      );

      if (!orderResponse || orderResponse.status === 'error' || !orderResponse.id_service_submission) {
        let errorMessage = 'Failed to place order';
        if (orderResponse?.message) {
          if (Array.isArray(orderResponse.message)) {
            errorMessage = orderResponse.message.map((msg: any) => msg.message || msg).join(', ');
          } else if (typeof orderResponse.message === 'string') {
            errorMessage = orderResponse.message;
          }
        }
        toast.error(errorMessage);
        return;
      }

      // Save order to database
      const { error: orderError } = await supabase.from('orders').insert({
        user_id: user?.id,
        service_id: formData.serviceId,
        service_name: selectedService?.public_name || '',
        platform: selectedService?.platform || '',
        service_type: selectedService?.type_name || 'engagement',
        link: formData.url,
        quantity: parseInt(formData.quantity),
        price: calculatedPrice,
        status: 'pending',
        external_order_id: orderResponse.id_service_submission
      });

      if (orderError) {
        console.error('Error saving order:', orderError);
        toast.error('Failed to save order');
        return;
      }

      // Update user balance
      const newBalance = userBalance - calculatedPrice;
      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', user?.id);

      if (balanceError) {
        console.error('Error updating balance:', balanceError);
        toast.error('Failed to update balance');
        return;
      }

      toast.success('Order placed successfully!');
      onBalanceUpdate();
      onOrderSuccess();

    } catch (error) {
      console.error('Order placement error:', error);
      toast.error('Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading services...</span>
      </div>
    );
  }

  const hasInsufficientBalance = calculatedPrice > userBalance;
  const quantity = parseInt(formData.quantity) || 0;
  const minQuantity = parseInt(selectedService?.amount_minimum || '1');
  const maxQuantity = parseInt(selectedService?.prices?.[0]?.maximum || '10000');
  const isQuantityInvalid = quantity < minQuantity || quantity > maxQuantity;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Service Selection */}
      <div className="space-y-2">
        <Label htmlFor="service">Service</Label>
        <Select value={formData.serviceId} onValueChange={handleServiceChange}>
          <SelectTrigger className={errors.serviceId ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            {services
              .filter(service => !preSelectedPlatform || service.platform.toLowerCase() === preSelectedPlatform)
              .map(service => (
                <SelectItem key={service.id_service} value={service.id_service.toString()}>
                  {service.public_name} - ${(parseFloat(service.prices?.[0]?.price || '0') * 1000).toFixed(2)}/1K
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {errors.serviceId && <p className="text-sm text-red-500">{errors.serviceId}</p>}
      </div>

      {/* URL Input */}
      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          value={formData.url}
          onChange={(e) => updateFormData('url', e.target.value)}
          placeholder={selectedService?.example || "https://example.com"}
          className={errors.url ? 'border-red-500' : ''}
        />
        {errors.url && <p className="text-sm text-red-500">{errors.url}</p>}
      </div>

      {/* Quantity Input */}
      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          value={formData.quantity}
          onChange={(e) => updateFormData('quantity', e.target.value)}
          min={minQuantity}
          max={maxQuantity}
          className={errors.quantity ? 'border-red-500' : ''}
        />
        {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
        {selectedService && (
          <p className="text-sm text-gray-500">
            Min: {minQuantity.toLocaleString()}, Max: {maxQuantity.toLocaleString()}
          </p>
        )}
      </div>

      {/* Additional Parameters */}
      {selectedService?.params?.map((param) => (
        <div key={param.field_name} className="space-y-2">
          <Label htmlFor={param.field_name}>
            {param.field_label} {param.field_validators?.includes('required') && '*'}
          </Label>
          
          {param.field_type === 'dropdown' && param.options ? (
            <Select
              value={formData.additionalParams[param.field_name] || ''}
              onValueChange={(value) => updateAdditionalParam(param.field_name, value)}
            >
              <SelectTrigger className={errors[param.field_name] ? 'border-red-500' : ''}>
                <SelectValue placeholder={param.field_placeholder || 'Select'} />
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
            <Textarea
              id={param.field_name}
              value={formData.additionalParams[param.field_name] || ''}
              onChange={(e) => updateAdditionalParam(param.field_name, e.target.value)}
              placeholder={param.field_placeholder}
              className={errors[param.field_name] ? 'border-red-500' : ''}
            />
          ) : (
            <Input
              id={param.field_name}
              value={formData.additionalParams[param.field_name] || ''}
              onChange={(e) => updateAdditionalParam(param.field_name, e.target.value)}
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

      {/* Price Display */}
      {calculatedPrice > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total Price:</span>
            <span className="text-xl font-bold text-primary">${calculatedPrice.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Balance Check */}
      {hasInsufficientBalance && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-700">
            Insufficient balance. Required: ${calculatedPrice.toFixed(2)}, Available: ${userBalance.toFixed(2)}
          </AlertDescription>
        </Alert>
      )}

      {/* Submit Buttons */}
      <div className="flex space-x-4">
        <Button
          type="submit"
          disabled={placing || hasInsufficientBalance || !formData.url || !formData.quantity || isQuantityInvalid || Object.keys(errors).length > 0}
          className="flex-1"
        >
          {placing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Placing Order...
            </>
          ) : (
            `Place Order - $${calculatedPrice.toFixed(2)}`
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default DashboardOrderForm;
