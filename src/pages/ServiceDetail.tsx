
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ConsultationDialog } from '@/components/ConsultationDialog';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, CheckCircle, Star, Users, TrendingUp, Palette, Globe, Tv, Facebook, Heart, UserPlus, Eye, Search, Clock, Shield, Award, Zap } from 'lucide-react';
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

  // Get service-specific features based on category
  const getServiceFeatures = () => {
    if (service.category === 'social_media') {
      return [
        { icon: Shield, title: 'Təhlükəsiz', description: 'Platform qaydalarına tam uyğun' },
        { icon: Zap, title: 'Sürətli', description: '24-48 saat ərzində başlanğıc' },
        { icon: Award, title: 'Keyfiyyətli', description: 'Real və aktiv hesablar' },
        { icon: Clock, title: 'Davamlı', description: 'Uzunmüddətli stabil nəticə' },
      ];
    } else {
      return [
        { icon: Award, title: 'Peşəkar yanaşma', description: 'Təcrübəli mütəxəssis komandası' },
        { icon: Zap, title: 'Sürətli həyata keçirmə', description: 'Optimal vaxt çərçivəsində' },
        { icon: Shield, title: '24/7 dəstək', description: 'Daimi texniki dəstək' },
        { icon: TrendingUp, title: 'Nəticə zəmanəti', description: 'Ölçülə bilən nəticələr' },
      ];
    }
  };

  const features = getServiceFeatures();

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
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-full blur-2xl"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-gradient-to-r from-primary to-purple-600 text-primary-foreground p-6 rounded-3xl shadow-xl">
                <IconComponent className="h-16 w-16" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {service.name}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              {service.description || 'Peşəkar xidmətimizlə biznesinizi inkişaf etdirin'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm">
                {service.category === 'social_media' ? 'Sosial Media Xidməti' : 'Əsas Xidmət'}
              </Badge>
              {service.price && (
                <Badge variant="outline" className="border-green-500/20 text-green-600 px-4 py-2 text-sm">
                  ${service.price}-dan başlayır
                </Badge>
              )}
              {service.platform && (
                <Badge variant="outline" className="border-blue-500/20 text-blue-600 px-4 py-2 text-sm">
                  {service.platform}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Service Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Service Description */}
              <Card className="bg-white/50 backdrop-blur-sm border border-primary/10">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                    Xidmət Haqqında
                  </CardTitle>
                  <CardDescription className="text-base">
                    Bu xidmətimizin təfərrüatlı məlumatları
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {service.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Features Grid */}
              <Card className="bg-white/50 backdrop-blur-sm border border-primary/10">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <div className="h-2 w-2 bg-secondary rounded-full"></div>
                    Nə təklif edirik?
                  </CardTitle>
                  <CardDescription className="text-base">
                    Bu xidmətin əsas üstünlükləri
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <feature.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg mb-1">{feature.title}</h4>
                          <p className="text-muted-foreground text-sm">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Process Steps */}
              <Card className="bg-white/50 backdrop-blur-sm border border-primary/10">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <div className="h-2 w-2 bg-accent rounded-full"></div>
                    Necə işləyir?
                  </CardTitle>
                  <CardDescription className="text-base">
                    Xidmət prosesinin addımları
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">1</div>
                      <div>
                        <h4 className="font-semibold mb-1">Məsləhət və Analiz</h4>
                        <p className="text-muted-foreground text-sm">Sizinlə əlaqə saxlayır və ehtiyaclarınızı müəyyən edirik</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="bg-secondary text-secondary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">2</div>
                      <div>
                        <h4 className="font-semibold mb-1">Strategiya Hazırlanması</h4>
                        <p className="text-muted-foreground text-sm">Xüsusi strategiya və plan hazırlayırıq</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="bg-accent text-accent-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">3</div>
                      <div>
                        <h4 className="font-semibold mb-1">Həyata Keçirmə</h4>
                        <p className="text-muted-foreground text-sm">Peşəkar komandamız planı icra edir</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">4</div>
                      <div>
                        <h4 className="font-semibold mb-1">Nəticə və Dəstək</h4>
                        <p className="text-muted-foreground text-sm">Nəticələri təqdim edir və davamlı dəstək veririk</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              
              {/* Contact Card */}
              <Card className="sticky top-4 bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
                <CardHeader>
                  <CardTitle className="text-xl">Məsləhət almağa hazırsınız?</CardTitle>
                  <CardDescription>
                    Bizimlə əlaqə saxlayın və layihənizi müzakirə edək
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ConsultationDialog serviceName={service.name}>
                    <Button className="w-full" size="lg">
                      Pulsuz Məsləhət Alın
                    </Button>
                  </ConsultationDialog>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-sm">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-700 font-medium">Pulsuz məsləhət</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <span className="text-blue-700 font-medium">Sürətli cavab</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <CheckCircle className="h-5 w-5 text-purple-600" />
                      <span className="text-purple-700 font-medium">Fərdi yanaşma</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <CheckCircle className="h-5 w-5 text-orange-600" />
                      <span className="text-orange-700 font-medium">Peşəkar komanda</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rating Card */}
              <Card className="bg-white/50 backdrop-blur-sm border border-primary/10">
                <CardHeader>
                  <CardTitle className="text-lg">Müştəri Məmnuniyyəti</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="flex justify-center space-x-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                    <div className="text-3xl font-bold text-primary">4.9</div>
                    <p className="text-sm text-muted-foreground">
                      500+ məmnun müştəri
                    </p>
                    <div className="text-xs text-muted-foreground">
                      "Peşəkar və keyfiyyətli xidmət"
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-white/50 backdrop-blur-sm border border-primary/10">
                <CardHeader>
                  <CardTitle className="text-lg">Statistika</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Tamamlanmış layihə</span>
                      <span className="font-bold text-primary">1000+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Məmnun müştəri</span>
                      <span className="font-bold text-secondary">500+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Təcrübə</span>
                      <span className="font-bold text-accent">5+ il</span>
                    </div>
                  </div>
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
