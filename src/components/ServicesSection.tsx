
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Heart, UserPlus, Eye } from 'lucide-react';

interface ApiService {
  id_service: number;
  public_name: string;
  amount_minimum: number;
  amount_increment: number;
  platform: string;
  example: string;
  prices: Array<{
    price: string;
    minimum: number;
    maximum: number;
    pricing_per: number;
  }>;
}

const platformIcons: Record<string, any> = {
  Instagram: Heart,
  TikTok: UserPlus,
  YouTube: Eye
};

export const ServicesSection = () => {
  const [apiServices, setApiServices] = useState<ApiService[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApiServices();
  }, []);

  const fetchApiServices = async () => {
    setLoading(true);
    try {
      const response = await fetch('/functions/v1/qqtube-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'services'
        })
      });

      if (!response.ok) throw new Error('API xətası');
      
      const data = await response.json();
      setApiServices((data || []).slice(0, 8)); // İlk 8 xidməti göstər
    } catch (error) {
      console.error('Error fetching API services:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="services-section" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5"></div>
      <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-full blur-2xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium bg-white/80 backdrop-blur-sm border border-primary/20">
            <Target className="h-4 w-4 mr-2" />
            Sosial Media Xidmətləri
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Populyar Xidmətlər
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Sosial media hesablarınızı böyütmək üçün keyfiyyətli xidmətlər
          </p>
        </div>
        
        {loading ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-muted-foreground">Xidmətlər yüklənir...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {apiServices.map((service, index) => {
              const IconComponent = platformIcons[service.platform] || Heart;
              const colors = [
                'from-pink-500 to-rose-500',
                'from-green-500 to-blue-500', 
                'from-red-500 to-orange-500',
                'from-blue-500 to-purple-500',
                'from-purple-500 to-pink-500',
                'from-blue-500 to-teal-500',
                'from-orange-500 to-red-500',
                'from-blue-600 to-blue-800'
              ];
              const color = colors[index % colors.length];
              
              return (
                <Card key={service.id_service} className="bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 cursor-pointer group border border-primary/10 hover:border-primary/20 hover:scale-105">
                  <CardHeader className="text-center pb-4">
                    <div className={`w-20 h-20 bg-gradient-to-br ${color} rounded-2xl mx-auto mb-4 flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground">{service.public_name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Platform: {service.platform}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Min: {service.amount_minimum}
                      </p>
                      {service.prices?.[0] && (
                        <p className="text-sm font-semibold text-primary">
                          ${service.prices[0].price}/1000
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
