
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import AuthDialog from '@/components/AuthDialog';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiService, Service } from '@/components/ApiService';
import { Loader2, Zap, Star, Instagram, Youtube, Facebook } from 'lucide-react';
import { toast } from 'sonner';

const Services = () => {
  const { user } = useAuth();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const defaultPlatform = searchParams.get('platform') || 'all';
  
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState(defaultPlatform);
  const [selectedServiceType, setSelectedServiceType] = useState<string>('all');

  // Yalnız bu 4 platformu göstər
  const allowedPlatforms = ['instagram', 'tiktok', 'youtube', 'facebook'];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await apiService.getServices();
      // Yalnız icazə verilən platformlardakı xidmətləri göstər və boş data-ları filter et
      const filteredData = data.filter(service => 
        service && 
        service.platform && 
        allowedPlatforms.includes(service.platform.toLowerCase()) &&
        service.type_name &&
        service.type_name.trim() !== ''
      );
      setServices(filteredData);
      console.log('Filtered services:', filteredData);
    } catch (error) {
      toast.error('Xidmətlər yüklənərkən xəta baş verdi');
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = (serviceId: string) => {
    if (user) {
      navigate(`/order?service=${serviceId}`);
    } else {
      setIsAuthDialogOpen(true);
    }
  };

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      youtube: 'bg-red-500',
      instagram: 'bg-pink-500',
      tiktok: 'bg-purple-500',
      facebook: 'bg-blue-500',
    };
    return colors[platform.toLowerCase()] || 'bg-gray-500';
  };

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, any> = {
      instagram: Instagram,
      youtube: Youtube,
      facebook: Facebook,
      tiktok: () => <div className="w-4 h-4 bg-current rounded-sm" />,
    };
    return icons[platform.toLowerCase()] || null;
  };

  const getUniquePlatforms = () => {
    const platforms = services
      .map(service => service.platform)
      .filter(platform => platform && allowedPlatforms.includes(platform.toLowerCase()))
      .map(platform => platform.toLowerCase());
    return [...new Set(platforms)];
  };

  const getUniqueServiceTypes = (platform: string) => {
    const platformServices = services.filter(service => {
      if (platform === 'all') return true;
      return service.platform && service.platform.toLowerCase() === platform.toLowerCase();
    });
    
    const types = platformServices
      .map(service => service.type_name)
      .filter(type => type && type.trim() !== ''); // Boş və null type_name-ləri filter et
    
    return [...new Set(types)];
  };

  const getFilteredServices = () => {
    let filtered = services;

    // Platform filteri
    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(service => 
        service.platform && service.platform.toLowerCase() === selectedPlatform.toLowerCase()
      );
    }

    // Xidmət növü filteri
    if (selectedServiceType !== 'all') {
      filtered = filtered.filter(service => 
        service.type_name === selectedServiceType
      );
    }

    return filtered;
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
    <>
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Sosial Media <span className="text-primary">Xidmətləri</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Instagram, TikTok, YouTube və Facebook üçün keyfiyyətli SMM xidmətləri
            </p>
          </div>

          <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="all">Hamısı</TabsTrigger>
              {getUniquePlatforms().map((platform) => {
                const IconComponent = getPlatformIcon(platform);
                return (
                  <TabsTrigger key={platform} value={platform} className="capitalize flex items-center gap-2">
                    {IconComponent && <IconComponent className="w-4 h-4" />}
                    {platform}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value={selectedPlatform}>
              {/* Xidmət növü filteri */}
              <div className="mb-6">
                <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Xidmət növünü seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Bütün xidmət növləri</SelectItem>
                    {getUniqueServiceTypes(selectedPlatform)
                      .filter(type => type && type.trim() !== '') // Əlavə təhlükəsizlik
                      .map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredServices().map((service) => {
                  // Service data-nın mövcudluğunu yoxla
                  if (!service || !service.id_service || !service.platform) {
                    return null;
                  }

                  const IconComponent = getPlatformIcon(service.platform);
                  const price = service.prices && service.prices[0] ? service.prices[0].price : '0';
                  const pricingPer = service.prices && service.prices[0] ? service.prices[0].pricing_per : '1K';
                  const maximum = service.prices && service.prices[0] ? service.prices[0].maximum : '0';

                  return (
                    <Card key={service.id_service} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <Badge className={`${getPlatformColor(service.platform)} text-white flex items-center gap-1`}>
                            {IconComponent && <IconComponent className="w-3 h-3" />}
                            {service.platform}
                          </Badge>
                          <Badge variant="secondary">
                            ${price}/{pricingPer}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl">{service.public_name || 'Xidmət'}</CardTitle>
                        <CardDescription>{service.type_name || 'Növ göstərilməyib'}</CardDescription>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Min: {parseInt(service.amount_minimum || '0').toLocaleString()}</span>
                          <span>Max: {parseInt(maximum).toLocaleString()}</span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Star className="h-3 w-3 text-yellow-500" />
                            Keyfiyyətli xidmət
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Star className="h-3 w-3 text-yellow-500" />
                            Sürətli çatdırılma
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Star className="h-3 w-3 text-yellow-500" />
                            24/7 Dəstək
                          </div>
                        </div>
                        
                        <Button 
                          className="w-full" 
                          onClick={() => handleOrderClick(service.id_service)}
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Sifariş ver
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {getFilteredServices().length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    Seçilən filterlərə uyğun xidmət tapılmadı
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <Footer />
      </div>

      <AuthDialog 
        open={isAuthDialogOpen} 
        onOpenChange={setIsAuthDialogOpen} 
      />
    </>
  );
};

export default Services;
