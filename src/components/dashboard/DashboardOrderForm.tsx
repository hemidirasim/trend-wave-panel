import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';
import { ServiceFilters } from '@/components/order/ServiceFilters';
import { ServiceInfo } from '@/components/order/ServiceInfo';
import { proxyApiService, Service } from '@/components/ProxyApiService';
import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface DashboardOrderFormProps {
  userBalance: number;
  onOrderSuccess: () => void;
}

export const DashboardOrderForm = ({ userBalance, onOrderSuccess }: DashboardOrderFormProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { settings, loading: settingsLoading } = useSettings();
  const { user } = useAuth();

  // State management
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [serviceDetails, setServiceDetails] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingServiceDetails, setLoadingServiceDetails] = useState(false);
  const [placing, setPlacing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    serviceId: searchParams.get('service') || '',
    url: searchParams.get('url') || '',
    quantity: searchParams.get('quantity') || '',
    additionalParams: {} as Record<string, any>
  });
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedPlatform, setSelectedPlatform] = useState<string>(searchParams.get('platform') || '');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('');
  const [allowedPlatforms, setAllowedPlatforms] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize additional params from URL
  useEffect(() => {
    const additionalParams: Record<string, any> = {};
    for (const [key, value] of searchParams.entries()) {
      if (!['service', 'platform', 'url', 'quantity'].includes(key)) {
        additionalParams[key] = value;
      }
    }
    setFormData(prev => ({
      ...prev,
      additionalParams
    }));
  }, [searchParams]);

  // Fetch services when settings are loaded
  useEffect(() => {
    if (!settingsLoading) {
      fetchServices();
    }
  }, [settingsLoading]);

  // Handle service selection from URL - improved logic
  useEffect(() => {
    if (services.length > 0 && formData.serviceId && !isInitialized) {
      console.log('🔥 Auto-selecting service from URL:', formData.serviceId);
      const service = services.find(s => s.id_service.toString() === formData.serviceId);
      if (service) {
        console.log('🔥 Found service:', service.public_name);
        handleServiceSelection(service);
        setIsInitialized(true);
      } else {
        console.log('🔥 Service not found in services list:', formData.serviceId);
      }
    }
  }, [services, formData.serviceId, isInitialized]);

  // Calculate price when quantity changes
  useEffect(() => {
    if (selectedService && formData.quantity && !settingsLoading) {
      const quantity = parseInt(formData.quantity);
      if (!isNaN(quantity) && quantity > 0) {
        const price = proxyApiService.calculatePrice(selectedService, quantity, settings.service_fee, settings.base_fee);
        setCalculatedPrice(price);
      } else {
        setCalculatedPrice(0);
      }
    }
  }, [selectedService, formData.quantity, settings.service_fee, settings.base_fee, settingsLoading]);

  const getServiceTypeFromName = (serviceName: string): string => {
    const name = serviceName.toLowerCase();
    if (name.includes('like') || name.includes('bəyən')) return 'Likes';
    if (name.includes('follow') || name.includes('izləyici')) return 'Followers';
    if (name.includes('view') || name.includes('baxış')) return 'Views';
    if (name.includes('share') || name.includes('paylaş')) return 'Shares';
    if (name.includes('comment') || name.includes('şərh')) return 'Comments';
    return 'Other';
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      console.log('🔥 Fetching services...');
      const data = await proxyApiService.getServices();
      const uniquePlatforms = [...new Set(data
        .filter(service => service && service.platform && service.id_service)
        .map(service => service.platform.toLowerCase())
      )];
      setAllowedPlatforms(uniquePlatforms);
      
      const filteredData = data.filter(service => {
        return service && service.platform && service.id_service;
      });
      setServices(filteredData);
      console.log('🔥 Services loaded:', filteredData.length);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Xidmətlər yüklənmədi');
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceDetails = async (serviceId: string) => {
    try {
      setLoadingServiceDetails(true);
      const details = await proxyApiService.getServiceDetails(serviceId);
      setServiceDetails(details);
    } catch (error) {
      console.error('Error fetching service details:', error);
      setServiceDetails(null);
    } finally {
      setLoadingServiceDetails(false);
    }
  };

  const handleServiceSelection = (service: Service) => {
    console.log('🔥 Selecting service:', service.public_name, service.id_service);
    setSelectedService(service);
    setSelectedPlatform(service.platform.toLowerCase());
    const serviceType = service.type_name && service.type_name.trim() !== '' ? service.type_name : getServiceTypeFromName(service.public_name);
    setSelectedServiceType(serviceType);
    fetchServiceDetails(service.id_service.toString());
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      serviceId: service.id_service.toString()
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.serviceId) {
      newErrors.serviceId = t('order.serviceRequired');
    }
    if (!formData.url.trim()) {
      newErrors.url = t('order.requiredUrl');
    } else if (!proxyApiService.validateUrl(selectedPlatform, formData.url)) {
      newErrors.url = t('order.trueUrlFormat');
    }
    if (!formData.quantity.trim()) {
      newErrors.quantity = t('order.quantityRequired');
    } else {
      const quantity = parseInt(formData.quantity);
      if (isNaN(quantity) || quantity <= 0) {
        newErrors.quantity = t('order.trueQuantity');
      } else if (selectedService) {
        const minAmount = parseInt(selectedService.amount_minimum);
        if (quantity < minAmount) {
          newErrors.quantity = `${t('order.minOrder')}: ${minAmount}`;
        }
        if (selectedService.prices && selectedService.prices.length > 0) {
          const maxAmount = parseInt(selectedService.prices[0].maximum);
          if (quantity > maxAmount) {
            newErrors.quantity = `${t('order.maxOrder')}: ${maxAmount.toLocaleString()}`;
          }
        }
      }
    }
    if (selectedService && selectedService.params) {
      selectedService.params.forEach(param => {
        if (param.field_validators.includes('required')) {
          const value = formData.additionalParams[param.field_name];
          if (!value || value.toString().trim() === '') {
            newErrors[param.field_name] = `${param.field_label} vacibdir`;
          }
        }
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    toast.dismiss();
    
    if (!user) {
      toast.error('Giriş etməlisiniz');
      return;
    }
 
    if (userBalance < calculatedPrice) {
      toast.error(t('order.EnoughBalance'));
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setPlacing(true);
      console.log('Placing order with data:', {
        serviceId: formData.serviceId,
        url: formData.url,
        quantity: parseInt(formData.quantity),
        additionalParams: formData.additionalParams
      });
      const response = await proxyApiService.placeOrder(formData.serviceId, formData.url, parseInt(formData.quantity), formData.additionalParams);
      console.log('Order API response:', response);

      if (!response || response.status === 'error' || response.error) {
        let errorMessage = t('order.OrderingError');
        if (response?.message) {
          if (Array.isArray(response.message)) {
            errorMessage = response.message.map(msg => msg.message || msg).join(', ');
          } else if (typeof response.message === 'string') {
            errorMessage = response.message;
          }
        } else if (response?.error) {
          errorMessage = response.error;
        }
        toast.error(errorMessage);
        return;
      }

      if (response.status === 'success' && response.id_service_submission) {
        // Update user balance
        const newBalance = userBalance - calculatedPrice;
        const { error: balanceError } = await supabase.from('profiles').update({
          balance: newBalance
        }).eq('id', user.id);
        if (balanceError) {
          console.error('Error updating balance:', balanceError);
        }

        // Save order to local database
        const { error: orderError } = await supabase.from('orders').insert({
          user_id: user.id,
          service_id: formData.serviceId,
          service_name: selectedService?.public_name || '',
          platform: selectedService?.platform || '',
          service_type: selectedServiceType,
          quantity: parseInt(formData.quantity),
          price: calculatedPrice,
          link: formData.url,
          status: 'pending',
          external_order_id: response.id_service_submission
        });
        if (orderError) {
          console.error('Error saving order:', orderError);
        }

        toast.success('Sifariş uğurla verildi!');
        
        // Reset form
        setFormData({
          serviceId: '',
          url: '',
          quantity: '',
          additionalParams: {}
        });
        setSelectedService(null);
        setServiceDetails(null);
        setSelectedPlatform('');
        setSelectedServiceType('');
        setCalculatedPrice(0);
        setIsInitialized(false);
        
        // Call success callback to refresh data
        onOrderSuccess();
        
        // Switch to orders history tab
        setTimeout(() => {
          window.location.hash = '#history';
          window.location.reload();
        }, 1500);
      } else {
        console.error('Order failed:', response);
        toast.error(t('order.OrderingError'));
      }
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error(t('order.OrderingError'));
    } finally {
      setPlacing(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const updateAdditionalParam = (paramName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      additionalParams: {
        ...prev.additionalParams,
        [paramName]: value
      }
    }));
    if (errors[paramName]) {
      setErrors(prev => ({
        ...prev,
        [paramName]: ''
      }));
    }
  };

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);
    setSelectedServiceType('');
    setSelectedService(null);
    setServiceDetails(null);
    updateFormData('serviceId', '');
    setIsInitialized(false);
  };

  const handleServiceTypeChange = (serviceType: string) => {
    setSelectedServiceType(serviceType);
    
    if (serviceType.includes('-') && serviceType.split('-').length === 2) {
      const [platform, serviceId] = serviceType.split('-');
      const service = services.find(s => s.id_service.toString() === serviceId);
      if (service) {
        updateFormData('serviceId', serviceId);
        handleServiceSelection(service);
      }
    } else {
      setSelectedService(null);
      setServiceDetails(null);
      updateFormData('serviceId', '');
    }
  };

  const getServiceDescription = () => {
    if (serviceDetails?.description && serviceDetails.description.trim()) {
      return serviceDetails.description;
    }
    if (selectedService?.description && selectedService.description.trim()) {
      return selectedService.description;
    }
    return null;
  };

  if (loading || settingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <span className="text-lg">{t('order.servicesLoading')}</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ServiceFilters 
        services={services} 
        selectedPlatform={selectedPlatform} 
        selectedServiceType={selectedServiceType} 
        onPlatformChange={handlePlatformChange} 
        onServiceTypeChange={handleServiceTypeChange} 
        allowedPlatforms={allowedPlatforms}
        selectedService={selectedService}
        formData={formData}
        errors={errors}
        onUpdateFormData={updateFormData}
        onUpdateAdditionalParam={updateAdditionalParam}
        onPlaceOrder={handleSubmit}
        placing={placing}
        calculatedPrice={calculatedPrice}
        serviceFeePercentage={settings.service_fee}
        baseFee={settings.base_fee}
      />
      
      {errors.serviceId && (
        <p className="text-sm text-red-500 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {errors.serviceId}
        </p>
      )}

      {selectedService && (
        <ServiceInfo 
          serviceDescription={getServiceDescription()} 
          loading={loadingServiceDetails} 
        />
      )}
    </form>
  );
};
