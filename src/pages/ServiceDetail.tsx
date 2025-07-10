
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ConsultationDialog } from '@/components/ConsultationDialog';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, CheckCircle, Star, Users, TrendingUp, Palette, Globe, Tv, Facebook, Heart, UserPlus, Eye, Search } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string | null;
  category: string;
  platform: string | null;
  icon: string | null;
  active: boolean;
  order_index: number;
  price: number | null;
}

const iconMap: Record<string, any> = {
  Users, Search, TrendingUp, Palette, Globe, Tv, Facebook, Heart, UserPlus, Eye
};

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchService();
    }
  }, [id]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setService(data);
    } catch (error) {
      console.error('Error fetching service:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Xidmət məlumatları yüklənir...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Xidmət tapılmadı</h1>
            <Link to="/" className="text-primary hover:underline">
              Ana səhifəyə qayıt
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const IconComponent = iconMap[service.icon || 'Users'];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb */}
      <section className="py-6 border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Ana səhifə</Link>
            <span>/</span>
            <Link to="/#services" className="hover:text-primary transition-colors">Xidmətlər</Link>
            <span>/</span>
            <span className="text-foreground">{service.name}</span>
          </div>
        </div>
      </section>

      {/* Service Header */}
      <section className="py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-primary to-purple-600 text-primary-foreground p-4 rounded-2xl shadow-lg">
                <IconComponent className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{service.name}</h1>
            <p className="text-xl text-muted-foreground mb-6">
              {service.description || 'Peşəkar xidmətimizlə biznesinizi inkişaf etdirin'}
            </p>
            <div className="flex justify-center space-x-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                Əsas Xidmət
              </Badge>
              {service.price && (
                <Badge variant="outline" className="border-green-500/20 text-green-600">
                  ${service.price}-dan başlayır
                </Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Service Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Service Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Xidmət Haqqında</CardTitle>
                  <CardDescription>
                    Bu xidmətimizin təfərrüatlı məlumatları
                  </CardDescription>
                </CardHeader>
                <CardContent className="prose prose-slate max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description || `${service.name} xidməti ilə bağlı ətraflı məlumatlar tezliklə əlavə ediləcək. Bu xidmətimiz sizin ehtiyaclarınıza uyğun olaraq hazırlanmışdır və peşəkar komandamız tərəfindən həyata keçirilir.`}
                  </p>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle>Nə təklif edirik?</CardTitle>
                  <CardDescription>
                    Bu xidmətin əsas üstünlükləri
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Peşəkar yanaşma</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Sürətli həyata keçirmə</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>24/7 dəstək</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Keyfiyyət zəmanəti</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Əlverişli qiymət</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Nəticə zəmanəti</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Contact Card */}
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Məsləhət almağa hazırsınız?</CardTitle>
                  <CardDescription>
                    Bizimlə əlaqə saxlayın və layihənizi müzakirə edək
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ConsultationDialog serviceName={service.name}>
                    <Button className="w-full" size="lg">
                      Məsləhət Alın
                    </Button>
                  </ConsultationDialog>
                  
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Pulsuz məsləhət</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-blue-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Sürətli cavab</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-purple-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Fərdi yanaşma</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rating Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Müştəri Məmnuniyyəti</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                    <span className="text-sm font-medium">4.9</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    500+ məmnun müştəri
                  </p>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServiceDetail;
