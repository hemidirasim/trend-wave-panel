
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { proxyApiService, Service } from '@/components/ProxyApiService';
import { useCurrency } from '@/contexts/CurrencyContext';

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { formatAmount } = useCurrency();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const fetchedServices = await proxyApiService.getServices();
        setServices(fetchedServices);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Xidmətlər yüklənir...</div>
        </div>
        <Footer />
      </div>
    );
  }

  const groupedServices = services.reduce((acc, service) => {
    const platform = service.platform || 'Other';
    if (!acc[platform]) {
      acc[platform] = [];
    }
    acc[platform].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Xidmətlərimiz</h1>
        
        {Object.entries(groupedServices).map(([platform, platformServices]) => (
          <div key={platform} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 capitalize">{platform}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {platformServices.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Qiymət:</span>
                        <Badge variant="secondary">
                          {formatAmount(service.rate)} / 1000
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Min:</span>
                        <span>{service.min}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Max:</span>
                        <span>{service.max}</span>
                      </div>
                      <Button className="w-full mt-4">
                        Sifariş ver
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Services;
