
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

  // Auth states
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  // State management
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state for filtering
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('');
  const [priceFilter, setPriceFilter] = useState<'low-to-high' | 'high-to-low'>('low-to-high');
  const urlPlatform = searchParams.get('platform');

  const [allowedPlatforms, setAllowedPlatforms] = useState<string[]>([]);

  // Define getServiceTypeFromName function before using it
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
      // Get all unique platforms from API
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

  const handleBuyClick = (service: Service) => {
    if (!user) {
      setAuthDialogOpen(true);
      return;
    }

    // Navigate to dashboard with service pre-selected
    navigate(`/dashboard?service=${service.id_service}&platform=${service.platform.toLowerCase()}`);
  };

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);
    setSelectedServiceType('');
  };

  const handleServiceTypeChange = (serviceType: string) => {
    setSelectedServiceType(serviceType);
  };

  // Filter services based on selected platform and service type
  const filteredServices = services.filter(service => {
    if (selectedPlatform && service.platform.toLowerCase() !== selectedPlatform) {
      return false;
    }
    
    if (selectedServiceType && selectedServiceType !== 'all') {
      const serviceType = service.type_name && service.type_name.trim() !== '' 
        ? service.type_name 
        : getServiceTypeFromName(service.public_name);
      if (serviceType !== selectedServiceType) {
        return false;
      }
    }
    
    return true;
  });

  // Sort services by price
  const sortedServices = [...filteredServices].sort((a, b) => {
    const priceA = parseFloat(a.prices?.[0]?.price || '0');
    const priceB = parseFloat(b.prices?.[0]?.price || '0');
    
    if (priceFilter === 'low-to-high') {
      return priceA - priceB;
    } else {
      return priceB - priceA;
    }
  });

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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Available Services
              </CardTitle>
              <CardDescription>Browse and select services to order</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="mb-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Platform Filter */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Platform</label>
                    <select
                      value={selectedPlatform}
                      onChange={(e) => handlePlatformChange(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">All Platforms</option>
                      {allowedPlatforms.map(platform => (
                        <option key={platform} value={platform}>
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Service Type Filter */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Service Type</label>
                    <select
                      value={selectedServiceType}
                      onChange={(e) => handleServiceTypeChange(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">All Types</option>
                      <option value="Likes">Likes</option>
                      <option value="Followers">Followers</option>
                      <option value="Views">Views</option>
                      <option value="Shares">Shares</option>
                      <option value="Comments">Comments</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Price Filter */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Sort by Price</label>
                    <select
                      value={priceFilter}
                      onChange={(e) => setPriceFilter(e.target.value as 'low-to-high' | 'high-to-low')}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="low-to-high">Price: Low to High</option>
                      <option value="high-to-low">Price: High to Low</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedServices.map((service) => {
                  const price = parseFloat(service.prices?.[0]?.price || '0');
                  const minQuantity = parseInt(service.amount_minimum) || 1;
                  const maxQuantity = parseInt(service.prices?.[0]?.maximum) || 10000;
                  
                  return (
                    <Card key={service.id_service} className="relative">
                      <CardContent className="p-4">
                        <div className="mb-3">
                          <h3 className="font-semibold text-sm line-clamp-2 mb-2">
                            {service.public_name}
                          </h3>
                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                            <span className="capitalize">{service.platform}</span>
                            <span className="font-semibold text-primary">
                              ${(price * 1000).toFixed(2)}/1K
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Min: {minQuantity.toLocaleString()} | Max: {maxQuantity.toLocaleString()}
                          </div>
                        </div>
                        
                        <Button
                          onClick={() => handleBuyClick(service)}
                          className="w-full"
                          size="sm"
                        >
                          Buy Now
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {sortedServices.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No services found matching your criteria.</p>
                </div>
              )}
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
