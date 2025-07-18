
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2, ShoppingCart } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ServiceFilters } from '@/components/order/ServiceFilters';
import { ServiceSelector } from '@/components/order/ServiceSelector';
import { ServiceInfo } from '@/components/order/ServiceInfo';
import { OrderForm } from '@/components/order/OrderForm';
import { OrderSummary } from '@/components/order/OrderSummary';
import { proxyApiService, Service } from '@/components/ProxyApiService';
import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import AuthDialog from '@/components/AuthDialog';
import { BalanceTopUpDialog } from '@/components/payment/BalanceTopUpDialog';
import { supabase } from '@/integrations/supabase/client';

const Order = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { settings, loading: settingsLoading } = useSettings();
  const { user, loading: authLoading } = useAuth();
  
  // Auth and balance states
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
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
  const allowedPlatforms = ['instagram', 'tiktok', 'youtube', 'facebook'];

  // Scroll to top when component mounts or when loading starts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Also scroll to top when loading state changes
  useEffect(() => {
    if (loading) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [loading]);

  // Initialize platform from URL
  useEffect(() => {
    if (urlPlatform && allowedPlatforms.includes(urlPlatform.toLowerCase())) {
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
      const { data, error } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', user.id)
        .single();
      
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
        
        const price = proxyApiService.calculatePrice(
          selectedService, 
          quantity, 
          settings.service_fee,
          settings.base_fee
        );
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
      
      // Filter services for allowed platforms
      const filteredData = data.filter(service => {
        return service && 
               service.platform && 
               service.id_service && 
               allowedPlatforms.includes(service.platform.toLowerCase());
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
    
    // Determine service type
    const serviceType = service.type_name && service.type_name.trim() !== '' 
      ? service.type_name 
      : getServiceTypeFromName(service.public_name);
    setSelectedServiceType(serviceType);
    
    // Fetch additional details
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
      newErrors.serviceId = 'Xidmət seçmək vacibdir';
    }
    
    if (!formData.url.trim()) {
      newErrors.url = 'URL daxil etmək vacibdir';
    } else if (!proxyApiService.validateUrl(selectedPlatform, formData.url)) {
      newErrors.url = 'Düzgün URL formatı daxil edin';
    }
    
    if (!formData.quantity.trim()) {
      newErrors.quantity = 'Miqdar daxil etmək vacibdir';
    } else {
      const quantity = parseInt(formData.quantity);
      if (isNaN(quantity) || quantity <= 0) {
        newErrors.quantity = 'Düzgün miqdar daxil edin';
      } else if (selectedService) {
        const minAmount = parseInt(selectedService.amount_minimum);
        if (quantity < minAmount) {
          newErrors.quantity = `Minimum miqdar: ${minAmount}`;
        }
        
        // Add maximum amount validation
        if (selectedService.prices && selectedService.prices.length > 0) {
          const maxAmount = parseInt(selectedService.prices[0].maximum);
          if (quantity > maxAmount) {
            newErrors.quantity = `Maksimum miqdar: ${maxAmount.toLocaleString()}`;
          }
        }
      }
    }
    
    // Validate additional parameters
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
    
    // Check if user is authenticated
    if (!user) {
      setAuthDialogOpen(true);
      return;
    }

    // Check if user has sufficient balance
    if (userBalance < calculatedPrice) {
      toast.error('Kifayət qədər balansınız yoxdur. Balansınızı artırın.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setPlacing(true);
      const response = await proxyApiService.placeOrder(
        formData.serviceId,
        formData.url,
        parseInt(formData.quantity),
        formData.additionalParams
      );
      
      if (response.status === 'success' && response.id_service_submission) {
        toast.success('Sifariş uğurla verildi!');
        // Refresh balance after successful order
        fetchUserBalance();
        navigate(`/track?order=${response.id_service_submission}`);
      } else {
        toast.error('Sifariş verilmədi. Yenidən cəhd edin.');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error('Sifariş verilmədi. Yenidən cəhd edin.');
    } finally {
      setPlacing(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear related errors
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateAdditionalParam = (paramName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      additionalParams: { ...prev.additionalParams, [paramName]: value }
    }));
    // Clear related errors
    if (errors[paramName]) {
      setErrors(prev => ({ ...prev, [paramName]: '' }));
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
    setSelectedService(null);
    setServiceDetails(null);
    updateFormData('serviceId', '');
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

  const handleBalanceTopUpSuccess = (transactionId: string) => {
    toast.success('Balans uğurla artırıldı!');
    fetchUserBalance();
  };

  if (loading || settingsLoading || authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <span className="text-lg">Xidmətlər və parametrlər yüklənir...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Sifarişinizi Verin</h1>
            <p className="text-xl text-muted-foreground mb-8">Xidmət seçin və məlumatlarınızı daxil edin</p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Sifariş Təfərrüatları
                  </CardTitle>
                  <CardDescription>Sifarişinizi vermək üçün aşağıdakı məlumatları doldurun</CardDescription>
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
                    />
                    
                    {errors.serviceId && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.serviceId}
                      </p>
                    )}

                    <ServiceSelector
                      services={services}
                      selectedPlatform={selectedPlatform}
                      selectedServiceType={selectedServiceType}
                      selectedServiceId={formData.serviceId}
                      priceFilter={priceFilter}
                      serviceFeePercentage={settings.service_fee}
                      baseFee={settings.base_fee}
                      onServiceSelect={handleServiceSelect}
                      onPriceFilterChange={setPriceFilter}
                      error={errors.serviceId}
                    />

                    {selectedService && (
                      <ServiceInfo
                        serviceDescription={getServiceDescription()}
                        loading={loadingServiceDetails}
                      />
                    )}

                    {!selectedPlatform && (
                      <div className="text-center py-6 text-muted-foreground">Platform seçin</div>
                    )}

                    {selectedPlatform && !selectedServiceType && (
                      <div className="text-center py-6 text-muted-foreground">Xidmət növünü seçin</div>
                    )}

                    {selectedService && (
                      <OrderForm
                        selectedService={selectedService}
                        formData={formData}
                        errors={errors}
                        calculatedPrice={calculatedPrice}
                        placing={placing}
                        onUpdateFormData={updateFormData}
                        onUpdateAdditionalParam={updateAdditionalParam}
                        onSubmit={handleSubmit}
                      />
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <OrderSummary
                selectedService={selectedService}
                quantity={formData.quantity}
                calculatedPrice={calculatedPrice}
                serviceFeePercentage={settings.service_fee}
                baseFee={settings.base_fee}
                userBalance={userBalance}
                balanceLoading={balanceLoading}
                onBalanceTopUp={() => {}}
                showBalanceTopUp={user && userBalance < calculatedPrice}
                BalanceTopUpComponent={
                  <BalanceTopUpDialog
                    customerEmail={user?.email}
                    customerName={user?.user_metadata?.full_name}
                    userId={user?.id}
                    onSuccess={handleBalanceTopUpSuccess}
                    onError={(error) => toast.error('Balans artırma zamanı xəta: ' + error)}
                  />
                }
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
      />
    </div>
  );
};

export default Order;
