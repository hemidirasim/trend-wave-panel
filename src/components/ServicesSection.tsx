
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Target, Users, Search, TrendingUp, PenTool, Code, Tv, Facebook, Heart, UserPlus, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ConsultationDialog } from '@/components/ConsultationDialog';
import { supabase } from '@/integrations/supabase/client';

interface Service {
  id: string;
  name: string;
  description: string | null;
  category: string;
  platform: string | null;
  icon: string | null;
  active: boolean;
  order_index: number;
}

const iconMap: Record<string, any> = {
  Users, Search, TrendingUp, PenTool, Code, Tv, Facebook, Heart, UserPlus, Eye
};

export const ServicesSection = () => {
  const [dynamicServices, setDynamicServices] = useState<Service[]>([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('active', true)
        .eq('category', 'standard')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setDynamicServices((data || []) as Service[]);
    } catch (error) {
      console.error('Error fetching services:', error);
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
            Platform Mütəxəssisliyi
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Əsas Xidmətlərimiz
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Biznesinizi böyütmək üçün tam spektrli reklam və marketinq həlləri
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {dynamicServices.map((service, index) => {
            const IconComponent = iconMap[service.icon || 'Users'];
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
              <Link key={service.id} to={`/service/${service.id}`}>
                <Card className="bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 cursor-pointer group border border-primary/10 hover:border-primary/20 hover:scale-105">
                  <CardHeader className="text-center pb-4">
                    <div className={`w-20 h-20 bg-gradient-to-br ${color} rounded-2xl mx-auto mb-4 flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                      {IconComponent && <IconComponent className="h-8 w-8" />}
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground">{service.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
