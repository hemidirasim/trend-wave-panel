
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import AuthDialog from '@/components/AuthDialog';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiService, Service } from '@/components/ApiService';
import { Loader2, Zap, Star, Instagram, Youtube, Facebook } from 'lucide-react';
import { toast } from 'sonner';

const platforms = [
  {
    name: 'Instagram',
    key: 'instagram',
    icon: Instagram,
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    logo: '📷'
  },
  {
    name: 'YouTube',
    key: 'youtube',
    icon: Youtube,
    color: 'bg-red-500',
    logo: '▶️'
  },
  {
    name: 'TikTok',
    key: 'tiktok',
    icon: null,
    color: 'bg-black',
    logo: '🎵'
  },
  {
    name: 'Facebook',
    key: 'facebook',
    icon: Facebook,
    color: 'bg-blue-600',
    logo: '📘'
  }
];

const Services = () => {
  const { user } = useAuth();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    const platform = searchParams.get('platform');
    if (platform && platforms.some(p => p.key === platform.toLowerCase())) {
      setSelectedPlatform(platform.toLowerCase());
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedPlatform && services.length > 0) {
      const filtered = services.filter(service => 
        service.platform.toLowerCase() === selectedPlatform.toLowerCase()
      );
      setFilteredServices(filtered);
    }
  }, [selectedPlatform, services]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await apiService.getServices();
      // Filter services to only include our supported platforms
      const supportedServices = data.filter(service => 
        platforms.some(platform => 
          platform.key.toLowerCase() === service.platform.toLowerCase()
        )
      );
      setServices(supportedServices);
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

  const handlePlatformClick = (platformKey: string) => {
    setSelectedPlatform(platformKey);
    // Update URL
    navigate(`/services?platform=${platformKey}`);
  };

  const handleBackToPlatforms = () => {
    setSelectedPlatform(null);
    navigate('/services');
  };

  const getServiceTypeGroups = () => {
    const groups: { [key: string]: Service[] } = {};
    filteredServices.forEach(service => {
      const type = service.type_name || 'Digər';
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(service);
    });
    return groups;
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
              Bütün platformalar üçün keyfiyyətli və sürətli SMM xidmətləri
            </p>
          </div>

          {!selectedPlatform ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {platforms.map((platform) => {
                const serviceCount = services.filter(s => 
                  s.platform.toLowerCase() === platform.key.toLowerCase()
                ).length;
                
                return (
                  <Card 
                    key={platform.key}
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                    onClick={() => handlePlatformClick(platform.key)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${platform.color} flex items-center justify-center text-white text-2xl shadow-lg`}>
                        {platform.icon ? (
                          <platform.icon className="h-8 w-8" />
                        ) : (
                          <span className="text-2xl">{platform.logo}</span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{platform.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {serviceCount} xidmət mövcuddur
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div>
              <div className="flex items-center mb-8">
                <Button 
                  variant="outline" 
                  onClick={handleBackToPlatforms}
                  className="mr-4"
                >
                  ← Geri
                </Button>
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-xl ${platforms.find(p => p.key === selectedPlatform)?.color} flex items-center justify-center text-white mr-4`}>
                    {platforms.find(p => p.key === selectedPlatform)?.icon ? (
                      <platforms.find(p => p.key === selectedPlatform)!.icon className="h-6 w-6" />
                    ) : (
                      <span>{platforms.find(p => p.key === selectedPlatform)?.logo}</span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {platforms.find(p => p.key === selectedPlatform)?.name} Xidmətləri
                    </h2>
                    <p className="text-muted-foreground">
                      {filteredServices.length} xidmət mövcuddur
                    </p>
                  </div>
                </div>
              </div>

              {filteredServices.length > 0 ? (
                <div className="space-y-8">
                  {Object.entries(getServiceTypeGroups()).map(([typeName, typeServices]) => (
                    <div key={typeName}>
                      <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <Star className="h-5 w-5 mr-2 text-yellow-500" />
                        {typeName}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {typeServices.map((service) => (
                          <Card key={service.id_service} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="secondary" className="text-xs">
                                  {service.platform}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  ${service.prices[0]?.price || '0'}/{service.prices[0]?.pricing_per || '1K'}
                                </Badge>
                              </div>
                              <CardTitle className="text-lg leading-tight">{service.public_name}</CardTitle>
                            </CardHeader>
                            
                            <CardContent className="space-y-3">
                              <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Min: {parseInt(service.amount_minimum).toLocaleString()}</span>
                                <span>Max: {parseInt(service.prices[0]?.maximum || '0').toLocaleString()}</span>
                              </div>
                              
                              <div className="flex items-center gap-2 text-sm text-green-600">
                                <Star className="h-3 w-3" />
                                Keyfiyyətli və Sürətli
                              </div>
                              
                              <Button 
                                className="w-full" 
                                size="sm"
                                onClick={() => handleOrderClick(service.id_service)}
                              >
                                <Zap className="h-4 w-4 mr-2" />
                                Sifariş ver
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold mb-2">Xidmət tapılmadı</h3>
                  <p className="text-muted-foreground">
                    Bu platform üçün hazırda xidmət mövcud deyil
                  </p>
                </div>
              )}
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
