
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, ShoppingCart } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ServiceFilters } from '@/components/order/ServiceFilters';
import { ServiceInfo } from '@/components/order/ServiceInfo';
import { proxyApiService, Service } from '@/components/ProxyApiService';
import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import AuthDialog from '@/components/auth/AuthDialog';

const Order = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const {
    settings,
    loading: settingsLoading
  } = useSettings();
  const {
    user,
    loading: authLoading
  } = useAuth();

  // Auth states
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  // State management
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [serviceDetails, setServiceDetails] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingServiceDetails, setLoadingServiceDetails] = useState(false);

  // Form state - simplified for display only
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('');
  const urlPlatform = searchParams.get('platform');

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

  // Initialize platform from URL
  useEffect(() => {
    if (urlPlatform) {
      setSelectedPlatform(urlPlatform.toLowerCase());
    }
  }, [urlPlatform]);

  // Fetch services when settings are loaded
  useEffect(() => {
    if (!settingsLoading) {
      fetchServices();
    }
  }, [settingsLoading]);

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

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);
    setSelectedServiceType('');
    setSelectedService(null);
    setServiceDetails(null);
  };

  const handleServiceTypeChange = (serviceType: string) => {
    setSelectedServiceType(serviceType);
    
    if (serviceType.includes('-') && serviceType.split('-').length === 2) {
      const [platform, serviceId] = serviceType.split('-');
      const service = services.find(s => s.id_service.toString() === serviceId);
      if (service) {
        handleServiceSelection(service);
      }
    } else {
      setSelectedService(null);
      setServiceDetails(null);
    }
  };

  const handleBuyClick = (service: Service) => {
    if (!user) {
      setAuthDialogOpen(true);
      return;
    }

    // Redirect to dashboard with selected service
    const params = new URLSearchParams({
      service: service.id_service.toString(),
      platform: service.platform.toLowerCase()
    });

    navigate(`/${language}/dashboard?${params.toString()}#new-order`);
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
              <div className="space-y-6">
                <ServiceFilters 
                  services={services} 
                  selectedPlatform={selectedPlatform} 
                  selectedServiceType={selectedServiceType} 
                  onPlatformChange={handlePlatformChange} 
                  onServiceTypeChange={handleServiceTypeChange} 
                  allowedPlatforms={allowedPlatforms}
                  onBuyClick={handleBuyClick}
                  showOnlyFilters={true}
                />

                {selectedService && (
                  <ServiceInfo 
                    serviceDescription={getServiceDescription()} 
                    loading={loadingServiceDetails} 
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </div>
  );
};

export default Order;
