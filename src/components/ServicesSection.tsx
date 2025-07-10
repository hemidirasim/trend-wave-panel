
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Instagram, Music, Youtube, Facebook } from 'lucide-react';
import { proxyApiService, Service } from './ProxyApiService';
import { useSettings } from '@/contexts/SettingsContext';
import { Link } from 'react-router-dom';

interface Platform {
  name: string;
  displayName: string;
}

const platformIcons: Record<string, any> = {
  instagram: Instagram,
  tiktok: Music,
  youtube: Youtube,
  facebook: Facebook
};

export const ServicesSection = () => {
  const { settings } = useSettings();
  const [apiServices, setApiServices] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApiServices();
  }, []);

  const fetchApiServices = async () => {
    setLoading(true);
    try {
      const services = await proxyApiService.getServices();
      console.log('🔍 API-dən gələn xidmətlər:', services);
      console.log('🔍 Cari xidmət haqqı:', settings.service_fee);
      
      // Twitter-siz sosial media platformalarını alırıq
      const platforms = [...new Set(services
        .filter(service => 
          ['instagram', 'tiktok', 'youtube', 'facebook'].some(platform => 
            service.platform?.toLowerCase().includes(platform)
          )
        )
        .map(service => service.platform)
        .filter(Boolean)
      )];
      
      // Platform adlarını formatlayırıq
      const formattedPlatforms = platforms.map(platform => ({
        name: platform,
        displayName: platform.charAt(0).toUpperCase() + platform.slice(1).toLowerCase()
      }));
      
      console.log('✅ Sosial media platformaları:', formattedPlatforms);
      setApiServices(formattedPlatforms);
    } catch (error) {
      console.error('Error fetching API services:', error);
      setApiServices([]);
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
        ) : apiServices.length === 0 ? (
          <div className="text-center">
            <p className="text-muted-foreground">Hal-hazırda sosial media xidmətləri mövcud deyil.</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl">
              {apiServices.map((platform, index) => {
                const platformKey = platform.name?.toLowerCase() || '';
                const IconComponent = platformIcons[platformKey] || Instagram;
                const colors = [
                  'from-pink-500 to-rose-500',
                  'from-green-500 to-blue-500', 
                  'from-red-500 to-orange-500',
                  'from-blue-500 to-purple-500',
                  'from-purple-500 to-pink-500',
                  'from-blue-500 to-teal-500'
                ];
                const color = colors[index % colors.length];
                
                return (
                  <Link key={platform.name} to={`/order?platform=${platform.name?.toLowerCase()}`}>
                    <div className="group cursor-pointer">
                      <div className={`w-24 h-24 bg-gradient-to-br ${color} rounded-2xl mx-auto mb-4 flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                        <IconComponent className="h-12 w-12" />
                      </div>
                      <h3 className="text-center text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {platform.displayName}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
