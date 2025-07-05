
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
import { Loader2, Zap, Star, ArrowLeft, Instagram, Youtube, Facebook } from 'lucide-react';
import { toast } from 'sonner';

const Services = () => {
  const { user } = useAuth();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

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
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      textColor: 'text-white'
    },
    {
      name: 'youtube',
      displayName: 'YouTube',
      icon: Youtube,
      color: 'bg-red-500',
      textColor: 'text-white'
    },
    {
      name: 'tiktok',
      displayName: 'TikTok',
      icon: ({ className }: { className?: string }) => (
        <div className={`${className} flex items-center justify-center font-bold text-xl`}>
          <span>TT</span>
        </div>
      ),
      color: 'bg-black',
      textColor: 'text-white'
    },
    {
      name: 'facebook',
      displayName: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600',
      textColor: 'text-white'
    }
  ];

  const getFilteredServices = () => {
    if (!selectedPlatform) return [];
    return services.filter(service => 
      service.platform.toLowerCase() === selectedPlatform.toLowerCase()
    );
  };

  const groupServicesByType = (services: Service[]) => {
    const grouped: Record<string, Service[]> = {};
    services.forEach(service => {
      const type = service.type_name || 'Digər';
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(service);
    });
    return grouped;
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
            // Platform selection view
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <Card 
                    key={platform.name}
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                    onClick={() => setSelectedPlatform(platform.name)}
                  >
                    <CardContent className="p-8 text-center">
                      <div className={`${platform.color} ${platform.textColor} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="h-10 w-10" />
                      </div>
                      <h3 className="text-xl font-semibold">{platform.displayName}</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        {services.filter(s => s.platform.toLowerCase() === platform.name).length} xidmət
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            // Services view for selected platform
            <div>
              <div className="flex items-center mb-8">
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
                        <div className={`${platform.color} ${platform.textColor} w-10 h-10 rounded-full flex items-center justify-center mr-3`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <h2 className="text-2xl font-bold">{platform.displayName} Xidmətləri</h2>
                      </>
                    );
                  })()}
                </div>
              </div>

              {(() => {
                const filteredServices = getFilteredServices();
                const groupedServices = groupServicesByType(filteredServices);
                
                if (filteredServices.length === 0) {
                  return (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">Bu platform üçün hələ xidmət mövcud deyil.</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-12">
                    {Object.entries(groupedServices).map(([type, typeServices]) => (
                      <div key={type} className="bg-card rounded-lg border p-6">
                        <div className="mb-6">
                          <h3 className="text-2xl font-bold text-primary mb-2">{type}</h3>
                          <div className="h-1 w-20 bg-primary rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {typeServices.map((service) => (
                            <Card key={service.id_service} className="hover:shadow-lg transition-shadow">
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                                    ${service.prices[0]?.price || '0'}/{service.prices[0]?.pricing_per || '1K'}
                                  </Badge>
                                </div>
                                <CardTitle className="text-lg">{service.public_name}</CardTitle>
                                <CardDescription className="text-muted-foreground">
                                  {service.type_name}
                                </CardDescription>
                              </CardHeader>
                              
                              <CardContent className="space-y-4">
                                <div className="flex justify-between text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                                  <span>Min: {parseInt(service.amount_minimum).toLocaleString()}</span>
                                  <span>Max: {parseInt(service.prices[0]?.maximum || '0').toLocaleString()}</span>
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm text-green-600">
                                    <Star className="h-3 w-3 fill-current" />
                                    Keyfiyyətli xidmət
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-blue-600">
                                    <Star className="h-3 w-3 fill-current" />
                                    Sürətli çatdırılma
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-purple-600">
                                    <Star className="h-3 w-3 fill-current" />
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
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
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
