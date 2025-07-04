import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { apiService, Service } from '@/components/ApiService';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, ArrowRight, Star, CheckCircle, Heart, Eye, Users, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedServiceType, setSelectedServiceType] = useState<string | null>(null);
  const navigate = useNavigate();

  // Define allowed platforms and service types
  const ALLOWED_PLATFORMS = ['instagram', 'tiktok', 'youtube', 'facebook'];
  const ALLOWED_SERVICE_TYPES = ['like', 'view', 'follow', 'likes', 'views', 'followers', 'subscriber', 'subscribers'];

  const PLATFORM_ICONS = {
    instagram: '📷',
    tiktok: '🎵',
    youtube: '▶️',
    facebook: '👤'
  };

  const SERVICE_TYPE_ICONS = {
    like: Heart,
    view: Eye,
    follow: Users,
    subscriber: UserPlus
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (searchParams.get('platform')) {
      setSelectedPlatform(searchParams.get('platform'));
    }
  }, [searchParams]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await apiService.getServices();
      
      // Filter services to only include allowed platforms and service types
      const filteredData = data.filter(service => {
        const platformMatch = ALLOWED_PLATFORMS.includes(service.platform.toLowerCase());
        const serviceTypeMatch = ALLOWED_SERVICE_TYPES.some(type => 
          service.type_name.toLowerCase().includes(type) || 
          service.public_name.toLowerCase().includes(type)
        );
        return platformMatch && serviceTypeMatch;
      });
      
      setServices(filteredData);
    } catch (error) {
      toast.error('Failed to load services. Please try again.');
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const getServicesByPlatform = (platform: string) => {
    return services.filter(service => 
      service.platform.toLowerCase() === platform.toLowerCase()
    );
  };

  const getServiceTypeForPlatform = (platform: string) => {
    const platformServices = getServicesByPlatform(platform);
    const serviceTypes = [...new Set(platformServices.map(service => {
      const typeName = service.type_name.toLowerCase();
      const publicName = service.public_name.toLowerCase();
      
      if (typeName.includes('like') || publicName.includes('like')) return 'like';
      if (typeName.includes('view') || publicName.includes('view')) return 'view';
      if (typeName.includes('follow') || publicName.includes('follow')) {
        // For YouTube, show 'subscriber' instead of 'follow'
        return platform.toLowerCase() === 'youtube' ? 'subscriber' : 'follow';
      }
      if (typeName.includes('subscriber') || publicName.includes('subscriber')) return 'subscriber';
      return null;
    }).filter(Boolean))];
    
    return serviceTypes;
  };

  const getServicesByTypeAndPlatform = (platform: string, serviceType: string) => {
    const platformServices = getServicesByPlatform(platform);
    return platformServices.filter(service => {
      const typeName = service.type_name.toLowerCase();
      const publicName = service.public_name.toLowerCase();
      
      if (serviceType === 'like') {
        return typeName.includes('like') || publicName.includes('like');
      }
      if (serviceType === 'view') {
        return typeName.includes('view') || publicName.includes('view');
      }
      if (serviceType === 'follow') {
        return typeName.includes('follow') || publicName.includes('follow');
      }
      if (serviceType === 'subscriber') {
        return typeName.includes('subscriber') || publicName.includes('subscriber') || 
               typeName.includes('follow') || publicName.includes('follow');
      }
      return false;
    });
  };

  const formatPrice = (service: Service) => {
    if (service.prices && service.prices.length > 0) {
      const firstPrice = service.prices[0];
      const price = parseFloat(firstPrice.price);
      const pricingPer = parseInt(firstPrice.pricing_per);
      return `$${price.toFixed(2)} per ${pricingPer.toLocaleString()}`;
    }
    return 'Contact for pricing';
  };

  const getMinQuantity = (service: Service) => {
    return parseInt(service.amount_minimum).toLocaleString();
  };

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      youtube: 'bg-red-500',
      instagram: 'bg-pink-500',
      tiktok: 'bg-purple-500',
      telegram: 'bg-blue-400',
    };
    return colors[platform.toLowerCase()] || 'bg-gray-500';
  };

  const getServiceTypeLabel = (serviceType: string, platform: string) => {
    if (serviceType === 'subscriber' && platform.toLowerCase() === 'youtube') {
      return 'Subscriber';
    }
    return serviceType.charAt(0).toUpperCase() + serviceType.slice(1);
  };

  const renderServiceCard = (service: Service) => {
    const { user } = useAuth();

    const handleOrderClick = () => {
      if (!user) {
        toast.error('Sifariş vermək üçün hesabınıza daxil olun');
        navigate('/auth');
        return;
      }
      navigate(`/order?service=${service.id_service}`);
    };

    return (
      <Card key={service.id_service} className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge 
              className={`${getPlatformColor(service.platform)} text-white`}
            >
              {service.platform.charAt(0).toUpperCase() + service.platform.slice(1)}
            </Badge>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">4.9</span>
            </div>
          </div>
          <CardTitle className="text-lg">{service.public_name}</CardTitle>
          <CardDescription className="text-sm">
            {service.type_name.charAt(0).toUpperCase() + service.type_name.slice(1)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Starting Price:</span>
              <span className="font-semibold">{formatPrice(service)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Min. Quantity:</span>
              <span className="font-semibold">{getMinQuantity(service)}</span>
            </div>
            {service.example && (
              <div className="text-sm">
                <span className="text-muted-foreground">Example: </span>
                <code className="text-xs bg-muted px-1 py-0.5 rounded">
                  {service.example}
                </code>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {service.is_geo === '1' && (
              <Badge variant="outline" className="text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Geo-targeted
              </Badge>
            )}
            {service.is_drip === '1' && (
              <Badge variant="outline" className="text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Drip-feed
              </Badge>
            )}
          </div>

          <Button onClick={handleOrderClick} className="w-full">
            Order Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading services...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Social Media Marketing Services
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Instagram, TikTok, YouTube və Facebook üçün Like, View və Follow xidmətləri
            </p>
          </div>
        </div>
      </section>

      {/* Platform Selection */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">Choose Platform</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {ALLOWED_PLATFORMS.map(platform => (
              <Card 
                key={platform}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedPlatform === platform ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => {
                  setSelectedPlatform(platform);
                  setSelectedServiceType(null);
                }}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{PLATFORM_ICONS[platform as keyof typeof PLATFORM_ICONS]}</div>
                  <h3 className="font-semibold capitalize">{platform}</h3>
                  <p className="text-sm text-muted-foreground">
                    {getServicesByPlatform(platform).length} services
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Type Selection */}
      {selectedPlatform && (
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-center mb-6">
              Choose Service Type for {selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {getServiceTypeForPlatform(selectedPlatform).map(serviceType => {
                const IconComponent = SERVICE_TYPE_ICONS[serviceType as keyof typeof SERVICE_TYPE_ICONS];
                return (
                  <Card 
                    key={serviceType}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedServiceType === serviceType ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedServiceType(serviceType)}
                  >
                    <CardContent className="p-4 text-center">
                      <IconComponent className="h-6 w-6 mx-auto mb-2" />
                      <h3 className="font-semibold">
                        {getServiceTypeLabel(serviceType, selectedPlatform)}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {getServicesByTypeAndPlatform(selectedPlatform, serviceType).length} options
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Services Grid */}
      {selectedPlatform && selectedServiceType && (
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-center mb-8">
              {getServiceTypeLabel(selectedServiceType, selectedPlatform)} Services for {selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getServicesByTypeAndPlatform(selectedPlatform, selectedServiceType).map(renderServiceCard)}
            </div>
          </div>
        </section>
      )}

      {/* Initial state message */}
      {!selectedPlatform && (
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-muted-foreground">Select a social media platform above to view available services</p>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Services;
