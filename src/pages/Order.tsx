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
import { toast } from 'sonner';

const Order = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { settings, loading: settingsLoading } = useSettings();
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

  useEffect(() => {
    if (!settingsLoading) {
      console.log('🔥 Order: Settings loaded, service_fee:', settings.service_fee);
      fetchServices();
    }
  }, [settingsLoading, settings.service_fee]);

  useEffect(() => {
    if (urlPlatform && allowedPlatforms.includes(urlPlatform.toLowerCase())) {
      setSelectedPlatform(urlPlatform.toLowerCase());
    }
  }, [urlPlatform]);

  useEffect(() => {
    if (services.length > 0 && formData.serviceId) {
      const service = services.find(s => s.id_service.toString() === formData.serviceId);
      if (service) {
        setSelectedService(service);
        setSelectedPlatform(service.platform.toLowerCase());
        const serviceType = service.type_name && service.type_name.trim() !== '' 
          ? service.type_name 
          : getServiceTypeFromName(service.public_name);
        setSelectedServiceType(serviceType);
        calculatePrice(service, parseInt(formData.quantity) || 0);
        fetchServiceDetails(formData.serviceId);
      }
    }
  }, [services, formData.serviceId, formData.quantity, settings.service_fee]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await proxyApiService.getServices();
      const filteredData = data.filter(service => {
        if (!service || !service.platform || !service.id_service) return false;
        return allowedPlatforms.includes(service.platform.toLowerCase());
      });
      
      const sortedData = [...filteredData].sort((a, b) => {
        const priceA = proxyApiService.calculatePrice(a, 1000, settings.service_fee);
        const priceB = proxyApiService.calculatePrice(b, 1000, settings.service_fee);
        return priceA - priceB;
      });
      
      setServices(sortedData);
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

  const calculatePrice = (service: Service, quantity: number) => {
    if (!service || !quantity) {
      setCalculatedPrice(0);
      return;
    }
    const price = proxyApiService.calculatePrice(service, quantity, settings.service_fee);
    setCalculatedPrice(price);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.serviceId) newErrors.serviceId = 'Xidmət seçmək vacibdir';
    if (!formData.url.trim()) newErrors.url = 'URL daxil etmək vacibdir';
    else if (!proxyApiService.validateUrl(selectedPlatform, formData.url)) newErrors.url = 'Düzgün URL formatı daxil edin';
    if (!formData.quantity.trim()) newErrors.quantity = 'Miqdar daxil etmək vacibdir';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setPlacing(true);
      const response = await proxyApiService.placeOrder(
        formData.serviceId, formData.url, parseInt(formData.quantity), formData.additionalParams
      );
      if (response.status === 'success' && response.id_service_submission) {
        toast.success('Sifariş uğurla verildi!');
        navigate(`/track?order=${response.id_service_submission}`);
      }
    } catch (error) {
      toast.error('Sifariş verilmədi.');
    } finally {
      setPlacing(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateAdditionalParam = (paramName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      additionalParams: { ...prev.additionalParams, [paramName]: value }
    }));
  };

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);
    setSelectedServiceType('');
    setSelectedService(null);
    setServiceDetails(null);
  };

  const handleServiceTypeChange = (serviceType: string) => {
    setSelectedServiceType(serviceType);
    setSelectedService(null);
    setServiceDetails(null);
  };

  const handleServiceSelect = (serviceId: string) => {
    updateFormData('serviceId', serviceId);
    const service = services.find(s => s.id_service.toString() === serviceId);
    if (service) {
      setSelectedService(service);
      calculatePrice(service, parseInt(formData.quantity) || 0);
      fetchServiceDetails(serviceId);
    }
  };

  const getServiceDescription = () => {
    if (serviceDetails?.description && serviceDetails.description.trim()) return serviceDetails.description;
    if (selectedService?.description && selectedService.description.trim()) return selectedService.description;
    return null;
  };

  const getServiceTypeFromName = (serviceName: string): string => {
    const name = serviceName.toLowerCase();
    if (name.includes('like') || name.includes('bəyən')) return 'Likes';
    if (name.includes('follow') || name.includes('izləyici')) return 'Followers';
    if (name.includes('view') || name.includes('baxış')) return 'Views';
    return 'Other';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Xidmətlər yüklənir...</span>
          </div>
        </div>
        <Footer />
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
                      serviceFee={settings.service_fee}
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
                serviceFee={settings.service_fee}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Order;