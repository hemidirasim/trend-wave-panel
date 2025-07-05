
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import AuthDialog from '@/components/AuthDialog';
import { useNavigate } from 'react-router-dom';
import { apiService, Service } from '@/components/ApiService';
import { Loader2, Zap, Star, ArrowLeft, Instagram, Youtube, Facebook, User, Eye, Heart } from 'lucide-react';
import { toast } from 'sonner';

const Services = () => {
  const { user } = useAuth();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedServiceType, setSelectedServiceType] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await apiService.getServices();
      setServices(data);
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

  const platforms = [
    {
      name: 'instagram',
      displayName: 'Instagram',
      icon: Instagram,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    {
      name: 'youtube',
      displayName: 'Youtube',
      icon: Youtube,
      color: 'bg-red-500'
    },
    {
      name: 'tiktok',
      displayName: 'Tiktok',
      icon: ({ className }: { className?: string }) => (
        <div className={`${className} flex items-center justify-center font-bold text-xl`}>
          ♪
        </div>
      ),
      color: 'bg-black'
    },
    {
      name: 'facebook',
      displayName: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600'
    }
  ];

  const getServiceTypeIcon = (typeName: string) => {
    const lowerType = typeName.toLowerCase();
    if (lowerType.includes('like') || lowerType.includes('bəyənmə')) return Heart;
    if (lowerType.includes('follow') || lowerType.includes('izləyici')) return User;
    if (lowerType.includes('view') || lowerType.includes('baxış')) return Eye;
    return Star;
  };

  const getUniqueServiceTypes = () => {
    if (!selectedPlatform) return [];
    
    const platformServices = services.filter(service => 
      service.platform.toLowerCase() === selectedPlatform.toLowerCase()
    );
    
    const uniqueTypes = new Map();
    platformServices.forEach(service => {
      if (!uniqueTypes.has(service.type_name)) {
        uniqueTypes.set(service.type_name, {
          name: service.type_name,
          count: platformServices.filter(s => s.type_name === service.type_name).length,
          icon: getServiceTypeIcon(service.type_name)
        });
      }
    });
    
    return Array.from(uniqueTypes.values());
  };

  const getServicesForType = () => {
    if (!selectedPlatform || !selectedServiceType) return [];
    return services.filter(service => 
      service.platform.toLowerCase() === selectedPlatform.toLowerCase() &&
      service.type_name === selectedServiceType
    );
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

          {/* Platform Selection */}
          {!selectedPlatform && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                const serviceCount = services.filter(s => 
                  s.platform.toLowerCase() === platform.name.toLowerCase()
                ).length;
                
                return (
                  <Card 
                    key={platform.name}
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 text-center"
                    onClick={() => setSelectedPlatform(platform.name)}
                  >
                    <CardContent className="p-8">
                      <div className={`${platform.color} text-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="h-10 w-10" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{platform.displayName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {serviceCount} xidmət
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Service Type Selection */}
          {selectedPlatform && !selectedServiceType && (
            <div>
              <div className="flex items-center justify-center mb-8">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedPlatform(null)}
                  className="mr-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Geri
                </Button>
                <div className="flex items-center">
                  {(() => {
                    const platform = platforms.find(p => p.name === selectedPlatform);
                    if (!platform) return null;
                    const Icon = platform.icon;
                    return (
                      <>
                        <div className={`${platform.color} text-white w-10 h-10 rounded-full flex items-center justify-center mr-3`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <h2 className="text-2xl font-bold">{platform.displayName} Xidmət Növləri</h2>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {getUniqueServiceTypes().map((type) => {
                  const Icon = type.icon;
                  return (
                    <Card 
                      key={type.name}
                      className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 text-center"
                      onClick={() => setSelectedServiceType(type.name)}
                    >
                      <CardContent className="p-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Icon className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{type.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {type.count} xidmət
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Services List */}
          {selectedPlatform && selectedServiceType && (
            <div>
              <div className="flex items-center justify-center mb-8">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedServiceType(null)}
                  className="mr-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Geri
                </Button>
                <div className="flex items-center">
                  {(() => {
                    const platform = platforms.find(p => p.name === selectedPlatform);
                    if (!platform) return null;
                    const Icon = platform.icon;
                    const TypeIcon = getServiceTypeIcon(selectedServiceType);
                    return (
                      <>
                        <div className={`${platform.color} text-white w-8 h-8 rounded-full flex items-center justify-center mr-2`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <TypeIcon className="h-6 w-6 text-primary mr-3" />
                        <h2 className="text-2xl font-bold">{platform.displayName} - {selectedServiceType}</h2>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getServicesForType().map((service) => (
                  <Card key={service.id_service} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-primary text-primary-foreground">
                          {(() => {
                            const platform = platforms.find(p => p.name === selectedPlatform);
                            return platform?.displayName || selectedPlatform;
                          })()}
                        </Badge>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                          <span className="text-sm font-medium">4.9</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg leading-tight">{service.public_name}</CardTitle>
                      <CardDescription className="text-sm">
                        Başlanğıc qiymət: <span className="font-semibold text-foreground">
                          ${service.prices[0]?.price || '0'} hər {service.prices[0]?.pricing_per || '1K'}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4 pt-0">
                      <div className="bg-muted/50 p-3 rounded-md">
                        <div className="flex justify-between text-sm">
                          <span>Min: {parseInt(service.amount_minimum).toLocaleString()}</span>
                          <span>Maks: {parseInt(service.prices[0]?.maximum || '0').toLocaleString()}</span>
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
                ))}
              </div>
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
