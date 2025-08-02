import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2, ShoppingCart } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ServiceFilters } from '@/components/order/ServiceFilters';
import { ServiceSelector } from '@/components/order/ServiceSelector';
import { ServiceInfo } from '@/components/order/ServiceInfo';
import OrderForm from '@/components/order/OrderForm';
import { OrderSummary } from '@/components/order/OrderSummary';
import { proxyApiService, Service } from '@/components/ProxyApiService';
import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { BalanceTopUpDialog } from '@/components/payment/BalanceTopUpDialog';
import { supabase } from '@/integrations/supabase/client';
import { validateUrl } from '@/utils/urlValidator';

const Order = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const {
    settings,
    loading: settingsLoading
  } = useSettings();
  const {
    user,
    loading: authLoading
  } = useAuth();

  // Balance states
  const [userBalance, setUserBalance] = useState<number>(0);
  const [balanceLoading, setBalanceLoading] = useState(false);

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
    url: '',
    quantity: '',
    additionalParams: {} as Record<string, any>
  });
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('');
  const [priceFilter, setPriceFilter] = useState<'low-to-high' | 'high-to-low'>('low-to-high');
  const urlPlatform = searchParams.get('platform');

  // Remove allowedPlatforms restriction - now we get all platforms from API
  const [allowedPlatforms, setAllowedPlatforms] = useState<string[]>([]);

  // Clear any existing toasts when component mounts
  useEffect(() => {
    toast.dismiss();
  }, []);

  // Scroll to top when component mounts or when loading starts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // Also scroll to top when loading state changes
  useEffect(() => {
    if (loading) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [loading]);

  // Initialize platform from URL
  useEffect(() => {
    if (urlPlatform) {
      setSelectedPlatform(urlPlatform.toLowerCase());
    }
  }, [urlPlatform]);

  // Fetch user balance when user is available
  useEffect(() => {
    if (user && !authLoading) {
      fetchUserBalance();
    }
  }, [user, authLoading]);

  const fetchUserBalance = async () => {
    if (!user) return;
    try {
      setBalanceLoading(true);
      const {
        data,
        error
      } = await supabase.from('profiles').select('balance').eq('id', user.id).single();
      if (error) {
        console.error('Error fetching balance:', error);
        setUserBalance(0);
      } else {
        setUserBalance(data?.balance || 0);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      setUserBalance(0);
    } finally {
      setBalanceLoading(false);
    }
  };

  // Fetch services when settings are loaded
  useEffect(() => {
    if (!settingsLoading) {
      fetchServices();
    }
  }, [settingsLoading]);

  // Handle service selection from URL
  useEffect(() => {
    if (services.length > 0 && formData.serviceId) {
      const service = services.find(s => s.id_service.toString() === formData.serviceId);
      if (service) {
        handleServiceSelection(service);
      }
    }
  }, [services, formData.serviceId]);

  // Calculate price when quantity changes
  useEffect(() => {
    if (selectedService && formData.quantity && !settingsLoading) {
      const quantity = parseInt(formData.quantity);
      if (!isNaN(quantity) && quantity > 0) {
        console.log('🔥 Order: Calculating price with settings:', {
          serviceFee: settings.service_fee,
          baseFee: settings.base_fee,
          quantity,
          serviceName: selectedService.public_name
        });
        const price = proxyApiService.calculatePrice(selectedService, quantity, settings.service_fee, settings.base_fee);
        setCalculatedPrice(price);
      } else {
        setCalculatedPrice(0);
      }
    }
  }, [selectedService, formData.quantity, settings.service_fee, settings.base_fee, settingsLoading]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await proxyApiService.getServices();
      // Get all unique platforms from API (no filtering)
      const uniquePlatforms = [...new Set(data
        .filter(service => service && service.platform && service.id_service)
        .map(service => service.platform.toLowerCase())
      )];
      setAllowedPlatforms(uniquePlatforms);
      
      // Filter services to only include those with valid platform and id_service
      const filteredData = data.filter(service => {
        return service && service.platform && service.id_service;
      });
      setServices(filteredData);
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
    setSelectedService(service);
    setSelectedPlatform(service.platform.toLowerCase());
    const serviceType = service.type_name && service.type_name.trim() !== '' ? service.type_name : getServiceTypeFromName(service.public_name);
    setSelectedServiceType(serviceType);
    fetchServiceDetails(service.id_service.toString());
  };

  const getServiceTypeFromName = (serviceName: string): string => {
    const name = serviceName.toLowerCase();
    if (name.includes('like') || name.includes('bəyən')) return 'Likes';
    if (name.includes('follow') || name.includes('izləyici')) return 'Followers';
    if (name.includes('view') || name.includes('baxış')) return 'Views';
    if (name.includes('share') || name.includes('paylaş')) return 'Shares';
    if (name.includes('comment') || name.includes('şərh')) return 'Comments';
    return 'Other';
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.serviceId) {
      newErrors.serviceId = t('order.serviceRequired');
    }
    if (!formData.url.trim()) {
      newErrors.url = t('order.requiredUrl');
    } else if (!validateUrl(selectedPlatform, formData.url)) {
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

    if (!validateForm()) {
      return;
    }

    // Handle order placement through OrderForm component
    // The OrderForm handles both guest and registered user flows
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
  };

  const handleServiceTypeChange = (serviceType: string) => {
    setSelectedServiceType(serviceType);
    
    // serviceType formatı: "platform-serviceId" olduğunda avtomatik seçim
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

  const handleServiceSelect = (serviceId: string) => {
    updateFormData('serviceId', serviceId);
    const service = services.find(s => s.id_service.toString() === serviceId);
    if (service) {
      handleServiceSelection(service);
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

  const handleBalanceTopUpSuccess = () => {
    toast.success(t('order.balanceIncreaseSuccess'));
    fetchUserBalance();
  };

  if (loading || settingsLoading || authLoading) {
    return <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <span className="text-lg">{t('order.servicesLoading')}</span>
            </div>
          </div>
        </div>
      </div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('order.title')}</h1>
            <p className="text-xl text-muted-foreground mb-8">{t('order.subtitle')}</p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                {t('order.details')}
              </CardTitle>
              <CardDescription>{t('order.detailsDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
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
                  <>
                    <ServiceInfo 
                      serviceDescription={getServiceDescription()} 
                      loading={loadingServiceDetails} 
                    />
                    <OrderForm
                      service={selectedService}
                      formData={formData}
                      errors={errors}
                      calculatedPrice={calculatedPrice}
                      placing={placing}
                      onUpdateFormData={updateFormData}
                      onUpdateAdditionalParam={updateAdditionalParam}
                      onPlaceOrder={() => {}}
                    />
                  </>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />

      <BalanceTopUpDialog
        open={false}
        onOpenChange={() => {}}
        onPaymentSuccess={handleBalanceTopUpSuccess}
      />
    </div>
  );
};

export default Order;
