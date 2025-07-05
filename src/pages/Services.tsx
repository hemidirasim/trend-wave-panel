
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
  const defaultPlatform = searchParams.get('platform') || '';
  
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState(defaultPlatform);
  const [selectedServiceType, setSelectedServiceType] = useState<string>('');

  // Yalnız bu 4 platformu göstər
  const allowedPlatforms = ['instagram', 'tiktok', 'youtube', 'facebook'];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      console.log('Fetching services from API...');
      const data = await apiService.getServices();
      console.log('Raw API response:', data);
      
      // API-dən gələn məlumatları filterlə
      const filteredData = data.filter(service => {
        // Service mövcudluğunu yoxla
        if (!service || !service.platform || !service.id_service) {
          console.log('Skipping invalid service:', service);
          return false;
        }
        
        // Platform yoxla
        const platformMatch = allowedPlatforms.includes(service.platform.toLowerCase());
        if (!platformMatch) {
          console.log('Platform not allowed:', service.platform);
          return false;
        }
        
        // Qiymət məlumatlarını yoxla
        if (!service.prices || service.prices.length === 0) {
          console.log('No pricing info for service:', service.id_service);
          return false;
        }
        
        return true;
      });
      
      console.log('Filtered services:', filteredData);
      setServices(filteredData);
      
      if (filteredData.length === 0) {
        toast.error('Seçilmiş platformlar üçün xidmət tapılmadı');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Xidmətlər yüklənərkən xəta baş verdi');
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
      .map(service => service.platform.toLowerCase())
      .filter(platform => allowedPlatforms.includes(platform));
    return [...new Set(platforms)];
  };

  const getUniqueServiceTypes = (platform: string) => {
    const platformServices = services.filter(service => 
      service.platform.toLowerCase() === platform.toLowerCase()
    );
    
    // type_name-dən service növlərini çıxar
    const types = platformServices
      .map(service => {
        if (service.type_name && service.type_name.trim() !== '') {
          return service.type_name;
        }
        // Əgər type_name yoxdursa, public_name-dən çıxarmağa çalış
        if (service.public_name) {
          const name = service.public_name.toLowerCase();
          if (name.includes('like')) return 'Likes';
          if (name.includes('follow')) return 'Followers';
          if (name.includes('view')) return 'Views';
          if (name.includes('share')) return 'Shares';
          if (name.includes('comment')) return 'Comments';
          if (name.includes('repost')) return 'Reposts';
        }
        return 'Other';
      })
      .filter(type => type && type.trim() !== '');
    
    return [...new Set(types)];
  };

  const getFilteredServices = () => {
    if (!selectedPlatform || !selectedServiceType) {
      return [];
    }

    let filtered = services.filter(service => 
      service.platform.toLowerCase() === selectedPlatform.toLowerCase()
    );

    // Xidmət növü filteri
    filtered = filtered.filter(service => {
      const serviceType = service.type_name && service.type_name.trim() !== '' 
        ? service.type_name 
        : getServiceTypeFromName(service.public_name);
      return serviceType === selectedServiceType;
    });

    return filtered;
  };

  const getServiceTypeFromName = (publicName: string) => {
    if (!publicName) return 'Other';
    const name = publicName.toLowerCase();
    if (name.includes('like')) return 'Likes';
    if (name.includes('follow')) return 'Followers';
    if (name.includes('view')) return 'Views';
    if (name.includes('share')) return 'Shares';
    if (name.includes('comment')) return 'Comments';
    if (name.includes('repost')) return 'Reposts';
    return 'Other';
  };

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);
    setSelectedServiceType(''); // Reset service type when platform changes
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

          <Tabs value={selectedPlatform} onValueChange={handlePlatformChange} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
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

            {getUniquePlatforms().map((platform) => (
              <TabsContent key={platform} value={platform}>
                {/* Xidmət növü seçimi - yalnız platform seçildikdə göstər */}
                {selectedPlatform && (
                  <div className="mb-6">
                    <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
                      <SelectTrigger className="w-[300px]">
                        <SelectValue placeholder="Xidmət növünü seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {getUniqueServiceTypes(selectedPlatform).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Xidmətlər - yalnız həm platform həm də növ seçildikdə göstər */}
                {selectedPlatform && selectedServiceType && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getFilteredServices().map((service) => {
                      const IconComponent = getPlatformIcon(service.platform);
                      const price = service.prices?.[0]?.price || '0';
                      const pricingPer = service.prices?.[0]?.pricing_per || '1K';
                      const maximum = service.prices?.[0]?.maximum || '0';
                      const serviceType = service.type_name && service.type_name.trim() !== '' 
                        ? service.type_name 
                        : getServiceTypeFromName(service.public_name);

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
                            <CardDescription>{serviceType}</CardDescription>
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
                              onClick={() => handleOrderClick(service.id_service.toString())}
                            >
                              <Zap className="h-4 w-4 mr-2" />
                              Sifariş ver
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}

                {/* Mesajlar */}
                {selectedPlatform && !selectedServiceType && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                      Xidmətləri görmək üçün yuxarıdan xidmət növünü seçin
                    </p>
                  </div>
                )}

                {selectedPlatform && selectedServiceType && getFilteredServices().length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                      Seçilən növə uyğun xidmət tapılmadı
                    </p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>

          {/* Heç bir platform seçilməyibsə mesaj göstər */}
          {!selectedPlatform && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Xidmətləri görmək üçün yuxarıdan sosial şəbəkə seçin
              </p>
            </div>
          )}
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
