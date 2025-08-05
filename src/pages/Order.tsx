
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ShoppingCart } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ServiceFilters } from '@/components/order/ServiceFilters';
import { proxyApiService, Service } from '@/components/ProxyApiService';
import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import AuthDialog from '@/components/auth/AuthDialog';
import { useServiceNames } from '@/hooks/useServiceNames';

const Order = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { settings, loading: settingsLoading } = useSettings();
  const { user, loading: authLoading } = useAuth();
  const { getCustomServiceName } = useServiceNames();

  // Auth states
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  // State management
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('');
  const urlPlatform = searchParams.get('platform');

  const [allowedPlatforms, setAllowedPlatforms] = useState<string[]>([]);

  // Helper function to determine service type from name
  const getServiceTypeFromName = (serviceName: string): string => {
    const name = serviceName.toLowerCase();
    if (name.includes('like') || name.includes('bəyən')) return 'Likes';
    if (name.includes('follow') || name.includes('izləyici')) return 'Followers';
    if (name.includes('view') || name.includes('baxış')) return 'Views';
    if (name.includes('share') || name.includes('paylaş')) return 'Shares';
    if (name.includes('comment') || name.includes('şərh')) return 'Comments';
    return 'Other';
  };

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

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);
    setSelectedServiceType('');
  };

  const handleServiceTypeChange = (serviceType: string) => {
    setSelectedServiceType(serviceType);
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

    navigate(`/${language}/dashboard?${params.toString()}#orders`);
  };

  // Get filtered services for display
  const getDisplayServices = () => {
    if (!selectedPlatform) return [];
    
    let filteredServices = services.filter(service => 
      service.platform.toLowerCase() === selectedPlatform.toLowerCase()
    );

    if (selectedServiceType) {
      filteredServices = filteredServices.filter(service => {
        const serviceType = service.type_name && service.type_name.trim() !== '' 
          ? service.type_name 
          : getServiceTypeFromName(service.public_name);
        return serviceType.toLowerCase().includes(selectedServiceType.toLowerCase());
      });
    }

    // Sort by price (lowest first)
    return filteredServices.sort((a, b) => {
      if (!a.prices || !b.prices || a.prices.length === 0 || b.prices.length === 0) {
        return 0;
      }
      const priceA = parseFloat(a.prices[0].price);
      const priceB = parseFloat(b.prices[0].price);
      return priceA - priceB;
    });
  };

  const calculateDisplayPrice = (service: Service) => {
    if (!service.prices || service.prices.length === 0) {
      return '0.00';
    }

    const basePrice = parseFloat(service.prices[0].price);
    const pricingPer = parseFloat(service.prices[0].pricing_per);
    const quantity = 1000; // Default display quantity
    
    const totalCost = (basePrice / pricingPer) * quantity;
    const serviceFee = (totalCost * settings.service_fee) / 100;
    const finalPrice = totalCost + serviceFee + settings.base_fee;
    
    return finalPrice.toFixed(2);
  };

  const displayServices = getDisplayServices();

  if (loading || settingsLoading || authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <span className="text-lg">{t('order.servicesLoading')}</span>
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
                {/* Platform and Service Type Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ServiceFilters 
                    services={services} 
                    selectedPlatform={selectedPlatform} 
                    selectedServiceType={selectedServiceType} 
                    onPlatformChange={handlePlatformChange} 
                    onServiceTypeChange={handleServiceTypeChange} 
                    allowedPlatforms={allowedPlatforms}
                    selectedService={null}
                    formData={{ serviceId: '', url: '', quantity: '', additionalParams: {} }}
                    errors={{}}
                    onUpdateFormData={() => {}}
                    onUpdateAdditionalParam={() => {}}
                    onPlaceOrder={() => {}}
                    placing={false}
                    calculatedPrice={0}
                    serviceFeePercentage={settings.service_fee}
                    baseFee={settings.base_fee}
                    showOnlyFilters={true}
                  />
                </div>

                {/* Services List */}
                {displayServices.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Mövcud Xidmətlər</h3>
                    <div className="space-y-3">
                      {displayServices.map((service) => (
                        <div 
                          key={service.id_service} 
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-base mb-1">
                              {getCustomServiceName(service.public_name)}
                            </h4>
                            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                              <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs">
                                1000 ədəd üçün
                              </span>
                              {service.amount_minimum && (
                                <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs">
                                  Min: {parseInt(service.amount_minimum).toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary">
                                ${calculateDisplayPrice(service)}
                              </div>
                            </div>
                            <Button 
                              onClick={() => handleBuyClick(service)}
                              className="bg-primary hover:bg-primary/90"
                              size="default"
                            >
                              Buy Now
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedPlatform && selectedServiceType && displayServices.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Seçilmiş kriterlərə uyğun xidmət tapılmadı
                  </div>
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
